import Link from 'next/link';
import EventHeroBtns from '../components/EventHeroBtns';
import EventRegisterButton from '../components/EventRegisterButton';
import pool from '@/lib/db';

export const metadata = {
  title: 'उत्सव एवं कार्यक्रम | ISKCON Ayodhya',
  description: 'ISKCON अयोध्या में आगामी उत्सव, पवित्र त्योहार और आध्यात्मिक कार्यक्रम। जन्माष्टमी, राम नवमी, भागवत कथा और अधिक के लिए पंजीकरण करें।',
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
  { time: '4:30 AM',  timeHi: '४:३० प्रातः',  name: 'Mangala Aarti',    nameHi: 'मंगल आरती',      icon: '🌅' },
  { time: '7:30 AM',  timeHi: '७:३० प्रातः',  name: 'Sringara Darshan', nameHi: 'श्रृंगार दर्शन', icon: '✨' },
  { time: '8:30 AM',  timeHi: '८:३० प्रातः',  name: 'Guru Puja',        nameHi: 'गुरु पूजा',       icon: '📿' },
  { time: '12:00 PM', timeHi: '१२:०० दोपहर',  name: 'Raj Bhoga Aarti',  nameHi: 'राजभोग आरती',    icon: '🍽️' },
  { time: '4:30 PM',  timeHi: '४:३० शाम',     name: 'Utthapana Aarti',  nameHi: 'उत्थापन आरती',   icon: '☀️' },
  { time: '6:45 PM',  timeHi: '६:४५ शाम',     name: 'Sandhya Aarti',    nameHi: 'संध्या आरती',    icon: '🪔' },
  { time: '8:30 PM',  timeHi: '८:३० रात्रि',  name: 'Shayana Aarti',    nameHi: 'शयन आरती',       icon: '🌙' },
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
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>🎪</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge light">पावन उत्सव · Sacred Celebrations</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                दिव्य <span className="gradient-text-gold">उत्सवों</span> में<br />सम्मिलित हों
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.75)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Celebrate the Divine with Us</p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: '2rem' }}>
                भव्य जन्माष्टमी समारोह से लेकर साप्ताहिक संडे फीस्ट तक — ISKCON अयोध्या सदैव भक्ति, संकीर्तन और आध्यात्मिक आनंद से जीवंत रहता है।
              </p>
              <EventHeroBtns />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.75rem', fontWeight: 700, color: 'rgba(237,104,0,.9)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.25rem' }}>आगामी प्रमुख कार्यक्रम</p>
              {allEvents.slice(0, 4).map((e) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem', padding: '.875rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{e.icon || categoryIcons[e.category] || categoryIcons.default}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', fontWeight: 700, color: 'white', marginBottom: '.05rem' }}>{e.name_hi || e.name}</p>
                    <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>{e.name} · {e.date} {e.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      {featured && (
        <section className="sec-saffron">
          <div className="wrap">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="section-badge light">⭐ विशेष आयोजन</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', fontFamily: 'var(--font-cinzel),serif' }}>{featured.name_hi || featured.name}</h2>
              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.7)', marginTop: '.25rem', fontFamily: 'var(--font-cinzel),serif' }}>{featured.name}</p>
              <p style={{ color: 'rgba(255,255,255,.8)', marginTop: '.5rem' }}>{featured.date} {featured.month} {featured.year}</p>
            </div>
            <div className="reveal" style={{ background: 'rgba(255,255,255,.12)', borderRadius: '1.75rem', padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
              <p style={{ color: 'rgba(255,255,255,.85)', lineHeight: 1.85, marginBottom: '1.5rem', textAlign: 'center' }}>{featured.description_hi || featured.description}</p>
              <div style={{ textAlign: 'center' }}>
                <EventRegisterButton eventName={featured.name} eventId={String(featured.id)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL EVENTS */}
      <section className="sec-light">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">सभी कार्यक्रम · All Programs</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              आगामी <span className="gradient-text">उत्सव एवं कार्यक्रम</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          {allEvents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '3rem 0' }}>कोई कार्यक्रम उपलब्ध नहीं। कृपया बाद में पुनः जाँचें।</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
              {allEvents.map((e, i) => (
                <div key={e.id} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{e.icon || categoryIcons[e.category] || categoryIcons.default}</span>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '.25rem .75rem', borderRadius: '2rem', background: 'rgba(237,104,0,.1)', color: '#ed6800' }}>{e.category}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.95rem', fontWeight: 700, color: '#111', marginBottom: '.15rem' }}>{e.name_hi || e.name}</h3>
                  <p style={{ fontSize: '.7rem', color: '#aaa', marginBottom: '.375rem' }}>{e.name}</p>
                  <p style={{ fontSize: '.78rem', color: '#ed6800', fontWeight: 600, marginBottom: '.875rem' }}>{e.date} {e.month} · {e.year}</p>
                  <p style={{ fontSize: '.84rem', color: '#2d2d2d', lineHeight: 1.8, marginBottom: '1.25rem' }}>{e.description_hi || e.description}</p>
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
            <span className="section-badge light">दैनिक दर्शन · Daily Darshan</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white' }}>
              आरती <span className="gradient-text-gold">कार्यक्रम</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.7)', marginTop: '.35rem' }}>Daily Aarti Schedule</p>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            {aarti.map((a, i) => (
              <div key={a.name} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>{a.icon}</div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: '#ed6800', marginBottom: '.15rem' }}>{a.timeHi}</p>
                <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)', marginBottom: '.35rem' }}>{a.time}</p>
                <p style={{ fontSize: '.82rem', color: 'white', fontWeight: 600, marginBottom: '.1rem' }}>{a.nameHi}</p>
                <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>{a.name}</p>
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
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              हरे कृष्ण! उत्सव में सम्मिलित हों
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,230,150,.8)', marginBottom: '1.25rem' }}>Hare Krishna! Join the Celebration</p>
            <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              ISKCON अयोध्या के उत्सवों, संकीर्तन और प्रसाद का दिव्य आनंद अनुभव करें।
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/booking"  className="btn-primary" style={{ background: 'white', color: '#ed6800' }}>🏨 आवास बुकिंग</Link>
              <Link href="/contact"  className="btn-outline-light">📞 संपर्क करें</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
