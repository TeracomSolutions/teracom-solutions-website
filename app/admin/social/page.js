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
            <li><strong>Posting credentials</strong> come from each network&apos;s developer console (the steps for each network are below). They are stored encrypted and never shown again; the card only says which fields are set. Leaving a field blank keeps the saved value.</li>
            <li><strong>Check</strong> sends one small real request to the network and shows the account it is signed in as, or the exact error.</li>
          </ul>
          <h4>Setting up LinkedIn</h4>
          <ol>
            <li>You need to be an admin of the Teracom Solutions company page on LinkedIn.</li>
            <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noreferrer">linkedin.com/developers/apps</a> and click <strong>Create app</strong>: name &ldquo;Teracom Solutions website&rdquo;, LinkedIn Page &ldquo;Teracom Solutions&rdquo;, the Teracom logo, tick the agreement, <strong>Create app</strong>.</li>
            <li>On the app&apos;s <strong>Settings</strong> tab, click <strong>Verify</strong> next to the company page and open the link as a page admin.</li>
            <li>On the <strong>Products</strong> tab, request <strong>Community Management API</strong> and fill in the form (Teracom&apos;s legal name, website and a business email). LinkedIn reviews it; allow a few days. It must be the only product on this app.</li>
            <li>On the <strong>Auth</strong> tab, add <code>https://www.linkedin.com/developers/tools/oauth/redirect</code> under <strong>Authorized redirect URLs</strong>.</li>
            <li>Once approved, open <a href="https://www.linkedin.com/developers/tools/oauth" target="_blank" rel="noreferrer">OAuth Token Tools</a>, <strong>Create token</strong>, choose the app, tick <code>w_organization_social</code> and <code>r_organization_social</code>, <strong>Request access token</strong>, sign in as a page admin and <strong>Allow</strong>. Copy the token.</li>
            <li>Open the company page as an admin: the address looks like <code>linkedin.com/company/12345678/admin</code>. The number is the page ID.</li>
            <li>Here under <strong>Accounts &rarr; LinkedIn</strong>: paste the token into <strong>Access token</strong> and <code>urn:li:organization:12345678</code> (with your number) into <strong>Author URN</strong>. <strong>Save</strong>, then <strong>Check</strong>.</li>
            <li>The token lasts 60 days. Put a reminder in the calendar and repeat steps 6 and 8 before it runs out.</li>
          </ol>
          <h4>Setting up Facebook</h4>
          <ol>
            <li>You need to be an admin of the Teracom Solutions Facebook Page, signed in to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">developers.facebook.com</a> (register as a developer if it asks).</li>
            <li><strong>My Apps &rarr; Create app</strong>: name &ldquo;Teracom Solutions website&rdquo;, use case <strong>Manage everything on your Page</strong>, connect it to Teracom&apos;s business portfolio if asked, <strong>Create app</strong>.</li>
            <li>In the app&apos;s <strong>App settings &rarr; Basic</strong>, set the privacy policy address to <code>https://www.teracomsolutions.com.au/privacy</code>, save, and switch the app to <strong>Live</strong> at the top (posts from an app still in development are only seen by the people on the app).</li>
            <li>Open the <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer">Graph API Explorer</a>, choose the app, then <strong>Get User Access Token</strong> with these permissions: <code>pages_show_list</code>, <code>pages_read_engagement</code>, <code>pages_manage_posts</code>, and for Instagram also <code>instagram_basic</code>, <code>instagram_content_publish</code>, <code>business_management</code>. <strong>Generate Access Token</strong>, choose the Teracom page (and the Instagram account) and continue.</li>
            <li>Copy that token into the <a href="https://developers.facebook.com/tools/debug/accesstoken" target="_blank" rel="noreferrer">Access Token Debugger</a>, click <strong>Debug</strong>, then <strong>Extend Access Token</strong> at the bottom. Copy the long-lived token it shows.</li>
            <li>Back in the Graph API Explorer, paste the long-lived token into <strong>Access Token</strong>, change the request to <code>me/accounts</code> and <strong>Submit</strong>. Under Teracom Solutions copy the <code>access_token</code> (the Page access token; it does not expire) and the <code>id</code> (the Page ID).</li>
            <li>Here under <strong>Accounts &rarr; Facebook</strong>: paste them into <strong>Page access token</strong> and <strong>Page ID</strong>. <strong>Save</strong>, then <strong>Check</strong>.</li>
          </ol>
          <h4>Setting up Instagram</h4>
          <ol>
            <li>In the Instagram app: <strong>Settings &rarr; Account type and tools &rarr; Switch to professional account &rarr; Business</strong>.</li>
            <li>Link it to the Teracom Facebook Page: on Facebook open the Page, <strong>Settings &rarr; Linked accounts &rarr; Instagram &rarr; Connect</strong>.</li>
            <li>Do the Facebook steps above with the Instagram permissions ticked and the Instagram account chosen. Instagram uses the same Page access token.</li>
            <li>In the Graph API Explorer, with the Page access token, run <code>&lt;Page ID&gt;?fields=instagram_business_account</code> and copy the <code>id</code> inside <code>instagram_business_account</code>.</li>
            <li>Here under <strong>Accounts &rarr; Instagram</strong>: paste the Page access token into <strong>Access token</strong> and that id into <strong>Instagram business account ID</strong>. <strong>Save</strong>, then <strong>Check</strong>.</li>
          </ol>
          <h4>Setting up X</h4>
          <ol>
            <li>Sign in to <a href="https://developer.x.com" target="_blank" rel="noreferrer">developer.x.com</a> with the Teracom X account and sign up for the <strong>Free</strong> plan (it allows posting, with a monthly limit). Describe the use as posting Teracom&apos;s own news from our website console.</li>
            <li>In the Developer Portal open <strong>Projects &amp; Apps</strong>, the app, <strong>Settings &rarr; User authentication settings &rarr; Set up</strong>: App permissions <strong>Read and write</strong>, Type of App <strong>Web App, Automated App or Bot</strong>, Callback URL <code>https://www.teracomsolutions.com.au/admin/social</code>, Website <code>https://www.teracomsolutions.com.au</code>. <strong>Save</strong>.</li>
            <li>The last step, the keys to paste here, depends on an update to the console for X; ask before going further.</li>
          </ol>
          <h4>YouTube</h4>
          <ul>
            <li>Link only: paste the channel&apos;s address into <strong>Profile link</strong> so the footer icon points to it. Nothing is posted to YouTube.</li>
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
