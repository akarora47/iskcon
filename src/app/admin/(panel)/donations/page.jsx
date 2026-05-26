'use client';
import { useState, useEffect } from 'react';
import RichEditor from '../RichEditor';
import ImageUpload from '../ImageUpload';
import { useToast, ToastContainer } from '../Toast';

// DB: seva_campaigns: id, title, title_hi, icon, description, description_hi, goal_amount, raised_amount, image, featured, active
// DB: donation_submissions: id, campaign_id, seva_type, full_name, email, phone, amount, message, status, created_at

export default function AdminDonations() {
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [tab, setTab]             = useState('campaigns');
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState({ title: '', description: '', goal_amount: '', image: '', featured: false, active: true });
  const { toasts, remove, success, error } = useToast();

  const loadCampaigns = () => {
    fetch('/api/campaigns').then(r => r.json()).then(d => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); });
  };
  const loadDonations = () => {
    fetch('/api/seva').then(r => r.json()).then(d => { setDonations(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(() => { loadCampaigns(); loadDonations(); }, []);

  const openNew  = () => { setEditItem(null); setForm({ title: '', description: '', goal_amount: '', image: '', featured: false, active: true }); setShowForm(true); };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({ title: c.title, description: c.description || '', goal_amount: c.goal_amount || '', image: c.image || '', featured: !!c.featured, active: !!c.active });
    setShowForm(true);
  };

  const save = async () => {
    const method = editItem ? 'PUT' : 'POST';
    const url    = editItem ? `/api/campaigns/${editItem.id}` : '/api/campaigns';
    const payload = { title: form.title, description: form.description, goal_amount: form.goal_amount ? Number(form.goal_amount) : 0, raised_amount: editItem?.raised_amount || 0, image: form.image, featured: form.featured, active: form.active };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) success(editItem ? 'Campaign updated!' : 'New campaign created!', editItem ? '✏️ Updated' : '✅ Created');
    else error('Something went wrong.', '❌ Error');
    setShowForm(false); loadCampaigns();
  };

  const toggleActive = async (c) => {
    await fetch(`/api/campaigns/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: c.title, description: c.description, goal_amount: c.goal_amount, raised_amount: c.raised_amount, image: c.image, featured: c.featured, active: !c.active }) });
    success(`"${c.title}" marked ${!c.active ? 'Active' : 'Inactive'}`, '🔄 Status Updated');
    loadCampaigns();
  };

  const deleteCampaign = async (c) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await fetch(`/api/campaigns/${c.id}`, { method: 'DELETE' });
    if (c.image && c.image.startsWith('/uploads/')) {
      await fetch(`/api/upload?file=${encodeURIComponent(c.image)}`, { method: 'DELETE' });
    }
    success(`"${c.title}" deleted.`, '🗑️ Deleted');
    loadCampaigns();
  };

  const sty = {
    card:  { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    th:    { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left' },
    td:    { padding: '.75rem 1rem', fontSize: '.84rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' },
    input: { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(237,104,0,.25)', borderRadius: '.5rem', padding: '.6rem .9rem', color: 'white', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.35rem', letterSpacing: '.05em', textTransform: 'uppercase' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Donations</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>Manage seva campaigns &amp; donation records</p>
        </div>
        {tab === 'campaigns' && (
          <button onClick={openNew} style={{ background: '#ed6800', color: 'white', border: 'none', borderRadius: '.6rem', padding: '.65rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '.88rem' }}>
            + New Campaign
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        {['campaigns', 'submissions'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '.5rem 1.2rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.85rem',
            background: tab === t ? '#ed6800' : 'rgba(255,255,255,.07)', color: tab === t ? 'white' : 'rgba(255,255,255,.5)' }}>
            {t === 'campaigns' ? 'Seva Campaigns' : 'Donation Submissions'} ({t === 'campaigns' ? campaigns.length : donations.length})
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {tab === 'campaigns' && (
        <div style={sty.card}>
          {loading ? <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={sty.th}>Name</th>
                  <th style={sty.th}>Goal Amount</th><th style={sty.th}>Status</th><th style={sty.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id}>
                      <td style={sty.td}><div style={{ fontWeight: 600, color: 'white' }}>{c.title}</div><div style={{ fontSize: '.75rem', color: '#777', marginTop: '.2rem' }}>{c.description?.replace(/<[^>]*>/g, '').slice(0, 60)}…</div></td>
                      <td style={sty.td}>{c.goal_amount ? '₹' + Number(c.goal_amount).toLocaleString('en-IN') : '—'}</td>
                      <td style={sty.td}>
                        <button onClick={() => toggleActive(c)} style={{ padding: '.25rem .8rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.75rem',
                          background: c.active ? 'rgba(68,204,136,.15)' : 'rgba(255,80,80,.1)',
                          color: c.active ? '#44cc88' : '#ff7070' }}>
                          {c.active ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td style={sty.td}>
                        <button onClick={() => openEdit(c)} style={{ color: '#ffd89b', background: 'none', border: 'none', cursor: 'pointer', marginRight: '.5rem', fontSize: '.85rem' }}>✏️</button>
                        <button onClick={() => deleteCampaign(c)} style={{ color: '#ff7070', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.85rem' }}>🗑</button>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && <tr><td colSpan="4" style={{ ...sty.td, textAlign: 'center', color: '#555', padding: '2rem' }}>No campaigns found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {tab === 'submissions' && (
        <div style={sty.card}>
          {loading ? <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={sty.th}>Donor</th><th style={sty.th}>Contact</th><th style={sty.th}>Seva Type</th>
                  <th style={sty.th}>Amount</th><th style={sty.th}>Date</th><th style={sty.th}>Message</th>
                </tr></thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id}>
                      <td style={sty.td}><div style={{ fontWeight: 600, color: 'white' }}>{d.full_name}</div></td>
                      <td style={sty.td}><div style={{ fontSize: '.78rem' }}>{d.email}</div><div style={{ fontSize: '.75rem', color: '#777' }}>{d.phone}</div></td>
                      <td style={sty.td}>{d.seva_type || '—'}</td>
                      <td style={sty.td}><span style={{ color: '#44cc88', fontWeight: 700 }}>₹{d.amount ? Number(d.amount).toLocaleString('en-IN') : '—'}</span></td>
                      <td style={sty.td}><span style={{ fontSize: '.78rem' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : '—'}</span></td>
                      <td style={sty.td}><span style={{ fontSize: '.78rem', color: '#888' }}>{d.message?.slice(0, 40) || '—'}</span></td>
                    </tr>
                  ))}
                  {donations.length === 0 && <tr><td colSpan="6" style={{ ...sty.td, textAlign: 'center', color: '#555', padding: '2rem' }}>No donations yet</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Campaign Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.3)', borderRadius: '1.2rem', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: 'white', margin: '0 0 1.5rem', fontSize: '1.2rem' }}>{editItem ? 'Edit Campaign' : 'New Seva Campaign'}</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><label style={sty.label}>Campaign Name *</label><input style={sty.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div>
                <label style={sty.label}>Description</label>
                <RichEditor value={form.description || ''} onChange={(content) => setForm(f => ({ ...f, description: content }))} height={220} />
              </div>
              <div><label style={sty.label}>Goal Amount (₹)</label><input type="number" style={sty.input} value={form.goal_amount} onChange={e => setForm(f => ({ ...f, goal_amount: e.target.value }))} /></div>
              <ImageUpload
                label="Campaign Image"
                value={form.image}
                onChange={(url) => setForm(f => ({ ...f, image: url }))}
              />
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.88rem' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.88rem' }}>
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />Active (visible on website)
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={{ flex: 1, background: '#ed6800', color: 'white', border: 'none', borderRadius: '.6rem', padding: '.75rem', fontWeight: 700, cursor: 'pointer' }}>
                {editItem ? 'Save Changes' : 'Create Campaign'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '.75rem 1.5rem', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', border: 'none', borderRadius: '.6rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
