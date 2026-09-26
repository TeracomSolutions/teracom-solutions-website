import { redirect } from 'next/navigation';

import AdminAiConnections from '@/components/AdminAiConnections';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchAiProviders, listAiConnections } from '@/lib/api/adminAiConnections';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'AI Connections|Teracom Solutions',
};

export default async function AdminAiConnectionsPage() {
  const token = await requireAdminToken();

  let connections = [];
  let providers = [];
  let loadError = '';

  try {
    [connections, providers] = await Promise.all([
      listAiConnections(token),
      fetchAiProviders(token)
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the AI connections from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        AI Connections
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>The AI providers the <strong>Assistant</strong> and <strong>Scout</strong> use. The Assistant tries Anthropic first, then the other hosted providers, then self-hosted ones; Scout research tries self-hosted first (free), then the hosted providers, and a different one from the list writes the critique. Any provider can be disabled without removing its key. The table at the bottom lists everything that can be connected.</p>
          <h4>Keys</h4>
          <p>A key is stored encrypted and never shown again: the table shows only its last four characters so you can tell which key is in place. To change a key, choose the provider and enter the new one; leaving the field blank keeps the current key.</p>
          <h4>Hosted APIs</h4>
          <p>A hosted provider takes an API key from its console (the Get a key link shows where) and, optionally, a default model; we keep the key encrypted and show only its last four characters.</p>
          <h4>Self-hosted</h4>
          <p>A self-hosted provider (Ollama, LM Studio, vLLM) takes a host address on our network instead of a key; the model must already be pulled or loaded there.</p>
          <h4>Enable / Disable / Remove</h4>
          <p><strong>Disable</strong> keeps the key but takes the provider out of the running order; <strong>Enable</strong> puts it back. <strong>Remove</strong> deletes the connection and its key. Every change is recorded in the audit log.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The AI providers the Assistant and Scout use, and everything else we could connect.</p>

      <AdminAiConnections initialConnections={connections} loadError={loadError} providers={providers} />
    </AdminShell>
  );
}
