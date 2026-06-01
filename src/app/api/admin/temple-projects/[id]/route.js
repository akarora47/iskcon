import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const [[project]] = await pool.query('SELECT * FROM temple_projects WHERE id = ? LIMIT 1', [id]);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [gallery] = await pool.query('SELECT * FROM temple_project_gallery WHERE project_id = ? ORDER BY sort_order ASC, id ASC', [id]);
    const [videos]  = await pool.query('SELECT * FROM temple_project_videos WHERE project_id = ? ORDER BY sort_order ASC, id ASC', [id]);
    const [[gilehri]] = await pool.query('SELECT * FROM gilehri_seva WHERE project_id = ? LIMIT 1', [id]);
    const [[donSettings]] = await pool.query('SELECT * FROM temple_donation_settings WHERE project_id = ? LIMIT 1', [id]);

    for (const key of ['stats', 'construction_updates']) {
      if (project[key] && typeof project[key] === 'string') try { project[key] = JSON.parse(project[key]); } catch {}
    }
    if (gilehri) {
      for (const key of ['benefits', 'suggested_amounts']) {
        if (gilehri[key] && typeof gilehri[key] === 'string') try { gilehri[key] = JSON.parse(gilehri[key]); } catch {}
      }
    }

    return NextResponse.json({ ...project, gallery, videos, gilehri: gilehri||null, donationSettings: donSettings||null });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const b = await req.json();
    await pool.query(
      `UPDATE temple_projects SET
        slug=?, title=?, subtitle=?, tagline=?, location=?, construction_status=?,
        description=?, about_content=?, construction_updates=?, project_requirements=?,
        banner_image=?, thumbnail_image=?,
        stats=?, goal_amount=?, raised_amount=?,
        cta_title=?, cta_description=?, cta_btn_text=?, cta_btn_link=?,
        meta_title=?, meta_description=?, status=?, featured=?, sort_order=?
       WHERE id=?`,
      [b.slug, b.title, b.subtitle||null, b.tagline||null, b.location||null, b.construction_status||'In Progress',
       b.description||null, b.about_content||null,
       b.construction_updates ? JSON.stringify(b.construction_updates) : null,
       b.project_requirements||null,
       b.banner_image||null, b.thumbnail_image||null,
       b.stats ? JSON.stringify(b.stats) : null,
       b.goal_amount||0, b.raised_amount||0,
       b.cta_title||'Support This Sacred Project', b.cta_description||null,
       b.cta_btn_text||'🙏 Donate Now', b.cta_btn_link||'/donation',
       b.meta_title||null, b.meta_description||null,
       b.status||'published', b.featured?1:0, b.sort_order||0, id]
    );
    return NextResponse.json({ updated: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await pool.query('DELETE FROM temple_projects WHERE id = ?', [id]);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
