'use client';
import { useState, useRef } from 'react';

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState('');
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) { setError('Only JPG, PNG, WEBP, GIF, SVG allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError('');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Upload failed'); setPreview(null); return; }
      onChange(data.url);
    } catch { setError('Upload failed. Please try again.'); setPreview(null); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!value || !value.startsWith('/uploads/')) { onChange(''); setPreview(null); return; }
    if (!confirm('Delete this image?')) return;
    setUploading(true);
    try {
      await fetch(`/api/upload?file=${encodeURIComponent(value)}`, { method: 'DELETE' });
    } catch {}
    onChange('');
    setPreview(null);
    setUploading(false);
  };

  const currentImg = preview || value;

  const lStyle = { display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.75rem' };

  return (
    <div>
      <label style={lStyle}>{label}</label>

      {/* Current / Preview image */}
      {currentImg && (
        <div style={{ position: 'relative', marginBottom: '.75rem', borderRadius: '.75rem', overflow: 'hidden', border: '1.5px solid rgba(237,104,0,.25)', display: 'inline-block', maxWidth: '100%' }}>
          <img
            src={currentImg}
            alt="preview"
            style={{ display: 'block', maxHeight: '180px', maxWidth: '100%', objectFit: 'cover', minWidth: '120px' }}
          />
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ed6800', fontSize: '.85rem', fontWeight: 600 }}>⏳ Uploading…</span>
            </div>
          )}
          {!uploading && (
            <button type="button" onClick={handleDelete}
              style={{ position: 'absolute', top: '.4rem', right: '.4rem', background: 'rgba(255,40,40,.85)', border: 'none', borderRadius: '.4rem', color: 'white', fontSize: '.75rem', fontWeight: 700, padding: '.25rem .5rem', cursor: 'pointer', lineHeight: 1 }}>
              ✕
            </button>
          )}
        </div>
      )}

      {/* Drop zone */}
      {!currentImg && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          style={{
            border: `2px dashed ${dragOver ? '#ed6800' : 'rgba(237,104,0,.3)'}`,
            borderRadius: '.875rem',
            padding: '2rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(237,104,0,.06)' : 'rgba(255,255,255,.02)',
            transition: 'all .2s',
            marginBottom: '.5rem',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🖼️</div>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', margin: 0 }}>
            {uploading ? '⏳ Uploading…' : 'Click to upload or drag & drop'}
          </p>
          <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '.72rem', marginTop: '.25rem' }}>JPG, PNG, WEBP, GIF · Max 5 MB</p>
        </div>
      )}

      {/* Change button when image exists */}
      {currentImg && !uploading && (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ marginTop: '.25rem', padding: '.4rem .875rem', background: 'rgba(237,104,0,.12)', border: '1px solid rgba(237,104,0,.25)', borderRadius: '.5rem', color: '#ed6800', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer' }}>
          🔄 Change Image
        </button>
      )}

      {error && (
        <p style={{ color: '#ff7070', fontSize: '.78rem', marginTop: '.4rem', background: 'rgba(255,80,80,.08)', padding: '.4rem .75rem', borderRadius: '.4rem', border: '1px solid rgba(255,80,80,.15)' }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}
