import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSpecials from '@/components/AdminSpecials';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { listSpecials } from '@/lib/api/adminSpecials';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Specials|Teracom Solutions', BRAND),
};

// Store > Specials (Robert, 2026-11-02): hot specials and clearance prices, shown on
// /store/specials, on every tile and product page, and sent to Google Shopping.
export default async function AdminSpecialsPage() {
  const token = await requireAdminToken();
  let promos = [];
  let loadError = '';
  try {
    promos = (await listSpecials(token)).promos || [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the specials from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Specials
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Put products on a <strong>hot special</strong> or on <strong>clearance</strong> to draw people to the store. The product shows a badge and the price it was, appears on the Specials page of the store (linked from the store front), and Google Shopping shows it as on sale.</p>
          <h4>Prices</h4>
          <p>The special price includes GST and is what everyone pays: visitors, members and trade tiers, unless a customer&apos;s own price is already lower. A hot special cannot go below cost; clearance can, for old stock you want gone. The Margin column goes red when a special sells below cost.</p>
          <h4>Ending</h4>
          <p>With an end date the product goes back to its normal price after that day by itself. Without one it stays on special until you press the bin. Changes reach the website within five minutes. Every change is in the Audit log.</p>
          <h4>Promoting a special</h4>
          <p><strong>Post it</strong> (on a special that is on the website) opens Social &gt; Posting with the post already written: the price, the price it was, the end date, the product link and its photo. Tick Facebook, Instagram and the rest, check each network&apos;s tab, then send or schedule it. Specials also reach Facebook and Instagram shop ads through the Meta catalogue when Meta is set up on Connections.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">Hot specials and clearance: one price everybody pays, with the normal price struck through, until the end date.</p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSpecials initial={promos} />}
    </AdminShell>
  );
}
