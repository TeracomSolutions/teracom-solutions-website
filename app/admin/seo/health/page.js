import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoHealth from '@/components/AdminSeoHealth';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import { fetchHealthPages, fetchHealthSummary } from '@/lib/api/adminSeoInsights';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search health|Teracom Solutions',
};

export default async function AdminSeoHealthPage() {
  const token = await requireAdminToken();

  let initial = { summary: { total: 0, clean: 0, codes: [], status: {} }, total: 0, pages: [] };
  let loadError = '';
  try {
    const [summary, pages] = await Promise.all([fetchHealthSummary(token), fetchHealthPages(token)]);
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
          <p>Once a week the website checks every page of itself the way Google does, and lists what is wrong: pages that do not load, links that lead nowhere, missing or repeated titles and descriptions, pictures with no description, slow pages and more. It needs nothing from Google. <strong>Check now</strong> starts a check straight away; it takes about ten minutes.</p>
          <h4>How to read it</h4>
          <ul>
            <li>The boxes along the top count the pages with each kind of problem. Click one to list only those pages; click it again to see every page with a problem.</li>
            <li><strong>Problem</strong> kinds stop visitors or Google using a page. <strong>To improve</strong> kinds cost visitors or ranking. <strong>For information</strong> kinds are usually on purpose.</li>
            <li>Each row says what is wrong with the page and a few words on exactly where.</li>
            <li>For a title or description problem, <strong>Suggest a better title</strong> asks the AI for new wording, which then waits for your yes on the Titles tab.</li>
          </ul>
          <h4>Things to know</h4>
          <p>Product pages kept out of Google because they have no photo or description yet are listed as <em>Kept out of Google on purpose</em>; they fill in as Photos &amp; text fills them. Slow pages are often one-off: a page that has not been visited for a while takes longer the first time. If the same page is slow week after week, it needs looking at.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">What is wrong with the website&apos;s own pages, found by checking each one every week.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoHealth initial={initial} />}
    </AdminShell>
  );
}
