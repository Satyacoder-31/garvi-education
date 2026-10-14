import { logNotification } from './db';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Garvi Education <workshops@garvieducation.com>';

export interface SendEmailConfirmationParams {
  registrationId: string;
  fullName: string;
  email: string;
  schoolName: string;
  workshopDate: string;
  workshopTime: string;
  duration: string;
  whatsappGroupLink: string;
  amount: number;
}

export function generateConfirmationEmailHtml(params: SendEmailConfirmationParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workshop Registration Confirmed - Garvi Education</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background-color: #0a192f; padding: 32px 24px; text-align: center; border-bottom: 3px solid #2563eb;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; font-weight: 700;">GARVI EDUCATION</h1>
      <p style="color: #93c5fd; margin: 6px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Rewa, Madhya Pradesh • Executive School Leadership Series</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <span style="display: inline-block; font-size: 14px; font-weight: 600; color: #065f46;">✓ REGISTRATION CONFIRMED • PAYMENT VERIFIED</span>
      </div>

      <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Namaste, ${params.fullName} Ji!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        We are delighted to confirm your registration for the <strong>Online School Management Workshop</strong> representing <strong>${params.schoolName}</strong>.
      </p>

      <!-- Details Card -->
      <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Registration ID:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0a192f; text-align: right;">${params.registrationId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Date:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${params.workshopDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Time:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${params.workshopTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Format:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">Live Interactive Online Session</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Amount Paid:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #16a34a; text-align: right;">₹${params.amount} (Verified)</td>
          </tr>
        </table>
      </div>

      <!-- Action Button: WhatsApp -->
      <div style="text-align: center; margin: 32px 0;">
        <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 12px;">Next Step: Join the Exclusive Workshop WhatsApp Group</p>
        <a href="${params.whatsappGroupLink}" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.2);">
          Join Workshop WhatsApp Group
        </a>
        <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Access link, meeting credentials, and downloadable resources are shared directly in this group.</p>
      </div>

      <!-- Workshop Focus -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #475569;">
        <p style="font-weight: 600; color: #0f172a; margin-bottom: 8px;">What will be covered:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Structuring student records & digital admissions</li>
          <li>Daily staff and student attendance automation</li>
          <li>Systematic fee collection & pending dues tracking</li>
          <li>Modern parent communication workflows</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 6px;">Garvi Education • Rewa, Madhya Pradesh, India</p>
      <p style="margin: 0;">For inquiries or assistance, write to us at support@garvieducation.com</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export async function sendEmailConfirmation(params: SendEmailConfirmationParams) {
  const htmlContent = generateConfirmationEmailHtml(params);

  if (!RESEND_API_KEY) {
    console.log(`[Email Confirmation Simulation]
    To: ${params.email} (${params.fullName})
    Subject: Workshop Registration Confirmed - ${params.registrationId}
    Status: Simulated Sent (Set RESEND_API_KEY in .env for live email delivery)`);

    logNotification({
      registration_id: params.registrationId,
      channel: 'email',
      template_name: 'workshop_confirmation',
      recipient: params.email,
      status: 'sent',
      error_message: 'Simulated mode (live credentials pending)',
    });

    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.email,
        subject: `Confirmed: Your Online School Management Workshop Registration [${params.registrationId}]`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Resend API returned status ${response.status}`);
    }

    logNotification({
      registration_id: params.registrationId,
      channel: 'email',
      template_name: 'workshop_confirmation',
      recipient: params.email,
      status: 'sent',
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Email confirmation send failed:', error);
    logNotification({
      registration_id: params.registrationId,
      channel: 'email',
      template_name: 'workshop_confirmation',
      recipient: params.email,
      status: 'failed',
      error_message: error.message || 'Unknown error',
    });
    return { success: false, error: error.message };
  }
}
