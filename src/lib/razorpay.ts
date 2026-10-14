import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getWorkshopSettings } from './db';

export interface RazorpayCredentials {
  key_id: string;
  key_secret: string;
  webhook_secret: string;
  env: 'test' | 'production';
  isConfigured: boolean;
}

export function getRazorpayCredentials(): RazorpayCredentials {
  const settings = getWorkshopSettings();
  const key_id =
    (settings.razorpay_key_id && settings.razorpay_key_id.trim()) ||
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    '';
  const key_secret =
    (settings.razorpay_key_secret && settings.razorpay_key_secret.trim()) ||
    process.env.RAZORPAY_KEY_SECRET ||
    '';
  const webhook_secret =
    (settings.razorpay_webhook_secret && settings.razorpay_webhook_secret.trim()) ||
    process.env.RAZORPAY_WEBHOOK_SECRET ||
    '';
  const env = settings.razorpay_env || (key_id.startsWith('rzp_live') ? 'production' : 'test');

  const isConfigured = Boolean(key_id && key_secret && key_id !== 'rzp_test_placeholder');

  return {
    key_id,
    key_secret,
    webhook_secret,
    env,
    isConfigured,
  };
}

export interface CreateOrderParams {
  amount: number; // in rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}: CreateOrderParams) {
  const creds = getRazorpayCredentials();

  // If real or test Razorpay keys are configured in admin panel or env, use the official SDK
  if (creds.isConfigured) {
    try {
      const client = new Razorpay({
        key_id: creds.key_id,
        key_secret: creds.key_secret,
      });

      const options = {
        amount: Math.round(amount * 100), // convert rupees to paise
        currency,
        receipt,
        notes,
      };

      const order = await client.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        isSandbox: false,
        keyId: creds.key_id,
        env: creds.env,
      };
    } catch (error: any) {
      console.error('Razorpay API order creation failed, falling back to simulator:', error);
      // If Razorpay API rejects (e.g. invalid test keys provided by user), gracefully inform
      throw new Error(`Razorpay gateway error: ${error.message || 'Failed to create order with Razorpay.'}`);
    }
  }

  // Graceful test/sandbox simulation mode when keys are not yet entered in admin panel
  const sandboxOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: sandboxOrderId,
    amount: Math.round(amount * 100),
    currency,
    receipt,
    isSandbox: true,
    keyId: 'rzp_test_placeholder',
    env: 'test' as const,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  // Handle sandbox simulated payments
  if (orderId.startsWith('order_test_')) {
    return signature === `simulated_sig_${orderId}`;
  }

  const creds = getRazorpayCredentials();

  if (!creds.key_secret) {
    return false;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', creds.key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  providedSecret?: string
): boolean {
  const creds = getRazorpayCredentials();
  const secret = providedSecret || creds.webhook_secret || creds.key_secret;
  if (!secret || !signature) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch {
    return false;
  }
}

export function getRazorpayKeyId(): string {
  const creds = getRazorpayCredentials();
  return creds.key_id || 'rzp_test_placeholder';
}
