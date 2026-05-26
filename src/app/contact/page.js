import Link from 'next/link';
import ContactModalBtn from '../components/ContactModalBtn';
import ContactInlineForm from '../components/ContactInlineForm';

export const metadata = {
  title: 'संपर्क करें | ISKCON Ayodhya',
  description: 'ISKCON अयोध्या से संपर्क करें — दर्शन समय, उत्सव पूछताछ, स्वयंसेवक अवसर और मंदिर आवास बुकिंग। हम हर भक्त की सेवा में सदा तत्पर हैं।',
};

const socials = [
  { icon: '📘', name: 'Facebook',   nameHi: 'फेसबुक',   handle: '@ISKCONAyodhya',         href: 'https://facebook.com/ISKCONAyodhya' },
  { icon: '📸', name: 'Instagram',  nameHi: 'इंस्टाग्राम', handle: '@iskcon_ayodhya',       href: 'https://instagram.com/iskcon_ayodhya' },
  { icon: '▶️', name: 'YouTube',   nameHi: 'यूट्यूब',   handle: 'ISKCON Ayodhya Official', href: 'https://youtube.com/@ISKCONAyodhya' },
  { icon: '💬', name: 'WhatsApp',  nameHi: 'व्हाट्सएप', handle: '+91 12345 67890',         href: 'https://wa.me/911234567890' },
];

const heroCards = [
  { icon: '📍', title: 'पता',        titleEn: 'Address',    value: 'टेम्पल रोड, अयोध्या, UP – 224001' },
  { icon: '📞', title: 'दूरभाष',    titleEn: 'Phone',      value: '+91 12345 67890' },
  { icon: '✉️', title: 'ईमेल',      titleEn: 'Email',      value: 'info@iskconayodhya.com' },
  { icon: '⏰', title: 'खुलने का समय', titleEn: 'Open Hours', value: 'प्रातः ६:०० – रात्रि ८:३०' },
];

const faqs = [
  { q: 'क्या मंदिर में प्रवेश निःशुल्क है?',     a: 'हाँ, ISKCON अयोध्या मंदिर में प्रवेश सभी के लिए निःशुल्क है। प्रसाद भी निःशुल्क वितरित किया जाता है।' },
  { q: 'आवास की बुकिंग कैसे करें?',              a: 'हमारी वेबसाइट पर Booking पेज पर जाएँ या सीधे +91 12345 67890 पर कॉल करें। हम 24 घंटे में पुष्टि करते हैं।' },
  { q: 'स्वयंसेवक कैसे बनें?',                  a: 'संपर्क फ़ॉर्म भरें और "Volunteer Opportunity" विषय चुनें। हमारी सेवा टीम आपसे शीघ्र संपर्क करेगी।' },
  { q: 'दर्शन का समय क्या है?',                  a: 'प्रातः ४:३० बजे मंगल आरती से रात्रि ८:३० बजे शयन आरती तक मंदिर खुला रहता है। विशेष उत्सवों पर समय बदल सकता है।' },
];

