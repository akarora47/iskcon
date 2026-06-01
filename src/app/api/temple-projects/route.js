import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, subtitle, tagline, description, banner_image, thumbnail_image,
              stats, goal_amount, raised_amount, cta_title, cta_description, cta_btn_text, cta_btn_link,
              meta_title, meta_description, status, featured, sort_order
       FROM temple_projects WHERE status = 'published' ORDER BY featured DESC, sort_order ASC, id ASC`
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
