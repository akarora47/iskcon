import Link from 'next/link';
import DonationSection from './components/DonationSection';
import GallerySection from './components/GallerySection';
import HeroSlider from './components/HeroSlider';
import pool from '@/lib/db';

export const metadata = {
  title: 'ISKCON Ayodhya | हरे कृष्ण – भक्ति का पवित्र धाम',
  description: 'ISKCON Ayodhya — श्री राम की पावन नगरी में भक्ति, प्रसाद, उत्सव और आध्यात्मिक सेवा का केंद्र। Hare Krishna!',
};

const fallbackEvents = [
  { id: 1, icon: '🎪', name_hi: 'जन्माष्टमी महोत्सव', name: 'Janmashtami Mahotsav', date: '24', month: 'Aug', year: '2026', description_hi: 'श्री कृष्ण के दिव्य प्रकटोत्सव का भव्य आयोजन — महाभिषेक, नाटक, संकीर्तन और हज़ारों भक्तों को महाप्रसाद का वितरण।' },
  { id: 2, icon: '🏹', name_hi: 'राम नवमी यात्रा',     name: 'Ram Navami Yatra',      date: '17', month: 'Apr', year: '2026', description_hi: 'अयोध्या की पवित्र गलियों में संकीर्तन यात्रा, राम कथा और भव्य नगर परिक्रमा। सभी भक्तों का हार्दिक स्वागत है।' },
  { id: 3, icon: '📖', name_hi: 'भागवत सप्ताह',        name: 'Bhagwat Saptah',         date: '05', month: 'Jun', year: '2026', description_hi: 'सात दिवसीय श्रीमद्भागवत पारायण — वरिष्ठ वैष्णव संतों द्वारा। परिवार सहित आइए।' },
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
    quoteHi: 'ISKCON अयोध्या आना मेरे जीवन का सबसे सुंदर अनुभव था। यहाँ का प्रसाद, संकीर्तन और वातावरण — सब कुछ अलौकिक था।',
    quoteEn: 'The prasadam, the kirtans, the atmosphere — everything felt divine and deeply peaceful.',
    author: 'Priya Sharma', city: 'नई दिल्ली'
  },
  {
    quoteHi: 'अन्नदान सेवा में भाग लेकर मुझे जीवन का नया उद्देश्य मिला। भक्तों की सेवा ही प्रभु की सेवा है।',
    quoteEn: 'Serving the Lord through service to His devotees is the highest joy.',
    author: 'Ramesh Gupta', city: 'वाराणसी'
  },
  {
    quoteHi: 'मंदिर में प्रवेश करते ही प्रभु श्री राम की उपस्थिति का अनुभव होता है। भक्त इतने स्नेही हैं कि मन प्रसन्न हो जाता है।',
    quoteEn: 'I felt the presence of Lord Ram the moment I stepped in.',
    author: 'Anita Verma', city: 'लखनऊ'
  },
];

