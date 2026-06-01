import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [[settings]] = await pool.query('SELECT * FROM life_membership_settings WHERE id = 1 LIMIT 1');
    const [benefits]   = await pool.query('SELECT * FROM life_membership_benefits ORDER BY sort_order ASC, id ASC');
    const [gallery]    = await pool.query('SELECT * FROM life_membership_gallery ORDER BY sort_order ASC, id ASC');

    if (settings?.donation_suggested_amounts && typeof settings.donation_suggested_amounts === 'string') {
      try { settings.donation_suggested_amounts = JSON.parse(settings.donation_suggested_amounts); } catch { settings.donation_suggested_amounts = []; }
    }

    return NextResponse.json({ settings: settings || {}, benefits, gallery });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
