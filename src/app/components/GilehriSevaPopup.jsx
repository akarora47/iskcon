'use client';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { rules, hasErrors } from '@/lib/validate';

const STYLES = `
@keyframes gs-in  { from{opacity:0;transform:scale(.88) translateY(28px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes gs-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.gs-card { animation:gs-in .4s cubic-bezier(.34,1.56,.64,1) both; }
.gs-icon { animation:gs-bob 2.8s ease-in-out infinite; }
`;

const fL = { display:'block', fontSize:'.73rem', fontWeight:600, color:'#444', marginBottom:'.32rem', textTransform:'uppercase', letterSpacing:'.07em', fontFamily:'var(--font-poppins),sans-serif' };
const fI = (err) => ({ width:'100%', padding:'.68rem .95rem', border:`1.5px solid ${err?'#e53e3e':'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.88rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'#fafafa', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const eM = { color:'#e53e3e', fontSize:'.68rem', marginTop:'.25rem', display:'block' };

const EMPTY = { full_name:'', email:'', phone:'', pan:'', amount:'' };
const EERR  = { full_name:'', email:'', phone:'', pan:'', amount:'' };

function loadRazorpay() {
  return new Promise(res => {
    if (window.Razorpay) return res(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = ()=>res(true); s.onerror = ()=>res(false);
    document.body.appendChild(s);
  });
}

export default function GilehriSevaPopup({ isOpen, onClose, gilehri, projectTitle }) {
  const [mounted,  setMounted]  = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState(EERR);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!document.getElementById('gs-css')) {
      const el = document.createElement('style'); el.id='gs-css'; el.textContent=STYLES; document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow='hidden'; setDone(false); setPayError(''); setErrors(EERR); setForm(EMPTY); }
    else         document.body.style.overflow='';
    return () => { document.body.style.overflow=''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = e => { if (e.key==='Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  const set  = k => e => { setForm(f=>({...f,[k]:e.target.value})); setErrors(er=>({...er,[k]:''})); };
  const blur = (k,rule) => () => setErrors(er=>({...er,[k]:rule(form[k])}));

  const validate = () => {
    const errs = {
      full_name: rules.name(form.full_name),
      email:     rules.email(form.email),
      phone:     rules.phone(form.phone),
      pan:       rules.pan(form.pan),
      amount:    form.amount && Number(form.amount) >= 1 ? '' : 'Enter a valid amount',
    };
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setPayError('');
    try {
      const ok = await loadRazorpay();
      if (!ok) { setPayError('Payment gateway failed to load.'); setLoading(false); return; }

      const orderRes = await fetch('/api/payment/create-order', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ amount: Number(form.amount), type:'donation' }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error||'Could not create order.'); setLoading(false); return; }

      const rzpOptions = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        'ISKCON Ayodhya',
        description: `Gilehari Seva — ${projectTitle}`,
        image:       '/favicon.ico',
        order_id:    orderData.order_id,
        prefill:     { name:form.full_name, email:form.email, contact:form.phone },
        theme:       { color:'#ed6800' },
        handler: async response => {
          const verifyRes = await fetch('/api/payment/verify', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              type:'donation', order_id:response.razorpay_order_id,
              payment_id:response.razorpay_payment_id, signature:response.razorpay_signature,
              data:{ seva_type:`Gilehari Seva — ${projectTitle}`, full_name:form.full_name,
                     email:form.email, phone:form.phone, pan:form.pan, amount:Number(form.amount) },
            }),
          });
          const vd = await verifyRes.json();
          if (verifyRes.ok) setDone(true);
          else setPayError(vd.error||'Verification failed.');
          setLoading(false);
        },
        modal: { ondismiss: ()=>setLoading(false) },
      };
      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', r=>{ setPayError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch { setPayError('Network error. Please try again.'); setLoading(false); }
  };

  if (!mounted || !isOpen) return null;

  const suggested = Array.isArray(gilehri?.suggested_amounts) && gilehri.suggested_amounts.length
    ? gilehri.suggested_amounts
    : [101, 251, 501, 1001, 2101, 5100];

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(8,3,0,.75)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)' }} />

      {/* Card */}
      <div className="gs-card" style={{ position:'relative', width:'100%', maxWidth:'520px', borderRadius:'2rem', overflow:'hidden', boxShadow:'0 50px 120px rgba(0,0,0,.55), 0 0 0 1.5px rgba(237,104,0,.22)', maxHeight:'95vh', overflowY:'auto' }}>

        {/* Header band */}
        <div style={{ background:'linear-gradient(135deg,#5d3a00,#7a4800,#5d3a00)', padding:'1.75rem 1.75rem 1.5rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-3rem', right:'-3rem', width:'10rem', height:'10rem', borderRadius:'50%', background:'rgba(255,255,255,.04)' }} />
          <div style={{ position:'absolute', bottom:'-2rem', left:'-2rem', width:'7rem', height:'7rem', borderRadius:'50%', background:'rgba(255,255,255,.03)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#d4af37,#ed6800,#d4af37,transparent)' }} />

          <button onClick={onClose} aria-label="Close"
            style={{ position:'absolute', top:'1rem', right:'1rem', width:'2rem', height:'2rem', borderRadius:'50%', border:'none', background:'rgba(255,255,255,.12)', cursor:'pointer', color:'white', fontSize:'.9rem', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(237,104,0,.6)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}>✕</button>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', position:'relative', zIndex:2 }}>
            <div className="gs-icon" style={{ fontSize:'2.8rem', flexShrink:0 }}>🐿️</div>
            <div>
              <span style={{ display:'inline-block', background:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.85)', fontSize:'.62rem', fontWeight:700, padding:'.2rem .75rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.4rem' }}>
                {gilehri?.badge_text || '🐿️ Gilehari Seva'}
              </span>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'clamp(1.05rem,2.5vw,1.3rem)', fontWeight:700, color:'white', margin:0, lineHeight:1.2 }}>
                {gilehri?.title || 'Gilehari Seva'}
              </h2>
              <p style={{ color:'rgba(255,255,255,.65)', fontSize:'.78rem', margin:'.3rem 0 0' }}>
                {projectTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ background:'#fffdf8', padding:'1.75rem' }}>

          {done ? (
            <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'.75rem' }}>🙏</div>
              <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna! Seva Received!</h3>
              <p style={{ fontSize:'.9rem', color:'#555', lineHeight:1.75 }}>
                Your Gilehari Seva of <strong>₹{Number(form.amount).toLocaleString('en-IN')}</strong> for <strong>{projectTitle}</strong> has been confirmed. Like the squirrel who served Lord Ram, your contribution is eternally recorded. 🌺
              </p>
              <p style={{ fontSize:'.75rem', color:'#aaa', marginTop:'.75rem' }}>Receipt will be sent to {form.email}.</p>
              <button onClick={onClose} style={{ marginTop:'1.5rem', padding:'.8rem 2rem', borderRadius:'2rem', border:'none', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor:'pointer', fontSize:'.9rem' }}>
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Story + image */}
              {(gilehri?.image || gilehri?.description) && (
                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', background:'rgba(237,104,0,.05)', border:'1px solid rgba(237,104,0,.12)', borderRadius:'1rem', padding:'1rem', marginBottom:'1.5rem' }}>
                  {gilehri?.image && (
                    <img src={gilehri.image} alt="Gilehari Seva" style={{ width:'5rem', height:'5rem', objectFit:'cover', borderRadius:'.75rem', flexShrink:0 }} />
                  )}
                  <div>
                    {gilehri?.subtitle && <p style={{ fontStyle:'italic', color:'#c45500', fontSize:'.82rem', marginBottom:'.4rem', fontWeight:600 }}>{gilehri.subtitle}</p>}
                    <p style={{ fontSize:'.82rem', color:'#444', lineHeight:1.7, margin:0 }}>{gilehri?.description}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {Array.isArray(gilehri?.benefits) && gilehri.benefits.length > 0 && (
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 1.5rem', display:'flex', flexDirection:'column', gap:'.4rem' }}>
                  {gilehri.benefits.map((b,i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:'.55rem', fontSize:'.82rem', color:'#333' }}>
                      <span style={{ color:'#ed6800', fontSize:'.9rem', flexShrink:0 }}>✦</span>{b}
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>

                {/* Suggested amounts */}
                <div>
                  <label style={fL}>Choose Amount</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.6rem' }}>
                    {suggested.map(a => (
                      <button key={a} type="button"
                        onClick={() => { setForm(f=>({...f,amount:a})); setErrors(er=>({...er,amount:''})); }}
                        style={{ padding:'.38rem .85rem', borderRadius:'2rem', border:`1.5px solid ${Number(form.amount)===a?'#ed6800':'rgba(196,85,0,.22)'}`, background:Number(form.amount)===a?'rgba(237,104,0,.1)':'transparent', color:Number(form.amount)===a?'#ed6800':'#555', fontSize:'.78rem', fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                        ₹{a.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <input type="number" min="1" step="1" style={fI(errors.amount)} value={form.amount}
                    onChange={set('amount')} placeholder="Or enter custom amount"
                    onBlur={() => setErrors(er=>({...er, amount: form.amount && Number(form.amount)>=1 ? '' : 'Enter a valid amount'}))} />
                  {errors.amount && <span style={eM}>⚠ {errors.amount}</span>}
                </div>

                <div>
                  <label style={fL}>Full Name *</label>
                  <input style={fI(errors.full_name)} type="text" placeholder="Your full name" value={form.full_name}
                    onChange={set('full_name')} onBlur={blur('full_name', rules.name)} />
                  {errors.full_name && <span style={eM}>⚠ {errors.full_name}</span>}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'.9rem' }}>
                  <div>
                    <label style={fL}>Email *</label>
                    <input style={fI(errors.email)} type="email" placeholder="name@example.com" value={form.email}
                      onChange={set('email')} onBlur={blur('email', rules.email)} />
                    {errors.email && <span style={eM}>⚠ {errors.email}</span>}
                  </div>
                  <div>
                    <label style={fL}>Phone *</label>
                    <input style={fI(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
                      onChange={set('phone')} onBlur={blur('phone', rules.phone)} />
                    {errors.phone && <span style={eM}>⚠ {errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label style={fL}>PAN <span style={{ textTransform:'none', color:'#aaa', fontSize:'.62rem' }}>(optional, for 80G)</span></label>
                  <input style={fI(errors.pan)} type="text" maxLength={10} placeholder="ABCDE1234F" value={form.pan}
                    onChange={set('pan')} onBlur={() => { const v=form.pan.toUpperCase(); setForm(f=>({...f,pan:v})); setErrors(er=>({...er,pan:rules.pan(v)})); }} />
                  {errors.pan && <span style={eM}>⚠ {errors.pan}</span>}
                </div>

                {/* Total */}
                {form.amount && Number(form.amount) > 0 && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(237,104,0,.06)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'.875rem', padding:'.75rem 1rem' }}>
                    <span style={{ fontSize:'.82rem', color:'#666' }}>Seva Contribution</span>
                    <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.15rem', fontWeight:900, color:'#ed6800' }}>₹{Number(form.amount).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {payError && (
                  <p style={{ color:'#e53e3e', fontSize:'.8rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.5rem .75rem', margin:0 }}>⚠ {payError}</p>
                )}

                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'.95rem', borderRadius:'2rem', border:'none', background:loading?'rgba(237,104,0,.4)':'linear-gradient(135deg,#5d3a00,#8b5200,#c45500)', color:'white', fontSize:'.95rem', fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all .2s', opacity:loading?0.7:1, fontFamily:'var(--font-poppins),sans-serif', boxShadow:'0 8px 24px rgba(139,82,0,.35)' }}>
                  {loading ? '⏳ Opening Payment…' : `🐿️ ${gilehri?.cta_text || 'Participate in Gilehari Seva'}`}
                </button>
                <p style={{ fontSize:'.68rem', color:'#bbb', textAlign:'center', margin:0 }}>Secured by Razorpay · 100% safe · 80G eligible</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
