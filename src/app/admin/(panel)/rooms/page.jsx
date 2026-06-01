'use client';
import { useState, useEffect } from 'react';
import RichEditor from '../RichEditor';
import ImageUpload from '../ImageUpload';
import { useToast, ToastContainer } from '../Toast';

const emptyForm = { title: '', price: '', price_amount: '', description: '', features: '', image: '', popular: false, active: true };

export default function AdminRooms() {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const { toasts, remove, success, error } = useToast();

  const load = () => {
    setLoading(true);
    fetch('/api/rooms').then(r => r.json()).then(d => { setRooms(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const openNew  = () => { setEditItem(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (r) => {
    setEditItem(r);
    setForm({
      title:        r.title || '',
      price:        r.price || '',
      price_amount: r.price_amount || '',
      description:  r.description || '',
      features:     Array.isArray(r.features) ? r.features.join(', ') : (r.features || ''),
      image:        r.image || '',
      popular:      !!r.popular,
      active:       !!r.active,
    });
    setShowForm(true);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    const featureArr = form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [];
    const priceAmt   = Number(form.price_amount) || 0;
    const priceStr   = form.price || (priceAmt ? `₹${priceAmt.toLocaleString('en-IN')}/night` : '');
    const payload    = { title: form.title, price: priceStr, price_amount: priceAmt, description: form.description, features: featureArr, image: form.image, popular: form.popular, active: form.active };
    const method     = editItem ? 'PUT' : 'POST';
    const url        = editItem ? `/api/rooms/${editItem.id}` : '/api/rooms';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) success(editItem ? 'Room updated successfully!' : 'New room added!', editItem ? '✏️ Updated' : '✅ Created');
    else error('Something went wrong. Please try again.', '❌ Error');
    setShowForm(false); load();
  };

  const toggleActive = async (r) => {
    await fetch(`/api/rooms/${r.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...r, active: !r.active, features: r.features }) });
    success(`"${r.title}" marked ${!r.active ? 'Active' : 'Inactive'}`, '🔄 Status Updated');
    load();
  };

  const deleteRoom = async (r) => {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    await fetch(`/api/rooms/${r.id}`, { method: 'DELETE' });
    if (r.image && r.image.startsWith('/uploads/')) {
      await fetch(`/api/upload?file=${encodeURIComponent(r.image)}`, { method: 'DELETE' });
    }
    success(`"${r.title}" deleted.`, '🗑️ Deleted');
    load();
  };

  const sty = {
    card:  { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    input: { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(237,104,0,.25)', borderRadius: '.5rem', padding: '.6rem .9rem', color: 'white', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.35rem', letterSpacing: '.05em', textTransform: 'uppercase' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Rooms</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>Manage guest accommodations</p>
        </div>
        <button onClick={openNew} style={{ background: '#ed6800', color: 'white', border: 'none', borderRadius: '.6rem', padding: '.65rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '.88rem' }}>
          + New Room
        </button>
      </div>

      {loading && <div style={sty.card}><p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p></div>}
      {!loading && rooms.length === 0 && <div style={sty.card}><p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No rooms yet. Add your first room.</p></div>}

      {!loading && rooms.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {rooms.map((r) => (
            <div key={r.id} style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', overflow: 'hidden', opacity: r.active ? 1 : 0.55 }}>
              {r.image ? (
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '80px', background: 'rgba(237,104,0,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛏️</span>
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{r.title}</div>
                  </div>
                  <div style={{ color: '#ffd89b', fontWeight: 700, fontSize: '1rem' }}>
                    {r.price || (r.price_amount ? `₹${Number(r.price_amount).toLocaleString('en-IN')}/night` : '—')}
                  </div>
                </div>
                <p style={{ margin: '.5rem 0', color: 'rgba(255,255,255,.5)', fontSize: '.8rem', lineHeight: 1.5 }}>{r.description?.slice(0, 70)}…</p>
                {Array.isArray(r.features) && r.features.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '.5rem' }}>
                    {r.features.slice(0, 3).map((f, i) => (
                      <span key={i} style={{ background: 'rgba(237,104,0,.1)', color: 'rgba(255,255,255,.5)', fontSize: '.7rem', padding: '.15rem .5rem', borderRadius: '2rem' }}>{f}</span>
                    ))}
                    {r.features.length > 3 && <span style={{ color: '#666', fontSize: '.7rem' }}>+{r.features.length - 3} more</span>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                  <button onClick={() => openEdit(r)} style={{ flex: 1, background: 'rgba(237,104,0,.15)', color: '#ffd89b', border: '1px solid rgba(237,104,0,.2)', borderRadius: '.5rem', padding: '.4rem', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600 }}>✏️ Edit</button>
                  <button onClick={() => toggleActive(r)} style={{ flex: 1, background: r.active ? 'rgba(68,204,136,.1)' : 'rgba(255,170,0,.1)', color: r.active ? '#44cc88' : '#ffaa00', border: `1px solid ${r.active ? '#44cc8833' : '#ffaa0033'}`, borderRadius: '.5rem', padding: '.4rem', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600 }}>
                    {r.active ? '● Active' : '○ Inactive'}
                  </button>
                  <button onClick={() => deleteRoom(r)} style={{ background: 'rgba(255,80,80,.1)', color: '#ff7070', border: '1px solid rgba(255,80,80,.2)', borderRadius: '.5rem', padding: '.4rem .6rem', cursor: 'pointer', fontSize: '.85rem' }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.3)', borderRadius: '1.2rem', padding: '2rem', width: '100%', maxWidth: '620px' }}>
            <h2 style={{ color: 'white', margin: '0 0 1.5rem', fontSize: '1.2rem' }}>{editItem ? '✏️ Edit Room' : '+ Add New Room'}</h2>
            <div style={{ display: 'grid', gap: '1.1rem' }}>
              <div><label style={sty.label}>Room Name *</label><input style={sty.input} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Deluxe Room" /></div>
              <div>
                <label style={sty.label}>Description</label>
                <RichEditor value={form.description || ''} onChange={(content) => set('description', content)} height={220} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={sty.label}>Price Amount (₹)</label><input type="number" style={sty.input} value={form.price_amount} onChange={e => set('price_amount', e.target.value)} placeholder="1200" /></div>
                <div><label style={sty.label}>Price Display</label><input style={sty.input} placeholder="₹1,200/night" value={form.price} onChange={e => set('price', e.target.value)} /></div>
              </div>
              <div><label style={sty.label}>Features (comma-separated)</label><input style={sty.input} placeholder="AC, Hot Water, WiFi, Temple View" value={form.features} onChange={e => set('features', e.target.value)} /></div>

              {/* Image Upload */}
              <ImageUpload
                label="Room Image"
                value={form.image}
                onChange={(url) => set('image', url)}
              />

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.88rem' }}>
                  <input type="checkbox" checked={form.popular} onChange={e => set('popular', e.target.checked)} style={{ accentColor: '#ed6800' }} /> ⭐ Most Popular
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.88rem' }}>
                  <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ accentColor: '#ed6800' }} /> ✅ Active
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
              <button onClick={save} style={{ flex: 1, background: '#ed6800', color: 'white', border: 'none', borderRadius: '.6rem', padding: '.75rem', fontWeight: 700, cursor: 'pointer' }}>
                {editItem ? '💾 Save Changes' : '+ Add Room'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '.75rem 1.5rem', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', border: 'none', borderRadius: '.6rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
