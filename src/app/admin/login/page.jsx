'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const iStyle = { width:'100%', background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(237,104,0,.2)', borderRadius:'.75rem', padding:'.8rem 1rem', color:'white', fontSize:'.9rem', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };
const lStyle = { display:'block', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.4rem' };
const errBox = { background:'rgba(255,50,50,.1)', border:'1px solid rgba(255,50,50,.3)', borderRadius:'.75rem', padding:'.875rem 1rem', marginBottom:'1.25rem', color:'#ff7070', fontSize:'.85rem' };
const okBox  = { background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.25)', borderRadius:'.75rem', padding:'.875rem 1rem', marginBottom:'1.25rem', color:'#4ade80', fontSize:'.85rem' };

export default function AdminLogin() {
  const [step,    setStep]    = useState('login');
  const [form,    setForm]    = useState({ email:'', password:'', otp:'', newPassword:'', confirmPassword:'' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const btnStyle = (dis) => ({ width:'100%', padding:'.9rem', background: dis ? '#555' : 'linear-gradient(135deg,#c45500,#ed6800)', border:'none', borderRadius:'.875rem', color:'white', fontWeight:700, fontSize:'1rem', cursor: dis ? 'not-allowed' : 'pointer' });
  const linkBtn  = (text, onClick) => (
    <button type="button" onClick={onClick}
      style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', fontSize:'.82rem', cursor:'pointer', textDecoration:'underline', textAlign:'center', width:'100%' }}>
      {text}
    </button>
  );

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: form.email, password: form.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); }
      else router.push('/admin');
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/admin/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: form.email }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); }
      else { setSuccess('OTP sent to ' + form.email); setStep('otp'); }
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/admin/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: form.email, otp: form.otp }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid OTP'); }
      else { setSuccess('OTP verified. Set your new password.'); setStep('reset'); }
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/admin/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.newPassword }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); }
      else {
        setSuccess('Password updated! Please login with your new password.');
        setTimeout(() => { setStep('login'); setSuccess(''); setError(''); setForm(f => ({ ...f, password:'', otp:'', newPassword:'', confirmPassword:'' })); }, 2500);
      }
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  const stepTitle = { login:'Login', forgot:'Forgot Password', otp:'Enter OTP', reset:'Set New Password' };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0700', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🛕</div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:'1.5rem', fontWeight:700, color:'white', marginBottom:'.35rem' }}>ISKCON Ayodhya</h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.88rem' }}>Admin Panel</p>
        </div>

        <div style={{ background:'#1a0d00', border:'1px solid rgba(237,104,0,.25)', borderRadius:'1.25rem', padding:'2.5rem' }}>
          <h2 style={{ color:'#ed6800', fontSize:'1rem', fontWeight:700, marginBottom:'1.5rem', textAlign:'center' }}>
            {stepTitle[step]}
          </h2>

          {error   && <div style={errBox}>⚠ {error}</div>}
          {success && <div style={okBox}>✓ {success}</div>}

          {step === 'login' && (
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lStyle}>Email Address</label>
                <input required type="email" value={form.email} onChange={set('email')} style={iStyle} placeholder="info@iskconayodhya.com" />
              </div>
              <div>
                <label style={lStyle}>Password</label>
                <input required type="password" value={form.password} onChange={set('password')} style={iStyle} placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Logging in…' : '🔐 Login'}
              </button>
              {linkBtn('Forgot Password?', () => { setStep('forgot'); setError(''); setSuccess(''); })}
            </form>
          )}

          {step === 'forgot' && (
            <form onSubmit={handleForgot} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lStyle}>Admin Email Address</label>
                <input required type="email" value={form.email} onChange={set('email')} style={iStyle} placeholder="info@iskconayodhya.com" />
              </div>
              <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.35)', margin:0 }}>A 6-digit OTP will be sent to your email. Valid for 10 minutes.</p>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Sending…' : '📧 Send OTP'}
              </button>
              {linkBtn('← Back to Login', () => { setStep('login'); setError(''); setSuccess(''); })}
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)', margin:0, textAlign:'center' }}>
                OTP sent to <strong style={{ color:'rgba(255,255,255,.8)' }}>{form.email}</strong>
              </p>
              <div>
                <label style={lStyle}>6-Digit OTP</label>
                <input required type="text" inputMode="numeric" maxLength={6} value={form.otp} onChange={set('otp')} style={{ ...iStyle, fontSize:'1.8rem', letterSpacing:'.5em', textAlign:'center' }} placeholder="000000" />
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Verifying…' : '✓ Verify OTP'}
              </button>
              {linkBtn('Resend OTP', handleForgot)}
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <label style={lStyle}>New Password</label>
                <input required type="password" value={form.newPassword} onChange={set('newPassword')} style={iStyle} placeholder="Min 6 characters" />
              </div>
              <div>
                <label style={lStyle}>Confirm New Password</label>
                <input required type="password" value={form.confirmPassword} onChange={set('confirmPassword')} style={iStyle} placeholder="Re-enter password" />
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? '⏳ Updating…' : '🔑 Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
