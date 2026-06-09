import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtpout.secureserver.net',
    port:   Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== 'false',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

const FROM  = process.env.EMAIL_FROM  || 'ISKCON Ayodhya <info@iskconayodhya.com>';
const ADMIN = process.env.ADMIN_EMAIL || 'info@iskconayodhya.com';

// ── Inline row helper ─────────────────────────────────────────
function row(label, value, last = false) {
  if (value === null || value === undefined) return '';
  const displayVal = value === '' ? '--' : value;
  const bb = last ? '' : 'border-bottom:1px solid #f0d8b0;';
  return `<tr>
    <td style="padding:12px 0;${bb}font-size:13px;color:#8a6040;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:middle;width:40%;">${label}</td>
    <td style="padding:12px 16px;${bb}font-size:14px;color:#1a0900;font-weight:600;text-align:right;vertical-align:middle;">${displayVal}</td>
  </tr>`;
}

function box(rows) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #f0d8b0;border-radius:10px;padding:4px 20px;margin:20px 0;"><tbody>${rows}</tbody></table>`;
}

// ── Shared HTML wrapper ───────────────────────────────────────
function wrap(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>ISKCON Ayodhya</title></head>
<body style="margin:0;padding:0;background:#fff8f0;font-family:Georgia,'Times New Roman',serif;color:#1a0900;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #f0d8b0;border-radius:12px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#c45500,#ed6800);padding:28px 32px;text-align:center;">
<div style="font-family:Georgia,serif;color:#fff;font-size:22px;letter-spacing:1px;margin-bottom:4px;">ISKCON Ayodhya</div>
<div style="color:rgba(255,255,255,.85);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Hare Krishna - Ayodhya Dham</div>
<div style="background:rgba(0,0,0,.15);padding:8px 16px;margin-top:12px;border-radius:6px;display:inline-block;">
<span style="color:#ffd89b;font-size:11px;font-style:italic;">Hare Krishna Hare Krishna - Krishna Krishna Hare Hare - Hare Rama Hare Rama - Rama Rama Hare Hare</span>
</div></td></tr>
<tr><td style="padding:32px;">${body}</td></tr>
<tr><td style="background:#fff3e0;padding:20px 32px;text-align:center;border-top:1px solid #f0d8b0;">
<p style="font-size:12px;color:#8a6040;line-height:1.8;margin:0;"><strong>ISKCON Ayodhya</strong><br/>Ram Nagar, Faizabad, Uttar Pradesh 224001, India<br/>+91 95173 12508 | info@iskconayodhya.com</p>
<hr style="border:none;border-top:1px solid #f0d8b0;margin:12px 0"/>
<p style="font-size:11px;color:#aaa;margin:0;">This is an automated message. Please do not reply to this email.</p>
</td></tr></table></td></tr></table></body></html>`;
}

const hl = (text) => `<div style="background:linear-gradient(135deg,#c45500,#ed6800);color:#fff;text-align:center;padding:14px 24px;border-radius:8px;margin:20px 0;font-size:18px;font-weight:bold;letter-spacing:1px;">${text}</div>`;
const p  = (text, extra = '') => `<p style="font-size:15px;line-height:1.85;color:#2d2d2d;margin-bottom:16px;${extra}">${text}</p>`;
const hr = () => `<hr style="border:none;border-top:1px solid #f0d8b0;margin:20px 0"/>`;

// ── Send helper ───────────────────────────────────────────────
async function send(to, subject, html) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[Email skipped - no credentials]', { to, subject });
    return;
  }
  try {
    await getTransporter().sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[Email error]', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// AMOUNT IN WORDS (Indian system)
// ─────────────────────────────────────────────────────────────
function amountToWords(num) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const n = Math.floor(Number(num));
  if (n === 0) return 'Zero';
  function b100(x) { return x < 20 ? ones[x] : tens[Math.floor(x/10)] + (x%10 ? ' '+ones[x%10] : ''); }
  function b1000(x) { return x >= 100 ? ones[Math.floor(x/100)] + ' Hundred' + (x%100 ? ' '+b100(x%100) : '') : b100(x); }
  let r = '';
  if (n >= 10000000) r += b1000(Math.floor(n/10000000)) + ' Crore ';
  if (n%10000000 >= 100000) r += b1000(Math.floor((n%10000000)/100000)) + ' Lakh ';
  if (n%100000 >= 1000)     r += b1000(Math.floor((n%100000)/1000)) + ' Thousand ';
  if (n%1000 > 0)           r += b1000(n%1000);
  return r.trim() + ' Rupees';
}

// ─────────────────────────────────────────────────────────────
// DONATION RECEIPT HTML (official ISKCON receipt style)
// ─────────────────────────────────────────────────────────────
function donationReceiptHtml({ full_name, email, phone, address, pin, pan, seva_type, amount, message, payment_id }) {
  const date      = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' });
  const year      = new Date().getFullYear();
  const receiptNo = payment_id ? payment_id.slice(-10).toUpperCase() : Date.now().toString().slice(-10);
  const amtNum    = Number(amount);
  const amtWords  = amountToWords(amtNum);
  const amtFmt    = amtNum.toLocaleString('en-IN');
  const payMode   = payment_id ? 'Online / UPI' : 'Cash';
  const msgRow    = message ? `<tr><td style="font-size:11px;color:#555;padding:4px 0;vertical-align:top;width:65px;">Message</td><td style="font-size:12px;color:#333;padding:4px 0;font-style:italic;">${message}</td></tr>` : '';
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'https://iskconayodhya.com';
  const logoUrl   = siteUrl + '/logo.png';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>ISKCON Ayodhya Donation Receipt</title></head>
<body style="margin:0;padding:0;background:#d6cfba;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#d6cfba">
<tr><td align="center" style="padding:20px 10px;">

<!-- OUTER TABLE: RECEIPT + PTO -->
<table cellpadding="0" cellspacing="0" width="660" style="max-width:660px;">
<tr valign="top">

<!-- RECEIPT -->
<td>
<table cellpadding="0" cellspacing="0" width="100%" style="border:2px solid #c9a84c;background:#fffef5;">

<!-- HEADER -->
<tr bgcolor="#fffef5">
<td style="padding:10px 14px;border-bottom:2px solid #c9a84c;">
<table cellpadding="0" cellspacing="0" width="100%"><tr valign="middle">

<td width="90" align="center" style="padding-right:8px;">
<img src="${logoUrl}" width="80" height="80" alt="ISKCON Ayodhya" style="display:block;max-width:80px;"/>
</td>

<td align="center" style="padding:0 10px;">
<div style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#1e3a8a;line-height:1.3;">International Society for Krishna Consciousness (ISKCON)</div>
<div style="font-size:11px;color:#3b5bdb;margin-top:5px;font-style:italic;">Founder-Acharya: His Divine Grace A. C. Bhaktivedanta Swami Prabhupada</div>
</td>

<td width="42" valign="top" align="center">
<table cellpadding="3" cellspacing="0" style="border:1px solid #999;"><tr><td style="font-size:8px;color:#777;text-align:center;line-height:1.4;">holo<br/>gram</td></tr></table>
</td>

</tr></table>
</td>
</tr>

<!-- BRANCH + RECEIPT NO -->
<tr>
<td style="border-bottom:1.5px solid #c9a84c;padding:0;">
<table cellpadding="0" cellspacing="0" width="100%"><tr valign="top">

<td width="54%" style="padding:10px 14px;border-right:1.5px solid #c9a84c;">
<div style="font-size:10px;font-weight:bold;color:#c0185a;text-align:center;letter-spacing:1px;margin-bottom:5px;">Branch</div>
<table cellpadding="6" cellspacing="0" width="100%" style="border:1px solid #c9a84c;background:#fffde8;">
<tr><td align="center">
<div style="font-size:13px;font-weight:bold;color:#111;margin-bottom:3px;">ISKCON Ayodhya</div>
<div style="font-size:10px;color:#333;line-height:1.8;">Ram Nagar, Naka Hanuman Garhi<br/>Faizabad, Ayodhya, Uttar Pradesh - 224001<br/>&#9742; Mobile: 95173 12508 / 63870 21220<br/>E-mail: info@iskconayodhya.com</div>
</td></tr>
</table>
</td>

<td width="46%" style="padding:10px 14px;">
<div style="font-size:11px;font-weight:bold;color:#c0185a;">Donation &nbsp; Receipt No.</div>
<div style="font-size:15px;font-weight:bold;color:#111;letter-spacing:1px;font-family:monospace;margin:3px 0 8px;">${receiptNo}</div>
<table cellpadding="0" cellspacing="0" width="100%"><tr valign="middle">
<td>
<table cellpadding="5" cellspacing="0" style="border:2px solid #c0185a;"><tr><td align="center" style="font-size:11px;font-weight:bold;color:#c0185a;line-height:1.4;">DONOR'S<br/>COPY</td></tr></table>
</td>
<td align="right">
<div style="font-size:9px;font-weight:bold;color:#c0185a;text-align:center;margin-bottom:3px;">Date</div>
<table cellpadding="4" cellspacing="0" style="border:1px solid #bbb;margin-left:auto;"><tr><td style="font-size:12px;font-weight:bold;color:#111;">${date}</td></tr></table>
</td>
</tr></table>
</td>

</tr></table>
</td>
</tr>

<!-- DONATION AMOUNT -->
<tr>
<td style="border-bottom:1.5px solid #c9a84c;padding:0;">
<table cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff0f4">
<tr><td colspan="3" style="padding:5px;text-align:center;border-bottom:1px solid #f0b0c0;">
<span style="font-size:10px;font-weight:bold;color:#c0185a;letter-spacing:.5px;">&#8212; Donation Amount in Rupees &#8212;</span>
</td></tr>
<tr>
<td style="padding:10px 14px;font-size:13px;color:#111;">${amtWords} Only/-</td>
<td style="padding:10px 14px;border-left:1px solid #c9a84c;text-align:right;white-space:nowrap;">
<span style="font-size:20px;font-weight:bold;color:#111;">&#8377; ${amtFmt} /-</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- DONOR DETAILS + PAYMENT -->
<tr>
<td style="border-bottom:1.5px solid #c9a84c;padding:0;">
<table cellpadding="0" cellspacing="0" width="100%"><tr valign="top">

<td width="54%" style="padding:10px 14px;border-right:1.5px solid #c9a84c;">
<div style="font-size:9px;font-weight:bold;color:#c0185a;margin-bottom:7px;">&#8212; Donor Details (T&amp;C mentioned backside for 80G/10BE) &#8212;</div>
<table cellpadding="0" cellspacing="0" width="100%">
<tr><td width="56" style="font-size:11px;color:#666;padding:3px 0;vertical-align:top;">Name</td><td style="font-size:13px;font-weight:bold;color:#111;padding:3px 0;">${full_name}</td></tr>
<tr><td style="font-size:11px;color:#666;padding:3px 0;vertical-align:top;">Address</td><td style="font-size:11px;color:#111;padding:3px 0;line-height:1.6;">${address || '--'}</td></tr>
<tr><td style="font-size:11px;color:#666;padding:3px 0;">PIN</td><td style="font-size:12px;color:#111;padding:3px 0;">${pin || '--'}</td></tr>
<tr><td style="font-size:11px;color:#666;padding:3px 0;">PAN</td><td style="font-size:12px;font-weight:bold;color:#111;padding:3px 0;">${pan || '--'}</td></tr>
<tr><td style="font-size:11px;color:#666;padding:3px 0;">&#9742;Mobile</td><td style="font-size:12px;font-weight:bold;color:#111;padding:3px 0;">${phone || '--'}</td></tr>
<tr><td style="font-size:11px;color:#666;padding:3px 0;vertical-align:top;">E-mail</td><td style="font-size:11px;color:#111;padding:3px 0;">${email}</td></tr>
${msgRow}
</table>
</td>

<td width="46%" style="padding:10px 14px;">
<div style="font-size:9px;font-weight:bold;color:#c0185a;margin-bottom:4px;">&#8212; Mode of Payment (Cheque / Online / UPI / Cash) &#8212;</div>
<table cellpadding="6" cellspacing="0" width="100%" style="border:1px solid #ccc;background:#fff;margin-bottom:10px;"><tr><td style="font-size:13px;color:#111;">${payMode}</td></tr></table>
<div style="font-size:9px;font-weight:bold;color:#c0185a;margin-bottom:4px;">&#8212; Payment Details (Cheque / Transaction Details) &#8212;</div>
<table cellpadding="6" cellspacing="0" width="100%" style="border:1px solid #ccc;background:#fff;margin-bottom:10px;"><tr><td style="font-size:11px;color:#111;font-family:monospace;word-break:break-all;">${payment_id || '--'}</td></tr></table>
<div style="font-size:9px;font-weight:bold;color:#c0185a;margin-bottom:4px;">&#8212; Purpose of Donation (Corpus / General / Others) &#8212;</div>
<table cellpadding="6" cellspacing="0" width="100%" style="border:1px solid #ccc;background:#fff;"><tr><td style="font-size:13px;color:#111;">${seva_type || 'General'}</td></tr></table>
</td>

</tr></table>
</td>
</tr>

<!-- SIGNATURE -->
<tr>
<td style="border-bottom:1.5px solid #c9a84c;padding:0;">
<table cellpadding="0" cellspacing="0" width="100%"><tr>
<td width="50%" style="padding:30px 14px 10px;border-right:1px solid #c9a84c;text-align:center;vertical-align:bottom;">
<div style="border-top:1px solid #888;padding-top:4px;font-size:10px;color:#666;">Donor Signature for Cash Payment</div>
</td>
<td width="50%" style="padding:10px 14px;text-align:center;vertical-align:bottom;">
<div style="font-size:13px;font-weight:bold;color:#111;margin-bottom:18px;">Rambhadra Das</div>
<div style="font-size:10px;color:#555;margin-bottom:4px;">Temple President, ISKCON Ayodhya</div>
<div style="border-top:1px solid #888;padding-top:4px;font-size:10px;color:#666;">Signature of ISKCON Representative</div>
</td>
</tr></table>
</td>
</tr>

<!-- REGISTERED OFFICE -->
<tr bgcolor="#fffde0">
<td style="border-bottom:1.5px solid #c9a84c;padding:7px 14px;text-align:center;">
<div style="font-size:10px;color:#333;line-height:1.75;">
<strong>Registered Office:</strong> Hare Krishna Land, Juhu, Mumbai - 400 049. &nbsp; &#9742;Mobile: 72088 46210. &nbsp; E-mail: info@iskconindia.org<br/>
Registered under Maharashtra Public Trust Act 1950, vide Regn. No.: F-2179 (Bom). Unique Regn. No. (80G): AAATI0017PF20219
</div>
</td>
</tr>

<!-- TERMS -->
<tr>
<td style="padding:16px 20px 14px;">
<p style="font-size:13px;font-weight:bold;color:#111;margin:0 0 8px;">Please note Terms and Conditions (T&amp;C):</p>
<ul style="font-size:11px;color:#333;line-height:1.9;margin:0;padding-left:16px;">
<li>This donation receipt is an acknowledgement only and not for the purpose of claiming 80G deduction.</li>
<li>Form No. 10BE, i.e., Certificate of donation under clause (ix) of sub-section (5) of section 80G of the Income Tax Act, 1961, will be issued to you as per provisions of Income-tax Act, 1961, and rules made thereunder. Generally 10BE will be issued by 31st May of the following financial year.</li>
<li>For all type of donations, irrespective of amount and mode of payment, full legal name and address with PIN are required. Further PAN is compulsory to obtain Form No. 10BE. Please ensure that the same are mentioned correctly in the donation receipt.</li>
<li>Form No. 10BE is not available for any cash donation.</li>
<li>10BE will be available in PDF version only. Please ensure to mention correct WhatsApp number and E-mail id to receive the same.</li>
<li>PAN is compulsory for all donation of Rs. 50,000/- or more.</li>
<li>In case of payment by cheque, this donation receipt is valid subject to clearance of the cheque.</li>
<li>ISKCON's Unique Registration Number for 80G &#8211; AAATI0017PF20219 is valid till March 31, 2026 and to be renewed thereafter periodically as per provisions of Income-tax Act, 1961, and rules made thereunder.</li>
<li>In case of any error/discrepancy in this receipt, including your Name, address and PAN, E-mail ID, WhatsApp number etc. please contact the receipt issuing centre for correction.</li>
</ul>
<p style="font-size:12px;text-align:center;color:#333;margin:14px 0 3px;">Thank you for your support.</p>
<p style="font-size:12px;text-align:center;color:#333;margin:3px 0 5px;">Please chant</p>
<p style="font-size:14px;font-weight:bold;text-align:center;color:#111;margin:8px 0;letter-spacing:.8px;line-height:1.65;">HARE KRISHNA HARE KRISHNA KRISHNA KRISHNA HARE HARE<br/>HARE RAMA HARE RAMA RAMA &nbsp; RAMA HARE HARE</p>
<p style="font-size:12px;text-align:center;color:#333;margin:3px 0 0;">and be happy.</p>
</td>
</tr>

</table>
</td>

<!-- PTO + YEAR vertical -->
<td width="20" align="center" valign="middle" style="padding-left:4px;">
<div style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:11px;font-weight:bold;color:#555;letter-spacing:3px;">P.T.O.</div>
<br/>
<div style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:11px;font-weight:bold;color:#555;letter-spacing:3px;">${year}</div>
</td>

</tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// 1. BOOKING CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendBookingEmails({ name, email, phone, room_name, check_in, check_out, guests, special_requests, amount }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '--';

  await send(email, 'Booking Enquiry Received - ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}!</p>
    ${p('Your room booking enquiry at <strong>ISKCON Ayodhya Guest House</strong> has been received. Our team will confirm your reservation within 24 hours.')}
    ${box(row('Guest Name',name)+row('Room',room_name)+row('Check-In',fmt(check_in))+row('Check-Out',fmt(check_out))+row('Guests',guests)+(amount?row('Amount Paid','Rs.'+Number(amount).toLocaleString('en-IN')):'')+row('Special Requests',special_requests,true))}
    ${p('Our team will call you at <strong>'+phone+'</strong> to confirm availability. Please carry a valid ID for check-in.')}
    ${hr()}
    ${p('May Lord Krishna and Lord Ram bless you with a blissful stay in the Holy Dham of Ayodhya.','text-align:center;font-style:italic;color:#8a6040;')}
  `));

  await send(ADMIN, 'New Booking: '+name+' - '+room_name, wrap(`
    ${hl('New Booking Request')}
    ${box(row('Guest Name',name)+row('Email',email)+row('Phone',phone)+row('Room',room_name)+row('Check-In',fmt(check_in))+row('Check-Out',fmt(check_out))+row('Guests',guests)+row('Payment',amount?'Rs.'+Number(amount).toLocaleString('en-IN')+' Received':'Pending')+row('Special Requests',special_requests,true))}
    ${p('Please log in to the <a href="'+(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/admin/bookings" style="color:#ed6800;">Admin Panel</a> to confirm or update this booking.')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 2. BOOKING STATUS UPDATE
// ─────────────────────────────────────────────────────────────
export async function sendBookingStatusEmail({ name, email, phone, room_name, check_in, check_out, guests, special_requests, status }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '--';
  const isConfirmed = status === 'confirmed';
  const isCancelled = status === 'cancelled';
  const statusLabel = isConfirmed ? 'Confirmed' : isCancelled ? 'Cancelled' : status;
  const statusColor = isConfirmed ? '#22c55e' : isCancelled ? '#ef4444' : '#ed6800';
  const statusMsg   = isConfirmed ? 'Your booking has been <strong>confirmed</strong>! We look forward to welcoming you to the Holy Dham.'
    : isCancelled ? 'Unfortunately, your booking has been <strong>cancelled</strong>. Please contact us if you have any questions.'
    : 'Your booking status has been updated to <strong>'+status+'</strong>.';

  await send(email, 'Booking '+statusLabel+' - ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}!</p>
    <div style="background:${isConfirmed?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)'};border:1px solid ${statusColor};border-radius:10px;padding:14px 20px;margin:16px 0;text-align:center;">
      <span style="font-size:20px;font-weight:bold;color:${statusColor};">${statusLabel}</span>
    </div>
    ${p(statusMsg)}
    ${box(row('Guest Name',name)+row('Room',room_name)+row('Check-In',fmt(check_in))+row('Check-Out',fmt(check_out))+row('Guests',guests)+row('Special Requests',special_requests,true))}
    ${isConfirmed ? p('Please carry a valid ID for check-in. Check-in: 12:00 PM | Check-out: 10:00 AM. Temple attire required for darshan.') : ''}
    ${hr()}
    ${p('For queries: +91 95173 12508 or info@iskconayodhya.com','text-align:center;color:#8a6040;font-size:13px;')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 3. DONATION / SEVA CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendDonationEmails({ full_name, email, phone, address, pin, pan, seva_type, amount, message, payment_id }) {
  await send(
    email,
    'Donation Receipt - ISKCON Ayodhya (Rs.' + Number(amount).toLocaleString('en-IN') + ')',
    donationReceiptHtml({ full_name, email, phone, address, pin, pan, seva_type, amount, message, payment_id })
  );

  await send(ADMIN, 'Donation Rs.'+Number(amount).toLocaleString('en-IN')+' - '+full_name+' ('+seva_type+')', wrap(`
    ${hl('New Donation - Rs.'+Number(amount).toLocaleString('en-IN'))}
    ${box(row('Donor Name',full_name)+row('Email',email)+row('Phone',phone||'--')+row('Seva Type',seva_type)+row('Amount','Rs.'+Number(amount).toLocaleString('en-IN'))+(payment_id?row('Payment ID',payment_id):'')+row('Dedication',message,true))}
    ${p('Please update the donor record in the <a href="'+(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/admin/donations" style="color:#ed6800;">Admin Panel</a>.')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 4. EVENT REGISTRATION CONFIRMATION
// ─────────────────────────────────────────────────────────────
export async function sendRegistrationEmails({ first_name, last_name, email, phone, event_name, attendees, city, special_requests }) {
  const name = (first_name+' '+(last_name||'')).trim();

  await send(email, 'Registration Confirmed: '+event_name+' - ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${first_name}!</p>
    ${p('You are now registered for <strong>'+event_name+'</strong> at ISKCON Ayodhya! We are delighted to welcome you to this sacred celebration.')}
    ${box(row('Name',name)+row('Event',event_name)+row('Attendees',(attendees||1)+' person(s)')+(city?row('City',city):'')+(phone?row('Contact',phone):'')+row('Special Needs',special_requests,true))}
    ${p('Please arrive 30 minutes before the event. Wear traditional attire. Prasadam will be served free of charge.')}
    ${hr()}
    ${p('We look forward to celebrating with you! Hare Krishna!','text-align:center;font-style:italic;color:#8a6040;')}
  `));

  await send(ADMIN, 'New Registration: '+name+' - '+event_name, wrap(`
    ${hl('New Event Registration')}
    ${box(row('Name',name)+row('Email',email)+row('Phone',phone||'--')+row('Event',event_name)+row('Attendees',attendees||1)+(city?row('City',city):'')+row('Special Needs',special_requests,true))}
    ${p('View all registrations in the <a href="'+(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/admin/registrations" style="color:#ed6800;">Admin Panel</a>.')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 5. CONTACT / INQUIRY
// ─────────────────────────────────────────────────────────────
export async function sendContactEmails({ name, email, phone, subject, message }) {
  await send(email, 'Message Received - ISKCON Ayodhya', wrap(`
    <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${name}!</p>
    ${p('Thank you for reaching out to ISKCON Ayodhya. We have received your message and our team will respond within 24 hours.')}
    ${box(row('Your Name',name)+row('Email',email)+row('Phone',phone||'--')+row('Subject',subject)+row('Message',message,true))}
    ${p('If urgent, reach us at: +91 95173 12508 | info@iskconayodhya.com')}
    ${hr()}
    ${p('Hare Krishna! We look forward to serving you.','text-align:center;font-style:italic;color:#8a6040;')}
  `));

  await send(ADMIN, 'Inquiry: '+subject+' - '+name, wrap(`
    ${hl('New Website Inquiry')}
    ${box(row('Name',name)+row('Email',email)+row('Phone',phone||'--')+row('Subject',subject)+row('Message',message,true))}
    ${p('Reply directly, or visit <a href="'+(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/admin/inquiries" style="color:#ed6800;">Admin Panel</a> to manage inquiries.')}
  `));
}

// ─────────────────────────────────────────────────────────────
// 6. LIFE MEMBERSHIP
// ─────────────────────────────────────────────────────────────
export async function sendLifeMembershipEmails({ full_name, email, phone, city, state, amount, payment_id }) {
  await send(
    email,
    'Life Membership Confirmed — ISKCON Ayodhya 🙏',
    wrap(`
      <p style="font-size:18px;color:#c45500;font-weight:bold;margin-bottom:8px;">Hare Krishna, ${full_name}!</p>
      ${p('Congratulations! Your Life Membership at <strong>ISKCON Ayodhya</strong> has been successfully registered. Welcome to our sacred family!')}
      ${box(
        row('Member Name', full_name) +
        row('Email', email) +
        row('Phone', phone || '--') +
        (city ? row('City', city + (state ? ', ' + state : '')) : '') +
        row('Contribution', '₹' + Number(amount).toLocaleString('en-IN')) +
        (payment_id ? row('Payment ID', payment_id) : '')
      )}
      ${p('Your membership certificate and 80G tax receipt will be dispatched within 15 working days. For any queries, contact us at +91 95173 12508.')}
      ${hr()}
      ${p('May Lord Krishna bless you and your family abundantly! Hare Krishna! 🙏', 'text-align:center;font-style:italic;color:#8a6040;')}
    `)
  );

  await send(ADMIN, 'New Life Member: ' + full_name + ' — ₹' + Number(amount).toLocaleString('en-IN'), wrap(`
    ${hl('New Life Membership Application')}
    ${box(
      row('Name', full_name) +
      row('Email', email) +
      row('Phone', phone || '--') +
      (city ? row('City', city + (state ? ', ' + state : '')) : '') +
      row('Contribution', '₹' + Number(amount).toLocaleString('en-IN')) +
      (payment_id ? row('Payment ID', payment_id) : '')
    )}
    ${p('View all applications in the <a href="' + (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/admin/life-membership" style="color:#ed6800;">Admin Panel</a>.')}
  `));
}

export async function sendAdminOtpEmail({ email, otp, name }) {
  await send(
    email,
    'ISKCON Ayodhya Admin — Password Reset OTP',
    wrap(`
      ${hl('Password Reset OTP')}
      ${p('Dear ' + (name || 'Admin') + ',')}
      ${p('You requested a password reset for your ISKCON Ayodhya Admin account. Use the OTP below:')}
      <div style="text-align:center;margin:2rem 0;">
        <div style="display:inline-block;background:#1a0800;border:2px solid #ed6800;border-radius:1rem;padding:1.5rem 3rem;">
          <p style="font-size:2.5rem;font-weight:900;letter-spacing:.4em;color:#ed6800;margin:0;font-family:monospace;">${otp}</p>
        </div>
        <p style="color:#888;font-size:.85rem;margin-top:1rem;">Valid for 10 minutes only</p>
      </div>
      ${p('If you did not request this, please ignore this email. Your password will not be changed.')}
      ${hr()}
      ${p('Hare Krishna 🙏 — ISKCON Ayodhya Admin', 'text-align:center;color:#8a6040;font-style:italic;')}
    `)
  );
}
