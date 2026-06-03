'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RichEditor from '../(panel)/RichEditor';
import ImageUpload from '../(panel)/ImageUpload';

const iStyle = { width: '100%', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(237,104,0,.2)', borderRadius: '.75rem', padding: '.75rem 1rem', color: 'white', fontSize: '.88rem', boxSizing: 'border-box', outline: 'none' };
const lStyle = { display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.4rem' };

const CATEGORIES = ['Festival', 'Spiritual', 'Education', 'Weekly', 'Cultural', 'Special'];

export default function EventForm({ onSubmit, initial = {} }) {
  const [form, setForm] = useState({
    name: '', date: '', month: '', year: '2026',
    category: 'Festival', description: '', image: '', featured: false, active: true, show_popup: false,
    ...initial,
    featured:   !!initial.featured,
    active:     initial.active !== undefined ? !!initial.active : true,
    show_popup: !!initial.show_popup,
  });
  const [saving, setSaving] = useState(false);
  const [popupEventName, setPopupEventName] = useState(null); // name of event that already has popup
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch('/api/popup')
      .then(r => r.json())
      .then(d => {
        // If another event (not this one) has popup enabled
        if (d && d.id && d.id !== initial.id) {
          setPopupEventName(d.name || 'Ek aur event');
        }
      })
      .catch(() => {});
  }, [initial.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  const cardStyle = { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.75rem', marginBottom: '1.25rem' };

  return (
    <form onSubmit={handleSubmit}>

      {/* Basic Info */}
      <div style={cardStyle}>
        <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem' }}>Basic Info</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={lStyle}>Event Name *</label>
          <input required style={iStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Janmashtami Mahotsav" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={lStyle}>Date</label>
            <input style={iStyle} value={form.date || ''} onChange={e => set('date', e.target.value)} placeholder="24" />
          </div>
          <div>
            <label style={lStyle}>Month</label>
            <input style={iStyle} value={form.month || ''} onChange={e => set('month', e.target.value)} placeholder="Aug" />
          </div>
          <div>
            <label style={lStyle}>Year</label>
            <input style={iStyle} value={form.year || ''} onChange={e => set('year', e.target.value)} placeholder="2026" />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
            <label style={lStyle}>Category</label>
            <select style={{ ...iStyle, cursor: 'pointer' }} value={form.category || 'Festival'} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c} style={{ background: '#1a0d00', color: 'white' }}>{c}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Description — single field, any language */}
      <div style={cardStyle}>
        <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.5rem' }}>Description</h3>
        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.78rem', marginBottom: '1rem' }}>Hindi ya English — jaise chahein likhein</p>
        <RichEditor value={form.description || ''} onChange={(content) => set('description', content)} height={260} />
      </div>

      {/* Image */}
      <div style={cardStyle}>
        <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem' }}>Event Image</h3>
        <ImageUpload label="Banner / Thumbnail" value={form.image || ''} onChange={(url) => set('image', url)} />
      </div>

      {/* Settings */}
      <div style={cardStyle}>
        <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem' }}>Settings</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.9rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#ed6800' }} />
            ⭐ Featured Event
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: '.9rem' }}>
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#ed6800' }} />
            ✅ Active (visible on website)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: popupEventName ? 'rgba(255,255,255,.3)' : form.show_popup ? '#ed6800' : 'rgba(255,255,255,.7)', cursor: popupEventName ? 'not-allowed' : 'pointer', fontSize: '.9rem', fontWeight: form.show_popup ? 700 : 400 }}>
            <input type="checkbox" checked={form.show_popup} disabled={!!popupEventName} onChange={e => set('show_popup', e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#ed6800', cursor: popupEventName ? 'not-allowed' : 'pointer' }} />
            🎯 Show as Website Popup
          </label>
        </div>
        {popupEventName && (
          <p style={{ fontSize: '.78rem', color: '#f87171', marginTop: '.75rem', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: '.6rem', padding: '.6rem .9rem' }}>
            🔒 Already active for: <strong style={{ color: '#fca5a5' }}>{popupEventName}</strong>. Disable it there first.
          </p>
        )}
        {!popupEventName && form.show_popup && (
          <p style={{ fontSize: '.78rem', color: '#f59e0b', marginTop: '.75rem', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)', borderRadius: '.6rem', padding: '.6rem .9rem' }}>
            ⚠️ Saving will disable popup on all other events.
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={saving}
          style={{ padding: '.75rem 2rem', background: saving ? '#555' : 'linear-gradient(135deg,#c45500,#ed6800)', border: 'none', borderRadius: '.875rem', color: 'white', fontWeight: 700, fontSize: '.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '⏳ Saving…' : '💾 Save Event'}
        </button>
        <Link href="/admin/events"
          style={{ padding: '.75rem 2rem', border: '1px solid rgba(255,255,255,.15)', borderRadius: '.875rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontSize: '.9rem', display: 'inline-flex', alignItems: 'center' }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
