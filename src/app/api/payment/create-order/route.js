import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

// POST /api/payment/create-order
// Body: { amount (in rupees), currency?, notes? }
export async function POST(req) {
  try {
    const { amount, currency = 'INR', notes = {} } = await req.json();
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount:   Math.round(Number(amount) * 100), // Razorpay takes paise
      currency,
      receipt:  `rcpt_${Date.now()}`,
      notes,
    });

    return NextResponse.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error('[Razorpay create-order]', e);
    return NextResponse.json({ error: e.message || 'Payment gateway error' }, { status: 500 });
  }
}
