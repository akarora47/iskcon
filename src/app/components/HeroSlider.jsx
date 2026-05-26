'use client';
import { useState, useEffect } from 'react';

const slides = [
  { src: '/home-hero-img.jpg',    caption: 'ISKCON अयोध्या मंदिर',       sub: 'अयोध्या धाम, उत्तर प्रदेश — Ayodhya Dham, UP' },
  { src: '/aarti-ceremony.jpg',   caption: 'दैनिक आरती दर्शन',            sub: 'प्रतिदिन ईश्वरीय अनुग्रह का अनुभव करें' },
  { src: '/festival-kirtan.jpg',  caption: 'पावन उत्सव संकीर्तन',         sub: 'गान और भक्ति से प्रभु की महिमा करें' },
  { src: '/temple-deity.png',     caption: 'राधा कृष्ण — दिव्य दर्शन',    sub: 'सर्वाकर्षण श्री कृष्ण के पावन दर्शन' },
  { src: '/temple-gardens.jpg',   caption: 'मंदिर उद्यान — शांत आश्रय',   sub: 'प्रकृति और भक्ति का अद्भुत संगम' },
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
    <div style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.5)', border: '1px solid rgba(237,104,0,.2)', minHeight: '28rem' }}>
      <img
        src={slides[current].src}
        alt={slides[current].caption}
        style={{ width: '100%', height: '100%', minHeight: '28rem', objectFit: 'cover', display: 'block', opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease', position: 'absolute', inset: 0 }}
      />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(10,4,0,.85))' }} />

      {/* Caption */}
      <div style={{ position: 'absolute', bottom: '3.5rem', left: '1.5rem', right: '1.5rem', opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '.25rem' }}>{slides[current].caption}</p>
        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.55)' }}>{slides[current].sub}</p>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.5rem' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{ height: '5px', width: i === current ? '2rem' : '1rem', borderRadius: '3px', border: 'none', background: i === current ? '#ed6800' : 'rgba(255,255,255,.35)', cursor: 'pointer', padding: 0, transition: 'all .3s ease' }}
          />
        ))}
      </div>
    </div>
  );
}
