import { NextRequest, NextResponse } from 'next/server';
import { createRegistration, getWorkshopSettings, recordAnalyticsEvent } from '@/lib/db';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';
import { normalizeIndianPhoneNumber } from '@/lib/aisensy';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      mobile,
      email,
      schoolName,
      city,
      role,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = body;

    // Strict input validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 });
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your school or institution name.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json({ error: 'Please specify your city or district.' }, { status: 400 });
    }

    const settings = getWorkshopSettings();
    const amount = settings.price || 199;
    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const registrationId = `GARVI-${year}-${randomSuffix}`;

    // Create order with payment gateway
    const order = await createRazorpayOrder({
      amount,
      currency: 'INR',
      receipt: registrationId,
      notes: {
        registration_id: registrationId,
        school_name: schoolName.trim(),
        full_name: fullName.trim(),
      },
    });

    // Save initial registration record as pending_payment
    const registration = createRegistration({
      registration_id: registrationId,
      full_name: fullName.trim(),
      mobile: normalizeIndianPhoneNumber(mobile),
      email: email.trim().toLowerCase(),
      school_name: schoolName.trim(),
      city: city.trim(),
      role: role ? role.trim() : 'School Administrator',
      amount,
      razorpay_order_id: order.id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    });

    // Record internal analytics
    recordAnalyticsEvent('lead_submitted', registrationId, utm_source, utm_campaign);

    // Track Meta CAPI Lead Event
    sendMetaCapiEvent({
      eventName: 'Lead',
      eventId: `lead_${registrationId}`,
      eventSourceUrl: req.headers.get('referer') || 'https://garvieducation.com',
      userData: {
        email: email.trim().toLowerCase(),
        phone: mobile,
        firstName: fullName.trim().split(' ')[0],
        clientIpAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || undefined,
        clientUserAgent: req.headers.get('user-agent') || undefined,
      },
      customData: {
        content_name: 'Online School Management Workshop',
        content_category: 'Workshop Registration',
      },
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      registrationId: registration.registration_id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      isSandbox: order.isSandbox,
      participant: {
        name: registration.full_name,
        email: registration.email,
        mobile: registration.mobile,
      },
    });
  } catch (error: any) {
    console.error('Registration order error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while initiating registration.' },
      { status: 500 }
    );
  }
}
