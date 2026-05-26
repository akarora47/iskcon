'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../EventForm';

export default function EditEvent({ params }) {
  const [initial, setInitial] = useState(null);
  const [error, setError]     = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/events/${params.id}`).then(r => r.json()).then(setInitial);
  }, [params.id]);

  const handleSubmit = async (data) => {
    const res = await fetch(`/api/events/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) { setError(json.error); return; }
    router.push('/admin/events');
  };

  if (!initial) return <p style={{ color: '#555' }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>Edit Event</h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: '2rem' }}>Update event details</p>
      {error && <div style={{ background: 'rgba(255,50,50,.1)', border: '1px solid rgba(255,50,50,.3)', borderRadius: '.75rem', padding: '.875rem', marginBottom: '1rem', color: '#ff7070' }}>⚠ {error}</div>}
      <EventForm onSubmit={handleSubmit} initial={initial} />
    </div>
  );
}
