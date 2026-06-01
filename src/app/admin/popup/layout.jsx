import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '../(panel)/AdminSidebar';

export const metadata = { title: 'Event Popup — ISKCON Ayodhya Admin' };

export default async function PopupAdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0400', fontFamily: 'system-ui,sans-serif' }}>
      <AdminSidebar adminName={session.name} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
