import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { status } = await req.json();
    await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
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
    await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
