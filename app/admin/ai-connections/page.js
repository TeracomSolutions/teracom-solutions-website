import { redirect } from 'next/navigation';

import AdminAiConnections from '@/components/AdminAiConnections';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { listAiConnections } from '@/lib/api/adminAiConnections';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'AI Connections|Teracom Solutions',
};

export default async function AdminAiConnectionsPage() {
  const token = await requireAdminToken();

  let connections = [];
  let loadError = '';

  try {
    connections = await listAiConnections(token);
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
          <p>The AI providers Scout uses when you click <strong>Run research</strong>. A run tries them in a fixed order -- <strong>Ollama</strong> (a model on our own hardware) first, then <strong>Anthropic</strong>, <strong>OpenAI</strong> and <strong>Groq</strong> -- and the first one that works does the research; a different one from the list writes the critique.</p>
          <h4>Keys</h4>
          <p>A key is stored encrypted and never shown again: the table shows only its last four characters so you can tell which key is in place. To change a key, choose the provider and enter the new one; leaving the field blank keeps the current key.</p>
          <h4>Ollama</h4>
          <p>Ollama is self-hosted, so it takes a <strong>Host</strong> (for example http://your-ollama-host:11434) instead of a key. The host must be reachable from the website server, and the default model must already be pulled on it.</p>
          <h4>Enable / Disable / Remove</h4>
          <p><strong>Disable</strong> keeps the key but takes the provider out of the running order; <strong>Enable</strong> puts it back. <strong>Remove</strong> deletes the connection and its key. Every change is recorded in the audit log.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The providers Scout researches with, in the order it tries them.</p>

      <AdminAiConnections initialConnections={connections} loadError={loadError} />
    </AdminShell>
  );
}
