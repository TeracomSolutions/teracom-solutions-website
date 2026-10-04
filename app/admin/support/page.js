import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSupport from '@/components/AdminSupport';
import { getSupportOverview } from '@/lib/api/support';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Support|Teracom Solutions',
};

export default async function AdminSupportPage() {
  const token = await requireAdminToken();

  let overview = null;
  let loadError = '';
  try {
    overview = await getSupportOverview(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load Ask Tera from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Support
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Ask Tera, the AI support assistant for customers signed in to the website: what it answers from, how it is doing, and every conversation from the last 90 days.</p>
          <h4>The library</h4>
          <p>Tera answers only from Teracom&apos;s own material: the help centre, the free calculators, the services pages, every published store product and every published manual, datasheet and brochure. It is rebuilt every day; press Rebuild library after publishing something you want Tera to know straight away.</p>
          <h4>Which AI answers</h4>
          <p>A local model first, when one is reachable by a public web address. Otherwise the cloud providers from AI Connections, up to the monthly cap set here; once the cap is used, Tera says it cannot answer until next month or until the local model is back.</p>
          <h4>Questions Tera could not answer</h4>
          <p>Questions the library did not cover. Each one shows what the help centre or the product details are missing.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Ask Tera, the AI support assistant for signed-in customers: its library, this month&apos;s use, and the conversations.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSupport initial={overview} />}
    </AdminShell>
  );
}