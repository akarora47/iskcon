'use client';
import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '../Toast';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const { toasts, remove, success } = useToast();

  const load = () => {
    setLoading(true);
    fetch('/api/contact')
      .then(r => r.json())
      .then(d => { setInquiries(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    success(`Marked as ${status}.`, '🔄 Status Updated');
    load();
  };

  const deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (expanded === id) setExpanded(null);
    success('Inquiry deleted.', '🗑️ Deleted');
    load();
  };

  const filtered = inquiries
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (i.name||'').toLowerCase().includes(q) ||
             (i.email||'').toLowerCase().includes(q) ||
             (i.subject||'').toLowerCase().includes(q);
    });

  const count = (s) => s === 'all' ? inquiries.length : inquiries.filter(i => i.status === s).length;

  const sty = {
    card: { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    th:   { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left' },
    td:   { padding: '.75rem 1rem', fontSize: '.84rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' },
  };

  const statusColor = (s) => ({ new: '#44aaff', read: '#ffaa00', replied: '#44cc88' }[s] || '#888');
  const statusBg    = (s) => ({ new: 'rgba(68,170,255,.12)', read: 'rgba(255,170,0,.1)', replied: 'rgba(68,204,136,.12)' }[s] || 'transparent');
  const statusLabel = (s) => ({ new: '🔵 New', read: '👁 Read', replied: '✅ Replied' }[s] || s);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Inquiries</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>Contact form submissions from devotees &amp; visitors</p>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {['all', 'new', 'read', 'replied'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '.45rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.8rem',
              background: filter === s ? '#ed6800' : 'rgba(255,255,255,.07)',
              color:      filter === s ? 'white'   : 'rgba(255,255,255,.5)',
            }}>
              {s === 'new' ? '🔵' : s === 'read' ? '👁' : s === 'replied' ? '✅' : '📋'} {s.charAt(0).toUpperCase()+s.slice(1)} ({count(s)})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍  Search by name, email, or subject…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '420px', padding: '.65rem 1.1rem', borderRadius: '2rem', border: '1.5px solid rgba(237,104,0,.25)', background: 'rgba(255,255,255,.04)', color: 'white', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total', value: inquiries.length, color: '#ed6800' },
          { label: 'New', value: count('new'), color: '#44aaff' },
          { label: 'Read', value: count('read'), color: '#ffaa00' },
          { label: 'Replied', value: count('replied'), color: '#44cc88' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={sty.card}>
        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Loading inquiries…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,.3)', textAlign: 'center', padding: '3rem' }}>No inquiries found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={sty.th}>Name &amp; Contact</th>
                  <th style={sty.th}>Subject</th>
                  <th style={sty.th}>Status</th>
                  <th style={sty.th}>Received</th>
                  <th style={sty.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inq => (
                  <>
                    <tr key={inq.id} style={{ cursor: 'pointer' }} onClick={() => { setExpanded(expanded === inq.id ? null : inq.id); if (inq.status === 'new') updateStatus(inq.id, 'read'); }}>
                      <td style={sty.td}>
                        <p style={{ fontWeight: 600, color: 'white', margin: 0 }}>{inq.name}</p>
                        <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.35)', margin: '.15rem 0 0' }}>{inq.email}</p>
                        {inq.phone && <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.25)', margin: '.1rem 0 0' }}>{inq.phone}</p>}
                      </td>
                      <td style={sty.td}>
                        <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '.84rem' }}>{inq.subject || '—'}</span>
                      </td>
                      <td style={sty.td}>
                        <span style={{ padding: '.3rem .75rem', borderRadius: '2rem', fontSize: '.75rem', fontWeight: 600, color: statusColor(inq.status), background: statusBg(inq.status), whiteSpace: 'nowrap' }}>
                          {statusLabel(inq.status)}
                        </span>
                      </td>
                      <td style={{ ...sty.td, whiteSpace: 'nowrap', fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
                        {formatDate(inq.created_at)}
                      </td>
                      <td style={sty.td} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                          {inq.status !== 'replied' && (
                            <button onClick={() => updateStatus(inq.id, 'replied')} style={{ padding: '.35rem .75rem', borderRadius: '.5rem', border: 'none', background: 'rgba(68,204,136,.15)', color: '#44cc88', fontSize: '.75rem', cursor: 'pointer', fontWeight: 600 }}>
                              ✅ Mark Replied
                            </button>
                          )}
                          {inq.status === 'new' && (
                            <button onClick={() => updateStatus(inq.id, 'read')} style={{ padding: '.35rem .75rem', borderRadius: '.5rem', border: 'none', background: 'rgba(255,170,0,.1)', color: '#ffaa00', fontSize: '.75rem', cursor: 'pointer', fontWeight: 600 }}>
                              👁 Mark Read
                            </button>
                          )}
                          {inq.email && (
                            <a href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject||'Your Inquiry')}`} onClick={() => updateStatus(inq.id, 'replied')} style={{ padding: '.35rem .75rem', borderRadius: '.5rem', border: 'none', background: 'rgba(237,104,0,.15)', color: '#ed6800', fontSize: '.75rem', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                              📧 Reply
                            </a>
                          )}
                          <button onClick={() => deleteInquiry(inq.id)} style={{ padding: '.35rem .75rem', borderRadius: '.5rem', border: 'none', background: 'rgba(255,80,80,.1)', color: '#ff7070', fontSize: '.75rem', cursor: 'pointer', fontWeight: 600 }}>
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === inq.id && (
                      <tr key={`${inq.id}-expanded`}>
                        <td colSpan={5} style={{ padding: '0' }}>
                          <div style={{ background: 'rgba(237,104,0,.04)', borderBottom: '1px solid rgba(237,104,0,.12)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>Message</p>
                            <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{inq.message || '(no message)'}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '.75rem', textAlign: 'center', marginTop: '1.25rem' }}>
        Click any row to expand the full message. Clicking a "New" row automatically marks it as Read.
      </p>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
