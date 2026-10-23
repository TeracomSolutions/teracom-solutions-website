import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import AdminSeoShopping from '@/components/AdminSeoShopping';
import AdminSeoMerchant from '@/components/AdminSeoMerchant';
import { fetchMerchant } from '@/lib/api/adminSeoInsights';
import { getAllProducts } from '@/lib/catalogue';
import { summarise, FEED_CODES, listProducts } from '@/lib/shoppingFeed';
import { SITE_ORIGIN } from '@/lib/seo';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Website Data shopping|Teracom Solutions', BRAND),
};

export default async function AdminSeoShoppingPage() {
  const token = await requireAdminToken();

  let initial = { summary: { hardware: 0, ready: 0, counts: {}, codes: [] }, total: 0, products: [] };
  let merchant = null;
  let loadError = '';
  try {
    merchant = await fetchMerchant(token);
  } catch (err) {
    merchant = null;
  }
  try {
    const products = await getAllProducts();
    const summary = summarise(products);

    // Build codes array with counts
    const codes = Object.entries(FEED_CODES).map(([code, { severity, label, help }]) => ({
      code,
      severity,
      label,
      help,
      count: summary.counts[code]
    }));

    // Get products with problems (using the listProducts function)
    const matches = listProducts(products, '', '');

    initial = {
      summary: { ...summary, codes },
      total: matches.length,
      products: matches.slice(0, 100)
    };
  } catch (err) {
    loadError = 'Unable to load the products.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Website Data
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>The store&apos;s products can be sent to Google Merchant Center as a feed so they can appear in free Google Shopping listings. This page shows which products are ready and which are not.</p>

          <h4>Product requirements</h4>
          <p>A product needs a photo, a description of at least 40 characters, a brand and a price to be sent to Google. A barcode number helps Google match it but is not required.</p>

          <h4>How to read this page</h4>
          <ul>
            <li>The boxes along the top count how many products have each kind of problem. Click one to list only those products; click it again to see every product with a problem.</li>
            <li><strong>Problem</strong> kinds stop visitors or Google using a product. <strong>Note</strong> kinds are usually on purpose and do not prevent a product from being sent.</li>
            <li>The list shows products that have problems preventing them from being sent to Google Shopping.</li>
          </ul>

          <h4>Things to know</h4>
          <p>Products without a photo or description can be found by filtering the Store tab for &quot;Photos and text&quot;. The feed address is at the top of this page. Setting up the Google Merchant Center account itself is done once by staff, with the steps in the admin guide under Search, Shopping.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Check which products are ready to send to Google Shopping and fix any problems that prevent them from being sent.</p>
      <AdminSeoTabs />

      {merchant ? <AdminSeoMerchant initial={merchant} /> : null}
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoShopping initial={initial} feedUrl={SITE_ORIGIN + '/feeds/google-shopping.xml'} />}
    </AdminShell>
  );
}