import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    // Verify OTP again
    const [rows] = await pool.query(
      'SELECT * FROM admin_otp WHERE email = ? AND otp = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email.toLowerCase().trim(), otp.trim()]
    );
    if (!rows.length) return NextResponse.json({ error: 'Invalid or expired OTP. Please start over.' }, { status: 400 });

    // Update password
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE admin_users SET password_hash = ? WHERE email = ?', [hash, email.toLowerCase().trim()]);

    // Mark OTP as used
    await pool.query('UPDATE admin_otp SET used = 1 WHERE id = ?', [rows[0].id]);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
