import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM life_membership_donations ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
