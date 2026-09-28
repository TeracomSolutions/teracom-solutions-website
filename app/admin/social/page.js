import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSocialAccounts from '@/components/AdminSocialAccounts';
import AdminSocialCalendar from '@/components/AdminSocialCalendar';
import AdminSocialCustomers from '@/components/AdminSocialCustomers';
import AdminSocialPosting from '@/components/AdminSocialPosting';
import AdminTabs from '@/components/AdminTabs';
import { listCustomers } from '@/lib/api/adminCustomers';
import { getCadence, listSocialAccounts, listSocialUpdates } from '@/lib/api/adminSocial';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Social|Teracom Solutions',
};

export default async function AdminSocialPage() {
  const token = await requireAdminToken();

  let accounts = [];
  let updates = [];
  let loadError = '';
  try {
    [accounts, updates] = await Promise.all([listSocialAccounts(token), listSocialUpdates(token)]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the social accounts from the backend.';
  }

  // Loaded on its own: if the customer list fails, Accounts and Updates still work.
  let customers = null;
  let customersError = '';
  try {
    customers = await listCustomers(token, { page: 1, page_size: 100, sort: 'name' });
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    customersError = 'Unable to load the customer list from the backend.';
  }

  // The posting calendar settings, also on their own.
  let cadence = [];
  let cadenceError = '';
  try {
    cadence = await getCadence(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    cadenceError = 'Unable to load the posting calendar settings.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Social
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Our presence on <strong>LinkedIn, Facebook, Instagram, X and YouTube</strong>: the profile links the website footer shows, the accounts we can post to, <strong>Posting</strong> that goes out in one go to the networks and to customers who asked to hear from us, and the <strong>Customers</strong> those emails go to.</p>
          <h4>Accounts</h4>
          <ul>
            <li><strong>Profile link</strong> is what the footer icon points to; untick <strong>Show</strong> to hide a network from the footer without losing anything.</li>
            <li><strong>Posting credentials</strong> come from each network&apos;s developer console (the note under each name says which app and permission). They are stored encrypted and never shown again; the card only says which fields are set. Leaving a field blank keeps the saved value.</li>
            <li><strong>Check</strong> sends one small real request to the network and shows the account it is signed in as, or the exact error.</li>
          </ul>
          <h4>Posting</h4>
          <ul>
            <li>Write the title and text once, add a link if there is one, then add <strong>pictures</strong> (JPEG, PNG or WebP, up to 8 MB each, up to 20) or <strong>one video</strong> (MP4 or MOV, up to 100 MB). Each network takes what it allows: X up to 4 pictures, Facebook and Instagram up to 10.</li>
            <li>Tick where it goes. A network without posting credentials cannot be ticked; set it up under Accounts first. <strong>Customer email</strong> goes to every customer who agreed to hear from us, or only to the pricing tiers you name, with an unsubscribe link in every email.</li>
            <li>Each ticked network has a tab with its <strong>preview</strong> and a <strong>checklist</strong> of what it will accept. Untick <em>Use the main text</em> to write different text for that network only.</li>
            <li><strong>Send now</strong> runs in the background; each network reports sent, failed or skipped within a minute. A <strong>scheduled</strong> post goes within 15 minutes of its time (Melbourne). The history links to each live post.</li>
            <li>Drafts and scheduled posts can be cancelled; sent ones stay as history.</li>
          </ul>
          <h4>Calendar</h4>
          <ul>
            <li>The month view shows what is scheduled (amber), sent (green) and failed (red), at its Melbourne time.</li>
            <li><strong>How often</strong> sets, per network, the most posts a day and a week, the hours between posts, and the preferred days and times.</li>
            <li><strong>Add to queue</strong> on Posting picks the next time that suits every ticked network, so posts go out regularly without crowding anyone.</li>
            <li>The starting settings: LinkedIn 3 a week, Facebook 4 a week, Instagram 3 a week, X up to 2 a day, one customer email a week.</li>
          </ul>
          <h4>Customers</h4>
          <ul>
            <li>Every customer account on the website: the ones brought across from the old store and everyone who has signed up since.</li>
            <li><strong>Updates</strong> says whether the customer receives email updates (they agreed), opted out, or was never asked. Only <strong>Receives updates</strong> customers get a Posting email.</li>
            <li><strong>Account</strong>: <em>Imported</em> means the account came from the old store and the customer has not set a password yet; <em>Login set</em> means they can sign in.</li>
            <li>The list is read-only. Consent is the customer&apos;s own choice, changed from the unsubscribe link in every email or from their account.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The social networks we post to, the updates sent to them and to our customers, and the customer list.</p>

      <AdminTabs
        ariaLabel="Social sections"
        tabs={[
          { key: 'accounts', label: 'Accounts', content: <AdminSocialAccounts initialAccounts={accounts} loadError={loadError} /> },
          {
            key: 'posting',
            label: 'Posting',
            content: <AdminSocialPosting initialUpdates={updates} accounts={accounts} audienceCount={customers?.counts?.receives_updates} loadError={loadError} />,
          },
          {
            key: 'calendar',
            label: 'Calendar',
            content: <AdminSocialCalendar initialCadence={cadence || []} loadError={cadenceError} />,
          },
          {
            key: 'customers',
            label: customers ? `Customers (${customers.counts.all})` : 'Customers',
            content: <AdminSocialCustomers initial={customers} loadError={customersError} />,
          },
        ]}
      />
    </AdminShell>
  );
}
