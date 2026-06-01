import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM temple_project_videos WHERE project_id = ? ORDER BY sort_order ASC, id ASC', [projectId]);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const { title, embed_url, thumbnail, sort_order } = await req.json();
    const [result] = await pool.query(
      'INSERT INTO temple_project_videos (project_id, title, embed_url, thumbnail, sort_order) VALUES (?,?,?,?,?)',
      [projectId, title||null, embed_url, thumbnail||null, sort_order||0]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const { id } = await req.json();
    await pool.query('DELETE FROM temple_project_videos WHERE id = ? AND project_id = ?', [id, projectId]);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
