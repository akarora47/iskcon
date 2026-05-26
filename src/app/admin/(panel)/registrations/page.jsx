'use client';
import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '../Toast';

export default function AdminRegistrations() {
  const [regs, setRegs]       = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const { toasts, remove, success } = useToast();

  const load = () => {
    setLoading(true);
    fetch('/api/registrations').then(r => r.json()).then(d => { setRegs(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const fullName = (r) => [r.first_name, r.last_name].filter(Boolean).join(' ');

  const filtered = regs.filter(r =>
    fullName(r).toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.event_name?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteReg = async (id) => {
    if (!confirm('Delete this registration?')) return;
    await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
    success('Registration deleted.', '🗑️ Deleted');
    load();
  };

  const sty = {
    card: { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    th:   { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left' },
    td:   { padding: '.75rem 1rem', fontSize: '.84rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' },
  };

  // Count registrations per event (use event_name stored at registration time)
  const eventCounts = regs.reduce((acc, r) => {
    const key = r.event_name || r.event_display_name || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Event Registrations</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>
            {regs.length} total registrations across {Object.keys(eventCounts).length} events
          </p>
        </div>
        <input
          placeholder="🔍  Search by name, email, or event…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(237,104,0,.2)', borderRadius: '.6rem', padding: '.55rem 1rem', color: 'white', fontSize: '.85rem', outline: 'none', width: '280px' }}
        />
      </div>

      {/* Event summary pills */}
      {!loading && Object.keys(eventCounts).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1.5rem' }}>
          {Object.entries(eventCounts).map(([evName, count]) => (
            <button key={evName} onClick={() => setSearch(search === evName ? '' : evName)}
              style={{ padding: '.3rem .9rem', borderRadius: '2rem', border: `1px solid rgba(237,104,0,${search === evName ? '.6' : '.2'})`, background: search === evName ? 'rgba(237,104,0,.2)' : 'rgba(237,104,0,.06)', color: search === evName ? '#ffd89b' : 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}>
              {evName} ({count})
            </button>
          ))}
        </div>
      )}

      <div style={sty.card}>
        {loading ? <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={sty.th}>#</th><th style={sty.th}>Name</th><th style={sty.th}>Contact</th>
                <th style={sty.th}>Event</th><th style={sty.th}>Guests</th><th style={sty.th}>Registered On</th><th style={sty.th}>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ ...sty.td, color: 'rgba(255,255,255,.3)', fontSize: '.75rem' }}>{i + 1}</td>
                    <td style={sty.td}><div style={{ fontWeight: 600, color: 'white' }}>{fullName(r)}</div>{r.city && <div style={{ fontSize: '.72rem', color: '#777' }}>{r.city}</div>}</td>
                    <td style={sty.td}>
                      <div style={{ fontSize: '.78rem' }}>{r.email}</div>
                      <div style={{ fontSize: '.75rem', color: '#777' }}>{r.phone}</div>
                    </td>
                    <td style={sty.td}>
                      <span style={{ background: 'rgba(237,104,0,.12)', color: '#ffd89b', padding: '.2rem .6rem', borderRadius: '.3rem', fontSize: '.78rem', fontWeight: 600 }}>
                        {r.event_name || r.event_display_name || '—'}
                      </span>
                    </td>
                    <td style={sty.td}>{r.attendees || 1}</td>
                    <td style={sty.td}><span style={{ fontSize: '.78rem' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span></td>
                    <td style={sty.td}>
                      {r.special_requests && <span title={r.special_requests} style={{ color: '#888', fontSize: '.8rem', marginRight: '.5rem' }}>📝</span>}
                      <button onClick={() => deleteReg(r.id)} style={{ color: '#ff7070', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.85rem' }}>🗑</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ ...sty.td, textAlign: 'center', color: '#555', padding: '2rem' }}>
                    {search ? `No registrations matching "${search}"` : 'No registrations yet'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
