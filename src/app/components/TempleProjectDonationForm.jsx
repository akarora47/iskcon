'use client';
import { useState } from 'react';
import Link from 'next/link';
import { rules, hasErrors } from '@/lib/validate';

const fLabel = { display:'block', fontSize:'.75rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = (err) => ({ width:'100%', padding:'.72rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.7rem', marginTop:'.28rem', display:'block' };

const EMPTY_ERR = { full_name:'', email:'', phone:'', pin:'', pan:'', amount:'' };

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function TempleProjectDonationForm({ projectTitle, projectSlug, donationSettings }) {
  const tilePrice   = donationSettings?.tile_price        || 6000;
  const minNormal   = donationSettings?.normal_min_amount || 1000;
  const normalLabel = donationSettings?.normal_label      || 'Donation';
  const tileLabel   = donationSettings?.tile_label        || 'Tiles / Square Donation';
  const tileDesc    = donationSettings?.tile_description  || '';
  const normalOn    = donationSettings?.normal_enabled !== 0;
  const tileOn      = donationSettings?.tile_enabled   !== 0;

  const [mode,    setMode]    = useState(normalOn ? 'normal' : 'tile');
  const [tiles,   setTiles]   = useState(1);
  const [form,    setForm]    = useState({ full_name:'', email:'', phone:'', address:'', pin:'', pan:'', amount: '', message:'' });
  const [errors,  setErrors]  = useState(EMPTY_ERR);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [payError,setPayError]= useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]:'' })); };
  const blur = (k, rule) => () => setErrors(er => ({ ...er, [k]: rule(form[k]) }));

  const finalAmount = mode === 'tile' ? tiles * tilePrice : Number(form.amount) || 0;

  const validate = () => {
    const amountVal = String(finalAmount);
    const errs = {
      full_name: rules.name(form.full_name),
      email:     rules.email(form.email),
      phone:     rules.phone(form.phone),
      pin:       rules.pin(form.pin),
      pan:       rules.pan(form.pan),
      amount:    mode === 'normal' ? rules.amount(form.amount, minNormal) : (finalAmount >= tilePrice ? '' : 'Select at least 1 tile'),
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
        body: JSON.stringify({ amount: finalAmount, type: 'donation' }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error || 'Could not create order.'); setLoading(false); return; }

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        'ISKCON Ayodhya',
        description: mode === 'tile' ? `${tiles} Tile(s) — ${projectTitle}` : projectTitle,
        image:       '/favicon.ico',
        order_id:    orderData.order_id,
        prefill:     { name: form.full_name, email: form.email, contact: form.phone },
        theme:       { color: '#ed6800' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              type: 'donation', order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id, signature: response.razorpay_signature,
              data: {
                seva_type:    mode === 'tile' ? `${projectTitle} — ${tiles} Tile(s)` : projectTitle,
                donation_mode: mode, tiles: mode === 'tile' ? tiles : null,
                tile_price:   mode === 'tile' ? tilePrice : null,
                full_name: form.full_name, email: form.email, phone: form.phone,
                address: form.address, pin: form.pin, pan: form.pan,
                amount: finalAmount, message: form.message,
              },
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) setDone(true);
          else setPayError(verifyData.error || 'Verification failed.');
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', r => { setPayError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch {
      setPayError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1.5rem', padding:'2rem', textAlign:'center', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
      <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🙏</div>
      <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna! Donation Received!</h3>
      <p style={{ fontSize:'.9rem', color:'#555', lineHeight:1.75 }}>
        Your donation of <strong>₹{finalAmount.toLocaleString('en-IN')}</strong> for <strong>{projectTitle}</strong> is confirmed.
        A receipt was sent to <strong>{form.email}</strong>. May the Lord bless you! 🌺
      </p>
      <p style={{ fontSize:'.75rem', color:'#aaa', marginTop:'.75rem' }}>80G tax benefit receipt will be emailed within 7 working days.</p>
    </div>
  );

  return (
    <div>

        {/* Mode Toggle */}
        {normalOn && tileOn && (
          <div style={{ display:'flex', background:'rgba(237,104,0,.07)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'.3rem', marginBottom:'1.5rem', gap:'.3rem' }}>
            {[['normal', normalLabel], ['tile', tileLabel]].map(([m, lbl]) => (
              <button key={m} type="button" onClick={() => setMode(m)} style={{
                flex:1, padding:'.6rem .5rem', borderRadius:'.75rem', border:'none', cursor:'pointer',
                background: mode === m ? 'linear-gradient(135deg,#c45500,#ed6800)' : 'transparent',
                color: mode === m ? 'white' : '#666',
                fontWeight: mode === m ? 700 : 500, fontSize:'.8rem',
                transition:'all .2s', fontFamily:'var(--font-poppins),sans-serif',
                boxShadow: mode === m ? '0 4px 12px rgba(237,104,0,.3)' : 'none',
              }}>
                {m === 'normal' ? '💰' : '🧱'} {lbl}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* NORMAL DONATION */}
          {mode === 'normal' && (
            <div>
              <label style={fLabel}>Donation Amount (₹) * <span style={{ textTransform:'none', color:'#aaa', fontSize:'.65rem' }}>Min ₹{minNormal.toLocaleString('en-IN')}</span></label>
              {/* Quick amount chips */}
              <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap', marginBottom:'.5rem' }}>
                {[1000,2500,5000,11000,21000,51000].filter(a => a >= minNormal).slice(0,5).map(a => (
                  <button key={a} type="button" onClick={() => { setForm(f=>({...f,amount:a})); setErrors(er=>({...er,amount:''})); }}
                    style={{ padding:'.35rem .8rem', borderRadius:'2rem', border:`1.5px solid ${form.amount==a?'#ed6800':'rgba(196,85,0,.2)'}`, background:form.amount==a?'rgba(237,104,0,.08)':'transparent', color:form.amount==a?'#ed6800':'#666', fontSize:'.75rem', fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                    ₹{a.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input type="number" min={minNormal} step="1" style={fInput(errors.amount)} value={form.amount}
                onChange={set('amount')} onBlur={() => setErrors(er => ({ ...er, amount: rules.amount(form.amount, minNormal) }))} placeholder={`Min ₹${minNormal.toLocaleString('en-IN')}`} />
              {errors.amount && <span style={errMsg}>⚠ {errors.amount}</span>}
            </div>
          )}

          {/* TILE DONATION */}
          {mode === 'tile' && (
            <div style={{ background:'rgba(237,104,0,.05)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'1.25rem' }}>
              {tileDesc && <p style={{ fontSize:'.82rem', color:'#555', lineHeight:1.7, marginBottom:'1rem' }}>{tileDesc}</p>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div>
                  <p style={{ fontSize:'.7rem', color:'#888', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>Price per Tile</p>
                  <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.2rem', fontWeight:700, color:'#ed6800' }}>₹{tilePrice.toLocaleString('en-IN')}</p>
                </div>
                {/* Tile counter */}
                <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                  <button type="button" onClick={() => setTiles(t => Math.max(1,t-1))}
                    style={{ width:'2rem', height:'2rem', borderRadius:'50%', border:'2px solid rgba(237,104,0,.3)', background:'transparent', cursor:'pointer', fontSize:'1.1rem', color:'#ed6800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>−</button>
                  <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.4rem', fontWeight:900, color:'#111', minWidth:'2rem', textAlign:'center' }}>{tiles}</span>
                  <button type="button" onClick={() => setTiles(t => t+1)}
                    style={{ width:'2rem', height:'2rem', borderRadius:'50%', background:'linear-gradient(135deg,#c45500,#ed6800)', border:'none', cursor:'pointer', fontSize:'1.1rem', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
                </div>
              </div>
              {/* Summary */}
              <div style={{ background:'white', borderRadius:'.875rem', padding:'1rem', border:'1px solid rgba(237,104,0,.12)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem' }}>
                  <span style={{ fontSize:'.8rem', color:'#666' }}>Number of Tiles</span>
                  <span style={{ fontSize:'.8rem', fontWeight:700, color:'#111' }}>{tiles}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem' }}>
                  <span style={{ fontSize:'.8rem', color:'#666' }}>Cost per Tile</span>
                  <span style={{ fontSize:'.8rem', fontWeight:700, color:'#111' }}>₹{tilePrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height:'1px', background:'rgba(0,0,0,.06)', margin:'.5rem 0' }} />
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'.88rem', fontWeight:700, color:'#111' }}>Total Donation</span>
                  <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:900, color:'#ed6800' }}>₹{(tiles*tilePrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Donor details */}
          <div>
            <label style={fLabel}>Full Name *</label>
            <input style={fInput(errors.full_name)} type="text" placeholder="Your full name" value={form.full_name}
              onChange={set('full_name')} onBlur={blur('full_name', rules.name)} />
            {errors.full_name && <span style={errMsg}>⚠ {errors.full_name}</span>}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
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
          </div>

          <div>
            <label style={fLabel}>Address</label>
            <input style={fInput(false)} type="text" placeholder="Your full address" value={form.address} onChange={set('address')} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
            <div>
              <label style={fLabel}>PIN Code</label>
              <input style={fInput(errors.pin)} type="text" maxLength={6} placeholder="6-digit PIN" value={form.pin}
                onChange={set('pin')} onBlur={blur('pin', rules.pin)} />
              {errors.pin && <span style={errMsg}>⚠ {errors.pin}</span>}
            </div>
            <div>
              <label style={fLabel}>PAN <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(for 80G)</span></label>
              <input style={fInput(errors.pan)} type="text" maxLength={10} placeholder="ABCDE1234F" value={form.pan}
                onChange={set('pan')} onBlur={() => { const v=form.pan.toUpperCase(); setForm(f=>({...f,pan:v})); setErrors(er=>({...er,pan:rules.pan(v)})); }} />
              {errors.pan && <span style={errMsg}>⚠ {errors.pan}</span>}
            </div>
          </div>

          <div>
            <label style={fLabel}>Dedication / Message</label>
            <textarea style={{ ...fInput(false), minHeight:'65px', resize:'vertical' }} placeholder="In memory of / dedicated to..." value={form.message} onChange={set('message')} />
          </div>

          {/* Total display */}
          <div style={{ background:'rgba(237,104,0,.06)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'.875rem', padding:'.875rem 1.1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'.82rem', color:'#666' }}>Total Donation</span>
            <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.2rem', fontWeight:900, color:'#ed6800' }}>₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>

          {payError && (
            <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.5rem .75rem', margin:0 }}>⚠ {payError}</p>
          )}

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'1rem', borderRadius:'2rem', border:'none', background: loading?'rgba(237,104,0,.4)':'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontSize:'1rem', fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all .2s', opacity:loading?0.7:1, fontFamily:'var(--font-poppins),sans-serif', boxShadow:'0 8px 24px rgba(237,104,0,.3)' }}>
            {loading ? '⏳ Opening Payment…' : `💳 Pay ₹${finalAmount.toLocaleString('en-IN')}`}
          </button>
          <p style={{ fontSize:'.7rem', color:'#aaa', textAlign:'center', margin:0 }}>Secured by Razorpay · 100% safe · 80G eligible</p>

        </form>
    </div>
  );
}
