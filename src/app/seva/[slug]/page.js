import Link from 'next/link';
import { notFound } from 'next/navigation';
import SevaInlineForm from '../../components/SevaInlineForm';

const ALL_SEVAS = [
  { slug:'gaushala-seva',      icon:'🐄', title:'GauShala Seva',     amount:'Rs.1,500', amountNum:1500, image:'/gaushala.jpg',           desc:'Our GauShala is home to over 50 sacred cows and calves, each considered dear to Lord Krishna. Your donation provides nutritious feed, veterinary care, and safe shelter for these gentle creatures — sustaining one of the most ancient and sacred traditions of Vedic culture.',     impact:'Nourishes 1 sacred cow for a full week — fodder, clean water, and veterinary care.' },
  { slug:'annadan-seva',       icon:'🍽️', title:'Annadan Seva',       amount:'Rs.1,000', amountNum:1000, image:'/prasadam-hall.jpg',       desc:"Every day, ISKCON Ayodhya distributes free prasadam to thousands of pilgrims, sadhus, and underprivileged guests. Annadan — the gift of food — is among the greatest acts of charity in Vedic culture. Lord Krishna says: serving food to the hungry is serving Him directly.",             impact:'Feeds pure prasadam to 10 hungry souls — pilgrims, sadhus, and the underprivileged.' },
  { slug:'janmashtami-utsav',  icon:'🎪', title:'Janmashtami Utsav',  amount:'Rs.2,500', amountNum:2500, image:'/festival-kirtan.jpg',     desc:"Janmashtami — the divine appearance of Lord Krishna — is the grandest festival at ISKCON Ayodhya. Thousands of devotees gather for a night-long celebration of kirtan, drama, Mahabhisheka, and maha-prasadam. Your sponsorship directly funds decorations, sound, cultural programs, and the grand prasadam feast.",  impact:'Sponsors one cultural program, decoration set, or prasadam distribution for the grand celebration.' },
  { slug:'pushpa-seva',        icon:'🌸', title:'Pushpa Seva',         amount:'Rs.500',   amountNum:500,  image:'/temple-deity.png',        desc:"Fresh flowers offered daily at the lotus feet of Lord Ram and Sita Devi are the purest expression of devotion. The Lord personally accepts this simple yet profound gesture of love. Your Pushpa Seva ensures fresh, fragrant flowers adorn the deities every morning.",  impact:"Provides fresh flowers for the daily deity worship — a direct offering at the Lord's lotus feet." },
  { slug:'deepa-seva',         icon:'💡', title:'Deepa Seva',          amount:'Rs.251',   amountNum:251,  image:'/aarti-ceremony.jpg',      desc:"The sacred flame in the temple represents the light of knowledge that dispels ignorance. Each lamp lit in the name of the Lord illuminates the hearts of every devotee who witnesses it. Your Deepa Seva keeps this divine light burning without interruption.",  impact:'Keeps the sacred temple lamp burning — illuminating the path of every visiting devotee.' },
  { slug:'gita-prachar-seva',  icon:'📖', title:'Gita Prachar Seva',  amount:'Rs.1,108', amountNum:1108, image:'/about-iskcon-ayodhya.jpg', desc:"The Bhagavad Gita is the most profound spiritual dialogue ever spoken. Srila Prabhupada dedicated his life to making these teachings accessible to every soul. Your seva sponsors the distribution of Bhagavad Gita As It Is to seekers, schools, libraries, and individuals worldwide.", impact:"Gifts one complete Bhagavad Gita As It Is to a seeking soul." },
  { slug:'mandir-nirman-seva', icon:'🏗️', title:'Mandir Nirman Seva', amount:'Rs.5,100', amountNum:5100, image:'/temple-gardens.jpg',      desc:"The new ISKCON Ayodhya temple complex will stand for centuries as a beacon of Vedic culture and devotion. By participating in Mandir Nirman Seva, your name becomes permanently inscribed in this sacred legacy.", impact:'Your contribution directly builds the eternal abode of Lord Ram and Krishna in Ayodhya Dham.' },
];

