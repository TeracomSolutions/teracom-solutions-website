import { redirect } from 'next/navigation';

import AdminContent from '@/components/AdminContent';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { listContent } from '@/lib/api/adminContent';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Photos & text|Teracom Solutions',
};

export default async function AdminContentPage() {
  const token = await requireAdminToken();

  let initial = { total: 0, counts: {}, jobs: [] };
  let loadError = '';
  try {
    initial = await listContent(token, 'attention');
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the list from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Store
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>A product goes on the website only with a <strong>photo</strong> and a <strong>description</strong>. When you press <em>Go live</em> on products that lack either, they do not go live straight away. A background worker looks each one up on its manufacturer&apos;s own website, keeps the photo on our server, writes the description from the page (using your AI connections, from the page&apos;s facts only), and puts the product live as soon as it has both.</p>
          <h4>What needs your yes</h4>
          <p>When the page carries the product&apos;s part number, the photo and description are used straight away. When the match is looser, the worker shows what it found here and waits. <strong>Use this</strong> accepts it (and puts the product live if you asked for that); <strong>Not this one</strong> sets it aside.</p>
          <h4>When nothing is found</h4>
          <ul>
            <li><strong>Add by hand</strong> lets you paste a link to the product on the manufacturer&apos;s website, paste a link to a picture, upload a picture, or type the description.</li>
            <li><strong>Try again</strong> looks it up again.</li>
            <li><strong>Go live anyway</strong> puts it on the website as it is. <strong>Leave offline</strong> keeps it off and moves it to the Left offline list.</li>
          </ul>
          <h4>Products already live without a photo</h4>
          <p><em>Find for every live product without a photo</em> and <em>Find for every product without one</em> start the same search for products that are already on the website, or for all of them. Live products stay live while they are looked up.</p>
          <h4>The tabs</h4>
          <p><strong>Needs a look</strong> is the list to work through. <strong>Being looked up</strong> refreshes by itself. <strong>Done</strong> and <strong>Left offline</strong> are what has been settled. The number beside Photos &amp; text in the Store tabs is how many need a look.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">Photos and descriptions found on the manufacturers&apos; websites for products going on the store.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminContent initial={initial} />}
    </AdminShell>
  );
}