export default function ContactPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>✉️</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid" style={{ gap: '3rem' }}>

            <div>
              <span className="section-badge light">हमसे जुड़ें · Connect with Us</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                हम आपकी <span className="gradient-text-gold">सेवा में</span><br />सदा तत्पर हैं
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.75)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>We Are Here to Serve You</p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: '2rem' }}>
                चाहे आपका कोई प्रश्न हो, दर्शन समय जानना हो, स्वयंसेवक बनना हो या आध्यात्मिक यात्रा की योजना बनानी हो — हमारी टीम सदैव प्रेम और भक्ति के साथ सहायता करने के लिए तैयार है।
              </p>
              <ContactModalBtn />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {heroCards.map((c) => (
                <div key={c.title} className="hero-contact-card" style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(237,104,0,.18)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.4rem', transition: 'all .3s ease', cursor: 'default' }}>
                  <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                  <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.72rem', fontWeight: 700, color: '#ed6800', textTransform: 'uppercase', letterSpacing: '.08em' }}>{c.title}</p>
                  <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.3)' }}>{c.titleEn}</p>
                  <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{c.value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* INQUIRY FORM + MAP */}
      <section className="sec-warm" id="inquiry">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '3rem' }}>

            <div>
              <div className="reveal-left">
                <span className="section-badge">संदेश भेजें · Send a Message</span>
                <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem' }}>
                  पूछताछ <span className="gradient-text">फ़ॉर्म</span>
                </h2>
                <div className="gold-line" />
                <p style={{ fontSize: '.95rem', lineHeight: 1.85, color: '#2d2d2d', marginBottom: '2rem' }}>
                  नीचे फ़ॉर्म भरें — हमारी समर्पित टीम 24 घंटे के भीतर उत्तर देगी।
                </p>
              </div>
              <div className="card-light reveal-left d200" style={{ padding: '2.5rem' }}>
                <ContactInlineForm />
              </div>
            </div>

            <div>
              <div className="reveal-right">
                <span className="section-badge">हमें खोजें · Find Us</span>
                <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem' }}>
                  मंदिर का <span className="gradient-text">स्थान</span>
                </h2>
                <div className="gold-line" />
              </div>
              <div className="card-light reveal-right d100" style={{ marginBottom: '2rem', overflow: 'hidden' }}>
                <div style={{ height: '16rem', background: 'linear-gradient(135deg,#fff0dc,#ffe5c0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>📍</div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontWeight: 700, color: '#111', fontSize: '1rem', marginBottom: '.25rem' }}>ISKCON अयोध्या</p>
                    <p style={{ fontSize: '.82rem', color: '#555', marginBottom: '.15rem' }}>टेम्पल रोड, अयोध्या, UP</p>
                    <p style={{ fontSize: '.72rem', color: '#aaa' }}>Temple Road, Ayodhya, UP</p>
                  </div>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '.8rem', padding: '.6rem 1.25rem' }}>
                    Google Maps पर खोलें →
                  </a>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(237,104,0,.04)', borderTop: '1px solid rgba(237,104,0,.1)' }}>
                  <p style={{ fontSize: '.84rem', color: '#555', lineHeight: 1.7 }}>
                    📍 राम जन्मभूमि के निकट, अयोध्या धाम, उत्तर प्रदेश – 224001, भारत
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="reveal-right d200">
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>सामान्य प्रश्न <span style={{ color: '#ed6800' }}>FAQs</span></h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ padding: '1rem 1.25rem', background: '#fff', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem' }}>
                      <p style={{ fontWeight: 700, color: '#111', fontSize: '.85rem', marginBottom: '.4rem' }}>❓ {faq.q}</p>
                      <p style={{ fontSize: '.8rem', color: '#555', lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="sec-dark-alt">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge light">हमें फ़ॉलो करें · Follow Us</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white' }}>
              जुड़े रहें <span className="gradient-text-gold">Stay Connected</span>
            </h2>
            <div className="gold-line-center" />
            <p style={{ color: 'rgba(255,255,255,.6)', maxWidth: '500px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.75 }}>
              दैनिक मंदिर अपडेट, उत्सव की झलकियाँ, भक्तिमय सामग्री और लाइव आरती स्ट्रीम के लिए हमें फ़ॉलो करें।
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
            {socials.map((s, i) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className={'card-glass reveal d' + ((i+1)*100)} style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontWeight: 700, color: 'white', fontSize: '.9rem', marginBottom: '.2rem' }}>{s.nameHi}</p>
                <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.4)', marginBottom: '.375rem' }}>{s.name}</p>
                <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)' }}>{s.handle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🙏</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              हरे कृष्ण — अयोध्या धाम में<br />आपका स्वागत है
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,230,150,.85)', marginBottom: '1.25rem' }}>Hare Krishna — Welcome to Ayodhya Dham</p>
            <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              हम आपको ISKCON अयोध्या में सादर आमंत्रित करते हैं। प्रभु की कृपा आपके क़दमों को इस पवित्र धाम तक अवश्य ले आएगी।
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
