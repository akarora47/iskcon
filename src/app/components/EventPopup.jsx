'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function EventPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:99998, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(10,4,0,.75)', backdropFilter:'blur(6px)' }} />

      {/* Card */}
      <div style={{ position:'relative', width:'100%', maxWidth:'480px', borderRadius:'2rem', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,.6)', border:'1px solid rgba(237,104,0,.3)' }}>
        {/* Image header */}
        <div style={{ position:'relative', height:'14rem' }}>
          <img src="/festival-kirtan.jpg" alt="Janmashtami" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.2) 0%,rgba(10,4,0,.85) 100%)' }} />
          <div style={{ position:'absolute', bottom:'1.25rem', left:'1.5rem', right:'1.5rem' }}>
            <span style={{ background:'#ed6800', color:'white', fontSize:'.7rem', fontWeight:700, padding:'.3rem .9rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'.1em' }}>⭐ Upcoming Event</span>
            <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.35rem', fontWeight:700, color:'white', marginTop:'.5rem', lineHeight:1.2 }}>Janmashtami Mahotsav 2026</h2>
          </div>
          <button onClick={() => setOpen(false)} style={{ position:'absolute', top:'1rem', right:'1rem', width:'2rem', height:'2rem', borderRadius:'50%', border:'none', background:'rgba(0,0,0,.5)', cursor:'pointer', color:'white', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ background:'#fffdf8', padding:'1.75rem' }}>
          <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.25rem' }}>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'2rem', fontWeight:900, color:'#ed6800', lineHeight:1 }}>24</p>
              <p style={{ fontSize:'.7rem', fontWeight:700, color:'#c45500', textTransform:'uppercase' }}>Aug 2026</p>
            </div>
            <div style={{ borderLeft:'2px solid rgba(237,104,0,.15)', paddingLeft:'1.5rem' }}>
              <p style={{ fontSize:'.88rem', color:'#3d2200', lineHeight:1.7, marginBottom:'.5rem' }}>
                Grand celebration of Lord Krishna's divine birth — kirtan, abhisheka, drama, cultural programs, and free maha-prasadam for thousands of devotees.
              </p>
              <p style={{ fontSize:'.78rem', color:'#ed6800', fontWeight:600 }}>📍 ISKCON Ayodhya Mandir &nbsp;·&nbsp; 4:00 PM onwards</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'.75rem' }}>
            <Link href="/events" onClick={() => setOpen(false)} className="btn-primary" style={{ flex:1, justifyContent:'center', textAlign:'center' }}>Register Free →</Link>
            <button onClick={() => setOpen(false)} style={{ padding:'.7rem 1.25rem', borderRadius:'2rem', border:'2px solid rgba(237,104,0,.2)', background:'transparent', color:'#ed6800', fontSize:'.85rem', fontWeight:600, cursor:'pointer' }}>Maybe Later</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
