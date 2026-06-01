import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { projectId } = await params;
  try {
    const [[row]] = await pool.query('SELECT * FROM gilehri_seva WHERE project_id = ? LIMIT 1', [projectId]);
    if (row) {
      for (const k of ['benefits','suggested_amounts']) {
        if (row[k] && typeof row[k] === 'string') try { row[k] = JSON.parse(row[k]); } catch {}
      }
    }
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
    const benefits  = Array.isArray(b.benefits)          ? JSON.stringify(b.benefits)          : (b.benefits||null);
    const suggested = Array.isArray(b.suggested_amounts) ? JSON.stringify(b.suggested_amounts) : (b.suggested_amounts||null);
    await pool.query(
      `INSERT INTO gilehri_seva (project_id, title, subtitle, description, image, benefits, suggested_amounts, badge_text, cta_text, enabled)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description),
         image=VALUES(image), benefits=VALUES(benefits), suggested_amounts=VALUES(suggested_amounts),
         badge_text=VALUES(badge_text), cta_text=VALUES(cta_text), enabled=VALUES(enabled)`,
      [projectId, b.title||'Gilehri Seva', b.subtitle||null, b.description||null,
       b.image||null, benefits, suggested, b.badge_text||'🐿️ Gilehri Seva',
       b.cta_text||'🙏 Participate in Gilehri Seva', b.enabled?1:0]
    );
    return NextResponse.json({ saved: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
