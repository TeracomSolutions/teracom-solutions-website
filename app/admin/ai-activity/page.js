import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminAiActivity from '@/components/AdminAiActivity';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('AI activity|Teracom Solutions', BRAND),
};

export default async function AdminAiActivityPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        AI activity <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>
            Every call the website makes to an AI provider or the web search: who was asked, whether it worked, how long it took and why it failed. It helps you see which AI connections are carrying the load and which are failing.
          </p>

          <h4>How to read it</h4>
          <ul>
            <li>Pick Last 24 hours, 7 days or 30 days, and narrow it to one provider or one area.</li>
            <li>Calls over time shows busy and quiet periods; the red part of a bar is calls that failed.</li>
            <li>Why calls failed gives a plain reason only. The full error text is never shown.</li>
          </ul>

          <h4>Things to know</h4>
          <p>
            Only calls made since this page was added are counted. Our own server (Ollama, web search) has no per-call charge.
          </p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">
        Every AI call and web search, newest first, with how well each provider is doing.
      </p>

      <AdminAiActivity />
    </AdminShell>
  );
}