export default async function Home() {
  const events = await getUpcomingEvents();
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* SECTION 1 — HERO */}
      <section className="hero-dark">
        <div className="hero-pattern" />
        <div className="hero-om-bg">ॐ</div>
        <div className="hero-star-bg">✦</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid" style={{ gap: '4rem' }}>

            {/* LEFT */}
            <div>
              <span className="section-badge light">🙏 हरे कृष्ण · हरे राम</span>
              <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.15 }}>
                Welcome to <span className="gradient-text-gold">ISKCON<br />Ayodhya</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: 'clamp(.85rem,1.4vw,.95rem)', color: 'rgba(255,210,100,.75)', marginBottom: '1.5rem', letterSpacing: '.04em' }}>
                श्री राम की पावन नगरी में आपका हार्दिक स्वागत है
              </p>
              <p style={{ fontSize: 'clamp(.95rem,1.6vw,1.1rem)', color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, marginBottom: '2rem' }}>
                अयोध्या धाम — जहाँ प्रभु श्री राम ने अपनी दिव्य लीलाएँ कीं, उसी पवित्र भूमि पर ISKCON का यह मंदिर शुद्ध भक्ति, वैदिक संस्कृति और ईश्वरीय अनुग्रह का केंद्र है। आइए, प्रभु के प्रेम का अनुभव कीजिए।
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/donation" className="btn-primary">🙏 सेवा अर्पण करें</Link>
                <Link href="/booking"  className="btn-outline-light">🏨 आवास बुक करें</Link>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'दर्शन', value: 'प्रातः ६ – रात्रि ८:३०' },
                  { label: 'प्रसाद', value: 'प्रतिदिन निःशुल्क' },
                  { label: 'स्थान', value: 'अयोध्या धाम, UP' },
                ].map((info) => (
                  <div key={info.label}>
                    <p style={{ fontSize: '.68rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#ed6800', marginBottom: '.2rem', fontFamily: 'var(--font-poppins)' }}>{info.label}</p>
                    <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.8)', fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — auto-sliding image carousel */}
            <HeroSlider />

          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section className="stats-bar">
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 0' }}>
            {[
              { num: '५०,०००+', label: 'प्रतिवर्ष भक्त सेवित'  },
              { num: '२५+',     label: 'वर्षों की दिव्य सेवा'  },
              { num: '३०+',     label: 'वार्षिक उत्सव'         },
              { num: '१५+',     label: 'देशों से भक्त'         },
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
                <span className="section-badge">ISKCON अयोध्या के बारे में</span>
                <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.75rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
                  दिव्य कृपा का <span className="gradient-text">पवित्र आश्रय</span>
                </h2>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>A Sanctuary of Divine Grace</p>
                <div className="gold-line" />
              </div>
              <p className="reveal-left d200" style={{ fontSize: '.95rem', lineHeight: 1.9, color: '#2d2d2d', marginBottom: '1.5rem' }}>
                अयोध्या धाम — प्रभु श्री राम की जन्मभूमि — में स्थित ISKCON का यह मंदिर भक्ति, संस्कृति और आध्यात्मिक परिवर्तन का केंद्र है। श्रील प्रभुपाद की दिव्य शिक्षाओं पर आधारित यह मंदिर प्रतिवर्ष हज़ारों तीर्थयात्रियों और भक्तों की सेवा करता है।
              </p>
              <p className="reveal-left d300" style={{ fontSize: '.95rem', lineHeight: 1.9, color: '#2d2d2d', marginBottom: '2rem' }}>
                दैनिक आरती और भागवत कक्षाओं से लेकर भव्य उत्सवों, गौशाला सेवा और अन्नदान सेवा तक — यहाँ की प्रत्येक गतिविधि भगवान के चरण कमलों में एक शुद्ध भक्ति का अर्पण है।
              </p>
              <div className="reveal-left d400" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' }}>
                <Link href="/about" className="btn-primary">हमारी कहानी जानें →</Link>
                <Link href="/donation" className="btn-outline" style={{ border: '2px solid rgba(237,104,0,.35)', color: '#ed6800', padding: '.65rem 1.4rem', borderRadius: '2rem', fontSize: '.88rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>🌸 सेवा अर्पण</Link>
              </div>
            </div>

            {/* Right — temple image */}
            <div className="reveal-right" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '1.75rem', overflow: 'hidden', boxShadow: '0 24px 60px rgba(237,104,0,.18)', border: '1px solid rgba(237,104,0,.15)' }}>
                <img src="/about-iskcon-ayodhya.jpg" alt="ISKCON Ayodhya Mandir" style={{ width: '100%', height: '26rem', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 55%,rgba(26,9,0,.75))', borderRadius: '1.75rem' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {['🛕 ७ दैनिक आरतियाँ', '🍽️ निःशुल्क प्रसाद', '🐄 गौशाला', '📖 भागवत कक्षा'].map((badge) => (
                  <span key={badge} style={{ background: 'rgba(237,104,0,.85)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '.72rem', fontWeight: 600, padding: '.35rem .85rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,.15)' }}>{badge}</span>
                ))}
              </div>
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: 'linear-gradient(135deg,#c45500,#ed6800)', borderRadius: '1.25rem', padding: '1rem 1.4rem', boxShadow: '0 12px 30px rgba(237,104,0,.4)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>2005</p>
                <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.25rem' }}>स्थापित</p>
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
            <span className="section-badge">पावन पर्व कैलेंडर</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              आगामी <span className="gradient-text">उत्सव एवं कार्यक्रम</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginTop: '.35rem', letterSpacing: '.04em' }}>Upcoming Events &amp; Festivals</p>
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
                    <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.9rem', fontWeight: 700, color: '#111', marginTop: '.2rem' }}>{ev.name_hi || ev.name}</h3>
                    <p style={{ fontSize: '.7rem', color: '#ed6800', marginTop: '.1rem' }}>{ev.name}</p>
                  </div>
                </div>
                <p style={{ fontSize: '.84rem', color: '#2d2d2d', lineHeight: 1.8 }}>{ev.description_hi || ev.description || ev.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/events" className="btn-primary">सभी उत्सव देखें →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — GALLERY */}
      <GallerySection />

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="sec-warm">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">भक्तों के अनुभव</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              भक्ति की <span className="gradient-text">आवाज़ें</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginTop: '.35rem', letterSpacing: '.04em' }}>Voices of Devotion</p>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={t.author} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ fontSize: '3rem', color: 'rgba(237,104,0,.15)', fontFamily: 'serif', lineHeight: 1, marginBottom: '.5rem' }}>"</div>
                <p style={{ fontSize: '.9rem', lineHeight: 1.85, color: '#2d2d2d', marginBottom: '1rem', fontStyle: 'italic' }}>{t.quoteHi}</p>
                <p style={{ fontSize: '.78rem', lineHeight: 1.7, color: '#888', marginBottom: '1.5rem', fontStyle: 'italic' }}>{t.quoteEn}</p>
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
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              हरे कृष्ण! आज ही आपनी<br />आध्यात्मिक यात्रा आरंभ करें
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.85rem', color: 'rgba(255,230,150,.85)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Hare Krishna! Begin Your Spiritual Journey Today</p>
            <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              चाहे आप दर्शन के लिए आएं, सेवा अर्पण करना चाहें, स्वयंसेवक बनना चाहें या पवित्र तीर्थयात्रा की योजना बनाएं — ISKCON अयोध्या आपका प्रेमपूर्वक स्वागत करता है।
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/booking"  className="btn-primary" style={{ background: 'white', color: '#ed6800' }}>🏨 आवास बुकिंग</Link>
              <Link href="/donation" className="btn-outline-light">🌺 सेवा में सहयोग</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
