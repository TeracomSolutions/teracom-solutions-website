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
    draft_replies_enabled: settings.draft_replies_enabled !== false,
    study_schedule: settings.study_schedule || 'daily',
    study_batch: String(settings.study_batch ?? 100),
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
          draft_replies_enabled: values.draft_replies_enabled,
          study_schedule: values.study_schedule,
          study_batch: Math.min(500, Math.max(10, Number(values.study_batch) || 100)),
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
        <input type="checkbox" checked={values.draft_replies_enabled} onChange={(e) => set('draft_replies_enabled', e.target.checked)} />
        Tera drafts a reply to every new enquiry for you to check and send on the Leads page
      </label>
      <p className="admin-muted">Nothing is emailed until someone presses Send. Untick to stop the drafts; you can still ask Tera for one on any enquiry.</p>
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
        Study products on manufacturer websites
        <select value={values.study_schedule} onChange={(e) => set('study_schedule', e.target.value)}>
          <option value="daily">Every day</option>
          <option value="weekly">Every week</option>
          <option value="off">Off (Study now only)</option>
        </select>
        <span className="admin-muted">Tera looks up each store product on the website of its manufacturer and keeps what the page says about it. Never-studied products go first; each is studied again after 90 days.</span>
      </label>
      <label>
        Products per study run
        <input type="number" min="10" max="500" step="10" value={values.study_batch} onChange={(e) => set('study_batch', e.target.value)} />
        <span className="admin-muted">About 15 seconds a product, so 100 takes about 25 minutes.</span>
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
