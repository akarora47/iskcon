'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const router = useRouter();
  const [form, setForm] = useState({ username: 'admin', password: '', confirmPassword: '', secret: '' });
  const [msg, setMsg]   = useState('');
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (form.password !== form.confirmPassword) { setErr('Passwords do not match!'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password, secret: form.secret }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Password set! Redirecting to login…');
        setTimeout(() => router.push('/admin/login'), 2000);
      } else {
        setErr(data.error || 'Something went wrong.');
      }
    } catch { setErr('Network error. Make sure the dev server is running.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'.75rem 1rem', borderRadius:'.75rem', border:'1.5px solid rgba(237,104,0,.3)', background:'rgba(255,255,255,.05)', color:'white', fontSize:'.9rem', outline:'none', boxSizing:'border-box', fontFamily:'sans-serif' };
  const lbl = { display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,.5)', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.07em' };

  return (
    <div style={{ margin:0, minHeight:'100vh', background:'#0a0400', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'system-ui,sans-serif' }}>
        <div style={{ width:'100%', maxWidth:'440px' }}>
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🛕</div>
            <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, margin:0 }}>Admin Setup</h1>
            <p style={{ color:'rgba(255,255,255,.4)', fontSize:'.85rem', marginTop:'.5rem' }}>Set your admin password — one time only</p>
          </div>

          <div style={{ background:'#1a0d00', border:'1px solid rgba(237,104,0,.2)', borderRadius:'1.25rem', padding:'2rem' }}>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lbl}>Setup Secret Key *</label>
                <input style={inp} type="password" placeholder="Value of SETUP_SECRET in .env.local" value={form.secret} onChange={set('secret')} required />
                <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginTop:'.4rem' }}>
                  Default: <code style={{ color:'#ed6800' }}>iskcon-setup-secret-2024</code>
                </p>
              </div>
              <div>
                <label style={lbl}>Admin Username *</label>
                <input style={inp} type="text" value={form.username} onChange={set('username')} required />
              </div>
              <div>
                <label style={lbl}>New Password *</label>
                <input style={inp} type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
              </div>
              <div>
                <label style={lbl}>Confirm Password *</label>
                <input style={inp} type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>

              {err && <p style={{ color:'#ff7070', fontSize:'.85rem', background:'rgba(255,80,80,.1)', border:'1px solid rgba(255,80,80,.2)', borderRadius:'.5rem', padding:'.6rem .9rem', margin:0 }}>{err}</p>}
              {msg && <p style={{ color:'#44cc88', fontSize:'.85rem', background:'rgba(68,204,136,.1)', border:'1px solid rgba(68,204,136,.2)', borderRadius:'.5rem', padding:'.6rem .9rem', margin:0 }}>{msg}</p>}

              <button type="submit" disabled={loading} style={{ padding:'.85rem', borderRadius:'.875rem', border:'none', background: loading ? '#555' : 'linear-gradient(135deg,#ed6800,#c85000)', color:'white', fontWeight:700, fontSize:'.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Setting up…' : '🔐 Set Admin Password'}
              </button>
            </form>
          </div>

          <p style={{ color:'rgba(255,255,255,.2)', fontSize:'.75rem', textAlign:'center', marginTop:'1.5rem' }}>
            Delete <code>/src/app/setup</code> folder after setting password.
          </p>
        </div>
    </div>
  );
}
