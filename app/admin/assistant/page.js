import AdminAssistantChat from '@/components/AdminAssistantChat';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Assistant|Teracom Solutions',
};

export default async function AdminAssistantPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Assistant
        <AdminHelpIcon>
          <h4>What this is</h4>
          <p>An AI assistant that runs the console for you. Ask in plain English and it looks things up or makes the change, using the same actions the pages use, signed as you -- so everything it does is in the audit log and nothing happens silently: each reply lists the actions it took.</p>
          <h4>What it can do</h4>
          <ul>
            <li>Suppliers and price lists: list them, see when each was last imported, search the catalogue.</li>
            <li>Pricing: read or set the Silver / Gold / Platinum discounts and per-supplier overrides.</li>
            <li>Scout: list tasks and the review queue, create a task, start research.</li>
            <li>Resources: list watched websites, add one, run a check now.</li>
            <li>Leads: list new enquiries, summarise them, mark one contacted.</li>
            <li>Website data: visitor numbers and top pages for a period.</li>
          </ul>
          <h4>What it will not do</h4>
          <p>It cannot delete anything, upload files, change AI keys or edit the website itself; those stay as clicks on their pages. It runs on the connections under AI Connections, trying Anthropic first, then OpenAI, then Groq, and says which one answered.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Tell the console what you want in plain English.</p>
      <AdminAssistantChat />
    </AdminShell>
  );
}
