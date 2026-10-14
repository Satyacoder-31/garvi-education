import { NextRequest, NextResponse } from 'next/server';
import {
  getRegistrationByOrderId,
  getRegistrationById,
  updateRegistrationPaymentSuccess,
  updateRegistrationStatus,
  getWorkshopSettings,
  recordAnalyticsEvent,
} from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { sendWhatsAppConfirmation } from '@/lib/aisensy';
import { sendEmailConfirmation } from '@/lib/email';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // If webhook secret is configured, enforce strict signature verification
    if (WEBHOOK_SECRET) {
      if (!signature || !verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
        return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const notesRegistrationId = paymentEntity?.notes?.registration_id || orderEntity?.notes?.registration_id;

    if (!orderId && !notesRegistrationId) {
      return NextResponse.json({ message: 'No recognizable order or registration id.' }, { status: 200 });
    }

    let registration = notesRegistrationId
      ? getRegistrationById(notesRegistrationId)
      : (orderId ? getRegistrationByOrderId(orderId) : null);

    if (!registration) {
      return NextResponse.json({ message: 'Registration record not matched in database.' }, { status: 200 });
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      // Idempotency check: don't re-trigger if already confirmed
      if (registration.status !== 'registration_confirmed' && registration.status !== 'paid') {
        const confirmedRegistration = updateRegistrationPaymentSuccess(
          registration.registration_id,
          paymentId || 'webhook_captured',
          signature || 'webhook_verified'
        );

        const settings = getWorkshopSettings();

        // Trigger WhatsApp
        sendWhatsAppConfirmation({
          registrationId: confirmedRegistration.registration_id,
          fullName: confirmedRegistration.full_name,
          mobile: confirmedRegistration.mobile,
          workshopDate: settings.workshop_date,
          workshopTime: settings.workshop_time,
          whatsappGroupLink: settings.whatsapp_group_link,
        }).catch(console.error);

        // Trigger Email
        sendEmailConfirmation({
          registrationId: confirmedRegistration.registration_id,
          fullName: confirmedRegistration.full_name,
          email: confirmedRegistration.email,
          schoolName: confirmedRegistration.school_name,
          workshopDate: settings.workshop_date,
          workshopTime: settings.workshop_time,
          duration: settings.duration,
          whatsappGroupLink: settings.whatsapp_group_link,
          amount: confirmedRegistration.amount,
        }).catch(console.error);

        // Record event
        recordAnalyticsEvent('webhook_payment_captured', confirmedRegistration.registration_id);

        // Send CAPI
        sendMetaCapiEvent({
          eventName: 'Purchase',
          eventId: `purchase_${confirmedRegistration.registration_id}`,
          userData: {
            email: confirmedRegistration.email,
            phone: confirmedRegistration.mobile,
            firstName: confirmedRegistration.full_name.split(' ')[0],
          },
          customData: {
            currency: 'INR',
            value: confirmedRegistration.amount,
            order_id: confirmedRegistration.registration_id,
          },
        }).catch(console.error);
      }
    } else if (event === 'payment.failed') {
      if (registration.status !== 'registration_confirmed') {
        updateRegistrationStatus(registration.registration_id, 'payment_failed');
        recordAnalyticsEvent('webhook_payment_failed', registration.registration_id);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
