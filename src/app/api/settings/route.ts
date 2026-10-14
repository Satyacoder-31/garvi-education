import { NextResponse } from 'next/server';
import { getWorkshopSettings } from '@/lib/db';
import { getRazorpayCredentials } from '@/lib/razorpay';

export async function GET() {
  try {
    const settings = await getWorkshopSettings();
    const creds = await getRazorpayCredentials(settings);

    // Only expose public safe properties (NEVER secrets)
    const publicSettings = {
      workshop_title: settings.workshop_title,
      workshop_date: settings.workshop_date,
      workshop_time: settings.workshop_time,
      duration: settings.duration,
      price: settings.price || 199,
      max_seats: settings.max_seats || 75,
      whatsapp_group_link: settings.whatsapp_group_link,
      preview_video_url: settings.preview_video_url,
      instructor_name: settings.instructor_name,
      instructor_role: settings.instructor_role,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      meta_pixel_id: settings.meta_pixel_id,
      hero_headline: settings.hero_headline || 'Transform the Way You Manage Your School.',
      hero_subheadline: settings.hero_subheadline || 'Join our practical online workshop to explore smarter approaches to school administration, student records, fee management, attendance, and everyday school operations.',
      hero_badge: settings.hero_badge || 'GARVI EDUCATION PRESENTS | Online Workshop',
      announcement_text: settings.announcement_text || 'Online School Management Workshop',
      whatsapp_support_number: settings.whatsapp_support_number || '9425100000',
      razorpay_env: creds.env,
      razorpay_key_id: creds.key_id || 'rzp_test_placeholder',
      is_payment_live: creds.isConfigured && creds.env === 'production',
    };

    return NextResponse.json({ settings: publicSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
