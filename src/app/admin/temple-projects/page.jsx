'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast, ToastContainer } from '../(panel)/Toast';
import ImageUpload from '../(panel)/ImageUpload';

const iStyle = { width:'100%', background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(237,104,0,.2)', borderRadius:'.75rem', padding:'.75rem 1rem', color:'white', fontSize:'.88rem', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };
const lStyle = { display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.4rem' };
const card   = { background:'#1a0d00', border:'1px solid rgba(237,104,0,.2)', borderRadius:'1rem', padding:'1.75rem', marginBottom:'1.25rem' };

const EMPTY = { title:'', subtitle:'', location:'', description:'', construction_status:'In Progress', banner_image:'', goal_amount:'', status:'published', featured:false };

const STATUS_COLOR = {
  'In Progress':{ bg:'rgba(237,104,0,.12)', color:'#c45500' },
  'Completed':  { bg:'rgba(34,197,94,.1)',  color:'#16a34a' },
  'Planning':   { bg:'rgba(99,102,241,.1)', color:'#6366f1' },
  'Foundation': { bg:'rgba(234,179,8,.1)',  color:'#b45309' },
  'Upcoming':   { bg:'rgba(168,85,247,.1)', color:'#9333ea' },
};

export default function AdminTempleProjects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [statsRows, setStatsRows] = useState([]); // [{key:'',value:''}]
  const { toasts, success, error, remove } = useToast();

  const load = async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/admin/temple-projects');
      const d   = await res.json();
      if (!res.ok) { setApiError(d.error || `Server error ${res.status}`); setProjects([]); }
      else          setProjects(Array.isArray(d) ? d : []);
    } catch (e) {
      setApiError('Network error: ' + e.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const statsObj = Object.fromEntries(statsRows.filter(r=>r.key.trim()).map(r=>[r.key.trim(),r.value.trim()]));
      const res  = await fetch('/api/admin/temple-projects', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...form, stats: statsObj }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      success('Project created!');
      setShowForm(false);
      setForm(EMPTY);
      setStatsRows([]);
      load();
    } catch (e) { error(e.message); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (p) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/temple-projects/${p.id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...p, status: newStatus, stats: p.stats || {}, construction_updates: p.construction_updates || [] }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      success(newStatus === 'published' ? 'Published!' : 'Unpublished!');
      load();
    } catch (e) { error(e.message); }
  };

  const deleteProject = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/temple-projects/${p.id}`, { method:'DELETE' });
      success('Deleted.');
      load();
    } catch (e) { error(e.message); }
  };

  return (
    <div style={{ maxWidth:'1000px' }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ color:'white', fontSize:'1.4rem', fontWeight:700, margin:0 }}>🛕 Temple Projects</h1>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.82rem', marginTop:'.3rem' }}>Manage temple construction project pages</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'.65rem 1.4rem', borderRadius:'.875rem', border:'none', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor:'pointer', fontSize:'.88rem' }}>
          {showForm ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {/* API error banner */}
      {apiError && (
        <div style={{ background:'rgba(229,62,62,.08)', border:'1px solid rgba(229,62,62,.25)', borderRadius:'.875rem', padding:'1rem 1.25rem', marginBottom:'1.25rem' }}>
          <p style={{ color:'#f87171', fontSize:'.85rem', margin:0 }}>
            ⚠ {apiError}
            {apiError.includes("doesn't exist") && (
              <span style={{ color:'rgba(255,255,255,.45)', display:'block', marginTop:'.35rem', fontSize:'.78rem' }}>
                The database table is missing. Please run <strong>temple_project_tables.sql</strong> in phpMyAdmin first.
              </span>
            )}
          </p>
          <button onClick={load} style={{ marginTop:'.75rem', padding:'.4rem 1rem', borderRadius:'.5rem', border:'1px solid rgba(229,62,62,.3)', background:'transparent', color:'#f87171', fontSize:'.78rem', cursor:'pointer' }}>
            ↺ Retry
          </button>
        </div>
      )}

      {/* New project form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ ...card, marginBottom:'2rem' }}>
          <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Create New Project</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            <div><label style={lStyle}>Project Name *</label><input required style={iStyle} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="New ISKCON Temple — Ayodhya" /></div>
            <div><label style={lStyle}>Location</label><input style={iStyle} value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Ayodhya, Uttar Pradesh" /></div>
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lStyle}>Short Description</label>
            <textarea rows={3} style={{ ...iStyle, resize:'vertical', minHeight:'70px' }} value={form.description} onChange={e=>set('description',e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <ImageUpload value={form.banner_image} onChange={v=>set('banner_image',v)} label="Banner Image" />
            </div>
            <div>
              <label style={lStyle}>Construction Status</label>
              <select style={{ ...iStyle, cursor:'pointer' }} value={form.construction_status} onChange={e=>set('construction_status',e.target.value)}>
                {['In Progress','Planning','Foundation','Upcoming','Completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={lStyle}>Goal Amount (₹)</label><input type="number" style={iStyle} value={form.goal_amount} onChange={e=>set('goal_amount',e.target.value)} placeholder="50000000" /></div>
            <div>
              <label style={lStyle}>Status</label>
              <select style={{ ...iStyle, cursor:'pointer' }} value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Stats — user-friendly key-value rows */}
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.6rem' }}>
              <label style={{ ...lStyle, marginBottom:0 }}>Project Stats <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)', fontSize:'.7rem' }}>(badges shown on the project page)</span></label>
              <button type="button" onClick={()=>setStatsRows(r=>[...r,{key:'',value:''}])}
                style={{ padding:'.28rem .75rem', borderRadius:'.5rem', border:'none', background:'rgba(237,104,0,.18)', color:'#ed6800', fontWeight:700, cursor:'pointer', fontSize:'.75rem' }}>
                + Add Stat
              </button>
            </div>
            {statsRows.length === 0 && (
              <p style={{ color:'rgba(255,255,255,.22)', fontSize:'.78rem', fontStyle:'italic' }}>Optional — e.g. "Construction: 45%", "Devotees: 5000+"</p>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
              {statsRows.map((row,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'.5rem', alignItems:'center' }}>
                  <input style={iStyle} value={row.key} onChange={e=>setStatsRows(r=>r.map((x,j)=>j===i?{...x,key:e.target.value}:x))} placeholder="e.g. Construction" />
                  <input style={iStyle} value={row.value} onChange={e=>setStatsRows(r=>r.map((x,j)=>j===i?{...x,value:e.target.value}:x))} placeholder="e.g. 45%" />
                  <button type="button" onClick={()=>setStatsRows(r=>r.filter((_,j)=>j!==i))}
                    style={{ padding:'.5rem .65rem', borderRadius:'.6rem', border:'1px solid rgba(255,80,80,.25)', background:'transparent', color:'#f87171', cursor:'pointer', fontSize:'.8rem' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <label style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'rgba(255,255,255,.6)', fontSize:'.88rem', cursor:'pointer', marginBottom:'1rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} />
            Featured Project (shown first)
          </label>
          <button type="submit" disabled={saving} style={{ padding:'.75rem 2rem', borderRadius:'.875rem', border:'none', background: saving ? 'rgba(237,104,0,.4)':'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor: saving ? 'not-allowed':'pointer', fontSize:'.9rem' }}>
            {saving ? '⏳ Creating…' : '✓ Create Project'}
          </button>
        </form>
      )}

      {/* Project list */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem 0' }}>
          <div style={{ fontSize:'2rem', marginBottom:'1rem', opacity:.5 }}>🛕</div>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.9rem' }}>Loading projects…</p>
        </div>
      ) : !apiError && projects.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'3rem' }}>
          <p style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🛕</p>
          <p style={{ color:'rgba(255,255,255,.4)', marginBottom:'1.25rem' }}>No temple projects yet.</p>
          <button onClick={() => setShowForm(true)} style={{ padding:'.65rem 1.5rem', borderRadius:'.875rem', border:'none', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor:'pointer' }}>+ Create First Project</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {projects.map(p => {
            const sc = STATUS_COLOR[p.construction_status] || STATUS_COLOR['In Progress'];
            const raised = Number(p.raised_amount) || 0;
            const goal   = Number(p.goal_amount)   || 0;
            const pct    = goal > 0 ? Math.min(100, Math.round(raised/goal*100)) : 0;
            return (
              <div key={p.id} style={{ ...card, marginBottom:0, display:'flex', gap:'1.25rem', alignItems:'center', flexWrap:'wrap' }}>
                {p.banner_image
                  ? <img src={p.banner_image} alt={p.title} style={{ width:'80px', height:'60px', objectFit:'cover', borderRadius:'.75rem', flexShrink:0 }} />
                  : <div style={{ width:'80px', height:'60px', borderRadius:'.75rem', background:'rgba(237,104,0,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🛕</div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.6rem', flexWrap:'wrap', marginBottom:'.25rem' }}>
                    <h3 style={{ color:'white', fontSize:'.95rem', fontWeight:700, margin:0 }}>{p.title}</h3>
                    {p.featured ? <span style={{ background:'rgba(212,175,55,.15)', color:'#d4af37', fontSize:'.62rem', fontWeight:700, padding:'.15rem .6rem', borderRadius:'2rem' }}>★ Featured</span> : null}
                    <span style={{ background:sc.bg, color:sc.color, fontSize:'.62rem', fontWeight:700, padding:'.15rem .6rem', borderRadius:'2rem' }}>{p.construction_status || 'In Progress'}</span>
                    <span style={{ background:p.status==='published'?'rgba(34,197,94,.12)':'rgba(255,80,80,.1)', color:p.status==='published'?'#4ade80':'#f87171', fontSize:'.62rem', fontWeight:700, padding:'.15rem .6rem', borderRadius:'2rem' }}>{p.status}</span>
                  </div>
                  {goal > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                      <p style={{ color:'rgba(255,255,255,.4)', fontSize:'.75rem', margin:0 }}>₹{raised.toLocaleString('en-IN')} / ₹{goal.toLocaleString('en-IN')}</p>
                      <div style={{ width:'80px', background:'rgba(255,255,255,.08)', borderRadius:'2rem', height:'.4rem', overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', background:'#ed6800', borderRadius:'2rem' }} />
                      </div>
                      <span style={{ color:'#ed6800', fontSize:'.72rem', fontWeight:700 }}>{pct}%</span>
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap', flexShrink:0 }}>
                  <Link href={`/admin/temple-projects/${p.id}`} style={{ padding:'.5rem 1rem', borderRadius:'.75rem', background:'rgba(237,104,0,.12)', color:'#ed6800', fontSize:'.8rem', fontWeight:600, textDecoration:'none' }}>✏️ Edit</Link>
                  <button onClick={() => toggleStatus(p)} style={{ padding:'.5rem 1rem', borderRadius:'.75rem', border:'none', background:p.status==='published'?'rgba(255,80,80,.1)':'rgba(34,197,94,.1)', color:p.status==='published'?'#f87171':'#4ade80', fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>
                    {p.status==='published'?'⏸ Unpublish':'▶ Publish'}
                  </button>
                  <button onClick={() => deleteProject(p)} style={{ padding:'.5rem 1rem', borderRadius:'.75rem', border:'1px solid rgba(255,80,80,.2)', background:'transparent', color:'#f87171', fontSize:'.8rem', fontWeight:600, cursor:'pointer' }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
