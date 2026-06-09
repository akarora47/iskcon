import Link from 'next/link';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import BookingModalBtns from '../../components/BookingModalBtns';

function slugify(t) { return (t||'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''); }

const FALLBACK_ROOMS = [
  { id:null, icon:'🛏️', title:'Devotee Dormitory', price:'Rs.300/night',   price_amount:300,  image:'/prasadam-hall.jpg',  description:'Simple, clean accommodation for solo devotees and pilgrims — community living with austerity and devotion.',        features:['AC dormitory beds','Common bathrooms','Temple proximity','Prasadam included'], popular:false },
  { id:null, icon:'🏠', title:'Private Room',       price:'Rs.1,200/night', price_amount:1200, image:'/temple-gardens.jpg', description:'Comfortable private rooms for families and individuals seeking a peaceful spiritual retreat with modern amenities.',   features:['AC private room','Attached bathroom','Wi-Fi & TV','Daily prasadam'],           popular:true  },
  { id:null, icon:'🌟', title:'Deluxe Suite',       price:'Rs.2,500/night', price_amount:2500, image:'/aarti-ceremony.jpg', description:'Premium suites with beautiful temple views for a luxurious and deeply immersive spiritual experience in Ayodhya.',   features:['Spacious AC suite','Premium bathroom','Balcony & city view','Priority prasadam'], popular:false },
];

async function getRoomBySlug(slug) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE active = 1');
    const parsed = rows.map(r => ({ ...r, features: typeof r.features==='string' ? JSON.parse(r.features) : (r.features||[]) }));
    const found = parsed.find(r => slugify(r.title) === slug);
    if (found) return found;
  } catch {}
  return FALLBACK_ROOMS.find(r => slugify(r.title) === slug) || null;
}

async function getOtherRooms(slug) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE active = 1 ORDER BY price_amount ASC');
    return rows.map(r => ({ ...r, features: typeof r.features==='string' ? JSON.parse(r.features) : (r.features||[]) })).filter(r => slugify(r.title) !== slug);
  } catch {
    return FALLBACK_ROOMS.filter(r => slugify(r.title) !== slug);
  }
}

const contactLinks = [
  { href:'tel:+919517312508', icon:'📞', label:'+91 95173 12508', color:'#333', bg:'rgba(237,104,0,.1)' },
  { href:'tel:+916387021220', icon:'📞', label:'+91 63870 21220', color:'#333', bg:'rgba(237,104,0,.1)' },
  { href:'https://whatsapp.com/channel/0029VaxoenoDTkK4PrgDiK1I', icon:'💬', label:'WhatsApp Channel', color:'#25D366', bg:'rgba(37,211,102,.1)', ext:true },
  { href:'/contact',                   icon:'📩', label:'Send Inquiry',    color:'#ed6800', bg:'rgba(237,104,0,.1)'   },
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: 'Room Not Found | ISKCON Ayodhya' };
  return { title: `${room.title} | ISKCON Ayodhya Guest House`, description: room.description };
}

