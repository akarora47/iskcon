'use client';
import { useState } from 'react';

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const iStyle = (err) => ({
  width: '100%', padding: '.75rem 1rem',
  border: `1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.25)'}`,
  borderRadius: '.75rem', fontSize: '.9rem', color: '#111',
  background: 'white', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color .2s',
});
const lStyle = { display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#555', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.07em' };
const errStyle = { color: '#e53e3e', fontSize: '.7rem', marginTop: '.25rem', display: 'block' };

export default function LifeMembershipDonationForm({ suggestedAmounts = [1001, 2100, 5100, 11000, 21000] }) {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '', amount: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [payError, setPayError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };
  const pickAmount = (a) => { setForm(f => ({ ...f, amount: String(a) })); setErrors(er => ({ ...er, amount: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = '10-digit mobile required';
    const amt = Number(form.amount);
    if (!amt || amt < 100) errs.amount = 'Minimum donation ₹100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setPayError('');
    try {
      const ok = await loadRazorpay();
      if (!ok) { setPayError('Payment gateway failed to load.'); setLoading(false); return; }

      const amount = Number(form.amount);
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: 'life_membership_donation' }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error || 'Could not create order.'); setLoading(false); return; }

      const rzp = new window.Razorpay({
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:   orderData.amount,
        currency: orderData.currency,
        name:     'ISKCON Ayodhya',
        description: 'Donation — Life Membership Page',
        image:    '/favicon.ico',
        order_id: orderData.order_id,
        prefill:  { name: form.full_name, email: form.email, contact: form.phone },
        theme:    { color: '#ed6800' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              type: 'life_membership_donation',
              data: { full_name: form.full_name, email: form.email, phone: form.phone, amount, message: form.message },
            }),
          });
          const vd = await verifyRes.json();
          if (verifyRes.ok) { setDone(true); setForm({ full_name: '', email: '', phone: '', amount: '', message: '' }); }
          else setPayError(vd.error || 'Verification failed.');
          setLoading(false);
        },
      });
      rzp.on('payment.failed', r => { setPayError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch (err) {
      setPayError(err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🙏</div>
      <h3 style={{ color: '#c45500', marginBottom: '.5rem', fontFamily: 'var(--font-cinzel),serif' }}>Thank You!</h3>
      <p style={{ color: '#555', lineHeight: 1.75 }}>Your generous donation has been received. A receipt has been sent to your email.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Suggested amounts */}
      {suggestedAmounts.length > 0 && (
        <div>
          <label style={lStyle}>Choose Amount</label>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
            {suggestedAmounts.map(a => (
              <button key={a} type="button" onClick={() => pickAmount(a)}
                style={{ padding: '.45rem 1rem', borderRadius: '2rem', border: `1.5px solid ${String(form.amount) === String(a) ? '#ed6800' : 'rgba(196,85,0,.25)'}`, background: String(form.amount) === String(a) ? 'linear-gradient(135deg,#c45500,#ed6800)' : 'white', color: String(form.amount) === String(a) ? 'white' : '#c45500', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>
                ₹{Number(a).toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span style={{ fontSize: '.85rem', color: '#888' }}>or enter amount:</span>
            <input type="number" min="100" style={{ ...iStyle(errors.amount), flex: 1 }} value={form.amount} onChange={set('amount')} placeholder="Custom amount (₹)" />
          </div>
          {errors.amount && <span style={errStyle}>⚠ {errors.amount}</span>}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        <div>
          <label style={lStyle}>Full Name *</label>
          <input style={iStyle(errors.full_name)} value={form.full_name} onChange={set('full_name')} placeholder="Your name" />
          {errors.full_name && <span style={errStyle}>⚠ {errors.full_name}</span>}
        </div>
        <div>
          <label style={lStyle}>Mobile *</label>
          <input style={iStyle(errors.phone)} value={form.phone} onChange={set('phone')} placeholder="10-digit number" maxLength={10} />
          {errors.phone && <span style={errStyle}>⚠ {errors.phone}</span>}
        </div>
      </div>

      <div>
        <label style={lStyle}>Email *</label>
        <input type="email" style={iStyle(errors.email)} value={form.email} onChange={set('email')} placeholder="name@example.com" />
        {errors.email && <span style={errStyle}>⚠ {errors.email}</span>}
      </div>

      <div>
        <label style={lStyle}>Message (optional)</label>
        <textarea rows={2} style={{ ...iStyle(false), resize: 'vertical', minHeight: '60px' }} value={form.message} onChange={set('message')} placeholder="Dedication or message..." />
      </div>

      {payError && (
        <div style={{ background: 'rgba(229,62,62,.07)', border: '1px solid rgba(229,62,62,.25)', borderRadius: '.75rem', padding: '.75rem 1rem' }}>
          <p style={{ color: '#e53e3e', fontSize: '.85rem', margin: 0 }}>⚠ {payError}</p>
        </div>
      )}

      <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '2rem', border: 'none', background: loading ? 'rgba(196,85,0,.4)' : 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 8px 24px rgba(237,104,0,.35)', fontFamily: 'inherit', transition: 'all .2s' }}>
        {loading ? '⏳ Processing…' : `🙏 Donate${form.amount ? ' ₹' + Number(form.amount).toLocaleString('en-IN') : ' Now'}`}
      </button>

      <p style={{ fontSize: '.72rem', color: '#aaa', textAlign: 'center' }}>Secured by Razorpay · Receipt sent to your email</p>
    </form>
  );
}
