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

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      page_title, banner_image, hero_subtitle,
      about_title, about_content,
      membership_fee, membership_enabled,
      cta_member_text, cta_donate_text,
      donation_suggested_amounts, donation_cta_text,
      meta_title, meta_description,
    } = body;

    const amounts = Array.isArray(donation_suggested_amounts)
      ? JSON.stringify(donation_suggested_amounts)
      : donation_suggested_amounts || '[]';

    await pool.query(
      `INSERT INTO life_membership_settings
         (id, page_title, banner_image, hero_subtitle, about_title, about_content,
          membership_fee, membership_enabled, cta_member_text, cta_donate_text,
          donation_suggested_amounts, donation_cta_text, meta_title, meta_description)
       VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         page_title=VALUES(page_title), banner_image=VALUES(banner_image),
         hero_subtitle=VALUES(hero_subtitle), about_title=VALUES(about_title),
         about_content=VALUES(about_content), membership_fee=VALUES(membership_fee),
         membership_enabled=VALUES(membership_enabled), cta_member_text=VALUES(cta_member_text),
         cta_donate_text=VALUES(cta_donate_text),
         donation_suggested_amounts=VALUES(donation_suggested_amounts),
         donation_cta_text=VALUES(donation_cta_text),
         meta_title=VALUES(meta_title), meta_description=VALUES(meta_description)`,
      [page_title||'Life Membership — ISKCON Ayodhya', banner_image||'', hero_subtitle||'',
       about_title||'About Life Membership', about_content||'',
       membership_fee||100000, membership_enabled!==false?1:0,
       cta_member_text||'Become a Life Member', cta_donate_text||'Donate Now',
       amounts, donation_cta_text||'Support Our Mission',
       meta_title||'', meta_description||'']
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
