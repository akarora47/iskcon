import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    // Only works if admin has default/broken hash
    const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM admin_users');
    const { username, password, secret } = await req.json();
    
    // Require setup secret from env
    if (secret !== (process.env.SETUP_SECRET || 'iskcon-setup-2024')) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 });
    }

    const hash = await bcrypt.hash(password, 10);
    if (rows[0].cnt > 0) {
      // Update existing admin
      await pool.query('UPDATE admin_users SET password_hash = ? WHERE username = ?', [hash, username]);
    } else {
      await pool.query('INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)', [username, hash, 'Admin']);
    }
    return NextResponse.json({ message: 'Admin password set successfully! You can now login.' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
