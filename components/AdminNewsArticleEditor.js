'use client';

import { useState } from 'react';

// One article from industry news: read it, fix anything, then Publish. A published
// article can be taken back to draft at any time.
export default function AdminNewsArticleEditor({ initial }) {
  const [article, setArticle] = useState(initial);
  const [form, setForm] = useState({ title: initial.title, summary: initial.summary, body: initial.body });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const changed = form.title !== article.title || form.summary !== article.summary || form.body !== article.body;

  async function call(url, method, body, done) {
    setBusy(true);
    setNote('');
    setError('');
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That did not work.');
      setArticle(data);
      setForm({ title: data.title, summary: data.summary, body: data.body });
      setNote(done);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const save = () => call(`/api/admin/industry-news/articles/${article.id}`, 'PATCH', form, 'Saved.');
  const status = (s, done) => call(`/api/admin/industry-news/articles/${article.id}/status`, 'POST', { status: s }, done);

  return (
    <div className="admin-card admin-form">
      <p className="admin-muted">
        Prompted by <a className="admin-link" href={article.source_url} target="_blank" rel="noopener noreferrer">{article.source_title}</a> ({article.source_name}).
        The website credits and links that story under the article. Check the facts against it before publishing, and that nothing is copied from it.
      </p>
      <label className="field">
        <span>Title</span>
        <input type="text" maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>
      <label className="field">
        <span>Summary (shown under the title and in search results)</span>
        <textarea rows={2} maxLength={400} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      </label>
      <label className="field">
        <span>Article</span>
        <textarea rows={22} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <span className="admin-muted">Leave a blank line between paragraphs. Start a line with ## for a heading.</span>
      </label>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={save} disabled={busy || !changed}>Save changes</button>
        {article.status !== 'published' ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => (changed ? save().then((ok) => ok && status('published', 'Published.')) : status('published', 'Published.'))} disabled={busy}>
            Publish on the website
          </button>
        ) : (
          <>
            <a className="btn btn-secondary btn-sm" href={`/resources/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">View on the website</a>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => status('draft', 'Taken off the website; it is a draft again.')} disabled={busy}>Unpublish</button>
          </>
        )}
        {article.status === 'draft' ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => status('rejected', 'Rejected. It stays here, off the website.')} disabled={busy}>Reject</button>
        ) : null}
        {article.status === 'rejected' ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => status('draft', 'Back to draft.')} disabled={busy}>Back to draft</button>
        ) : null}
      </div>
      <p className="admin-muted">Status: {article.status}{article.model ? ` · written by ${article.model}` : ''}</p>
      {note ? <p className="admin-muted" role="status">{note}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
