import Link from 'next/link';
import ContactModalBtn from '../components/ContactModalBtn';
import ContactInlineForm from '../components/ContactInlineForm';

export const metadata = {
  title: 'Contact Us | ISKCON Ayodhya',
  description: 'Get in touch with ISKCON Ayodhya — darshan timings, festival inquiries, volunteer opportunities, and donation seva. We are always ready to serve every devotee.',
};

const socials = [
  { icon: '📘', name: 'Facebook',  handle: '@ISKCONAyodhya',         href: 'https://facebook.com/ISKCONAyodhya' },
  { icon: '📸', name: 'Instagram', handle: '@iskcon_ayodhya',         href: 'https://instagram.com/iskcon_ayodhya' },
  { icon: '▶️', name: 'YouTube',  handle: 'ISKCON Ayodhya Official', href: 'https://youtube.com/@ISKCONAyodhya' },
  { icon: '💬', name: 'WhatsApp', handle: '+91 95173 12508',          href: 'https://wa.me/919517312508' },
];

const heroCards = [
  { icon: '📍', title: 'Address',    value: 'ISKCON Ayodhya, Ram Nagar, Faizabad, Uttar Pradesh 224001' },
  { icon: '📞', title: 'Phone',      value: '+91 95173 12508 / +91 63870 21220' },
  { icon: '✉️', title: 'Email',      value: 'info@iskconayodhya.com' },
  { icon: '⏰', title: 'Open Hours', value: '6:00 AM – 8:30 PM' },
];

const faqs = [
  { q: 'Is entry to the temple free?',     a: 'Yes, entry to ISKCON Ayodhya is free for all. Prasadam is also distributed free of charge.' },
  { q: 'How can I offer seva or donate?',  a: 'Visit our Donation page to choose from GauShala Seva, Annadan Seva, Pushpa Seva and more. You can also call us at +91 95173 12508.' },
  { q: 'How can I become a volunteer?',    a: 'Fill out the contact form and select "Volunteer Opportunity" as the subject. Our seva team will reach out to you shortly.' },
  { q: 'What are the darshan timings?',    a: 'The temple is open from Mangala Aarti at 4:30 AM to Shayana Aarti at 8:30 PM. Timings may change during special festivals.' },
];

