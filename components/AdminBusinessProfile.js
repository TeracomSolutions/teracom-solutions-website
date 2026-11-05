'use client';

import { useState } from 'react';

// Google Business Profile on its Growth tools card (Robert, 2026-11-05):
// connect Google once, then reply to reviews and post updates to the listing.

async function call(url, body) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work.');
  return data;
}

function Review({ review, onReplied }) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function send() {
    setBusy(true);
    setError('');
    try {
      await call('/api/admin/growth/business_profile/google/reply', { review: review.name, text });
      setOpen(false);
      onReplied(review.name, text);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <li className="gbp-review">
      <p><strong>{'★'.repeat(review.stars)}{'☆'.repeat(Math.max(0, 5 - review.stars))}</strong> {review.reviewer} <span className="admin-muted">{review.date}</span></p>
      {review.comment ? <p>{review.comment}</p> : <p className="admin-muted">A rating with no words.</p>}
      {review.reply ? <p className="gbp-reply"><strong>Your reply:</strong> {review.reply}</p> : null}
      {open ? (
        <div className="gbp-reply-form">
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Thank the customer by name, mention what we did, and keep it short." />
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <div className="admin-actions">
            <button type="button" className="btn btn-primary btn-sm" disabled={busy || !text.trim()} onClick={send}>{busy ? 'Sending…' : 'Post the reply on Google'}</button>
            <button type="button" className="admin-link-btn" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="admin-link-btn" onClick={() => { setText(review.reply || ''); setOpen(true); }}>{review.reply ? 'Change the reply' : 'Reply'}</button>
      )}
    </li>
  );
}

export default function AdminBusinessProfile({ tool }) {
  const [reviews, setReviews] = useState((tool.report && tool.report.reviews) || []);
  const [post, setPost] = useState('');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function connect() {
    setBusy('connect');
    setError('');
    try {
      const data = await call('/api/admin/growth/business_profile/google/authorize');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  }

  async function sendPost() {
    setBusy('post');
    setError('');
    setMessage('');
    try {
      await call('/api/admin/growth/business_profile/google/post', { summary: post, url: link });
      setPost('');
      setLink('');
      setMessage('Posted to the Google listing.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="gbp">
      <div className="admin-actions">
        <button type="button" className={`btn btn-sm ${tool.connected ? 'btn-secondary' : 'btn-primary'}`} disabled={Boolean(busy)} onClick={connect}>
          {busy === 'connect' ? 'Opening Google…' : tool.connected ? 'Connect Google again' : 'Connect Google'}
        </button>
        <span className="admin-muted">{tool.connected ? 'Connected to Google.' : 'Save the client ID and secret above first.'}</span>
      </div>
      {message ? <p className="form-note-banner" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {tool.connected ? (
        <div className="gbp-post">
          <strong>Post an update to the listing</strong>
          <textarea rows={3} value={post} maxLength={1500} onChange={(e) => setPost(e.target.value)} placeholder="A special, a new product or a recent job. Shown on Google Search and Maps." />
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link for Learn more (optional), https://…" />
          <div className="admin-actions">
            <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy) || !post.trim()} onClick={sendPost}>{busy === 'post' ? 'Posting…' : 'Post to Google'}</button>
          </div>
        </div>
      ) : null}
      {reviews.length > 0 ? (
        <>
          <strong>Latest reviews</strong>
          <ul className="gbp-reviews">
            {reviews.map((review) => (
              <Review key={review.name} review={review} onReplied={(name, text) => setReviews((list) => list.map((r) => (r.name === name ? { ...r, reply: text } : r)))} />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
