import Link from 'next/link';

export const metadata = {
  title: 'About ISKCON Ayodhya | Our Story, Philosophy & Founder',
  description: 'ISKCON Ayodhya — Srila Prabhupada, our history, Vedic philosophy and the path of Krishna consciousness. Learn about our spiritual journey.',
};

const pillars = [
  { icon: '📿', title: 'Bhakti Yoga',    desc: 'The path of loving devotion to Lord Krishna — the most accessible means of self-realisation in this age of Kali.' },
  { icon: '🍽️', title: 'Seva (Service)', desc: 'Selfless service to the Lord, His devotees, and all living beings. True service purifies the heart and pleases the Supreme.' },
  { icon: '📖', title: 'Sadhu Sanga',    desc: 'Association of saintly devotees, regular scripture study, kirtan and participation in Bhagavat Katha — this elevates consciousness.' },
  { icon: '🌺', title: 'Sadhana Bhakti', desc: 'Daily devotional practices — aarti, japa meditation, deity worship — that steadily elevate the soul toward the divine.' },
];

const schedule = [
  { time: '4:30 AM',  activity: 'Mangala Aarti',         desc: 'The first darshan of the Lord at dawn — with love and reverence.' },
  { time: '7:15 AM',  activity: 'Guru Puja & Bhagavatam', desc: 'Morning class and offering to the Acharya.' },
  { time: '12:00 PM', activity: 'Raj Bhoga Aarti',        desc: 'Grand midday offering of food to the deities.' },
  { time: '4:30 PM',  activity: 'Utthapana Aarti',        desc: 'Aarti welcoming the Lord after His afternoon rest.' },
  { time: '6:45 PM',  activity: 'Sandhya Aarti',          desc: 'Evening kirtan and aarti — the most attended gathering of the day.' },
  { time: '8:30 PM',  activity: 'Shayana Aarti',          desc: 'The final peaceful aarti as the Lord retires for the night.' },
];

