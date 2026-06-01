'use client';
import Link from 'next/link';

const STATUS_COLOR = {
  'In Progress': { bg:'rgba(237,104,0,.12)', color:'#c45500', dot:'#ed6800' },
  'Completed':   { bg:'rgba(34,197,94,.1)',  color:'#16a34a', dot:'#4ade80' },
  'Planning':    { bg:'rgba(99,102,241,.1)', color:'#6366f1', dot:'#818cf8' },
  'Foundation':  { bg:'rgba(234,179,8,.1)',  color:'#b45309', dot:'#eab308' },
  'Upcoming':    { bg:'rgba(168,85,247,.1)', color:'#9333ea', dot:'#c084fc' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR['In Progress'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'.35rem', background:s.bg, color:s.color, fontSize:'.68rem', fontWeight:700, padding:'.28rem .8rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'.08em' }}>
      <span style={{ width:'.45rem', height:'.45rem', borderRadius:'50%', background:s.dot, display:'inline-block', flexShrink:0 }} />
      {status || 'In Progress'}
    </span>
  );
}

export default function TempleProjectCard({ project }) {
  return (
    <div
      style={{ background:'white', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,.07)', border:'1px solid rgba(0,0,0,.06)', transition:'all .3s', display:'flex', flexDirection:'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 50px rgba(196,85,0,.14)'; e.currentTarget.style.borderColor='rgba(237,104,0,.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,.07)';    e.currentTarget.style.borderColor='rgba(0,0,0,.06)'; }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:'13rem', overflow:'hidden', background:'#f5f0eb' }}>
        {project.banner_image ? (
          <img
            src={project.banner_image}
            alt={project.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .4s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          />
        ) : (
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1a0800,#3d1200)', fontSize:'4rem' }}>🛕</div>
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,rgba(0,0,0,.35) 100%)' }} />
        <div style={{ position:'absolute', top:'1rem', left:'1rem' }}>
          <StatusBadge status={project.construction_status} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'1.5rem', flex:1, display:'flex', flexDirection:'column' }}>
        <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1.05rem', fontWeight:700, color:'#111', marginBottom:'.35rem', lineHeight:1.3 }}>
          {project.title}
        </h3>
        {project.location && (
          <p style={{ fontSize:'.78rem', color:'#ed6800', fontWeight:600, marginBottom:'.75rem', display:'flex', alignItems:'center', gap:'.3rem' }}>
            📍 {project.location}
          </p>
        )}
        <p style={{ fontSize:'.855rem', color:'#555', lineHeight:1.75, marginBottom:'1.25rem', flex:1 }}>
          {(project.description || '').slice(0, 130)}{(project.description?.length || 0) > 130 ? '…' : ''}
        </p>


        <Link
          href={`/new-temple/${project.slug}`}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.75rem 1.25rem', borderRadius:'2rem', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, fontSize:'.88rem', textDecoration:'none', boxShadow:'0 6px 18px rgba(237,104,0,.3)', transition:'filter .2s', fontFamily:'var(--font-poppins),sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.filter='brightness(1.1)'}
          onMouseLeave={e => e.currentTarget.style.filter='brightness(1)'}
        >
          View Project Details →
        </Link>
      </div>
    </div>
  );
}
