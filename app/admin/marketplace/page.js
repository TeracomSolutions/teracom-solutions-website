import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminMarketplace from '@/components/AdminMarketplace';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchMarketplaceStatus, fetchMarketplaceSuppliers, fetchMarketplaceConnections } from '@/lib/api/adminMarketplace';

export const metadata = {
  title: retitle('Marketplace|Teracom Solutions', BRAND),
};

// Marketplace admin page.
export default async function AdminMarketplacePage({ searchParams }) {
  const params = (await searchParams) || {};
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

  let notice = null;
  if (params.connected === 'aliexpress') notice = { tone: 'good', text: 'AliExpress is connected. Press Test on its card to check it.' };
  if (params.failed) notice = { tone: 'bad', text: String(params.reason || 'The sign-in did not finish.') };

  return (
    <AdminShell>
      <AdminStoreTabs />
      <h1 className="admin-heading">Marketplace</h1>
      <p className="lead">Products from outside suppliers: set up each supplier, search it or import its products as drafts, approve them, and send supplier orders after you check them. Supplier orders stay switched off until you allow them in Settings.</p>
      <AdminMarketplace initial={{ status, suppliers, connections, notice }} />
    </AdminShell>
  );
}
