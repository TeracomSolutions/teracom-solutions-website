'use client';

import { useState } from 'react';
import { Frown, Meh, Smile, Star } from 'lucide-react';

// On the order-complete page (Robert, 2026-10-25): "How likely are you to recommend us?" from 0 to 10, a
// comment box once a score is picked, and a Google review button for every customer whatever they scored
// (Google does not allow asking only happy customers). Answers go to /api/feedback, which checks with Stripe
// that this checkout was paid.
const SCORES = Array.from({ length: 11 }, (_, i) => i);

function Face({ score }) {
  if (score >= 9) return <Smile size={22} aria-hidden="true" />;
  if (score >= 7) return <Meh size={22} aria-hidden="true" />;
  return <Frown size={22} aria-hidden="true" />;
}

function tone(score) {
  if (score >= 9) return 'good';
  if (score >= 7) return 'okay';
  return 'low';
}

async function post(body) {
  const response = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'That did not save. Please try again.');
  }
}

export default function CheckoutFeedback({ sessionId, reviewUrl }) {
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function choose(value) {
    setScore(value);
    setError('');
    try {
      await post({ session_id: sessionId, score: value });
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    setError('');
    try {
      await post({ session_id: sessionId, comment });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function reviewed() {
    post({ session_id: sessionId, google_clicked: true }).catch(() => {});
  }

  return (
    <section className="section checkout-feedback-section">
      <div className="container checkout-feedback">
        <div className="checkout-feedback-card">
          <h2>How likely are you to recommend Teracom Solutions to a friend or colleague?</h2>
          <div className="checkout-feedback-scale" role="radiogroup" aria-label="Score from 0, very unlikely, to 10, extremely likely">
            {SCORES.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={score === value}
                className={`checkout-feedback-score is-${tone(value)}${score === value ? ' is-picked' : ''}`}
                onClick={() => choose(value)}
              >
                <Face score={value} />
                <span>{value}</span>
              </button>
            ))}
          </div>
          <div className="checkout-feedback-ends" aria-hidden="true">
            <span>Very unlikely</span>
            <span>Extremely likely</span>
          </div>
          {score !== null && !sent && (
            <form className="checkout-feedback-comment" onSubmit={sendComment}>
              <p className="checkout-feedback-thanks">Thanks for your score. {score >= 9 ? 'What did we do well?' : 'What could we do better?'} (optional)</p>
              <textarea rows={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Your comment" />
              <button type="submit" className="btn btn-secondary" disabled={!comment.trim()}>Send comment</button>
            </form>
          )}
          {sent && <p className="checkout-feedback-thanks" role="status">Thank you, we read every comment.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        {reviewUrl && (
          <div className="checkout-feedback-card checkout-feedback-google">
            <span className="checkout-feedback-stars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={22} fill="currentColor" />)}
            </span>
            <h2>Review us on Google</h2>
            <p>A short review helps other businesses find us, and tells us how we are going.</p>
            <a className="btn btn-primary" href={reviewUrl} target="_blank" rel="noopener noreferrer" onClick={reviewed}>
              Write a Google review
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
