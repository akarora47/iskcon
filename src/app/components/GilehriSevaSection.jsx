'use client';
import { useState } from 'react';
import GilehriSevaPopup from './GilehriSevaPopup';

export default function GilehriSevaSection({ gilehri, projectTitle }) {
  const [open, setOpen] = useState(false);

  if (!gilehri) return null;

  return (
    <>
      <section style={{ padding:'5rem 0', background:'linear-gradient(135deg,#0f0500 0%,#1e0a00 50%,#0f0500 100%)', position:'relative', overflow:'hidden' }}>
        {/* Decorative rings */}
        <div style={{ position:'absolute', top:'-6rem', left:'-6rem', width:'28rem', height:'28rem', borderRadius:'50%', border:'1px solid rgba(212,175,55,.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-3rem', left:'-3rem', width:'16rem', height:'16rem', borderRadius:'50%', border:'1px solid rgba(212,175,55,.1)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', right:'-5rem', width:'24rem', height:'24rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-2rem', right:'-2rem', width:'12rem', height:'12rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.3),rgba(237,104,0,.5),rgba(212,175,55,.3),transparent)' }} />

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap:'3.5rem', alignItems:'center' }}>

            {/* Left — image */}
            {gilehri.image && (
              <div style={{ position:'relative' }}>
                <div style={{ borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,.5)', border:'1px solid rgba(212,175,55,.2)' }}>
                  <img src={gilehri.image} alt={gilehri.title} style={{ width:'100%', height:'22rem', objectFit:'cover', display:'block' }} />
                </div>
                {/* Gold corner accents */}
                <div style={{ position:'absolute', top:'-1rem', left:'-1rem', width:'3rem', height:'3rem', borderTop:'2px solid #d4af37', borderLeft:'2px solid #d4af37', borderRadius:'.25rem 0 0 0', opacity:.6 }} />
                <div style={{ position:'absolute', bottom:'-1rem', right:'-1rem', width:'3rem', height:'3rem', borderBottom:'2px solid #d4af37', borderRight:'2px solid #d4af37', borderRadius:'0 0 .25rem 0', opacity:.6 }} />
              </div>
            )}

            {/* Right — content */}
            <div>
              <div style={{ marginBottom:'1.25rem' }}>
                <span style={{ display:'inline-block', background:'linear-gradient(135deg,#5d3a00,#8b5200)', color:'#f5d08a', fontSize:'.65rem', fontWeight:700, padding:'.3rem .9rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'.12em', border:'1px solid rgba(212,175,55,.25)', boxShadow:'0 4px 12px rgba(93,58,0,.4)' }}>
                  {gilehri.badge_text || '🐿️ Gilehri Seva'}
                </span>
              </div>

              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'white', lineHeight:1.2, marginBottom:'.75rem' }}>
                {gilehri.title}
              </h2>

              {gilehri.subtitle && (
                <p style={{ fontStyle:'italic', color:'#d4af37', fontSize:'1rem', marginBottom:'1.25rem', fontWeight:500, opacity:.9 }}>{gilehri.subtitle}</p>
              )}

              <p style={{ fontSize:'.95rem', color:'rgba(255,255,255,.7)', lineHeight:1.9, marginBottom:'1.75rem' }}>{gilehri.description}</p>

              {/* Benefits */}
              {Array.isArray(gilehri.benefits) && gilehri.benefits.length > 0 && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'.6rem', marginBottom:'2rem' }}>
                  {gilehri.benefits.map((b, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'.6rem', background:'rgba(212,175,55,.06)', border:'1px solid rgba(212,175,55,.15)', borderRadius:'.75rem', padding:'.65rem .875rem' }}>
                      <span style={{ color:'#d4af37', fontSize:'.8rem', flexShrink:0, marginTop:'.1rem' }}>✦</span>
                      <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,.75)', lineHeight:1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested amounts */}
              {Array.isArray(gilehri.suggested_amounts) && gilehri.suggested_amounts.length > 0 && (
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
                  {gilehri.suggested_amounts.map(a => (
                    <span key={a} style={{ background:'rgba(237,104,0,.12)', color:'#ed6800', fontSize:'.78rem', fontWeight:700, padding:'.3rem .875rem', borderRadius:'2rem', border:'1px solid rgba(237,104,0,.25)' }}>
                      ₹{Number(a).toLocaleString('en-IN')}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpen(true)}
                style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', padding:'1rem 2.25rem', borderRadius:'2rem', border:'none', background:'linear-gradient(135deg,#5d3a00,#c45500,#ed6800)', color:'white', fontWeight:700, fontSize:'.95rem', cursor:'pointer', boxShadow:'0 10px 30px rgba(139,82,0,.45)', fontFamily:'var(--font-poppins),sans-serif', letterSpacing:'.01em', transition:'filter .2s' }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                🐿️ {gilehri.cta_text || 'Participate in Gilehri Seva'}
              </button>
            </div>

          </div>
        </div>
      </section>

      <GilehriSevaPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        gilehri={gilehri}
        projectTitle={projectTitle}
      />
    </>
  );
}
