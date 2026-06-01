'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin',              label: 'Dashboard',      icon: '📊' },
  { href: '/admin/events',       label: 'Events',         icon: '🎪' },
  { href: '/admin/registrations',label: 'Registrations',  icon: '📋' },
  { href: '/admin/bookings',     label: 'Bookings',       icon: '🏨' },
  { href: '/admin/rooms',        label: 'Rooms',          icon: '🛏️' },
  { href: '/admin/donations',    label: 'Donations',      icon: '🌸' },
  { href: '/admin/inquiries',    label: 'Inquiries',      icon: '✉️' },
  { href: '/admin/popup',           label: 'Event Popup',    icon: '🎯' },
  { href: '/admin/temple-projects',  label: 'Temple Project',   icon: '🛕' },
  // { href: '/admin/life-membership',  label: 'Life Membership',  icon: '🌸' }, // uncomment to enable
];

export default function AdminSidebar({ adminName }) {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside style={{ width: '240px', background: '#0f0700', borderRight: '1px solid rgba(237,104,0,.15)', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(237,104,0,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ fontSize: '2rem' }}>🛕</div>
          <div>
            <p style={{ fontWeight: 700, color: 'white', fontSize: '.9rem', margin: 0 }}>ISKCON Ayodhya</p>
            <p style={{ color: '#ed6800', fontSize: '.72rem', margin: 0 }}>Admin Panel</p>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', marginTop: '1rem', marginBottom: 0 }}>👤 {adminName}</p>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '.875rem',
              padding: '.75rem 1.5rem', textDecoration: 'none',
              background: active ? 'rgba(237,104,0,.12)' : 'transparent',
              borderLeft: active ? '3px solid #ed6800' : '3px solid transparent',
              color: active ? '#ed6800' : 'rgba(255,255,255,.6)',
              fontSize: '.88rem', fontWeight: active ? 600 : 400,
              transition: 'all .2s',
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(237,104,0,.1)' }}>
        <Link href="/" target="_blank" style={{ display: 'block', textAlign: 'center', padding: '.6rem', borderRadius: '.75rem', background: 'rgba(237,104,0,.08)', color: '#ed6800', textDecoration: 'none', fontSize: '.8rem', marginBottom: '.75rem' }}>
          🌐 View Website
        </Link>
        <button onClick={logout} style={{ width: '100%', padding: '.6rem', borderRadius: '.75rem', border: '1px solid rgba(255,80,80,.2)', background: 'rgba(255,80,80,.06)', color: '#ff7070', fontSize: '.8rem', cursor: 'pointer' }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
