import Link from 'next/link';

export const metadata = {
  title: 'ISKCON अयोध्या के बारे में | हमारी कहानी, दर्शन और संस्थापक',
  description: 'ISKCON Ayodhya — श्रील प्रभुपाद, हमारा इतिहास, वैदिक दर्शन और कृष्ण भक्ति का मार्ग। जानें हमारी आध्यात्मिक यात्रा के बारे में।',
};

const pillars = [
  { icon: '📿', title: 'भक्ति योग',    titleEn: 'Bhakti Yoga',    desc: 'श्री कृष्ण के प्रति प्रेमपूर्ण भक्ति का सीधा मार्ग — इस युग में आत्म-साक्षात्कार का सर्वोच्च और सुलभ साधन। The path of loving devotion — most accessible in this age of Kali.' },
  { icon: '🍽️', title: 'सेवा',         titleEn: 'Seva (Service)', desc: 'भगवान, उनके भक्तों और समस्त जीवों की निःस्वार्थ सेवा। सच्ची सेवा हृदय को शुद्ध करती है और परमात्मा को प्रसन्न करती है। Selfless service purifies the heart.' },
  { icon: '📖', title: 'साधु संग',     titleEn: 'Sadhu Sanga',    desc: 'संतों की संगति, नियमित शास्त्र अध्ययन, कीर्तन और भागवत कथा में सहभागिता। Association of saintly devotees elevates consciousness.' },
  { icon: '🌺', title: 'साधना भक्ति', titleEn: 'Sadhana Bhakti', desc: 'नियमित भक्ति साधनाएँ — आरती, जप ध्यान, देवता पूजा — जो क्रमशः चेतना को ऊँचा उठाती हैं। Daily practices elevate the soul steadily.' },
];

const schedule = [
  { time: '४:३० AM',  timeEn: '4:30 AM',  activity: 'मंगल आरती',        activityEn: 'Mangala Aarti',   desc: 'भोर में प्रभु के प्रथम दर्शन — प्रेम और श्रद्धा के साथ।' },
  { time: '७:१५ AM',  timeEn: '7:15 AM',  activity: 'गुरु पूजा व भागवत', activityEn: 'Guru Puja & Bhagavatam', desc: 'प्रातःकालीन कक्षा और आचार्य को अर्पण।' },
  { time: '१२:०० PM', timeEn: '12:00 PM', activity: 'राजभोग आरती',       activityEn: 'Raj Bhoga Aarti', desc: 'दोपहर में देवताओं को भव्य भोग अर्पण।' },
  { time: '४:३० PM',  timeEn: '4:30 PM',  activity: 'उत्थापन आरती',      activityEn: 'Utthapana Aarti', desc: 'विश्राम के बाद प्रभु के जागरण की आरती।' },
  { time: '६:४५ PM',  timeEn: '6:45 PM',  activity: 'संध्या आरती',       activityEn: 'Sandhya Aarti',   desc: 'सायंकालीन कीर्तन और आरती — सर्वाधिक भक्त एकत्रित होते हैं।' },
  { time: '८:३० PM',  timeEn: '8:30 PM',  activity: 'शयन आरती',          activityEn: 'Shayana Aarti',   desc: 'रात्रि में प्रभु के विश्राम की अंतिम शांत आरती।' },
];