export default function ContactPage() {
  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-ring" style={{ top: '20%', left: '6%', width: '140px', height: '140px' }} />
        <div className="hero-ring" style={{ bottom: '15%', right: '12%', width: '90px', height: '90px', animationDelay: '5s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.08 }}>✉️</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid" style={{ gap: '3rem' }}>

            <div>
              <span className="section-badge">Connect with Us</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                We Are Always Here<br /><span className="gradient-text-gold">to Serve You</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>ISKCON Ayodhya — Your Spiritual Home</p>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, marginBottom: '2rem' }}>
                Whether you have a question, want to know darshan timings, wish to volunteer, or plan a spiritual journey — our team is always ready to assist with love and devotion.
              </p>
              <ContactModalBtn />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {heroCards.map((c) => (
                <div key={c.title} className="hero-contact-card" style={{ background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196,85,0,.18)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.4rem', transition: 'all .3s ease', cursor: 'default' }}>
                  <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                  <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.72rem', fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '.08em' }}>{c.title}</p>
                  <p style={{ fontSize: '.78rem', color: '#555', lineHeight: 1.5 }}>{c.value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* INQUIRY FORM + MAP */}
      <section className="sec-light" id="inquiry" style={{ borderTop: '3px solid transparent', borderImage: 'linear-gradient(90deg, #c45500, #ed6800, #c45500) 1' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '3rem' }}>

            <div>
              <div className="reveal-left">
                <span className="section-badge">Send a Message</span>
                <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem' }}>
                  Inquiry <span className="gradient-text">Form</span>
                </h2>
                <div className="gold-line" />
                <p style={{ fontSize: '.95rem', lineHeight: 1.85, color: '#2d2d2d', marginBottom: '2rem' }}>
                  Fill out the form below — our dedicated team will respond within 24 hours.
                </p>
              </div>
              <div className="card-light reveal-left d200" style={{ padding: '2.5rem' }}>
                <ContactInlineForm />
              </div>
            </div>

            <div>
              <div className="reveal-right">
                <span className="section-badge">Find Us</span>
                <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem' }}>
                  Temple <span className="gradient-text">Location</span>
                </h2>
                <div className="gold-line" />
              </div>

              {/* Google Maps Embed */}
              <div className="card-light reveal-right d100" style={{ marginBottom: '2rem', overflow: 'hidden', borderRadius: '1.25rem' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0!2d82.1996!3d26.7922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07b1b5b5b5b5%3A0x0!2sISKCON+Ayodhya!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ISKCON Ayodhya Location"
                />
                <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(237,104,0,.04)', borderTop: '1px solid rgba(237,104,0,.1)' }}>
                  <p style={{ fontSize: '.84rem', color: '#555', lineHeight: 1.7, marginBottom: '.75rem' }}>
                    📍 ISKCON Ayodhya, Ram Nagar, Faizabad, Uttar Pradesh 224001, India
                  </p>
                  <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                    <a
                      href="https://maps.app.goo.gl/WPD72ZZU4AZCcVLUA"
                      target="_blank" rel="noreferrer"
                      className="btn-primary"
                      style={{ fontSize: '.78rem', padding: '.5rem 1.1rem' }}
                    >
                      Open in Google Maps →
                    </a>
                    <a
                      href="tel:+919517312508"
                      style={{ fontSize: '.78rem', padding: '.5rem 1.1rem', borderRadius: '2rem', border: '2px solid rgba(237,104,0,.35)', color: '#ed6800', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}
                    >
                      📞 Call Now
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="card-light reveal-right d150" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.9rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Contact <span style={{ color: '#ed6800' }}>Details</span></h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <a href="tel:+919517312508" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.85rem', color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(237,104,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📞</span>
                    +91 95173 12508
                  </a>
                  <a href="tel:+916387021220" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.85rem', color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(237,104,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📞</span>
                    +91 63870 21220
                  </a>
                  <a href="https://wa.me/919517312508" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.85rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                    <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(37,211,102,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>💬</span>
                    WhatsApp Us
                  </a>
                  <a href="mailto:info@iskconayodhya.com" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.85rem', color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(237,104,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>✉️</span>
                    info@iskconayodhya.com
                  </a>
                </div>
              </div>

              {/* FAQs */}
              <div className="reveal-right d200">
                <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>Frequently Asked <span style={{ color: '#ed6800' }}>Questions</span></h3>
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
      <section className="sec-stay">
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-badge light">Follow Us</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem' }}>
              Stay <span className="gradient-text-gold">Connected</span>
            </h2>
            <div className="gold-line-center" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,85,0,.6), transparent)' }} />
            <p style={{ color: 'rgba(255,255,255,.55)', maxWidth: '500px', margin: '0 auto', fontSize: '.95rem', lineHeight: 1.8 }}>
              Follow us for daily temple updates, festival highlights, devotional content and live aarti streams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
            {socials.map((s, i) => (
              <a
                key={s.name} href={s.href} target="_blank" rel="noreferrer"
                className={'social-card reveal d' + ((i+1)*100)}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #ed6800, transparent)', opacity: .6 }} />
                <div style={{
                  width: '4rem', height: '4rem', margin: '0 auto 1.25rem',
                  borderRadius: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                  background: 'linear-gradient(135deg, rgba(196,85,0,.18), rgba(196,85,0,.07))',
                  border: '1px solid rgba(196,85,0,.3)',
                }}>
                  {s.icon}
                </div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontWeight: 700, color: 'rgba(255,255,255,.9)', fontSize: '.9rem', marginBottom: '.5rem' }}>{s.name}</p>
                <p style={{ fontSize: '.78rem', color: '#ed6800', fontWeight: 600, letterSpacing: '.02em' }}>{s.handle}</p>
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
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Hare Krishna — Welcome to Ayodhya Dham
            </h2>
            <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              We warmly invite you to ISKCON Ayodhya. May the Lord's grace guide your steps to this sacred Dham.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/donation" className="btn-primary">🌸 Offer Seva</Link>
              <Link href="/donation" className="btn-outline">🌺 Offer Seva</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
