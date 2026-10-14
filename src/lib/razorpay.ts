import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getWorkshopSettings, getCachedWorkshopSettings } from './db';
import { WorkshopSettings } from './types';

export interface RazorpayCredentials {
  key_id: string;
  key_secret: string;
  webhook_secret: string;
  env: 'test' | 'production';
  isConfigured: boolean;
}

export async function getRazorpayCredentials(providedSettings?: WorkshopSettings): Promise<RazorpayCredentials> {
  const settings = providedSettings || (await getWorkshopSettings());
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
  const env = (settings.razorpay_env as 'test' | 'production') || (key_id.startsWith('rzp_live') ? 'production' : 'test');

  const isConfigured = Boolean(key_id && key_secret && key_id !== 'rzp_test_placeholder');

  return {
    key_id,
    key_secret,
    webhook_secret,
    env,
    isConfigured,
  };
}

export function getSyncRazorpayCredentials(providedSettings?: WorkshopSettings): RazorpayCredentials {
  const settings = providedSettings || getCachedWorkshopSettings();
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
  const env = (settings.razorpay_env as 'test' | 'production') || (key_id.startsWith('rzp_live') ? 'production' : 'test');

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
  const creds = await getRazorpayCredentials();

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
      console.error('Razorpay API order creation failed:', error);
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
    keyId: creds.key_id || 'rzp_test_placeholder',
    env: 'test' as const,
  };
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  customSecret?: string
): Promise<boolean> {
  // Handle sandbox simulated payments
  if (orderId.startsWith('order_test_')) {
    return signature === `simulated_sig_${orderId}`;
  }

  const secret = customSecret || (await getRazorpayCredentials()).key_secret;

  if (!secret) {
    return false;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
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

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  providedSecret?: string
): Promise<boolean> {
  const creds = await getRazorpayCredentials();
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

export async function getRazorpayKeyId(): Promise<string> {
  const creds = await getRazorpayCredentials();
  return creds.key_id || 'rzp_test_placeholder';
}
