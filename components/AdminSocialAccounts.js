'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';
import { NETWORKS, statusLabel, statusTone } from '@/lib/socialFormat';

// One card per network: the profile link the footer shows, whether to show
// it, and the credentials we post with. Credentials are write-only: the
// backend keeps them encrypted and only ever says which fields are set.
async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'The backend did not accept that.');
  return data;
}

function AccountCard({ network, account, onChange }) {
  const [displayName, setDisplayName] = useState(account?.display_name || '');
  const [profileUrl, setProfileUrl] = useState(account?.profile_url || '');
  const [showOnSite, setShowOnSite] = useState(account?.show_on_site !== false);
  const [credentials, setCredentials] = useState({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const configured = Boolean(account?.configured);
  const status = account?.status || 'not_configured';

  async function run(label, action) {
    setBusy(label);
    setError('');
    setNotice('');
    try {
      const result = await action();
      if (result) setNotice(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  function save(event) {
    event.preventDefault();
    run('save', async () => {
      const body = { display_name: displayName, profile_url: profileUrl, show_on_site: showOnSite };
      const filled = Object.fromEntries(Object.entries(credentials).filter(([, v]) => v && v.trim()));
      if (Object.keys(filled).length) body.credentials = filled;
      const saved = await send(`/api/admin/social/accounts/${network.key}`, 'PUT', body);
      setCredentials({});
      onChange(saved);
      return `${network.label} saved.`;
    });
  }

  function check() {
    run('check', async () => {
      const result = await send(`/api/admin/social/accounts/${network.key}/check`, 'POST');
      const fresh = await send('/api/admin/social/accounts', 'GET');
      const mine = fresh.find((a) => a.network === network.key);
      if (mine) onChange(mine);
      const speed = result.latency_ms != null ? ` (${result.latency_ms} ms)` : '';
      if (!result.ok) throw new Error(`Not working: ${result.detail}`);
      return `Working: ${result.detail}${speed}`;
    });
  }

  function clear() {
    if (!window.confirm(`Remove the saved ${network.label} credentials? The link stays; posting to ${network.label} stops until new ones are saved.`)) return;
    run('clear', async () => {
      await send(`/api/admin/social/accounts/${network.key}/credentials`, 'DELETE');
      const fresh = await send('/api/admin/social/accounts', 'GET');
      const mine = fresh.find((a) => a.network === network.key);
      if (mine) onChange(mine);
      return `${network.label} credentials removed.`;
    });
  }

  return (
    <form className="admin-form admin-card admin-social-card" onSubmit={save}>
      <div className="admin-social-head">
        <h3>{network.label}</h3>
        <span className={`admin-pill admin-pill-${statusTone(status)}`}>{statusLabel(status)}</span>
      </div>
      <p className="admin-muted">{network.help}</p>

      <label>
        Display name
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={120} placeholder={`Teracom Solutions on ${network.label}`} />
      </label>
      <label>
        Profile link
        <input type="url" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} maxLength={500} placeholder="https://" />
      </label>
      <label className="admin-check">
        <input type="checkbox" checked={showOnSite} onChange={(e) => setShowOnSite(e.target.checked)} />
        Show this link in the website footer
      </label>

      {network.credentialFields.length > 0 && (
        <fieldset className="admin-social-credentials">
          <legend>
            Posting credentials
            <span className="admin-muted"> {configured ? `set: ${account.credential_hint}` : 'not set'}</span>
          </legend>
          {network.credentialFields.map(([field, label]) => (
            <label key={field}>
              {label}
              <input
                type="password"
                autoComplete="off"
                value={credentials[field] || ''}
                onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                placeholder={configured ? 'unchanged' : ''}
              />
            </label>
          ))}
        </fieldset>
      )}

      <p className="admin-muted">
        {account?.last_checked_at ? `Last checked ${formatDateTime(account.last_checked_at)}` : 'Not checked yet'}
      </p>

      {/* The card's own message box, right above its buttons, so a long
          message wraps inside the card instead of running over the next one. */}
      <div className="admin-social-result" aria-live="polite">
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="form-note-banner" role="status">{notice}</p>}
        {!error && !notice && account?.last_error && (
          <p className="form-error">Last check failed: {account.last_error}</p>
        )}
      </div>

      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>{busy === 'save' ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={check} disabled={Boolean(busy)}>{busy === 'check' ? 'Checking…' : 'Check'}</button>
        {configured && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={clear} disabled={Boolean(busy)}>Clear credentials</button>
        )}
      </div>
    </form>
  );
}

export default function AdminSocialAccounts({ initialAccounts, loadError }) {
  const [accounts, setAccounts] = useState(initialAccounts || []);

  function replace(saved) {
    setAccounts((current) => {
      const rest = current.filter((a) => a.network !== saved.network);
      return [...rest, saved];
    });
  }

  return (
    <section className="admin-social">
      {loadError && <p className="form-error" role="alert">{loadError}</p>}
      <div className="admin-social-grid">
        {NETWORKS.map((network) => (
          <AccountCard
            key={network.key}
            network={network}
            account={accounts.find((a) => a.network === network.key)}
            onChange={replace}
          />
        ))}
      </div>
    </section>
  );
}
