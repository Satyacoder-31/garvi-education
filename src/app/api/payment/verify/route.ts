import { NextRequest, NextResponse } from 'next/server';
import {
  getRegistrationById,
  getRegistrationByOrderId,
  updateRegistrationPaymentSuccess,
  updateRegistrationStatus,
  getWorkshopSettings,
  recordAnalyticsEvent,
} from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendWhatsAppConfirmation } from '@/lib/aisensy';
import { sendEmailConfirmation } from '@/lib/email';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registration_id,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters.' },
        { status: 400 }
      );
    }

    // Lookup registration by registration_id or order_id
    let registration = registration_id
      ? getRegistrationById(registration_id)
      : getRegistrationByOrderId(razorpay_order_id);

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration record not found for this transaction.' },
        { status: 404 }
      );
    }

    // Idempotency: if already confirmed, return success immediately
    if (registration.status === 'registration_confirmed' || registration.status === 'paid') {
      return NextResponse.json({
        success: true,
        verified: true,
        alreadyProcessed: true,
        registrationId: registration.registration_id,
        redirectUrl: `/thank-you?regId=${registration.registration_id}`,
      });
    }

    // Server-side HMAC SHA256 Signature Verification
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      updateRegistrationStatus(registration.registration_id, 'payment_failed');
      recordAnalyticsEvent('payment_failed', registration.registration_id);
      return NextResponse.json(
        { error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }

    // Mark registration as confirmed in DB
    const confirmedRegistration = updateRegistrationPaymentSuccess(
      registration.registration_id,
      razorpay_payment_id,
      razorpay_signature
    );

    const settings = getWorkshopSettings();

    // Trigger AiSensy WhatsApp Automation
    sendWhatsAppConfirmation({
      registrationId: confirmedRegistration.registration_id,
      fullName: confirmedRegistration.full_name,
      mobile: confirmedRegistration.mobile,
      workshopDate: settings.workshop_date,
      workshopTime: settings.workshop_time,
      whatsappGroupLink: settings.whatsapp_group_link,
    }).catch((err) => console.error('Background WhatsApp trigger error:', err));

    // Trigger Email Confirmation
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
    }).catch((err) => console.error('Background Email trigger error:', err));

    // Record internal analytics event
    recordAnalyticsEvent(
      'purchase_verified',
      confirmedRegistration.registration_id,
      confirmedRegistration.utm_source,
      confirmedRegistration.utm_campaign
    );

    // Trigger Meta Conversions API (CAPI) Purchase Event
    sendMetaCapiEvent({
      eventName: 'Purchase',
      eventId: `purchase_${confirmedRegistration.registration_id}`,
      eventSourceUrl: req.headers.get('referer') || 'https://garvieducation.com',
      userData: {
        email: confirmedRegistration.email,
        phone: confirmedRegistration.mobile,
        firstName: confirmedRegistration.full_name.split(' ')[0],
        clientIpAddress:
          req.headers.get('x-forwarded-for')?.split(',')[0] ||
          req.headers.get('x-real-ip') ||
          undefined,
        clientUserAgent: req.headers.get('user-agent') || undefined,
      },
      customData: {
        currency: 'INR',
        value: confirmedRegistration.amount,
        content_name: 'Online School Management Workshop',
        content_category: 'Workshop Registration',
        order_id: confirmedRegistration.registration_id,
      },
    }).catch((err) => console.error('Meta CAPI Purchase error:', err));

    return NextResponse.json({
      success: true,
      verified: true,
      registrationId: confirmedRegistration.registration_id,
      redirectUrl: `/thank-you?regId=${confirmedRegistration.registration_id}`,
    });
  } catch (error: any) {
    console.error('Payment verification handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error verifying payment.' },
      { status: 500 }
    );
  }
}
