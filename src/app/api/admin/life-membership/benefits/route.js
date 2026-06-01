import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { title, description, icon, image, sort_order } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    const [r] = await pool.query(
      'INSERT INTO life_membership_benefits (title, description, icon, image, sort_order) VALUES (?,?,?,?,?)',
      [title, description||'', icon||'✦', image||'', sort_order||0]
    );
    return NextResponse.json({ id: r.insertId });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(req) {
  try {
    const { id, title, description, icon, image, sort_order } = await req.json();
    await pool.query(
      'UPDATE life_membership_benefits SET title=?, description=?, icon=?, image=?, sort_order=? WHERE id=?',
      [title, description||'', icon||'✦', image||'', sort_order||0, id]
    );
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM life_membership_benefits WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
