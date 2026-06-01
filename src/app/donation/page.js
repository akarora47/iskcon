import Link from 'next/link';
import DonationCampaignSection from '../components/DonationCampaignSection';
import OtherSevasSection from '../components/OtherSevasSection';

export const metadata = {
  title: 'Seva & Donation | ISKCON Ayodhya — Offerings at the Lord\'s Feet',
  description: 'Offer your seva at ISKCON Ayodhya — GauShala, Annadan, festivals and sacred services. Every offering reaches the lotus feet of the Lord.',
};


const impactStats = [
  { num: '5,000+', label: 'Souls Served Daily'       },
  { num: '50+',    label: 'Sacred Cows Protected'     },
  { num: '30+',    label: 'Annual Festivals'          },
  { num: '₹1Cr+', label: 'Annual Seva Contributions' },
];

export default function DonationPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-ring" style={{ top: '20%', left: '6%', width: '140px', height: '140px' }} />
        <div className="hero-ring" style={{ bottom: '15%', right: '12%', width: '90px', height: '90px', animationDelay: '5s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>🙏</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">

            <div>
              <span className="section-badge">🌸 Offer Seva · Receive Grace</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                Let Your Seva Reach<br /><span className="gradient-text-gold">the Lotus Feet of the Lord</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Every Offering — however small — is Accepted by the Lord</p>
              <div style={{ background: 'rgba(237,104,0,.08)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.88rem', color: '#c45500', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '.5rem' }}>
                  "Whoever offers Me with devotion a leaf, a flower, a fruit or water — that offering of love from the pure-hearted I accept."
                </p>
                <p style={{ fontSize: '.75rem', color: '#888', fontStyle: 'italic' }}>
                  — Bhagavad Gita 9.26
                </p>
              </div>
              <p style={{ fontSize: '.9rem', color: '#555', lineHeight: 1.8, marginBottom: '2rem' }}>
                Your seva, however small, is personally accepted by the Lord. Come, place your offering at His lotus feet.
              </p>
              <Link href="#campaigns" className="btn-primary">🌸 Offer Seva</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '🐄', seva: 'GauShala Seva',  amount: '₹1,500', desc: 'Nourish a sacred cow for one week' },
                { icon: '🍽️', seva: 'Annadan Seva',   amount: '₹1,000', desc: 'Feed prasadam to 10 hungry souls'  },
                { icon: '🌸', seva: 'Pushpa Seva',    amount: '₹500',   desc: 'Daily flower offering to the Lord' },
                { icon: '🎪', seva: 'Utsav Seva',     amount: '₹2,500', desc: 'Sponsor a sacred festival program' },
              ].map((s) => (
                <div key={s.seva} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196,85,0,.18)', borderRadius: '1rem', padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: '#111', marginBottom: '.05rem' }}>{s.seva}</p>
                    <p style={{ fontSize: '.65rem', color: '#aaa' }}>{s.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#222', flexShrink: 0 }}>{s.amount}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="stats-bar">
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 0' }}>
            {impactStats.map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="reveal-scale" style={{ textAlign: 'center', padding: '0 2.5rem' }}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
                {i < arr.length - 1 && <div className="stat-sep" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE CAMPAIGNS */}
      <DonationCampaignSection />

      {/* OTHER SEVAS */}
      <OtherSevasSection />

      {/* CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌺</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Every Rupee is a Petal<br />at His Lotus Feet
            </h2>
            <p style={{ color: '#333', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              The Lord remembers every act of devotion. Your generosity feeds thousands, protects sacred cows, and keeps the divine flame burning in Ayodhya Dham.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="#campaigns" className="btn-primary">🙏 Offer Seva Now</Link>
              <Link href="/contact" className="btn-outline">Contact Us for Large Donations</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
