'use client';

import { useState } from 'react';

import { formatDateTime, humanise } from '@/lib/adminFormat';
import { groupProviders, providerStatus, kindLabel } from '@/lib/aiProviderStatus';

export default function AdminAiConnections({ initialConnections, loadError, providers }) {
  const [connections, setConnections] = useState(initialConnections ?? []);
  const [error, setError] = useState(loadError ?? '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [defaultModel, setDefaultModel] = useState('');

  // Initialize provider selection with the first available non-connected hosted provider or first provider
  const allProviders = providers || [];
  const { native, hosted, selfHosted } = groupProviders(allProviders);
  
  if (provider === '') {
    // Find first non-connected hosted provider
    const firstAvailable = [...hosted, ...allProviders].find(p => {
      const status = providerStatus(p, connections);
      return status !== 'connected';
    });
    if (firstAvailable) {
      setProvider(firstAvailable.key);
    } else if (allProviders.length > 0) {
      setProvider(allProviders[0].key);
    }
  }

  const selected = allProviders.find((p) => p.key === provider) || allProviders[0];
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
      setNotice(`${selected.label} saved.`);
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
            <optgroup label="Hosted APIs">
              {hosted.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
              {native.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </optgroup>
            {selfHosted.length > 0 && (
              <optgroup label="Self-hosted">
                {selfHosted.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </optgroup>
            )}
          </select>
        </label>

        {selected.selfHosted ? (
          <label>
            Host
            <input
              type="url"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              placeholder={existing?.base_url || selected.base_url || 'http://your-ollama-host:11434'}
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

        {selected.key_url && (
          <p className="admin-muted">
            Get a key: <a href={selected.key_url} target="_blank" rel="noopener noreferrer">{selected.key_url}</a>
          </p>
        )}

        <label>
          Default model
          <input
            type="text"
            value={defaultModel}
            onChange={(event) => setDefaultModel(event.target.value)}
            placeholder={existing?.default_model || selected.default_model || 'model name'}
          />
        </label>

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
            {busy ? 'Saving…' : existing ? 'Save changes' : 'Add provider'}
          </button>
        </div>
      </form>

      <h2>What you can connect</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Kind</th>
              <th>Good for</th>
              <th>Default model</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allProviders.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-muted">Loading providers...</td>
              </tr>
            )}
            {allProviders.map((provider) => {
              const status = providerStatus(provider, connections);
              return (
                <tr key={provider.key}>
                  <td>{provider.label}</td>
                  <td>{kindLabel(provider.kind)}</td>
                  <td>{provider.notes || '-'}</td>
                  <td>{provider.default_model || '-'}</td>
                  <td>
                    <span className={`admin-status is-${status === 'connected' ? 'approved' : status === 'disabled' ? 'failed' : 'pending'}`}>
                      {status === 'connected' ? 'Connected' : status === 'disabled' ? 'Disabled' : 'Not connected'}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setProvider(provider.key);
                        // Scroll form into view
                        document.getElementById('ai-connection-form').scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {status === 'connected' ? 'Change' : 'Set up'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
