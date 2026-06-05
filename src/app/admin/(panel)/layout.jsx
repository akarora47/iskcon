import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';
import SessionGuard from './SessionGuard';

export const metadata = { title: 'Admin Panel — ISKCON Ayodhya' };

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0400', fontFamily: 'system-ui,sans-serif' }}>
      <SessionGuard />
      <AdminSidebar adminName={session.name} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
