'use client';
import { useState } from 'react';
import { rules, hasErrors } from '@/lib/validate';

const fLabel = { display:'block', fontSize:'.73rem', fontWeight:600, color:'#555', marginBottom:'.3rem', textTransform:'uppercase', letterSpacing:'.07em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = (err) => ({ width:'100%', padding:'.65rem .9rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.18)'}`, borderRadius:'.75rem', fontSize:'.88rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'#fafafa', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.68rem', marginTop:'.25rem', display:'block' };

const EMPTY_FORM = (amt) => ({ full_name:'', email:'', phone:'', address:'', pin:'', pan:'', amount: amt || '', message:'' });
const EMPTY_ERR  = { full_name:'', email:'', phone:'', pin:'', pan:'', amount:'' };

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function SevaInlineForm({ sevaTitle, suggestedAmount, amountType = 'variable' }) {
  const [form, setForm]       = useState(EMPTY_FORM(suggestedAmount));
  const [errors, setErrors]   = useState(EMPTY_ERR);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [payError, setPayError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]:'' })); };
  const blur = (k, rule) => () => setErrors(er => ({ ...er, [k]: rule(form[k]) }));

  const validate = () => {
    const errs = {
      full_name: rules.name(form.full_name),
      email:     rules.email(form.email),
      phone:     rules.phone(form.phone),
      pin:       rules.pin(form.pin),
      pan:       rules.pan(form.pan),
      amount:    rules.amount(form.amount),
    };
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setPayError('');
    try {
      const ok = await loadRazorpay();
      if (!ok) { setPayError('Payment gateway failed to load.'); setLoading(false); return; }

      const orderRes = await fetch('/api/payment/create-order', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ amount: Number(form.amount) }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error || 'Could not create order.'); setLoading(false); return; }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, currency: orderData.currency,
        name: 'ISKCON Ayodhya', description: sevaTitle, image: '/favicon.ico',
        order_id: orderData.order_id,
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: '#ed6800' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              type:'donation',
              order_id:   response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature:  response.razorpay_signature,
              data: {
                seva_type: sevaTitle,
                full_name: form.full_name,
                email:     form.email,
                phone:     form.phone,
                address:   form.address,
                pin:       form.pin,
                pan:       form.pan,
                amount:    Number(form.amount),
                message:   form.message,
              },
            }),
          });
          if (verifyRes.ok) setDone(true);
          else setPayError('Payment verification failed. Please contact support.');
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', (r) => { setPayError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch { setPayError('Network error. Please try again.'); setLoading(false); }
  };

  if (done) return (
    <div style={{ textAlign:'center', padding:'2rem 0' }}>
      <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🙏</div>
      <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'#111', marginBottom:'.5rem' }}>Hare Krishna! Seva Received</h4>
      <p style={{ fontSize:'.85rem', color:'#555', lineHeight:1.7 }}>Receipt sent to <strong>{form.email}</strong>.<br/>May the Lord's grace always be upon you.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>

      <div>
        <label style={fLabel}>Full Name *</label>
        <input style={fInput(errors.full_name)} type="text" placeholder="Your full name" value={form.full_name}
          onChange={set('full_name')} onBlur={blur('full_name', rules.name)} />
        {errors.full_name && <span style={errMsg}>⚠ {errors.full_name}</span>}
      </div>

      <div>
        <label style={fLabel}>Email *</label>
        <input style={fInput(errors.email)} type="email" placeholder="name@example.com" value={form.email}
          onChange={set('email')} onBlur={blur('email', rules.email)} />
        {errors.email && <span style={errMsg}>⚠ {errors.email}</span>}
      </div>

      <div>
        <label style={fLabel}>Phone * <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(10 digits)</span></label>
        <input style={fInput(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
          onChange={set('phone')} onBlur={blur('phone', rules.phone)} />
        {errors.phone && <span style={errMsg}>⚠ {errors.phone}</span>}
      </div>

      <div>
        <label style={fLabel}>Address</label>
        <input style={fInput(false)} type="text" placeholder="Your full address" value={form.address} onChange={set('address')} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'.75rem' }}>
        <div>
          <label style={fLabel}>PIN Code</label>
          <input style={fInput(errors.pin)} type="text" maxLength={6} placeholder="6-digit PIN" value={form.pin}
            onChange={set('pin')} onBlur={blur('pin', rules.pin)} />
          {errors.pin && <span style={errMsg}>⚠ {errors.pin}</span>}
        </div>
        <div>
          <label style={fLabel}>PAN <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(80G)</span></label>
          <input style={fInput(errors.pan)} type="text" maxLength={10} placeholder="ABCDE1234F" value={form.pan}
            onChange={e => { const v = e.target.value.toUpperCase(); setForm(f => ({...f, pan:v})); setErrors(er => ({...er, pan:''})); }}
            onBlur={() => { const v = form.pan.toUpperCase(); setForm(f => ({...f, pan:v})); setErrors(er => ({...er, pan: rules.pan(v)})); }} />
          {errors.pan && <span style={errMsg}>⚠ {errors.pan}</span>}
        </div>
      </div>

      <div>
        <label style={fLabel}>Amount (Rs.) *</label>
        {amountType === 'fixed' ? (
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.75rem 1rem', background:'rgba(237,104,0,.07)', border:'1.5px solid rgba(237,104,0,.25)', borderRadius:'.75rem' }}>
            <span style={{ fontSize:'1.1rem', fontWeight:700, color:'#c45500', fontFamily:'var(--font-cinzel),sans-serif' }}>Rs. {Number(form.amount).toLocaleString('en-IN')}</span>
            <span style={{ fontSize:'.72rem', color:'#888', background:'rgba(0,0,0,.05)', padding:'.2rem .6rem', borderRadius:'2rem' }}>🔒 Fixed amount</span>
          </div>
        ) : (
          <input style={fInput(errors.amount)} type="number" min="1" placeholder="Enter amount" value={form.amount}
            onChange={set('amount')} onBlur={blur('amount', rules.amount)} />
        )}
        {errors.amount && amountType !== 'fixed' && <span style={errMsg}>⚠ {errors.amount}</span>}
      </div>

      <div>
        <label style={fLabel}>Dedication / Message</label>
        <textarea style={{ ...fInput(false), minHeight:'65px', resize:'vertical' }}
          placeholder="In memory of / dedicated to..." value={form.message} onChange={set('message')} />
      </div>

      {payError && (
        <p style={{ color:'#e53e3e', fontSize:'.78rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.18)', borderRadius:'.5rem', padding:'.5rem .75rem', margin:0 }}>⚠ {payError}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width:'100%', justifyContent:'center', border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop:'.25rem' }}>
        {loading ? '⏳ Opening Payment…' : '💳 Donate Now'}
      </button>
      <p style={{ fontSize:'.68rem', color:'#aaa', textAlign:'center' }}>Secured by Razorpay · 80G eligible · 100% secure</p>
    </form>
  );
}
