import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendBookingEmails } from '@/lib/email';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, room_id, room_name, check_in, check_out, guests, special_requests } = body;
    const [result] = await pool.query(
      'INSERT INTO bookings (name,email,phone,room_id,room_name,check_in,check_out,guests,special_requests) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, email, phone, room_id||null, room_name, check_in||null, check_out||null, guests||1, special_requests||'']
    );
    // Send confirmation emails (non-blocking)
    if (email) {
      sendBookingEmails({ name, email, phone, room_name, check_in, check_out, guests, special_requests }).catch(console.error);
    }
    return NextResponse.json({ id: result.insertId, message: 'Booking received!' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
