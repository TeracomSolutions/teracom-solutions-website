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
          <p>Tera answers only from Teracom&apos;s own material: the help centre, the free calculators, the services and brands pages, every published store product, every product in the suppliers&apos; price lists (as one Teracom can order in, with no prices), every published manual, datasheet and brochure, and what it has been taught. It is rebuilt every day; press Rebuild library after publishing something you want Tera to know straight away.</p>
          <h4>Teach Tera</h4>
          <p>Write a question and the answer Tera should give, and Tera uses it straight away, ahead of everything else. Tera also learns by itself: an answer a customer rates helpful, or one you keep with Keep this answer, is saved the same way. Personal details are taken out first. Switch off or delete anything that is wrong.</p>
          <h4>Draft replies</h4>
          <p>Tera drafts a reply to every new enquiry (the contact form, the request forms, and questions or callbacks sent from the chat). You check it on the Leads page and press Send, or change or discard it. Nothing goes to a customer without someone pressing Send. Untick it in Settings to stop the drafts. The Draft replies figure shows how often drafts go out unchanged.</p>
          <h4>Manufacturers&apos; websites</h4>
          <p>When the library has nothing on a question, Tera may read pages on the manufacturers&apos; own websites listed in Settings, and says when an answer came from one.</p>
          <h4>Which AI answers</h4>
          <p>Tera&apos;s own model on this server first, so questions stay on Teracom&apos;s server. Its answer appears word by word as it is written. If it is switched off or goes 20 seconds without writing, the cloud providers from AI Connections answer, up to the monthly cap set here; once the cap is used, Tera says it cannot answer until next month or until its own model is back.</p>
          <h4>Questions Tera could not answer</h4>
          <p>Questions the library did not cover. Press Teach Tera this to write the answer, and Tera will know it next time.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Ask Tera, the AI support assistant for signed-in customers: its library, this month&apos;s use, and the conversations.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminSupport initial={overview} />}
    </AdminShell>
  );
}