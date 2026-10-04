'use client';

import { useState } from 'react';

import { splitSites } from '@/lib/teachTera';

// Admin -> Support -> Settings: the monthly cloud cap, Tera's own model on
// this server, and reading manufacturers' websites.
function formValues(settings) {
  return {
    monthly_cloud_cap: String(settings.monthly_cloud_cap ?? 0),
    local_model_enabled: Boolean(settings.local_model_enabled),
    local_model_url: settings.local_model_url || '',
    local_model: settings.local_model || '',
    web_search_enabled: Boolean(settings.web_search_enabled),
    manufacturer_sites: (settings.manufacturer_sites || []).join(', '),
  };
}

export default function AdminTeraSettings({ initial, onSaved }) {
  const [values, setValues] = useState(formValues(initial));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function set(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/support/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_cloud_cap: Number(values.monthly_cloud_cap) || 0,
          local_model_enabled: values.local_model_enabled,
          local_model_url: values.local_model_url.trim(),
          local_model: values.local_model.trim(),
          web_search_enabled: values.web_search_enabled,
          manufacturer_sites: splitSites(values.manufacturer_sites),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'That did not work.');
      setValues(formValues(data));
      setMessage('Settings saved.');
      onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={save}>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <label className="admin-check">
        <input type="checkbox" checked={values.local_model_enabled} onChange={(e) => set('local_model_enabled', e.target.checked)} />
        Answer with Tera&apos;s own model on this server first
      </label>
      <label>
        Model address
        <input value={values.local_model_url} maxLength={300} placeholder="http://127.0.0.1:11434/v1" onChange={(e) => set('local_model_url', e.target.value)} />
        <span className="admin-muted">Ollama on this server is http://127.0.0.1:11434/v1. Only this server or a public https address is accepted, never a local network or VPN address.</span>
      </label>
      <label>
        Model
        <input value={values.local_model} maxLength={120} placeholder="qwen2.5:3b" onChange={(e) => set('local_model', e.target.value)} />
        <span className="admin-muted">A model already pulled into Ollama. Its answer appears word by word. If it goes 20 seconds without writing, a cloud model answers instead, within the cap below.</span>
      </label>
      <label>
        Cloud answers allowed per month
        <input type="number" min="0" step="10" value={values.monthly_cloud_cap} onChange={(e) => set('monthly_cloud_cap', e.target.value)} />
      </label>
      <label className="admin-check">
        <input type="checkbox" checked={values.web_search_enabled} onChange={(e) => set('web_search_enabled', e.target.checked)} />
        Read manufacturers&apos; websites when Tera&apos;s library has nothing
      </label>
      <label>
        Manufacturers&apos; websites
        <textarea rows={4} value={values.manufacturer_sites} onChange={(e) => set('manufacturer_sites', e.target.value)} />
        <span className="admin-muted">Tera only reads pages on these sites, or on a site named after a brand it has never heard of (kantech.com for Kantech). Separate them with commas or new lines.</span>
      </label>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
    </form>
  );
}