export default async function RoomDetailPage({ params }) {
  const { slug }   = await params;
  const room       = await getRoomBySlug(slug);
  if (!room) notFound();
  const others     = await getOtherRooms(slug);
  const priceLabel = room.price || (room.price_amount ? `Rs.${Number(room.price_amount).toLocaleString('en-IN')}/night` : '');
  const icon       = room.icon || '🛏️';

  return (
    <main style={{ overflow:'hidden', background:'#fafaf8' }}>

      {/* ══ HERO BREADCRUMB ══ */}
      <section style={{ position:'relative', background:'linear-gradient(135deg,#1a0800 0%,#2d1000 60%,#1a0800 100%)', padding:'7.5rem 0 4rem', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-4rem', right:'-4rem', width:'22rem', height:'22rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-2rem', right:'-2rem', width:'14rem', height:'14rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', left:'-3rem', width:'18rem', height:'18rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(6rem,12vw,14rem)', opacity:0.06, pointerEvents:'none', userSelect:'none' }}>🏨</div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          {/* Breadcrumb pills */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:0, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'2rem', padding:'.35rem .5rem', marginBottom:'2rem', backdropFilter:'blur(8px)' }}>
            <Link href="/" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem' }}>Home</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <Link href="/booking" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem' }}>Booking</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <span style={{ fontSize:'.72rem', color:'#ed6800', fontWeight:600, padding:'.15rem .75rem', borderRadius:'1.5rem', background:'rgba(237,104,0,.12)' }}>{room.title}</span>
          </div>

          {/* Tags */}
          <div style={{ display:'flex', gap:'.6rem', marginBottom:'1rem', flexWrap:'wrap' }}>
            <span style={{ fontSize:'.7rem', fontWeight:700, color:'#d4af37', textTransform:'uppercase', letterSpacing:'.15em', background:'rgba(212,175,55,.1)', border:'1px solid rgba(212,175,55,.2)', borderRadius:'2rem', padding:'.3rem .9rem' }}>🛕 Temple Accommodation</span>
            {(room.popular===1||room.popular===true) && (
              <span style={{ fontSize:'.7rem', fontWeight:700, color:'#1a0800', background:'linear-gradient(135deg,#d4af37,#f0c040)', borderRadius:'2rem', padding:'.3rem .9rem' }}>⭐ Most Popular</span>
            )}
          </div>

          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'white', fontFamily:'var(--font-cinzel),serif', lineHeight:1.15, marginBottom:'1rem', maxWidth:'600px' }}>
            {icon} {room.title}
          </h1>

        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding:'4rem 0' }}>
        <div className="wrap">
          <div className="room-detail-grid">

            {/* LEFT */}
            <div>
              {room.image && (
                <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2.5rem', boxShadow:'0 12px 40px rgba(0,0,0,.1)' }}>
                  <img src={room.image} alt={room.title} style={{ width:'100%', height:'22rem', objectFit:'cover', display:'block' }} />
                </div>
              )}

              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.15rem', fontWeight:700, color:'#111', marginBottom:'1rem' }}>About This Room</h2>
              <p style={{ fontSize:'.95rem', lineHeight:1.95, color:'#444', marginBottom:'2rem' }}>{room.description}</p>

              {/* Features */}
              {(Array.isArray(room.features) && room.features.length > 0) && (
                <div style={{ marginBottom:'2rem' }}>
                  <p style={{ fontSize:'.72rem', fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.875rem' }}>Room Features</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem' }}>
                    {room.features.map(f => (
                      <span key={f} style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', color:'#444', fontSize:'.82rem', fontWeight:500, padding:'.4rem 1rem', borderRadius:'2rem' }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stay info */}
              <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                {[
                  { icon:'📿', label:'Aarti Access',         value:'Morning aarti darshan at 4:30 AM' },
                  { icon:'⏰', label:'Check-in / Check-out', value:'12:00 PM / 10:00 AM' },
                  { icon:'🛕', label:'Dress Code',           value:'Respectful attire required in temple premises' },
                  { icon:'🚭', label:'No Smoking',           value:'Entire premises are smoke-free' },
                ].map(item => (
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

            {/* RIGHT — sticky on desktop, normal on mobile */}
            <div>
              {/* Book card */}
              <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
                <div style={{ background:'linear-gradient(135deg,#c45500,#ed6800)', padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{icon}</div>
                  <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'white', marginBottom:'.2rem' }}>{room.title}</h3>
                  <p style={{ fontSize:'.82rem', color:'rgba(255,255,255,.75)', marginTop:'.2rem' }}>Enquire for availability & pricing</p>
                </div>
                <div style={{ padding:'1.75rem' }}>
                  <p style={{ fontSize:'.84rem', color:'#666', lineHeight:1.7, marginBottom:'1.25rem' }}>
                    Fill in your details and our team will confirm your booking within 24 hours.
                  </p>
                  <BookingModalBtns roomName={room.title} />
                  <p style={{ fontSize:'.7rem', color:'#bbb', textAlign:'center', marginTop:'.75rem' }}>Free cancellation · Confirmation within 24 hours</p>
                </div>
              </div>

              {/* Prasadam schedule */}
              <div style={{ background:'white', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.25rem', padding:'1.25rem 1.5rem' }}>
                <p style={{ fontSize:'.78rem', fontWeight:600, color:'#555', marginBottom:'.875rem', textTransform:'uppercase', letterSpacing:'.06em' }}>🍽️ Daily Prasadam</p>
                {[['Breakfast','8:00 – 9:30 AM'],['Lunch','12:30 – 2:00 PM'],['Dinner','7:30 – 9:00 PM']].map(([meal,time]) => (
                  <div key={meal} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.5rem 0', borderBottom:'1px solid rgba(0,0,0,.05)', fontSize:'.82rem' }}>
                    <span style={{ color:'#444', fontWeight:500 }}>{meal}</span>
                    <span style={{ color:'#ed6800', fontWeight:600, fontSize:'.78rem' }}>{time}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
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

      {/* ══ OTHER ROOMS ══ */}
      {others.length > 0 && (
        <section style={{ padding:'3rem 0 4rem', background:'white', borderTop:'1px solid rgba(0,0,0,.06)' }}>
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111' }}>Other Room Options</h2>
              <Link href="/booking" style={{ fontSize:'.8rem', color:'#ed6800', fontWeight:600, textDecoration:'none' }}>View All →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              {others.map(r => (
                <Link key={r.title} href={`/rooms/${slugify(r.title)}`} style={{ textDecoration:'none' }}>
                  <div className="detail-card-link" style={{ background:'#fafaf8', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.1rem', overflow:'hidden', transition:'all .2s' }}>
                    <img src={r.image||'/prasadam-hall.jpg'} alt={r.title} style={{ width:'100%', height:'8rem', objectFit:'cover', display:'block' }} />
                    <div style={{ padding:'1rem' }}>
                      <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'.85rem', fontWeight:700, color:'#111' }}>{r.icon||'🛏️'} {r.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`
            .room-detail-grid { display:grid; grid-template-columns:1fr 360px; gap:3rem; align-items:start; }
            .room-detail-grid > div:last-child { position:sticky; top:6rem; display:flex; flex-direction:column; gap:1.25rem; }
            @media (max-width:768px) {
              .room-detail-grid { grid-template-columns:1fr; gap:2rem; }
              .room-detail-grid > div:last-child { position:static; }
            }
            .detail-card-link:hover{border-color:rgba(237,104,0,.3)!important;box-shadow:0 4px 20px rgba(237,104,0,.1);transform:translateY(-2px);}
          `}</style>
        </section>
      )}

    </main>
  );
}
