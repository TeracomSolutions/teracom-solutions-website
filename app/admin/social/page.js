import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSocialAccounts from '@/components/AdminSocialAccounts';
import AdminSocialUpdates from '@/components/AdminSocialUpdates';
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

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Social
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Our presence on <strong>LinkedIn, Facebook, Instagram, X and YouTube</strong>: the profile links the website footer shows, the accounts we can post to, and <strong>Updates</strong> that go out in one go to the networks and to customers who asked to hear from us.</p>
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
        </AdminHelpIcon>
      </h1>
      <p className="lead">The social networks we post to and the updates sent to them and to our customers.</p>

      <h2>Accounts</h2>
      <AdminSocialAccounts initialAccounts={accounts} loadError={loadError} />

      <h2>Updates</h2>
      <AdminSocialUpdates initialUpdates={updates} loadError={loadError} />
    </AdminShell>
  );
}
