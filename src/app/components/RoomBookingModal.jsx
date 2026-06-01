'use client';
import { useState } from 'react';
import Modal from './Modal';
import { rules, hasErrors } from '@/lib/validate';

const iStyle = (err) => ({ width:'100%', padding:'.75rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.875rem', fontSize:'.9rem', background:'#fff', color:'#111', outline:'none', boxSizing:'border-box', fontFamily:'var(--font-poppins),sans-serif', transition:'border-color .2s' });
const lStyle = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.06em' };
const errMsg = { color:'#e53e3e', fontSize:'.72rem', marginTop:'.3rem', display:'block' };

const EMPTY_FORM = { name:'', email:'', phone:'', checkin:'', checkout:'', guests:'1', message:'' };
const EMPTY_ERR  = { name:'', email:'', phone:'', checkin:'', checkout:'', guests:'' };

export default function RoomBookingModal({ rooms }) {
  const [open, setOpen]           = useState(false);
  const [room, setRoom]           = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState(EMPTY_ERR);
  const [serverError, setServerError] = useState('');
  const [form, setForm]           = useState(EMPTY_FORM);

  const openFor = (r) => { setRoom(r); setSubmitted(false); setErrors(EMPTY_ERR); setServerError(''); setForm(EMPTY_FORM); setOpen(true); };
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

  const rName      = (r) => r?.title || '—';
  const imgSrc     = (r) => r?.image || '/prasadam-hall.jpg';
  const priceLabel = (r) => r?.price || (r?.price_amount ? `₹${Number(r.price_amount).toLocaleString('en-IN')}/night` : '—');

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const checkoutErr = form.checkin && form.checkout
      ? rules.checkoutAfterCheckin(form.checkin, form.checkout)
      : rules.date(form.checkout, 'Check-out date');
    const errs = {
      name:     rules.name(form.name),
      email:    rules.email(form.email),
      phone:    rules.phone(form.phone),
      checkin:  rules.date(form.checkin, 'Check-in date'),
      checkout: checkoutErr || rules.date(form.checkout, 'Check-out date'),
      guests:   '',
    };
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id:room?.id||null, room_name:rName(room), name:form.name, email:form.email, phone:form.phone, check_in:form.checkin, check_out:form.checkout, guests:Number(form.guests)||1, special_requests:form.message }),
      });
      if (res.ok) { setSubmitted(true); }
      else { setServerError('Something went wrong. Please try again.'); }
    } catch { setServerError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' }}>
        {rooms.map((r, i) => (
          <div key={r.id || r.title} className={`reveal d${(i+1)*100}`}
            style={{ borderRadius:'1.5rem', overflow:'hidden', border:'1px solid rgba(237,104,0,.15)', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,.06)', position:'relative' }}>
            {(r.popular === 1 || r.popular === true) && (
              <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'#ed6800', color:'white', fontSize:'.7rem', fontWeight:700, padding:'.3rem .8rem', borderRadius:'2rem', zIndex:2 }}>Most Popular</div>
            )}
            <img src={imgSrc(r)} alt={rName(r)} style={{ width:'100%', height:'12rem', objectFit:'cover', display:'block' }} />
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
                <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'#111' }}>{r.icon || '🛏️'} {rName(r)}</h3>
                <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'#ed6800', flexShrink:0, marginLeft:'.5rem' }}>{priceLabel(r)}</span>
              </div>
              <p style={{ fontSize:'.84rem', color:'#555', lineHeight:1.7, marginBottom:'1rem' }}>{r.description}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1.25rem' }}>
                {(Array.isArray(r.features) ? r.features : []).map(f => (
                  <span key={f} style={{ fontSize:'.72rem', background:'rgba(237,104,0,.08)', color:'#ed6800', padding:'.25rem .75rem', borderRadius:'2rem', fontWeight:500 }}>✓ {f}</span>
                ))}
              </div>
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => openFor(r)}>Book This Room</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`🏨 Book — ${rName(room)}`}>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🙏</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Enquiry Received!</h4>
            <p style={{ fontSize:'.9rem', color:'#555', lineHeight:1.7, marginBottom:'1.5rem' }}>
              Thank you, <strong>{form.name}</strong>! Your booking enquiry for <strong>{rName(room)}</strong> has been sent. Our team will confirm within 24 hours.
            </p>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ background:'rgba(237,104,0,.06)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'1rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'.9rem', fontWeight:600, color:'#111' }}>{room?.icon || '🛏️'} {rName(room)}</span>
              <span style={{ fontFamily:'var(--font-cinzel),serif', fontWeight:700, color:'#ed6800' }}>{priceLabel(room)}</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={lStyle}>Full Name *</label>
                <input style={iStyle(errors.name)} type="text" placeholder="Your full name" value={form.name}
                  onChange={set('name')} onBlur={() => setErrors(er => ({ ...er, name: rules.name(form.name) }))} />
                {errors.name && <span style={errMsg}>⚠ {errors.name}</span>}
              </div>
              <div>
                <label style={lStyle}>Phone * <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(10 digits)</span></label>
                <input style={iStyle(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
                  onChange={set('phone')} onBlur={() => setErrors(er => ({ ...er, phone: rules.phone(form.phone) }))} />
                {errors.phone && <span style={errMsg}>⚠ {errors.phone}</span>}
              </div>
            </div>

            <div>
              <label style={lStyle}>Email Address *</label>
              <input style={iStyle(errors.email)} type="email" placeholder="name@example.com" value={form.email}
                onChange={set('email')} onBlur={() => setErrors(er => ({ ...er, email: rules.email(form.email) }))} />
              {errors.email && <span style={errMsg}>⚠ {errors.email}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={lStyle}>Check-In *</label>
                <input style={iStyle(errors.checkin)} type="date" min={today} value={form.checkin}
                  onChange={set('checkin')} onBlur={() => setErrors(er => ({ ...er, checkin: rules.date(form.checkin, 'Check-in date') }))} />
                {errors.checkin && <span style={errMsg}>⚠ {errors.checkin}</span>}
              </div>
              <div>
                <label style={lStyle}>Check-Out *</label>
                <input style={iStyle(errors.checkout)} type="date" min={form.checkin || today} value={form.checkout}
                  onChange={set('checkout')} onBlur={() => setErrors(er => ({ ...er, checkout: rules.checkoutAfterCheckin(form.checkin, form.checkout) || rules.date(form.checkout, 'Check-out date') }))} />
                {errors.checkout && <span style={errMsg}>⚠ {errors.checkout}</span>}
              </div>
            </div>

            <div>
              <label style={lStyle}>Number of Guests</label>
              <select style={iStyle(false)} value={form.guests} onChange={set('guests')}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>

            <div>
              <label style={lStyle}>Special Requests</label>
              <textarea style={{ ...iStyle(false), minHeight:'80px', resize:'vertical' }} placeholder="Any special requests or requirements..." value={form.message} onChange={set('message')} />
            </div>

            {serverError && (
              <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.6rem .875rem', margin:0 }}>⚠ {serverError}</p>
            )}

            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:'.5rem', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Submitting…' : '🙏 Send Booking Enquiry'}
            </button>
            <p style={{ fontSize:'.75rem', color:'#888', textAlign:'center' }}>We will confirm availability within 24 hours.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
