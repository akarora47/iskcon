import Link from 'next/link';
import LifeMembershipForms from '../components/LifeMembershipForms';

async function getData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/life-membership`, { next: { revalidate: 60 } });
    if (!res.ok) return { settings: {}, benefits: [], gallery: [] };
    return res.json();
  } catch { return { settings: {}, benefits: [], gallery: [] }; }
}

export async function generateMetadata() {
  const { settings } = await getData();
  return {
    title: settings.meta_title || 'Life Membership | ISKCON Ayodhya',
    description: settings.meta_description || "Join the ISKCON Ayodhya family as a Life Member and be part of building the Lord's eternal abode.",
  };
}

export default async function LifeMembershipPage() {
  const { settings: s, benefits } = await getData();

  const membershipFee     = Number(s.membership_fee) || 100000;
  const membershipEnabled = s.membership_enabled !== 0;
  const suggestedAmounts  = Array.isArray(s.donation_suggested_amounts)
    ? s.donation_suggested_amounts
    : [1001, 2100, 5100, 11000, 21000];

  return (
    <main style={{ overflow: 'hidden', background: '#fafaf8' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', background: 'linear-gradient(135deg,#1a0800 0%,#2d1000 60%,#1a0800 100%)', padding: '7.5rem 0 4rem', overflow: 'hidden' }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '22rem', height: '22rem', borderRadius: '50%', border: '1px solid rgba(237,104,0,.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '14rem', height: '14rem', borderRadius: '50%', border: '1px solid rgba(212,175,55,.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5rem', left: '-3rem', width: '18rem', height: '18rem', borderRadius: '50%', border: '1px solid rgba(237,104,0,.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '7%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(6rem,12vw,14rem)', opacity: .05, pointerEvents: 'none', userSelect: 'none' }}>🌸</div>
        {/* Gold bottom line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.4),rgba(237,104,0,.6),rgba(212,175,55,.4),transparent)' }} />
        {/* Banner image overlay */}
        {s.banner_image && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={s.banner_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: .18 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,8,0,.88),rgba(45,16,0,.82))' }} />
          </div>
        )}

        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '2rem', padding: '.35rem .5rem', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
            <Link href="/" style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)', textDecoration: 'none', padding: '.15rem .65rem' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.65rem' }}>›</span>
            <span style={{ fontSize: '.72rem', color: '#ed6800', fontWeight: 600, padding: '.15rem .75rem', borderRadius: '1.5rem', background: 'rgba(237,104,0,.12)' }}>Life Membership</span>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '.15em', background: 'rgba(212,175,55,.1)', border: '1px solid rgba(212,175,55,.2)', borderRadius: '2rem', padding: '.3rem .9rem' }}>🌸 ISKCON Ayodhya</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'white', fontFamily: 'var(--font-cinzel),serif', lineHeight: 1.15, marginBottom: '1rem', maxWidth: '650px' }}>
            {s.page_title || 'Life Membership'}
          </h1>

          {/* Subtitle */}
          {s.hero_subtitle && (
            <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '2rem' }}>
              {s.hero_subtitle}
            </p>
          )}

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {membershipEnabled && (
              <a href="#membership-form" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', padding: '.75rem 1.75rem', borderRadius: '2rem', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(237,104,0,.4)', fontFamily: 'var(--font-poppins),sans-serif' }}>
                🌸 {s.cta_member_text || 'Become a Life Member'}
              </a>
            )}
            <a href="#donation-form" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'rgba(255,255,255,.07)', border: '1.5px solid rgba(212,175,55,.3)', color: 'rgba(255,255,255,.88)', padding: '.75rem 1.75rem', borderRadius: '2rem', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', fontFamily: 'var(--font-poppins),sans-serif' }}>
              🙏 {s.cta_donate_text || 'Donate Now'}
            </a>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding: '4rem 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Banner image */}
              {s.banner_image && (
                <div style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: '0 12px 40px rgba(0,0,0,.1)' }}>
                  <img src={s.banner_image} alt={s.page_title || 'Life Membership'} style={{ width: '100%', height: '22rem', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              {/* About */}
              {(s.about_title || s.about_content) && (
                <>
                  <h2 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.15rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
                    {s.about_title || 'About Life Membership'}
                  </h2>
                  {s.about_content && (
                    <p style={{ fontSize: '.95rem', lineHeight: 1.95, color: '#444', marginBottom: '2.5rem', whiteSpace: 'pre-line' }}>
                      {s.about_content}
                    </p>
                  )}
                </>
              )}

              {/* Membership fee badge */}
              {membershipEnabled && (
                <div style={{ background: 'linear-gradient(135deg,#fffdf8,#fff8f0)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>🌸</span>
                  <div>
                    <p style={{ fontSize: '.68rem', fontWeight: 700, color: '#ed6800', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.3rem' }}>Life Membership Contribution</p>
                    <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.5rem', fontWeight: 900, color: '#c45500', margin: '0 0 .2rem' }}>
                      ₹{membershipFee.toLocaleString('en-IN')}
                    </p>
                    <p style={{ fontSize: '.75rem', color: '#888', margin: 0 }}>80G tax benefit · Certificate dispatched within 15 days</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>
                    Member Privileges
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    {benefits.map(b => (
                      <div key={b.id} style={{ background: 'white', border: '1px solid rgba(237,104,0,.1)', borderRadius: '1rem', overflow: 'hidden', display: 'flex', gap: '1rem', alignItems: 'center', padding: b.image ? 0 : '1rem 1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
                        {b.image && (
                          <img src={b.image} alt={b.title} style={{ width: '5rem', height: '5rem', objectFit: 'cover', flexShrink: 0 }} />
                        )}
                        {!b.image && (
                          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(237,104,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, border: '1px solid rgba(237,104,0,.15)' }}>
                            {b.icon || '✦'}
                          </div>
                        )}
                        <div style={{ padding: b.image ? '1rem 1rem 1rem 0' : 0, flex: 1 }}>
                          <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.88rem', fontWeight: 700, color: '#111', marginBottom: '.25rem' }}>{b.title}</h3>
                          {b.description && <p style={{ fontSize: '.8rem', color: '#666', lineHeight: 1.65, margin: 0 }}>{b.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Bottom quote */}
              <div style={{ borderLeft: '3px solid rgba(237,104,0,.4)', paddingLeft: '1.25rem', marginTop: '1rem' }}>
                <p style={{ fontSize: '.88rem', color: '#555', fontStyle: 'italic', lineHeight: 1.85, marginBottom: '.4rem' }}>
                  "Whoever offers Me with devotion a leaf, a flower, a fruit or water — that offering of love from the pure-hearted I accept."
                </p>
                <p style={{ fontSize: '.7rem', color: '#bbb' }}>— Bhagavad Gita 9.26</p>
              </div>
            </div>

            {/* ── RIGHT COLUMN (sticky forms) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <LifeMembershipForms
                membershipFee={membershipFee}
                membershipEnabled={membershipEnabled}
                suggestedAmounts={suggestedAmounts}
                ctaMemberText={s.cta_member_text}
                ctaDonateText={s.cta_donate_text}
              />
            </div>

          </div>
        </div>
      </section>


    </main>
  );
}
