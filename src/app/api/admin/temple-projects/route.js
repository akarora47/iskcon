import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, subtitle, status, featured, sort_order, banner_image, thumbnail_image,
              goal_amount, raised_amount, updated_at
       FROM temple_projects ORDER BY sort_order ASC, id ASC`
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();
    const slug = b.slug || b.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const [result] = await pool.query(
      `INSERT INTO temple_projects
        (slug, title, subtitle, tagline, description, about_content, banner_image, thumbnail_image,
         stats, goal_amount, raised_amount, cta_title, cta_description, cta_btn_text, cta_btn_link,
         meta_title, meta_description, status, featured, sort_order)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [slug, b.title, b.subtitle||null, b.tagline||null, b.description||null, b.about_content||null,
       b.banner_image||null, b.thumbnail_image||null,
       b.stats ? JSON.stringify(b.stats) : null,
       b.goal_amount||0, b.raised_amount||0,
       b.cta_title||'Support This Sacred Project', b.cta_description||null,
       b.cta_btn_text||'🙏 Donate Now', b.cta_btn_link||'/donation',
       b.meta_title||null, b.meta_description||null,
       b.status||'published', b.featured?1:0, b.sort_order||0]
    );
    return NextResponse.json({ id: result.insertId, slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
