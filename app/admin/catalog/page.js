import { redirect } from 'next/navigation';

import AdminCatalogGrid from '@/components/AdminCatalogGrid';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchPriceList, listCatalogProducts } from '@/lib/api/adminCatalog';
import { fetchSupplierPricing } from '@/lib/api/adminPricing';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Store Catalog|Teracom Solutions',
};

// The whole catalogue as one working sheet: every product, every column,
// edited in place, with cost, RRP, margin and the tier prices side by side.
export default async function AdminCatalogPage() {
  const token = await requireAdminToken();

  let products = [];
  let tiers = [];
  let tierPrices = {};
  let suppliers = [];
  let loadError = '';

  try {
    const [list, priceList, supplierSummaries] = await Promise.all([
      listCatalogProducts(token, { skip: 0, limit: 5000, includeInactive: true }),
      fetchPriceList(token, { includeInactive: true }),
      fetchSupplierPricing(token),
    ]);
    products = list.products;
    tiers = priceList.tiers;
    tierPrices = Object.fromEntries(priceList.rows.map((row) => [row.id, row.tier_prices_cents]));
    suppliers = supplierSummaries;
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the catalogue from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Store Catalog
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Every product the store can sell, in one sheet you can flick through and correct. Products arrive here from supplier price lists (Businesses &amp; Suppliers → a supplier → <em>Import into store</em>, or an automatic feed) and from <em>Add product</em> for a one-off that no feed carries.</p>
          <h4>Columns</h4>
          <ul>
            <li><strong>Cost</strong> is what the supplier charges us, ex GST. <strong>RRP</strong> is the shelf price, inc GST; <strong>Ex GST</strong> is RRP ÷ 1.1.</li>
            <li><strong>Margin</strong> is Ex GST minus Cost, in dollars and as a percentage of Ex GST. Red is below cost, amber under 15%.</li>
            <li><strong>Silver / Gold / Platinum</strong> are what each customer tier pays, from the Pricing page (supplier override first, then the tier default).</li>
            <li><strong>Active</strong> off takes a product out of the store without losing it: the row stays so a re-import updates it rather than duplicating it, and its history survives. An inactive row shows <em>Delete permanently</em> if you really want it gone -- but if a supplier feed still lists the SKU, the next pull creates it again.</li>
          </ul>
          <h4>Editing</h4>
          <p>Type straight into a row -- name, brand, category, supplier, cost, RRP, stock, active -- and its <em>Save</em> button appears; each save is recorded in the audit log with the before and after values.</p>
          <h4>Re-price from cost</h4>
          <p>Sets RRP = Cost × (1 + markup) × 1.1 (GST), rounded to the nearest 5 cents, for the rows currently shown or for one supplier. <em>Preview</em> shows how many would change and a few examples; nothing moves until you click <em>Apply</em>. Products without a cost are skipped.</p>
          <h4>Export</h4>
          <p><em>Export CSV</em> downloads the rows currently shown with every column.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Every product with cost, RRP, margin and tier prices. Edit in place, add a one-off, or re-price a set from cost.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : (
        <AdminCatalogGrid products={products} tiers={tiers} tierPrices={tierPrices} suppliers={suppliers} />
      )}
    </AdminShell>
  );
}
