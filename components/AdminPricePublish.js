'use client';

import { useState } from 'react';
import { publishDetails, publishState } from '@/lib/pricePublishView';

export default function AdminPricePublish({ initial }) {
  const [status, setStatus] = useState(initial);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [justDone, setJustDone] = useState(false);

  async function makeLive() {
    setRunning(true);
    setError('');
    setJustDone(false);
    try {
      const response = await fetch('/api/admin/pricing/publish', { method: 'POST' });
      if (!response.ok) {
        setError('Could not make prices live. Try again.');
      } else {
        const result = await response.json();
        setStatus(result);
        setJustDone(true);
      }
    } catch (err) {
      setError('Could not make prices live. Try again.');
    } finally {
      setRunning(false);
    }
  }

  const state = publishState(status);
  const details = publishDetails(status);

  return (
    <section className="admin-card">
      <h2>Prices on the website</h2>
      <p className="lead">Prices follow the markups on this page. The store keeps saved copies of its pages, so after a change press the button to put the new prices on the website straight away. RRP changes made on the Catalog tab (Reprice) need it too.</p>
      <p><span className={'admin-status admin-status-' + state.tone}>{state.headline}</span></p>
      <dl className="audit-detail-list">
        <div className="audit-detail-item">
          <dt>Last prices changed</dt>
          <dd>{details.changed}</dd>
        </div>
        <div className="audit-detail-item">
          <dt>Last made live</dt>
          <dd>{details.published}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={makeLive}
        disabled={running}
      >
        {running ? 'Making prices live...' : 'Make prices live now'}
      </button>
      {running && (
        <>
          <progress aria-label="Making prices live" />
          <p className="admin-muted">Refreshing the saved store pages. This takes a few seconds.</p>
        </>
      )}
      {justDone && !error && !running && (
        <p role="status">Done. The website is refreshing its saved pages now. New prices should show within about a minute, and at most about five minutes. Refresh the store page to see them.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="admin-muted">How long it takes: the website rebuilds its saved store pages and clears its price cache straight away, but each page is rebuilt when somebody next opens it, and the price list a signed-in customer sees can be held for up to five minutes. Expect new prices within about a minute, at most five. Visitors who are not signed in see RRP, so only RRP changes show for them.</p>
    </section>
  );
}