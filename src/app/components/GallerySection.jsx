'use client';
import { useState } from 'react';

const galleryItems = [
  { label: 'Temple Deity — Divine Darshan',    img: '/temple-deity.png'   },
  { label: 'Sacred Kirtan — Festival Celebration', img: '/festival-kirtan.jpg'  },
  { label: 'GauShala — Sacred Cows', img: '/gaushala.jpg'    },
  { label: 'Prasadam Hall — Free Meals', img: '/prasadam-hall.jpg'  },
  { label: 'Aarti Ceremony — Daily Worship', img: '/aarti-ceremony.jpg'  },
  { label: 'Temple Gardens — Sacred Grounds', img: '/temple-gardens.jpg'},
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null); // index or null

  const prev = () => setLightbox((lightbox - 1 + galleryItems.length) % galleryItems.length);
  const next = () => setLightbox((lightbox + 1) % galleryItems.length);

  return (
    <>
      <section className="sec-light">
        <div className="wrap">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="section-badge">Temple Gallery · Divine Moments</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.75rem)', fontWeight:700, color:'#111' }}>
              Divine <span className="gradient-text">Moments</span>
            </h2>
            <div className="gold-line-center" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {galleryItems.map((item, i) => (
              <div
                key={item.label}
                className={`gal-item reveal-scale d${(i % 3 + 1) * 100}`}
                style={{ position:'relative', cursor:'pointer' }}
                onClick={() => setLightbox(i)}
              >
                <img src={item.img} alt={item.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div className="gal-overlay">
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ fontSize:'1.25rem' }}>🔍</span>
                    <p style={{ fontFamily:'var(--font-cinzel),serif', color:'white', fontWeight:600, fontSize:'.9rem' }}>{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.92)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            style={{ position:'absolute', top:'1.5rem', right:'1.5rem', width:'3rem', height:'3rem', borderRadius:'50%', border:'none', background:'rgba(255,255,255,.1)', color:'white', fontSize:'1.25rem', cursor:'pointer', zIndex:2 }}
          >✕</button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{ position:'absolute', left:'1.5rem', width:'3.5rem', height:'3.5rem', borderRadius:'50%', border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.08)', color:'white', fontSize:'1.5rem', cursor:'pointer', zIndex:2 }}
          >‹</button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:'90vw', maxHeight:'85vh', borderRadius:'1.25rem', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,.8)' }}>
            <img
              src={galleryItems[lightbox].img}
              alt={galleryItems[lightbox].label}
              style={{ maxWidth:'90vw', maxHeight:'82vh', objectFit:'contain', display:'block' }}
            />
            <div style={{ background:'rgba(0,0,0,.85)', padding:'.875rem 1.5rem', textAlign:'center' }}>
              <p style={{ fontFamily:'var(--font-cinzel),serif', color:'white', fontWeight:600, fontSize:'.9rem' }}>{galleryItems[lightbox].label}</p>
              <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginTop:'.25rem' }}>{lightbox + 1} / {galleryItems.length}</p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{ position:'absolute', right:'1.5rem', width:'3.5rem', height:'3.5rem', borderRadius:'50%', border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.08)', color:'white', fontSize:'1.5rem', cursor:'pointer', zIndex:2 }}
          >›</button>
        </div>
      )}
    </>
  );
}
