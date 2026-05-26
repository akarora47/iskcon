import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendBookingStatusEmail } from '@/lib/email';

export async function PUT(req, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { status } = await req.json();

    // Fetch the booking first so we can send a status email
    const [[booking]] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    // Send status update email to guest (non-blocking)
    if (booking.email && (status === 'confirmed' || status === 'cancelled')) {
      sendBookingStatusEmail({
        name:             booking.name,
        email:            booking.email,
        phone:            booking.phone,
        room_name:        booking.room_name,
        check_in:         booking.check_in,
        check_out:        booking.check_out,
        guests:           booking.guests,
        special_requests: booking.special_requests,
        status,
      }).catch(console.error);
    }

    return NextResponse.json({ message: 'Status updated', status });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_, context) {
  const { id } = await context.params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