export default function AboutPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* ══ SECTION 1 — ABOUT US ══ */}
      <section id="about-us" className="hero-dark-sm" style={{ minHeight: '65vh' }}>
        <div className="hero-pattern" />
        <div className="hero-ring" style={{ top: '20%', left: '6%', width: '140px', height: '140px' }} />
        <div className="hero-ring" style={{ bottom: '15%', right: '12%', width: '90px', height: '90px', animationDelay: '5s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.07 }}>ॐ</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge">Hare Krishna 🙏 · Welcome to Ayodhya Dham</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                Welcome to <span className="gradient-text-gold">ISKCON Ayodhya</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Sanctuary of Divine Grace in the Sacred Land of Lord Ram</p>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                Situated in Ayodhya Dham — the eternal abode of Lord Ram — ISKCON's temple is a vibrant centre of devotion, Vedic culture and spiritual awakening.
              </p>
              <p style={{ fontSize: '.95rem', color: '#555', lineHeight: 1.85, marginBottom: '2rem' }}>
                Founded in the divine tradition of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, this temple serves thousands of pilgrims and devotees through prasadam, aarti and the timeless message of the Bhagavad Gita.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/donation" className="btn-primary">🌸 Offer Seva</Link>
                <Link href="/events"   className="btn-outline">🎪 View Events</Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { num: '2019', label: 'Established in Ayodhya', icon: '🛕' },
                { num: '50,000+', label: 'Devotees Served Annually', icon: '🙏' },
                { num: '30+', label: 'Annual Festivals', icon: '🎪' },
                { num: '108+', label: 'Temples Worldwide', icon: '🌏' },
              ].map((s) => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196,85,0,.18)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 700, color: '#111', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '.72rem', color: '#888', marginTop: '.35rem', lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — FOUNDER ACHARYA ══ */}
      <section id="founder" className="sec-dark" style={{ padding: '6rem 0' }}>
        <div className="wrap">
          <div className="hero-grid" style={{ gap: '4rem', alignItems: 'center' }}>

            <div className="reveal-left" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '2rem', overflow: 'hidden', border: '2px solid rgba(212,175,55,.3)', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
                <img src="/about-iskcon-ayodhya.jpg" alt="Srila Prabhupada" style={{ width: '100%', height: '28rem', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,.55))', borderRadius: '2rem' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', color: '#d4af37', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em' }}>Founder-Acharya</p>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', color: 'white', fontSize: '1rem', fontWeight: 700 }}>A.C. Bhaktivedanta Swami Prabhupada</p>
              </div>
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: 'linear-gradient(135deg,#d4af37,#b8860b)', borderRadius: '1rem', padding: '.75rem 1.25rem', textAlign: 'center', boxShadow: '0 8px 25px rgba(212,175,55,.35)' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.25rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>1896</p>
                <p style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.2rem' }}>Born · Kolkata</p>
              </div>
            </div>

            <div className="reveal-right">
              <span className="section-badge">Founder Acharya</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                His Divine Grace<br /><span className="gradient-text">Srila Prabhupada</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '1rem', letterSpacing: '.04em' }}>A.C. Bhaktivedanta Swami</p>
              <div className="gold-line" />
              <p style={{ fontSize: '.95rem', color: '#555', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                Born in Kolkata in 1896, Abhay Charanaravinda Bhaktivedanta Swami Prabhupada undertook the divine mission of spreading Krishna consciousness to the Western world — fulfilling the order of his spiritual master with extraordinary dedication.
              </p>
              <p style={{ fontSize: '.95rem', color: '#666', lineHeight: 1.9, marginBottom: '2rem' }}>
                At the age of 69, he sailed alone to New York with just a few rupees and a trunk of Bhagavatam books. In just 12 years he established over 108 temples, translated 80+ Vedic scriptures, and built the most influential Vaishnava movement in modern history.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {[
                  { icon: '📚', text: 'Translated 80+ Vedic scriptures into English' },
                  { icon: '🌍', text: '108+ temples established across every corner of the world' },
                  { icon: '✈️', text: 'Travelled to 14 countries at the age of 72' },
                  { icon: '🙏', text: 'Initiated thousands of disciples worldwide' },
                ].map((f) => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem 1rem', background: 'rgba(196,85,0,.06)', borderRadius: '.875rem', border: '1px solid rgba(196,85,0,.1)' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.icon}</span>
                    <p style={{ fontSize: '.85rem', color: '#555' }}>{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — THE HISTORY ══ */}
      <section id="history" className="sec-warm" style={{ padding: '6rem 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-badge">Our Journey</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
              The <span className="gradient-text">History</span> of ISKCON Ayodhya
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '.75rem', letterSpacing: '.04em' }}>From a global movement born in New York to a sacred presence in Ayodhya Dham</p>
            <div className="gold-line-center" />
            <p style={{ color: '#555', maxWidth: '540px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.8 }}>
              A story of devotion and divine will — from a single storefront in Manhattan to the holy land of Lord Ram.
            </p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '7rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom,#ed6800,rgba(237,104,0,.05))' }} />
            {[
              { year: '1966', icon: '🏛️', event: 'ISKCON Founded in New York', desc: 'Srila Prabhupada established ISKCON in a small storefront in New York — sparking a worldwide spiritual revolution.' },
              { year: '1977', icon: '🕊️', event: "Prabhupada's Eternal Legacy", desc: 'The Founder-Acharya departed this world, leaving behind 108+ temples, thousands of initiated disciples, and translations of 80+ Vedic scriptures.' },
              { year: '1984', icon: '🌺', event: 'ISKCON Comes to Uttar Pradesh', desc: 'Devotees began serving in the sacred land of Uttar Pradesh — deeply connected to Lord Vishnu, Lord Ram and the Vaishnava tradition.' },
              { year: '2019', icon: '🛕', event: 'ISKCON Ayodhya Established', desc: 'ISKCON was formally established in Ayodhya Dham — the birthplace of Lord Ram — with daily aarti, prasadam distribution and Bhagavatam classes commencing.' },
              { year: '2024', icon: '🚧', event: 'New Temple Complex — Coming Soon', desc: 'A grand modern temple complex is being built in Ayodhya Dham — a future beacon of devotion and Vedic culture for pilgrims and devotees worldwide. Stay tuned!' },
            ].map((m, i) => (
              <div key={m.year} className={`reveal d${(i+1)*100}`} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative' }}>
                <div style={{ minWidth: '7rem', textAlign: 'center', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                  <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', fontFamily: 'var(--font-cinzel),serif', fontWeight: 700, fontSize: '.82rem', padding: '.4rem .9rem', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(237,104,0,.3)' }}>{m.year}</span>
                </div>
                <div className="card-border" style={{ flex: 1, padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.35rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                    <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.92rem', fontWeight: 700, color: '#111' }}>{m.event}</h3>
                  </div>
                  <p style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.8, marginTop: '.625rem' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — WHY KRISHNA CONSCIOUSNESS? ══ */}
      <section id="philosophy" className="sec-dark" style={{ padding: '6rem 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-badge">The Question Every Soul Asks</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
              Why <span className="gradient-text">Krishna Consciousness?</span>
            </h2>
            <div className="gold-line-center" />
            <p style={{ color: '#555', maxWidth: '560px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.85 }}>
              Lord Krishna says in the Bhagavad Gita — <em style={{ color: '#c45500' }}>"Abandon all varieties of dharma and simply surrender unto Me. I shall deliver you from all sinful reactions. Do not fear."</em>
            </p>
            <p style={{ color: '#888', fontSize: '.78rem', marginTop: '.5rem', fontStyle: 'italic' }}>— Bhagavad Gita 18.66</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              { icon: '💫', title: 'Beyond Religion', desc: 'Krishna consciousness is not a sectarian religion — it is the eternal science of the soul, applicable to all human beings regardless of caste, creed or nationality.' },
              { icon: '🕊️', title: 'Freedom from Suffering', desc: 'The Bhagavatam teaches that all suffering is rooted in material identification. Awakening to one\'s eternal relationship with Krishna liberates one from the cycle of birth and death.' },
              { icon: '🌍', title: 'Proven Worldwide', desc: '700+ ISKCON centres in 120+ countries, distribution of millions of Bhagavad Gitas, and millions of transformed lives — this movement is its own proof.' },
              { icon: '📖', title: 'Backed by Scripture', desc: 'Bhagavad Gita As It Is, Srimad Bhagavatam, and Chaitanya Charitamrita — the finest Vedic literature presented in accessible language for the modern seeker.' },
              { icon: '🎵', title: 'The Power of Kirtan', desc: 'The Hare Krishna Mahamantra — the most powerful means of self-realisation in this age of Kali. Kirtan purifies the mind and awakens the dormant love of God in the heart.' },
              { icon: '🙏', title: 'Practical Spirituality', desc: 'Kitchen service, temple service, book distribution — Krishna bhakti integrates devotion into every aspect of life. No need to renounce the world — purify your consciousness.' },
            ].map((c, i) => (
              <div key={c.title} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{c.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.95rem', fontWeight: 700, color: '#111', marginBottom: '.75rem' }}>{c.title}</h3>
                <p style={{ fontSize: '.85rem', lineHeight: 1.85, color: '#555' }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '2.5rem', background: 'rgba(196,85,0,.06)', border: '1px solid rgba(196,85,0,.15)', borderRadius: '2rem' }}>
            <p style={{ fontSize: '1.5rem', color: '#ed6800', marginBottom: '1rem', fontFamily: 'serif' }}>"</p>
            <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.85, fontStyle: 'italic', marginBottom: '1.25rem' }}>
              The highest perfection of human life is to awaken one's dormant love for God. And that is the purpose of the Krishna consciousness movement.
            </p>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: '#ed6800', textTransform: 'uppercase', letterSpacing: '.12em' }}>— Srila Prabhupada</p>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — PHILOSOPHY / PILLARS ══ */}
      <section id="pillars" className="sec-warm" style={{ padding: '6rem 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-badge">Vedic Wisdom</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
              Our <span className="gradient-text">Philosophy</span>
            </h2>
            <div className="gold-line-center" />
            <p style={{ color: '#555', maxWidth: '520px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.8 }}>
              ISKCON follows the <strong style={{ color: '#ed6800' }}>Achintya Bhedabheda</strong> philosophy of the Vaishnava tradition — the wondrous mystery of simultaneous oneness and difference revealed by Sri Chaitanya Mahaprabhu.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {pillars.map((p, i) => (
              <div key={p.title} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '2.25rem' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg,rgba(237,104,0,.12),rgba(237,104,0,.04))', border: '1px solid rgba(237,104,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '.625rem' }}>{p.title}</h3>
                <p style={{ fontSize: '.85rem', lineHeight: 1.85, color: '#555' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '.25rem' }}>Daily Temple <span className="gradient-text">Schedule</span></h3>
            <div className="gold-line-center" />
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
            {schedule.map((s, i) => (
              <div key={s.time} className={`card-border reveal d${(i+1)*100}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.75rem' }}>
                <div style={{ minWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.85rem', fontWeight: 700, color: '#ed6800', display: 'block' }}>{s.time}</span>
                </div>
                <div style={{ width: '2px', height: '36px', background: 'rgba(237,104,0,.2)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#111', fontSize: '.9rem', marginBottom: '.2rem' }}>{s.activity}</p>
                  <p style={{ fontSize: '.8rem', color: '#555', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Hare Krishna — Come Join Us
            </h2>
            <p style={{ color: '#333', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              Experience the joy of devotion, the taste of prasadam, and the peace of this holy Dham. ISKCON Ayodhya welcomes every soul.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/donation" className="btn-primary">🌸 Offer Seva Now</Link>
              <Link href="/donation" className="btn-outline">🌸 Offer Seva</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
