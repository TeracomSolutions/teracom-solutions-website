import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminPricingManager from '@/components/AdminPricingManager';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { fetchSupplierPricing, fetchTiers } from '@/lib/api/adminPricing';
import { fetchFacets, fetchSheet } from '@/lib/api/adminSheet';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { DEFAULT_FILTERS, sheetParams } from '@/lib/sheetQuery';

export const metadata = {
  title: 'Pricing|Teracom Solutions',
};

export default async function AdminPricingPage() {
  const token = await requireAdminToken();

  let tiers = [];
  let suppliers = [];
  let priceList = { total: 0, skip: 0, limit: 100, tiers: [], products: [] };
  let facets = { total: 0, active: 0, live: 0, categories: [] };
  let loadError = '';

  try {
    [tiers, suppliers, priceList, facets] = await Promise.all([
      fetchTiers(token),
      fetchSupplierPricing(token),
      fetchSheet(token, sheetParams(DEFAULT_FILTERS)),
      fetchFacets(token),
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load pricing from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Pricing
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>One place to see the whole price list and decide what each customer tier pays. A tier pays our <strong>cost</strong> (ex GST, from the supplier&apos;s feed) plus a <strong>markup</strong>, plus GST, rounded to the nearest 5 cents -- so every sale carries a known margin. A tier price never goes above the <strong>RRP</strong>; where the markup would, the customer pays RRP. Products with no cost sell at RRP.</p>
          <h4>Markup on cost by tier</h4>
          <p>The default markup for Member, Silver, Gold and Platinum. Member is any signed-in customer without a tier; Silver, Gold and Platinum come from the customer&apos;s account (the Zoho import brought them across). Visitors who are not signed in see RRP. Clear a box and save to make that tier pay RRP.</p>
          <h4>Per-supplier markups</h4>
          <p>A distributor&apos;s margin is not a manufacturer&apos;s, so a supplier can have its own markup per tier. Blank means the tier markup applies. Also shows each supplier&apos;s product count and when its price list was last imported.</p>
          <h4>Price list</h4>
          <p>Every active product with cost, RRP, each tier&apos;s price (supplier markup first, tier markup otherwise), whether it is live on the website, and when it was last imported. It shows 100 products at a time: use the page buttons under the list, click a heading to sort every product by it, filter by supplier, search by SKU, name or category, or show only what is live. Products come in through <strong>Data Feeds</strong>, and go on the website from <strong>Catalog</strong> with <em>Go live</em>.</p>
          <p>Every change here is recorded in the audit log, and the website picks up new prices within five minutes.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">What each customer tier pays on top of our cost, per-supplier markups, and the whole price list at every tier.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : (
        <AdminPricingManager tiers={tiers} suppliers={suppliers} priceList={priceList} facets={facets} />
      )}
    </AdminShell>
  );
}