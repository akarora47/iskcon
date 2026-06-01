'use client';
import { useState } from 'react';
import Modal from './Modal';
import { rules, hasErrors } from '@/lib/validate';

const sevas = [
  { icon: '🐄', title: 'GauShala Seva',  desc: 'Serve and protect the sacred cows under temple care. Your donation provides nourishment and shelter.',  amount: '₹1,500', amountNum: 1500 },
  { icon: '🍽️', title: 'Annadan Seva',   desc: 'Distribute prasadam to thousands of pilgrims and devotees. Feed the hungry, serve the divine.',         amount: '₹1,000', amountNum: 1000 },
  { icon: '🌸', title: 'Deity Seva',     desc: 'Offer flowers, garlands and decorations at the lotus feet of Lord Ram and Sita Devi in the temple.',     amount: '₹500',   amountNum: 500  },
];

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = (err) => ({ width:'100%', padding:'.7rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.72rem', marginTop:'.3rem', display:'block' };

const EMPTY_FORM = (seva) => ({ full_name:'', email:'', phone:'', address:'', pin:'', pan:'', amount: seva.amountNum, message:'' });
const EMPTY_ERR  = { full_name:'', email:'', phone:'', pin:'', pan:'', amount:'' };

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonationSection() {
  const [modal, setModal]         = useState(false);
  const [activeSeva, setActive]   = useState(sevas[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [payError, setPayError]   = useState('');
  const [errors, setErrors]       = useState(EMPTY_ERR);
  const [form, setForm]           = useState(EMPTY_FORM(sevas[0]));

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };
  const blurField = (k, rule) => () => setErrors(er => ({ ...er, [k]: rule(form[k]) }));

  const validateForm = () => {
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

  const openModal = (seva) => {
    setActive(seva);
    setSubmitted(false);
    setPayError('');
    setErrors(EMPTY_ERR);
    setForm(EMPTY_FORM(seva));
    setModal(true);
  };

  const handleSevaChange = (e) => {
    const found = sevas.find(s => s.title === e.target.value);
    if (found) { setActive(found); setForm(f => ({ ...f, amount: found.amountNum })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setPayError('');
    try {
      const ok = await loadRazorpay();
      if (!ok) { setPayError('Payment gateway failed to load.'); setLoading(false); return; }

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(form.amount) }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setPayError(orderData.error || 'Could not create payment order.'); setLoading(false); return; }

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        'ISKCON Ayodhya',
        description: activeSeva.title,
        image:       '/favicon.ico',
        order_id:    orderData.order_id,
        prefill:     { name: form.full_name, email: form.email, contact: form.phone },
        theme:       { color: '#ed6800' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'donation', order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id, signature: response.razorpay_signature,
              data: { seva_type: activeSeva.title, full_name: form.full_name, email: form.email, phone: form.phone, address: form.address, pin: form.pin, pan: form.pan, amount: Number(form.amount), message: form.message },
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) { setSubmitted(true); }
          else { setPayError(verifyData.error || 'Payment verification failed. Please contact support.'); }
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => { setPayError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch {
      setPayError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <section className="sec-dark">
        <div className="wrap">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="section-badge">Seva Opportunities</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.75rem)', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>
              Serve the <span className="gradient-text">Divine</span>
            </h2>
            <div className="gold-line-center" />
            <p style={{ color:'#555', maxWidth:'540px', margin:'0 auto', fontSize:'.95rem', lineHeight:1.75 }}>
              Every act of seva is an offering to the Lord. Choose your path of devotional service and make a difference today.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.5rem' }}>
            {sevas.map((seva, i) => (
              <div key={seva.title} className={`card-glass reveal d${(i+1)*100}`} style={{ padding:'2rem' }}>
                <div className="seva-icon-dark" style={{ marginBottom:'1.25rem' }}>{seva.icon}</div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem', fontFamily:'var(--font-cinzel),serif' }}>{seva.title}</h3>
                <p style={{ fontSize:'.875rem', lineHeight:1.75, color:'#555', marginBottom:'1.5rem' }}>{seva.desc}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', background:'rgba(196,85,0,.06)', borderRadius:'.875rem', marginBottom:'1.25rem', border:'1px solid rgba(196,85,0,.12)' }}>
                  <span style={{ fontSize:'.75rem', fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'.1em' }}>Suggested Seva</span>
                  <span style={{ fontSize:'1.1rem', fontWeight:700, color:'#ed6800', fontFamily:'var(--font-cinzel),serif' }}>{seva.amount}</span>
                </div>
                <button onClick={() => openModal(seva)} className="btn-primary" style={{ width:'100%', justifyContent:'center', border:'none', cursor:'pointer' }}>
                  Donate Now 🙏
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={`🙏 ${activeSeva.title}`}>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🙏</div>
            <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna! Payment Received!</h4>
            <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>
              Your donation for <strong>{activeSeva.title}</strong> has been confirmed. A receipt has been sent to <strong>{form.email}</strong>. May Lord Krishna bless you! 🌺
            </p>
            <p style={{ fontSize:'.78rem', color:'#aaa', marginTop:'.75rem' }}>80G tax benefit receipt will be emailed within 7 working days.</p>
            <button onClick={() => setModal(false)} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            <div>
              <label style={fLabel}>Seva Type</label>
              <select style={fInput(false)} value={activeSeva.title} onChange={handleSevaChange}>
                {sevas.map(s => <option key={s.title} value={s.title}>{s.title} — {s.amount}</option>)}
              </select>
            </div>

            <div>
              <label style={fLabel}>Full Name *</label>
              <input style={fInput(errors.full_name)} type="text" placeholder="Your full name" value={form.full_name}
                onChange={set('full_name')} onBlur={blurField('full_name', rules.name)} />
              {errors.full_name && <span style={errMsg}>⚠ {errors.full_name}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Email *</label>
                <input style={fInput(errors.email)} type="email" placeholder="name@example.com" value={form.email}
                  onChange={set('email')} onBlur={blurField('email', rules.email)} />
                {errors.email && <span style={errMsg}>⚠ {errors.email}</span>}
              </div>
              <div>
                <label style={fLabel}>Phone * <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(10 digits)</span></label>
                <input style={fInput(errors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={form.phone}
                  onChange={set('phone')} onBlur={blurField('phone', rules.phone)} />
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
                  onChange={set('pin')} onBlur={blurField('pin', rules.pin)} />
                {errors.pin && <span style={errMsg}>⚠ {errors.pin}</span>}
              </div>
              <div>
                <label style={fLabel}>PAN <span style={{ fontSize:'.6rem', color:'#aaa', textTransform:'none' }}>(required for 80G)</span></label>
                <input style={fInput(errors.pan)} type="text" maxLength={10} placeholder="ABCDE1234F"
                  value={form.pan} onChange={(e) => { set('pan')(e); }} onBlur={() => { const v = form.pan.toUpperCase(); setForm(f => ({ ...f, pan: v })); setErrors(er => ({ ...er, pan: rules.pan(v) })); }} />
                {errors.pan && <span style={errMsg}>⚠ {errors.pan}</span>}
              </div>
            </div>

            <div>
              <label style={fLabel}>Donation Amount (Rs.) *</label>
              <input style={fInput(errors.amount)} type="number" min="1" step="1" value={form.amount}
                onChange={set('amount')} onBlur={blurField('amount', rules.amount)} placeholder="Enter amount in Rs." />
              {errors.amount && <span style={errMsg}>⚠ {errors.amount}</span>}
            </div>

            <div>
              <label style={fLabel}>Dedication / Message</label>
              <textarea style={{ ...fInput(false), minHeight:'75px', resize:'vertical' }} placeholder="In memory of / dedicated to..." value={form.message} onChange={set('message')} />
            </div>

            {payError && (
              <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.5rem .75rem', margin:0 }}>⚠ {payError}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', justifyContent:'center', border:'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Opening Payment…' : '💳 Proceed to Pay'}
            </button>
            <p style={{ fontSize:'.72rem', color:'#888', textAlign:'center' }}>Secured by Razorpay · 100% safe &amp; encrypted · 80G eligible</p>
          </form>
        )}
      </Modal>
    </>
  );
}
