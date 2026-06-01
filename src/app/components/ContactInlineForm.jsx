'use client';
import { useState } from 'react';
import { rules, hasErrors } from '@/lib/validate';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em' };
const fInput = (err) => ({ width:'100%', padding:'.7rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.9rem', color:'#111', background:'white', outline:'none', boxSizing:'border-box', fontFamily:'var(--font-poppins),sans-serif', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.72rem', marginTop:'.3rem', display:'block' };

const EMPTY = { first_name:'', last_name:'', email:'', phone:'', subject:'', message:'' };
const EMPTY_ERR = { first_name:'', email:'', phone:'', subject:'', message:'' };

export default function ContactInlineForm() {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState(EMPTY_ERR);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  const blurField = (k, rule) => () => setErrors(er => ({ ...er, [k]: rule(form[k]) }));

  const validate = () => {
    const errs = {
      first_name: rules.name(form.first_name),
      email:      rules.email(form.email),
      phone:      rules.phone(form.phone, false),
      subject:    rules.required(form.subject, 'Subject'),
      message:    rules.message(form.message, 10),
    };
    setErrors(errs);
    return !hasErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name:`${form.first_name} ${form.last_name}`.trim(), email:form.email, phone:form.phone, subject:form.subject, message:form.message }),
      });
      if (res.ok) { setSubmitted(true); }
      else { const d = await res.json(); setServerError(d.error || 'Something went wrong.'); }
    } catch { setServerError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🙏</div>
      <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.3rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Message Received!</h3>
      <p style={{ color:'#555', lineHeight:1.8, marginBottom:'1rem' }}>
        A confirmation email has been sent to <strong>{form.email}</strong>.<br/>Our team will respond within 24 hours. Hare Krishna! 🌺
      </p>
      <button onClick={() => { setSubmitted(false); setForm(EMPTY); setErrors(EMPTY_ERR); }} className="btn-primary" style={{ border:'none', cursor:'pointer', margin:'0 auto' }}>
        Send Another Message
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
        <div>
          <label style={fLabel}>First Name *</label>
          <input style={fInput(errors.first_name)} type="text" placeholder="Your first name" value={form.first_name}
            onChange={set('first_name')} onBlur={blurField('first_name', rules.name)} />
          {errors.first_name && <span style={errMsg}>⚠ {errors.first_name}</span>}
        </div>
        <div>
          <label style={fLabel}>Last Name</label>
          <input style={fInput(false)} type="text" placeholder="Your last name" value={form.last_name} onChange={set('last_name')} />
        </div>
      </div>

      <div>
        <label style={fLabel}>Email Address *</label>
        <input style={fInput(errors.email)} type="email" placeholder="name@example.com" value={form.email}
          onChange={set('email')} onBlur={blurField('email', rules.email)} />
        {errors.email && <span style={errMsg}>⚠ {errors.email}</span>}
      </div>

      <div>
        <label style={fLabel}>Phone Number <span style={{ fontSize:'.65rem', color:'#aaa', textTransform:'none', fontWeight:400 }}>(optional — 10 digits)</span></label>
        <input style={fInput(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
          onChange={set('phone')} onBlur={() => setErrors(er => ({ ...er, phone: rules.phone(form.phone, false) }))} />
        {errors.phone && <span style={errMsg}>⚠ {errors.phone}</span>}
      </div>

      <div>
        <label style={fLabel}>Subject *</label>
        <select style={fInput(errors.subject)} value={form.subject}
          onChange={set('subject')} onBlur={() => setErrors(er => ({ ...er, subject: rules.required(form.subject, 'Subject') }))}>
          <option value="">— Select a Topic —</option>
          <option>General Enquiry</option>
          <option>Temple Visit &amp; Darshan</option>
          <option>Donation &amp; Seva</option>
          <option>Room Booking</option>
          <option>Event Registration</option>
          <option>Volunteer Opportunity</option>
          <option>Media &amp; Press</option>
        </select>
        {errors.subject && <span style={errMsg}>⚠ {errors.subject}</span>}
      </div>

      <div>
        <label style={fLabel}>Your Message * <span style={{ fontSize:'.65rem', color:'#aaa', textTransform:'none', fontWeight:400 }}>(min. 10 characters)</span></label>
        <textarea style={{ ...fInput(errors.message), minHeight:'100px', resize:'vertical' }} placeholder="How can we help you?"
          value={form.message} onChange={set('message')} onBlur={() => setErrors(er => ({ ...er, message: rules.message(form.message, 10) }))} />
        {errors.message && <span style={errMsg}>⚠ {errors.message}</span>}
      </div>

      {serverError && (
        <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.6rem .875rem', margin:0 }}>⚠ {serverError}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ Sending…' : '📩 Send Message'}
      </button>
    </form>
  );
}
