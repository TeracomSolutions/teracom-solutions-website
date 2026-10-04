import { redirect } from 'next/navigation';

import AdminConnections from '@/components/AdminConnections';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { listConnections } from '@/lib/api/adminConnections';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { websiteConnections } from '@/lib/websiteConnections';

export const metadata = {
  title: 'Connections|Teracom Solutions',
};

const ZOHO_NOTICES = {
  connected: 'Zoho Books is connected.',
  failed: 'Zoho Books did not connect.',
};

export default async function AdminConnectionsPage({ searchParams }) {
  const token = await requireAdminToken();
  const query = (await searchParams) || {};

  let connections = null;
  let loadError = '';
  try {
    connections = [...(await listConnections(token)), ...websiteConnections()];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the connections from the backend.';
  }

  let notice = null;
  if (ZOHO_NOTICES[query.zoho]) {
    notice = {
      ok: query.zoho === 'connected',
      text: [ZOHO_NOTICES[query.zoho], typeof query.reason === 'string' ? query.reason : ''].filter(Boolean).join(' '),
    };
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Connections
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Every outside service the website and console rely on, and the servers and computers we watch, in one place: what each is for, whether it is working, and when it was last checked.</p>
          <h4>The colours</h4>
          <ul>
            <li><strong>Connected</strong>: the last check worked.</li>
            <li><strong>Needs attention</strong>: working, but something should be done (a test-mode key, a certificate close to expiry, a full disk).</li>
            <li><strong>Failing</strong>: the last check did not work; the message says why.</li>
            <li><strong>Not set up</strong> and <strong>Not checked yet</strong>: no key yet, or press Test.</li>
          </ul>
          <h4>Edit</h4>
          <p>Every card has an Edit button. Zoho Books, Cloudflare, Vercel and Email sending open their settings here; the website server, database, website and backend API cards set when they turn amber or red; a watched server or PC can be renamed or given a new check-in interval. Freight carriers and supplier feeds open their own pages, and Stripe, Turnstile and this deployment open their Vercel settings.</p>
          <h4>Keys</h4>
          <p>Zoho Books, Cloudflare and Vercel keys are entered here with <strong>Edit</strong>; they are stored encrypted and never shown again, only their last four characters. Other connections link to the page that holds their keys. Stripe and Turnstile keys live in the website&apos;s Vercel settings.</p>
          <h4>Servers and computers</h4>
          <p>This server and its database are checked whenever the page opens. Add any other server or PC with <strong>Add a server or computer</strong>: paste the line it gives you on that machine and it checks in by itself. It turns red when it misses two check-ins.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The outside services, servers and computers the website depends on, whether each is working, and the keys for them.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminConnections initial={connections} notice={notice} />}
    </AdminShell>
  );
}