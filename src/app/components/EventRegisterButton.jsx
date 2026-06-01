'use client';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { rules, hasErrors } from '@/lib/validate';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = (err) => ({ width:'100%', padding:'.7rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.72rem', marginTop:'.3rem', display:'block' };

const EMPTY_ERR = { event_id:'', first_name:'', email:'', phone:'' };

export default function EventRegisterButton({ eventName, eventId }) {
  const [modal, setModal]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [events, setEvents]     = useState([]);
  const [errors, setErrors]     = useState(EMPTY_ERR);
  const [serverError, setServerError] = useState('');
  const [form, setForm]         = useState({ event_id: eventId||'', event_name: eventName||'', first_name:'', last_name:'', email:'', phone:'', attendees:'1', city:'', special_requests:'' });

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => { if (Array.isArray(d)) setEvents(d); }).catch(() => {});
  }, []);

  const openModal = () => { setSubmitted(false); setErrors(EMPTY_ERR); setServerError(''); setForm(f => ({ ...f, event_id:eventId||'', event_name:eventName||'' })); setModal(true); };
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]:'' })); };

  const handleEventChange = (e) => {
    const selected = events.find(ev => String(ev.id) === e.target.value);
    setForm(f => ({ ...f, event_id: e.target.value, event_name: selected ? selected.name : '' }));
    setErrors(er => ({ ...er, event_id: '' }));
  };

  const validate = () => {
    const errs = {
      event_id:   rules.required(form.event_id, 'Event'),
      first_name: rules.name(form.first_name),
      email:      rules.email(form.email),
      phone:      rules.phone(form.phone),
    };
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); }
      else { setServerError('Something went wrong. Please try again.'); }
    } catch { setServerError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={openModal} className="btn-primary"
        style={{ width:'100%', justifyContent:'center', fontSize:'.82rem', padding:'.6rem 1rem', border:'none', cursor:'pointer' }}>
        Register →
      </button>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="📋 Event Registration">
        {submitted ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎉</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna! You are Registered</h4>
            <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>Your registration has been received. Our events team will send confirmation details shortly. We look forward to celebrating with you!</p>
            <button onClick={() => setModal(false)} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            <div>
              <label style={fLabel}>Event *</label>
              <select style={fInput(errors.event_id)} value={form.event_id} onChange={handleEventChange}
                onBlur={() => setErrors(er => ({ ...er, event_id: rules.required(form.event_id, 'Event') }))}>
                <option value="">— Select an event —</option>
                {events.length > 0
                  ? events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}{ev.date ? ` — ${ev.date} ${ev.month||''}` : ''}</option>)
                  : eventName ? <option value={eventId||''}>{eventName}</option> : null}
              </select>
              {errors.event_id && <span style={errMsg}>⚠ {errors.event_id}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>First Name *</label>
                <input style={fInput(errors.first_name)} type="text" placeholder="First name" value={form.first_name}
                  onChange={set('first_name')} onBlur={() => setErrors(er => ({ ...er, first_name: rules.name(form.first_name) }))} />
                {errors.first_name && <span style={errMsg}>⚠ {errors.first_name}</span>}
              </div>
              <div>
                <label style={fLabel}>Last Name</label>
                <input style={fInput(false)} type="text" placeholder="Last name" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>

            <div>
              <label style={fLabel}>Email Address *</label>
              <input style={fInput(errors.email)} type="email" placeholder="name@example.com" value={form.email}
                onChange={set('email')} onBlur={() => setErrors(er => ({ ...er, email: rules.email(form.email) }))} />
              {errors.email && <span style={errMsg}>⚠ {errors.email}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Phone * <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(10 digits)</span></label>
                <input style={fInput(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
                  onChange={set('phone')} onBlur={() => setErrors(er => ({ ...er, phone: rules.phone(form.phone) }))} />
                {errors.phone && <span style={errMsg}>⚠ {errors.phone}</span>}
              </div>
              <div>
                <label style={fLabel}>No. of Attendees</label>
                <input style={fInput(false)} type="number" min="1" max="20" value={form.attendees} onChange={set('attendees')} />
              </div>
            </div>

            <div>
              <label style={fLabel}>City / State</label>
              <input style={fInput(false)} type="text" placeholder="e.g. Delhi, Uttar Pradesh" value={form.city} onChange={set('city')} />
            </div>

            <div>
              <label style={fLabel}>Special Requests</label>
              <textarea style={{ ...fInput(false), minHeight:'75px', resize:'vertical' }} placeholder="Any dietary needs or special requirements..." value={form.special_requests} onChange={set('special_requests')} />
            </div>

            {serverError && (
              <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.6rem .875rem', margin:0 }}>⚠ {serverError}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', justifyContent:'center', border:'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Submitting…' : '📋 Complete Registration'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
