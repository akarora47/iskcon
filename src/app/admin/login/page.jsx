'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
      router.push('/admin');
    } catch { setError('Connection error'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0700', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛕</div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '.35rem' }}>ISKCON Ayodhya</h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.88rem' }}>Admin Panel — Hare Krishna 🙏</p>
        </div>
        <div style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.25)', borderRadius: '1.25rem', padding: '2.5rem' }}>
          {error && <div style={{ background: 'rgba(255,50,50,.1)', border: '1px solid rgba(255,50,50,.3)', borderRadius: '.75rem', padding: '.875rem 1rem', marginBottom: '1.25rem', color: '#ff7070', fontSize: '.85rem' }}>⚠ {error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.4rem' }}>Username</label>
              <input required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(237,104,0,.2)', borderRadius: '.75rem', padding: '.8rem 1rem', color: 'white', fontSize: '.9rem', boxSizing: 'border-box' }}
                placeholder="admin" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.4rem' }}>Password</label>
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(237,104,0,.2)', borderRadius: '.75rem', padding: '.8rem 1rem', color: 'white', fontSize: '.9rem', boxSizing: 'border-box' }}
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '.9rem', background: loading ? '#555' : 'linear-gradient(135deg,#c45500,#ed6800)', border: 'none', borderRadius: '.875rem', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Logging in...' : '🔐 Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
