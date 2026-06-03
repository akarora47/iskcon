import { Cinzel, Poppins } from 'next/font/google';
import Link from 'next/link';
import { headers } from 'next/headers';
import Header from './components/Header';
import ScrollAnimator from './components/ScrollAnimator';
import EventPopup from './components/EventPopup';
import './globals.css';

const cinzel = Cinzel({ variable: '--font-cinzel', subsets: ['latin'], weight: ['400','600','700','900'], display: 'swap' });
const poppins = Poppins({ variable: '--font-poppins', subsets: ['latin'], weight: ['300','400','500','600','700'], display: 'swap' });

export const metadata = {
  title: 'ISKCON Ayodhya | Hare Krishna — Temple of Devotion',
  description: 'ISKCON Ayodhya — experience devotion, sacred festivals, prasadam seva, and divine grace in the holy land of Lord Ram. Hare Krishna!',
};

const quickLinks = [
  { label: 'Home',     href: '/'         },
  { label: 'About',    href: '/about'    },
  { label: 'Events',   href: '/events'   },
  { label: 'Donation', href: '/donation' },
  { label: 'Contact',  href: '/contact'  },
];
const sevaLinks = [
  { label: 'GauShala Donation', href: '/donation' },
  { label: 'Annadan Seva',      href: '/donation' },
  { label: 'Festival Campaigns',href: '/donation' },
  { label: 'Temple Seva',       href: '/donation' },
  { label: 'Volunteer',         href: '/contact'  },
];

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/setup');

  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} h-full antialiased`}>
      <body style={{ minHeight: '100vh', background: isAdmin ? '#1a1a1a' : '#ffffff', color: '#111', margin: 0 }}>

        {!isAdmin && <Header />}

        <div style={{ minHeight: isAdmin ? undefined : '100vh' }}>
          {children}
        </div>

        {/* Wave transition: warm cream → dark footer */}
        {!isAdmin && (
          <div style={{ height: '72px', background: 'linear-gradient(135deg, #fff8f0 0%, #fff3e6 50%, #fff8f0 100%)', position: 'relative', overflow: 'hidden', marginTop: '-1px' }}>
            <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}>
              <path d="M0,36 C360,72 1080,0 1440,36 L1440,72 L0,72 Z" fill="#1a1a1a" />
            </svg>
          </div>
        )}

        {!isAdmin && (
          <footer className="site-footer">
            <div className="wrap" style={{ paddingTop: '3.5rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <div className="footer-grid">

                {/* Brand column */}
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <img src="/logo.png" alt="ISKCON Ayodhya" style={{ height: '2.75rem', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <p style={{ fontSize: '.84rem', lineHeight: 1.85, color: 'rgba(255,255,255,.5)', marginBottom: '.75rem', maxWidth: '260px' }}>
                    Spreading the divine love of Lord Krishna and Lord Ram in the sacred city of Ayodhya since 2005.
                  </p>
                  <p style={{ fontSize: '.82rem', fontFamily: 'var(--font-cinzel),serif', color: '#ed6800', marginBottom: '1.5rem', letterSpacing: '.06em', fontWeight: 600 }}>
                    Hare Krishna Hare Krishna 🙏
                  </p>
                  <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Facebook',  icon: 'f',  href: 'https://www.facebook.com/ayodhya.iskcon/' },
                      { label: 'Instagram', icon: '✦',  href: 'https://www.instagram.com/iskcon_ayodhya_/' },
                      { label: 'YouTube',   icon: '▶',  href: 'https://youtube.com/@iskconayodhya' },
                      { label: 'WhatsApp',  icon: '💬', href: 'https://whatsapp.com/channel/0029VaxoenoDTkK4PrgDiK1I' },
                    ].map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="footer-social" title={s.label}
                        style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '.8rem' }}>
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <p className="footer-head">Quick Links</p>
                  {quickLinks.map((l) => <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>)}
                </div>

                {/* Seva */}
                <div>
                  <p className="footer-head">Seva &amp; Donation</p>
                  {sevaLinks.map((l) => <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>)}
                </div>

                {/* Contact */}
                <div>
                  <p className="footer-head">Contact Us</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>📍 ISKCON Ayodhya, Ram Nagar,<br />Faizabad, Uttar Pradesh 224001, India</p>
                    <a href="tel:+919517312508" style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'color .2s' }}>📞 +91 95173 12508</a>
                    <a href="tel:+916387021220" style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'color .2s' }}>📞 +91 63870 21220</a>
                    <a href="mailto:info@iskconayodhya.com" style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>✉️ info@iskconayodhya.com</a>
                    <a href="https://whatsapp.com/channel/0029VaxoenoDTkK4PrgDiK1I" target="_blank" rel="noreferrer"
                      style={{ fontSize: '.84rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>💬 WhatsApp Channel</a>
                    <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.4)' }}>⏰ 4:30 AM – 8:30 PM Daily</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom bar */}
            <div className="wrap" style={{ paddingTop: '1.25rem', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.3)', fontFamily: 'var(--font-cinzel),serif' }}>
                  © {new Date().getFullYear()} ISKCON Ayodhya · Hare Krishna 🙏
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <Link href="#" style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Privacy Policy</Link>
                  <Link href="#" style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Terms of Use</Link>
                </div>
              </div>
            </div>
          </footer>
        )}

        {!isAdmin && <ScrollAnimator />}
        {!isAdmin && <EventPopup />}

      </body>
    </html>
  );
}
