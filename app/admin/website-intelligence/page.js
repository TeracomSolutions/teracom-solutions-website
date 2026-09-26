import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminWebsiteIntelligenceTabs from '@/components/AdminWebsiteIntelligenceTabs';
import { fetchLeads, fetchManagedBusinesses } from '@/lib/api/adminWebsiteIntelligence';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Website Intelligence|Teracom Solutions',
};

// Copied from the Global Platform's app/(admin)/data-feeds/page.js.
export default async function AdminWebsiteIntelligencePage({ searchParams }) {
  const token = await requireAdminToken();
  const { tab } = await searchParams;

  let businesses = [];
  let loadError = null;
  let leads = [];
  let leadsError = null;

  try {
    businesses = await fetchManagedBusinesses(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the businesses from the backend.';
  }

  try {
    leads = await fetchLeads(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    leadsError = 'Unable to load the website enquiries from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Website Intelligence
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Teracom&apos;s own businesses and their websites (Teracom Solutions, Luneva): the product suppliers whose price-list files each site receives, and the enquiries its contact form brings in. Two tabs: <strong>Businesses &amp; Suppliers</strong> and <strong>Leads</strong>.</p>
          <p>Uploaded supplier files are stored here as a record. Nothing reads or imports them automatically yet: the store&apos;s product catalogue is loaded separately, through the <strong>Store Catalog</strong> page.</p>
          <h4>Businesses &amp; Suppliers tab</h4>
          <p>Organised in three levels: business, then its suppliers, then each supplier&apos;s uploaded files.</p>
          <ul>
            <li><strong>Business</strong> - the business&apos;s name; click it to see its suppliers.</li>
            <li><strong>Website</strong> - its website, which opens in a new tab.</li>
            <li><strong>Created</strong> - when it was added.</li>
          </ul>
          <h4>Add a business</h4>
          <ul>
            <li>Click <em>Add Business</em> below the table, fill in the <strong>Business name</strong> and <strong>Website URL</strong>, then click <em>Add Business</em> again to save, or <em>Cancel</em>.</li>
            <li>Adding businesses, suppliers and uploads is recorded in the audit log.</li>
          </ul>
          <h4>Leads tab</h4>
          <p>Enquiries people send through the public website&apos;s contact form, stored by the website&apos;s own backend and shown here newest first. These are Teracom&apos;s own prospects: nobody filling in that form is a customer yet.</p>
          <ul>
            <li><strong>Received</strong> - when the form was submitted. <strong>Name</strong>, <strong>Company</strong> and <strong>Email</strong> are what the visitor typed; the email address is a mail link, so clicking it opens a new message to them.</li>
            <li><strong>Message</strong> - shown only when the visitor wrote one; click <em>Message</em> next to their name to read it, and again to hide it.</li>
            <li><strong>Enquiry</strong> - which option they chose on the form (Contact sales, Demo request, Trial question, Platform question, Partnership, Technical consulting, SecurityOS, Store). A Contact sales or Demo request enquiry also emails sales@teracomsolutions.com.au when it arrives; the rest are recorded only.</li>
            <li><strong>Status</strong> - <em>New</em> until someone marks it, then <em>Contacted</em> with the date.</li>
            <li><strong>Mark contacted</strong> - click it once you&apos;ve replied to the person. It records who marked it and when, in the audit log as well. There is no undo, and nothing is emailed automatically - replying is still something you do yourself.</li>
            <li><strong>Refresh</strong> - reloads the list; new enquiries arrive on their own and do not appear until you refresh or revisit the page.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">
        Teracom&apos;s businesses and websites, the suppliers whose price lists each one receives,
        the files uploaded from each supplier, and the enquiries the websites bring in.
      </p>

      <AdminWebsiteIntelligenceTabs
        initialTab={tab}
        businesses={businesses}
        loadError={loadError}
        leads={leads}
        leadsError={leadsError}
      />
    </AdminShell>
  );
}
