'use client';
import React, { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '../Toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { toasts, remove, success, error: toastError } = useToast();

  const load = () => {
    setLoading(true);
    fetch('/api/bookings').then(r => r.json()).then(d => { setBookings(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const updateStatus = async (id, status, name) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const label = status === 'confirmed' ? '✅ Confirmed' : status === 'cancelled' ? '❌ Cancelled' : '⏳ Pending';
      success(`"${name}" marked as ${label}${(status === 'confirmed' || status === 'cancelled') ? ' — Email sent to guest.' : '.'}`, '🔄 Status Updated');
    } else {
      toastError('Failed to update status. Please try again.', '❌ Error');
    }
    load();
  };

  const deleteBooking = async (id, name) => {
    if (!confirm(`Delete booking for "${name}"?`)) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (expanded === id) setExpanded(null);
    success(`Booking for "${name}" deleted.`, '🗑️ Deleted');
    load();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const sty = {
    card: { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    th:   { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left', whiteSpace: 'nowrap' },
    td:   { padding: '.75rem 1rem', fontSize: '.84rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' },
  };

  const statusColor = (s) => ({ confirmed: '#44cc88', cancelled: '#ff7070', pending: '#ffaa00' }[s] || '#888');
  const statusBg    = (s) => ({ confirmed: 'rgba(68,204,136,.12)', cancelled: 'rgba(255,80,80,.1)', pending: 'rgba(255,170,0,.1)' }[s] || 'transparent');
  const count = (s) => s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>Manage all room booking requests</p>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {['all','pending','confirmed','cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '.45rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.8rem',
              background: filter === s ? '#ed6800' : 'rgba(255,255,255,.07)',
              color:      filter === s ? 'white'   : 'rgba(255,255,255,.5)' }}>
              {s === 'pending' ? '⏳' : s === 'confirmed' ? '✅' : s === 'cancelled' ? '❌' : '📋'} {s.charAt(0).toUpperCase()+s.slice(1)} ({count(s)})
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total',     value: bookings.length,               color: '#ed6800' },
          { label: 'Pending',   value: count('pending'),              color: '#ffaa00' },
          { label: 'Confirmed', value: count('confirmed'),            color: '#44cc88' },
          { label: 'Cancelled', value: count('cancelled'),            color: '#ff7070' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a0d00', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)', marginTop: '.25rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={sty.card}>
        {loading ? <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={sty.th}>Guest</th>
                <th style={sty.th}>Contact</th>
                <th style={sty.th}>Room</th>
                <th style={sty.th}>Dates</th>
                <th style={sty.th}>Guests</th>
                <th style={sty.th}>Status</th>
                <th style={sty.th}>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(b => (
                  <React.Fragment key={b.id}>
                    <tr onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                      style={{ cursor: 'pointer', background: expanded === b.id ? 'rgba(237,104,0,.04)' : 'transparent' }}>
                      <td style={sty.td}>
                        <div style={{ fontWeight: 600, color: 'white' }}>{b.name}</div>
                        {b.special_requests && (
                          <div style={{ fontSize: '.7rem', color: '#ed6800', marginTop: '.2rem' }}>📝 Has special request</div>
                        )}
                      </td>
                      <td style={sty.td}>
                        <div style={{ fontSize: '.78rem' }}>{b.email}</div>
                        <div style={{ fontSize: '.75rem', color: '#777' }}>{b.phone}</div>
                      </td>
                      <td style={sty.td}><span style={{ color: '#ffd89b', fontWeight: 600 }}>{b.room_name}</span></td>
                      <td style={sty.td}>
                        <div style={{ fontSize: '.78rem' }}>{b.check_in ? new Date(b.check_in).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</div>
                        <div style={{ fontSize: '.72rem', color: '#777' }}>{b.check_out ? '→ ' + new Date(b.check_out).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
                      </td>
                      <td style={sty.td}>{b.guests || 1}</td>
                      <td style={{ ...sty.td }} onClick={e => e.stopPropagation()}>
                        <select value={b.status || 'pending'} onChange={e => updateStatus(b.id, e.target.value, b.name)}
                          style={{ background: statusBg(b.status), color: statusColor(b.status), border: `1px solid ${statusColor(b.status)}44`, borderRadius: '2rem', padding: '.3rem .85rem', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td style={{ ...sty.td }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                          style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem', marginRight: '.5rem' }}>
                          {expanded === b.id ? '▲' : '▼'}
                        </button>
                        <button onClick={() => deleteBooking(b.id, b.name)}
                          style={{ color: '#ff7070', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>🗑</button>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded === b.id && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div style={{ background: 'rgba(237,104,0,.05)', borderBottom: '1px solid rgba(237,104,0,.12)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
                            <div>
                              <p style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.35rem' }}>Guest Details</p>
                              <p style={{ fontSize: '.88rem', color: 'white', fontWeight: 600 }}>{b.name}</p>
                              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>{b.email}</p>
                              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>{b.phone || '—'}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.35rem' }}>Stay Details</p>
                              <p style={{ fontSize: '.88rem', color: '#ffd89b', fontWeight: 600 }}>{b.room_name}</p>
                              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>
                                {b.check_in ? new Date(b.check_in).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} →{' '}
                                {b.check_out ? new Date(b.check_out).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                              </p>
                              <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>{b.guests || 1} guest(s)</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.35rem' }}>Special Requests</p>
                              <p style={{ fontSize: '.88rem', color: b.special_requests ? '#ffd89b' : 'rgba(255,255,255,.3)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                                {b.special_requests || 'None'}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.35rem' }}>Received On</p>
                              <p style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.55)' }}>
                                {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </p>
                              <div style={{ marginTop: '.75rem' }}>
                                {b.email && (
                                  <a href={`mailto:${b.email}?subject=Your Booking at ISKCON Ayodhya`}
                                    style={{ display: 'inline-block', padding: '.35rem .9rem', background: 'rgba(237,104,0,.15)', color: '#ed6800', borderRadius: '.5rem', fontSize: '.78rem', fontWeight: 600, textDecoration: 'none' }}>
                                    📧 Email Guest
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ ...sty.td, textAlign: 'center', color: '#555', padding: '2rem' }}>No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '.75rem', textAlign: 'center', marginTop: '1.25rem' }}>
        Click any row to expand full details including special requests.
      </p>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
