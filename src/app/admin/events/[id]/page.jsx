'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../EventForm';
import { useToast, ToastContainer } from '../../(panel)/Toast';

export default function EditEvent({ params }) {
  const { id } = use(params);
  const [initial, setInitial] = useState(null);
  const router = useRouter();
  const { toasts, remove, success, error: toastError } = useToast();

  useEffect(() => {
    fetch(`/api/events/${id}`).then(r => r.json()).then(setInitial);
  }, [id]);

  const handleSubmit = async (data) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { toastError(json.error || 'Something went wrong.', '❌ Error'); return; }
    success('Event updated successfully!', '✏️ Updated');
    setTimeout(() => router.push('/admin/events'), 1000);
  };

  if (!initial) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <p style={{ color: 'rgba(255,255,255,.4)' }}>Loading event…</p>
    </div>
  );

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>Edit Event</h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: '2rem' }}>Update event details</p>
      <EventForm onSubmit={handleSubmit} initial={initial} />
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
