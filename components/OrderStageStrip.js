'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatDateTime } from '@/lib/adminFormat';
import { stageButton, stageMark, stageName, stageStateText, stageTone } from '@/lib/orderStages';

// The order's stages from Paid to Complete. compact: one mark per stage for the orders list.
// Otherwise the full strip for the order page, with times, Zoho links, problems and the button that moves it on.
export default function OrderStageStrip({ orderId, stages, compact = false, current, stuck }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!Array.isArray(stages) || stages.length === 0) return null;

  if (compact) {
    return (
      <span className="order-strip-compact" aria-label={'At: ' + stageName(current)}>
        {stages.map((stage) => (
          <span
            key={stage.key}
            className={`order-strip-dot is-${stageTone(stage.state)}${stage.key === current ? ' is-current' : ''}`}
            title={stageName(stage.key) + ': ' + stageStateText(stage.state) + (stage.at ? ' (' + formatDateTime(stage.at) + ')' : '')}
          >
            {stageMark(stage.state)}
          </span>
        ))}
        {stuck ? <span className="admin-status is-bad order-strip-stuck">Stuck</span> : null}
      </span>
    );
  }

  async function run(button) {
    if (busy) return;
    if (button.kind === 'approve' && !window.confirm('Send this step to Zoho now? It cannot be undone from here.')) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/steps/${button.step}/${button.kind}`, { method: 'POST' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'That did not work');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card order-strip">
      <h3 className="admin-heading">
        Where this order is up to
        {stuck ? <span className="admin-status is-bad">Stuck: nothing has moved for a day</span> : null}
      </h3>
      <ol className="order-strip-list">
        {stages.map((stage) => {
          const button = stageButton(stage);
          return (
            <li key={stage.key} className={`order-strip-step is-${stageTone(stage.state)}${stage.key === current ? ' is-current' : ''}`}>
              <span className="order-strip-mark" aria-hidden="true">{stageMark(stage.state)}</span>
              <div className="order-strip-body">
                <strong>{stageName(stage.key)}</strong>{' '}
                <span className={`admin-status is-${stageTone(stage.state)}`}>{stageStateText(stage.state)}</span>
                {stage.at ? <span className="admin-muted"> {formatDateTime(stage.at)}</span> : null}
                {stage.zoho_url ? <> · <a href={stage.zoho_url} target="_blank" rel="noopener noreferrer">Open in Zoho</a></> : null}
                {stage.note ? <div className="admin-muted">{stage.note}</div> : null}
                {stage.error ? <div className="form-error">{stage.error}</div> : null}
              </div>
              {button && button.kind === 'link' ? <a className="btn btn-secondary btn-sm" href={button.href}>{button.label}</a> : null}
              {button && button.kind !== 'link' ? (
                <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => run(button)}>{button.label}</button>
              ) : null}
            </li>
          );
        })}
      </ol>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
