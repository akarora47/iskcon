import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Public: fetch the active popup (no auth required)
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM event_popup WHERE enabled = 1 ORDER BY updated_at DESC LIMIT 1'
    );
    if (!rows.length) return NextResponse.json(null);
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
