'use client';
import { useState } from 'react';

export default function ContactInlineForm() {
  const [form, setForm]         = useState({ first_name:'', last_name:'', email:'', phone:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
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
      else { const d = await res.json(); setError(d.error || 'Something went wrong.'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🙏</div>
      <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.3rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Message Received!</h3>
      <p style={{ color:'#6a4020', lineHeight:1.8, marginBottom:'1rem' }}>
        A confirmation email has been sent to <strong>{form.email}</strong>.<br />Our team will respond within 24 hours. Hare Krishna! 🌺
      </p>
      <button onClick={() => { setSubmitted(false); setForm({ first_name:'', last_name:'', email:'', phone:'', subject:'', message:'' }); }} className="btn-primary" style={{ border:'none', cursor:'pointer', margin:'0 auto' }}>
        Send Another Message
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div>
          <label className="f-label">नाम · First Name *</label>
          <input required className="f-input" type="text" placeholder="आपका नाम" value={form.first_name} onChange={set('first_name')} />
        </div>
        <div>
          <label className="f-label">उपनाम · Last Name</label>
          <input className="f-input" type="text" placeholder="उपनाम" value={form.last_name} onChange={set('last_name')} />
        </div>
      </div>
      <div>
        <label className="f-label">ईमेल · Email *</label>
        <input required className="f-input" type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} />
      </div>
      <div>
        <label className="f-label">दूरभाष · Phone</label>
        <input className="f-input" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
      </div>
      <div>
        <label className="f-label">विषय · Subject *</label>
        <select required className="f-select" value={form.subject} onChange={set('subject')}>
          <option value="">— विषय चुनें / Select Topic —</option>
          <option>General Enquiry / सामान्य पूछताछ</option>
          <option>Temple Visit & Darshan / मंदिर दर्शन</option>
          <option>Donation & Seva / दान एवं सेवा</option>
          <option>Room Booking / आवास बुकिंग</option>
          <option>Event Registration / उत्सव पंजीकरण</option>
          <option>Volunteer Opportunity / स्वयंसेवक</option>
          <option>Media & Press / मीडिया</option>
        </select>
      </div>
      <div>
        <label className="f-label">संदेश · Message *</label>
        <textarea required className="f-textarea" placeholder="हम आपकी कैसे सहायता कर सकते हैं?" value={form.message} onChange={set('message')} />
      </div>
      {error && (
        <p style={{ color:'#c00', fontSize:'.82rem', background:'rgba(255,0,0,.06)', border:'1px solid rgba(255,0,0,.12)', borderRadius:'.5rem', padding:'.5rem .75rem', margin:0 }}>{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary" style={{ border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Sending… / भेजा जा रहा है…' : '📩 संदेश भेजें / Send Message'}
      </button>
    </form>
  );
}