export default function AboutPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* ══ SECTION 1 — ABOUT US ══ */}
      <section id="about-us" className="hero-dark-sm" style={{ minHeight: '65vh' }}>
        <div className="hero-pattern" />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.07 }}>ॐ</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge light">हरे कृष्ण 🙏 · Hare Krishna</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                ISKCON <span className="gradient-text-gold">अयोध्या</span> में<br />आपका स्वागत है
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,210,100,.8)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Welcome to ISKCON Ayodhya — Sanctuary of Divine Grace</p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                प्रभु श्री राम की शाश्वत लीलाभूमि अयोध्या में स्थित ISKCON का यह मंदिर भक्ति, वैदिक संस्कृति और आध्यात्मिक जागरण का जीवंत केंद्र है।
              </p>
              <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.85, marginBottom: '2rem' }}>
                His Divine Grace A.C. Bhaktivedanta Swami Prabhupada की दिव्य शिक्षाओं की परंपरा में स्थापित यह मंदिर, हज़ारों तीर्थयात्रियों और भक्तों को प्रसाद, आरती और भगवद्गीता के कालजयी संदेश से सेवित करता है।
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/donation" className="btn-primary">🌸 सेवा अर्पण करें</Link>
                <Link href="/booking" className="btn-outline-light">🏨 आवास बुकिंग</Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { num: '2005', label: 'अयोध्या में स्थापित', icon: '🛕' },
                { num: '५०,०००+', label: 'प्रतिवर्ष भक्त', icon: '🙏' },
                { num: '३०+', label: 'वार्षिक उत्सव', icon: '🎪' },
                { num: '१०८+', label: 'विश्व के मंदिर', icon: '🌏' },
              ].map((s) => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 700, color: '#ed6800', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)', marginTop: '.35rem', lineHeight: 1.4 }}>{s.label}</div>
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(10,4,0,.8))', borderRadius: '2rem' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', color: '#d4af37', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em' }}>संस्थापक-आचार्य</p>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', color: 'white', fontSize: '1rem', fontWeight: 700 }}>A.C. Bhaktivedanta Swami Prabhupada</p>
              </div>
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: 'linear-gradient(135deg,#d4af37,#b8860b)', borderRadius: '1rem', padding: '.75rem 1.25rem', textAlign: 'center', boxShadow: '0 8px 25px rgba(212,175,55,.35)' }}>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.25rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>1896</p>
                <p style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.2rem' }}>जन्म · कोलकाता</p>
              </div>
            </div>

            <div className="reveal-right">
              <span className="section-badge light">संस्थापक आचार्य · Founder Acharya</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                परम पूज्य<br /><span className="gradient-text-gold">श्रील प्रभुपाद</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.7)', marginBottom: '1rem', letterSpacing: '.04em' }}>His Divine Grace A.C. Bhaktivedanta Swami</p>
              <div className="gold-line" />
              <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                सन् 1896 में कोलकाता में जन्मे अभय चरणारविंद भक्तिवेदांत स्वामी प्रभुपाद ने अपने गुरु महाराज की दिव्य आज्ञा से कृष्ण चेतना को पश्चिमी जगत में फैलाने का संकल्प लिया — और इस मिशन को उन्होंने असाधारण समर्पण के साथ पूरा किया।
              </p>
              <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.9, marginBottom: '2rem' }}>
                69 वर्ष की आयु में केवल कुछ रुपये और भागवतम् की पुस्तकों का एक संदूक लेकर वे अकेले न्यूयॉर्क गए। मात्र 12 वर्षों में उन्होंने 108 से अधिक मंदिर स्थापित किए, 80+ वैदिक ग्रंथों का अनुवाद किया और आधुनिक इतिहास का सबसे प्रभावशाली वैष्णव आंदोलन खड़ा किया।
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {[
                  { icon: '📚', text: '८०+ वैदिक ग्रंथों का अंग्रेजी में अनुवाद' },
                  { icon: '🌍', text: '१०८+ मंदिर — विश्व के प्रत्येक कोने में' },
                  { icon: '✈️', text: '७२ वर्ष की आयु में १४ देशों की यात्रा' },
                  { icon: '🙏', text: 'विश्वभर में हज़ारों शिष्यों को दीक्षा' },
                ].map((f) => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem 1rem', background: 'rgba(237,104,0,.06)', borderRadius: '.875rem', border: '1px solid rgba(237,104,0,.12)' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.icon}</span>
                    <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.7)' }}>{f.text}</p>
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
            <span className="section-badge">हमारी यात्रा · Our Journey</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
              ISKCON अयोध्या का <span className="gradient-text">इतिहास</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '.75rem', letterSpacing: '.04em' }}>The History of ISKCON Ayodhya</p>
            <div className="gold-line-center" />
            <p style={{ color: '#555', maxWidth: '540px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.8 }}>
              न्यूयॉर्क में जन्मे एक वैश्विक आंदोलन से लेकर अयोध्या धाम में पवित्र उपस्थिति तक — भक्ति और ईश्वरीय इच्छा की यह कहानी।
            </p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '7rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom,#ed6800,rgba(237,104,0,.05))' }} />
            {[
              { year: '1966', icon: '🏛️', event: 'ISKCON की स्थापना — न्यूयॉर्क', eventEn: 'ISKCON Founded in New York', desc: 'श्रील प्रभुपाद ने न्यूयॉर्क के एक छोटे से दुकान में ISKCON की स्थापना की — और एक विश्वव्यापी आध्यात्मिक क्रांति का सूत्रपात हुआ।' },
              { year: '1977', icon: '🕊️', event: 'प्रभुपाद की अमर विरासत', eventEn: "Prabhupada's Eternal Legacy", desc: 'संस्थापक आचार्य इस लोक से विदा हुए — पीछे छोड़ गए 108+ मंदिर, हज़ारों दीक्षित शिष्य और 80+ वैदिक ग्रंथों का अनुवाद।' },
              { year: '1984', icon: '🌺', event: 'ISKCON का उत्तर प्रदेश में आगमन', eventEn: 'ISKCON Comes to Uttar Pradesh', desc: 'भक्त उत्तर प्रदेश की पावन भूमि में सेवा आरंभ करते हैं — भगवान विष्णु, श्री राम और वैष्णव परंपरा से गहरे जुड़ाव के कारण।' },
              { year: '2005', icon: '🛕', event: 'ISKCON अयोध्या की स्थापना', eventEn: 'ISKCON Ayodhya Established', desc: 'भगवान श्री राम की जन्मभूमि अयोध्या धाम में ISKCON औपचारिक रूप से स्थापित हुआ — दैनिक आरती, प्रसाद वितरण और भागवत कक्षाओं का शुभारंभ हुआ।' },
              { year: '2024', icon: '✨', event: 'नवीन मंदिर परिसर का उद्घाटन', eventEn: 'New Temple Complex Inaugurated', desc: 'अयोध्या धाम में एक भव्य, आधुनिक मंदिर परिसर का उद्घाटन हुआ — विश्वभर के तीर्थयात्रियों और भक्तों के लिए भक्ति और वैदिक संस्कृति का दीपस्तंभ।' },
            ].map((m, i) => (
              <div key={m.year} className={`reveal d${(i+1)*100}`} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative' }}>
                <div style={{ minWidth: '7rem', textAlign: 'center', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                  <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', fontFamily: 'var(--font-cinzel),serif', fontWeight: 700, fontSize: '.82rem', padding: '.4rem .9rem', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(237,104,0,.3)' }}>{m.year}</span>
                </div>
                <div className="card-border" style={{ flex: 1, padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.35rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.92rem', fontWeight: 700, color: '#111' }}>{m.event}</h3>
                      <p style={{ fontSize: '.72rem', color: '#ed6800', marginTop: '.1rem' }}>{m.eventEn}</p>
                    </div>
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
            <span className="section-badge light">हर आत्मा का प्रश्न</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem' }}>
              कृष्ण भक्ति <span className="gradient-text-gold">क्यों?</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.7)', marginBottom: '1rem', letterSpacing: '.04em' }}>Why Krishna Consciousness?</p>
            <div className="gold-line-center" />
            <p style={{ color: 'rgba(255,255,255,.6)', maxWidth: '560px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.85 }}>
              भगवद्गीता में श्री कृष्ण कहते हैं — <em style={{ color: '#ffd89b' }}>"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुच:।।"</em>
            </p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem', marginTop: '.5rem', fontStyle: 'italic' }}>Surrender unto Me alone. I shall deliver you from all sinful reactions. Do not fear. — Bhagavad Gita 18.66</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              { icon: '💫', title: 'सनातन धर्म — सार्वभौमिक', titleEn: 'Beyond Religion', desc: 'कृष्ण चेतना कोई सांप्रदायिक धर्म नहीं — यह आत्मा का शाश्वत विज्ञान है, जो जाति, वर्ण या देश से परे सभी मनुष्यों के लिए है।' },
              { icon: '🕊️', title: 'दुःख से मुक्ति', titleEn: 'Freedom from Suffering', desc: 'भागवतम् सिखाता है — सभी कष्टों का मूल भौतिक तादात्म्य है। कृष्ण के साथ अपने शाश्वत संबंध को जागृत करने से जन्म-मृत्यु के चक्र से मुक्ति मिलती है।' },
              { icon: '🌍', title: 'विश्व में प्रमाणित', titleEn: 'Proven Worldwide', desc: '120+ देशों में 700 से अधिक ISKCON केंद्र, करोड़ों भगवद्गीता का वितरण और लाखों रूपांतरित जीवन — यह आंदोलन स्वयं अपना प्रमाण है।' },
              { icon: '📖', title: 'शास्त्र पर आधारित', titleEn: 'Backed by Scripture', desc: 'भगवद्गीता यथारूप, श्रीमद्भागवतम् और चैतन्य चरितामृत — आधुनिक जिज्ञासु के लिए सरल भाषा में प्रस्तुत सर्वश्रेष्ठ वैदिक साहित्य।' },
              { icon: '🎵', title: 'कीर्तन की शक्ति', titleEn: 'The Power of Kirtan', desc: 'हरे कृष्ण महामंत्र — इस कलियुग में आत्म-साक्षात्कार का सबसे शक्तिशाली साधन। कीर्तन मन को शुद्ध करता है और हृदय में सुप्त ईश्वर-प्रेम को जागृत करता है।' },
              { icon: '🙏', title: 'व्यावहारिक अध्यात्म', titleEn: 'Practical Spirituality', desc: 'रसोई सेवा, मंदिर सेवा, पुस्तक वितरण — कृष्ण भक्ति जीवन के हर पहलू में भक्ति को समाहित करती है। संसार छोड़ने की ज़रूरत नहीं — चेतना को शुद्ध करें।' },
            ].map((c, i) => (
              <div key={c.title} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{c.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.95rem', fontWeight: 700, color: 'white', marginBottom: '.25rem' }}>{c.title}</h3>
                <p style={{ fontSize: '.72rem', color: '#ed6800', marginBottom: '.75rem' }}>{c.titleEn}</p>
                <p style={{ fontSize: '.85rem', lineHeight: 1.85, color: 'rgba(255,255,255,.6)' }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '2.5rem', background: 'rgba(237,104,0,.07)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '2rem' }}>
            <p style={{ fontSize: '1.5rem', color: '#d4af37', marginBottom: '1rem', fontFamily: 'serif' }}>"</p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.85, fontStyle: 'italic', marginBottom: '1.25rem' }}>
              मनुष्य जीवन की सर्वोच्च सिद्धि — ईश्वर के प्रति अपने सुप्त प्रेम को जागृत करना है। और यही कृष्ण चेतना आंदोलन का उद्देश्य है।
            </p>
            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)', fontStyle: 'italic', marginBottom: '.75rem' }}>The highest perfection of human life is to awaken dormant love for God.</p>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', fontWeight: 700, color: '#ed6800', textTransform: 'uppercase', letterSpacing: '.12em' }}>— श्रील प्रभुपाद</p>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — PHILOSOPHY / PILLARS ══ */}
      <section id="pillars" className="sec-warm" style={{ padding: '6rem 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-badge">वैदिक ज्ञान · Vedic Wisdom</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem' }}>
              हमारा <span className="gradient-text">दर्शन</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '.75rem', letterSpacing: '.04em' }}>Our Philosophy</p>
            <div className="gold-line-center" />
            <p style={{ color: '#555', maxWidth: '520px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.8 }}>
              ISKCON वैष्णव परंपरा के <strong style={{ color: '#ed6800' }}>अचिन्त्य भेदाभेद</strong> सिद्धांत का अनुसरण करता है — श्री चैतन्य महाप्रभु द्वारा प्रकट अद्भुत एकता और भेद का रहस्य।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {pillars.map((p, i) => (
              <div key={p.title} className={`card-border reveal d${(i+1)*100}`} style={{ padding: '2.25rem' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg,rgba(237,104,0,.12),rgba(237,104,0,.04))', border: '1px solid rgba(237,104,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '.2rem' }}>{p.title}</h3>
                <p style={{ fontSize: '.72rem', color: '#ed6800', marginBottom: '.625rem' }}>{p.titleEn}</p>
                <p style={{ fontSize: '.85rem', lineHeight: 1.85, color: '#555' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '.25rem' }}>दैनिक मंदिर <span className="gradient-text">कार्यक्रम</span></h3>
            <p style={{ fontSize: '.8rem', color: '#ed6800', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>Daily Temple Schedule</p>
            <div className="gold-line-center" />
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
            {schedule.map((s, i) => (
              <div key={s.time} className={`card-border reveal d${(i+1)*100}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.75rem' }}>
                <div style={{ minWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.85rem', fontWeight: 700, color: '#ed6800', display: 'block' }}>{s.time}</span>
                  <span style={{ fontSize: '.65rem', color: '#aaa' }}>{s.timeEn}</span>
                </div>
                <div style={{ width: '2px', height: '36px', background: 'rgba(237,104,0,.2)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#111', fontSize: '.9rem', marginBottom: '.1rem' }}>{s.activity}</p>
                  <p style={{ fontSize: '.72rem', color: '#ed6800', marginBottom: '.2rem' }}>{s.activityEn}</p>
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
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              हरे कृष्ण — पधारिए, हमसे मिलिए
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,230,150,.85)', marginBottom: '1.25rem' }}>Hare Krishna — Come Join Us</p>
            <p style={{ color: 'rgba(255,255,255,.9)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              भक्ति का आनंद, प्रसाद का स्वाद और पवित्र धाम की शांति का अनुभव करें। ISKCON अयोध्या हर आत्मा का स्वागत करता है।
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/booking"  className="btn-primary" style={{ background: 'white', color: '#ed6800' }}>🏨 आवास बुकिंग</Link>
              <Link href="/donation" className="btn-outline-light">🌸 सेवा अर्पण</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
