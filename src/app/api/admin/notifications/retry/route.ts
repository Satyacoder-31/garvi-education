import { NextRequest, NextResponse } from 'next/server';
import { getRegistrationById, getWorkshopSettings } from '@/lib/db';
import { sendWhatsAppConfirmation } from '@/lib/aisensy';
import { sendEmailConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { registrationId, channel } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required.' }, { status: 400 });
    }

    const reg = getRegistrationById(registrationId);
    if (!reg) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    const settings = getWorkshopSettings();

    if (channel === 'whatsapp' || !channel) {
      await sendWhatsAppConfirmation({
        registrationId: reg.registration_id,
        fullName: reg.full_name,
        mobile: reg.mobile,
        workshopDate: settings.workshop_date,
        workshopTime: settings.workshop_time,
        whatsappGroupLink: settings.whatsapp_group_link,
      });
    }

    if (channel === 'email' || !channel) {
      await sendEmailConfirmation({
        registrationId: reg.registration_id,
        fullName: reg.full_name,
        email: reg.email,
        schoolName: reg.school_name,
        workshopDate: settings.workshop_date,
        workshopTime: settings.workshop_time,
        duration: settings.duration,
        whatsappGroupLink: settings.whatsapp_group_link,
        amount: reg.amount,
      });
    }

    return NextResponse.json({ success: true, message: `Notification resent to ${channel || 'all channels'}.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
