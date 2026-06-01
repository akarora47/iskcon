'use client';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';


const STYLES = `
@keyframes ep-popupIn {
  from { opacity:0; transform:scale(.88) translateY(28px); }
  to   { opacity:1; transform:scale(1)   translateY(0);    }
}
@keyframes ep-floatUp {
  from { opacity:0; transform:translateY(48px) scale(.82); }
  to   { opacity:1; transform:translateY(0)    scale(1);   }
}
@keyframes ep-pulse-ring {
  0%  { transform:scale(1);   opacity:.65; }
  70% { transform:scale(1.6); opacity:0;   }
  100%{ transform:scale(1.6); opacity:0;   }
}
@keyframes ep-bob {
  0%,100%{ transform:translateY(0);    }
  50%    { transform:translateY(-7px); }
}
@keyframes ep-glow {
  0%,100%{ box-shadow:0 8px 30px rgba(196,85,0,.5),  0 0 0 0    rgba(196,85,0,.3); }
  50%    { box-shadow:0 14px 50px rgba(196,85,0,.75), 0 0 0 10px rgba(196,85,0,0); }
}
@keyframes ep-shimmer {
  0%  { background-position:-200% center; }
  100%{ background-position: 200% center; }
}
.ep-card   { animation:ep-popupIn .4s cubic-bezier(.34,1.56,.64,1) both; }
.ep-widget { animation:ep-floatUp .45s cubic-bezier(.34,1.56,.64,1) both, ep-glow 3s ease-in-out 1s infinite; }
.ep-bob    { animation:ep-bob 3.6s ease-in-out infinite; }
.ep-thumb-wrap::before {
  content:''; position:absolute; inset:-5px; border-radius:50%;
  border:2px solid rgba(237,104,0,.8);
  animation:ep-pulse-ring 2.2s ease-out infinite;
}
`;

