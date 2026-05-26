import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { title, title_hi, icon, description, description_hi, goal_amount, raised_amount, image, featured, active } = body;
    await pool.query(
      'UPDATE seva_campaigns SET title=?,title_hi=?,icon=?,description=?,description_hi=?,goal_amount=?,raised_amount=?,image=?,featured=?,active=? WHERE id=?',
      [title, title_hi, icon, description, description_hi, goal_amount, raised_amount, image, featured?1:0, active?1:0, id]
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
    await pool.query('DELETE FROM seva_campaigns WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
