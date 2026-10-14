import { NextRequest, NextResponse } from 'next/server';
import { db, getWorkshopSettings } from '@/lib/db';
import { sendWhatsAppReminder } from '@/lib/aisensy';
import { Registration } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') as '1_day_before' | '1_hour_before') || '1_day_before';

    const settings = getWorkshopSettings();

    // Fetch verified confirmed registrations
    const confirmedParticipants = db.prepare(`
      SELECT * FROM registrations WHERE status IN ('registration_confirmed', 'paid')
    `).all() as Registration[];

    const results = [];

    for (const participant of confirmedParticipants) {
      // Check if reminder already logged to ensure idempotency
      const alreadySent = db.prepare(`
        SELECT id FROM notifications_log
        WHERE registration_id = ? AND template_name LIKE ? AND status = 'sent'
      `).get(participant.registration_id, `%${type}%`);

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
