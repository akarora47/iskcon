'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function slugify(title) {
  return (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Static ISKCON children (no fetch needed)
const iskconChildren = [
  { label: 'About Us',                   href: '/about',   section: null         },
  { label: 'Founder Acharya',            href: '/about',   section: 'founder'    },
  { label: 'The History',                href: '/about',   section: 'history'    },
  { label: 'Why Krishna Consciousness?', href: '/about',   section: 'philosophy' },
  { label: 'Philosophy',                 href: '/about',   section: 'pillars'    },
];

const mantra = '🙏 Hare Krishna Hare Krishna · Krishna Krishna Hare Hare · Hare Rama Hare Rama · Rama Rama Hare Hare  ';
const mantraText = Array(8).fill(mantra).join('');

// Fallback data if API fails
const fallbackEvents = [
  { id:1, icon:'🎪', name:'Janmashtami Mahotsav', date:'24', month:'Aug' },
  { id:2, icon:'🌺', name:'Ram Navami Yatra',      date:'17', month:'Apr' },
  { id:3, icon:'📖', name:'Bhagwat Saptah',        date:'05', month:'Jun' },
];
const fallbackSevas = [
  { slug:'gaushala-seva',   icon:'🐄', title:'GauShala Seva',  amount:'Rs.1,500' },
  { slug:'annadan-seva',    icon:'🍽️', title:'Annadan Seva',    amount:'Rs.1,000' },
  { slug:'pushpa-seva',     icon:'🌸', title:'Pushpa Seva',     amount:'Rs.500'   },
  { slug:'deepa-seva',      icon:'💡', title:'Deepa Seva',      amount:'Rs.251'   },
];
const fallbackRooms = [
  { slug:'devotee-dormitory', icon:'🛏️', title:'Devotee Dormitory', price:'Rs.300/night'   },
  { slug:'private-room',      icon:'🏠', title:'Private Room',       price:'Rs.1,200/night' },
  { slug:'deluxe-suite',      icon:'🌟', title:'Deluxe Suite',       price:'Rs.2,500/night' },
];

export default function Header() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // label of open dropdown
  const [events, setEvents]       = useState(fallbackEvents);
  const [sevas, setSevas]         = useState(fallbackSevas);
  const [rooms, setRooms]         = useState(fallbackRooms);
  const pathname = usePathname();
  const router   = useRouter();

  // Fetch dynamic data
  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setEvents(d.slice(0,5)); }).catch(() => {});
    fetch('/api/campaigns').then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setSevas(d.slice(0,5).map(c => ({ slug: slugify(c.title), icon: c.icon||'🌸', title: c.title, amount: c.goal_amount ? `Rs.${Number(c.goal_amount).toLocaleString('en-IN')}` : '' }))); }).catch(() => {});
    fetch('/api/rooms').then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setRooms(d.map(r => ({ slug: slugify(r.title), icon: r.icon||'🛏️', title: r.title, price: r.price || (r.price_amount ? `Rs.${Number(r.price_amount).toLocaleString('en-IN')}/night` : '') }))); }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setOpenDropdown(null); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top, behavior:'smooth' }); }
    };
    doScroll();
    setTimeout(doScroll, 350);
  }, []);

  const handleDropdownClick = useCallback((child) => {
    setMenuOpen(false); setOpenDropdown(null);
    if (child.section) {
      if (pathname === child.href) { scrollToSection(child.section); }
      else { router.push(child.href); setTimeout(() => scrollToSection(child.section), 500); }
    } else { router.push(child.href); }
  }, [pathname, router, scrollToSection]);

  const toggleDropdown = (label, e) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === label ? null : label);
  };

  // ── Dropdown trigger style ──
  const triggerStyle = { display:'inline-flex', alignItems:'center', gap:'.3rem', fontSize:'.95rem', fontWeight:600, color:'#333', cursor:'pointer', userSelect:'none', fontFamily:'var(--font-poppins)', letterSpacing:'.01em', transition:'color .2s', background:'none', border:'none', padding:0 };

  // ── Shared dropdown wrapper ──
  const DropdownWrapper = ({ label, children }) => (
    <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
      <button style={triggerStyle}
        onMouseEnter={e => { e.currentTarget.style.color='#c45500'; setOpenDropdown(label); }}
        onMouseLeave={e => e.currentTarget.style.color='#333'}
        onClick={e => toggleDropdown(label, e)}>
        {label} <span style={{ fontSize:'.6rem' }}>▾</span>
      </button>
      {openDropdown === label && (
        <div onMouseEnter={() => setOpenDropdown(label)} onMouseLeave={() => setOpenDropdown(null)}
          style={{ position:'absolute', top:'calc(100% + .75rem)', left:'50%', transform:'translateX(-50%)', background:'white', borderRadius:'1.25rem', boxShadow:'0 20px 60px rgba(0,0,0,.12)', border:'1px solid rgba(237,104,0,.12)', minWidth:'240px', zIndex:1000, overflow:'hidden', padding:'.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ href, icon, title, sub, onClick }) => (
    <Link href={href} onClick={() => { setOpenDropdown(null); onClick?.(); }}
      style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.65rem .9rem', borderRadius:'.875rem', textDecoration:'none', transition:'background .15s', color:'#111' }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(237,104,0,.07)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'.84rem', fontWeight:600, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title}</p>
        {sub && <p style={{ fontSize:'.7rem', color:'#ed6800', fontWeight:500, marginTop:'.05rem' }}>{sub}</p>}
      </div>
    </Link>
  );

  const DropdownFooter = ({ href, label }) => (
    <div style={{ borderTop:'1px solid rgba(237,104,0,.1)', margin:'.5rem -.5rem -.5rem', padding:'.5rem' }}>
      <Link href={href} onClick={() => setOpenDropdown(null)}
        style={{ display:'block', textAlign:'center', fontSize:'.78rem', fontWeight:600, color:'#ed6800', padding:'.5rem', borderRadius:'.75rem', textDecoration:'none', transition:'background .15s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(237,104,0,.06)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
        {label} →
      </Link>
    </div>
  );

  return (
    <>
      {/* Mantra strip */}
      <div className="mantra-strip">
        <div className="mantra-track">{mantraText}{mantraText}</div>
      </div>

      {/* Header bar */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.85rem 0' }}>

            {/* Logo */}
            <Link href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', gap:'.5rem' }}>
              <img src="/logo.png" alt="ISKCON Ayodhya" style={{ height:'3rem', width:'auto', objectFit:'contain' }} />
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display:'flex', alignItems:'center', gap:'1rem' }} className="hidden-mobile">

              {/* ISKCON dropdown */}
              <DropdownWrapper label="ISKCON">
                {iskconChildren.map(child => (
                  <DropdownItem key={child.label} href={child.href} icon={child.section ? { founder:'🕉️', history:'🏛️', philosophy:'💫', pillars:'📿' }[child.section] || '📖' : '🛕'} title={child.label} onClick={() => child.section && (pathname === child.href ? scrollToSection(child.section) : (router.push(child.href), setTimeout(() => scrollToSection(child.section), 500)))} />
                ))}
                <DropdownFooter href="/about" label="View All About" />
              </DropdownWrapper>

              {/* Events dropdown */}
              <DropdownWrapper label="Events">
                {events.map(ev => (
                  <DropdownItem key={ev.id} href={`/events/${ev.id}`} icon={ev.icon || '🎪'} title={ev.name} sub={ev.date && ev.month ? `${ev.date} ${ev.month}${ev.year ? ' '+ev.year : ''}` : null} />
                ))}
                <DropdownFooter href="/events" label="All Events & Festivals" />
              </DropdownWrapper>

              {/* New Temple — plain link */}
              <Link href="/new-temple" className="nav-link" style={{ fontSize:'.95rem', fontWeight:600 }}>New Temple</Link>

              {/* Donation dropdown */}
              <DropdownWrapper label="Donation">
                {sevas.map(s => (
                  <DropdownItem key={s.slug} href={`/seva/${s.slug}`} icon={s.icon} title={s.title} sub={s.amount || null} />
                ))}
                <DropdownFooter href="/donation" label="All Seva Opportunities" />
              </DropdownWrapper>

              {/* Booking dropdown */}
              <DropdownWrapper label="Booking">
                {rooms.map(r => (
                  <DropdownItem key={r.slug} href={`/rooms/${r.slug}`} icon={r.icon} title={r.title} sub={r.price || null} />
                ))}
                <DropdownFooter href="/booking" label="View All Rooms" />
              </DropdownWrapper>

              {/* Contact — plain link */}
              <Link href="/contact" className="nav-link" style={{ fontSize:'.95rem', fontWeight:600 }}>Contact</Link>

              {/* Life Membership — uncomment to enable */}
              {/* <Link href="/life-membership" className="nav-link" style={{ fontSize:'.95rem', fontWeight:600 }}>Life Membership</Link> */}
            </nav>

            {/* CTA + Hamburger */}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <Link href="/donation" className="btn-primary hidden-mobile" style={{ padding:'.65rem 1.6rem', fontSize:'.88rem' }}>
                🙏 Donate Now
              </Link>
              <button aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}
                className={`hamburger show-mobile${menuOpen ? ' open' : ''}`}
                style={{ color:'#333', background:'none', border:'none', padding:'.25rem' }}>
                <span></span><span></span><span></span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu" onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
          <div style={{ marginBottom:'1.5rem' }}>
            <img src="/logo.png" alt="ISKCON Ayodhya" style={{ height:'2.75rem', objectFit:'contain' }} />
          </div>

          {/* Mobile ISKCON */}
          <div style={{ marginBottom:'.5rem' }}>
            <p style={{ fontSize:'.72rem', fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'.5rem', padding:'0 .5rem' }}>ISKCON</p>
            {iskconChildren.map(c => (
              <button key={c.label} onClick={() => handleDropdownClick(c)} style={{ display:'block', width:'100%', textAlign:'left', padding:'.7rem .5rem', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', color:'#111', fontWeight:500 }}>{c.label}</button>
            ))}
          </div>

          <div style={{ height:'1px', background:'rgba(237,104,0,.12)', margin:'.75rem 0' }} />
          <p style={{ fontSize:'.72rem', fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'.5rem', padding:'0 .5rem' }}>Events</p>
          {events.map(ev => (
            <Link key={ev.id} href={`/events/${ev.id}`} className="mobile-nav-link" style={{ fontSize:'1.1rem' }}>{ev.icon || '🎪'} {ev.name}</Link>
          ))}
          <Link href="/events" className="mobile-nav-link" style={{ fontSize:'1rem', color:'#ed6800' }}>View All Events →</Link>

          <div style={{ height:'1px', background:'rgba(237,104,0,.12)', margin:'.75rem 0' }} />
          <Link href="/new-temple" className="mobile-nav-link" style={{ fontSize:'1.2rem', fontWeight:700, color:'#c45500' }}>🛕 New Temple Project</Link>

          <div style={{ height:'1px', background:'rgba(237,104,0,.12)', margin:'.75rem 0' }} />
          <p style={{ fontSize:'.72rem', fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'.5rem', padding:'0 .5rem' }}>Donation</p>
          {sevas.map(s => (
            <Link key={s.slug} href={`/seva/${s.slug}`} className="mobile-nav-link" style={{ fontSize:'1.1rem' }}>{s.icon} {s.title}</Link>
          ))}
          <Link href="/donation" className="mobile-nav-link" style={{ fontSize:'1rem', color:'#ed6800' }}>View All Sevas →</Link>

          <div style={{ height:'1px', background:'rgba(237,104,0,.12)', margin:'.75rem 0' }} />
          <p style={{ fontSize:'.72rem', fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'.5rem', padding:'0 .5rem' }}>Booking</p>
          {rooms.map(r => (
            <Link key={r.slug} href={`/rooms/${r.slug}`} className="mobile-nav-link" style={{ fontSize:'1.1rem' }}>{r.icon} {r.title}</Link>
          ))}
          <Link href="/booking" className="mobile-nav-link" style={{ fontSize:'1rem', color:'#ed6800' }}>View All Rooms →</Link>

          <div style={{ height:'1px', background:'rgba(237,104,0,.12)', margin:'.75rem 0' }} />
          <Link href="/contact" className="mobile-nav-link" style={{ fontSize:'1.5rem' }}>Contact</Link>
          {/* Life Membership — uncomment to enable */}
          {/* <Link href="/life-membership" className="mobile-nav-link" style={{ fontSize:'1.5rem', color:'#c45500', fontWeight:700 }}>🌸 Life Membership</Link> */}

          <Link href="/donation" className="btn-primary" style={{ marginTop:'1.5rem', justifyContent:'center' }}>🙏 Donate Now</Link>
        </div>
      )}

      <style>{`
        @media (max-width:1024px) { .hidden-mobile { display:none !important; } }
        @media (min-width:1025px) { .show-mobile   { display:none !important; } }
      `}</style>
    </>
  );
}
