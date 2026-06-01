'use client';
import { useState, useEffect } from 'react';

const slides = [
  { src: '/home-hero-img.jpg',    caption: 'ISKCON Ayodhya Temple',        sub: 'Ayodhya Dham, Uttar Pradesh — Sacred Land of Lord Ram' },
  { src: '/aarti-ceremony.jpg',   caption: 'Daily Aarti Darshan',           sub: 'Experience divine grace every day at the temple' },
  { src: '/festival-kirtan.jpg',  caption: 'Sacred Festival Kirtan',        sub: 'Glorify the Lord through song and devotion' },
  { src: '/temple-deity.png',     caption: 'Radha Krishna — Divine Vision', sub: 'Behold the sacred form of Lord Krishna and Radha' },
  { src: '/temple-gardens.jpg',   caption: 'Temple Gardens — Peaceful Retreat', sub: 'A beautiful union of nature and devotion' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFading(false);
      }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i) => {
    if (i === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 300);
  };

  return (
    <div style={{
      position: 'relative', borderRadius: '2rem', overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,.12), 0 0 0 1px rgba(196,85,0,.1)',
      border: '1px solid rgba(196,85,0,.12)', minHeight: '28rem',
    }}>
      <img
        src={slides[current].src}
        alt={slides[current].caption}
        style={{
          width: '100%', height: '100%', minHeight: '28rem',
          objectFit: 'cover', display: 'block',
          opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease',
          position: 'absolute', inset: 0,
        }}
      />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,.72))' }} />

      {/* Caption */}
      <div style={{
        position: 'absolute', bottom: '3.5rem', left: '1.5rem', right: '1.5rem',
        opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease',
      }}>
        <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '.25rem' }}>
          {slides[current].caption}
        </p>
        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)' }}>
          {slides[current].sub}
        </p>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.5rem' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: '5px', width: i === current ? '2rem' : '1rem',
              borderRadius: '3px',
              border: 'none', background: i === current ? '#ed6800' : 'rgba(255,255,255,.35)',
              cursor: 'pointer', padding: 0, transition: 'all .3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
