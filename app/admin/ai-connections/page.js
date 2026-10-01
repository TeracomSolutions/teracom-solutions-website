import { redirect } from 'next/navigation';

import AdminAiConnectionsPanel from '@/components/AdminAiConnectionsPanel';
import AdminAiGovernance from '@/components/AdminAiGovernance';
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
  // Health for the table and the diagram. If its feed fails the page still
  // works; every row then reads Not checked yet.
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

  // Governance rules apply to models, not to the Internet source.
  const modelProviders = providers.filter((p) => p.kind !== 'source');

  return (
    <AdminShell>
      <h1 className="admin-heading">
        AI Connections
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>The AI providers the <strong>Assistant</strong> and <strong>Scout</strong> use, laid out the same as the TeracomAI Global Platform so settings carry across one to one. One order of preference applies to both; the Assistant skips the Internet, and Scout critiques with a different provider from the one that researched.</p>
          <h4>The diagram</h4>
          <ul>
            <li>The website is the router in the middle. A <strong>cloud</strong> is a hosted API somebody else runs; a <strong>rack</strong> is a model on our own hardware; the <strong>dashed cloud</strong> at the top is the Internet, where Scout finds its sources.</li>
            <li>Each shape is coloured by how that connection is doing: green responding, red failing (the table says why), grey disabled, amber not checked yet. The bold line is the first choice; the numbers are the order of preference.</li>
          </ul>
          <h4>The table</h4>
          <ul>
            <li><strong>Order</strong>: the arrows move a connection earlier or later; both the Assistant and Scout follow the new order from the next request. A provider that fails is skipped for that request and tried again on the next one.</li>
            <li><strong>Key</strong> shows only the last four characters of a stored key, <em>host</em> for a self-hosted model, or <em>none needed</em> for the Internet.</li>
            <li><strong>Status</strong> and <strong>Last message from the provider</strong> come from the last real call or check: out of credit and key rejected both need a visit to that provider&apos;s console.</li>
            <li><strong>Check now</strong> sends one tiny real request (for the Internet, one real search). <strong>Edit</strong> fills the form below; <strong>Remove</strong> deletes the connection and its key.</li>
          </ul>
          <h4>Adding or changing a connection</h4>
          <ul>
            <li>Choose the <strong>Provider</strong> (grouped by what it needs: a key, a host, or nothing), check the <strong>Default Model</strong>, add the <strong>API Key</strong> or <strong>Host</strong>, and tick <strong>Enabled</strong>. When editing, leave the key blank to keep the current one.</li>
            <li>Untick <strong>Enabled</strong> to keep a connection but take it out of the running order, including switching the Internet off.</li>
            <li>Keys are stored encrypted and never shown again. Every change is recorded in the audit log.</li>
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
          <AdminAiConnectionsPanel
            initialConnections={connections}
            initialRouting={routing}
            providers={providers}
            loadError={loadError}
          />
        )}
        governance={<AdminAiGovernance initialRules={rules} providers={modelProviders} loadError={rulesError} />}
      />
    </AdminShell>
  );
}
