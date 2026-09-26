import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminWebsiteData from '@/components/AdminWebsiteData';
import { fetchAnalyticsSummary } from '@/lib/api/adminAnalytics';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Website Data|Teracom Solutions',
};

export default async function AdminWebsiteDataPage({ searchParams }) {
  const token = await requireAdminToken();
  const params = await searchParams;
  const days = [7, 30, 90].includes(Number(params?.days)) ? Number(params.days) : 30;

  let summary = null;
  let loadError = '';
  try {
    summary = await fetchAnalyticsSummary(token, days);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load visitor data from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Website Data
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Who is visiting the website: how many page views and visitors, the daily trend, the most-read pages, where people arrived from, which countries and states, and what device they used. Each figure is compared with the period before it.</p>
          <h4>Where the numbers come from</h4>
          <p>The website itself records every public page view to our own backend on VM 101 (a small beacon on each page). A visitor is counted once per day by an anonymous code made from their address and browser with a daily salt -- nobody can be identified from it and no address is stored. Known bots and crawlers are ignored, and so are admin pages. Google Analytics keeps running alongside; this is the copy we own.</p>
          <h4>Reading it</h4>
          <ul>
            <li><strong>Page views</strong> - every page load. <strong>Visitors</strong> - distinct people per day, summed over the period.</li>
            <li><strong>Where visitors came from</strong> - the site that linked to us; <em>(direct)</em> means they typed the address, used a bookmark, or came from an email or app that hides the source.</li>
            <li><strong>Top pages</strong> - what people actually read; the Share bar is that page&apos;s slice of all views.</li>
            <li>Days run midnight to midnight, Sydney time. Recording started the day this page went live, so the first comparison period will be short.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Visitors, pages, sources and devices for the public website, from our own records.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminWebsiteData summary={summary} days={days} />}
    </AdminShell>
  );
}
