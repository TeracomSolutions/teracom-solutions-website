import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoIndexing from '@/components/AdminSeoIndexing';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import { fetchIndexingPages, fetchIndexingSummary } from '@/lib/api/adminSeoInsights';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search indexing|Teracom Solutions',
};

export default async function AdminSeoIndexingPage() {
  const token = await requireAdminToken();

  let initial = { summary: {}, total: 0, pages: [] };
  let loadError = '';
  try {
    const [summary, pages] = await Promise.all([fetchIndexingSummary(token), fetchIndexingPages(token)]);
    initial = { summary, ...pages };
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
          <p>A page that Google has not added to its index can never be found in a search. This lists every page of the website with Google&apos;s own verdict on it, a few thousand a day (Google allows 2,000 checks a day), so the whole site is covered over a few days and then re-checked every week.</p>
          <h4>The states</h4>
          <ul>
            <li><strong>In Google</strong> - Google has the page and can show it.</li>
            <li><strong>Seen, not added</strong> - Google found the page and chose not to add it yet. Thin pages with no photo or little text wait here.</li>
            <li><strong>Not found by Google</strong> - Google does not know the address yet. The sitemap and links from other pages help it find them.</li>
            <li><strong>Problem</strong> - Google could not use the page (not found, a server error, access refused).</li>
            <li><strong>Duplicate</strong> - Google thinks the page copies another and shows the other.</li>
            <li><strong>Left out</strong> - kept out of Google on purpose (a noindex tag or robots.txt).</li>
            <li><strong>Moved</strong> - the address sends visitors to another page.</li>
            <li><strong>Not checked yet</strong> - waiting for its turn.</li>
          </ul>
          <p>Click a number to list only those pages. The Page list can be narrowed by kind of page or part of an address.</p>
          <h4>What you can do</h4>
          <ul>
            <li><strong>Check now</strong> starts today&apos;s checks (the page also checks by itself once a day).</li>
            <li><strong>Tell Google about the sitemap</strong> asks Google to read the sitemap again, so it finds new pages sooner. The sitemap&apos;s own status from Google shows above the list.</li>
            <li>Tick product pages and press <strong>Find photos and text for the selected</strong> to send the ones with no photo or description to Photos &amp; text.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Whether Google has each page of the website, and why not when it has not.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoIndexing initial={initial} />}
    </AdminShell>
  );
}
