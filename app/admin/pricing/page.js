import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminPricingManager from '@/components/AdminPricingManager';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { fetchPriceList } from '@/lib/api/adminCatalog';
import { fetchSupplierPricing, fetchTiers } from '@/lib/api/adminPricing';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Pricing|Teracom Solutions',
};

export default async function AdminPricingPage() {
  const token = await requireAdminToken();

  let tiers = [];
  let suppliers = [];
  let priceList = { tiers: [], rows: [], total: 0 };
  let loadError = '';

  try {
    [tiers, suppliers, priceList] = await Promise.all([
      fetchTiers(token),
      fetchSupplierPricing(token),
      fetchPriceList(token),
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
          <p>One place to see the whole price list and decide what each customer tier pays. Every product&apos;s price is its <strong>RRP</strong> as the supplier&apos;s feed lists it (AUD, GST included); a tier is a percentage off that RRP.</p>
          <h4>Tier discounts off RRP</h4>
          <p>The default discount for Silver, Gold and Platinum. A customer&apos;s tier comes from their account (the Zoho import brought them across); customers with no tier pay RRP.</p>
          <h4>Per-supplier overrides</h4>
          <p>A distributor&apos;s margin is not a manufacturer&apos;s, so a supplier can have its own percentage per tier. Blank means the tier default applies. Also shows each supplier&apos;s product count and when its price list was last imported.</p>
          <h4>Price list</h4>
          <p>Every active product with RRP, each tier&apos;s price (override first, tier default otherwise), cost where the feed carried one, and when it was last imported. Filter by supplier or search by SKU, name or category. Products come in through <strong>Store</strong> → Businesses → a supplier → <em>Import into store</em>.</p>
          <p>Every change here is recorded in the audit log. The public store applies these tier prices once it reads this catalogue rather than its built-in product list -- that switch is the next stage.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">Customer price tiers, per-supplier overrides, and the whole price list at every tier.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : (
        <AdminPricingManager tiers={tiers} suppliers={suppliers} priceList={priceList} />
      )}
    </AdminShell>
  );
}
