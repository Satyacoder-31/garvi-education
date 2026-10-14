import { NextRequest, NextResponse } from 'next/server';
import { getWorkshopSettings, getConfirmedRegistrations, hasNotificationBeenSent } from '@/lib/db';
import { sendWhatsAppReminder } from '@/lib/aisensy';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') as '1_day_before' | '1_hour_before') || '1_day_before';

    const settings = await getWorkshopSettings();
    const confirmedParticipants = await getConfirmedRegistrations();

    const results = [];

    for (const participant of confirmedParticipants) {
      const alreadySent = await hasNotificationBeenSent(participant.registration_id, type);

      if (!alreadySent) {
        const res = await sendWhatsAppReminder({
          registrationId: participant.registration_id,
          fullName: participant.full_name,
          mobile: participant.mobile,
          workshopDate: settings.workshop_date,
          workshopTime: settings.workshop_time,
          reminderType: type,
          whatsappGroupLink: settings.whatsapp_group_link,
        });
        results.push({ id: participant.registration_id, success: res.success });
      } else {
        results.push({ id: participant.registration_id, skipped: 'Already sent' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: confirmedParticipants.length,
      details: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
