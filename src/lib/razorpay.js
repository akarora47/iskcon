import Razorpay from 'razorpay';
import crypto from 'crypto';

// ── Razorpay instance (server-side only) ─────────────────────
export const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ── Verify payment signature ──────────────────────────────────
export function verifySignature({ order_id, payment_id, signature }) {
  const body    = order_id + '|' + payment_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');
  return expected === signature;
}
