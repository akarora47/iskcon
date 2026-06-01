import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { image_url, caption, sort_order } = await req.json();
    if (!image_url) return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    const [r] = await pool.query(
      'INSERT INTO life_membership_gallery (image_url, caption, sort_order) VALUES (?,?,?)',
      [image_url, caption||'', sort_order||0]
    );
    return NextResponse.json({ id: r.insertId });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM life_membership_gallery WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
