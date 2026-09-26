'use client';

import { useState } from 'react';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// The AI providers Scout can research with. A key is sent once and never
// shown again -- the backend keeps it encrypted and returns only its last
// four characters. Ollama is self-hosted: it takes a host, not a key.
const PROVIDERS = [
  { key: 'ollama', label: 'Ollama (self-hosted)', selfHosted: true, modelHint: 'e.g. qwen3-coder-agent' },
  { key: 'anthropic', label: 'Anthropic', modelHint: 'e.g. claude-sonnet-5' },
  { key: 'openai', label: 'OpenAI', modelHint: 'e.g. gpt-4o-mini' },
  { key: 'groq', label: 'Groq', modelHint: 'e.g. openai/gpt-oss-120b' },
];

function providerLabel(key) {
  return PROVIDERS.find((p) => p.key === key)?.label || humanise(key);
}

export default function AdminAiConnections({ initialConnections, loadError }) {
  const [connections, setConnections] = useState(initialConnections ?? []);
  const [error, setError] = useState(loadError ?? '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [provider, setProvider] = useState('ollama');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [defaultModel, setDefaultModel] = useState('');

  const selected = PROVIDERS.find((p) => p.key === provider) || PROVIDERS[0];
  const existing = connections.find((c) => c.provider === provider);

  async function reload() {
    const response = await fetch('/api/admin/ai-connections');
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Unable to load the AI connections.');
    }
    setConnections(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    const body = {};
    if (apiKey) body.api_key = apiKey;
    if (baseUrl) body.base_url = baseUrl;
    if (defaultModel) body.default_model = defaultModel;
    if (!existing) body.enabled = true;

    try {
      const response = await fetch(`/api/admin/ai-connections/${provider}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save the connection.');
      }
      setApiKey('');
      setBaseUrl('');
      setDefaultModel('');
      setNotice(`${providerLabel(provider)} saved.`);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled(connection) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/ai-connections/${connection.provider}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !connection.enabled }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update the connection.');
      }
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(connection) {
    if (!window.confirm(`Remove the ${providerLabel(connection.provider)} connection? Its key is deleted and Scout stops using it.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/ai-connections/${connection.provider}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to remove the connection.');
      }
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner">{notice}</p>}

      <h2>Configured providers</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Key</th>
              <th>Host</th>
              <th>Default model</th>
              <th>Enabled</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {connections.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-muted">No providers configured. Scout cannot run research until one is.</td>
              </tr>
            )}
            {connections.map((connection) => (
              <tr key={connection.id}>
                <td>{providerLabel(connection.provider)}</td>
                <td>{connection.key_last4 === '****' ? '—' : `…${connection.key_last4}`}</td>
                <td className="wrap">{connection.base_url || '—'}</td>
                <td>{connection.default_model || '—'}</td>
                <td>
                  <span className={`admin-status ${connection.enabled ? 'is-approved' : 'is-failed'}`}>
                    {connection.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>{formatDateTime(connection.updated_at)}</td>
                <td>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleEnabled(connection)} disabled={busy}>
                      {connection.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(connection)} disabled={busy}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{existing ? 'Update a provider' : 'Add a provider'}</h2>
      <form onSubmit={handleSubmit} className="admin-form admin-card">
        <label>
          Provider
          <select value={provider} onChange={(event) => setProvider(event.target.value)}>
            {PROVIDERS.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </label>

        {selected.selfHosted ? (
          <label>
            Host
            <input
              type="url"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              placeholder={existing?.base_url || 'http://your-ollama-host:11434'}
              required={!existing}
            />
          </label>
        ) : (
          <label>
            API key {existing && <span className="admin-muted">(leave blank to keep the current key)</span>}
            <input
              type="password"
              autoComplete="off"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              required={!existing}
            />
          </label>
        )}

        <label>
          Default model
          <input
            type="text"
            value={defaultModel}
            onChange={(event) => setDefaultModel(event.target.value)}
            placeholder={existing?.default_model || selected.modelHint}
          />
        </label>

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
            {busy ? 'Saving…' : existing ? 'Save changes' : 'Add provider'}
          </button>
        </div>
      </form>
    </div>
  );
}
