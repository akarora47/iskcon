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

const EMPTY = { full_name: '', email: '', phone: '', address: '', city: '', state: '', country: 'India', date_of_birth: '', notes: '' };

export default function LifeMembershipForm({ membershipFee = 100000 }) {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [payError, setPayError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = '10-digit mobile required';
    if (!form.city.trim()) errs.city = 'City is required';
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

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: membershipFee, type: 'life_membership' }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error || 'Could not create order.'); setLoading(false); return; }

      const rzp = new window.Razorpay({
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:   orderData.amount,
        currency: orderData.currency,
        name:     'ISKCON Ayodhya',
        description: 'Life Membership Contribution',
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
              type: 'life_membership',
              data: { ...form, amount: membershipFee },
            }),
          });
          const vd = await verifyRes.json();
          if (verifyRes.ok) { setDone(true); setForm(EMPTY); }
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
    <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
      <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.2rem', color: '#c45500', marginBottom: '.75rem' }}>Welcome to the ISKCON Family!</h3>
      <p style={{ color: '#555', lineHeight: 1.75 }}>Your Life Membership has been confirmed. A receipt and membership details have been sent to your email.</p>
      <p style={{ fontSize: '.8rem', color: '#aaa', marginTop: '.75rem' }}>Your membership certificate will be dispatched within 15 working days.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Contribution amount display */}
      <div style={{ background: 'linear-gradient(135deg,rgba(196,85,0,.08),rgba(237,104,0,.06))', border: '1.5px solid rgba(237,104,0,.25)', borderRadius: '1rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.2rem' }}>Membership Contribution</p>
          <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.4rem', fontWeight: 900, color: '#c45500', margin: 0 }}>₹{Number(membershipFee).toLocaleString('en-IN')}</p>
        </div>
        <span style={{ fontSize: '2rem' }}>🌸</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
        <div>
          <label style={lStyle}>Full Name *</label>
          <input style={iStyle(errors.full_name)} value={form.full_name} onChange={set('full_name')} placeholder="Your full name" />
          {errors.full_name && <span style={errStyle}>⚠ {errors.full_name}</span>}
        </div>
        <div>
          <label style={lStyle}>Mobile Number *</label>
          <input style={iStyle(errors.phone)} value={form.phone} onChange={set('phone')} placeholder="10-digit number" maxLength={10} />
          {errors.phone && <span style={errStyle}>⚠ {errors.phone}</span>}
        </div>
      </div>

      <div>
        <label style={lStyle}>Email Address *</label>
        <input type="email" style={iStyle(errors.email)} value={form.email} onChange={set('email')} placeholder="name@example.com" />
        {errors.email && <span style={errStyle}>⚠ {errors.email}</span>}
      </div>

      <div>
        <label style={lStyle}>Address</label>
        <textarea rows={2} style={{ ...iStyle(false), resize: 'vertical', minHeight: '60px' }} value={form.address} onChange={set('address')} placeholder="House / Flat no., Street, Area" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
        <div>
          <label style={lStyle}>City *</label>
          <input style={iStyle(errors.city)} value={form.city} onChange={set('city')} placeholder="City" />
          {errors.city && <span style={errStyle}>⚠ {errors.city}</span>}
        </div>
        <div>
          <label style={lStyle}>State</label>
          <input style={iStyle(false)} value={form.state} onChange={set('state')} placeholder="State" />
        </div>
        <div>
          <label style={lStyle}>Country</label>
          <input style={iStyle(false)} value={form.country} onChange={set('country')} />
        </div>
      </div>

      <div>
        <label style={lStyle}>Date of Birth</label>
        <input type="date" style={iStyle(false)} value={form.date_of_birth} onChange={set('date_of_birth')} />
      </div>

      <div>
        <label style={lStyle}>Additional Notes</label>
        <textarea rows={3} style={{ ...iStyle(false), resize: 'vertical', minHeight: '70px' }} value={form.notes} onChange={set('notes')} placeholder="Any special requests or notes..." />
      </div>

      {payError && (
        <div style={{ background: 'rgba(229,62,62,.07)', border: '1px solid rgba(229,62,62,.25)', borderRadius: '.75rem', padding: '.75rem 1rem' }}>
          <p style={{ color: '#e53e3e', fontSize: '.85rem', margin: 0 }}>⚠ {payError}</p>
        </div>
      )}

      <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '2rem', border: 'none', background: loading ? 'rgba(196,85,0,.4)' : 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 8px 24px rgba(237,104,0,.35)', fontFamily: 'inherit', letterSpacing: '.01em', transition: 'all .2s' }}>
        {loading ? '⏳ Processing…' : `🌸 Pay ₹${Number(membershipFee).toLocaleString('en-IN')} & Become a Member`}
      </button>

      <p style={{ fontSize: '.72rem', color: '#aaa', textAlign: 'center', lineHeight: 1.5 }}>Secured by Razorpay · 80G receipt within 15 working days</p>
    </form>
  );
}
