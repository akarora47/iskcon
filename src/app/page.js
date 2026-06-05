import Link from 'next/link';
import DonationSection from './components/DonationSection';
import GallerySection from './components/GallerySection';
import HeroSlider from './components/HeroSlider';
import pool from '@/lib/db';

export const metadata = {
  title: 'ISKCON Ayodhya | Hare Krishna — Temple of Devotion',
  description: 'ISKCON Ayodhya — Experience devotion, prasadam, sacred festivals and spiritual grace in the holy city of Lord Ram. Hare Krishna!',
};

const fallbackEvents = [
  { id: 1, icon: '🎪', name: 'Janmashtami Mahotsav', date: '24', month: 'Aug', year: '2026', description: 'Grand celebration of Lord Krishna\'s divine birth — Mahabhisheka, drama, sankirtan, and maha-prasadam for thousands of devotees.' },
  { id: 2, icon: '🏹', name: 'Ram Navami Yatra',     date: '17', month: 'Apr', year: '2026', description: 'Sankirtan procession through the holy streets of Ayodhya, Ram Katha, and a grand city circumambulation. All devotees warmly welcome.' },
  { id: 3, icon: '📖', name: 'Bhagwat Saptah',       date: '05', month: 'Jun', year: '2026', description: 'Seven-day Srimad Bhagavatam recitation by senior Vaishnava saints. Come with your family.' },
];

async function getUpcomingEvents() {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE active = 1 ORDER BY featured DESC, id ASC LIMIT 3');
    return rows.length > 0 ? rows : fallbackEvents;
  } catch {
    return fallbackEvents;
  }
}

const testimonials = [
  {
    quote: 'The prasadam, the kirtans, the atmosphere — everything felt divine and deeply peaceful. Visiting ISKCON Ayodhya was the most beautiful experience of my life.',
    author: 'Priya Sharma', city: 'New Delhi',
  },
  {
    quote: 'Participating in Annadan Seva gave me a new sense of purpose. Serving the Lord through service to His devotees is the highest joy.',
    author: 'Ramesh Gupta', city: 'Varanasi',
  },
  {
    quote: 'I felt the presence of Lord Ram the moment I stepped in. The devotees are so warm and loving — my heart was filled with peace.',
    author: 'Anita Verma', city: 'Lucknow',
  },
];

