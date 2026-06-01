'use client';
import { useState, useEffect } from 'react';
import ImageUpload from '../ImageUpload';
import { useToast, ToastContainer } from '../Toast';

const iStyle = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(237,104,0,.2)',
  borderRadius: '.75rem', padding: '.75rem 1rem', color: 'white', fontSize: '.88rem',
  boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
};
const lStyle = {
  display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'rgba(255,255,255,.45)',
  textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.4rem',
};
const card = {
  background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)',
  borderRadius: '1rem', padding: '1.75rem', marginBottom: '1.25rem',
};

const EMPTY = {
  id: null, title: '', subtitle: '', description: '', image: '',
  event_date: '', event_time: '', event_venue: '',
  btn_text: '🙏 Register Free', btn_link: '/events',
  btn2_text: 'Know More', btn2_link: '/events',
  badge_text: '⭐ Upcoming Event', enabled: true,
};

export default function AdminPopupPage() {
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const { toasts, remove, success, error } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch('/api/admin/popup')
      .then(r => r.json())
      .then(d => {
        if (d && d.id) {
          setForm({
            id:          d.id,
            title:       d.title       || '',
            subtitle:    d.subtitle    || '',
            description: d.description || '',
            image:       d.image       || '',
            event_date:  d.event_date  || '',
            event_time:  d.event_time  || '',
            event_venue: d.event_venue || '',
            btn_text:    d.btn_text    || '🙏 Register Free',
            btn_link:    d.btn_link    || '/events',
            btn2_text:   d.btn2_text   || 'Know More',
            btn2_link:   d.btn2_link   || '/events',
            badge_text:  d.badge_text  || '⭐ Upcoming Event',
            enabled:     !!d.enabled,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/popup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      if (!form.id && data.id) set('id', data.id);
      success('Popup saved successfully!');
    } catch (err) {
      error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async () => {
    const newVal = !form.enabled;
    set('enabled', newVal);
    try {
      const res = await fetch('/api/admin/popup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, enabled: newVal }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      success(newVal ? 'Popup enabled on website' : 'Popup disabled');
    } catch (err) {
      set('enabled', !newVal);
      error(err.message);
    }
  };

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,.4)', padding: '3rem', textAlign: 'center' }}>
      Loading popup settings…
    </div>
  );

  return (
    <div style={{ maxWidth: '860px' }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>🎯 Upcoming Event Popup</h1>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.82rem', marginTop: '.3rem' }}>
            Manage the popup shown automatically on the website
          </p>
        </div>

        {/* Live toggle */}
        <button
          type="button"
          onClick={toggleEnabled}
          style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            padding: '.6rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', border: 'none',
            background: form.enabled ? 'rgba(34,197,94,.15)' : 'rgba(255,80,80,.1)',
            color: form.enabled ? '#4ade80' : '#f87171',
            fontWeight: 700, fontSize: '.85rem', transition: 'all .2s',
          }}
        >
          <span style={{
            width: '.65rem', height: '.65rem', borderRadius: '50%',
            background: form.enabled ? '#4ade80' : '#f87171',
            boxShadow: form.enabled ? '0 0 8px #4ade80' : 'none',
            display: 'inline-block',
          }} />
          {form.enabled ? 'Live on Website' : 'Hidden'}
        </button>
      </div>

      {/* Preview strip */}
      <div style={{ background: 'linear-gradient(135deg,#c45500,#ed6800)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {form.image && (
          <img src={form.image} alt="" style={{ width: '3.5rem', height: '3.5rem', objectFit: 'cover', borderRadius: '.75rem', flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ background: 'rgba(255,255,255,.2)', color: 'white', fontSize: '.65rem', fontWeight: 700, padding: '.2rem .65rem', borderRadius: '2rem', letterSpacing: '.08em' }}>
            {form.badge_text || '⭐ Upcoming Event'}
          </span>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '.95rem', marginTop: '.3rem', marginBottom: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {form.title || 'Event Title'}
          </p>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.75rem', marginTop: '.15rem', marginBottom: 0 }}>
            {[form.event_date, form.event_time, form.event_venue].filter(Boolean).join(' · ') || 'Date · Time · Venue'}
          </p>
        </div>
        <span style={{ color: 'white', fontSize: '.8rem', fontWeight: 700, background: 'rgba(0,0,0,.2)', padding: '.4rem .9rem', borderRadius: '2rem', flexShrink: 0 }}>
          {form.btn_text || 'Register'}
        </span>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Event Details */}
        <div style={card}>
          <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem', marginTop: 0 }}>Event Details</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={lStyle}>Title *</label>
            <input required style={iStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Janmashtami Mahotsav 2026" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={lStyle}>Subtitle</label>
            <input style={iStyle} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Grand Celebration of Lord Krishna's Birth" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={lStyle}>Description</label>
            <textarea
              rows={3}
              style={{ ...iStyle, resize: 'vertical', minHeight: '80px' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="A short description visible in the popup…"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
            <div>
              <label style={lStyle}>Event Date</label>
              <input style={iStyle} value={form.event_date} onChange={e => set('event_date', e.target.value)} placeholder="24 Aug 2026" />
            </div>
            <div>
              <label style={lStyle}>Event Time</label>
              <input style={iStyle} value={form.event_time} onChange={e => set('event_time', e.target.value)} placeholder="4:00 PM onwards" />
            </div>
            <div>
              <label style={lStyle}>Venue</label>
              <input style={iStyle} value={form.event_venue} onChange={e => set('event_venue', e.target.value)} placeholder="ISKCON Ayodhya Mandir" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div style={card}>
          <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem', marginTop: 0 }}>Popup Image</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lStyle}>Popup Image</label>
            <ImageUpload value={form.image} onChange={url => set('image', url)} label="Popup Image" />
          </div>
          {form.image && (
            <img src={form.image} alt="preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '.75rem', marginTop: '.5rem' }} />
          )}
        </div>

        {/* Badge & Buttons */}
        <div style={card}>
          <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem', marginTop: 0 }}>Badge &amp; Buttons</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={lStyle}>Badge Text</label>
            <input style={iStyle} value={form.badge_text} onChange={e => set('badge_text', e.target.value)} placeholder="⭐ Upcoming Event" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={lStyle}>Primary Button Text</label>
              <input style={iStyle} value={form.btn_text} onChange={e => set('btn_text', e.target.value)} placeholder="🙏 Register Free" />
            </div>
            <div>
              <label style={lStyle}>Primary Button Link</label>
              <input style={iStyle} value={form.btn_link} onChange={e => set('btn_link', e.target.value)} placeholder="/events" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
            <div>
              <label style={lStyle}>Secondary Button Text <span style={{ color: 'rgba(255,255,255,.25)', textTransform: 'none' }}>(optional)</span></label>
              <input style={iStyle} value={form.btn2_text} onChange={e => set('btn2_text', e.target.value)} placeholder="Know More" />
            </div>
            <div>
              <label style={lStyle}>Secondary Button Link</label>
              <input style={iStyle} value={form.btn2_link} onChange={e => set('btn2_link', e.target.value)} placeholder="/events" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={card}>
          <h3 style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1.25rem', marginTop: 0 }}>Visibility</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }}>
            <div
              onClick={() => set('enabled', !form.enabled)}
              style={{
                width: '3rem', height: '1.6rem', borderRadius: '2rem', cursor: 'pointer',
                background: form.enabled ? '#ed6800' : 'rgba(255,255,255,.1)',
                position: 'relative', transition: 'background .25s', flexShrink: 0,
                border: '1.5px solid rgba(255,255,255,.1)',
              }}
            >
              <div style={{
                width: '1.2rem', height: '1.2rem', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '50%', transform: `translateY(-50%) translateX(${form.enabled ? '1.5rem' : '.15rem'})`,
                transition: 'transform .25s', boxShadow: '0 2px 6px rgba(0,0,0,.3)',
              }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>
              {form.enabled ? '✅ Popup is live and will show on the website' : '❌ Popup is hidden — visitors will not see it'}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%', padding: '1rem', borderRadius: '.875rem', border: 'none',
            background: saving ? 'rgba(237,104,0,.4)' : 'linear-gradient(135deg,#c45500,#ed6800)',
            color: 'white', fontSize: '1rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all .2s', letterSpacing: '.02em',
          }}
        >
          {saving ? '⏳ Saving…' : '💾 Save Popup'}
        </button>

      </form>
    </div>
  );
}
