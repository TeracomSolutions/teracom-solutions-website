'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';
import { BRAND } from '@/lib/brand';

// Customer feedback on the Marketing page (Robert, 2026-10-25): the recommend score from the order-complete
// page, the comments, how many went on to Google, and the Google review link the page offers.
const BAND_LABEL = { promoter: 'Promoter', passive: 'Passive', detractor: 'Detractor' };

export default function AdminFeedback({ initial }) {
  const [data, setData] = useState(initial);
  const [url, setUrl] = useState(initial?.settings?.google_review_url || '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/feedback/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_review_url: url }),
      });
      const saved = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(saved.error || saved.detail || 'That did not save.');
      setData({ ...data, settings: saved });
      setUrl(saved.google_review_url || '');
      setMessage({ ok: true, text: saved.google_review_url ? 'Saved. The order-complete page now shows the Google review button.' : 'Saved. The Google review button is hidden.' });
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <p className="form-error" role="alert">Unable to load customer feedback from the backend.</p>;

  return (
    <section className="admin-card admin-feedback">
      <h2>Customer feedback</h2>
      <p className="admin-muted">After paying, customers are asked how likely they are to recommend us (0 to 10), can add a comment, and are offered a Google review. The last {data.days} days:</p>
      <div className="admin-feedback-stats">
        <div><strong>{data.score === null ? '–' : data.score}</strong><span>Recommend score (promoters less detractors, -100 to 100)</span></div>
        <div><strong>{data.answers}</strong><span>Answers</span></div>
        <div className="is-good"><strong>{data.promoter}</strong><span>Promoters (9-10)</span></div>
        <div className="is-okay"><strong>{data.passive}</strong><span>Passives (7-8)</span></div>
        <div className="is-low"><strong>{data.detractor}</strong><span>Detractors (0-6)</span></div>
        <div><strong>{data.google_clicks}</strong><span>Went to Google to review</span></div>
      </div>

      <form className="admin-form" onSubmit={save}>
        <label>
          Google review link
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={500} placeholder="https://g.page/r/.../review" />
        </label>
        <p className="admin-muted">Paste the review link from the {BRAND.name} Google Business Profile (an https Google address). Leave it blank to hide the button. The button is shown to every customer whatever score they give, as Google requires.</p>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save link'}</button>
        </div>
        {message && <p className={message.ok ? 'form-note-banner' : 'form-error'} role={message.ok ? 'status' : 'alert'}>{message.text}</p>}
      </form>

      <h3>Recent answers</h3>
      {data.recent.length === 0 ? (
        <p className="admin-muted">No answers yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>When</th><th>Score</th><th>Comment</th><th>Customer</th><th>Google</th></tr>
            </thead>
            <tbody>
              {data.recent.map((row) => (
                <tr key={row.id}>
                  <td>{formatDateTime(row.created_at)}</td>
                  <td>{row.score === null ? '–' : `${row.score} · ${BAND_LABEL[row.band] || ''}`}</td>
                  <td>{row.comment || '–'}</td>
                  <td>{row.email || '–'}</td>
                  <td>{row.google_clicked ? 'Went to review' : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
