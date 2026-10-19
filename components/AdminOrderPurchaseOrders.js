'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { poStatusLabel, poStatusTone, poButtons, poRecipientNote, poLineTotalCents, unassignedNote } from '@/lib/poView';
import { cents } from '@/lib/orderView';

export default function AdminOrderPurchaseOrders({ orderId, initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { purchase_orders, unassigned } = initial;

  async function handlePlan() {
    if (busy) return;

    setBusy(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/purchase-orders/plan`, {
        method: 'POST',
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'That did not work');

      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAction(poId, action) {
    if (busy) return;

    setBusy(true);
    setMessage('');
    setError('');

    try {
      let response;
      if (action === 'create') {
        response = await fetch(`/api/admin/purchase-orders/${poId}/create`, {
          method: 'POST',
        });
      } else if (action === 'send') {
        const confirmText = po.mode === 'live'
          ? 'Email this purchase order to the supplier now?'
          : 'TEST mode: email the purchase order to the test address now?';
        if (!window.confirm(confirmText)) return;
        response = await fetch(`/api/admin/purchase-orders/${poId}/send`, {
          method: 'POST',
        });
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.detail || 'That did not work');

      setMessage(data.result?.message || 'Action completed successfully.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!purchase_orders || purchase_orders.length === 0) {
    return (
      <div className="admin-card">
        <h2 className="admin-heading">Supplier purchase orders</h2>
        <p>There are no supplier purchase orders for this order.</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePlan}
          disabled={busy}
        >
          Plan purchase orders
        </button>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h2 className="admin-heading">Supplier purchase orders</h2>

      {unassigned && unassigned.length > 0 && (
        <p className="form-error">{unassignedNote(unassigned)}</p>
      )}

      {purchase_orders.map((po) => {
        const buttons = poButtons(po);
        const tone = poStatusTone(po.status);

        return (
          <div key={po.id} className="admin-card" style={{ marginBottom: '1rem' }}>
            <h3 className="admin-heading">{po.supplier_name}</h3>
            <p>Status: <span className={`admin-status is-${tone}`}>{poStatusLabel(po.status)}</span></p>
            <p>Reference: {po.reference || '-'}</p>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                    <th>Supplier SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {po.lines.map((line, index) => (
                    <tr key={index}>
                      <td>{line.sku}</td>
                      <td>{line.name}</td>
                      <td>{line.quantity}</td>
                      <td>{cents(line.cost_cents)}</td>
                      <td>{line.supplier_sku || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {po.ship_to && (
              <p>Delivery address: {po.ship_to.name}, {po.ship_to.line1}, {po.ship_to.city} {po.ship_to.state} {po.ship_to.postcode}</p>
            )}

            {po.notes && (
              <details style={{ marginBottom: '1rem' }}>
                <summary>Notes for the supplier</summary>
                <pre>{po.notes}</pre>
              </details>
            )}

            <p>{poRecipientNote(po)}</p>

            {po.error && (
              <p className="form-error">Error: {po.error}</p>
            )}

            <p>Total: {cents(poLineTotalCents(po))}</p>

            <div className="admin-actions">
              {buttons.create && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAction(po.id, 'create')}
                  disabled={busy}
                >
                  Create in Zoho
                </button>
              )}

              {buttons.send && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAction(po.id, 'send')}
                  disabled={busy}
                >
                  Send to supplier
                </button>
              )}
            </div>
          </div>
        );
      })}

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
    </div>
  );
}