'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function slugify(title) {
  return (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const iskconChildren = [
  { label: 'About Us',                   href: '/about', section: null         },
  { label: 'Founder Acharya',            href: '/about', section: 'founder'    },
  { label: 'The History',                href: '/about', section: 'history'    },
  { label: 'Why Krishna Consciousness?', href: '/about', section: 'philosophy' },
  { label: 'Philosophy',                 href: '/about', section: 'pillars'    },
];

const mantra = 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare  ';
const mantraText = Array(8).fill(mantra).join('');

const E = {
  tent:   '\u{1F3AA}', // 🎪
  flower: '\u{1F33A}', // 🌺
  book:   '\u{1F4D6}', // 📖
  cow:    '\u{1F404}', // 🐄
  plate:  '\u{1F37D}️', // 🍽️
  cherry: '\u{1F338}', // 🌸
  bulb:   '\u{1F4A1}', // 💡
  bed:    '\u{1F6CF}️', // 🛏️
  house:  '\u{1F3E0}', // 🏠
  star:   '\u{1F31F}', // 🌟
  temple: '\u{1F6D5}', // 🛕
  pray:   '\u{1F64F}', // 🙏
};

const fallbackEvents = [
  { id:1, icon:E.tent,   name:'Janmashtami Mahotsav', date:'24', month:'Aug' },
  { id:2, icon:E.flower, name:'Ram Navami Yatra',      date:'17', month:'Apr' },
  { id:3, icon:E.book,   name:'Bhagwat Saptah',        date:'05', month:'Jun' },
];
const fallbackSevas = [
  { slug:'gaushala-seva', icon:E.cow,    title:'GauShala Seva', amount:'Rs.1,500' },
  { slug:'annadan-seva',  icon:E.plate,  title:'Annadan Seva',  amount:'Rs.1,000' },
  { slug:'pushpa-seva',   icon:E.cherry, title:'Pushpa Seva',   amount:'Rs.500'   },
  { slug:'deepa-seva',    icon:E.bulb,   title:'Deepa Seva',    amount:'Rs.251'   },
];
const fallbackRooms = [
  { slug:'devotee-dormitory', icon:E.bed,   title:'Devotee Dormitory', price:'Rs.300/night'   },
  { slug:'private-room',      icon:E.house, title:'Private Room',       price:'Rs.1,200/night' },
  { slug:'deluxe-suite',      icon:E.star,  title:'Deluxe Suite',       price:'Rs.2,500/night' },
];

const iskconIcons = {
  founder:   '\u{1F549}️', // 🕉️
  history:   '\u{1F3DB}️', // 🏛️
  philosophy:'\u{1F4AB}',       // 💫
  pillars:   '\u{1F4FF}',       // 📿
};

function MobileAccordion({ label, icon, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          display:'flex', alignItems:'center', width:'100%',
          padding:'1rem 1.25rem', background:'none', border:'none',
          cursor:'pointer', gap:'.75rem',
          fontFamily:'var(--font-cinzel)', fontSize:'1rem',
          fontWeight:600, color:'#111', letterSpacing:'.03em',
        }}
      >
        <span style={{ fontSize:'1.1rem', minWidth:'1.5rem' }}>{icon}</span>
        <span style={{ flex:1, textAlign:'left' }}>{label}</span>
        <span style={{
          fontSize:'.65rem', color:'#888', display:'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition:'transform .2s',
        }}>&#9660;</span>
      </button>
      {open && (
        <div style={{ background:'rgba(255,248,240,.7)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function MobileDivider() {
  return <div style={{ height:'1px', background:'rgba(237,104,0,.1)' }} />;
}

function MobileViewAll({ href, label, onClick }) {
  return (
    <Link href={href} onClick={onClick}
      style={{
        display:'block', padding:'.75rem 1rem .75rem 3.5rem',
        fontSize:'.85rem', fontWeight:600, color:'#ed6800',
        textDecoration:'none', fontFamily:'var(--font-poppins)',
      }}>
      {label} &rarr;
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [openDropdown, setOpenDropdown]   = useState(null);
  const [mobileSection, setMobileSection] = useState(null);
  const [headerBottom, setHeaderBottom]   = useState(80);
  const [events, setEvents]               = useState(fallbackEvents);
  const [sevas, setSevas]                 = useState(fallbackSevas);
  const [rooms, setRooms]                 = useState(fallbackRooms);
  const pathname  = usePathname();
  const router    = useRouter();
  const headerRef = useRef(null);

  useEffect(() => {
    const safeFetch = (url) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

    safeFetch('/api/events').then(d => {
      if (Array.isArray(d) && d.length) setEvents(d.slice(0,5));
    }).catch(() => {});
    safeFetch('/api/campaigns').then(d => {
      if (Array.isArray(d) && d.length)
        setSevas(d.slice(0,5).map(c => ({
          slug: slugify(c.title), icon: c.icon||E.cherry, title: c.title,
          amount: c.goal_amount ? 'Rs.'+Number(c.goal_amount).toLocaleString('en-IN') : ''
        })));
    }).catch(() => {});
    safeFetch('/api/rooms').then(d => {
      if (Array.isArray(d) && d.length)
        setRooms(d.map(r => ({
          slug: slugify(r.title), icon: r.icon||E.bed, title: r.title,
          price: r.price || (r.price_amount ? 'Rs.'+Number(r.price_amount).toLocaleString('en-IN')+'/night' : '')
        })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false); setOpenDropdown(null); setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const update = () => {
      if (headerRef.current)
        setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior:'smooth' });
      }
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

  const closeMenu = () => setMenuOpen(false);

  const triggerStyle = {
    display:'inline-flex', alignItems:'center', gap:'.3rem',
    fontSize:'.95rem', fontWeight:600, color:'#333', cursor:'pointer',
    userSelect:'none', fontFamily:'var(--font-poppins)', letterSpacing:'.01em',
    transition:'color .2s', background:'none', border:'none', padding:0
  };

  const DropdownWrapper = ({ label, children }) => (
    <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
      <button style={triggerStyle}
        onMouseEnter={e => { e.currentTarget.style.color='#c45500'; setOpenDropdown(label); }}
        onMouseLeave={e => e.currentTarget.style.color='#333'}
        onClick={e => toggleDropdown(label, e)}>
        {label} <span style={{ fontSize:'.6rem' }}>&#9660;</span>
      </button>
      {openDropdown === label && (
        <div
          onMouseEnter={() => setOpenDropdown(label)}
          onMouseLeave={() => setOpenDropdown(null)}
          style={{ position:'absolute', top:'calc(100% + .75rem)', left:'50%', transform:'translateX(-50%)', background:'white', borderRadius:'1.25rem', boxShadow:'0 20px 60px rgba(0,0,0,.12)', border:'1px solid rgba(237,104,0,.12)', minWidth:'240px', zIndex:1000, overflow:'hidden', padding:'.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ href, icon, title, sub, onClick }) => (
    <Link href={href} onClick={() => { setOpenDropdown(null); onClick && onClick(); }}
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
        {label} &rarr;
      </Link>
    </div>
  );

  return (
    <>
      <div className="mantra-strip">
        <div className="mantra-track">{mantraText}{mantraText}</div>
      </div>

      <header ref={headerRef} className={'site-header' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.85rem 0' }}>

            <Link href="/" style={{ display:'flex', alignItems:'center', textDecoration:'none', gap:'.5rem' }}>
              <img src="/logo.png" alt="ISKCON Ayodhya" style={{ height:'3rem', width:'auto', objectFit:'contain' }} />
            </Link>

            <nav style={{ display:'flex', alignItems:'center', gap:'1rem' }} className="hidden-mobile">
              <DropdownWrapper label="ISKCON">
                {iskconChildren.map(child => (
                  <DropdownItem key={child.label} href={child.href}
                    icon={child.section ? (iskconIcons[child.section] || E.book) : E.temple}
                    title={child.label}
                    onClick={() => child.section && (
                      pathname === child.href
                        ? scrollToSection(child.section)
                        : (router.push(child.href), setTimeout(() => scrollToSection(child.section), 500))
                    )} />
                ))}
                <DropdownFooter href="/about" label="View All About" />
              </DropdownWrapper>

              <DropdownWrapper label="Events">
                {events.map(ev => (
                  <DropdownItem key={ev.id} href={'/events/' + ev.id}
                    icon={ev.icon || E.tent}
                    title={ev.name}
                    sub={ev.date && ev.month ? ev.date + ' ' + ev.month + (ev.year ? ' ' + ev.year : '') : null} />
                ))}
                <DropdownFooter href="/events" label="All Events & Festivals" />
              </DropdownWrapper>

              <Link href="/new-temple" className="nav-link" style={{ fontSize:'.95rem', fontWeight:600 }}>New Temple</Link>

              <DropdownWrapper label="Donation">
                {sevas.map(s => (
                  <DropdownItem key={s.slug} href={'/seva/' + s.slug} icon={s.icon} title={s.title} />
                ))}
                <DropdownFooter href="/donation" label="All Seva Opportunities" />
              </DropdownWrapper>

              <DropdownWrapper label="Booking">
                {rooms.map(r => (
                  <DropdownItem key={r.slug} href={'/rooms/' + r.slug} icon={r.icon} title={r.title} />
                ))}
                <DropdownFooter href="/booking" label="View All Rooms" />
              </DropdownWrapper>

              <Link href="/contact" className="nav-link" style={{ fontSize:'.95rem', fontWeight:600 }}>Contact</Link>
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <Link href="/donation" className="btn-primary hidden-mobile" style={{ padding:'.65rem 1.6rem', fontSize:'.88rem' }}>
                Donate Now
              </Link>
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(function(prev) { return !prev; })}
                className={'hamburger show-mobile' + (menuOpen ? ' open' : '')}
                style={{ color:'#333', background:'none', border:'none', padding:'.25rem', cursor:'pointer' }}
              >
                <span></span><span></span><span></span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {menuOpen && (
        <div style={{
          position:'fixed',
          top: headerBottom,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#ffffff',
          zIndex: 998,
          borderTop: '2px solid rgba(237,104,0,.2)',
          boxShadow: '0 8px 30px rgba(0,0,0,.12)',
        }}>

          <MobileAccordion label="ISKCON" icon={E.temple}
            open={mobileSection === 'iskcon'}
            onToggle={function() { setMobileSection(function(s) { return s === 'iskcon' ? null : 'iskcon'; }); }}>
            {iskconChildren.map(function(c) {
              return (
                <button key={c.label} onClick={function() { handleDropdownClick(c); }}
                  style={{ display:'flex', alignItems:'center', gap:'.75rem', width:'100%', textAlign:'left', padding:'.75rem 1.25rem .75rem 3.5rem', background:'none', border:'none', borderBottom:'1px solid rgba(237,104,0,.07)', cursor:'pointer', fontSize:'.95rem', color:'#333', fontFamily:'var(--font-poppins)' }}>
                  {c.label}
                </button>
              );
            })}
            <MobileViewAll href="/about" label="View All About" onClick={closeMenu} />
          </MobileAccordion>

          <MobileDivider />

          <MobileAccordion label="Events" icon={E.tent}
            open={mobileSection === 'events'}
            onToggle={function() { setMobileSection(function(s) { return s === 'events' ? null : 'events'; }); }}>
            {events.map(function(ev) {
              return (
                <Link key={ev.id} href={'/events/' + ev.id} onClick={closeMenu}
                  style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.75rem 1.25rem .75rem 3.5rem', textDecoration:'none', color:'#333', fontSize:'.95rem', borderBottom:'1px solid rgba(237,104,0,.07)', fontFamily:'var(--font-poppins)' }}>
                  <span style={{ flex:1 }}>{ev.name}</span>
                  {ev.date && ev.month && (
                    <span style={{ fontSize:'.75rem', color:'#ed6800', fontWeight:600, flexShrink:0 }}>{ev.date} {ev.month}</span>
                  )}
                </Link>
              );
            })}
            <MobileViewAll href="/events" label="All Events & Festivals" onClick={closeMenu} />
          </MobileAccordion>

          <MobileDivider />

          <Link href="/new-temple" onClick={closeMenu}
            style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.25rem', textDecoration:'none', color:'#c45500', fontWeight:700, fontSize:'1rem', fontFamily:'var(--font-cinzel)', letterSpacing:'.03em' }}>
            New Temple Project
          </Link>

          <MobileDivider />

          <MobileAccordion label="Donation" icon={E.pray}
            open={mobileSection === 'donation'}
            onToggle={function() { setMobileSection(function(s) { return s === 'donation' ? null : 'donation'; }); }}>
            {sevas.map(function(s) {
              return (
                <Link key={s.slug} href={'/seva/' + s.slug} onClick={closeMenu}
                  style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.75rem 1.25rem .75rem 3.5rem', textDecoration:'none', color:'#333', fontSize:'.95rem', borderBottom:'1px solid rgba(237,104,0,.07)', fontFamily:'var(--font-poppins)' }}>
                  <span style={{ flex:1 }}>{s.title}</span>
                  {s.amount && <span style={{ fontSize:'.75rem', color:'#ed6800', fontWeight:600, flexShrink:0 }}>{s.amount}</span>}
                </Link>
              );
            })}
            <MobileViewAll href="/donation" label="All Seva Opportunities" onClick={closeMenu} />
          </MobileAccordion>

          <MobileDivider />

          <MobileAccordion label="Booking" icon={E.bed}
            open={mobileSection === 'booking'}
            onToggle={function() { setMobileSection(function(s) { return s === 'booking' ? null : 'booking'; }); }}>
            {rooms.map(function(r) {
              return (
                <Link key={r.slug} href={'/rooms/' + r.slug} onClick={closeMenu}
                  style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.75rem 1.25rem .75rem 3.5rem', textDecoration:'none', color:'#333', fontSize:'.95rem', borderBottom:'1px solid rgba(237,104,0,.07)', fontFamily:'var(--font-poppins)' }}>
                  <span style={{ flex:1 }}>{r.title}</span>
                  {r.price && <span style={{ fontSize:'.75rem', color:'#ed6800', fontWeight:600, flexShrink:0 }}>{r.price}</span>}
                </Link>
              );
            })}
            <MobileViewAll href="/booking" label="View All Rooms" onClick={closeMenu} />
          </MobileAccordion>

          <MobileDivider />

          <Link href="/contact" onClick={closeMenu}
            style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'1rem 1.25rem', textDecoration:'none', color:'#111', fontWeight:600, fontSize:'1rem', fontFamily:'var(--font-cinzel)', letterSpacing:'.03em' }}>
            Contact
          </Link>

          <MobileDivider />

          <div style={{ padding:'1.25rem' }}>
            <Link href="/donation" onClick={closeMenu} className="btn-primary"
              style={{ display:'flex', justifyContent:'center', width:'100%' }}>
              Donate Now
            </Link>
          </div>

        </div>
      )}

      <style>{'\
        @media (max-width:1024px) { .hidden-mobile { display:none !important; } }\
        @media (min-width:1025px) { .show-mobile   { display:none !important; } }\
      '}</style>
    </>
  );
}
