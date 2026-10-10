import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeo from '@/components/AdminSeo';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import { listRedirects, seoOverview } from '@/lib/api/adminSeo';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search redirects|Teracom Solutions',
};

export default async function AdminSeoRedirectsPage() {
  const token = await requireAdminToken();

  let initial = { overview: null, total: 0, redirects: [] };
  let loadError = '';
  try {
    const [overview, list] = await Promise.all([seoOverview(token), listRedirects(token, 'proposed')]);
    initial = { overview, ...list };
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the list from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Search
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Google still shows people addresses from the old shop, and those pages no longer exist, so a visitor who clicks one sees &quot;not found&quot;. This page lists those old addresses (found from your Google Search Console connection) and the page on this website each one should go to. A <strong>redirect</strong> sends the visitor, and Google, from the old address to the new page.</p>
          <h4>What goes live by itself</h4>
          <p>When the old address names a category or a brand, is one of the old shop&apos;s own pages (Contact, About, Returns), or people reached it by searching for a product&apos;s part number, the redirect is turned on straight away. These are the <strong>Sure</strong>, <strong>Strong guess</strong> and <strong>Brand page</strong> kinds, and they show on the <em>Live</em> tab.</p>
          <h4>What waits for your yes</h4>
          <p><strong>Possible</strong> and <strong>General page</strong> guesses wait on the <em>Waiting for a yes</em> tab. A General page guess sends the visitor to the Store or Resources, which is better than a dead end but not a close match, so look at it before you say yes.</p>
          <ul>
            <li><strong>Approve</strong> turns the redirect on.</li>
            <li><strong>Change</strong> lets you type the page it should go to (like /store/cctv) and turns it on.</li>
            <li><strong>Reject</strong> sets it aside: that old address is left alone and keeps saying not found.</li>
          </ul>
          <h4>Looking again</h4>
          <p><strong>Search now</strong> asks Google again which pages it shows and checks each one. It also runs by itself once a week. A redirect you have approved, changed or rejected is never changed by a later search. The Google connection is set up under Connections.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Old addresses Google still shows, and the page on this website each one now goes to.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeo initial={initial} />}
    </AdminShell>
  );
}
