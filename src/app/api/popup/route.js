import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Public: fetch the event marked as popup
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE show_popup = 1 AND active = 1 LIMIT 1'
    );
    if (!rows.length) return NextResponse.json(null);
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
