'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    // Intercept all fetch calls — if any returns 401, redirect to login
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await origFetch(...args);
      if (res.status === 401) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
        // Only intercept admin API calls
        if (url.includes('/api/admin') || url.includes('/api/')) {
          router.replace('/admin/login');
        }
      }
      return res;
    };
    return () => { window.fetch = origFetch; };
  }, [router]);

  return null;
}
