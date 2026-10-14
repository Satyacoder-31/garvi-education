import crypto from 'crypto';

const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';

function hashSha256(value: string): string {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export interface MetaCapiEventParams {
  eventName: 'PageView' | 'ViewContent' | 'Lead' | 'InitiateCheckout' | 'Purchase';
  eventId: string; // for deduplication with browser pixel
  eventSourceUrl?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    order_id?: string;
  };
}

export async function sendMetaCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: MetaCapiEventParams) {
  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    console.log(`[Meta CAPI Simulation]
    Event: ${eventName}
    Event ID: ${eventId}
    Value: ${customData?.value ?? 0} ${customData?.currency ?? 'INR'}
    User: ${userData.email ? hashSha256(userData.email).substring(0, 8) + '...' : 'none'}
    Status: Simulated (Configure META_PIXEL_ID and META_CAPI_ACCESS_TOKEN in .env for live Meta Conversions API)`);
    return { success: true, simulated: true };
  }

  try {
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl || 'https://garvieducation.com',
          action_source: 'website',
          user_data: {
            em: userData.email ? [hashSha256(userData.email)] : undefined,
            ph: userData.phone ? [hashSha256(userData.phone.replace(/\D/g, ''))] : undefined,
            fn: userData.firstName ? [hashSha256(userData.firstName)] : undefined,
            client_ip_address: userData.clientIpAddress,
            client_user_agent: userData.clientUserAgent,
          },
          custom_data: customData,
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return { success: response.ok, result };
  } catch (error: any) {
    console.error('Meta CAPI error:', error);
    return { success: false, error: error.message };
  }
}