export default async function Home() {
  const events = await getUpcomingEvents();
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* SECTION 1 — HERO */}
      <section className="hero-dark">
        <div className="hero-pattern" />
        <div className="hero-om-bg">हरे कृष्ण</div>
        <div className="hero-star-bg">✦</div>
        <div className="hero-ring" style={{ top: '15%', left: '8%', width: '180px', height: '180px', animationDelay: '3s' }} />
        <div className="hero-ring" style={{ top: '55%', right: '15%', width: '100px', height: '100px', animationDelay: '7s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '3%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(196,85,0,.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', left: '12%', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(196,85,0,.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '25%', right: '20%', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(196,85,0,.15)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid" style={{ gap: '4rem' }}>
            <div>
              <span className="section-badge">🙏 Shree Shree Radha Gokulanand</span>
              <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.15 }}>
                Welcome to <span className="gradient-text-gold">ISKCON<br />Ayodhya</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: 'clamp(.85rem,1.4vw,.95rem)', color: '#ed6800', marginBottom: '1.5rem', letterSpacing: '.04em' }}>
                In the Sacred Land of Lord Ram, Ayodhya Dham
              </p>
              <p style={{ fontSize: 'clamp(.95rem,1.6vw,1.1rem)', color: '#555', lineHeight: 1.85, marginBottom: '2rem' }}>
                Ayodhya Dham — where Lord Ram performed His divine pastimes. On this sacred land, ISKCON's temple stands as a centre of pure devotion, Vedic culture and divine grace. Come, experience the love of the Lord.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/donation" className="btn-primary">🙏 Offer Seva</Link>
                <Link href="/events"   className="btn-outline">🎪 View Events</Link>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(196,85,0,.1)' }}>
                {[
                  { label: 'Darshan', value: '4:30 AM – 8:30 PM' },
                  { label: 'Location', value: 'Naka Hanuman Garhi, Faizabad, Ayodhya' },
                ].map((info) => (
                  <div key={info.label} style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '.68rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#555', marginBottom: '.2rem', fontFamily: 'var(--font-poppins)' }}>{info.label}</p>
                    <p style={{ fontSize: '.85rem', color: '#333', fontFamily: 'var(--font-poppins)', fontWeight: 500, wordBreak: 'break-word' }}>{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section className="stats-bar">
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 0' }}>
            {[
              { num: '50,000+', label: 'Devotees Served Annually' },
              { num: '25+',     label: 'Years of Divine Service'  },
              { num: '30+',     label: 'Annual Festivals'         },
              { num: '15+',     label: 'Countries Represented'    },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="reveal-scale" style={{ textAlign: 'center', padding: '0 2.5rem' }}>
                  <div className="stat-num">{stat.num}</div>
                  <div className="stat-lbl">{stat.label}</div>
                </div>
                {i < arr.length - 1 && <div className="stat-sep" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — ABOUT INTRO */}
      <section className="sec-warm">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="reveal-left">
                <span className="section-badge">About ISKCON Ayodhya</span>
                <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.75rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
                  A <span className="gradient-text">Sanctuary of Divine Grace</span>
                </h2>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Devotion · Culture · Spiritual Transformation</p>
                <div className="gold-line" />
              </div>
              <p className="reveal-left d200" style={{ fontSize: '.95rem', lineHeight: 1.9, color: '#2d2d2d', marginBottom: '1.5rem' }}>
                Located in Ayodhya Dham — the birthplace of Lord Ram — ISKCON's temple is a living centre of devotion, culture and spiritual transformation. Founded on the divine teachings of Srila Prabhupada, the temple serves thousands of pilgrims and devotees every year.
              </p>
              <p className="reveal-left d300" style={{ fontSize: '.95rem', lineHeight: 1.9, color: '#2d2d2d', marginBottom: '2rem' }}>
                From daily aartis and Bhagavatam classes to grand festivals, GauShala seva and Annadan seva — every activity here is an offering of pure devotion at the lotus feet of the Lord.
              </p>
              <div className="reveal-left d400" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' }}>
                <Link href="/about" className="btn-primary">Our Story →</Link>
                <Link href="/donation" className="btn-outline" style={{ border: '2px solid rgba(237,104,0,.35)', color: '#ed6800', padding: '.65rem 1.4rem', borderRadius: '2rem', fontSize: '.88rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>🌸 Offer Seva</Link>
              </div>
            </div>

            <div className="reveal-right" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '1.75rem', overflow: 'hidden', boxShadow: '0 24px 60px rgba(237,104,0,.18)', border: '1px solid rgba(237,104,0,.15)' }}>
                <img src="/about-iskcon-ayodhya.jpg" alt="ISKCON Ayodhya Temple" style={{ width: '100%', height: '26rem', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 55%,rgba(0,0,0,.55))', borderRadius: '1.75rem' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {['🛕 7 Daily Aartis', '🍽️ Free Prasadam', '🐄 GauShala', '📖 Bhagavatam Class'].map((badge) => (
                  <span key={badge} style={{ background: 'rgba(237,104,0,.85)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '.72rem', fontWeight: 600, padding: '.35rem .85rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,.15)' }}>{badge}</span>
                ))}
              </div>
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: 'linear-gradient(135deg,#c45500,#ed6800)', borderRadius: '1.25rem', padding: '1rem 1.4rem', boxShadow: '0 12px 30px rgba(237,104,0,.4)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>2019</p>
                <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.25rem' }}>Established</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SEVA / DONATION */}
      <DonationSection />

      {/* SECTION 5 — UPCOMING EVENTS */}
      <section className="sec-light">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Sacred Festival Calendar</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              Upcoming <span className="gradient-text">Events & Festivals</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {events.map((ev, i) => (
              <div key={ev.id || ev.name} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'linear-gradient(135deg,#fff0dc,#ffe0a0)', borderRadius: '1rem', padding: '.75rem 1rem', textAlign: 'center', minWidth: '4rem' }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 900, color: '#ed6800', lineHeight: 1 }}>{ev.date}</p>
                    <p style={{ fontSize: '.65rem', fontWeight: 700, color: '#c45500', textTransform: 'uppercase', letterSpacing: '.08em' }}>{ev.month}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.5rem' }}>{ev.icon || '🎪'}</span>
                    <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.9rem', fontWeight: 700, color: '#111', marginTop: '.2rem' }}>{ev.name}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '.84rem', color: '#2d2d2d', lineHeight: 1.8 }}>{ev.description || ev.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/events" className="btn-primary">View All Events →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — GALLERY */}
      <GallerySection />

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="sec-warm">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Devotee Experiences</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              <span className="gradient-text">Voices of Devotion</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={t.author} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ fontSize: '3rem', color: 'rgba(237,104,0,.15)', fontFamily: 'serif', lineHeight: 1, marginBottom: '.5rem' }}>"</div>
                <p style={{ fontSize: '.9rem', lineHeight: 1.85, color: '#2d2d2d', marginBottom: '1.5rem', fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#ed6800,#c45500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '.9rem' }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '.88rem' }}>{t.author}</p>
                    <p style={{ fontSize: '.75rem', color: '#555' }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Hare Krishna! Begin Your<br />Spiritual Journey Today
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.85rem', color: '#c45500', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Visit · Serve · Celebrate · Transform</p>
            <p style={{ color: '#555', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              Whether you come for darshan, wish to offer seva, volunteer, or plan a sacred pilgrimage — ISKCON Ayodhya welcomes you with love and devotion.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/donation" className="btn-primary">🌸 Offer Seva Now</Link>
              <Link href="/donation" className="btn-outline">🌺 Support Our Seva</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
