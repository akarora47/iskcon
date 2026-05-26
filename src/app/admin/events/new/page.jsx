'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '../EventForm';
import { useToast, ToastContainer } from '../../(panel)/Toast';

export default function NewEvent() {
  const router = useRouter();
  const { toasts, remove, success, error: toastError } = useToast();

  const handleSubmit = async (data) => {
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) { toastError(json.error || 'Something went wrong.', '❌ Error'); return; }
    success('New event created successfully!', '✅ Created');
    setTimeout(() => router.push('/admin/events'), 1000);
  };

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.25rem' }}>New Event</h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: '2rem' }}>Add a new temple event or festival</p>
      <EventForm onSubmit={handleSubmit} />
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
