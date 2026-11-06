import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminNewsSources from '@/components/AdminNewsSources';
import AdminResourcesTabs from '@/components/AdminResourcesTabs';
import AdminShell from '@/components/AdminShell';
import { fetchNewsSourcesAdmin } from '@/lib/api/adminIndustryNews';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Industry news|Teracom Solutions', BRAND),
};

export default async function AdminIndustryNewsPage() {
  const token = await requireAdminToken();
  let data = null;
  let loadError = '';
  try {
    data = await fetchNewsSourcesAdmin(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the Industry news publications from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Resources
        <AdminHelpIcon>
          <h4>Industry news</h4>
          <p>The website&apos;s Resources &gt; Industry news page and the homepage news ticker show the latest headlines from one trade publication per industry. This is that list.</p>
          <ul>
            <li><strong>Show</strong> takes an industry off the website without losing its settings.</li>
            <li><strong>Up / Down</strong> set the order of the industry tabs on the website.</li>
            <li><strong>Test feed</strong> reads the feed from our server and says how many headlines it found, or why it failed. Some publishers turn servers away; give those a <em>backup feed</em>.</li>
            <li><strong>Add an industry</strong>: the publication&apos;s name, website and RSS feed link (most news sites have one at /feed/). Test it, then <strong>Save</strong>.</li>
          </ul>
          <p>Only headlines, dates, a short preview and a link are shown; every story opens on the publisher&apos;s own site.</p>
        </AdminHelpIcon>
      </h1>
      <AdminResourcesTabs />
      <p className="lead">The trade publications behind the website&apos;s Industry news page, one per industry, in the order shown.</p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminNewsSources initial={data.sources} isDefault={data.is_default} />}
    </AdminShell>
  );
}
