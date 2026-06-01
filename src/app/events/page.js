import Link from 'next/link';
import EventHeroBtns from '../components/EventHeroBtns';
import EventRegisterButton from '../components/EventRegisterButton';
import pool from '@/lib/db';

export const metadata = {
  title: 'Events & Festivals | ISKCON Ayodhya',
  description: 'Upcoming festivals, sacred celebrations and spiritual programs at ISKCON Ayodhya. Register for Janmashtami, Ram Navami, Bhagavat Katha and more.',
};

// Category → icon mapping for events that may not have an icon stored
const categoryIcons = { Festival: '🎪', Spiritual: '📖', Education: '🎓', Weekly: '🎵', Cultural: '🌸', default: '🕉️' };

async function getEvents() {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE active = 1 ORDER BY featured DESC, id ASC');
    return rows;
  } catch {
    return [];
  }
}

const aarti = [
  { time: '4:30 AM',  name: 'Mangala Aarti',    icon: '🌅' },
  { time: '7:30 AM',  name: 'Sringara Darshan', icon: '✨' },
  { time: '8:30 AM',  name: 'Guru Puja',        icon: '📿' },
  { time: '12:00 PM', name: 'Raj Bhoga Aarti',  icon: '🍽️' },
  { time: '4:30 PM',  name: 'Utthapana Aarti',  icon: '☀️' },
  { time: '6:45 PM',  name: 'Sandhya Aarti',    icon: '🪔' },
  { time: '8:30 PM',  name: 'Shayana Aarti',    icon: '🌙' },
];

export default async function EventsPage() {
  const events   = await getEvents();
  const featured = events.find(e => e.featured) || events[0];
  const allEvents = events;

  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-ring" style={{ top: '20%', left: '6%', width: '140px', height: '140px' }} />
        <div className="hero-ring" style={{ bottom: '15%', right: '12%', width: '90px', height: '90px', animationDelay: '5s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>🎪</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge">Sacred Celebrations</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                Join the <span className="gradient-text-gold">Divine Festivals</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Celebrate the Divine with Us</p>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, marginBottom: '2rem' }}>
                From the grand Janmashtami celebrations to the weekly Sunday Feast — ISKCON Ayodhya is always alive with devotion, sankirtan and spiritual joy.
              </p>
              <EventHeroBtns />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.75rem', fontWeight: 700, color: '#c45500', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.25rem' }}>Upcoming Key Events</p>
              {allEvents.slice(0, 4).map((e) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196,85,0,.15)', borderRadius: '1rem', padding: '.875rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{e.icon || categoryIcons[e.category] || categoryIcons.default}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', fontWeight: 700, color: '#111', marginBottom: '.05rem' }}>{e.name}</p>
                    <p style={{ fontSize: '.65rem', color: '#999' }}>{e.date} {e.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      {featured && (
        <section className="sec-light" style={{ padding: '4rem 0' }}>
          <div className="wrap">
            <div className="reveal" style={{
              position: 'relative', borderRadius: '2rem', overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(196,85,0,.14)',
              boxShadow: '0 20px 70px rgba(196,85,0,.1), 0 4px 20px rgba(0,0,0,.04)',
            }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #c45500, #ed6800, #ff8c33, #ed6800, #c45500)', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }} />

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2.5rem', padding: '2.75rem 3rem' }}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #fff8f0 0%, #ffe8cc 100%)',
                  border: '3px solid rgba(196,85,0,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '4rem', animation: 'floatY 6s ease-in-out infinite',
                  boxShadow: '0 12px 40px rgba(196,85,0,.15)',
                }}>
                  {featured.icon || '🎪'}
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ background: 'linear-gradient(90deg, #c45500, #ed6800)', color: 'white', fontSize: '.72rem', fontWeight: 700, padding: '.4rem 1.1rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>⭐ Featured Event</span>
                    <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: '#ed6800', fontWeight: 700, background: 'rgba(196,85,0,.08)', padding: '.3rem .9rem', borderRadius: '2rem', border: '1px solid rgba(196,85,0,.15)' }}>{featured.date} {featured.month} {featured.year}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 700, color: '#111', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                    {featured.name}
                  </h2>
                  <p style={{ color: '#555', lineHeight: 1.9, fontSize: '.95rem', marginBottom: '2rem', maxWidth: '560px' }}>{featured.description}</p>
                  <EventRegisterButton eventName={featured.name} eventId={String(featured.id)} />
                </div>
              </div>

              <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,85,0,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-20%', right: '15%', width: '180px', height: '180px', borderRadius: '50%', border: '2px solid rgba(196,85,0,.08)', pointerEvents: 'none' }} />
            </div>
          </div>
        </section>
      )}

      {/* ALL EVENTS */}
      <section className="sec-light">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">All Programs</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              Upcoming <span className="gradient-text">Events & Festivals</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          {allEvents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '3rem 0' }}>No events available at the moment. Please check back soon.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
              {allEvents.map((e, i) => (
                <div key={e.id} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{e.icon || categoryIcons[e.category] || categoryIcons.default}</span>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '.25rem .75rem', borderRadius: '2rem', background: 'rgba(237,104,0,.1)', color: '#ed6800' }}>{e.category}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.95rem', fontWeight: 700, color: '#111', marginBottom: '.375rem' }}>{e.name}</h3>
                  <p style={{ fontSize: '.78rem', color: '#ed6800', fontWeight: 600, marginBottom: '.875rem' }}>{e.date} {e.month} · {e.year}</p>
                  <p style={{ fontSize: '.84rem', color: '#2d2d2d', lineHeight: 1.8, marginBottom: '1.25rem' }}>{e.description}</p>
                  <EventRegisterButton eventName={e.name} eventId={String(e.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AARTI SCHEDULE */}
      <section className="sec-dark" id="schedule">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Daily Darshan</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              Daily Aarti <span className="gradient-text-gold">Schedule</span>
            </h2>
            <div className="gold-line-center" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            {aarti.map((a, i) => (
              <div key={a.name} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>{a.icon}</div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: '#ed6800', marginBottom: '.35rem' }}>{a.time}</p>
                <p style={{ fontSize: '.82rem', color: '#111', fontWeight: 600 }}>{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Hare Krishna! Join the Celebration
            </h2>
            <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              Experience the divine joy of ISKCON Ayodhya's festivals, sankirtan and prasadam.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/donation" className="btn-primary">🌸 Offer Seva</Link>
              <Link href="/contact"  className="btn-outline">📞 Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
