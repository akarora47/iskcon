import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(_, context) {
  const { id } = await context.params;
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { name, name_hi, icon, date, month, year, category, description, description_hi, featured, active, show_popup } = body;
    // Only one popup at a time — clear others before setting this one
    if (show_popup) await pool.query('UPDATE events SET show_popup = 0 WHERE id != ?', [id]);
    await pool.query(
      'UPDATE events SET name=?,name_hi=?,icon=?,date=?,month=?,year=?,category=?,description=?,description_hi=?,featured=?,active=?,show_popup=? WHERE id=?',
      [name, name_hi, icon, date, month, year, category, description, description_hi, featured?1:0, active?1:0, show_popup?1:0, id]
    );
    return NextResponse.json({ message: 'Updated' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