export default function EventPopup() {
  const [mounted,   setMounted]   = useState(false);
  const [popup,     setPopup]     = useState(null);
  const [state,     setState]     = useState('hidden');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!document.getElementById('ep-css')) {
      const el = document.createElement('style');
      el.id = 'ep-css';
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    fetch('/api/popup')
      .then(r => r.json())
      .then(d => {
        if (!d || !d.id) return;
        setPopup(d);
        setTimeout(() => setState('open'), 2000);
      })
      .catch(() => {});
  }, []);

  const minimize = useCallback(() => {
    setState('mini');
  }, []);

  const reopen = useCallback(() => {
    setState('open');
  }, []);

  if (!mounted || !popup) return null;

  const img   = popup.image || '/festival-kirtan.jpg';
  const venue = [popup.event_date, popup.event_time, popup.event_venue].filter(Boolean).join('  ·  ');

  return createPortal(
    <>
      {state === 'open' && (
        <div style={{position:'fixed',inset:0,zIndex:99998,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div onClick={minimize} style={{position:'absolute',inset:0,background:'rgba(8,3,0,.72)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)'}} />

          <div className="ep-card" role="dialog" aria-modal="true" aria-label={popup.title} style={{position:'relative',width:'100%',maxWidth:'500px',borderRadius:'2rem',overflow:'hidden',boxShadow:'0 50px 120px rgba(0,0,0,.55), 0 0 0 1.5px rgba(237,104,0,.25)'}}>

            <div style={{position:'relative',height:'15rem',overflow:'hidden',background:'#1a0800'}}>
              {!imgLoaded && (
                <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#1a0800 25%,#2d1200 50%,#1a0800 75%)',backgroundSize:'200% 100%',animation:'ep-shimmer 1.4s infinite'}} />
              )}
              <img src={img} alt={popup.title} onLoad={() => setImgLoaded(true)}
                style={{width:'100%',height:'100%',objectFit:'cover',display:'block',opacity:imgLoaded?1:0,transition:'opacity .5s'}} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,.06) 0%,rgba(8,3,0,.85) 100%)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#d4af37,#ed6800,#d4af37,transparent)'}} />

              <div style={{position:'absolute',bottom:'1.25rem',left:'1.5rem',right:'4rem'}}>
                <span style={{display:'inline-block',background:'linear-gradient(135deg,#c45500,#ed6800)',color:'white',fontSize:'.67rem',fontWeight:700,padding:'.28rem .88rem',borderRadius:'2rem',textTransform:'uppercase',letterSpacing:'.1em',boxShadow:'0 4px 16px rgba(237,104,0,.45)',marginBottom:'.55rem'}}>
                  {popup.badge_text || '⭐ Upcoming Event'}
                </span>
                <h2 style={{fontFamily:'var(--font-cinzel),serif',fontSize:'clamp(1.1rem,3vw,1.45rem)',fontWeight:700,color:'white',margin:0,lineHeight:1.18,textShadow:'0 2px 14px rgba(0,0,0,.6)'}}>
                  {popup.title}
                </h2>
                {popup.subtitle && (
                  <p style={{color:'rgba(255,255,255,.72)',fontSize:'.8rem',marginTop:'.3rem',marginBottom:0}}>{popup.subtitle}</p>
                )}
              </div>

              <button onClick={minimize} aria-label="Minimize popup"
                style={{position:'absolute',top:'1rem',right:'1rem',width:'2.1rem',height:'2.1rem',borderRadius:'50%',border:'none',background:'rgba(0,0,0,.52)',backdropFilter:'blur(8px)',cursor:'pointer',color:'white',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(237,104,0,.75)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,.52)'}>✕</button>
            </div>

            <div style={{background:'#fffdf8',padding:'1.75rem'}}>
              {venue && (
                <div style={{display:'flex',alignItems:'center',gap:'.65rem',background:'rgba(237,104,0,.07)',border:'1px solid rgba(237,104,0,.18)',borderRadius:'.9rem',padding:'.72rem 1rem',marginBottom:'1.2rem'}}>
                  <span style={{fontSize:'1.15rem',flexShrink:0}}>📅</span>
                  <p style={{fontSize:'.82rem',color:'#c45500',fontWeight:600,margin:0,lineHeight:1.4}}>{venue}</p>
                </div>
              )}

              {popup.description && (
                <p style={{fontSize:'.88rem',color:'#444',lineHeight:1.78,marginBottom:'1.25rem',marginTop:0}}>{popup.description}</p>
              )}

              <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                {popup.btn_text && (
                  <Link href={popup.btn_link||'/events'} onClick={minimize}
                    style={{flex:1,minWidth:'130px',display:'flex',alignItems:'center',justifyContent:'center',padding:'.82rem 1.25rem',borderRadius:'2rem',background:'linear-gradient(135deg,#c45500,#ed6800)',color:'white',fontWeight:700,fontSize:'.88rem',textDecoration:'none',boxShadow:'0 8px 24px rgba(237,104,0,.38)',transition:'filter .2s, transform .2s',fontFamily:'var(--font-poppins),sans-serif'}}
                    onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.12)';e.currentTarget.style.transform='translateY(-1px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.filter='brightness(1)';e.currentTarget.style.transform='translateY(0)';}}>
                    {popup.btn_text}
                  </Link>
                )}
                {popup.btn2_text && (
                  <Link href={popup.btn2_link||'/events'} onClick={minimize}
                    style={{padding:'.82rem 1.25rem',borderRadius:'2rem',border:'2px solid rgba(237,104,0,.28)',background:'transparent',color:'#ed6800',fontWeight:600,fontSize:'.88rem',textDecoration:'none',transition:'border-color .2s',display:'flex',alignItems:'center',fontFamily:'var(--font-poppins),sans-serif'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(237,104,0,.6)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(237,104,0,.28)'}>
                    {popup.btn2_text}
                  </Link>
                )}
              </div>

              <p style={{textAlign:'center',fontSize:'.7rem',color:'#ccc',marginTop:'.9rem',marginBottom:0}}>
                Click outside or ✕ to minimize · click the widget to reopen
              </p>
            </div>
          </div>
        </div>
      )}

      {state === 'mini' && (
        <button onClick={reopen} aria-label={`View upcoming event: ${popup.title}`} className="ep-widget"
          style={{position:'fixed',bottom:'1.5rem',right:'1.5rem',zIndex:99997,display:'flex',alignItems:'center',gap:'.8rem',padding:'.6rem 1rem .6rem .6rem',borderRadius:'3rem',background:'linear-gradient(135deg,#140800 0%,#2a1000 100%)',border:'1.5px solid rgba(237,104,0,.4)',cursor:'pointer',maxWidth:'260px',transition:'transform .2s, filter .2s',outline:'none'}}
          onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05) translateY(-2px)';e.currentTarget.style.filter='brightness(1.18)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='scale(1) translateY(0)';e.currentTarget.style.filter='brightness(1)';}}>

          <div className="ep-bob" style={{position:'relative',flexShrink:0}}>
            <div className="ep-thumb-wrap" style={{position:'relative',width:'3rem',height:'3rem',borderRadius:'50%',overflow:'hidden',border:'2px solid rgba(237,104,0,.55)'}}>
              <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{position:'absolute',bottom:'1px',right:'1px',width:'.62rem',height:'.62rem',borderRadius:'50%',background:'#4ade80',border:'2px solid #140800',boxShadow:'0 0 7px #4ade80'}} />
          </div>

          <div style={{textAlign:'left',minWidth:0,flex:1}}>
            <p style={{fontSize:'.6rem',fontWeight:700,color:'#ed6800',textTransform:'uppercase',letterSpacing:'.1em',margin:0,marginBottom:'.12rem'}}>
              {popup.badge_text || '⭐ Upcoming Event'}
            </p>
            <p style={{fontSize:'.8rem',fontWeight:700,color:'white',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'145px'}}>
              {popup.title}
            </p>
            {popup.event_date && (
              <p style={{fontSize:'.65rem',color:'rgba(255,255,255,.45)',margin:0,marginTop:'.1rem'}}>📅 {popup.event_date}</p>
            )}
          </div>

          <div style={{width:'1.6rem',height:'1.6rem',borderRadius:'50%',flexShrink:0,background:'rgba(237,104,0,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',color:'#ed6800'}}>▶</div>
        </button>
      )}
    </>,
    document.body
  );
}
