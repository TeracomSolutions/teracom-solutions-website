'use client';

import { useState } from 'react';

import { CUSTOMER_ROLES, EMAIL_TOPICS, toggleTopic } from '@/lib/customerTopics';

// The account page's email preferences (Robert, 2026-11-03): which emails the
// customer wants, what describes them, and their phone and company. Ticking
// nothing is the same as unsubscribing.
export default function EmailPreferences({ customer }) {
  const [topics, setTopics] = useState(Array.isArray(customer.email_topics) ? customer.email_topics : customer.marketing_consent ? EMAIL_TOPICS.map((t) => t.key) : []);
  const [role, setRole] = useState(customer.customer_role || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [company, setCompany] = useState(customer.company || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/customer/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_topics: topics, customer_role: role || null, phone, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Your preferences could not be saved.');
      setMessage(topics.length ? 'Saved. We will only email you about what you ticked.' : 'Saved. You will not get any marketing emails from us.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form account-preferences" onSubmit={save}>
      <h2>Your details and emails</h2>
      <div className="auth-two">
        <div>
          <label htmlFor="pref-phone">Phone</label>
          <input id="pref-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
        </div>
        <div>
          <label htmlFor="pref-company">Company (optional)</label>
          <input id="pref-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={255} />
        </div>
      </div>
      <label htmlFor="pref-role">What best describes you</label>
      <select id="pref-role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Choose one</option>
        {CUSTOMER_ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
      </select>
      <fieldset className="auth-topics">
        <legend>Email me about</legend>
        {EMAIL_TOPICS.map((t) => (
          <label key={t.key} className="auth-check">
            <input type="checkbox" checked={topics.includes(t.key)} onChange={(e) => setTopics(toggleTopic(topics, t.key, e.target.checked))} />
            <span>{t.label}</span>
          </label>
        ))}
      </fieldset>
      {message ? <p className="form-note" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
