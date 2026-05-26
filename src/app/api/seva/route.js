import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendDonationEmails } from '@/lib/email';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await pool.query('SELECT * FROM donation_submissions ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { campaign_id, seva_type, full_name, email, phone, amount, message } = body;
    await pool.query(
      'INSERT INTO donation_submissions (campaign_id,seva_type,full_name,email,phone,amount,message) VALUES (?,?,?,?,?,?,?)',
      [campaign_id||null, seva_type, full_name, email, phone, amount||0, message||'']
    );
    // Send confirmation emails (non-blocking)
    if (email) {
      sendDonationEmails({ full_name, email, phone, seva_type, amount, message }).catch(console.error);
    }
    return NextResponse.json({ message: 'Donation received! Hare Krishna 🙏' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
