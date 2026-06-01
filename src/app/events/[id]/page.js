import Link from 'next/link';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import EventRegisterButton from '../../components/EventRegisterButton';

const categoryColors = { Festival:'#e67e22', Spiritual:'#8e44ad', Education:'#2980b9', Weekly:'#27ae60', Cultural:'#c0392b', default:'#ed6800' };

const FALLBACK_EVENTS = [
  { id:1, icon:'🎪', name:'Janmashtami Mahotsav', date:'24', month:'Aug', year:'2026', category:'Festival', featured:1, description:"Grand celebration of Lord Krishna's divine birth — Mahabhisheka, drama, sankirtan, and maha-prasadam for thousands of devotees." },
  { id:2, icon:'🌺', name:'Ram Navami Yatra',     date:'17', month:'Apr', year:'2026', category:'Festival', featured:0, description:'Sankirtan procession through the holy streets of Ayodhya, Ram Katha, and a grand city circumambulation. All devotees warmly welcome.' },
  { id:3, icon:'📖', name:'Bhagwat Saptah',       date:'05', month:'Jun', year:'2026', category:'Spiritual', featured:0, description:'Seven-day Srimad Bhagavatam recitation by senior Vaishnava saints. Come with your family.' },
];

async function getEvent(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ? AND active = 1', [Number(id)]);
    if (rows[0]) return rows[0];
  } catch {}
  return FALLBACK_EVENTS.find(e => String(e.id) === String(id)) || null;
}

async function getRelatedEvents(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE active = 1 AND id != ? ORDER BY featured DESC, id ASC LIMIT 3', [Number(id)]);
    if (rows.length) return rows;
  } catch {}
  return FALLBACK_EVENTS.filter(e => String(e.id) !== String(id));
}

const contactLinks = [
  { href:'tel:+919517312508',          icon:'📞', label:'+91 95173 12508', color:'#333',    bg:'rgba(237,104,0,.1)'   },
  { href:'https://wa.me/919517312508', icon:'💬', label:'WhatsApp Us',     color:'#25D366', bg:'rgba(37,211,102,.1)', ext:true },
  { href:'/contact',                   icon:'📩', label:'Send Inquiry',    color:'#ed6800', bg:'rgba(237,104,0,.1)'   },
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return { title: 'Event Not Found | ISKCON Ayodhya' };
  return { title: `${event.name} | ISKCON Ayodhya`, description: (event.description || '').slice(0, 155) };
}

