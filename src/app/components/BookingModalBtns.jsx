'use client';
import { useState } from 'react';
import Modal from './Modal';

const fLabel = { display:'block', fontSize:'.78rem', fontWeight:600, color:'#444', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--font-poppins),sans-serif' };
const fInput = { width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(196,85,0,.2)', borderRadius:'.75rem', fontSize:'.9rem', fontFamily:'var(--font-poppins),sans-serif', color:'#111', background:'white', outline:'none', boxSizing:'border-box' };

export default function BookingModalBtns() {
  const [modal, setModal]       = useState(null); // 'room' | 'prasad' | null
  const [submitted, setSubmitted] = useState(false);

  const open = (type) => { setModal(type); setSubmitted(false); };
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const SuccessMsg = ({ icon, msg }) => (
    <div style={{ textAlign:'center', padding:'2rem 0' }}>
      <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>{icon}</div>
      <h4 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>Hare Krishna!</h4>
      <p style={{ fontSize:'.9rem', lineHeight:1.75, color:'#444' }}>{msg}</p>
      <button onClick={() => setModal(null)} className="btn-primary" style={{ marginTop:'1.5rem', border:'none', cursor:'pointer' }}>Close</button>
    </div>
  );

  return (
    <>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <button onClick={() => open('room')} className="btn-primary" style={{ border:'none', cursor:'pointer' }}>🏨 Book a Room</button>
        <button onClick={() => open('prasad')} className="btn-outline" style={{ cursor:'pointer' }}>🍽️ Book Prasadam</button>
      </div>

      {/* Room Booking Modal */}
      <Modal isOpen={modal === 'room'} onClose={() => setModal(null)} title="🏨 Room Booking Enquiry">
        {submitted ? (
          <SuccessMsg icon="🏨" msg="Your room booking enquiry has been received. Our team will confirm availability and contact you within 24 hours. Welcome to Ayodhya Dham!" />
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={fLabel}>Full Name *</label>
              <input required style={fInput} type="text" placeholder="Your full name" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Email *</label>
                <input required style={fInput} type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label style={fLabel}>Phone *</label>
                <input required style={fInput} type="tel" placeholder="+91 00000 00000" />
              </div>
            </div>
            <div>
              <label style={fLabel}>Room Type *</label>
              <select required style={fInput}>
                <option value="">— Select room type —</option>
                <option>Devotee Dormitory (₹300/night)</option>
                <option>Private Room (₹1,200/night)</option>
                <option>Deluxe Suite (₹2,500/night)</option>
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Check-In *</label>
                <input required style={fInput} type="date" />
              </div>
              <div>
                <label style={fLabel}>Check-Out *</label>
                <input required style={fInput} type="date" />
              </div>
            </div>
            <div>
              <label style={fLabel}>Number of Guests</label>
              <input style={fInput} type="number" placeholder="1" min="1" defaultValue="1" />
            </div>
            <div>
              <label style={fLabel}>Special Requests</label>
              <textarea style={{ ...fInput, minHeight:'70px', resize:'vertical' }} placeholder="Any special requirements..." />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', border:'none', cursor:'pointer', marginTop:'.5rem' }}>
              🏨 Send Booking Enquiry
            </button>
          </form>
        )}
      </Modal>

      {/* Prasadam Booking Modal */}
      <Modal isOpen={modal === 'prasad'} onClose={() => setModal(null)} title="🍽️ Prasadam Booking">
        {submitted ? (
          <SuccessMsg icon="🍽️" msg="Your prasadam booking request has been received. Our seva team will contact you to confirm your order. Jai Sri Ram!" />
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={fLabel}>Your Name *</label>
              <input required style={fInput} type="text" placeholder="Your full name" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
              <div>
                <label style={fLabel}>Email *</label>
                <input required style={fInput} type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label style={fLabel}>Phone *</label>
                <input required style={fInput} type="tel" placeholder="+91 00000 00000" />
              </div>
            </div>
            <div>
              <label style={fLabel}>Occasion / Event</label>
              <input style={fInput} type="text" placeholder="e.g. Birthday, Janmashtami" />
            </div>
            <div>
              <label style={fLabel}>Prasadam Type *</label>
              <select required style={fInput}>
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
                <input required style={fInput} type="number" placeholder="e.g. 50" min="1" />
              </div>
              <div>
                <label style={fLabel}>Date Required *</label>
                <input required style={fInput} type="date" />
              </div>
            </div>
            <div>
              <label style={fLabel}>Special Notes</label>
              <textarea style={{ ...fInput, minHeight:'70px', resize:'vertical' }} placeholder="Dietary requirements or special requests..." />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', border:'none', cursor:'pointer', marginTop:'.5rem' }}>
              🍽️ Confirm Prasadam Booking
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
