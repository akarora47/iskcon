import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendContactEmails } from '@/lib/email';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }
    await pool.query(
      'INSERT INTO inquiries (name,email,phone,subject,message) VALUES (?,?,?,?,?)',
      [name, email, phone||'', subject||'General Enquiry', message]
    );
    // Send emails (non-blocking — won't fail the response)
    sendContactEmails({ name, email, phone, subject: subject || 'General Enquiry', message })
      .catch(e => console.error('[Email contact]', e.message));
    return NextResponse.json({ message: 'Message received! We will respond within 24 hours. Hare Krishna 🙏' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
