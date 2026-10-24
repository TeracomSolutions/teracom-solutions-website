import { redirect } from 'next/navigation';

import AdminMarketing from '@/components/AdminMarketing';
import AdminShell from '@/components/AdminShell';
import { fetchMarketing } from '@/lib/api/adminMarketing';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Marketing|Teracom Solutions', BRAND),
};

export default async function AdminMarketingPage() {
  const token = await requireAdminToken();
  let data = null;
  try {
    data = await fetchMarketing(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }
  return (
    <AdminShell>
      <h1 className="admin-heading">Marketing</h1>
      <p className="lead">The specials and offers that are on: shown in a banner across the website while they run, and sent once a week to customers and every social network.</p>
      {data ? <AdminMarketing initial={data} /> : <p className="form-error" role="alert">Unable to load the campaigns from the backend.</p>}
    </AdminShell>
  );
}
