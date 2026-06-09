'use client';
import { useState } from 'react';
import Modal from './Modal';
import { rules, hasErrors } from '@/lib/validate';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = (err) => ({ width:'100%', padding:'.7rem 1rem', border:`1.5px solid ${err ? '#e53e3e' : 'rgba(196,85,0,.2)'}`, borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box', transition:'border-color .2s' });
const errMsg = { color:'#e53e3e', fontSize:'.72rem', marginTop:'.3rem', display:'block' };

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_ROOM = { name:'', email:'', phone:'', room_type:'', checkin:'', checkout:'', guests:'1', message:'' };
const EMPTY_PRASAD = { name:'', email:'', phone:'', occasion:'', prasad_type:'', portions:'', date_required:'', notes:'' };

const SuccessMsg = ({ icon, msg, onClose }) => (
  <div style={{ textAlign:'center', padding:'2rem 0' }}>
    <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>{icon}</div>
    <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna!</h4>
    <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>{msg}</p>
    <button onClick={onClose} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
  </div>
);

export default function BookingModalBtns({ roomName }) {
  const [modal, setModal]           = useState(null); // 'room' | 'prasad' | null
  const [roomForm, setRoomForm]     = useState(EMPTY_ROOM);
  const [prasadForm, setPrasadForm] = useState(EMPTY_PRASAD);
  const [roomErrors, setRoomErrors] = useState({});
  const [roomSubmitted, setRoomSubmitted]     = useState(false);
  const [prasadSubmitted, setPrasadSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const open = (type) => { setModal(type); setServerError(''); setRoomSubmitted(false); setPrasadSubmitted(false); };

  const setRoom = (k) => (e) => { setRoomForm(f => ({ ...f, [k]: e.target.value })); setRoomErrors(er => ({ ...er, [k]: '' })); };
  const setPrasad = (k) => (e) => setPrasadForm(f => ({ ...f, [k]: e.target.value }));

  const validateRoom = () => {
    const errs = {
      name:      rules.name(roomForm.name),
      email:     rules.email(roomForm.email),
      phone:     rules.phone(roomForm.phone),
      room_type: roomForm.room_type ? '' : 'Please select a room type',
      checkin:   rules.date(roomForm.checkin, 'Check-in date'),
      checkout:  roomForm.checkin && roomForm.checkout && roomForm.checkout <= roomForm.checkin
                   ? 'Check-out must be after check-in' : rules.date(roomForm.checkout, 'Check-out date'),
    };
    setRoomErrors(errs);
    return !hasErrors(errs);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!validateRoom()) return;
    setLoading(true); setServerError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:             roomForm.name,
          email:            roomForm.email,
          phone:            roomForm.phone,
          room_name:        roomName || roomForm.room_type,
          check_in:         roomForm.checkin,
          check_out:        roomForm.checkout,
          guests:           Number(roomForm.guests) || 1,
          special_requests: roomForm.message,
        }),
      });
      if (res.ok) { setRoomSubmitted(true); }
      else { const d = await res.json(); setServerError(d.error || 'Something went wrong. Please try again.'); }
    } catch { setServerError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handlePrasadSubmit = async (e) => {
    e.preventDefault();
    if (!prasadForm.name || !prasadForm.email || !prasadForm.phone) {
      setServerError('Name, email and phone are required.'); return;
    }
    setLoading(true); setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    prasadForm.name,
          email:   prasadForm.email,
          phone:   prasadForm.phone,
          subject: `Prasadam Booking — ${prasadForm.prasad_type || 'General'}`,
          message: `Occasion: ${prasadForm.occasion || '—'}\nPrasadam Type: ${prasadForm.prasad_type || '—'}\nPortions: ${prasadForm.portions || '—'}\nDate Required: ${prasadForm.date_required || '—'}\nNotes: ${prasadForm.notes || '—'}`,
        }),
      });
      if (res.ok) { setPrasadSubmitted(true); }
      else { const d = await res.json(); setServerError(d.error || 'Something went wrong.'); }
    } catch { setServerError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <button onClick={() => open('room')} className="btn-primary" style={{ border:'none', cursor:'pointer' }}>🏨 Book a Room</button>
        <button onClick={() => open('prasad')} className="btn-outline" style={{ cursor:'pointer' }}>🍽️ Book Prasadam</button>
      </div>

      {/* ── Room Booking Modal ── */}
      <Modal isOpen={modal === 'room'} onClose={() => setModal(null)} title="🏨 Room Booking Enquiry">
        {roomSubmitted ? (
          <SuccessMsg icon="🏨"
            msg={`Your room booking enquiry has been received. A confirmation has been sent to ${roomForm.email}. Our team will confirm availability within 24 hours. Welcome to Ayodhya Dham!`}
            onClose={() => setModal(null)} />
        ) : (
          <form onSubmit={handleRoomSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            <div>
              <label style={fLabel}>Full Name *</label>
              <input style={fInput(roomErrors.name)} type="text" placeholder="Your full name"
                value={roomForm.name} onChange={setRoom('name')}
                onBlur={() => setRoomErrors(er => ({ ...er, name: rules.name(roomForm.name) }))} />
              {roomErrors.name && <span style={errMsg}>⚠ {roomErrors.name}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Email *</label>
                <input style={fInput(roomErrors.email)} type="email" placeholder="email@example.com"
                  value={roomForm.email} onChange={setRoom('email')}
                  onBlur={() => setRoomErrors(er => ({ ...er, email: rules.email(roomForm.email) }))} />
                {roomErrors.email && <span style={errMsg}>⚠ {roomErrors.email}</span>}
              </div>
              <div>
                <label style={fLabel}>Phone *</label>
                <input style={fInput(roomErrors.phone)} type="tel" placeholder="9XXXXXXXXX" maxLength={10}
                  value={roomForm.phone} onChange={setRoom('phone')}
                  onBlur={() => setRoomErrors(er => ({ ...er, phone: rules.phone(roomForm.phone) }))} />
                {roomErrors.phone && <span style={errMsg}>⚠ {roomErrors.phone}</span>}
              </div>
            </div>

            <div>
              <label style={fLabel}>Room Type *</label>
              <select style={fInput(roomErrors.room_type)} value={roomForm.room_type} onChange={setRoom('room_type')}>
                <option value="">— Select room type —</option>
                <option>Devotee Dormitory (₹300/night)</option>
                <option>Private Room (₹1,200/night)</option>
                <option>Deluxe Suite (₹2,500/night)</option>
              </select>
              {roomErrors.room_type && <span style={errMsg}>⚠ {roomErrors.room_type}</span>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Check-In *</label>
                <input style={fInput(roomErrors.checkin)} type="date" min={today()}
                  value={roomForm.checkin} onChange={setRoom('checkin')} />
                {roomErrors.checkin && <span style={errMsg}>⚠ {roomErrors.checkin}</span>}
              </div>
              <div>
                <label style={fLabel}>Check-Out *</label>
                <input style={fInput(roomErrors.checkout)} type="date" min={roomForm.checkin || today()}
                  value={roomForm.checkout} onChange={setRoom('checkout')} />
                {roomErrors.checkout && <span style={errMsg}>⚠ {roomErrors.checkout}</span>}
              </div>
            </div>

            <div>
              <label style={fLabel}>Number of Guests</label>
              <select style={fInput(false)} value={roomForm.guests} onChange={setRoom('guests')}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
              </select>
            </div>

            <div>
              <label style={fLabel}>Special Requests</label>
              <textarea style={{ ...fInput(false), minHeight:'70px', resize:'vertical' }}
                placeholder="Any special requirements..." value={roomForm.message} onChange={setRoom('message')} />
            </div>

            {serverError && <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.6rem .875rem', margin:0 }}>⚠ {serverError}</p>}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', justifyContent:'center', border:'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Submitting…' : '🏨 Send Booking Enquiry'}
            </button>
            <p style={{ fontSize:'.75rem', color:'#888', textAlign:'center' }}>We will confirm availability within 24 hours.</p>
          </form>
        )}
      </Modal>

      {/* ── Prasadam Booking Modal ── */}
      <Modal isOpen={modal === 'prasad'} onClose={() => setModal(null)} title="🍽️ Prasadam Booking">
        {prasadSubmitted ? (
          <SuccessMsg icon="🍽️"
            msg={`Your prasadam booking request has been received. A confirmation has been sent to ${prasadForm.email}. Our seva team will contact you shortly. Jai Sri Ram!`}
            onClose={() => setModal(null)} />
        ) : (
          <form onSubmit={handlePrasadSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            <div>
              <label style={fLabel}>Your Name *</label>
              <input required style={fInput(false)} type="text" placeholder="Your full name"
                value={prasadForm.name} onChange={setPrasad('name')} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Email *</label>
                <input required style={fInput(false)} type="email" placeholder="email@example.com"
                  value={prasadForm.email} onChange={setPrasad('email')} />
              </div>
              <div>
                <label style={fLabel}>Phone *</label>
                <input required style={fInput(false)} type="tel" placeholder="+91 00000 00000"
                  value={prasadForm.phone} onChange={setPrasad('phone')} />
              </div>
            </div>

            <div>
              <label style={fLabel}>Occasion / Event</label>
              <input style={fInput(false)} type="text" placeholder="e.g. Birthday, Janmashtami"
                value={prasadForm.occasion} onChange={setPrasad('occasion')} />
            </div>

            <div>
              <label style={fLabel}>Prasadam Type *</label>
              <select required style={fInput(false)} value={prasadForm.prasad_type} onChange={setPrasad('prasad_type')}>
                <option value="">— Select prasadam type —</option>
                <option>Standard Plate (Lunch / Dinner)</option>
                <option>Maha-Prasadam (Festival Grade)</option>
                <option>Deity Bhoga Remnants</option>
                <option>Custom Order</option>
              </select>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Portions *</label>
                <input required style={fInput(false)} type="number" placeholder="e.g. 50" min="1"
                  value={prasadForm.portions} onChange={setPrasad('portions')} />
              </div>
              <div>
                <label style={fLabel}>Date Required *</label>
                <input required style={fInput(false)} type="date" min={today()}
                  value={prasadForm.date_required} onChange={setPrasad('date_required')} />
              </div>
            </div>

            <div>
              <label style={fLabel}>Special Notes</label>
              <textarea style={{ ...fInput(false), minHeight:'70px', resize:'vertical' }}
                placeholder="Dietary requirements or special requests..."
                value={prasadForm.notes} onChange={setPrasad('notes')} />
            </div>

            {serverError && <p style={{ color:'#e53e3e', fontSize:'.82rem', background:'rgba(229,62,62,.06)', border:'1px solid rgba(229,62,62,.2)', borderRadius:'.5rem', padding:'.6rem .875rem', margin:0 }}>⚠ {serverError}</p>}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', justifyContent:'center', border:'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Submitting…' : '🍽️ Confirm Prasadam Booking'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
