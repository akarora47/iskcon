import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { title, title_hi, icon, price, price_amount, description, description_hi, features, image, popular, active } = body;
    await pool.query(
      'UPDATE rooms SET title=?,title_hi=?,icon=?,price=?,price_amount=?,description=?,description_hi=?,features=?,image=?,popular=?,active=? WHERE id=?',
      [title, title_hi, icon, price, price_amount, description, description_hi, JSON.stringify(features||[]), image, popular?1:0, active?1:0, id]
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
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
