'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    label: 'ISKCON', href: '/about',
    children: [
      { label: 'About Us',                   href: '/about',              section: null         },
      { label: 'Founder Acharya',            href: '/about',              section: 'founder'    },
      { label: 'The History',                href: '/about',              section: 'history'    },
      { label: 'Why Krishna Consciousness?', href: '/about',              section: 'philosophy' },
      { label: 'Philosophy',                 href: '/about',              section: 'pillars'    },
    ],
  },
  { label: 'Events',   href: '/events'   },
  { label: 'Donation', href: '/donation' },
  { label: 'Booking',  href: '/booking'  },
  { label: 'Contact',  href: '/contact'  },
];

const mantra = '🙏 Hare Krishna Hare Krishna · Krishna Krishna Hare Hare · Hare Rama Hare Rama · Rama Rama Hare Hare  ';
const mantraText = Array(8).fill(mantra).join('');

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scrolls to a section ID — works even if already on the page
  const scrollToSection = useCallback((sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 120; // mantra strip + header height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
    doScroll();
    // Retry after a short delay in case the page just navigated
    setTimeout(doScroll, 350);
  }, []);

  const handleDropdownClick = useCallback((child) => {
    setMenuOpen(false);
    if (child.section) {
      if (pathname === child.href) {
        // Already on the page — just scroll
        scrollToSection(child.section);
      } else {
        // Navigate first, then scroll
        router.push(child.href);
        setTimeout(() => scrollToSection(child.section), 500);
      }
    } else {
      router.push(child.href);
    }
  }, [pathname, router, scrollToSection]);

  return (
    <>
      {/* ── Mantra strip — fixed at very top ── */}
      <div className="mantra-strip">
        <div className="mantra-track">{mantraText}{mantraText}</div>
      </div>

      {/* ── Header bar ── */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.85rem 0' }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '.5rem' }}>
              <img
                src="/logo.png"
                alt="ISKCON Ayodhya"
                style={{ height: '3rem', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden-mobile">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="nav-dropdown">
                    {/* Trigger — no nav-link class to avoid ::after conflict */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                      fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.88)',
                      cursor: 'pointer', userSelect: 'none', fontFamily: 'var(--font-poppins)',
                      letterSpacing: '.01em', transition: 'color .3s ease',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.color='#ffd89b'}
                      onMouseLeave={(e) => e.currentTarget.style.color='rgba(255,255,255,.88)'}
                    >
                      {item.label}
                      <span style={{ fontSize: '.6rem', lineHeight: 1 }}>▾</span>
                    </span>

                    {/* Dropdown menu */}
                    <div className="nav-dropdown-menu">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          className="nav-dropdown-item"
                          onClick={() => handleDropdownClick(child)}
                          style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                    style={{ fontSize: '.95rem', fontWeight: 600 }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/donation" className="btn-primary hidden-mobile" style={{ padding: '.65rem 1.6rem', fontSize: '.88rem' }}>
                🙏 Donate Now
              </Link>
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`hamburger show-mobile${menuOpen ? ' open' : ''}`}
                style={{ color: 'white', background: 'none', border: 'none', padding: '.25rem' }}
              >
                <span></span><span></span><span></span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="mobile-menu" onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
          <div style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="ISKCON Ayodhya" style={{ height: '2.75rem', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-nav-link" style={{ fontSize: '1.5rem' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/donation" className="btn-primary" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
            🙏 Donate Now
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width:1024px) { .hidden-mobile { display:none !important; } }
        @media (min-width:1025px) { .show-mobile   { display:none !important; } }
      `}</style>
    </>
  );
}
