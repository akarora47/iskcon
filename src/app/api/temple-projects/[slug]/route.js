import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, { params }) {
  const { slug } = await params;
  try {
    const [[project]] = await pool.query(
      `SELECT * FROM temple_projects WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]
    );
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [gallery] = await pool.query(
      `SELECT * FROM temple_project_gallery WHERE project_id = ? ORDER BY sort_order ASC, id ASC`, [project.id]
    );
    const [videos] = await pool.query(
      `SELECT * FROM temple_project_videos WHERE project_id = ? ORDER BY sort_order ASC, id ASC`, [project.id]
    );
    const [[gilehri]] = await pool.query(
      `SELECT * FROM gilehri_seva WHERE project_id = ? AND enabled = 1 LIMIT 1`, [project.id]
    );
    const [[donationSettings]] = await pool.query(
      `SELECT * FROM temple_donation_settings WHERE project_id = ? LIMIT 1`, [project.id]
    );

    // Parse JSON fields safely
    for (const key of ['stats', 'construction_updates']) {
      if (project[key] && typeof project[key] === 'string') try { project[key] = JSON.parse(project[key]); } catch {}
    }
    if (gilehri) {
      for (const key of ['benefits', 'suggested_amounts']) {
        if (gilehri[key] && typeof gilehri[key] === 'string') try { gilehri[key] = JSON.parse(gilehri[key]); } catch {}
      }
    }

    return NextResponse.json({ ...project, gallery, videos, gilehri: gilehri || null, donationSettings: donationSettings || null });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
