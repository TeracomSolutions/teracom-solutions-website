'use client';

import { useEffect, useState } from 'react';

import AdminLearningProgress from '@/components/AdminLearningProgress';
import AdminTeachTera from '@/components/AdminTeachTera';
import Link from 'next/link';

import AdminListPager, { useListPage } from '@/components/AdminListPager';
import AdminTeraLearning from '@/components/AdminTeraLearning';
import { formatDateTime } from '@/lib/adminFormat';

// Admin -> Support: Ask Tera's library, this month's use, the questions it
// could not answer, and the conversations (each opens to its transcript).
const LIBRARY_LABELS = { never: 'Not built yet', running: 'Building', ok: 'Ready', failed: 'Failed' };

function percent(part, whole) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '-';
}

export default function AdminSupport({ initial }) {
  const [summary, setSummary] = useState(initial.summary);
  const [facts, setFacts] = useState(initial.facts || []);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState('');
  const [transcripts, setTranscripts] = useState({});
  const [progress, setProgress] = useState(initial.summary?.progress || {});
  const [now, setNow] = useState(() => Date.now());

  const libraryRunning = summary.library?.status === 'running' || ['running', 'starting'].includes(progress.library?.status);
  const studyRunning = summary.study?.status === 'running' || ['running', 'starting'].includes(progress.study?.status);

  // While Tera is learning, ask the backend every two seconds how far it is.
  useEffect(() => {
    if (!libraryRunning && !studyRunning) return undefined;
    let stopped = false;
    // A run just started shows "Starting" until the backend writes its first step.
    const keep = (current, latest, status) => (current?.status === 'starting' && latest?.status !== 'running' && status === 'running' ? current : latest);
    async function poll() {
      try {
        const res = await fetch('/api/admin/support/progress', { cache: 'no-store' });
        if (!res.ok || stopped) return;
        const data = await res.json();
        setProgress((current) => ({
          library: keep(current.library, data.progress?.library, data.library?.status),
          study: keep(current.study, data.progress?.study, data.study?.status),
        }));
        setSummary((s) => ({ ...s, library: { ...s.library, ...data.library }, study: { ...(s.study || {}), ...data.study } }));
      } catch {
        // The next poll tries again.
      }
    }
    poll();
    const timer = setInterval(() => {
      setNow(Date.now());
      poll();
    }, 2000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [libraryRunning, studyRunning]);

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
      setProgress((p) => ({ ...p, library: { status: 'starting', percent: 0, started_at: new Date().toISOString(), updated_at: new Date().toISOString(), steps: [], log: [{ at: new Date().toISOString(), text: 'Asked the backend to start.' }] } }));
      setMessage('Rebuilding the library. Its progress shows below as it goes.');
    }
  }

  async function studyNow() {
    const data = await send('/api/admin/support/study', 'POST', null, 'study');
    if (data) {
      setSummary((s) => ({ ...s, study: { ...(s.study || {}), status: 'running' } }));
      setProgress((p) => ({ ...p, study: { status: 'starting', percent: 0, started_at: new Date().toISOString(), updated_at: new Date().toISOString(), steps: [], log: [{ at: new Date().toISOString(), text: 'Asked the backend to start.' }] } }));
      setMessage('Tera is studying the next batch of products, about 15 seconds a product. Its progress shows below as it goes.');
    }
  }

  // Keep this answer: the reply becomes something Tera has learned.
  async function keep(conversationId, messageId) {
    const fact = await send(`/api/admin/support/messages/${encodeURIComponent(messageId)}/keep`, 'POST', null, `keep-${messageId}`);
    if (fact) {
      setTranscripts((t) => ({
        ...t,
        [conversationId]: (t[conversationId] || []).map((m) => (m.id === messageId ? { ...m, kept: true } : m)),
      }));
      setFacts((list) => [fact, ...list.filter((f) => f.id !== fact.id)]);
      setMessage('Kept. Tera will give this answer when someone asks the same thing.');
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
  const known = summary.facts || { taught: 0, learned: 0 };
  const drafts = summary.drafts || { sent_unchanged: 0, sent_edited: 0, discarded: 0, waiting: 0 };
  const study = summary.study || { status: 'never', products: 0, studied: 0, found: 0 };
  // Robert (2026-11-05): the first few conversations, 5 a page (5 to 50).
  const conversations = useListPage(initial.conversations, { sizes: [5, 10, 20, 50], initialSize: 5 });
  const unanswered = useListPage(initial.unanswered, { sizes: [10, 20, 50, 100], initialSize: 10 });

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
          <dd>{summary.local_models.length ? summary.local_models.join(', ') : 'None switched on, so Tera uses the cloud within the cap.'}</dd>
        </div>
        <div>
          <dt>What Tera knows</dt>
          <dd>{known.taught} taught by staff, {known.learned} learned from chats</dd>
        </div>
        <div>
          <dt>Draft replies (30 days)</dt>
          <dd>
            {summary.settings?.draft_replies_enabled === false ? 'Switched off. ' : ''}
            {drafts.sent_unchanged} sent as Tera wrote them, {drafts.sent_edited} changed first, {drafts.discarded} discarded; {drafts.waiting} waiting on the Leads page
          </dd>
        </div>
        <div>
          <dt>Product study</dt>
          <dd>
            {study.status === 'running' ? 'Studying now. ' : ''}
            {study.studied} of {study.products} store products studied, {study.found} found on the manufacturer&apos;s website
            {study.finished_at ? `; last run ${formatDateTime(study.finished_at)}` : ''}
            {study.detail ? <span className="admin-muted"> {study.detail}</span> : null}
          </dd>
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
        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy) || study.status === 'running'} onClick={studyNow}>
          {study.status === 'running' ? 'Studying...' : 'Study now'}
        </button>
      </div>

      <h2>What Tera is learning</h2>
      <p className="admin-muted">
        The library rebuild reads the whole website, the store, the price lists, the manuals and what staff taught Tera (every night, or
        Rebuild library). The product study looks up store products on their manufacturers&apos; websites. Both update here by themselves
        every two seconds while they run.
      </p>
      <div className="learning-progress-grid">
        <AdminLearningProgress title="Library rebuild" state={progress.library} now={now} />
        <AdminLearningProgress title="Product study" state={progress.study} now={now} />
      </div>

      <h2>What Tera learns</h2>
      <AdminTeraLearning initial={summary.settings} />

      <h2>Teach Tera</h2>
      <p className="admin-muted">Questions and answers Tera searches before anything else. Write your own, or keep a good answer from a conversation below.</p>
      <AdminTeachTera facts={facts} setFacts={setFacts} draft={draft} />

      <h2>Questions Tera could not answer</h2>
      {initial.unanswered.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Question</th><th>Asked</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {unanswered.rows.map((q) => (
                <tr key={`${q.conversation_id}-${q.asked_at}`}>
                  <td className="wrap">{q.question}</td>
                  <td>{formatDateTime(q.asked_at)}</td>
                  <td>
                    <button type="button" className="admin-link-btn" onClick={() => setDraft({ question: q.question, at: Date.now() })}>
                      Teach Tera this
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminListPager view={unanswered} label="questions" />
        </div>
      ) : (
        <p className="admin-muted">None yet.</p>
      )}

      <h2>Conversations</h2>
      {initial.conversations.length ? (
        <div className="support-conversations">
          {conversations.rows.map((c) => (
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
                      {m.role === 'assistant' && m.answered ? (
                        m.kept ? (
                          <p className="admin-muted support-meta">Kept: Tera gives this answer to the same question.</p>
                        ) : (
                          <button type="button" className="admin-link-btn support-keep" disabled={Boolean(busy)} onClick={() => keep(c.id, m.id)}>
                            {busy === `keep-${m.id}` ? 'Keeping…' : 'Keep this answer'}
                          </button>
                        )
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
      <AdminListPager view={conversations} label="conversations" />
      <p className="admin-muted">
        Conversations are deleted {summary.keep_days} days after their last message. Just before that, every answer nobody rated not helpful is kept for Tera, with personal details taken out.
      </p>

      <h2>Settings</h2>
      <p className="admin-muted">
        Tera&apos;s settings (draft replies, Tera&apos;s own model on this server, the cloud cap, the product study and the manufacturers&apos;
        websites) are with the other AI settings: <Link href="/admin/ai-connections#frontend" className="admin-link">AI Connections, AI assistant for the front end, Tera&apos;s settings</Link>.
      </p>
    </div>
  );
}