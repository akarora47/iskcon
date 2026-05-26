import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE active = 1 ORDER BY price_amount ASC');
    const parsed = rows.map(r => ({ ...r, features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features }));
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { title, title_hi, icon, price, price_amount, description, description_hi, features, image, popular, active } = body;
    const [result] = await pool.query(
      'INSERT INTO rooms (title,title_hi,icon,price,price_amount,description,description_hi,features,image,popular,active) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [title, title_hi, icon||'🛏️', price, price_amount, description, description_hi, JSON.stringify(features||[]), image, popular?1:0, active?1:0]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
