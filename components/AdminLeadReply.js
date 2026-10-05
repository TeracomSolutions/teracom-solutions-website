'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

// Admin -> Leads: Tera's draft reply to one enquiry (Robert, 2026-10-05).
// Staff read it, change it if they like, and send it to the person by email,
// or discard it, or ask Tera to draft again. Nothing is emailed until Send.
// For a callback request the draft is notes for whoever rings back.
async function call(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

export default function AdminLeadReply({ lead, onChange }) {
  const draft = lead.draft;
  const isCallback = lead.inquiry_type === 'callback';
  const [text, setText] = useState(draft?.draft_text || '');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const base = `/api/admin/leads/${encodeURIComponent(lead.id)}`;

  async function run(label, work) {
    setBusy(label);
    setError('');
    try {
      await work();
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
      setConfirming(false);
    }
  }

  if (draft?.status === 'sent') {
    return (
      <div className="lead-reply">
        <p className="admin-muted">
          Reply sent {formatDateTime(draft.sent_at)}{draft.edited ? ", changed from Tera's draft" : ', as Tera drafted it'}.
        </p>
        <p className="lead-reply-text">{draft.sent_text}</p>
      </div>
    );
  }

  return (
    <div className="lead-reply">
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {draft?.status === 'drafting' ? (
        <p className="admin-muted">Tera is writing a draft. It takes up to a couple of minutes; press Refresh to see it.</p>
      ) : null}
      {draft?.status === 'failed' ? (
        <p className="admin-muted">Tera could not draft this one: {draft.error}</p>
      ) : null}
      {draft?.status === 'discarded' ? <p className="admin-muted">Draft discarded.</p> : null}
      {!draft ? <p className="admin-muted">No draft yet. Write a reply yourself, or ask Tera for one.</p> : null}

      <label className="lead-reply-label" htmlFor={`reply-${lead.id}`}>
        {isCallback ? 'Notes for the call' : `Reply to ${lead.email}`}
        {draft?.model ? <span className="admin-muted"> (drafted by {draft.model})</span> : null}
      </label>
      <textarea
        id={`reply-${lead.id}`}
        className="lead-reply-box"
        rows={isCallback ? 6 : 10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isCallback ? 'What to cover on the call.' : 'Write the reply to send.'}
      />
      {draft?.sources?.length ? (
        <p className="admin-muted lead-reply-sources">From: {draft.sources.map((s) => s.title).join('; ')}</p>
      ) : null}

      <div className="admin-actions">
        {!isCallback ? (
          confirming ? (
            <>
              <span className="admin-muted">Email this to {lead.email}?</span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={Boolean(busy)}
                onClick={() => run('send', () => call(`${base}/reply`, 'POST', { text }))}
              >
                {busy === 'send' ? 'Sending…' : 'Yes, send it'}
              </button>
              <button type="button" className="admin-link-btn" onClick={() => setConfirming(false)}>No</button>
            </>
          ) : (
            <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy) || !text.trim()} onClick={() => setConfirming(true)}>
              Send reply
            </button>
          )
        ) : null}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={Boolean(busy) || draft?.status === 'drafting'}
          onClick={() => run('draft', () => call(`${base}/draft`, 'POST'))}
        >
          {busy === 'draft' ? 'Asking Tera…' : draft ? 'Draft again' : 'Ask Tera for a draft'}
        </button>
        {draft && draft.status !== 'discarded' ? (
          <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => run('discard', () => call(`${base}/draft`, 'DELETE'))}>
            Discard draft
          </button>
        ) : null}
      </div>
    </div>
  );
}