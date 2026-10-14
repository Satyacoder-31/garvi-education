import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, school, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!mobile || typeof mobile !== 'string' || mobile.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const entry = createContactMessage({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      school: school ? school.trim() : 'Not provided',
      message: message ? message.trim() : 'No specific message provided.',
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our team will contact you shortly.',
      id: entry.id,
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit contact message.' }, { status: 500 });
  }
}
