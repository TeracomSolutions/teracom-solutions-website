import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminMarketplace from '@/components/AdminMarketplace';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchMarketplaceStatus } from '@/lib/api/adminMarketplace';

export const metadata = {
  title: 'Marketplace|Teracom Solutions',
};

// Marketplace admin page.
export default async function AdminMarketplacePage() {
  const token = await requireAdminToken();

  let status = null;
  try {
    status = await fetchMarketplaceStatus(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    status = null;
  }

  return (
    <AdminShell>
      <AdminStoreTabs />
      <h1 className="admin-heading">Marketplace</h1>
      <p className="lead">Products from outside suppliers: import them as drafts, approve them, and send supplier orders after you check them. Everything starts switched off.</p>
      <AdminMarketplace status={status} />
    </AdminShell>
  );
}
