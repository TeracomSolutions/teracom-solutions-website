'use client';

import { useState } from 'react';

import AdminAiRoutingDiagram from '@/components/AdminAiRoutingDiagram';
import { formatDateTime } from '@/lib/adminFormat';
import { STATE_COLOURS, connectionRows, moveInOrder } from '@/lib/aiConnectionRows';

// Admin -> AI Connections, laid out the same as the TeracomAI Global
// Platform's AI Provider Connections so the settings carry across one to
// one: the diagram, one table in the order of preference, and one form.

// How the catalogue's kinds read in the dropdown, and what each one needs.
const PROVIDER_KINDS = [
  { kind: 'native', label: 'Direct SDK -- needs an API key' },
  { kind: 'hosted', label: 'Hosted API -- needs an API key' },
  { kind: 'self_hosted', label: 'Self-hosted -- needs a host, no key' },
  { kind: 'source', label: 'Source -- no key, no host' },
];

const needsKey = (kind) => kind === 'native' || kind === 'hosted';

export default function AdminAiConnectionsPanel({ initialConnections, initialRouting, providers, loadError }) {
  const [connections, setConnections] = useState(initialConnections || []);
  const [routing, setRouting] = useState(initialRouting || null);
  const [error, setError] = useState(loadError || '');
  const [notice, setNotice] = useState('');
  const [rowBusy, setRowBusy] = useState('');
  const [checkResult, setCheckResult] = useState({});

  const [provider, setProvider] = useState('');
  const [defaultModel, setDefaultModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const catalogue = providers || [];
  const entryFor = (name) => catalogue.find((p) => p.key === name) || null;
  const kindOf = (name) => entryFor(name)?.kind || (name === 'internet' ? 'source' : 'hosted');
  const labelFor = (name) => entryFor(name)?.label || name;
  const rows = connectionRows(connections, routing, catalogue);
  const order = rows.map((row) => row.provider);

  // Refreshes the rows and the health without reloading the page, so the
  // browser does not jump back to the top after every button.
  async function reload() {
    const [listRes, routingRes] = await Promise.all([
      fetch('/api/admin/ai-connections', { cache: 'no-store' }),
      fetch('/api/admin/ai-connections/routing', { cache: 'no-store' }),
    ]);
    const list = await listRes.json().catch(() => ({}));
    if (!listRes.ok) throw new Error(list.error || 'Unable to load the AI connections.');
    setConnections(list);
    if (routingRes.ok) {
      const fresh = await routingRes.json().catch(() => null);
      if (fresh) setRouting(fresh);
    }
  }

  function resetForm() {
    setProvider('');
    setDefaultModel('');
    setApiKey('');
    setBaseUrl('');
    setEnabled(true);
    setIsEditing(false);
  }

  function chooseProvider(name) {
    setProvider(name);
    // The catalogue's own default model and host, so a new connection
    // starts from something the provider actually serves.
    const entry = entryFor(name);
    if (entry && entry.default_model) setDefaultModel(entry.default_model);
    if (entry && entry.kind === 'self_hosted') setBaseUrl(entry.base_url || '');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const payload = { enabled };
    if (defaultModel !== '') payload.default_model = defaultModel;
    if (baseUrl !== '') payload.base_url = baseUrl;
    if (apiKey !== '') payload.api_key = apiKey;
    try {
      const res = await fetch(`/api/admin/ai-connections/${encodeURIComponent(provider)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save the AI connection.');
      setNotice(`${labelFor(provider)} saved.`);
      resetForm();
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(name) {
    const connection = connections.find((c) => c.provider === name);
    if (!connection) return;
    setProvider(name);
    setDefaultModel(connection.default_model || '');
    setBaseUrl(connection.base_url || '');
    setApiKey('');
    setEnabled(Boolean(connection.enabled));
    setIsEditing(true);
    document.getElementById('ai-connection-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDelete(name) {
    if (!window.confirm(`Are you sure you want to remove the ${labelFor(name)} connection?`)) return;
    setRowBusy(`remove:${name}`);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/ai-connections/${encodeURIComponent(name)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete the AI connection.');
      if (provider === name) resetForm();
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setRowBusy('');
    }
  }

  async function reorder(name, direction) {
    const next = moveInOrder(order, name, direction);
    if (next === order) return;
    setRowBusy(`order:${name}`);
    setError('');
    try {
      const res = await fetch('/api/admin/ai-connections/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The order could not be saved.');
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setRowBusy('');
    }
  }

  async function checkNow(name) {
    setRowBusy(`check:${name}`);
    try {
      const res = await fetch(`/api/admin/ai-connections/${encodeURIComponent(name)}/check`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The check could not run.');
      const result = data.ok
        ? `Responding${data.latency_ms ? ` in ${data.latency_ms} ms` : ''}`
        : data.error || data.detail || 'failed';
      setCheckResult((current) => ({ ...current, [name]: result }));
      await reload();
    } catch (err) {
      setCheckResult((current) => ({ ...current, [name]: err.message }));
    } finally {
      setRowBusy('');
    }
  }

  const selectedEntry = entryFor(provider);
  const selectedKind = provider ? kindOf(provider) : '';

  return (
    <section className="admin-card admin-ai-panel">
      <h2>AI Provider Connections</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}

      <AdminAiRoutingDiagram rows={rows} />

      {rows.length === 0 ? (
        <p>No AI provider connections configured yet. Add one below -- the Provider list offers every provider the website supports.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-ai-table">
            <colgroup>
              <col style={{ width: '5.5rem' }} />
              <col style={{ width: '11rem' }} />
              <col style={{ width: '10rem' }} />
              <col style={{ width: '6.5rem' }} />
              <col style={{ width: '9rem' }} />
              <col />
              <col style={{ width: '6.5rem' }} />
              <col style={{ width: '13rem' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Order</th>
                <th>Provider</th>
                <th>Default model</th>
                <th>Key</th>
                <th>Status</th>
                <th>Last message from the provider</th>
                <th>Checked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.provider}>
                  <td>
                    <div className="admin-ai-move">
                      <span>{row.position}</span>
                      <button
                        type="button"
                        onClick={() => reorder(row.provider, -1)}
                        disabled={index === 0 || Boolean(rowBusy)}
                        aria-label={`Move ${row.label} up`}
                        title="Try this one earlier"
                      >
                        &#9650;
                      </button>
                      <button
                        type="button"
                        onClick={() => reorder(row.provider, 1)}
                        disabled={index === rows.length - 1 || Boolean(rowBusy)}
                        aria-label={`Move ${row.label} down`}
                        title="Try this one later"
                      >
                        &#9660;
                      </button>
                    </div>
                  </td>
                  <td>
                    {row.label}
                    <span className="admin-ai-kind">{row.kind.replace('_', '-')}</span>
                  </td>
                  <td className="admin-ai-wrap">{row.model || '-'}</td>
                  <td>{row.keyText}</td>
                  <td>
                    <span className="admin-ai-state">
                      <span className="admin-ai-dot" style={{ background: STATE_COLOURS[row.state] }} />
                      {row.stateText}
                    </span>
                    {checkResult[row.provider] && (
                      <span className="admin-ai-just-checked">just now: {checkResult[row.provider]}</span>
                    )}
                  </td>
                  <td>
                    {row.detail
                      ? <span className="admin-ai-detail" title={row.detail}>{row.detail}</span>
                      : <span className="admin-muted">-</span>}
                  </td>
                  <td className="admin-ai-wrap">{row.checkedAt ? formatDateTime(row.checkedAt) : '-'}</td>
                  <td>
                    <div className="admin-ai-actions">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => checkNow(row.provider)} disabled={Boolean(rowBusy)}>
                        {rowBusy === `check:${row.provider}` ? 'Checking…' : 'Check now'}
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleEdit(row.provider)} disabled={Boolean(rowBusy)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.provider)} disabled={Boolean(rowBusy)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form id="ai-connection-form" className="admin-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? `Update ${labelFor(provider)} connection` : 'Add New Connection'}</h3>
        <label>
          Provider
          {/* Fixed while editing: changing the name here would save a
              second connection rather than update this one. */}
          <select value={provider} onChange={(event) => chooseProvider(event.target.value)} required disabled={isEditing}>
            <option value="">Choose a provider...</option>
            {PROVIDER_KINDS.map(({ kind, label }) => {
              const inKind = catalogue.filter((entry) => entry.kind === kind);
              if (inKind.length === 0) return null;
              return (
                <optgroup key={kind} label={label}>
                  {inKind.map((entry) => {
                    const already = connections.some((c) => c.provider === entry.key) && !(isEditing && entry.key === provider);
                    return (
                      <option key={entry.key} value={entry.key} disabled={already}>
                        {entry.label}{already ? ' -- already connected' : ''}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </label>
        {selectedEntry && selectedEntry.notes && (
          <p className="admin-muted">
            {selectedEntry.notes}
            {selectedEntry.key_url && (
              <>
                {' '}
                <a href={selectedEntry.key_url} target="_blank" rel="noopener noreferrer">Where the key comes from</a>
              </>
            )}
          </p>
        )}

        <label>
          Default Model
          <input type="text" value={defaultModel} onChange={(event) => setDefaultModel(event.target.value)} />
        </label>

        {selectedKind === 'self_hosted' && (
          <>
            <label>
              Host
              <input
                type="text"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value.trim())}
                required={!isEditing}
                placeholder="http://10.10.0.1:11434"
              />
            </label>
            <p className="admin-muted">Where this model runs. It needs no API key -- it is reached over our own network, and research runs use it before any paid provider.</p>
          </>
        )}

        {needsKey(selectedKind) && (
          <label>
            API Key
            <input type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} required={!isEditing} />
          </label>
        )}
        {needsKey(selectedKind) && isEditing && <p className="admin-muted">Leave blank to keep the current key</p>}

        <label className="admin-check">
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
          Enabled
        </label>

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !provider}>
            {saving ? 'Saving…' : isEditing ? 'Update Connection' : 'Add Connection'}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>
    </section>
  );
}