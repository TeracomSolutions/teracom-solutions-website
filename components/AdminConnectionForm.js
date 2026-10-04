'use client';

import { useState } from 'react';

// The keys for one connection the console keeps itself (Zoho Books,
// Cloudflare, Vercel). Saved keys are never sent back: a blank secret box
// keeps the saved one. The steps follow each provider's own guide
// (checked 2026-10-04).
const HOW_TO = {
  zoho_books: [
    'Open the Zoho API Console at api-console.zoho.com.au and click Get Started, or Add Client if it already has one.',
    'Hover over Server-based Applications and click Create Now.',
    'Client Name: Teracom website. Homepage URL: https://www.teracomsolutions.com.au. Authorized Redirect URI: the address below. Click Create.',
    'Copy the Client ID and Client Secret from its Client Secret tab into the boxes here, Save, then press Connect to Zoho Books.',
  ],
  cloudflare: [
    'In the Cloudflare dashboard go to My Profile, API Tokens, and select Create Token, then Create Custom Token.',
    'Permissions: Account, Cloudflare Tunnel, Read; and Zone, Zone, Read.',
    'Account Resources: Include, the Teracom account. Zone Resources: Include, Specific zone, teracomsolutions.com.au.',
    'Continue to summary, Create Token, and paste the token here. Cloudflare shows it only once.',
  ],
  vercel: [
    'In Vercel open your Account Settings, Tokens page (vercel.com/account/tokens).',
    'Name it Teracom console. In Scope pick the Teracom Solutions team, then the teracom-solutions-website project.',
    'Choose an expiration, select Create, and paste the token here. Vercel shows it only once.',
  ],
};

export default function AdminConnectionForm({ connection, onSaved, onCancel }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(connection.fields.map((field) => [field.name, field.secret ? '' : field.value || ''])),
  );
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const url = `/api/admin/connections/${encodeURIComponent(connection.key)}`;

  async function send(method, label, done) {
    setBusy(label);
    setError('');
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'PUT' ? JSON.stringify({ values }) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'That did not save.');
        return;
      }
      onSaved(done);
    } catch {
      setError('That did not save. Check your connection and try again.');
    } finally {
      setBusy('');
    }
  }

  function submit(event) {
    event.preventDefault();
    send('PUT', 'save', `${connection.name} saved. Press Test to check it.`);
  }

  return (
    <form className="admin-form connection-form" onSubmit={submit}>
      {HOW_TO[connection.key] ? (
        <ol className="connection-steps">
          {HOW_TO[connection.key].map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}
      {connection.redirect_uri ? (
        <div>
          <p className="admin-muted">Redirect address for Zoho:</p>
          <code className="connection-code">{connection.redirect_uri}</code>
        </div>
      ) : null}
      {connection.fields.map((field) => (
        <label key={field.name}>
          {field.label}
          <input
            type={field.secret ? 'password' : 'text'}
            autoComplete={field.secret ? 'new-password' : 'off'}
            value={values[field.name]}
            placeholder={field.secret ? (field.set ? `Saved (${field.hint}). Leave blank to keep it.` : 'Paste it here') : field.default || ''}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
          />
        </label>
      ))}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>
          {busy === 'save' ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        {confirmClear ? (
          <>
            <span className="admin-muted">Remove every key for {connection.name}?</span>
            <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => send('DELETE', 'clear', `${connection.name} keys removed.`)}>
              {busy === 'clear' ? 'Removing…' : 'Yes, remove'}
            </button>
            <button type="button" className="admin-link-btn" onClick={() => setConfirmClear(false)}>No</button>
          </>
        ) : (
          <button type="button" className="admin-link-btn" onClick={() => setConfirmClear(true)}>Remove keys</button>
        )}
      </div>
    </form>
  );
}