import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });

    const [rows] = await pool.query(
      'SELECT * FROM admin_otp WHERE email = ? AND otp = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email.toLowerCase().trim(), otp.trim()]
    );

    if (!rows.length) return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });

    return NextResponse.json({ message: 'OTP verified', valid: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
