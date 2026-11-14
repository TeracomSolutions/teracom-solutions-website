import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminLeadsTable from '@/components/AdminLeadsTable';
import AdminTabs from '@/components/AdminTabs';
import { LeadFinderBusinesses, LeadFinderEmails, LeadFinderFind, LeadFinderSettings } from '@/components/AdminLeadFinder';
import AdminShell from '@/components/AdminShell';
import { fetchLeads } from '@/lib/api/adminLeads';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Leads|Teracom Solutions', BRAND),
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
            <li><strong>One line each</strong> - click an enquiry to open it: the message, the contact details, Mark contacted and Tera&apos;s draft reply. Click it again to close it. Long names and emails are cut short; point at one to see it in full.</li>
            <li><strong>Enquiry</strong> - which option they chose on the form (Contact sales, Demo request, Trial question, Platform question, Partnership, Technical consulting, Teracom AI, Store). A Contact sales or Demo request enquiry also emails sales@teracomsolutions.com.au when it arrives; the rest are recorded only.</li>
            <li><strong>Status</strong> - <em>New</em> until someone marks it, then <em>Contacted</em> with the date.</li>
            <li><strong>Reply</strong> - Tera&apos;s draft reply is under the opened enquiry. Change it if you like, then <em>Send reply</em> emails it to the person and marks the enquiry contacted. <em>Draft again</em> asks Tera for a new one; <em>Discard draft</em> drops it. Nothing is emailed until you press Send. For a callback request the draft is notes for the call.</li>
            <li><strong>Draft</strong> - Tera has a reply waiting for you. Drafts are switched on and off on the Support page, under Settings.</li>
            <li><strong>Mark contacted</strong> - in the opened enquiry; click it once you&apos;ve replied some other way (phone, your own email). It records who marked it and when, in the audit log as well. There is no undo.</li>
            <li><strong>Refresh</strong> - reloads the list; new enquiries arrive on their own and do not appear until you refresh or revisit the page.</li>
          </ul>
          <h4>Finding new leads</h4>
          <ul>
            <li><strong>Find leads</strong> - saved searches: a kind of business (strata managers, builders, facility managers…) in the places you list. Run now, or they run on their own every so many days. Each business&apos;s own website is read; directories and social networks never are.</li>
            <li><strong>Businesses</strong> - what was found, best fit first, one line each; click one to see what they do, why it scored as it did, the email addresses their site publishes and exactly where each was found. Mark it Good fit, Not a fit or Do not contact, add a contact, or Draft an email.</li>
            <li><strong>Emails</strong> - the AI&apos;s drafts: read and change them, then Approve and send. Nothing goes while sending is off, and only on business days in business hours, up to the daily limit. When they reply, click They replied and it becomes an enquiry here.</li>
            <li><strong>Lead finder settings</strong> - sending on or off, the daily limit and hours, the sender details every email must carry, what the AI may say about us, and the Never email list.</li>
            <li><strong>The law</strong> - we email only addresses a business publishes on its own website for business enquiries (with no &quot;no unsolicited emails&quot; notice), people who asked us, or customers; every email says who we are, our ABN, where we found the address, and has a one-click unsubscribe that works at once and for good.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Enquiries from the website&apos;s contact form, request forms and the Ask Tera chat, each with Tera&apos;s draft reply; and the lead finder, which finds businesses that could buy from us and helps you write to them.</p>

      <AdminTabs
        ariaLabel="Leads"
        tabs={[
          { key: 'enquiries', label: 'Enquiries', content: <AdminLeadsTable leads={leads} loadError={leadsError} /> },
          { key: 'find', label: 'Find leads', content: <LeadFinderFind /> },
          { key: 'businesses', label: 'Businesses', content: <LeadFinderBusinesses /> },
          { key: 'emails', label: 'Emails', content: <LeadFinderEmails /> },
          { key: 'finder-settings', label: 'Lead finder settings', content: <LeadFinderSettings /> },
        ]}
      />
    </AdminShell>
  );
}
