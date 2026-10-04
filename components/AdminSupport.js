'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

// Admin -> Support: Ask Tera's library, this month's use, the questions it
// could not answer, and the conversations (each opens to its transcript).
const LIBRARY_LABELS = { never: 'Not built yet', running: 'Building', ok: 'Ready', failed: 'Failed' };

function percent(part, whole) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '-';
}

export default function AdminSupport({ initial }) {
  const [summary, setSummary] = useState(initial.summary);
  const [cap, setCap] = useState(String(initial.summary.monthly_cloud_cap));
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState('');
  const [transcripts, setTranscripts] = useState({});

  async function send(url, method, body, label) {
    setBusy(label);
    setError('');
    setMessage('');
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'That did not work.');
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy('');
    }
  }

  async function rebuild() {
    const data = await send('/api/admin/support/library', 'POST', null, 'rebuild');
    if (data) {
      setSummary((s) => ({ ...s, library: { ...s.library, status: 'running' } }));
      setMessage('Rebuilding the library. It takes about a minute; reload the page to see the result.');
    }
  }

  async function saveCap(event) {
    event.preventDefault();
    const data = await send('/api/admin/support/settings', 'PUT', { monthly_cloud_cap: Number(cap) || 0 }, 'cap');
    if (data) {
      setSummary((s) => ({ ...s, monthly_cloud_cap: data.monthly_cloud_cap }));
      setMessage('Monthly cloud cap saved.');
    }
  }

  async function toggle(id) {
    if (openId === id) {
      setOpenId('');
      return;
    }
    setOpenId(id);
    if (!transcripts[id]) {
      const data = await send(`/api/admin/support/conversations/${encodeURIComponent(id)}`, 'GET', null, `open-${id}`);
      if (data) setTranscripts((t) => ({ ...t, [id]: data.messages }));
    }
  }

  const last = summary.last_30_days;
  const library = summary.library;

  return (
    <div>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <dl className="admin-facts">
        <div>
          <dt>Library</dt>
          <dd>
            {LIBRARY_LABELS[library.status] || library.status}
            {library.built_at ? `, built ${formatDateTime(library.built_at)}` : ''}
            {library.detail ? <span className="admin-muted"> {library.detail}</span> : null}
          </dd>
        </div>
        <div>
          <dt>Cloud answers this month</dt>
          <dd>{summary.cloud_answers_this_month} of {summary.monthly_cloud_cap}</dd>
        </div>
        <div>
          <dt>Local model</dt>
          <dd>{summary.local_models.length ? summary.local_models.join(', ') : 'None reachable by a public address yet, so Tera uses the cloud within the cap.'}</dd>
        </div>
        <div>
          <dt>Last 30 days</dt>
          <dd>
            {last.conversations} conversations, {last.answers} answers, {percent(last.answered, last.answers)} answered from the library; {last.helpful} helpful, {last.not_helpful} not
          </dd>
        </div>
      </dl>

      <div className="admin-actions support-controls">
        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || library.status === 'running'} onClick={rebuild}>
          {library.status === 'running' ? 'Building...' : 'Rebuild library'}
        </button>
        <form className="support-cap" onSubmit={saveCap}>
          <label htmlFor="support-cap">Cloud answers allowed per month</label>
          <input id="support-cap" type="number" min="0" step="10" value={cap} onChange={(e) => setCap(e.target.value)} />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={Boolean(busy)}>Save</button>
        </form>
      </div>

      <h2>Questions Tera could not answer</h2>
      {initial.unanswered.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Question</th><th>Asked</th></tr>
            </thead>
            <tbody>
              {initial.unanswered.map((q) => (
                <tr key={`${q.conversation_id}-${q.asked_at}`}>
                  <td className="wrap">{q.question}</td>
                  <td>{formatDateTime(q.asked_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-muted">None yet.</p>
      )}

      <h2>Conversations</h2>
      {initial.conversations.length ? (
        <div className="support-conversations">
          {initial.conversations.map((c) => (
            <div key={c.id} className="admin-card support-conversation">
              <button type="button" className="support-conversation-head" aria-expanded={openId === c.id} onClick={() => toggle(c.id)}>
                <strong>{c.customer}</strong>
                <span className="admin-muted">{c.email}</span>
                <span className="support-first-question">{c.first_question}</span>
                <span className="admin-muted">
                  {c.messages / 2} questions{c.unanswered ? `, ${c.unanswered} not answered` : ''}, last {formatDateTime(c.last_message_at)}
                </span>
              </button>
              {openId === c.id ? (
                <div className="support-transcript">
                  {(transcripts[c.id] || []).map((m) => (
                    <div key={m.id} className={`support-line is-${m.role}`}>
                      <p>
                        <strong>{m.role === 'user' ? 'Customer' : 'Tera'}:</strong> {m.content}
                      </p>
                      {m.role === 'assistant' ? (
                        <p className="admin-muted support-meta">
                          {m.answered ? 'Answered from the library' : 'Not covered'}
                          {m.model ? `, ${m.model}${m.used_cloud ? ' (cloud)' : ''}` : ''}
                          {m.feedback === 1 ? ', rated helpful' : m.feedback === -1 ? ', rated not helpful' : ''}
                          {m.sources?.length ? `. Sources: ${m.sources.map((s) => s.title).join('; ')}` : ''}
                        </p>
                      ) : null}
                    </div>
                  ))}
                  {!transcripts[c.id] ? <p className="admin-muted">Loading...</p> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-muted">No conversations yet. Tera appears on every page for signed-in customers.</p>
      )}
      <p className="admin-muted">Conversations are deleted {summary.keep_days} days after their last message.</p>
    </div>
  );
}