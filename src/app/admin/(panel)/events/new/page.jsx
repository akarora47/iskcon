'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../EventForm';

export default function NewEvent() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) { setError(json.error); return; }
    router.push('/admin/events');
  };

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>New Event</h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: '2rem' }}>Add a new temple event or festival</p>
      {error && <div style={{ background: 'rgba(255,50,50,.1)', border: '1px solid rgba(255,50,50,.3)', borderRadius: '.75rem', padding: '.875rem', marginBottom: '1rem', color: '#ff7070' }}>⚠ {error}</div>}
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
