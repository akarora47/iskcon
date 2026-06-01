'use client';
import { useState, useEffect } from 'react';
import ImageUpload from '../(panel)/ImageUpload';
import { useToast, ToastContainer } from '../(panel)/Toast';

const iS = { width:'100%', background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(237,104,0,.2)', borderRadius:'.75rem', padding:'.75rem 1rem', color:'white', fontSize:'.88rem', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };
const lS = { display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.4rem' };
const card = { background:'#1a0d00', border:'1px solid rgba(237,104,0,.2)', borderRadius:'1rem', padding:'1.75rem', marginBottom:'1.25rem' };
const TABS = ['Page Content', 'Applications', 'Donations'];

export default function AdminLifeMembership() {
  const [tab, setTab]           = useState('Page Content');
  const [settings, setSettings] = useState({});
  const [benefits, setBenefits] = useState([]);
  const [apps,     setApps]     = useState([]);
  const [dons,     setDons]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  // benefit inline form
  const [newBenefit, setNewBenefit]   = useState({ title:'', description:'', icon:'✦', image:'' });
  const [editBenefit, setEditBenefit] = useState(null);
  // donation amounts raw input
  const [amountsInput, setAmountsInput] = useState('');
  const { toasts, success, error, remove } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [main, appRes, donRes] = await Promise.all([
        fetch('/api/admin/life-membership').then(r => r.json()),
        fetch('/api/admin/life-membership/applications').then(r => r.json()),
        fetch('/api/admin/life-membership/donations').then(r => r.json()),
      ]);
      setSettings(main.settings || {});
      setBenefits(main.benefits || []);
      setApps(Array.isArray(appRes) ? appRes : []);
      setDons(Array.isArray(donRes) ? donRes : []);
      const amounts = main.settings?.donation_suggested_amounts;
      setAmountsInput(Array.isArray(amounts) ? amounts.join(',') : '');
    } catch(e) { error('Failed to load: ' + e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sset = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const saveAll = async () => {
    setSaving(true);
    try {
      const amounts = amountsInput.split(',').map(v => Number(v.trim())).filter(Boolean);
      const res = await fetch('/api/admin/life-membership', {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...settings, donation_suggested_amounts: amounts }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      success('Saved successfully!');
    } catch(e) { error(e.message); }
    setSaving(false);
  };

  // Benefits
  const addBenefit = async () => {
    if (!newBenefit.title.trim()) return error('Title required');
    await fetch('/api/admin/life-membership/benefits', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newBenefit) });
    success('Benefit added!'); setNewBenefit({ title:'', description:'', icon:'✦', image:'' }); load();
  };
  const saveBenefit = async () => {
    if (!editBenefit) return;
    await fetch('/api/admin/life-membership/benefits', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(editBenefit) });
    success('Updated!'); setEditBenefit(null); load();
  };
  const deleteBenefit = async (id) => {
    if (!confirm('Delete this benefit?')) return;
    await fetch('/api/admin/life-membership/benefits', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) });
    success('Deleted.'); load();
  };


  if (loading) return <p style={{ color:'rgba(255,255,255,.4)', padding:'3rem', textAlign:'center' }}>Loading…</p>;

  return (
    <div style={{ maxWidth:'960px' }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ color:'white', fontSize:'1.4rem', fontWeight:700, margin:0 }}>🌸 Life Membership</h1>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.82rem', marginTop:'.3rem' }}>Manage your Life Membership page</p>
        </div>
        <a href="/life-membership" target="_blank" rel="noreferrer" style={{ padding:'.5rem 1rem', borderRadius:'.75rem', background:'rgba(237,104,0,.1)', color:'#ed6800', fontSize:'.8rem', fontWeight:600, textDecoration:'none' }}>
          🔗 View Page
        </a>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'.4rem', background:'rgba(255,255,255,.04)', borderRadius:'1rem', padding:'.3rem', marginBottom:'1.75rem' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'.6rem .5rem', borderRadius:'.75rem', border:'none', cursor:'pointer', background:tab===t?'linear-gradient(135deg,#c45500,#ed6800)':'transparent', color:tab===t?'white':'rgba(255,255,255,.45)', fontWeight:tab===t?700:400, fontSize:'.82rem', transition:'all .2s' }}>
            {t}{t==='Applications'&&apps.length>0?` (${apps.length})`:''}{t==='Donations'&&dons.length>0?` (${dons.length})`:'' }
          </button>
        ))}
      </div>

      {/* ══ PAGE CONTENT TAB ══ */}
      {tab === 'Page Content' && (
        <>
          {/* Hero & Basic Info */}
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Hero Section</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Page Title</label><input style={iS} value={settings.page_title||''} onChange={e=>sset('page_title',e.target.value)} placeholder="Life Membership — ISKCON Ayodhya" /></div>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Hero Subtitle</label><textarea rows={2} style={{ ...iS, resize:'vertical' }} value={settings.hero_subtitle||''} onChange={e=>sset('hero_subtitle',e.target.value)} placeholder="A short tagline under the title" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lS}>Member CTA Button</label><input style={iS} value={settings.cta_member_text||''} onChange={e=>sset('cta_member_text',e.target.value)} placeholder="Become a Life Member" /></div>
              <div><label style={lS}>Donate CTA Button</label><input style={iS} value={settings.cta_donate_text||''} onChange={e=>sset('cta_donate_text',e.target.value)} placeholder="Donate Now" /></div>
            </div>
            <ImageUpload value={settings.banner_image||''} onChange={v=>sset('banner_image',v)} label="Banner / Hero Image" />
          </div>

          {/* About */}
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>About Section</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Section Title</label><input style={iS} value={settings.about_title||''} onChange={e=>sset('about_title',e.target.value)} placeholder="About Life Membership" /></div>
            <div><label style={lS}>Content</label><textarea rows={7} style={{ ...iS, resize:'vertical', minHeight:'130px' }} value={settings.about_content||''} onChange={e=>sset('about_content',e.target.value)} placeholder="Describe the purpose and spiritual value of Life Membership…" /></div>
          </div>

          {/* Membership settings */}
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Membership & Donation Settings</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1.25rem' }}>
              <div>
                <label style={lS}>Membership Fee (₹)</label>
                <input type="number" style={iS} value={settings.membership_fee||100000} onChange={e=>sset('membership_fee',Number(e.target.value))} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:'.2rem' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'.6rem', color:'rgba(255,255,255,.65)', fontSize:'.88rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={settings.membership_enabled !== 0} onChange={e=>sset('membership_enabled',e.target.checked?1:0)} style={{ accentColor:'#ed6800', width:'1rem', height:'1rem' }} />
                  Show Membership Form on website
                </label>
              </div>
            </div>
            <div style={{ background:'rgba(237,104,0,.07)', border:'1px solid rgba(237,104,0,.18)', borderRadius:'.75rem', padding:'1rem', marginBottom:'1.25rem' }}>
              <p style={{ color:'#ed6800', fontSize:'.82rem', fontWeight:700, margin:'0 0 .2rem' }}>Fee: ₹{Number(settings.membership_fee||100000).toLocaleString('en-IN')}</p>
              <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.75rem', margin:0 }}>80G receipt · Certificate dispatched within 15 days</p>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lS}>Donation Suggested Amounts <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)' }}>(comma-separated ₹)</span></label>
              <input style={iS} value={amountsInput} onChange={e=>setAmountsInput(e.target.value)} placeholder="1001,2100,5100,11000,21000" />
            </div>
            <div><label style={lS}>Donation Section CTA Text</label><input style={iS} value={settings.donation_cta_text||''} onChange={e=>sset('donation_cta_text',e.target.value)} placeholder="Support Our Mission" /></div>
          </div>

          {/* Benefits */}
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Member Benefits</h3>

            {/* Add / edit form */}
            <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(237,104,0,.12)', borderRadius:'.875rem', padding:'1.25rem', marginBottom:'1.25rem' }}>
              <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.875rem', marginTop:0 }}>
                {editBenefit ? 'Edit Benefit' : '+ Add New Benefit'}
              </p>
              {(() => {
                const b  = editBenefit || newBenefit;
                const sb = editBenefit
                  ? (k,v) => setEditBenefit(x => ({...x,[k]:v}))
                  : (k,v) => setNewBenefit(x => ({...x,[k]:v}));
                return (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 80px', gap:'.75rem', marginBottom:'.75rem' }}>
                      <div><label style={lS}>Title *</label><input style={iS} value={b.title} onChange={e=>sb('title',e.target.value)} placeholder="e.g. Temple Privileges" /></div>
                      <div><label style={lS}>Icon</label><input style={{ ...iS, textAlign:'center', fontSize:'1.2rem' }} value={b.icon||'✦'} onChange={e=>sb('icon',e.target.value)} /></div>
                    </div>
                    <div style={{ marginBottom:'.75rem' }}>
                      <label style={lS}>Description</label>
                      <textarea rows={2} style={{ ...iS, resize:'vertical' }} value={b.description||''} onChange={e=>sb('description',e.target.value)} placeholder="Short description of this benefit" />
                    </div>
                    <div style={{ marginBottom:'.875rem' }}>
                      <ImageUpload value={b.image||''} onChange={v=>sb('image',v)} label="Benefit Image (optional)" />
                    </div>
                    <div style={{ display:'flex', gap:'.6rem' }}>
                      <button onClick={editBenefit ? saveBenefit : addBenefit}
                        style={{ padding:'.6rem 1.4rem', borderRadius:'.75rem', border:'none', background:'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor:'pointer', fontSize:'.85rem' }}>
                        {editBenefit ? '💾 Save' : '+ Add Benefit'}
                      </button>
                      {editBenefit && (
                        <button onClick={() => setEditBenefit(null)}
                          style={{ padding:'.6rem 1.1rem', borderRadius:'.75rem', border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'rgba(255,255,255,.45)', cursor:'pointer', fontSize:'.85rem' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Benefits list */}
            {benefits.length === 0
              ? <p style={{ color:'rgba(255,255,255,.25)', fontSize:'.85rem', fontStyle:'italic' }}>No benefits added yet. Use the form above to add some.</p>
              : (
                <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                  {benefits.map(b => (
                    <div key={b.id} style={{ display:'flex', gap:'1rem', alignItems:'center', background:'rgba(255,255,255,.03)', borderRadius:'.75rem', padding:'.75rem 1rem', border:'1px solid rgba(237,104,0,.08)' }}>
                      {b.image
                        ? <img src={b.image} alt="" style={{ width:'2.75rem', height:'2.75rem', objectFit:'cover', borderRadius:'.5rem', flexShrink:0 }} />
                        : <span style={{ fontSize:'1.4rem', flexShrink:0, width:'2.75rem', textAlign:'center' }}>{b.icon||'✦'}</span>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ color:'white', fontWeight:600, fontSize:'.88rem', margin:0 }}>{b.title}</p>
                        {b.description && <p style={{ color:'rgba(255,255,255,.38)', fontSize:'.76rem', margin:'.1rem 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.description}</p>}
                      </div>
                      <div style={{ display:'flex', gap:'.4rem', flexShrink:0 }}>
                        <button onClick={() => setEditBenefit({...b})} style={{ padding:'.35rem .75rem', borderRadius:'.6rem', background:'rgba(237,104,0,.12)', color:'#ed6800', border:'none', cursor:'pointer', fontSize:'.78rem' }}>✏️ Edit</button>
                        <button onClick={() => deleteBenefit(b.id)} style={{ padding:'.35rem .65rem', borderRadius:'.6rem', background:'rgba(255,80,80,.08)', color:'#f87171', border:'1px solid rgba(255,80,80,.18)', cursor:'pointer', fontSize:'.78rem' }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          {/* SEO */}
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>SEO</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Meta Title</label><input style={iS} value={settings.meta_title||''} onChange={e=>sset('meta_title',e.target.value)} placeholder="Life Membership | ISKCON Ayodhya" /></div>
            <div><label style={lS}>Meta Description <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)' }}>(max 160 chars)</span></label><textarea rows={2} style={{ ...iS, resize:'vertical' }} value={settings.meta_description||''} onChange={e=>sset('meta_description',e.target.value)} maxLength={160} /></div>
          </div>

          {/* Save button */}
          <button onClick={saveAll} disabled={saving}
            style={{ width:'100%', padding:'1rem', borderRadius:'.875rem', border:'none', background:saving?'rgba(237,104,0,.4)':'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, fontSize:'1rem', cursor:saving?'not-allowed':'pointer', letterSpacing:'.01em' }}>
            {saving ? '⏳ Saving…' : '💾 Save All Changes'}
          </button>
        </>
      )}

      {/* ══ APPLICATIONS TAB ══ */}
      {tab === 'Applications' && (
        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', margin:0 }}>
              Life Membership Applications
            </h3>
            <span style={{ background:'rgba(237,104,0,.12)', color:'#ed6800', fontSize:'.75rem', fontWeight:700, padding:'.25rem .75rem', borderRadius:'2rem' }}>{apps.length} total</span>
          </div>
          {apps.length === 0
            ? (
              <div style={{ textAlign:'center', padding:'3rem 0' }}>
                <p style={{ fontSize:'2rem', marginBottom:'.75rem' }}>🌸</p>
                <p style={{ color:'rgba(255,255,255,.3)', fontSize:'.9rem' }}>No applications yet.</p>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Name','Email','Phone','City / State','Amount','Payment ID','Date'].map(h => (
                        <th key={h} style={{ padding:'.7rem .875rem', fontSize:'.7rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.07em', borderBottom:'1px solid rgba(237,104,0,.12)', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map(a => (
                      <tr key={a.id} style={{ borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                        <td style={{ padding:'.7rem .875rem', color:'white', fontSize:'.85rem', fontWeight:600 }}>{a.full_name}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.6)', fontSize:'.82rem' }}>{a.email}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.6)', fontSize:'.82rem' }}>{a.phone}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.5)', fontSize:'.82rem' }}>{[a.city,a.state].filter(Boolean).join(', ')||'—'}</td>
                        <td style={{ padding:'.7rem .875rem', color:'#4ade80', fontSize:'.85rem', fontWeight:700 }}>₹{Number(a.amount||0).toLocaleString('en-IN')}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.3)', fontSize:'.72rem', fontFamily:'monospace' }}>{a.razorpay_payment_id?.slice(-12)||'—'}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.35)', fontSize:'.78rem', whiteSpace:'nowrap' }}>{a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}

      {/* ══ DONATIONS TAB ══ */}
      {tab === 'Donations' && (
        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', margin:0 }}>
              Donations
            </h3>
            <span style={{ background:'rgba(237,104,0,.12)', color:'#ed6800', fontSize:'.75rem', fontWeight:700, padding:'.25rem .75rem', borderRadius:'2rem' }}>{dons.length} total</span>
          </div>
          {dons.length === 0
            ? (
              <div style={{ textAlign:'center', padding:'3rem 0' }}>
                <p style={{ fontSize:'2rem', marginBottom:'.75rem' }}>🙏</p>
                <p style={{ color:'rgba(255,255,255,.3)', fontSize:'.9rem' }}>No donations yet.</p>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Name','Email','Phone','Amount','Message','Payment ID','Date'].map(h => (
                        <th key={h} style={{ padding:'.7rem .875rem', fontSize:'.7rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.07em', borderBottom:'1px solid rgba(237,104,0,.12)', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dons.map(d => (
                      <tr key={d.id} style={{ borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                        <td style={{ padding:'.7rem .875rem', color:'white', fontSize:'.85rem', fontWeight:600 }}>{d.full_name}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.6)', fontSize:'.82rem' }}>{d.email}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.6)', fontSize:'.82rem' }}>{d.phone}</td>
                        <td style={{ padding:'.7rem .875rem', color:'#4ade80', fontSize:'.85rem', fontWeight:700 }}>₹{Number(d.amount||0).toLocaleString('en-IN')}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.4)', fontSize:'.82rem', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.message||'—'}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.3)', fontSize:'.72rem', fontFamily:'monospace' }}>{d.razorpay_payment_id?.slice(-12)||'—'}</td>
                        <td style={{ padding:'.7rem .875rem', color:'rgba(255,255,255,.35)', fontSize:'.78rem', whiteSpace:'nowrap' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
