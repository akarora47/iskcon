'use client';
import { useState, useEffect } from 'react';
import Modal from './Modal';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(196,85,0,.2)', borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box' };

export default function EventHeroBtns() {
  const [modal, setModal]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [events, setEvents]     = useState([]);
  const [form, setForm]         = useState({ event_id: '', event_name: '', first_name: '', last_name: '', email: '', phone: '', attendees: '1', city: '', special_requests: '' });

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => { if (Array.isArray(d)) setEvents(d); }).catch(() => {});
  }, []);

  const scrollToSchedule = () => {
    const el = document.getElementById('schedule');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEventChange = (e) => {
    const selected = events.find(ev => String(ev.id) === e.target.value);
    setForm(f => ({ ...f, event_id: e.target.value, event_name: selected ? selected.name : '' }));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); }
      else { alert('Something went wrong. Please try again.'); }
    } catch { alert('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <button onClick={() => { setSubmitted(false); setForm({ event_id:'', event_name:'', first_name:'', last_name:'', email:'', phone:'', attendees:'1', city:'', special_requests:'' }); setModal(true); }} className="btn-primary" style={{ border:'none', cursor:'pointer' }}>
          📋 Register for Events
        </button>
        <button onClick={scrollToSchedule} className="btn-outline-light" style={{ cursor:'pointer' }}>
          🪔 Aarti Schedule
        </button>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="📋 Event Registration">
        {submitted ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎉</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna! You're Registered</h4>
            <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>Your registration has been received. Our events team will send you confirmation details shortly. We look forward to celebrating with you!</p>
            <button onClick={() => setModal(false)} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={fLabel}>Event *</label>
              <select required style={fInput} value={form.event_id} onChange={handleEventChange}>
                <option value="">— Select an event —</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}{ev.date ? ` — ${ev.date} ${ev.month || ''}` : ev.month ? ` — ${ev.month}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>First Name *</label>
                <input required style={fInput} type="text" placeholder="First name" value={form.first_name} onChange={set('first_name')} />
              </div>
              <div>
                <label style={fLabel}>Last Name *</label>
                <input style={fInput} type="text" placeholder="Last name" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>
            <div>
              <label style={fLabel}>Email *</label>
              <input required style={fInput} type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Phone *</label>
                <input required style={fInput} type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label style={fLabel}>No. of Attendees</label>
                <input style={fInput} type="number" min="1" value={form.attendees} onChange={set('attendees')} />
              </div>
            </div>
            <div>
              <label style={fLabel}>City / State</label>
              <input style={fInput} type="text" placeholder="e.g. Delhi, Uttar Pradesh" value={form.city} onChange={set('city')} />
            </div>
            <div>
              <label style={fLabel}>Special Requests</label>
              <textarea style={{ ...fInput, minHeight:'75px', resize:'vertical' }} placeholder="Any dietary needs or special requirements..." value={form.special_requests} onChange={set('special_requests')} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', border:'none', cursor:'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting…' : '📋 Complete Registration'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
