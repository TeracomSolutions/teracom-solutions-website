import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminSeoTitles from '@/components/AdminSeoTitles';
import AdminShell from '@/components/AdminShell';
import { fetchTitles } from '@/lib/api/adminSeoInsights';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Search titles|Teracom Solutions',
};

export default async function AdminSeoTitlesPage() {
  const token = await requireAdminToken();

  let initial = { total: 0, counts: {}, titles: [] };
  let loadError = '';
  try {
    initial = await fetchTitles(token, 'proposed');
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
          <p>The title and description of a page are what Google shows in its results, so wording that matches what people searched earns more clicks. Here you approve, change or set aside the wording suggested for a page. Once approved, the website uses it in place of the one the page was built with, within about five minutes.</p>
          <h4>The tabs</h4>
          <ul>
            <li><strong>Waiting for a yes</strong> - suggestions. <em>Use this</em> puts it on the website; <em>Edit</em> lets you change the words first; <em>Not this one</em> sets it aside.</li>
            <li><strong>Live</strong> - titles the website is using now. <em>Turn off</em> goes back to the page&apos;s own title.</li>
            <li><strong>Set aside</strong> - ones you did not want.</li>
          </ul>
          <h4>Writing your own</h4>
          <p>Type a page address (like /store/cctv) and press <em>Suggest a title for this page</em>, or press <em>Edit</em> on any title and type your own. A title is 15 to 65 characters and a description 70 to 160; Google cuts off anything longer. The AI is told to use only what the page says and what people searched, never a price, a number that is not there, or a boast like &quot;best&quot; or &quot;cheapest&quot;, and anything that breaks that is thrown away.</p>
          <p>Titles work for product, category, brand, service, monitoring and article pages and the home page.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Page titles and descriptions for Google, suggested and approved here.</p>
      <AdminSeoTabs />

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSeoTitles initial={initial} />}
    </AdminShell>
  );
}
