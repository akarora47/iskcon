'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'absolute', inset:0, background:'rgba(10,4,0,.78)', backdropFilter:'blur(6px)' }}
      />
      {/* Panel */}
      <div style={{
        position:'relative', background:'#fffdf8', borderRadius:'1.75rem',
        padding:'2.5rem', width:'100%', maxWidth:'520px',
        maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 40px 100px rgba(0,0,0,.55)',
        border:'1px solid rgba(237,104,0,.15)',
      }}>
        {/* Header row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.2rem', fontWeight:700, color:'#1a0900' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ width:'2.25rem', height:'2.25rem', borderRadius:'50%', border:'none',
              background:'rgba(237,104,0,.1)', cursor:'pointer', fontSize:'.95rem',
              color:'#ed6800', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background .2s' }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
