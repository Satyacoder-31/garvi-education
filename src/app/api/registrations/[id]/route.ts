import { NextRequest, NextResponse } from 'next/server';
import { getRegistrationById, getWorkshopSettings } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Registration ID required.' }, { status: 400 });
    }

    const registration = getRegistrationById(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    const settings = getWorkshopSettings();

    return NextResponse.json({
      registration: {
        registration_id: registration.registration_id,
        full_name: registration.full_name,
        email: registration.email,
        mobile: registration.mobile,
        school_name: registration.school_name,
        city: registration.city,
        role: registration.role,
        amount: registration.amount,
        status: registration.status,
        created_at: registration.created_at,
      },
      workshop: {
        title: settings.workshop_title,
        date: settings.workshop_date,
        time: settings.workshop_time,
        duration: settings.duration,
        whatsapp_group_link: settings.whatsapp_group_link,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
