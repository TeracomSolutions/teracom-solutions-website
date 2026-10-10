import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoOverview from '@/components/AdminSeoOverview';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import { fetchIndexingSummary, fetchPerformance } from '@/lib/api/adminSeoInsights';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search|Teracom Solutions',
};

export default async function AdminSeoOverviewPage() {
  const token = await requireAdminToken();

  let initial = { connected: true, stats: null, status: null, counts: {}, titles: {} };
  let indexing = null;
  let loadError = '';
  try {
    [initial, indexing] = await Promise.all([fetchPerformance(token), fetchIndexingSummary(token)]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the Search figures from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Search
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>How Google shows the website, and what to do to get more visitors from it. The figures come from Google Search Console (connected under Connections) and are pulled once a day; <strong>Refresh</strong> pulls them again now.</p>
          <h4>The numbers</h4>
          <ul>
            <li><strong>Clicks from Google</strong> - people who clicked the site in Google&apos;s results.</li>
            <li><strong>Times shown in Google</strong> - how often the site appeared in results, whether or not anyone clicked.</li>
            <li><strong>Click rate</strong> - clicks as a share of the times shown.</li>
            <li><strong>Average position</strong> - where the site appears in the results: 1 is the very top; page one is 1 to 10. Lower is better.</li>
          </ul>
          <p>Each is the last 28 days against the 28 before. The charts show each week since July, so you can see whether things are recovering.</p>
          <h4>The tabs</h4>
          <ul>
            <li><strong>Opportunities</strong> - searches and pages worth working on, with the extra clicks each could earn.</li>
            <li><strong>Titles</strong> - page titles and descriptions suggested to earn more clicks; a yes puts them on the website at once.</li>
            <li><strong>Indexing</strong> - whether Google has each page, and why not when it has not.</li>
            <li><strong>Health</strong> - the website&apos;s own pages checked every week for broken pages and links, missing or repeated titles and slow pages.</li>
            <li><strong>Redirects</strong> - old addresses from the old shop that Google still shows, and where each now goes.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">How Google shows the website, and what to work on to get more visitors from it.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoOverview initial={initial} indexing={indexing} />}
    </AdminShell>
  );
}
