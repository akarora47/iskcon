'use client';
import { useState } from 'react';
import LifeMembershipForm from './LifeMembershipForm';
import LifeMembershipDonationForm from './LifeMembershipDonationForm';

export default function LifeMembershipForms({
  membershipFee = 100000,
  membershipEnabled = true,
  suggestedAmounts = [1001, 2100, 5100, 11000, 21000],
  ctaMemberText = 'Become a Life Member',
  ctaDonateText = 'Donate Now',
}) {
  const [active, setActive] = useState(membershipEnabled ? 'member' : 'donate');

  const tabBtn = (key, label, icon) => (
    <button
      onClick={() => setActive(key)}
      style={{
        flex: 1, padding: '.7rem .5rem', border: 'none', cursor: 'pointer',
        borderRadius: '.75rem', fontWeight: active === key ? 700 : 500,
        fontSize: '.85rem', fontFamily: 'inherit', transition: 'all .2s',
        background: active === key ? 'linear-gradient(135deg,#c45500,#ed6800)' : 'transparent',
        color: active === key ? 'white' : 'rgba(255,255,255,.5)',
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Membership Form Card ── */}
      {membershipEnabled && (
        <div id="membership-form" style={{ scrollMarginTop: '100px', background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.09)', border: '1px solid rgba(237,104,0,.12)' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#0f0500,#2d1000)', padding: '1.75rem 1.75rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '9rem', height: '9rem', borderRadius: '50%', border: '1px solid rgba(212,175,55,.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', width: '5rem', height: '5rem', borderRadius: '50%', border: '1px solid rgba(212,175,55,.18)', pointerEvents: 'none' }} />
            <span style={{ display: 'inline-block', background: 'rgba(212,175,55,.15)', color: '#d4af37', fontSize: '.62rem', fontWeight: 700, padding: '.22rem .75rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem', border: '1px solid rgba(212,175,55,.25)' }}>
              🌸 Lifetime Membership
            </span>
            <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '.3rem' }}>
              {ctaMemberText}
            </h3>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.82rem', margin: 0 }}>
              Join the eternal family of devotees at ISKCON Ayodhya
            </p>
          </div>
          <div style={{ padding: '1.75rem' }}>
            <LifeMembershipForm membershipFee={membershipFee} />
          </div>
        </div>
      )}

      {/* ── Donation Form Card ── */}
      <div id="donation-form" style={{ scrollMarginTop: '100px', background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.09)', border: '1px solid rgba(237,104,0,.12)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#c45500,#ed6800)', padding: '1.75rem 1.75rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '9rem', height: '9rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)', pointerEvents: 'none' }} />
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.18)', color: 'white', fontSize: '.62rem', fontWeight: 700, padding: '.22rem .75rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
            🙏 General Donation
          </span>
          <h3 style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '.3rem' }}>
            {ctaDonateText}
          </h3>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.82rem', margin: 0 }}>
            Support the divine mission — no membership required
          </p>
        </div>
        <div style={{ padding: '1.75rem' }}>
          <LifeMembershipDonationForm suggestedAmounts={suggestedAmounts} />
        </div>
      </div>

      {/* ── Need Help ── */}
      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,.07)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
        <p style={{ fontSize: '.75rem', fontWeight: 600, color: '#777', marginBottom: '.875rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Need Help?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {[
            { href: 'tel:+919517312508', icon: '📞', label: '+91 95173 12508', color: '#333' },
            { href: 'https://wa.me/919517312508', icon: '💬', label: 'WhatsApp Us', color: '#25D366', ext: true },
            { href: '/contact', icon: '📩', label: 'Send Inquiry', color: '#ed6800' },
          ].map(c => (
            <a key={c.href} href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noreferrer' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: '.65rem', color: c.color, textDecoration: 'none', fontSize: '.83rem', fontWeight: 500 }}>
              <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'rgba(237,104,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', flexShrink: 0 }}>{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
