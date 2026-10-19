'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { stepLabel, statusLabel, statusTone, nextStep, stepButtons, describeCall, cents, orderStatusLabel } from '@/lib/orderView';
import { formatDateTime } from '@/lib/adminFormat';

export default function AdminOrderDetail({ detail }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!detail || !detail.order) {
    return <div className="admin-card">No order details available.</div>;
  }

  const { order, lines, steps, ledger, gap_cents } = detail;

  async function handleStepAction(stepName, action) {
    if (busy) return;

    setBusy(true);
    setMessage('');
    setError('');

    try {
      let response;
      if (action === 'prepare') {
        response = await fetch(`/api/admin/orders/${order.id}/steps/${stepName}/prepare`, {
          method: 'POST',
        });
      } else if (action === 'approve') {
        if (!window.confirm('Send this step to Zoho now? It cannot be undone from here.')) return;
        response = await fetch(`/api/admin/orders/${order.id}/steps/${stepName}/approve`, {
          method: 'POST',
        });
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'That did not work');

      setMessage(`Step ${stepName} ${action}d successfully.`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function renderOrderCard() {
    const { name, email, phone, job_reference, abn, shipping_address, status, mode, total_cents } = order;

    return (
      <div className="admin-card">
        <h3 className="admin-heading">Order Details</h3>
        <p className="lead">Customer: {name} &lt;{email}&gt;</p>
        <p>Phone: {phone}</p>
        {job_reference && <p>Job reference: {job_reference}</p>}
        {abn && <p>ABN: {abn}</p>}
        <p>Shipping address: {shipping_address}</p>
        <p>Status: <span className={`admin-status is-${orderStatusTone(status)}`}>{orderStatusLabel(status)}</span></p>
        <p>Mode: {mode}</p>
        <p>Total: {cents(total_cents)}</p>
        {gap_cents !== 0 && (
          <p className="form-error">The lines and freight do not add up to what Stripe charged (gap {cents(gap_cents)}).</p>
        )}
      </div>
    );
  }

  function renderLinesTable() {
    if (!lines || lines.length === 0) return null;

    return (
      <div className="admin-card">
        <h3 className="admin-heading">Order Lines</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Cost</th>
                <th>Supplier</th>
                <th>Product Match</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td>{line.sku}</td>
                  <td>{line.name}</td>
                  <td>{line.quantity}</td>
                  <td>{cents(line.unit_price_cents)}</td>
                  <td>{cents(line.cost_cents)}</td>
                  <td>{line.supplier_name}</td>
                  <td>{line.unmapped ? 'No matching product' : 'Matched'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderSteps() {
    if (!steps || steps.length === 0) return null;

    // Sort steps by seq
    const sortedSteps = [...steps].sort((a, b) => a.seq - b.seq);

    return (
      <div className="admin-card">
        <h3 className="admin-heading">Order Steps</h3>
        {sortedSteps.map((step) => {
          const buttons = stepButtons(step, steps);
          const tone = statusTone(step.status);

          return (
            <div key={step.name} className="admin-card" style={{ marginBottom: '1rem' }}>
              <h4 className="admin-heading">
                {stepLabel(step.name)}
                <span className={`admin-status is-${tone}`} style={{ marginLeft: '0.5rem' }}>
                  {statusLabel(step.status)}
                </span>
              </h4>
              <p>Attempts: {step.attempts}</p>

              {step.error && (
                <p className="form-error">Error: {step.error}</p>
              )}

              {step.payload?.calls && step.payload.calls.length > 0 && (
                <details style={{ marginBottom: '1rem' }}>
                  <summary>What will be sent</summary>
                  <pre>{JSON.stringify(step.payload.calls, null, 2)}</pre>
                </details>
              )}

              <div className="admin-actions">
                {buttons.prepare && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStepAction(step.name, 'prepare')}
                    disabled={busy}
                  >
                    Prepare
                  </button>
                )}

                {buttons.approve && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStepAction(step.name, 'approve')}
                    disabled={busy}
                  >
                    Approve and send to Zoho
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderLedgerTable() {
    if (!ledger || ledger.length === 0) return null;

    return (
      <div className="admin-card">
        <h3 className="admin-heading">Ledger</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Kind</th>
                <th>Method and Path</th>
                <th>Status</th>
                <th>Zoho Record ID</th>
                <th>Refusal Reason or Error</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry, index) => (
                <tr key={index}>
                  <td>{formatDateTime(entry.created_at)}</td>
                  <td>{entry.kind}</td>
                  <td>{entry.method} {entry.path}</td>
                  <td>{entry.status}</td>
                  <td>{entry.zoho_record_id || '-'}</td>
                  <td>{entry.refused_reason || entry.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderOrderCard()}
      {renderLinesTable()}
      {renderSteps()}
      {renderLedgerTable()}

      {message && (
        <div className="admin-card">
          <p className="admin-muted">{message}</p>
        </div>
      )}

      {error && (
        <div className="admin-card">
          <p className="form-error" role="alert">{error}</p>
        </div>
      )}
    </>
  );
}
