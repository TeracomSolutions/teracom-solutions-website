import { redirect } from 'next/navigation';

import AdminAiConnections from '@/components/AdminAiConnections';
import AdminAiGovernance from '@/components/AdminAiGovernance';
import AdminAiRouting from '@/components/AdminAiRouting';
import AdminAiTabs from '@/components/AdminAiTabs';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchAiProviders, fetchAiRouting, fetchGovernanceRules, listAiConnections } from '@/lib/api/adminAiConnections';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'AI Connections|Teracom Solutions',
};

export default async function AdminAiConnectionsPage() {
  const token = await requireAdminToken();

  let connections = [];
  let providers = [];
  let routing = null;
  let rules = [];
  let loadError = '';
  let rulesError = '';

  try {
    [connections, providers] = await Promise.all([
      listAiConnections(token),
      fetchAiProviders(token),
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the AI connections from the backend.';
  }
  // The picture is extra: if its feed fails the page still works.
  try {
    routing = await fetchAiRouting(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    routing = null;
  }
  try {
    rules = await fetchGovernanceRules(token);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    rulesError = 'Unable to load the governance rules from the backend.';
  }

  // The Internet entry is not a model: it has its own row in the order.
  const modelConnections = connections.filter((c) => c.provider !== 'internet');
  const modelProviders = providers.filter((p) => p.kind !== 'source');

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
          <h4>The picture</h4>
          <ul>
            <li>The website sits in the middle; each connected provider is around it, green when it is responding, red when its last call failed (hover for the reason: out of credit, key rejected, not reachable), grey when disabled, amber when it has not been used yet. The bright lines are the providers first in line; the labels say who is first for the Assistant and for Scout research and who last wrote a critique.</li>
            <li>The <strong>Internet</strong> is where Scout research goes for its sources (web search through DuckDuckGo). It sits in the Order of preference like a provider: above the models, Scout searches the web first; below them, the first model answers from its own knowledge and the web is the fallback; switched off, Scout uses the models only. The Assistant never browses. <strong>Check now</strong> on the Internet row runs one real search.</li>
            <li><strong>Order of preference</strong>: move a provider up or down and both the Assistant and Scout follow the new order from the next request. A provider that fails is skipped for that request and tried again on the next one; nothing needs resetting.</li>
            <li><strong>Check now</strong> sends one tiny real request to that provider and shows the response time or the exact error.</li>
          </ul>
          <h4>Governance</h4>
          <ul>
            <li>The Governance tab holds the rules every AI call follows. Each enabled rule is placed in front of the model on every Assistant, Scout and critique request, in the order shown.</li>
            <li>A rule marked <strong>Filter</strong> (or Instruction and filter) also strips the matching details out of anything before it leaves for a provider: personal details (emails, phone numbers, street addresses), financial details (card numbers, bank details, tax file numbers) or passwords and keys. Tool results the Assistant looks up are filtered the same way.</li>
            <li><strong>Applies to</strong>: External means every provider outside Teracom (Anthropic and the hosted APIs); All includes our own self-hosted models.</li>
            <li><strong>Test the filter</strong> shows exactly what a provider would receive for any text you paste; nothing typed there is stored.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">The AI providers the Assistant and Scout use, the Internet in their order of preference, and the rules they all follow.</p>

      <AdminAiTabs
        connections={(
          <>
            {routing ? <AdminAiRouting initialRouting={routing} /> : <p className="admin-muted">The routing picture is unavailable until the backend is updated.</p>}
            <AdminAiConnections initialConnections={modelConnections} loadError={loadError} providers={modelProviders} />
          </>
        )}
        governance={<AdminAiGovernance initialRules={rules} providers={modelProviders} loadError={rulesError} />}
      />
    </AdminShell>
  );
}
