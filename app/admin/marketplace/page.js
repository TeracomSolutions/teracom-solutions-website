import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminMarketplace from '@/components/AdminMarketplace';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchMarketplaceStatus, fetchMarketplaceSuppliers, fetchMarketplaceConnections } from '@/lib/api/adminMarketplace';

export const metadata = {
  title: 'Marketplace|Teracom Solutions',
};

// Marketplace admin page.
export default async function AdminMarketplacePage() {
  const token = await requireAdminToken();

  let status = null;
  let suppliers = [];
  let connections = [];

  try {
    status = await fetchMarketplaceStatus(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }

  try {
    suppliers = (await fetchMarketplaceSuppliers(token)).suppliers || [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }

  try {
    connections = await fetchMarketplaceConnections(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
  }

  return (
    <AdminShell>
      <AdminStoreTabs />
      <h1 className="admin-heading">Marketplace</h1>
      <p className="lead">Products from outside suppliers: set up each supplier, search it or import its products as drafts, approve them, and send supplier orders after you check them. Supplier orders stay switched off until you allow them in Settings.</p>
      <AdminMarketplace initial={{ status, suppliers, connections }} />
    </AdminShell>
  );
}