export default async function EventDetailPage({ params }) {
  const { id }  = await params;
  const event   = await getEvent(id);
  if (!event) notFound();

  const related = await getRelatedEvents(id);
  const icon    = event.icon || '🕉️';
  const color   = categoryColors[event.category] || categoryColors.default;

  return (
    <main style={{ overflow:'hidden', background:'#fafaf8' }}>

      {/* ══ HERO BREADCRUMB ══ */}
      <section style={{ position:'relative', background:'linear-gradient(135deg,#1a0800 0%,#2d1000 60%,#1a0800 100%)', padding:'7.5rem 0 4rem', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-4rem', right:'-4rem', width:'22rem', height:'22rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-2rem', right:'-2rem', width:'14rem', height:'14rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', left:'-3rem', width:'18rem', height:'18rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(6rem,12vw,14rem)', opacity:0.06, pointerEvents:'none', userSelect:'none' }}>{icon}</div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          {/* Breadcrumb pills */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:0, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'2rem', padding:'.35rem .5rem', marginBottom:'2rem', backdropFilter:'blur(8px)' }}>
            <Link href="/" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem' }}>Home</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <Link href="/events" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem' }}>Events</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <span style={{ fontSize:'.72rem', color:'#ed6800', fontWeight:600, padding:'.15rem .75rem', borderRadius:'1.5rem', background:'rgba(237,104,0,.12)' }}>{event.name}</span>
          </div>

          {/* Tags */}
          <div style={{ display:'flex', gap:'.6rem', marginBottom:'1rem', flexWrap:'wrap' }}>
            <span style={{ fontSize:'.7rem', fontWeight:700, color:'white', textTransform:'uppercase', letterSpacing:'.12em', background:color, borderRadius:'2rem', padding:'.3rem .9rem' }}>
              {icon} {event.category || 'Festival'}
            </span>
            {event.featured === 1 && (
              <span style={{ fontSize:'.7rem', fontWeight:700, color:'#1a0800', background:'linear-gradient(135deg,#d4af37,#f0c040)', borderRadius:'2rem', padding:'.3rem .9rem' }}>⭐ Featured</span>
            )}
          </div>

          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'white', fontFamily:'var(--font-cinzel),serif', lineHeight:1.15, marginBottom:'1rem', maxWidth:'620px' }}>
            {event.name}
          </h1>

          {(event.date || event.month) && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(237,104,0,.12)', border:'1px solid rgba(237,104,0,.2)', borderRadius:'2rem', padding:'.4rem 1rem' }}>
              <span style={{ fontSize:'.8rem' }}>📅</span>
              <span style={{ fontFamily:'var(--font-cinzel),serif', fontWeight:700, color:'#ed6800', fontSize:'.88rem' }}>
                {event.date} {event.month} {event.year || ''}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding:'4rem 0' }}>
        <div className="wrap">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'3rem', alignItems:'start' }}>

            {/* LEFT */}
            <div>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.15rem', fontWeight:700, color:'#111', marginBottom:'1rem' }}>About This Event</h2>
              <p style={{ fontSize:'.95rem', lineHeight:1.95, color:'#444', marginBottom:'2rem' }}>{event.description}</p>

              <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                {[
                  event.date && { icon:'📅', label:'Date',     value:`${event.date} ${event.month} ${event.year || ''}` },
                  { icon:'📍', label:'Location',  value:'ISKCON Ayodhya, Ram Nagar, Faizabad, UP 224001' },
                  { icon:'🎟️', label:'Entry',      value:'Free for all — Registration recommended' },
                  { icon:'🍽️', label:'Prasadam',   value:'Served free to all attendees' },
                  { icon:'👗', label:'Dress Code', value:'Traditional / modest attire encouraged' },
                ].filter(Boolean).map(item => (
                  <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'.875rem 1.25rem', background:'white', borderRadius:'1rem', border:'1px solid rgba(0,0,0,.07)' }}>
                    <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize:'.68rem', color:'#aaa', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.1rem' }}>{item.label}</p>
                      <p style={{ fontSize:'.88rem', fontWeight:600, color:'#111' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — sticky */}
            <div style={{ position:'sticky', top:'6rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              {/* Register card */}
              <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
                <div style={{ background:'linear-gradient(135deg,#c45500,#ed6800)', padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{icon}</div>
                  <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'white', marginBottom:'.2rem' }}>Register for This Event</h3>
                  <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.75)' }}>Entry is free for all devotees</p>
                </div>
                <div style={{ padding:'1.75rem' }}>
                  <p style={{ fontSize:'.84rem', color:'#666', lineHeight:1.7, marginBottom:'1.25rem' }}>
                    Secure your spot and receive a confirmation email with event details.
                  </p>
                  <EventRegisterButton eventName={event.name} eventId={String(event.id)} />
                </div>
              </div>

              {/* Donate card */}
              <div style={{ background:'rgba(237,104,0,.04)', border:'1px solid rgba(237,104,0,.12)', borderRadius:'1.25rem', padding:'1.25rem 1.5rem' }}>
                <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'.88rem', fontWeight:700, color:'#111', marginBottom:'.4rem' }}>🌸 Support This Festival</p>
                <p style={{ fontSize:'.78rem', color:'#666', lineHeight:1.6, marginBottom:'1rem' }}>Sponsor decorations, prasadam, or cultural programs.</p>
                <Link href="/donation" className="btn-primary" style={{ display:'flex', width:'100%', justifyContent:'center', fontSize:'.84rem' }}>Offer Seva / Donate</Link>
              </div>

              {/* Contact card */}
              <div style={{ background:'white', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.25rem', padding:'1.25rem 1.5rem' }}>
                <p style={{ fontSize:'.78rem', fontWeight:600, color:'#555', marginBottom:'.875rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Need Help?</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                  {contactLinks.map(c => (
                    <a key={c.href} href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noreferrer' : undefined}
                      style={{ display:'flex', alignItems:'center', gap:'.65rem', color:c.color, textDecoration:'none', fontSize:'.82rem', fontWeight:500 }}>
                      <span style={{ width:'1.75rem', height:'1.75rem', borderRadius:'50%', background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', flexShrink:0 }}>{c.icon}</span>
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ RELATED EVENTS ══ */}
      {related.length > 0 && (
        <section style={{ padding:'3rem 0 4rem', background:'white', borderTop:'1px solid rgba(0,0,0,.06)' }}>
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111' }}>More Events & Festivals</h2>
              <Link href="/events" style={{ fontSize:'.8rem', color:'#ed6800', fontWeight:600, textDecoration:'none' }}>View All →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              {related.map(e => (
                <Link key={e.id} href={`/events/${e.id}`} style={{ textDecoration:'none' }}>
                  <div className="detail-card-link" style={{ background:'#fafaf8', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.1rem', padding:'1.25rem', transition:'all .2s' }}>
                    <div style={{ fontSize:'1.5rem', marginBottom:'.5rem' }}>{e.icon || '🕉️'}</div>
                    <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'.85rem', fontWeight:700, color:'#111', marginBottom:'.2rem' }}>{e.name}</p>
                    {e.date && <p style={{ fontSize:'.76rem', color:'#ed6800', fontWeight:600 }}>{e.date} {e.month} {e.year || ''}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`.detail-card-link:hover{border-color:rgba(237,104,0,.3)!important;box-shadow:0 4px 20px rgba(237,104,0,.1);transform:translateY(-2px);}`}</style>
        </section>
      )}

    </main>
  );
}
