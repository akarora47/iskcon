import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// Admin: get popup (latest row regardless of enabled)
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [rows] = await pool.query('SELECT * FROM event_popup ORDER BY id DESC LIMIT 1');
    return NextResponse.json(rows[0] || null);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Admin: upsert popup (update if exists, insert if not)
export async function PUT(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      id, title, subtitle, description, image,
      event_date, event_time, event_venue,
      btn_text, btn_link, btn2_text, btn2_link,
      badge_text, enabled,
    } = body;

    if (id) {
      await pool.query(
        `UPDATE event_popup SET
          title=?, subtitle=?, description=?, image=?,
          event_date=?, event_time=?, event_venue=?,
          btn_text=?, btn_link=?, btn2_text=?, btn2_link=?,
          badge_text=?, enabled=?
        WHERE id=?`,
        [
          title, subtitle || null, description || null, image || null,
          event_date || null, event_time || null, event_venue || null,
          btn_text || 'Know More', btn_link || '/events',
          btn2_text || null, btn2_link || null,
          badge_text || '⭐ Upcoming Event', enabled ? 1 : 0,
          id,
        ]
      );
      return NextResponse.json({ id, updated: true });
    } else {
      const [result] = await pool.query(
        `INSERT INTO event_popup
          (title, subtitle, description, image, event_date, event_time, event_venue,
           btn_text, btn_link, btn2_text, btn2_link, badge_text, enabled)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          title, subtitle || null, description || null, image || null,
          event_date || null, event_time || null, event_venue || null,
          btn_text || 'Know More', btn_link || '/events',
          btn2_text || null, btn2_link || null,
          badge_text || '⭐ Upcoming Event', enabled ? 1 : 0,
        ]
      );
      return NextResponse.json({ id: result.insertId, created: true }, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
