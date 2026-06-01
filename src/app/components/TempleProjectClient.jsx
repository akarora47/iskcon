'use client';
import TempleProjectDonationForm from './TempleProjectDonationForm';

const contactLinks = [
  { href:'tel:+919517312508',          icon:'📞', label:'+91 95173 12508', color:'#333',    bg:'rgba(237,104,0,.1)'     },
  { href:'https://wa.me/919517312508', icon:'💬', label:'WhatsApp Us',     color:'#25D366', bg:'rgba(37,211,102,.1)', ext:true },
  { href:'/contact',                   icon:'📩', label:'Send Inquiry',    color:'#ed6800', bg:'rgba(237,104,0,.1)'     },
];

export default function TempleProjectClient({ projectTitle, projectSlug, donationSettings }) {
  return (
    <>
      {/* ── DONATION FORM CARD ── */}
      <div style={{ background:'white', border:'1px solid rgba(237,104,0,.15)', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
        <div style={{ background:'linear-gradient(135deg,#c45500,#ed6800)', padding:'1.5rem', textAlign:'center' }}>
          <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>🛕</div>
          <h3 style={{ fontFamily:'var(--font-cinzel),serif', fontSize:'1rem', fontWeight:700, color:'white', marginBottom:'.2rem' }}>
            Donate for {projectTitle}
          </h3>
          <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.75)', margin:0 }}>Your contribution reaches the Lord's abode</p>
        </div>
        <div style={{ padding:'1.75rem' }}>
          <TempleProjectDonationForm
            projectTitle={projectTitle}
            projectSlug={projectSlug}
            donationSettings={donationSettings}
          />
        </div>
      </div>


      {/* ── NEED HELP ── */}
      <div style={{ background:'white', border:'1px solid rgba(0,0,0,.07)', borderRadius:'1.25rem', padding:'1.25rem 1.5rem' }}>
        <p style={{ fontSize:'.78rem', fontWeight:600, color:'#555', marginBottom:'.875rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Need Help?</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {contactLinks.map(c => (
            <a key={c.href} href={c.href} target={c.ext?'_blank':undefined} rel={c.ext?'noreferrer':undefined}
              style={{ display:'flex', alignItems:'center', gap:'.65rem', color:c.color, textDecoration:'none', fontSize:'.82rem', fontWeight:500 }}>
              <span style={{ width:'1.75rem', height:'1.75rem', borderRadius:'50%', background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', flexShrink:0 }}>{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>
      </div>

    </>
  );
}