const contactLinks = [
  { href:'tel:+919517312508',                    icon:'📞', label:'+91 95173 12508',  color:'#333',     bg:'rgba(237,104,0,.1)'      },
  { href:'https://wa.me/919517312508',           icon:'💬', label:'WhatsApp Us',      color:'#25D366',  bg:'rgba(37,211,102,.1)',  ext:true },
  { href:'/contact',                             icon:'📩', label:'Send Inquiry',     color:'#ed6800',  bg:'rgba(237,104,0,.1)'      },
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seva = ALL_SEVAS.find(s => s.slug === slug);
  if (!seva) return { title: 'Seva Not Found | ISKCON Ayodhya' };
  return { title: `${seva.title} | ISKCON Ayodhya`, description: seva.desc.slice(0, 155) };
}

export default async function SevaDetailPage({ params }) {
  const { slug } = await params;
  const seva = ALL_SEVAS.find(s => s.slug === slug);
  if (!seva) notFound();
  const others = ALL_SEVAS.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <main style={{ overflow:'hidden', background:'#fafaf8' }}>

      {/* ══ HERO BREADCRUMB ══ */}
      <section style={{ position:'relative', background:'linear-gradient(135deg,#1a0800 0%,#2d1000 60%,#1a0800 100%)', padding:'7.5rem 0 4rem', overflow:'hidden' }}>
        {/* Decorative rings */}
        <div style={{ position:'absolute', top:'-4rem', right:'-4rem', width:'22rem', height:'22rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-2rem', right:'-2rem', width:'14rem', height:'14rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', left:'-3rem', width:'18rem', height:'18rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.07)', pointerEvents:'none' }} />
        {/* Giant background icon */}
        <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(6rem,12vw,14rem)', opacity:0.06, pointerEvents:'none', userSelect:'none' }}>{seva.icon}</div>
        {/* Gold bottom line */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          {/* Breadcrumb pills */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:0, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'2rem', padding:'.35rem .5rem', marginBottom:'2rem', backdropFilter:'blur(8px)' }}>
            <Link href="/" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem', transition:'color .2s' }}>Home</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <Link href="/donation" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem', borderRadius:'1.5rem' }}>Donation</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem', margin:'0 .1rem' }}>›</span>
            <span style={{ fontSize:'.72rem', color:'#ed6800', fontWeight:600, padding:'.15rem .75rem', borderRadius:'1.5rem', background:'rgba(237,104,0,.12)' }}>{seva.title}</span>
          </div>

          {/* Category tag */}
          <div style={{ marginBottom:'1rem' }}>
            <span style={{ fontSize:'.7rem', fontWeight:700, color:'#d4af37', textTransform:'uppercase', letterSpacing:'.15em', background:'rgba(212,175,55,.1)', border:'1px solid rgba(212,175,55,.2)', borderRadius:'2rem', padding:'.3rem .9rem' }}>🌸 Seva Opportunity</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'white', fontFamily:'var(--font-cinzel),serif', lineHeight:1.15, marginBottom:'1rem', maxWidth:'600px' }}>
            {seva.title}
          </h1>

          {/* Meta row */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(237,104,0,.12)', border:'1px solid rgba(237,104,0,.2)', borderRadius:'2rem', padding:'.4rem 1rem' }}>
              <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.5)' }}>Suggested offering</span>
              <span style={{ fontFamily:'var(--font-cinzel),serif', fontWeight:700, color:'#ed6800', fontSize:'.95rem' }}>{seva.amount}</span>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.15)', borderRadius:'2rem', padding:'.4rem 1rem' }}>
              <span style={{ color:'#4ade80', fontSize:'.75rem' }}>✅</span>
              <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.6)' }}>80G Tax Benefit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding:'4rem 0' }}>
        <div className="wrap">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap:'2rem', alignItems:'start' }}>

            {/* LEFT */}
            <div>
              {seva.image && (
                <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2.5rem', boxShadow:'0 12px 40px rgba(0,0,0,.1)' }}>
                  <img src={seva.image} alt={seva.title} style={{ width:'100%', height:'22rem', objectFit:'cover', display:'block' }} />
                </div>
              )}
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.15rem', fontWeight:700, color:'#111', marginBottom:'1rem' }}>About This Seva</h2>
              <p style={{ fontSize:'.95rem', lineHeight:1.95, color:'#444', marginBottom:'2rem' }}>{seva.desc}</p>

              <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'1.25rem 1.5rem', marginBottom:'1.75rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                <span style={{ fontSize:'1.4rem', flexShrink:0 }}>🙏</span>
                <div>
                  <p style={{ fontSize:'.7rem', fontWeight:700, color:'#ed6800', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Your Impact</p>
                  <p style={{ fontSize:'.9rem', color:'#333', lineHeight:1.7 }}>{seva.impact}</p>
                </div>
              </div>

              <div style={{ borderLeft:'3px solid rgba(237,104,0,.4)', paddingLeft:'1.25rem', marginBottom:'1.75rem' }}>
                <p style={{ fontSize:'.88rem', color:'#555', fontStyle:'italic', lineHeight:1.85, marginBottom:'.4rem' }}>
                  "Whoever offers Me with devotion a leaf, a flower, a fruit or water — that offering of love from the pure-hearted I accept."
                </p>
                <p style={{ fontSize:'.7rem', color:'#bbb' }}>— Bhagavad Gita 9.26</p>
              </div>

              <div style={{ background:'rgba(34,197,94,.04)', border:'1px solid rgba(34,197,94,.18)', borderRadius:'1rem', padding:'1rem 1.25rem', display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
                <span style={{ color:'#16a34a', fontSize:'1rem', flexShrink:0 }}>✅</span>
                <div>
                  <p style={{ fontSize:'.78rem', fontWeight:700, color:'#166534', marginBottom:'.2rem' }}>80G Tax Benefit Eligible</p>
                  <p style={{ fontSize:'.76rem', color:'#555', lineHeight:1.6 }}>Receipt emailed within 7 working days. PAN required for donations above Rs.50,000.</p>
                </div>
              </div>
            </div>

            {/* RIGHT — sticky */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
                <div style={{ background:'linear-gradient(135deg,#c45500,#ed6800)', padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{seva.icon}</div>
                  <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'white', marginBottom:'.2rem' }}>Offer {seva.title}</h3>
                  <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.75)' }}>Suggested: {seva.amount}</p>
                </div>
                <div style={{ padding:'1.75rem' }}>
                  <SevaInlineForm sevaTitle={seva.title} suggestedAmount={seva.amountNum} />
                </div>
              </div>

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

      {/* ══ OTHER SEVAS ══ */}
      {others.length > 0 && (
        <section style={{ padding:'3rem 0 4rem', background:'white', borderTop:'1px solid rgba(0,0,0,.06)' }}>
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111' }}>More Seva Opportunities</h2>
              <Link href="/donation" style={{ fontSize:'.8rem', color:'#ed6800', fontWeight:600, textDecoration:'none' }}>View All →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              {others.map(s => (
                <Link key={s.slug} href={`/seva/${s.slug}`} style={{ textDecoration:'none' }}>
                  <div className="detail-card-link" style={{ background:'#fafaf8', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.1rem', padding:'1.25rem', transition:'all .2s' }}>
                    <div style={{ fontSize:'1.5rem', marginBottom:'.5rem' }}>{s.icon}</div>
                    <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'.85rem', fontWeight:700, color:'#111', marginBottom:'.2rem' }}>{s.title}</p>
                    <p style={{ fontSize:'.76rem', color:'#ed6800', fontWeight:600 }}>{s.amount}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`.detail-card-link:hover { border-color:rgba(237,104,0,.3) !important; box-shadow:0 4px 20px rgba(237,104,0,.1); transform:translateY(-2px); }`}</style>
        </section>
      )}

    </main>
  );
}
