import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

export const isRazorpayConfigured = Boolean(key_id && key_secret);

let razorpayInstance: Razorpay | null = null;

if (isRazorpayConfigured) {
  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });
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
  // If real Razorpay keys are configured, use the official SDK
  if (razorpayInstance) {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt,
      notes,
    };
    const order = await razorpayInstance.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      isSandbox: false,
    };
  }

  // Graceful test/sandbox simulation mode when keys are not yet provided
  // This allows the full funnel to be tested end-to-end out-of-the-box
  const sandboxOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: sandboxOrderId,
    amount: Math.round(amount * 100),
    currency,
    receipt,
    isSandbox: true,
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

  if (!key_secret) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature, 'utf-8'),
    Buffer.from(signature, 'utf-8')
  );
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(signature, 'utf-8')
  );
}

export function getRazorpayKeyId(): string {
  return key_id || 'rzp_test_placeholder';
}
