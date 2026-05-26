'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const card = (icon, label, value, color, href) => ({ icon, label, value, color, href });

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/campaigns').then(r => r.json()),
      fetch('/api/registrations').then(r => r.json()),
      fetch('/api/seva').then(r => r.json()),
    ]).then(([events, bookings, campaigns, regs, seva]) => {
      setStats({
        events:        Array.isArray(events)   ? events.length   : 0,
        bookings:      Array.isArray(bookings)  ? bookings.length  : 0,
        pendingBook:   Array.isArray(bookings)  ? bookings.filter(b => b.status === 'pending').length : 0,
        campaigns:     Array.isArray(campaigns) ? campaigns.length : 0,
        registrations: Array.isArray(regs)      ? regs.length      : 0,
        donations:     Array.isArray(seva)      ? seva.length      : 0,
        recentBookings:   Array.isArray(bookings) ? bookings.slice(0,5)  : [],
        recentRegs:       Array.isArray(regs)     ? regs.slice(0,5)      : [],
      });
    });
  }, []);

  const sty = {
    card: { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    h1:   { color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' },
    sub:  { color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginBottom: '2rem' },
    num:  { fontSize: '2rem', fontWeight: 800, marginBottom: '.25rem' },
    lbl:  { fontSize: '.78rem', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em' },
    th:   { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left' },
    td:   { padding: '.75rem 1rem', fontSize: '.85rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)' },
  };

  const statCards = [
    { icon: '🎪', label: 'Total Events',         value: stats?.events,        color: '#ed6800', href: '/admin/events'        },
    { icon: '🏨', label: 'Total Bookings',        value: stats?.bookings,      color: '#4488ff', href: '/admin/bookings'       },
    { icon: '⏳', label: 'Pending Bookings',      value: stats?.pendingBook,   color: '#ffaa00', href: '/admin/bookings'       },
    { icon: '📋', label: 'Event Registrations',   value: stats?.registrations, color: '#44cc88', href: '/admin/registrations'  },
    { icon: '🌸', label: 'Seva Campaigns',         value: stats?.campaigns,     color: '#cc44ff', href: '/admin/donations'      },
    { icon: '💰', label: 'Donation Requests',      value: stats?.donations,     color: '#ff6688', href: '/admin/donations'      },
  ];

  return (
    <div>
      <h1 style={sty.h1}>Dashboard</h1>
      <p style={sty.sub}>ISKCON Ayodhya Admin — Hare Krishna 🙏</p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ ...sty.card, cursor: 'pointer', transition: 'border-color .2s' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>{s.icon}</div>
              <div style={{ ...sty.num, color: s.color }}>{stats ? s.value : '—'}</div>
              <div style={sty.lbl}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={sty.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'white', fontWeight: 600, fontSize: '.95rem' }}>Recent Bookings</h3>
            <Link href="/admin/bookings" style={{ fontSize: '.75rem', color: '#ed6800', textDecoration: 'none' }}>View all →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={sty.th}>Name</th><th style={sty.th}>Room</th><th style={sty.th}>Status</th></tr></thead>
            <tbody>
              {stats?.recentBookings?.map(b => (
                <tr key={b.id}>
                  <td style={sty.td}>{b.name}</td>
                  <td style={sty.td}>{b.room_name}</td>
                  <td style={sty.td}>
                    <span style={{ padding: '.2rem .6rem', borderRadius: '2rem', fontSize: '.72rem', fontWeight: 600,
                      background: b.status==='confirmed' ? 'rgba(68,204,136,.15)' : b.status==='cancelled' ? 'rgba(255,80,80,.12)' : 'rgba(255,170,0,.12)',
                      color: b.status==='confirmed' ? '#44cc88' : b.status==='cancelled' ? '#ff7070' : '#ffaa00' }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!stats && <tr><td colSpan="3" style={{ ...sty.td, textAlign: 'center', color: '#555' }}>Loading...</td></tr>}
            </tbody>
          </table>
        </div>

        <div style={sty.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'white', fontWeight: 600, fontSize: '.95rem' }}>Recent Event Registrations</h3>
            <Link href="/admin/registrations" style={{ fontSize: '.75rem', color: '#ed6800', textDecoration: 'none' }}>View all →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={sty.th}>Name</th><th style={sty.th}>Event</th><th style={sty.th}>Guests</th></tr></thead>
            <tbody>
              {stats?.recentRegs?.map(r => (
                <tr key={r.id}>
                  <td style={sty.td}>{r.first_name} {r.last_name}</td>
                  <td style={sty.td} title={r.event_name}>{(r.event_name||'').substring(0,18)}</td>
                  <td style={sty.td}>{r.attendees}</td>
                </tr>
              ))}
              {!stats && <tr><td colSpan="3" style={{ ...sty.td, textAlign: 'center', color: '#555' }}>Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
