import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendAdminOtpEmail } from '@/lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!rows.length) return NextResponse.json({ error: 'No admin account found with this email.' }, { status: 404 });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate old OTPs for this email
    await pool.query('UPDATE admin_otp SET used = 1 WHERE email = ?', [email.toLowerCase().trim()]);

    // Save new OTP
    await pool.query(
      'INSERT INTO admin_otp (email, otp, expires_at) VALUES (?, ?, ?)',
      [email.toLowerCase().trim(), otp, expires]
    );

    // Send email
    await sendAdminOtpEmail({ email: email.toLowerCase().trim(), otp, name: rows[0].name });

    return NextResponse.json({ message: 'OTP sent to your email. Valid for 10 minutes.' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
