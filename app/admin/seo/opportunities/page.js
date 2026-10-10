import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoOpportunities from '@/components/AdminSeoOpportunities';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminShell from '@/components/AdminShell';
import { fetchOpportunities, fetchPerformance } from '@/lib/api/adminSeoInsights';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search opportunities|Teracom Solutions',
};

const KINDS = ['striking', 'ctr', 'gaps', 'rising', 'falling'];

export default async function AdminSeoOpportunitiesPage({ searchParams }) {
  const token = await requireAdminToken();
  const params = await searchParams;
  const kind = KINDS.includes(params?.kind) ? params.kind : 'striking';

  let initial = { kind, total: 0, rows: [] };
  let counts = {};
  let loadError = '';
  try {
    const [list, performance] = await Promise.all([fetchOpportunities(token, kind), fetchPerformance(token)]);
    initial = list;
    counts = performance.counts || {};
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
          <p>Where the site can earn more visitors from Google, worked out from the searches Google reports for the last 90 days. Each list is the biggest first, with the extra clicks a month it could earn.</p>
          <ul>
            <li><strong>One push from page one</strong> - a search where a page sits at position 4 to 20. The figure is what it would earn at position 3. Better content on the page, more links to it and a better title all help.</li>
            <li><strong>Shown but not clicked</strong> - a page Google shows often that few people click. <em>Suggest a better title</em> asks the AI for a new title and description, written only from what the page says and what people searched; <em>Use these now</em> puts them on the website, and <em>Not these</em> sets them aside.</li>
            <li><strong>Weak or missing pages</strong> - a search people make where the site shows at position 20 or lower. A page or an article for it may be missing.</li>
            <li><strong>Rising searches</strong> and <strong>Falling searches</strong> - what Google showed the site for more or less over the last 28 days than the 28 before.</li>
          </ul>
          <p>The lists fill in as Google shows the site more. Titles can be changed for product, category, brand, service, monitoring and article pages and the home page.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">What to work on to get more visitors from Google.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoOpportunities initial={initial} counts={counts} initialKind={kind} />}
    </AdminShell>
  );
}
