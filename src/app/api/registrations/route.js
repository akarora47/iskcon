import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendRegistrationEmails } from '@/lib/email';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await pool.query(`
      SELECT er.*, e.name as event_display_name
      FROM event_registrations er
      LEFT JOIN events e ON er.event_id = e.id
      ORDER BY er.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { event_id, event_name, first_name, last_name, email, phone, attendees, city, special_requests } = body;
    await pool.query(
      'INSERT INTO event_registrations (event_id,event_name,first_name,last_name,email,phone,attendees,city,special_requests) VALUES (?,?,?,?,?,?,?,?,?)',
      [event_id||null, event_name, first_name, last_name||'', email, phone, attendees||1, city||'', special_requests||'']
    );
    // Send confirmation emails (non-blocking)
    if (email) {
      sendRegistrationEmails({ first_name, last_name, email, phone, event_name, attendees, city, special_requests }).catch(console.error);
    }
    return NextResponse.json({ message: 'Registration successful!' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
