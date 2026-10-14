import { logNotification } from './db';

const AISENSY_API_KEY = process.env.AISENSY_API_KEY || '';
const AISENSY_CAMPAIGN_NAME = process.env.AISENSY_CAMPAIGN_NAME || 'garvi_workshop_confirmation';
const AISENSY_REMINDER_CAMPAIGN = process.env.AISENSY_REMINDER_CAMPAIGN || 'garvi_workshop_reminder';

/**
 * Normalizes phone numbers to standard E.164 Indian format (+91XXXXXXXXXX)
 */
export function normalizeIndianPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+${digits}`;
}

export interface SendWhatsAppConfirmationParams {
  registrationId: string;
  fullName: string;
  mobile: string;
  workshopDate: string;
  workshopTime: string;
  whatsappGroupLink: string;
}

export async function sendWhatsAppConfirmation({
  registrationId,
  fullName,
  mobile,
  workshopDate,
  workshopTime,
  whatsappGroupLink,
}: SendWhatsAppConfirmationParams) {
  const destination = normalizeIndianPhoneNumber(mobile);

  if (!AISENSY_API_KEY) {
    console.log(`[AiSensy WhatsApp Simulation]
    To: ${destination} (${fullName})
    Template: ${AISENSY_CAMPAIGN_NAME}
    Registration ID: ${registrationId}
    Date: ${workshopDate} at ${workshopTime}
    Group: ${whatsappGroupLink}
    Status: Simulated Sent (Set AISENSY_API_KEY in .env for live WhatsApp delivery)`);

    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: AISENSY_CAMPAIGN_NAME,
      recipient: destination,
      status: 'sent',
      error_message: 'Simulated mode (live credentials pending)',
    });

    return { success: true, simulated: true };
  }

  try {
    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: AISENSY_CAMPAIGN_NAME,
      destination,
      userName: fullName,
      templateParams: [
        fullName,
        registrationId,
        workshopDate,
        workshopTime,
        whatsappGroupLink,
      ],
      source: 'garvi_website_funnel',
    };

    const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new Error(data.message || `AiSensy API returned status ${response.status}`);
    }

    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: AISENSY_CAMPAIGN_NAME,
      recipient: destination,
      status: 'sent',
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('AiSensy WhatsApp send failed:', error);
    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: AISENSY_CAMPAIGN_NAME,
      recipient: destination,
      status: 'failed',
      error_message: error.message || 'Unknown error',
    });
    return { success: false, error: error.message };
  }
}

export interface SendWhatsAppReminderParams {
  registrationId: string;
  fullName: string;
  mobile: string;
  workshopDate: string;
  workshopTime: string;
  reminderType: '1_day_before' | '1_hour_before';
  whatsappGroupLink: string;
}

export async function sendWhatsAppReminder({
  registrationId,
  fullName,
  mobile,
  workshopDate,
  workshopTime,
  reminderType,
  whatsappGroupLink,
}: SendWhatsAppReminderParams) {
  const destination = normalizeIndianPhoneNumber(mobile);
  const template = `${AISENSY_REMINDER_CAMPAIGN}_${reminderType}`;

  if (!AISENSY_API_KEY) {
    console.log(`[AiSensy Reminder Simulation - ${reminderType}] To: ${destination}, Reg: ${registrationId}`);
    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: template,
      recipient: destination,
      status: 'sent',
      error_message: 'Simulated reminder (live credentials pending)',
    });
    return { success: true, simulated: true };
  }

  try {
    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: template,
      destination,
      userName: fullName,
      templateParams: [fullName, registrationId, workshopDate, workshopTime, whatsappGroupLink],
      source: 'garvi_reminder_cron',
    };

    const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: template,
      recipient: destination,
      status: response.ok ? 'sent' : 'failed',
      error_message: !response.ok ? JSON.stringify(data) : undefined,
    });
    return { success: response.ok, data };
  } catch (error: any) {
    logNotification({
      registration_id: registrationId,
      channel: 'whatsapp',
      template_name: template,
      recipient: destination,
      status: 'failed',
      error_message: error.message,
    });
    return { success: false, error: error.message };
  }
}
