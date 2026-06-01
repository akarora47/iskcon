import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const [[row]] = await pool.query('SELECT * FROM temple_donation_settings WHERE project_id = ? LIMIT 1', [projectId]);
    return NextResponse.json(row || null);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const b = await req.json();
    await pool.query(
      `INSERT INTO temple_donation_settings
        (project_id, normal_enabled, normal_min_amount, normal_label, tile_enabled, tile_price, tile_label, tile_description, tile_image)
       VALUES (?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         normal_enabled=VALUES(normal_enabled), normal_min_amount=VALUES(normal_min_amount), normal_label=VALUES(normal_label),
         tile_enabled=VALUES(tile_enabled), tile_price=VALUES(tile_price), tile_label=VALUES(tile_label),
         tile_description=VALUES(tile_description), tile_image=VALUES(tile_image)`,
      [projectId, b.normal_enabled?1:0, b.normal_min_amount||1000, b.normal_label||'Donation',
       b.tile_enabled?1:0, b.tile_price||6000, b.tile_label||'Tiles / Square Donation',
       b.tile_description||null, b.tile_image||null]
    );
    return NextResponse.json({ saved: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
