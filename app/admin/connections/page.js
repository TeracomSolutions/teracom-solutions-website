import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminAccountingPlatform from '@/components/AdminAccountingPlatform';
import AdminConnections from '@/components/AdminConnections';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSoftware from '@/components/AdminSoftware';
import AdminSocialAccounts from '@/components/AdminSocialAccounts';
import AdminTabs from '@/components/AdminTabs';
import AdminTimeZone from '@/components/AdminTimeZone';
import AdminZohoFlow from '@/components/AdminZohoFlow';
import { fetchAccountingPlatform, listConnections } from '@/lib/api/adminConnections';
import { PLATFORM_NAMES, connectNotice } from '@/lib/accountingPlatforms';
import { fetchTime, fetchZones } from '@/lib/api/adminTime';
import { fetchZohoFlow } from '@/lib/api/adminZohoFlow';
import { listSocialAccounts } from '@/lib/api/adminSocial';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { websiteConnectionsFor } from '@/lib/websiteConnections';

export const metadata = {
  title: retitle('Connections|Teracom Solutions', BRAND),
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
    connections = [...(await listConnections(token)), ...(await websiteConnectionsFor(token))];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the connections from the backend.';
  }

  let zohoFlow = null;
  try {
    zohoFlow = await fetchZohoFlow(token);
  } catch {
    zohoFlow = null;
  }

  // Which accounting platform the business uses: only its card shows, and the Zoho order flow only for Zoho Books.
  let accounting = { platform: '', choices: [] };
  try {
    accounting = await fetchAccountingPlatform(token);
  } catch {
    accounting = { platform: '', choices: [] };
  }

  // The Social tab, loaded on its own so a failure there leaves the services tab working.
  let socialAccounts = [];
  let socialError = '';
  try {
    socialAccounts = await listSocialAccounts(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    socialError = 'Unable to load the social accounts from the backend.';
  }

  // The Time tab, loaded on its own so a failure there leaves the other tabs working.
  let timeInfo = null;
  let timeZones = { zones: [], common: [] };
  let timeError = '';
  try {
    [timeInfo, timeZones] = await Promise.all([fetchTime(token), fetchZones(token)]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    timeError = 'Unable to load the time zone setting from the backend.';
  }

  let notice = connectNotice(query);
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
            <li><strong>Not set up</strong> and <strong>Not checked yet</strong>: no key yet, or press Test. Stripe and Cloudflare Turnstile are checked again by themselves when their last check is more than a day old.</li>
          </ul>
          <h4>Edit</h4>
          <p>Every card has an Edit button. Zoho Books, Cloudflare, Vercel and Email sending open their settings here; the website server, database, website and backend API cards set when they turn amber or red; a watched server or PC can be renamed or given a new check-in interval. Freight carriers and supplier feeds open their own pages, and Stripe, Turnstile and this deployment open their Vercel settings.</p>
          <h4>Accounting platform</h4>
          <p>Choose the accounting platform the business uses at the top of the Services tab: Zoho Books, Xero, MYOB Business or QuickBooks Online. Only that platform&apos;s card is shown under Accounts and payments. Each card has a <strong>Help</strong> button with the steps to create the app on the platform&apos;s developer site, the Redirect URI to enter there, then <strong>Edit</strong> to paste the keys and <strong>Connect</strong> to sign in. The Zoho order flow card shows only when Zoho Books is chosen.</p>
          <h4>Keys</h4>
          <p>Zoho Books, Cloudflare and Vercel keys are entered here with <strong>Edit</strong>; they are stored encrypted and never shown again, only their last four characters. Other connections link to the page that holds their keys. Stripe and Turnstile keys live in the website&apos;s Vercel settings.</p>
          <h4>Voice</h4>
          <p>The voice Tera and the Assistant speak with. The card shows whether visitors hear the voice built into their own browser (free, but it differs by device and can sound robotic) or a natural Australian voice from Microsoft Azure Speech. <strong>Edit</strong> sets the voice engine, the Azure key and region, which Azure voice, the speaking speed and a monthly limit on characters; after that limit, or if Azure does not answer, visitors hear their browser voice instead. <strong>Hear it</strong> speaks a sample the way visitors will hear it and says which voice answered.</p>
          <h4>Social</h4>
          <p>The <strong>Social</strong> tab holds LinkedIn, Facebook, Instagram, X, Snapchat and YouTube: the profile link the website footer shows and the credentials we post with. Each card has a <strong>Help</strong> button with the exact steps to get that network&apos;s credentials. Posting itself is on the Social page.</p>
          <h4>Time</h4>
          <p>The <strong>Time</strong> tab sets the time zone every console page and the Assistant show times in (Melbourne unless you change it), and checks the server clock against an internet time source.</p>
          <h4>Software</h4>
          <p>The <strong>Software</strong> tab lists what the website and its backend run: the server (operating system, Python, PostgreSQL, Node, cloudflared) and every package, each with the version in use, the newest release and any published security advisory for that version, from the public OSV database. The backend checks itself once a day; <strong>Check now</strong> checks both straight away. Red means a security advisory, amber a newer version, green up to date.</p>
          <h4>Servers and computers</h4>
          <p>This server and its database are checked whenever the page opens. Add any other server or PC with <strong>Add a server or computer</strong>: paste the line it gives you on that machine and it checks in by itself. It turns red when it misses two check-ins.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The outside services, servers and computers the website depends on, whether each is working, and the keys for them.</p>

      <AdminTabs
        ariaLabel="Connection groups"
        tabs={[
          {
            key: 'services',
            label: 'Services',
            content: (
              <>
                <AdminAccountingPlatform initial={accounting} />
                {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminConnections initial={connections} notice={notice} platform={accounting.platform} />}
                {accounting.platform === 'zoho_books' ? <AdminZohoFlow initial={zohoFlow} /> : null}
                {accounting.platform && accounting.platform !== 'zoho_books' ? (
                  <div className="admin-card">
                    <h2 className="admin-heading">Order flow for {PLATFORM_NAMES[accounting.platform]}</h2>
                    <p className="admin-muted">{PLATFORM_NAMES[accounting.platform]} connects and is checked here. Sending website orders to it (contacts, items, invoices, payments and purchase orders) is not built yet; today the order flow works with Zoho Books. Orders are still recorded in Sales &gt; Orders and emailed to sales.</p>
                  </div>
                ) : null}
              </>
            ),
          },
          { key: 'social', label: 'Social', content: <AdminSocialAccounts initialAccounts={socialAccounts} loadError={socialError} /> },
          { key: 'software', label: 'Software', content: <AdminSoftware /> },
          {
            key: 'time',
            label: 'Time',
            content: timeError || !timeInfo
              ? <p className="form-error" role="alert">{timeError || 'Unable to load the time zone setting.'}</p>
              : <AdminTimeZone initial={timeInfo} zones={timeZones.zones} common={timeZones.common} />,
          },
        ]}
      />
    </AdminShell>
  );
}