import nodemailer from 'nodemailer';

// ── Transporter (singleton) ───────────────────────────────────
let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtpout.secureserver.net',
    port:   Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== 'false',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
  return _transporter;
}

const FROM  = process.env.EMAIL_FROM  || 'ISKCON Ayodhya <info@iskconayodhya.com>';
const ADMIN = process.env.ADMIN_EMAIL || 'info@iskconayodhya.com';

// ── Inline row helper — email clients ignore <style> CSS ──────
function row(label, value, last = false) {
  if (value === null || value === undefined || value === '') return '';
  const borderBottom = last ? '' : 'border-bottom:1px solid #f0d8b0;';
  return `
    <tr>
      <td style="padding:12px 0;${borderBottom}font-size:13px;color:#8a6040;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:middle;width:40%;">${label}</td>
      <td style="padding:12px 16px;${borderBottom}font-size:14px;color:#1a0900;font-weight:600;text-align:right;vertical-align:middle;">${value}</td>
    </tr>`;
}

function box(rows) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #f0d8b0;border-radius:10px;padding:4px 20px;margin:20px 0;">
    <tbody>${rows}</tbody>
  </table>`;
}

// ── Shared HTML wrapper ───────────────────────────────────────
function wrap(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>ISKCON Ayodhya</title>
</head>
<body style="margin:0;padding:0;background:#fff8f0;font-family:Georgia,'Times New Roman',serif;color:#1a0900;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:24px 12px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #f0d8b0;border-radius:12px;overflow:hidden;">

      <!-- BANNER -->
      <tr><td style="background:linear-gradient(135deg,#c45500,#ed6800);padding:28px 32px;text-align:center;">
        <div style="font-family:Georgia,serif;color:#fff;font-size:22px;letter-spacing:1px;margin-bottom:4px;">🛕 ISKCON Ayodhya</div>
        <div style="color:rgba(255,255,255,.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Hare Krishna — Ayodhya Dham</div>
        <div style="background:rgba(0,0,0,.15);padding:8px 16px;margin-top:12px;border-radius:6px;display:inline-block;">
          <span style="color:#ffd89b;font-size:11px;font-style:italic;">🙏 Hare Krishna Hare Krishna · Krishna Krishna Hare Hare · Hare Rama Hare Rama · Rama Rama Hare Hare</span>
        </div>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:32px;">${body}</td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#fff3e0;padding:20px 32px;text-align:center;border-top:1px solid #f0d8b0;">
        <p style="font-size:12px;color:#8a6040;line-height:1.8;margin:0;">
          <strong>ISKCON Ayodhya</strong><br/>
          Temple Road, Ayodhya, Uttar Pradesh – 224001, India<br/>
          📞 +91 12345 67890 &nbsp;|&nbsp; ✉️ <a href="mailto:info@iskconayodhya.com" style="color:#ed6800;text-decoration:none;">info@iskconayodhya.com</a>
        </p>
        <hr style="border:none;border-top:1px solid #f0d8b0;margin:12px 0"/>
        <p style="font-size:11px;color:#aaa;margin:0;">This is an automated message. Please do not reply to this email.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const hl = (text) => `<div style="background:linear-gradient(135deg,#c45500,#ed6800);color:#fff;text-align:center;padding:14px 24px;border-radius:8px;margin:20px 0;font-size:18px;font-weight:bold;letter-spacing:1px;">${text}</div>`;
const p  = (text, extra = '') => `<p style="font-size:15px;line-height:1.85;color:#2d2d2d;margin-bottom:16px;${extra}">${text}</p>`;
const hr = () => `<hr style="border:none;border-top:1px solid #f0d8b0;margin:20px 0"/>`;

// ── Send helper ───────────────────────────────────────────────
async function send(to, subject, html) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[Email skipped — no credentials]', { to, subject });
    return;
  }
  try {
    await getTransporter().sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[Email error]', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. BOOKING CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendBookingEmails({ name, email, phone, room_name, check_in, check_out, guests, special_requests, amount }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  // Guest email
  await send(email, '🏨 Booking Enquiry Received — ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}! 🙏</p>
    ${p('Your room booking enquiry at <strong>ISKCON Ayodhya Guest House</strong> has been received. Our team will confirm your reservation within 24 hours.')}
    ${box(
      row('Guest Name', name) +
      row('Room', room_name) +
      row('Check-In', fmt(check_in)) +
      row('Check-Out', fmt(check_out)) +
      row('Guests', guests) +
      (amount ? row('Amount Paid', `<span style="color:#c45500;">₹${Number(amount).toLocaleString('en-IN')}</span>`) : '') +
      row('Special Requests', special_requests, true)
    )}
    ${p('📋 <strong>What to expect:</strong>')}
    ${p(`• Our team will call you at <strong>${phone}</strong> to confirm availability<br/>• Please carry a valid ID for check-in<br/>• Check-in: 12:00 PM &nbsp;|&nbsp; Check-out: 10:00 AM<br/>• Daily aarti darshan and prasadam included`, 'margin-left:16px;')}
    ${hr()}
    ${p('May Lord Krishna and Lord Ram bless you with a blissful stay in the Holy Dham of Ayodhya. 🙏', 'text-align:center;font-style:italic;color:#8a6040;')}
  `));

  // Admin email
  await send(ADMIN, `🏨 New Booking: ${name} — ${room_name}`, wrap(`
    ${hl('🔔 New Booking Request')}
    ${box(
      row('Guest Name', name) +
      row('Email', email) +
      row('Phone', phone) +
      row('Room', room_name) +
      row('Check-In', fmt(check_in)) +
      row('Check-Out', fmt(check_out)) +
      row('Guests', guests) +
      row('Payment', amount ? `<span style="color:#c45500;">₹${Number(amount).toLocaleString('en-IN')} Received</span>` : '<span style="color:#aaa;">Pending</span>') +
      row('Special Requests', special_requests, true)
    )}
    ${p(`Please log in to the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/bookings" style="color:#ed6800;">Admin Panel</a> to confirm or update this booking.`)}
  `));
}

// ─────────────────────────────────────────────────────────────
// 2. BOOKING STATUS UPDATE
// ─────────────────────────────────────────────────────────────
export async function sendBookingStatusEmail({ name, email, phone, room_name, check_in, check_out, guests, special_requests, status }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const isConfirmed = status === 'confirmed';
  const isCancelled = status === 'cancelled';

  const statusLabel = isConfirmed ? '✅ Confirmed' : isCancelled ? '❌ Cancelled' : status;
  const statusColor = isConfirmed ? '#22c55e' : isCancelled ? '#ef4444' : '#ed6800';
  const statusMsg   = isConfirmed
    ? 'Your booking has been <strong>confirmed</strong>! We look forward to welcoming you to the Holy Dham.'
    : isCancelled
    ? 'Unfortunately, your booking has been <strong>cancelled</strong>. Please contact us if you have any questions.'
    : `Your booking status has been updated to <strong>${status}</strong>.`;

  // Guest email
  await send(email, `🏨 Booking ${statusLabel} — ISKCON Ayodhya`, wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}! 🙏</p>
    <div style="background:${isConfirmed ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)'};border:1px solid ${statusColor};border-radius:10px;padding:14px 20px;margin:16px 0;text-align:center;">
      <span style="font-size:20px;font-weight:bold;color:${statusColor};">${statusLabel}</span>
    </div>
    ${p(statusMsg)}
    ${box(
      row('Guest Name', name) +
      row('Room', room_name) +
      row('Check-In', fmt(check_in)) +
      row('Check-Out', fmt(check_out)) +
      row('Guests', guests) +
      row('Special Requests', special_requests, true)
    )}
    ${isConfirmed ? p('📋 <strong>Reminders:</strong>') + p(`• Please carry a valid ID for check-in<br/>• Check-in: 12:00 PM &nbsp;|&nbsp; Check-out: 10:00 AM<br/>• Temple attire required for darshan<br/>• Daily prasadam is included`, 'margin-left:16px;') : ''}
    ${hr()}
    ${p('For any queries, please contact us at 📞 +91 12345 67890 or ✉️ info@iskconayodhya.com', 'text-align:center;color:#8a6040;font-size:13px;')}
    ${p('Hare Krishna! 🙏', 'text-align:center;font-style:italic;color:#8a6040;')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 3b. DONATION / SEVA CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendDonationEmails({ full_name, email, phone, seva_type, amount, message, payment_id }) {
  // Guest email
  await send(email, '🙏 Seva Received — ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${full_name}! 🙏</p>
    ${p('Your generous seva offering has been received by ISKCON Ayodhya. The Lord sees every act of devotion with His all-merciful eyes.')}
    ${hl(`₹${Number(amount).toLocaleString('en-IN')} — ${seva_type}`)}
    ${box(
      row('Donor Name', full_name) +
      row('Seva Type', seva_type) +
      row('Amount', `₹${Number(amount).toLocaleString('en-IN')}`) +
      (payment_id ? row('Payment ID', `<span style="font-family:monospace;font-size:12px;">${payment_id}</span>`) : '') +
      (phone ? row('Phone', phone) : '') +
      row('Dedication', message, true)
    )}
    ${p('"Whoever offers Me with devotion a leaf, a flower, a fruit or water — that offering of love from the pure-hearted I accept." — Bhagavad Gita 9.26', 'font-style:italic;text-align:center;color:#6a4020;')}
    ${hr()}
    ${p('Our seva team will send your donation receipt and tax certificate (80G) to this email within 2 working days.')}
    ${p('May the blessings of Lord Krishna and Lord Ram always be upon you and your family. 🌺', 'text-align:center;font-style:italic;color:#8a6040;')}
  `));

  // Admin email
  await send(ADMIN, `💰 Donation ₹${Number(amount).toLocaleString('en-IN')} — ${full_name} (${seva_type})`, wrap(`
    ${hl(`💰 New Donation — ₹${Number(amount).toLocaleString('en-IN')}`)}
    ${box(
      row('Donor Name', full_name) +
      row('Email', email) +
      row('Phone', phone || '—') +
      row('Seva Type', seva_type) +
      row('Amount', `<span style="color:#c45500;font-size:16px;">₹${Number(amount).toLocaleString('en-IN')}</span>`) +
      (payment_id ? row('Payment ID', `<span style="font-family:monospace;font-size:12px;">${payment_id}</span>`) : '') +
      row('Dedication', message, true)
    )}
    ${p(`Please issue an 80G receipt and update the donor record in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/donations" style="color:#ed6800;">Admin Panel</a>.`)}
  `));
}

// ─────────────────────────────────────────────────────────────
// 3. EVENT REGISTRATION CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendRegistrationEmails({ first_name, last_name, email, phone, event_name, attendees, city, special_requests }) {
  const name = `${first_name} ${last_name || ''}`.trim();

  // Guest email
  await send(email, `🎪 Registration Confirmed: ${event_name} — ISKCON Ayodhya`, wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${first_name}! 🎉</p>
    ${p(`You are now registered for <strong>${event_name}</strong> at ISKCON Ayodhya! We are delighted to welcome you to this sacred celebration.`)}
    ${box(
      row('Name', name) +
      row('Event', event_name) +
      row('Attendees', `${attendees || 1} person(s)`) +
      (city ? row('City', city) : '') +
      (phone ? row('Contact', phone) : '') +
      row('Special Needs', special_requests, true)
    )}
    ${p('📌 <strong>Important notes:</strong>')}
    ${p('• Please arrive 30 minutes before the event begins<br/>• Wear traditional / modest attire<br/>• Prasadam will be served free of charge<br/>• Photography is welcome — please be respectful', 'margin-left:16px;')}
    ${hr()}
    ${p('We look forward to celebrating with you! Hare Krishna 🙏', 'text-align:center;font-style:italic;color:#8a6040;')}
  `));

  // Admin email
  await send(ADMIN, `📋 New Registration: ${name} — ${event_name}`, wrap(`
    ${hl('📋 New Event Registration')}
    ${box(
      row('Name', name) +
      row('Email', email) +
      row('Phone', phone || '—') +
      row('Event', event_name) +
      row('Attendees', attendees || 1) +
      (city ? row('City', city) : '') +
      row('Special Needs', special_requests, true)
    )}
    ${p(`View all registrations in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/registrations" style="color:#ed6800;">Admin Panel → Registrations</a>.`)}
  `));
}

// ─────────────────────────────────────────────────────────────
// 4. CONTACT / INQUIRY
// ─────────────────────────────────────────────────────────────
export async function sendContactEmails({ name, email, phone, subject, message }) {
  // Guest email
  await send(email, '📩 Message Received — ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}! 🙏</p>
    ${p('Thank you for reaching out to ISKCON Ayodhya. We have received your message and our team will respond within 24 hours.')}
    ${box(
      row('Your Name', name) +
      row('Subject', subject) +
      row('Message', message, true)
    )}
    ${p('If your inquiry is urgent, you can reach us directly:')}
    ${p('📞 +91 12345 67890<br/>✉️ info@iskconayodhya.com<br/>⏰ Mon–Sun, 6:00 AM – 8:30 PM', 'margin-left:16px;')}
    ${hr()}
    ${p('Hare Krishna! We look forward to serving you. 🌺', 'text-align:center;font-style:italic;color:#8a6040;')}
  `));

  // Admin email
  await send(ADMIN, `📩 Inquiry: ${subject} — ${name}`, wrap(`
    ${hl('📩 New Website Inquiry')}
    ${box(
      row('Name', name) +
      row('Email', email) +
      row('Phone', phone || '—') +
      row('Subject', subject) +
      row('Message', message, true)
    )}
    ${p(`Reply directly to this email, or visit <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/inquiries" style="color:#ed6800;">Admin Panel → Inquiries</a> to manage all leads.`)}
  `));
}
