import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!rows.length) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: admin.id, username: admin.username, name: admin.name });
    const res = NextResponse.json({ message: 'Login successful', name: admin.name });
    res.cookies.set('admin_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
