'use client';
import { useState } from 'react';
import Modal from './Modal';

export default function RoomBookingModal({ rooms }) {
  const [open, setOpen]           = useState(false);
  const [room, setRoom]           = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', phone: '', checkin: '', checkout: '', guests: '1', message: '' });

  const openFor = (r) => {
    setRoom(r);
    setSubmitted(false);
    setForm({ name:'', email:'', phone:'', checkin:'', checkout:'', guests:'1', message:'' });
    setOpen(true);
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // DB uses: title, title_hi, icon, price, price_amount, description, description_hi, features, image, popular, active
  const name    = (r) => r?.title || r?.title || '—';
  const nameHi  = (r) => r?.title_hi;
  const imgSrc  = (r) => r?.image || r?.img || '/prasadam-hall.jpg';
  const priceDisplay = (r) => r?.price || (r?.price_amount ? `₹${Number(r.price_amount).toLocaleString('en-IN')}/night` : '—');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.checkin || !form.checkout) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id:          room?.id || null,
          room_name:        name(room),
          name:             form.name,
          email:            form.email,
          phone:            form.phone,
          check_in:         form.checkin,
          check_out:        form.checkout,
          guests:           Number(form.guests) || 1,
          special_requests: form.message,
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else { alert('Something went wrong. Please try again.'); }
    } catch { alert('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'.75rem 1rem', border:'1px solid rgba(237,104,0,.2)', borderRadius:'.875rem', fontSize:'.9rem', background:'#fffdf8', color:'#1a0900', outline:'none', boxSizing:'border-box', fontFamily:'var(--font-poppins),sans-serif' };
  const labelStyle = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#6a4020', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.06em' };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {rooms.map((r, i) => (
        <div key={r.id || r.title} style={{ borderRadius:'1.5rem', overflow:'hidden', border:'1px solid rgba(237,104,0,.15)', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,.06)', transition:'all .35s ease', position:'relative' }}
          className={`reveal d${(i+1)*100}`}
        >
          {r.popular === 1 || r.popular === true ? (
            <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'#ed6800', color:'white', fontSize:'.7rem', fontWeight:700, padding:'.3rem .8rem', borderRadius:'2rem', zIndex:2 }}>Most Popular</div>
          ) : null}
          <img src={imgSrc(r)} alt={name(r)} style={{ width:'100%', height:'12rem', objectFit:'cover', display:'block' }} />
          <div style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
              <div>
                <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'#1a0900' }}>{r.icon || '🛏️'} {name(r)}</h3>
                {nameHi(r) && <p style={{ fontSize:'.72rem', color:'#8a6040', fontFamily:'serif', marginTop:'.1rem' }}>{nameHi(r)}</p>}
              </div>
              <span style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'#ed6800', flexShrink:0, marginLeft:'.5rem' }}>
                {priceDisplay(r)}
              </span>
            </div>
            <p style={{ fontSize:'.84rem', color:'#4a2800', lineHeight:1.7, marginBottom:'1rem' }}>{r.description || r.desc}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1.25rem' }}>
              {(Array.isArray(r.features) ? r.features : []).map((f) => (
                <span key={f} style={{ fontSize:'.72rem', background:'rgba(237,104,0,.08)', color:'#ed6800', padding:'.25rem .75rem', borderRadius:'2rem', fontWeight:500 }}>✓ {f}</span>
              ))}
            </div>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => openFor(r)}>
              Book This Room
            </button>
          </div>
        </div>
      ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`🏨 Book — ${name(room)}`}>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🙏</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#1a0900', marginBottom:'.75rem' }}>Enquiry Received!</h4>
            <p style={{ fontSize:'.9rem', color:'#4a2800', lineHeight:1.7, marginBottom:'1.5rem' }}>
              Thank you, <strong>{form.name}</strong>! Your booking enquiry for <strong>{name(room)}</strong> has been sent. Our team will confirm availability within 24 hours.
            </p>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ background:'rgba(237,104,0,.06)', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'1rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'.9rem', fontWeight:600, color:'#1a0900' }}>{room?.icon || '🛏️'} {name(room)}</span>
              <span style={{ fontFamily:'var(--font-cinzel),serif', fontWeight:700, color:'#ed6800' }}>{priceDisplay(room)}</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} type="text" placeholder="Your name" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <input style={inputStyle} type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input style={inputStyle} type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={labelStyle}>Check-In *</label>
                <input style={inputStyle} type="date" value={form.checkin} onChange={set('checkin')} />
              </div>
              <div>
                <label style={labelStyle}>Check-Out *</label>
                <input style={inputStyle} type="date" value={form.checkout} onChange={set('checkout')} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Number of Guests</label>
              <select style={inputStyle} value={form.guests} onChange={set('guests')}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Special Requests</label>
              <textarea style={{ ...inputStyle, minHeight:'80px', resize:'vertical' }} placeholder="Any special requests or requirements..." value={form.message} onChange={set('message')} />
            </div>

            <button
              className="btn-primary"
              style={{ width:'100%', justifyContent:'center', marginTop:'.5rem', opacity:(!form.name || !form.email || !form.checkin || !form.checkout || loading) ? 0.6 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting…' : '🙏 Send Booking Enquiry'}
            </button>
            <p style={{ fontSize:'.75rem', color:'#8a6040', textAlign:'center' }}>We will confirm availability within 24 hours.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
