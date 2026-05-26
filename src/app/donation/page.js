import Link from 'next/link';
import DonationCampaignSection from '../components/DonationCampaignSection';

export const metadata = {
  title: 'सेवा एवं दान | ISKCON Ayodhya — प्रभु चरणों में अर्पण',
  description: 'ISKCON अयोध्या में अपनी सेवा अर्पण करें — गौशाला, अन्नदान, उत्सव और पवित्र सेवाएँ। हर अर्पण प्रभु के चरण कमलों तक पहुँचता है।',
};

const otherSevas = [
  { icon: '🌸', title: 'पुष्प सेवा',       titleEn: 'Pushpa Seva',        desc: 'प्रतिदिन भगवान श्री राम और सीता देवी के चरण कमलों में सुगंधित पुष्प अर्पण करें — शुद्ध प्रेम का यह संकेत प्रभु को अत्यंत प्रिय है।', amount: '₹500'   },
  { icon: '💡', title: 'दीप सेवा',         titleEn: 'Deepa Seva',         desc: 'मंदिर में पवित्र ज्योति को जलाए रखें — प्रत्येक भक्त के मार्ग को आलोकित करें। यह ज्ञान और भक्ति का प्रतीक है।',                        amount: '₹251'   },
  { icon: '📖', title: 'गीता प्रचार सेवा', titleEn: 'Gita Prachar Seva',  desc: 'भगवद्गीता और श्रीमद्भागवतम् के वितरण को प्रायोजित करें — एक जिज्ञासु आत्मा को शास्त्र भेंट करें।',                                  amount: '₹1,108' },
  { icon: '🏗️', title: 'मंदिर निर्माण सेवा', titleEn: 'Mandir Nirman Seva', desc: 'प्रभु के शाश्वत निवास के निर्माण में सहभागी बनें — आपका नाम इस पवित्र विरासत का अंग बन जाएगा।',                                    amount: '₹5,100' },
];

const impactStats = [
  { num: '५,०००+', label: 'प्रतिदिन आत्माएं सेवित' },
  { num: '५०+',    label: 'पवित्र गायें संरक्षित'   },
  { num: '३०+',    label: 'वार्षिक उत्सव'           },
  { num: '₹1Cr+', label: 'वार्षिक सेवा अर्पण'      },
];

export default function DonationPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>🙏</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">

            <div>
              <span className="section-badge light">🌸 सेवा अर्पण · कृपा प्राप्ति</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                प्रभु के चरण कमलों में<br /><span className="gradient-text-gold">आपकी सेवा पहुँचे</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.75)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Let Your Seva Reach The Lotus Feet of the Lord</p>
              <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.85, marginBottom: '1rem' }}>
                भगवद्गीता में प्रभु कहते हैं —
              </p>
              <div style={{ background: 'rgba(237,104,0,.08)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.88rem', color: '#ffd89b', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '.5rem' }}>
                  "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।<br />तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः।।"
                </p>
                <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)', fontStyle: 'italic' }}>
                  "Whoever offers Me with devotion a leaf, a flower, a fruit or water — that offering of love from the pure-hearted I accept." — Gita 9.26
                </p>
              </div>
              <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: '2rem' }}>
                आपकी सेवा, चाहे कितनी भी छोटी हो, स्वयं प्रभु द्वारा स्वीकार की जाती है।
              </p>
              <Link href="#campaigns" className="btn-primary">🌸 सेवा अर्पण करें</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '🐄', seva: 'गौशाला सेवा',    sevaEn: 'GauShala Seva',  amount: '₹1,500', desc: '१ सप्ताह के लिए एक पवित्र गाय का पोषण' },
                { icon: '🍽️', seva: 'अन्नदान सेवा',   sevaEn: 'Annadan Seva',   amount: '₹1,000', desc: '१० भूखी आत्माओं को प्रसाद खिलाएं'      },
                { icon: '🌸', seva: 'पुष्प सेवा',      sevaEn: 'Pushpa Seva',    amount: '₹500',   desc: 'प्रतिदिन प्रभु को पुष्प अर्पण'          },
                { icon: '🎪', seva: 'उत्सव सेवा',      sevaEn: 'Utsav Seva',     amount: '₹2,500', desc: 'एक पवित्र उत्सव कार्यक्रम का प्रायोजन'  },
              ].map((s) => (
                <div key={s.seva} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(237,104,0,.18)', borderRadius: '1rem', padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: 'white', marginBottom: '.05rem' }}>{s.seva}</p>
                    <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)' }}>{s.sevaEn} · {s.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#ed6800', flexShrink: 0 }}>{s.amount}</span>
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
      <section className="sec-dark">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge light">और पवित्र सेवाएँ · More Sacred Sevas</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white' }}>
              चरण कमलों में <span className="gradient-text-gold">सेवा अर्पण</span>
            </h2>
            <div className="gold-line-center" />
            <p style={{ color: 'rgba(255,255,255,.6)', maxWidth: '480px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.75 }}>
              भक्ति का प्रत्येक कार्य हृदय को शुद्ध करता है और आत्मा को परमात्मा के निकट ले जाता है।
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem' }}>
            {otherSevas.map((s, i) => (
              <div key={s.title} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '2rem' }}>
                <div className="seva-icon-dark" style={{ marginBottom: '1.25rem' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.95rem', fontWeight: 700, color: 'white', marginBottom: '.15rem' }}>{s.title}</h3>
                <p style={{ fontSize: '.7rem', color: '#ed6800', marginBottom: '.625rem' }}>{s.titleEn}</p>
                <p style={{ fontSize: '.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,.6)', marginBottom: '1.25rem' }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.1rem', fontWeight: 700, color: '#ed6800' }}>{s.amount}</span>
                  <button className="btn-primary" style={{ padding: '.5rem 1.25rem', fontSize: '.8rem', border: 'none', cursor: 'pointer' }}>सेवा अर्पण 🙏</button>
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
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌺</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              हर रुपया उनके चरणों में<br />एक पुष्प है
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,230,150,.85)', marginBottom: '1.25rem' }}>Every Rupee is a Petal at His Lotus Feet</p>
            <p style={{ color: 'rgba(255,255,255,.9)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              प्रभु भक्ति का प्रत्येक कार्य स्मरण रखते हैं। आपकी उदारता हज़ारों को भोजन कराती है, पवित्र गायों की रक्षा करती है और अयोध्या धाम में दिव्य ज्योति को प्रज्वलित रखती है।
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="#campaigns" className="btn-primary" style={{ background: 'white', color: '#ed6800' }}>🙏 अभी सेवा अर्पण करें</Link>
              <Link href="/contact" className="btn-outline-light">बड़े दान के लिए संपर्क करें</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
