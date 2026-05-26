import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(_, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await pool.query('DELETE FROM event_registrations WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
