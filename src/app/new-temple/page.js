import Link from 'next/link';
import TempleProjectCard from '../components/TempleProjectCard';

async function getProjects() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/temple-projects`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export const metadata = {
  title: 'Temple Construction Projects | ISKCON Ayodhya',
  description: "Support ongoing and upcoming temple construction projects at ISKCON Ayodhya. Be part of building the Lord's eternal abode.",
};

export default async function NewTempleListingPage() {
  const projects = await getProjects();

  return (
    <main style={{ overflow:'hidden', background:'#fafaf8' }}>

      {/* HERO */}
      <section style={{ position:'relative', background:'linear-gradient(135deg,#0f0500 0%,#1e0a00 60%,#0f0500 100%)', padding:'8rem 0 5rem', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-6rem', right:'-6rem', width:'30rem', height:'30rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-3rem', right:'-3rem', width:'18rem', height:'18rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.1)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', left:'-4rem', width:'24rem', height:'24rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,transparent,#d4af37,#ed6800,#d4af37,transparent)' }} />
        <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(6rem,14vw,16rem)', opacity:.05, pointerEvents:'none', userSelect:'none' }}>🛕</div>

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          <div style={{ textAlign:'center', maxWidth:'700px', margin:'0 auto' }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontSize:'.7rem', fontWeight:700, padding:'.32rem 1rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:'1.5rem', boxShadow:'0 4px 18px rgba(237,104,0,.4)' }}>
              🛕 Sacred Construction Projects
            </span>
            <h1 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'white', lineHeight:1.15, marginBottom:'1rem', textShadow:'0 4px 24px rgba(0,0,0,.5)' }}>
              New Temple<br />
              <span style={{ background:'linear-gradient(135deg,#d4af37,#ed6800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Construction Projects
              </span>
            </h1>
            <p style={{ fontSize:'clamp(.9rem,1.5vw,1.05rem)', color:'rgba(255,255,255,.65)', lineHeight:1.8, maxWidth:'560px', margin:'0 auto' }}>
              Be part of building the Lord's eternal abodes. Every contribution, however small, becomes a sacred brick in this divine mission.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ padding:'5rem 0' }}>
        <div className="wrap">
          {projects.length === 0 ? (
            <div style={{ textAlign:'center', padding:'4rem 0' }}>
              <p style={{ fontSize:'3rem', marginBottom:'1rem' }}>🛕</p>
              <p style={{ color:'#888', fontSize:'1.1rem' }}>No active temple projects at the moment. Please check back soon.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign:'center', marginBottom:'3rem' }}>
                <span className="section-badge">Active Projects</span>
                <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:'#111', marginBottom:'.5rem' }}>
                  Ongoing <span className="gradient-text">Construction Projects</span>
                </h2>
                <div className="gold-line-center" />
                <p style={{ color:'#555', maxWidth:'520px', margin:'0 auto', fontSize:'.95rem', lineHeight:1.75 }}>
                  {projects.length} sacred project{projects.length !== 1 ? 's' : ''} currently active. Click on any project to learn more and donate.
                </p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap:'1.75rem' }}>
                {projects.map(p => <TempleProjectCard key={p.id} project={p} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign:'center' }}>
            <p style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🙏</p>
            <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:'#111', marginBottom:'.75rem' }}>
              Every Rupee Builds a Sacred Abode
            </h2>
            <p style={{ color:'#555', maxWidth:'500px', margin:'0 auto 2rem', lineHeight:1.85 }}>
              Like the Gilehari who helped Lord Ram by carrying tiny grains of sand, your small contribution becomes part of an eternal legacy.
            </p>
            <Link href="/new-temple" style={{ display:'inline-flex', alignItems:'center', padding:'1rem 2.5rem', borderRadius:'2rem', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, fontSize:'1.05rem', textDecoration:'none', boxShadow:'0 10px 30px rgba(237,104,0,.3)', fontFamily:'var(--font-poppins),sans-serif' }}>
              🛕 View All Projects
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
