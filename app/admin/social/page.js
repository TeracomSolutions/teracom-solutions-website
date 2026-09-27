import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSocialAccounts from '@/components/AdminSocialAccounts';
import AdminSocialCustomers from '@/components/AdminSocialCustomers';
import AdminSocialUpdates from '@/components/AdminSocialUpdates';
import AdminTabs from '@/components/AdminTabs';
import { listCustomers } from '@/lib/api/adminCustomers';
import { listSocialAccounts, listSocialUpdates } from '@/lib/api/adminSocial';
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

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Social
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Our presence on <strong>LinkedIn, Facebook, Instagram, X and YouTube</strong>: the profile links the website footer shows, the accounts we can post to, <strong>Updates</strong> that go out in one go to the networks and to customers who asked to hear from us, and the <strong>Customers</strong> those emails go to.</p>
          <h4>Accounts</h4>
          <ul>
            <li><strong>Profile link</strong> is what the footer icon points to; untick <strong>Show</strong> to hide a network from the footer without losing anything.</li>
            <li><strong>Posting credentials</strong> come from each network&apos;s developer console (the note under each name says which app and permission). They are stored encrypted and never shown again; the card only says which fields are set. Leaving a field blank keeps the saved value.</li>
            <li><strong>Check</strong> sends one small real request to the network and shows the account it is signed in as, or the exact error.</li>
          </ul>
          <h4>Updates</h4>
          <ul>
            <li>One message goes to every ticked network and, with <strong>Customer email</strong>, to every customer whose account has marketing consent ticked. Every email carries an unsubscribe link that turns that consent off.</li>
            <li><strong>X</strong> allows 280 characters including the link; <strong>Instagram</strong> needs an image link.</li>
            <li><strong>Send now</strong> runs in the background and each channel reports sent, failed or skipped within a minute. A <strong>scheduled</strong> update goes within 15 minutes of its time (Melbourne). A network without credentials is skipped, never failed.</li>
            <li>Drafts and scheduled updates can be cancelled; sent ones stay as history.</li>
          </ul>
          <h4>Customers</h4>
          <ul>
            <li>Every customer account on the website: the ones brought across from the old store and everyone who has signed up since.</li>
            <li><strong>Updates</strong> says whether the customer receives email updates (they agreed), opted out, or was never asked. Only <strong>Receives updates</strong> customers get an email from Updates.</li>
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
            key: 'updates',
            label: 'Updates',
            content: <AdminSocialUpdates initialUpdates={updates} loadError={loadError} audienceCount={customers?.counts?.receives_updates} />,
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
