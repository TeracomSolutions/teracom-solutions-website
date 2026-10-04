'use client';

import { useEffect, useRef, useState } from 'react';

// Admin -> Support -> Teach Tera: facts staff write for Tera, and the answers
// it learned from its own chats (rated helpful, kept by staff, or kept just
// before a chat is deleted). Tera searches these before anything else.
const EMPTY = { id: '', question: '', answer: '', active: true };
const ORIGIN_LABELS = { staff: 'Taught', learned: 'Learned' };
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'staff', label: 'Taught by staff' },
  { key: 'learned', label: 'Learned from chats' },
  { key: 'off', label: 'Switched off' },
];

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

function factUrl(id) {
  return `/api/admin/support/facts/${encodeURIComponent(id)}`;
}

export default function AdminTeachTera({ facts, setFacts, draft }) {
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState('all');
  const [confirmId, setConfirmId] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef(null);

  // "Teach Tera this" on a question Tera could not answer starts a new fact.
  useEffect(() => {
    if (!draft?.question) return;
    setForm({ ...EMPTY, question: draft.question });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [draft]);

  async function run(label, work, done) {
    setBusy(label);
    setError('');
    setMessage('');
    try {
      done(await work());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  function save(event) {
    event.preventDefault();
    const editing = Boolean(form.id);
    const body = { question: form.question.trim(), answer: form.answer.trim(), active: form.active };
    run('save', () => call(editing ? factUrl(form.id) : '/api/admin/support/facts', editing ? 'PUT' : 'POST', body), (fact) => {
      setFacts((list) => [fact, ...list.filter((f) => f.id !== fact.id)]);
      setForm(EMPTY);
      setMessage(editing ? 'Saved. Tera uses the change straight away.' : 'Tera knows this now.');
    });
  }

  function edit(fact) {
    setForm({ id: fact.id, question: fact.question, answer: fact.answer, active: fact.active });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function toggle(fact) {
    const body = { question: fact.question, answer: fact.answer, active: !fact.active };
    run(`toggle-${fact.id}`, () => call(factUrl(fact.id), 'PUT', body), (saved) => {
      setFacts((list) => list.map((f) => (f.id === saved.id ? saved : f)));
    });
  }

  function remove(fact) {
    run(`delete-${fact.id}`, () => call(factUrl(fact.id), 'DELETE'), () => {
      setFacts((list) => list.filter((f) => f.id !== fact.id));
      setConfirmId('');
      if (form.id === fact.id) setForm(EMPTY);
    });
  }

  const shown = facts.filter((f) => {
    if (filter === 'off') return !f.active;
    if (filter === 'all') return true;
    return f.origin === filter;
  });

  return (
    <div className="teach-tera">
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <form ref={formRef} className="admin-form" onSubmit={save}>
        <label>
          Question, as a customer would ask it
          <input
            value={form.question}
            maxLength={500}
            required
            placeholder="Do you supply Kantech access control?"
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          />
        </label>
        <label>
          Tera&apos;s answer
          <textarea
            rows={5}
            value={form.answer}
            maxLength={4000}
            required
            placeholder="Write the answer Tera should give."
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          />
        </label>
        <label className="admin-check">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Tera uses this
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>
            {busy === 'save' ? 'Saving…' : form.id ? 'Save changes' : 'Teach Tera'}
          </button>
          {form.id || form.question || form.answer ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setForm(EMPTY)}>Cancel</button>
          ) : null}
        </div>
        <p className="admin-muted">Card numbers, keys, phone numbers, email and street addresses are taken out before anything is saved.</p>
      </form>

      <div className="teach-filters" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Question</th><th>Answer</th><th>Kind</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shown.map((fact) => (
                <tr key={fact.id} className={fact.active ? '' : 'is-off'}>
                  <td className="wrap">{fact.question}</td>
                  <td className="wrap teach-answer">{fact.answer}</td>
                  <td>{ORIGIN_LABELS[fact.origin] || fact.origin}{fact.active ? '' : ', off'}</td>
                  <td className="teach-actions">
                    <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => edit(fact)}>Edit</button>
                    <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => toggle(fact)}>
                      {fact.active ? 'Switch off' : 'Switch on'}
                    </button>
                    {confirmId === fact.id ? (
                      <>
                        <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => remove(fact)}>Yes, delete</button>
                        <button type="button" className="admin-link-btn" onClick={() => setConfirmId('')}>No</button>
                      </>
                    ) : (
                      <button type="button" className="admin-link-btn" disabled={Boolean(busy)} onClick={() => setConfirmId(fact.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-muted">
          {facts.length ? 'Nothing here.' : 'Nothing yet. Teach Tera a question and its answer above, or keep a good answer from a conversation below.'}
        </p>
      )}
    </div>
  );
}