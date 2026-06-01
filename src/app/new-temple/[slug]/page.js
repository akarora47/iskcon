import { notFound } from 'next/navigation';
import Link from 'next/link';
import TempleProjectClient from '../../components/TempleProjectClient';
import GilehriSevaSection from '../../components/GilehriSevaSection';

async function getProject(slug) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/temple-projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getAllProjects() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/temple-projects`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: 'Not Found' };
  return {
    title: p.meta_title || `${p.title} | ISKCON Ayodhya`,
    description: p.meta_description || p.description || '',
  };
}

const STATUS_COLOR = {
  'In Progress': { bg:'rgba(237,104,0,.12)', color:'#ed6800'  },
  'Completed':   { bg:'rgba(34,197,94,.1)',  color:'#4ade80'  },
  'Planning':    { bg:'rgba(99,102,241,.1)', color:'#818cf8'  },
  'Foundation':  { bg:'rgba(234,179,8,.12)', color:'#eab308'  },
  'Upcoming':    { bg:'rgba(168,85,247,.1)', color:'#c084fc'  },
};

export default async function TempleProjectDetailPage({ params }) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProject(slug), getAllProjects()]);
  if (!project) notFound();

  const stats    = project.stats || {};
  const gilehri  = project.gilehri;
  const donSettings = project.donationSettings;
  const sc = STATUS_COLOR[project.construction_status] || STATUS_COLOR['In Progress'];
  const others = allProjects.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <main style={{ overflow:'hidden', background:'#fafaf8' }}>

      {/* ══ HERO ══ */}
      <section style={{ position:'relative', background:'linear-gradient(135deg,#1a0800 0%,#2d1000 60%,#1a0800 100%)', padding:'7.5rem 0 4rem', overflow:'hidden' }}>
        {/* Decorative rings */}
        <div style={{ position:'absolute', top:'-4rem', right:'-4rem', width:'22rem', height:'22rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-2rem', right:'-2rem', width:'14rem', height:'14rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-5rem', left:'-3rem', width:'18rem', height:'18rem', borderRadius:'50%', border:'1px solid rgba(237,104,0,.07)', pointerEvents:'none' }} />
        {/* Background icon */}
        <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(6rem,12vw,14rem)', opacity:.06, pointerEvents:'none', userSelect:'none' }}>🛕</div>
        {/* Gold bottom line */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />

        <div className="wrap" style={{ position:'relative', zIndex:2 }}>
          {/* Breadcrumb */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:0, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'2rem', padding:'.35rem .5rem', marginBottom:'2rem', backdropFilter:'blur(8px)' }}>
            <Link href="/" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem' }}>Home</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem' }}>›</span>
            <Link href="/new-temple" style={{ fontSize:'.72rem', color:'rgba(255,255,255,.5)', textDecoration:'none', padding:'.15rem .65rem' }}>New Temple</Link>
            <span style={{ color:'rgba(255,255,255,.2)', fontSize:'.65rem' }}>›</span>
            <span style={{ fontSize:'.72rem', color:'#ed6800', fontWeight:600, padding:'.15rem .75rem', borderRadius:'1.5rem', background:'rgba(237,104,0,.12)' }}>{project.title}</span>
          </div>

          {/* Category tag */}
          <div style={{ marginBottom:'1rem' }}>
            <span style={{ fontSize:'.7rem', fontWeight:700, color:'#d4af37', textTransform:'uppercase', letterSpacing:'.15em', background:'rgba(212,175,55,.1)', border:'1px solid rgba(212,175,55,.2)', borderRadius:'2rem', padding:'.3rem .9rem' }}>🛕 Temple Construction Project</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'white', fontFamily:'var(--font-cinzel),serif', lineHeight:1.15, marginBottom:'1rem', maxWidth:'650px' }}>
            {project.title}
          </h1>

          {/* Meta row */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            {project.location && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(237,104,0,.12)', border:'1px solid rgba(237,104,0,.2)', borderRadius:'2rem', padding:'.4rem 1rem' }}>
                <span style={{ fontSize:'.8rem' }}>📍</span>
                <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,.8)', fontWeight:500 }}>{project.location}</span>
              </div>
            )}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:sc.bg, border:`1px solid ${sc.color}33`, borderRadius:'2rem', padding:'.4rem 1rem' }}>
              <span style={{ width:'.45rem', height:'.45rem', borderRadius:'50%', background:sc.color, display:'inline-block' }} />
              <span style={{ fontSize:'.82rem', color:sc.color, fontWeight:700 }}>{project.construction_status || 'In Progress'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding:'4rem 0' }}>
        <div className="wrap">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap:'2.5rem', alignItems:'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Banner image */}
              {project.banner_image && (
                <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2.5rem', boxShadow:'0 12px 40px rgba(0,0,0,.1)' }}>
                  <img src={project.banner_image} alt={project.title} style={{ width:'100%', height:'22rem', objectFit:'cover', display:'block' }} />
                </div>
              )}

              {/* About */}
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.15rem', fontWeight:700, color:'#111', marginBottom:'1rem' }}>About This Project</h2>
              <p style={{ fontSize:'.95rem', lineHeight:1.95, color:'#444', marginBottom:'2rem' }}>{project.about_content || project.description}</p>


              {/* Stats */}
              {Object.keys(stats).length > 0 && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'.75rem', marginBottom:'2rem' }}>
                  {Object.entries(stats).map(([k, v]) => (
                    <div key={k} style={{ background:'white', border:'1px solid rgba(237,104,0,.12)', borderRadius:'1rem', padding:'1rem', textAlign:'center' }}>
                      <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.2rem', fontWeight:900, color:'#ed6800', marginBottom:'.2rem' }}>{v}</p>
                      <p style={{ fontSize:'.68rem', color:'#888', textTransform:'uppercase', letterSpacing:'.06em' }}>{k.replace(/_/g,' ')}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Project Requirements */}
              {project.project_requirements && (
                <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1rem', padding:'1.25rem 1.5rem', marginBottom:'1.75rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1.4rem', flexShrink:0 }}>🏗️</span>
                  <div>
                    <p style={{ fontSize:'.7rem', fontWeight:700, color:'#ed6800', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.3rem' }}>Project Requirements</p>
                    <p style={{ fontSize:'.9rem', color:'#333', lineHeight:1.75 }}>{project.project_requirements}</p>
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT COLUMN (sticky) ── */}
            <div id="donate" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <TempleProjectClient
                projectTitle={project.title}
                projectSlug={project.slug}
                donationSettings={donSettings}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══ GILEHRI SEVA ══ */}
      <GilehriSevaSection gilehri={gilehri} projectTitle={project.title} />

      {/* ══ OTHER PROJECTS ══ */}
      {others.length > 0 && (
        <section style={{ padding:'3rem 0 4rem', background:'white', borderTop:'1px solid rgba(0,0,0,.06)' }}>
          <div className="wrap">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.1rem', fontWeight:700, color:'#111' }}>More Temple Projects</h2>
              <Link href="/new-temple" style={{ fontSize:'.8rem', color:'#ed6800', fontWeight:600, textDecoration:'none' }}>View All →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              {others.map(p => (
                <Link key={p.slug} href={`/new-temple/${p.slug}`} style={{ textDecoration:'none' }}>
                  <div className="detail-card-link" style={{ background:'#fafaf8', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.1rem', overflow:'hidden', transition:'all .2s' }}>
                    {p.banner_image && <img src={p.banner_image} alt={p.title} style={{ width:'100%', height:'7rem', objectFit:'cover', display:'block' }} />}
                    <div style={{ padding:'1rem' }}>
                      <p style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'.85rem', fontWeight:700, color:'#111', marginBottom:'.2rem' }}>{p.title}</p>
                      {p.location && <p style={{ fontSize:'.72rem', color:'#ed6800', fontWeight:600 }}>📍 {p.location}</p>}
                    </div>
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
