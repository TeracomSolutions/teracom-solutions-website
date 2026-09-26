import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminLeadsTable from '@/components/AdminLeadsTable';
import AdminShell from '@/components/AdminShell';
import { fetchLeads } from '@/lib/api/adminLeads';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Leads|Teracom Solutions',
};

export default async function AdminLeadsPage() {
  const token = await requireAdminToken();

  let leads = [];
  let leadsError = null;

  try {
    leads = await fetchLeads(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    leadsError = 'Unable to load the enquiries from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Leads
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Enquiries people send through the contact form on this website, newest first. Nobody filling in that form is a customer yet, so these are prospects for sales to follow up.</p>
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
      <p className="lead">Enquiries from the website&apos;s contact form, newest first.</p>

      <AdminLeadsTable leads={leads} loadError={leadsError} />
    </AdminShell>
  );
}
