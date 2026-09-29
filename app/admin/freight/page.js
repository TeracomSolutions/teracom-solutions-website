import { redirect } from 'next/navigation';

import AdminFreightSettings from '@/components/AdminFreightSettings';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { getFreightSettings } from '@/lib/api/adminFreight';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Freight|Teracom Solutions',
};

export default async function AdminFreightPage() {
  const token = await requireAdminToken();

  let settings = null;
  let loadError = '';
  try {
    settings = await getFreightSettings(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the freight settings from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Freight
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>What customers pay for delivery. Every price includes GST and is never less than the <strong>minimum charge</strong> set below, whichever way it is worked out.</p>
          <h4>How a price is worked out</h4>
          <ul>
            <li>Each product&apos;s <strong>chargeable weight</strong> is the greater of its real weight and its cubic weight (length × width × height in metres × 250). A product with no weight or size yet counts as the default parcel.</li>
            <li><strong>Our own rate</strong>: the minimum charge covers the first few kilos; each extra kilo or part of one adds the amount you set.</li>
            <li><strong>Australia Post</strong> and <strong>StarTrack</strong>: live prices for the customer&apos;s postcode, lifted to the minimum when lower.</li>
            <li>The customer enters their postcode in the cart, sees the cheapest price, and picks from every option that is switched on when they pay.</li>
          </ul>
          <h4>Carrier keys</h4>
          <ul>
            <li>Australia Post: a free Postage Assessment Calculator key from developers.auspost.com.au.</li>
            <li>StarTrack: needs a StarTrack business account; the API key, password and account number come from the Australia Post developer centre for that account.</li>
            <li>Keys are stored encrypted and never shown again. If a carrier does not answer, our own rate is used so checkout never stops.</li>
          </ul>
          <h4>Try a quote</h4>
          <p>Shows what a customer would be offered for one product sent to a postcode, with any carrier errors underneath.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">Delivery prices for the online store: a minimum charge, then worked out from size and weight, with Australia Post and StarTrack as options.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminFreightSettings initial={settings} />}
    </AdminShell>
  );
}