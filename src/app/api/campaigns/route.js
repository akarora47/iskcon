import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM seva_campaigns WHERE active = 1 ORDER BY featured DESC, id ASC');
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { title, title_hi, icon, description, description_hi, goal_amount, raised_amount, image, featured, active, amount_type } = body;
    const [result] = await pool.query(
      'INSERT INTO seva_campaigns (title,title_hi,icon,description,description_hi,goal_amount,raised_amount,image,featured,active,amount_type) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [title, title_hi, icon||'🌸', description, description_hi, goal_amount||0, raised_amount||0, image, featured?1:0, active?1:0, amount_type||'variable']
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
