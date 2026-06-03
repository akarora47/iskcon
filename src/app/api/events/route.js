import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE active = 1 ORDER BY featured DESC, id ASC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { name, name_hi, icon, date, month, year, category, description, description_hi, featured, active, show_popup } = body;
    if (show_popup) await pool.query('UPDATE events SET show_popup = 0');
    const [result] = await pool.query(
      'INSERT INTO events (name,name_hi,icon,date,month,year,category,description,description_hi,featured,active,show_popup) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [name, name_hi, icon||'🎪', date, month, year||'2026', category, description, description_hi, featured?1:0, active?1:0, show_popup?1:0]
    );
    return NextResponse.json({ id: result.insertId, message: 'Event created' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
