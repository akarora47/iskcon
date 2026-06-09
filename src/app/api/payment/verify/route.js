import { NextResponse } from 'next/server';
import { verifySignature } from '@/lib/razorpay';
import pool from '@/lib/db';

// POST /api/payment/verify
// Body: { order_id, payment_id, signature, type, data }
// type: 'donation' | 'booking' | 'life_membership' | 'life_membership_donation'
// data: the form data to save after payment verified
export async function POST(req) {
  try {
    const { order_id, payment_id, signature, type, data } = await req.json();

    const valid = verifySignature({ order_id, payment_id, signature });
    if (!valid) {
      return NextResponse.json({ error: 'Payment verification failed. Please contact us.' }, { status: 400 });
    }

    // ── Save to DB based on type ──
    if (type === 'donation') {
      const { campaign_id, seva_type, full_name, email, phone, address, pin, pan, amount, message } = data;
      await pool.query(
        'INSERT INTO donation_submissions (campaign_id,seva_type,full_name,email,phone,address,pin,pan,amount,message,razorpay_order_id,razorpay_payment_id,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [campaign_id||null, seva_type, full_name, email, phone, address||'', pin||'', pan||'', amount||0, message||'', order_id, payment_id, 'confirmed']
      );
      // Non-blocking — payment saved, email failure must NOT cause 500
      import('@/lib/email').then(({ sendDonationEmails }) =>
        sendDonationEmails({ full_name, email, phone, address, pin, pan, seva_type, amount, message, payment_id })
      ).catch(e => console.error('[Email donation]', e.message));
    }

    if (type === 'life_membership') {
      const { full_name, email, phone, address, city, state, country, date_of_birth, notes, amount } = data;
      await pool.query(
        'INSERT INTO life_membership_applications (full_name,email,phone,address,city,state,country,date_of_birth,notes,amount,razorpay_order_id,razorpay_payment_id,payment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [full_name, email, phone, address||'', city||'', state||'', country||'India', date_of_birth||null, notes||'', amount||0, order_id, payment_id, 'confirmed']
      );
      import('@/lib/email').then(({ sendLifeMembershipEmails }) =>
        sendLifeMembershipEmails({ full_name, email, phone, city, state, amount, payment_id })
      ).catch(e => console.error('[Email life_membership]', e.message));
    }

    if (type === 'life_membership_donation') {
      const { full_name, email, phone, amount, message } = data;
      await pool.query(
        'INSERT INTO life_membership_donations (full_name,email,phone,amount,message,razorpay_order_id,razorpay_payment_id,payment_status) VALUES (?,?,?,?,?,?,?,?,?)',
        [full_name, email, phone, amount||0, message||'', order_id, payment_id, 'confirmed']
      );
      import('@/lib/email').then(({ sendDonationEmails }) =>
        sendDonationEmails({ full_name, email, phone, address:'', pin:'', pan:'', seva_type:'Life Membership Page Donation', amount, message, payment_id })
      ).catch(e => console.error('[Email life_membership_donation]', e.message));
    }

    if (type === 'booking') {
      const { room_id, room_name, name, email, phone, check_in, check_out, guests, special_requests, amount } = data;
      await pool.query(
        'INSERT INTO bookings (room_id,room_name,name,email,phone,check_in,check_out,guests,special_requests,razorpay_order_id,razorpay_payment_id,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [room_id||null, room_name, name, email, phone, check_in||null, check_out||null, guests||1, special_requests||'', order_id, payment_id, 'confirmed']
      );
      import('@/lib/email').then(({ sendBookingEmails }) =>
        sendBookingEmails({ name, email, phone, room_name, check_in, check_out, guests, special_requests, amount })
      ).catch(e => console.error('[Email booking]', e.message));
    }

    return NextResponse.json({ success: true, payment_id });
  } catch (e) {
    console.error('[Payment verify]', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
