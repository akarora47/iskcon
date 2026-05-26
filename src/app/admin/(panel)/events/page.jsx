'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/events').then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const deleteEvent = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    load();
  };

  const toggle = async (ev) => {
    await fetch(`/api/events/${ev.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ev, active: ev.active ? 0 : 1 }),
    });
    load();
  };

  const sty = {
    card: { background: '#1a0d00', border: '1px solid rgba(237,104,0,.2)', borderRadius: '1rem', padding: '1.5rem' },
    th:   { padding: '.75rem 1rem', fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(237,104,0,.1)', textAlign: 'left', whiteSpace: 'nowrap' },
    td:   { padding: '.75rem 1rem', fontSize: '.85rem', color: 'rgba(255,255,255,.75)', borderBottom: '1px solid rgba(255,255,255,.04)', verticalAlign: 'middle' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Events</h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', marginTop: '.25rem' }}>Manage all temple events and festivals</p></div>
        <Link href="/admin/events/new" style={{ background: 'linear-gradient(135deg,#c45500,#ed6800)', color: 'white', textDecoration: 'none', padding: '.65rem 1.4rem', borderRadius: '.875rem', fontWeight: 600, fontSize: '.88rem' }}>
          + New Event
        </Link>
      </div>

      <div style={sty.card}>
        {loading ? <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={sty.th}>Name</th><th style={sty.th}>Date</th>
                  <th style={sty.th}>Category</th><th style={sty.th}>Featured</th><th style={sty.th}>Status</th><th style={sty.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td style={sty.td}>
                      <div style={{ fontWeight: 600, color: 'white' }}>{ev.name}</div>
                    </td>
                    <td style={sty.td}>{ev.date} {ev.month} {ev.year}</td>
                    <td style={sty.td}><span style={{ background: 'rgba(237,104,0,.1)', color: '#ed6800', padding: '.2rem .6rem', borderRadius: '2rem', fontSize: '.72rem' }}>{ev.category}</span></td>
                    <td style={sty.td}>{ev.featured ? <span style={{ color: '#ffd700' }}>⭐ Yes</span> : <span style={{ color: '#555' }}>No</span>}</td>
                    <td style={sty.td}>
                      <button onClick={() => toggle(ev)} style={{ border: 'none', borderRadius: '2rem', padding: '.25rem .75rem', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer',
                        background: ev.active ? 'rgba(68,204,136,.15)' : 'rgba(255,80,80,.12)',
                        color: ev.active ? '#44cc88' : '#ff7070' }}>
                        {ev.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={sty.td}>
                      <Link href={`/admin/events/${ev.id}`} style={{ color: '#4488ff', textDecoration: 'none', fontSize: '.8rem', marginRight: '.75rem' }}>✏ Edit</Link>
                      <button onClick={() => deleteEvent(ev.id, ev.name)} style={{ color: '#ff7070', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan="6" style={{ ...sty.td, textAlign: 'center', color: '#555', padding: '2rem' }}>No events found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
