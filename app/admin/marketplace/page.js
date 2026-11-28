import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
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
      <h1 className="admin-heading">
        Marketplace
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Products from dropshipping and wholesale suppliers (CJ Dropshipping, AliExpress and others, or any supplier by spreadsheet): search or import them as drafts with your markup, approve them to go live in the store, and send their orders to the supplier.</p>
          <h4>Good to know</h4>
          <p><strong>Read-only</strong> is the normal setting; sending orders to suppliers is a separate switch, off until you turn it on, and every order still needs your approval. Each supplier&apos;s <strong>Set up key</strong> has its own steps. A product priced at or below cost is refused.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Products from outside suppliers: set up each supplier, search it or import its products as drafts, approve them, and send supplier orders after you check them. Supplier orders stay switched off until you allow them in Settings.</p>
      <AdminMarketplace initial={{ status, suppliers, connections, notice }} />
    </AdminShell>
  );
}
