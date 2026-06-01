'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ImageUpload from '../../(panel)/ImageUpload';
import { useToast, ToastContainer } from '../../(panel)/Toast';

const iS = { width:'100%', background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(237,104,0,.2)', borderRadius:'.75rem', padding:'.75rem 1rem', color:'white', fontSize:'.88rem', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };
const lS = { display:'block', fontSize:'.75rem', fontWeight:600, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.4rem' };
const card = { background:'#1a0d00', border:'1px solid rgba(237,104,0,.2)', borderRadius:'1rem', padding:'1.75rem', marginBottom:'1.25rem' };

const TABS = ['Details', 'Gilehri Seva', 'Donation Settings'];

export default function EditTempleProject({ params }) {
  const { id } = use(params);
  const [tab,     setTab]    = useState('Details');
  const [data,    setData]   = useState(null);
  const [loading, setLoading]= useState(true);
  const [saving,  setSaving] = useState(false);
  const { toasts, success, error, remove } = useToast();

  const [form,    setForm]   = useState({});
  const [statsRows, setStatsRows] = useState([]); // [{key:'',value:''}]
  const [gilehri, setGilehri]= useState({});
  const [donSet,  setDonSet] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/temple-projects/${id}`);
      const d    = await res.json();
      setData(d);
      const statsObj = typeof d.stats === 'object' ? (d.stats||{}) : {};
      try { Object.assign(statsObj, JSON.parse(d.stats||'{}')); } catch {}
      setStatsRows(Object.entries(statsObj).map(([key,value])=>({key,value:String(value)})));
      setForm({ ...d });
      setGilehri(d.gilehri || { title:'Gilehri Seva', subtitle:'', description:'', image:'', benefits:[], suggested_amounts:[], badge_text:'🐿️ Gilehri Seva', cta_text:'🙏 Participate in Gilehri Seva', enabled:true });
      setDonSet(d.donationSettings || { normal_enabled:true, normal_min_amount:1000, normal_label:'Donation', tile_enabled:true, tile_price:6000, tile_label:'Tiles / Square Donation', tile_description:'', tile_image:'' });
    } catch(e) { error('Failed to load: ' + e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const fset = (k,v) => setForm(f=>({...f,[k]:v}));
  const gset = (k,v) => setGilehri(g=>({...g,[k]:v}));
  const dset = (k,v) => setDonSet(d=>({...d,[k]:v}));

  const saveDetails = async () => {
    setSaving(true);
    try {
      const statsObj = Object.fromEntries(statsRows.filter(r=>r.key.trim()).map(r=>[r.key.trim(),r.value.trim()]));
      const res = await fetch(`/api/admin/temple-projects/${id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, stats: statsObj }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      success('Project saved!');
    } catch(e) { error(e.message); }
    setSaving(false);
  };

  const saveGilehri = async () => {
    setSaving(true);
    try {
      const benefits = typeof gilehri.benefits === 'string'
        ? gilehri.benefits.split('\n').filter(Boolean)
        : (gilehri.benefits||[]);
      const suggested = typeof gilehri.suggested_amounts === 'string'
        ? gilehri.suggested_amounts.split(',').map(v=>Number(v.trim())).filter(Boolean)
        : (gilehri.suggested_amounts||[]);
      const res = await fetch(`/api/admin/gilehri-seva/${id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...gilehri, benefits, suggested_amounts: suggested }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      success('Gilehri Seva saved!');
    } catch(e) { error(e.message); }
    setSaving(false);
  };

  const saveDonation = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/temple-donation-settings/${id}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(donSet),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      success('Donation settings saved!');
    } catch(e) { error(e.message); }
    setSaving(false);
  };

  if (loading) return <p style={{ color:'rgba(255,255,255,.4)', padding:'3rem', textAlign:'center' }}>Loading…</p>;

  const SaveBtn = () => (
    <button type="button" onClick={
      tab==='Gilehri Seva' ? saveGilehri :
      tab==='Donation Settings' ? saveDonation :
      saveDetails
    } disabled={saving} style={{ padding:'.85rem 2.5rem', borderRadius:'.875rem', border:'none', background:saving?'rgba(237,104,0,.4)':'linear-gradient(135deg,#c45500,#ed6800)', color:'white', fontWeight:700, cursor:saving?'not-allowed':'pointer', fontSize:'.9rem', marginTop:'1.25rem', width:'100%' }}>
      {saving ? '⏳ Saving…' : '💾 Save Changes'}
    </button>
  );

  return (
    <div style={{ maxWidth:'860px' }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        <Link href="/admin/temple-projects" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.85rem' }}>← Projects</Link>
        <span style={{ color:'rgba(255,255,255,.15)' }}>›</span>
        <h1 style={{ color:'white', fontSize:'1.2rem', fontWeight:700, margin:0, flex:1 }}>{data?.title || 'Edit Project'}</h1>
        <a href={`/new-temple/${data?.slug}`} target="_blank" rel="noreferrer" style={{ padding:'.5rem 1rem', borderRadius:'.75rem', background:'rgba(237,104,0,.1)', color:'#ed6800', fontSize:'.8rem', fontWeight:600, textDecoration:'none' }}>
          🔗 View Live
        </a>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'.3rem', background:'rgba(255,255,255,.04)', borderRadius:'1rem', padding:'.3rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1, minWidth:'100px', padding:'.55rem .5rem', borderRadius:'.75rem', border:'none', cursor:'pointer', background:tab===t?'linear-gradient(135deg,#c45500,#ed6800)':'transparent', color:tab===t?'white':'rgba(255,255,255,.45)', fontWeight:tab===t?700:400, fontSize:'.78rem', transition:'all .2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── DETAILS TAB ── */}
      {tab === 'Details' && (
        <>
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Basic Info</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Project Name *</label><input required style={iS} value={form.title||''} onChange={e=>fset('title',e.target.value)} /></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lS}>Subtitle</label><input style={iS} value={form.subtitle||''} onChange={e=>fset('subtitle',e.target.value)} /></div>
              <div><label style={lS}>Tagline</label><input style={iS} value={form.tagline||''} onChange={e=>fset('tagline',e.target.value)} /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lS}>Location</label><input style={iS} value={form.location||''} onChange={e=>fset('location',e.target.value)} placeholder="Ayodhya, Uttar Pradesh" /></div>
              <div>
                <label style={lS}>Construction Status</label>
                <select style={{ ...iS, cursor:'pointer' }} value={form.construction_status||'In Progress'} onChange={e=>fset('construction_status',e.target.value)}>
                  {['In Progress','Planning','Foundation','Upcoming','Completed'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lS}>Short Description</label>
              <textarea rows={3} style={{ ...iS, resize:'vertical', minHeight:'70px' }} value={form.description||''} onChange={e=>fset('description',e.target.value)} />
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lS}>About Content (Full Story)</label>
              <textarea rows={6} style={{ ...iS, resize:'vertical', minHeight:'120px' }} value={form.about_content||''} onChange={e=>fset('about_content',e.target.value)} />
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lS}>Project Requirements</label>
              <textarea rows={4} style={{ ...iS, resize:'vertical', minHeight:'85px' }} value={form.project_requirements||''} onChange={e=>fset('project_requirements',e.target.value)} placeholder="Materials, construction goals, future plans..." />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              <div>
                <label style={lS}>Status</label>
                <select style={{ ...iS, cursor:'pointer' }} value={form.status||'published'} onChange={e=>fset('status',e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div><label style={lS}>Sort Order</label><input type="number" style={iS} value={form.sort_order||0} onChange={e=>fset('sort_order',e.target.value)} /></div>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'rgba(255,255,255,.6)', fontSize:'.88rem', cursor:'pointer', marginTop:'1rem' }}>
              <input type="checkbox" checked={!!form.featured} onChange={e=>fset('featured',e.target.checked)} /> Featured Project
            </label>
          </div>

          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Images</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.5rem' }}>
              <div>
                <ImageUpload value={form.banner_image||''} onChange={v=>fset('banner_image',v)} label="Banner Image" />
              </div>
              <div>
                <ImageUpload value={form.thumbnail_image||''} onChange={v=>fset('thumbnail_image',v)} label="Thumbnail Image" />
              </div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Fundraising</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lS}>Goal Amount (₹)</label><input type="number" style={iS} value={form.goal_amount||''} onChange={e=>fset('goal_amount',e.target.value)} /></div>
              <div><label style={lS}>Raised Amount (₹)</label><input type="number" style={iS} value={form.raised_amount||''} onChange={e=>fset('raised_amount',e.target.value)} /></div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
                <label style={{ ...lS, marginBottom:0 }}>Project Stats <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)', fontSize:'.7rem' }}>(e.g. "Construction: 45%", "Devotees: 5000+")</span></label>
                <button type="button" onClick={()=>setStatsRows(r=>[...r,{key:'',value:''}])}
                  style={{ padding:'.3rem .85rem', borderRadius:'.5rem', border:'none', background:'rgba(237,104,0,.18)', color:'#ed6800', fontWeight:700, cursor:'pointer', fontSize:'.78rem' }}>
                  + Add Stat
                </button>
              </div>
              {statsRows.length === 0 && (
                <p style={{ color:'rgba(255,255,255,.25)', fontSize:'.8rem', fontStyle:'italic', marginBottom:'.5rem' }}>No stats yet — click "+ Add Stat" to add one.</p>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                {statsRows.map((row,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'.6rem', alignItems:'center' }}>
                    <input style={iS} value={row.key} onChange={e=>setStatsRows(r=>r.map((x,j)=>j===i?{...x,key:e.target.value}:x))} placeholder="e.g. Construction" />
                    <input style={iS} value={row.value} onChange={e=>setStatsRows(r=>r.map((x,j)=>j===i?{...x,value:e.target.value}:x))} placeholder="e.g. 45%" />
                    <button type="button" onClick={()=>setStatsRows(r=>r.filter((_,j)=>j!==i))}
                      style={{ padding:'.5rem .7rem', borderRadius:'.6rem', border:'1px solid rgba(255,80,80,.25)', background:'transparent', color:'#f87171', cursor:'pointer', fontSize:'.82rem', whiteSpace:'nowrap' }}>✕</button>
                  </div>
                ))}
              </div>
              {statsRows.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginTop:'.75rem' }}>
                  {statsRows.filter(r=>r.key).map((r,i)=>(
                    <span key={i} style={{ background:'rgba(237,104,0,.12)', color:'#ed6800', fontSize:'.72rem', fontWeight:700, padding:'.22rem .7rem', borderRadius:'2rem', border:'1px solid rgba(237,104,0,.2)' }}>
                      {r.key}: {r.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>CTA Section</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>CTA Title</label><input style={iS} value={form.cta_title||''} onChange={e=>fset('cta_title',e.target.value)} /></div>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>CTA Description</label><textarea rows={3} style={{ ...iS, resize:'vertical' }} value={form.cta_description||''} onChange={e=>fset('cta_description',e.target.value)} /></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              <div><label style={lS}>Button Text</label><input style={iS} value={form.cta_btn_text||''} onChange={e=>fset('cta_btn_text',e.target.value)} /></div>
              <div><label style={lS}>Button Link</label><input style={iS} value={form.cta_btn_link||''} onChange={e=>fset('cta_btn_link',e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>SEO</h3>
            <div style={{ marginBottom:'1rem' }}><label style={lS}>Meta Title</label><input style={iS} value={form.meta_title||''} onChange={e=>fset('meta_title',e.target.value)} /></div>
            <div><label style={lS}>Meta Description <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)' }}>(max 160 chars)</span></label><textarea rows={2} style={{ ...iS, resize:'vertical' }} value={form.meta_description||''} onChange={e=>fset('meta_description',e.target.value)} maxLength={160} /></div>
          </div>

          <SaveBtn />
        </>
      )}

      {/* ── GILEHRI SEVA TAB ── */}
      {tab === 'Gilehri Seva' && (
        <div style={card}>
          <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Gilehri Seva Content</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            <div><label style={lS}>Title</label><input style={iS} value={gilehri.title||''} onChange={e=>gset('title',e.target.value)} /></div>
            <div><label style={lS}>Badge Text</label><input style={iS} value={gilehri.badge_text||''} onChange={e=>gset('badge_text',e.target.value)} /></div>
          </div>
          <div style={{ marginBottom:'1rem' }}><label style={lS}>Subtitle</label><input style={iS} value={gilehri.subtitle||''} onChange={e=>gset('subtitle',e.target.value)} /></div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lS}>Description</label>
            <textarea rows={4} style={{ ...iS, resize:'vertical', minHeight:'90px' }} value={gilehri.description||''} onChange={e=>gset('description',e.target.value)} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <ImageUpload value={gilehri.image||''} onChange={v=>gset('image',v)} label="Seva Image" />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lS}>Benefits <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)' }}>(one per line)</span></label>
            <textarea rows={5} style={{ ...iS, resize:'vertical' }}
              value={Array.isArray(gilehri.benefits)?gilehri.benefits.join('\n'):(gilehri.benefits||'')}
              onChange={e=>gset('benefits',e.target.value)} placeholder={'Earn the blessings of Lord Ram\nParticipate in ancient tradition'} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={lS}>Suggested Donation Amounts <span style={{ textTransform:'none', color:'rgba(255,255,255,.25)' }}>(comma-separated)</span></label>
            <input style={iS}
              value={Array.isArray(gilehri.suggested_amounts)?gilehri.suggested_amounts.join(','):(gilehri.suggested_amounts||'')}
              onChange={e=>gset('suggested_amounts',e.target.value.split(',').map(v=>Number(v.trim())).filter(Boolean))}
              placeholder="101,251,501,1001,2101,5100" />
          </div>
          <div style={{ marginBottom:'1rem' }}><label style={lS}>CTA Button Text</label><input style={iS} value={gilehri.cta_text||''} onChange={e=>gset('cta_text',e.target.value)} /></div>
          <label style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'rgba(255,255,255,.6)', fontSize:'.88rem', cursor:'pointer' }}>
            <input type="checkbox" checked={!!gilehri.enabled} onChange={e=>gset('enabled',e.target.checked)} /> Show on website
          </label>
          <SaveBtn />
        </div>
      )}

      {/* ── DONATION SETTINGS TAB ── */}
      {tab === 'Donation Settings' && (
        <>
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Normal Donation</h3>
            <label style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'rgba(255,255,255,.6)', fontSize:'.88rem', cursor:'pointer', marginBottom:'1rem' }}>
              <input type="checkbox" checked={!!donSet.normal_enabled} onChange={e=>dset('normal_enabled',e.target.checked)} /> Enable Normal Donation
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              <div><label style={lS}>Label</label><input style={iS} value={donSet.normal_label||'Donation'} onChange={e=>dset('normal_label',e.target.value)} /></div>
              <div><label style={lS}>Minimum Amount (₹)</label><input type="number" style={iS} value={donSet.normal_min_amount||1000} onChange={e=>dset('normal_min_amount',Number(e.target.value))} /></div>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ color:'#ed6800', fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'1.25rem', marginTop:0 }}>Tile / Square Donation</h3>
            <label style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'rgba(255,255,255,.6)', fontSize:'.88rem', cursor:'pointer', marginBottom:'1rem' }}>
              <input type="checkbox" checked={!!donSet.tile_enabled} onChange={e=>dset('tile_enabled',e.target.checked)} /> Enable Tile Donation
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lS}>Label</label><input style={iS} value={donSet.tile_label||'Tiles / Square Donation'} onChange={e=>dset('tile_label',e.target.value)} /></div>
              <div><label style={lS}>Price per Tile (₹)</label><input type="number" style={iS} value={donSet.tile_price||6000} onChange={e=>dset('tile_price',Number(e.target.value))} /></div>
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={lS}>Tile Description</label>
              <textarea rows={3} style={{ ...iS, resize:'vertical' }} value={donSet.tile_description||''} onChange={e=>dset('tile_description',e.target.value)} placeholder="Have your name engraved on a sacred tile..." />
            </div>
            <div>
              <label style={lS}>Tile Reference Image</label>
              <ImageUpload value={donSet.tile_image||''} onChange={v=>dset('tile_image',v)} label="Tile Image" />
            </div>
            <div style={{ background:'rgba(237,104,0,.05)', border:'1px solid rgba(237,104,0,.12)', borderRadius:'1rem', padding:'1rem', marginTop:'1.25rem' }}>
              <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.5rem' }}>Pricing Preview</p>
              {[1,2,5,10].map(n=><p key={n} style={{ color:'rgba(255,255,255,.55)', fontSize:'.85rem', marginBottom:'.25rem' }}>{n} Tile{n>1?'s':''} = ₹{(n*(donSet.tile_price||6000)).toLocaleString('en-IN')}</p>)}
            </div>
            <SaveBtn />
          </div>
        </>
      )}
    </div>
  );
}
