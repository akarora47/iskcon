'use client';
import { useState } from 'react';
import Modal from './Modal';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(196,85,0,.2)', borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box' };

export default function ContactModalBtn() {
  const [modal, setModal]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ first_name: '', last_name: '', email: '', phone: '', subject: '', message: '' });
  const [error, setError]       = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    `${form.first_name} ${form.last_name}`.trim(),
          email:   form.email,
          phone:   form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else { const d = await res.json(); setError(d.error || 'Something went wrong. Please try again.'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => { setSubmitted(false); setError(''); setForm({ first_name:'', last_name:'', email:'', phone:'', subject:'', message:'' }); setModal(true); }} className="btn-primary" style={{ border:'none', cursor:'pointer' }}>
        📩 Send a Message
      </button>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="📩 Send Us a Message">
        {submitted ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🙏</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Message Received!</h4>
            <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>Thank you for reaching out. A confirmation has been sent to <strong>{form.email}</strong>. Our team will respond within 24 hours. Hare Krishna!</p>
            <button onClick={() => setModal(false)} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>First Name *</label>
                <input required style={fInput} type="text" placeholder="First name" value={form.first_name} onChange={set('first_name')} />
              </div>
              <div>
                <label style={fLabel}>Last Name</label>
                <input style={fInput} type="text" placeholder="Last name" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>
            <div>
              <label style={fLabel}>Email *</label>
              <input required style={fInput} type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label style={fLabel}>Phone</label>
              <input style={fInput} type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label style={fLabel}>Subject *</label>
              <select required style={fInput} value={form.subject} onChange={set('subject')}>
                <option value="">— Select a topic —</option>
                <option>General Enquiry</option>
                <option>Temple Visit &amp; Darshan</option>
                <option>Donation &amp; Seva</option>
                <option>Room Booking</option>
                <option>Event Registration</option>
                <option>Volunteer Opportunity</option>
                <option>Media &amp; Press</option>
              </select>
            </div>
            <div>
              <label style={fLabel}>Your Message *</label>
              <textarea required style={{ ...fInput, minHeight:'100px', resize:'vertical' }} placeholder="How can we help you?" value={form.message} onChange={set('message')} />
            </div>
            {error && <p style={{ color:'#c00', fontSize:'.82rem', background:'rgba(255,0,0,.06)', border:'1px solid rgba(255,0,0,.15)', borderRadius:'.5rem', padding:'.5rem .75rem' }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', border:'none', cursor:'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending…' : '📩 Send Message'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
