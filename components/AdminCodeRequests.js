'use client';

import { useEffect, useState } from 'react';

// Assistant -> Code changes (Robert, 2026-10-23): ask for a change to the public
// website's front end in plain English. OpenHands (the local Qwen3 model) writes
// it on a copy of the website; it is tested and built, and arrives as a pull
// request. Nothing is merged or deployed without a person.

const STATUS_TEXT = {
  queued: 'Waiting for the coding worker',
  building: 'OpenHands is writing it',
  built: 'Written; testing it',
  testing: 'Running the tests and the build',
  pr_open: 'Pull request ready to review',
  failed: 'Did not work',
  cancelled: 'Cancelled',
};

function tone(status) {
  if (status === 'pr_open') return 'is-ok';
  if (status === 'failed') return 'is-bad';
  if (status === 'cancelled') return '';
  return 'is-busy';
}

async function call(path, method, body) {
  const response = await fetch(`/api/admin/code-requests${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

export default function AdminCodeRequests({ initial }) {
  const [state, setState] = useState(initial);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const fresh = await call('', 'GET');
        if (!cancelled) setState(fresh);
      } catch {
        // Keep the last picture; the next refresh may work.
      }
    }
    const timer = setInterval(refresh, 20000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (!state) return null;
  if (state.enabled === false) return null;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await call('', 'POST', { title, description });
      setTitle('');
      setDescription('');
      setMessage('Requested. OpenHands picks it up within a minute; this list updates by itself.');
      setState(await call('', 'GET'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id) {
    setBusy(true);
    setError('');
    try {
      await call(`/${id}/cancel`, 'POST');
      setState(await call('', 'GET'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const requests = state.requests || [];

  return (
    <section className="admin-card" style={{ marginTop: '24px' }}>
      <h2 style={{ marginTop: 0 }}>Code changes (front end)</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Ask for a change to the public website in plain English. OpenHands, using the local Qwen3 model, writes it on a copy of the website. The change is tested and built, and arrives as a pull request for you to review. Nothing is merged or deployed without a person. It can only change the website&apos;s pages, components, helper libraries and public files: never this console, the API, the back end, settings, packages or anything secret.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}
      <form onSubmit={submit} className="admin-form">
        <label>
          Short title
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required placeholder="Bigger heading on the home page" />
        </label>
        <label>
          What should change
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={3000}
            required
            placeholder="On the home page, make the main heading larger on phones and give the Open Store button more space around it."
          />
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || title.trim().length === 0 || description.trim().length < 15}>
            {busy ? 'Working...' : 'Request the change'}
          </button>
        </div>
      </form>

      <h3>Requests</h3>
      {requests.length === 0 ? (
        <p className="admin-muted">No requests yet.</p>
      ) : (
        <ul className="cr-list">
          {requests.map((item) => (
            <li key={item.id} className="cr-item">
              <div className="cr-head">
                <strong>{item.title}</strong>
                <span className={`bp-chip ${tone(item.status)}`}>{STATUS_TEXT[item.status] || item.status}</span>
              </div>
              {item.detail ? <p className="admin-muted">{item.detail}</p> : null}
              {item.files && item.files.length > 0 ? <p className="admin-muted">Files: {item.files.join(', ')}</p> : null}
              <p className="admin-muted">
                {item.pr_url ? <a href={item.pr_url} target="_blank" rel="noreferrer">Open the pull request</a> : null}
                {item.status === 'queued' ? (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => cancel(item.id)} disabled={busy}>Cancel</button>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
