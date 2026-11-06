import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminNewsArticles from '@/components/AdminNewsArticles';
import AdminResourcesTabs from '@/components/AdminResourcesTabs';
import AdminShell from '@/components/AdminShell';
import { fetchNewsArticlesAdmin } from '@/lib/api/adminIndustryNews';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { BRAND, retitle } from '@/lib/brand';

export const metadata = {
  title: retitle('Articles|Teracom Solutions', BRAND),
};

const STATUSES = ['draft', 'scheduled', 'published', 'rejected'];

export default async function AdminArticlesPage(props) {
  const token = await requireAdminToken();
  const search = await props.searchParams;
  const status = STATUSES.includes(search?.status) ? search.status : 'draft';
  let data = null;
  let loadError = '';
  try {
    data = await fetchNewsArticlesAdmin(token, status);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the articles from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Resources
        <AdminHelpIcon>
          <h4>Articles from industry news</h4>
          <p>Short articles in Teracom&apos;s own words about what an industry news story means for our customers and installers. They appear on the website under Resources &gt; Articles, after our own guides, each crediting and linking the story that prompted it.</p>
          <ul>
            <li><strong>Draft one now</strong>: show recent headlines from the Industry news publications and press <em>Draft</em> on one. The AI connections write a draft in about a minute and it opens for you.</li>
            <li><strong>Weekly drafts</strong>: when ticked, up to the number you choose are drafted each week, taking turns across security, electrical, AV, IT and the other industries. They wait on the Draft list.</li>
            <li><strong>Nothing is published by itself.</strong> Open a draft, check the facts against the original story and that nothing is copied from it, edit, then <em>Approve and schedule</em>. It takes the next publishing time and waits on the Scheduled list; <em>Publish now</em> skips the wait and <em>Unpublish</em> takes it off again.</li>
            <li><strong>When approved articles go live</strong>: the days and hour (Melbourne time) for publishing, one article per time. Tick channels under <em>Share each one</em> and approving also schedules a Post it update for the same time linking the article (the email goes to everyone on the list who has not unsubscribed).</li>
          </ul>
          <p>The writer only sees the headline and the publisher&apos;s short summary, never the full story, and a draft that repeats 12 or more of the publisher&apos;s words in a row is thrown away.</p>
        </AdminHelpIcon>
      </h1>
      <AdminResourcesTabs />
      <p className="lead">Articles drafted from industry news. Read, edit and publish them to Resources &gt; Articles.</p>
      {loadError ? (
        <p className="form-error" role="alert">{loadError}</p>
      ) : (
        <AdminNewsArticles articles={data.articles} counts={data.counts} settings={data.settings} status={status} />
      )}
    </AdminShell>
  );
}
