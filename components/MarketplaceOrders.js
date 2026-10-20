"use client";

import { useState, useEffect } from 'react';
import { marketplaceRequest } from '../lib/marketplaceClient.js';
import { orderStatusLabel, orderPreview, canSubmit } from '../lib/marketplaceView.js';

export default function MarketplaceOrders({ status }) {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [provider, setProvider] = useState(status.providers?.length ? status.providers[0].name : '');
  const [confirmed, setConfirmed] = useState({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const res = await marketplaceRequest('orders');
    if (res.ok) {
      setOrders(res.data.orders || []);
      setLoaded(true);
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePrepare(e) {
    e.preventDefault();
    setBusy('prepare');
    setError('');
    setMessage('');
    const res = await marketplaceRequest('orders/prepare', {
      method: 'POST',
      body: { order_id: orderId.trim(), provider }
    });
    if (res.ok) {
      setMessage('Prepared. Check it below, then tick the box to send it.');
      load();
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
    setBusy('');
  }

  async function handleSubmit(id) {
    setBusy(id);
    setError('');
    setMessage('');
    const res = await marketplaceRequest('orders/' + id + '/submit', { method: 'POST' });
    if (res.ok) {
      setMessage(res.data.result.message);
      load();
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
    setBusy('');
  }

  async function handleTracking(id) {
    setBusy('track-' + id);
    setError('');
    setMessage('');
    const res = await marketplaceRequest('orders/' + id + '/tracking', { method: 'POST' });
    if (!res.ok) {
      setError(res.error || 'Something went wrong. Please try again.');
    }
    load();
    setBusy('');
  }

  return (
    <section className="admin-card">
      <h2 className="admin-heading">Supplier orders</h2>
      <p className="admin-muted">A supplier order is only sent after you check it and tick the box. Nothing is sent automatically.</p>

      <form onSubmit={handlePrepare} className="admin-form">
        <div className="mb-3">
          <label htmlFor="marketplaceOrderId" className="form-label">Store order id</label>
          <input
            type="text"
            id="marketplaceOrderId"
            className="form-control"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="marketplaceProvider" className="form-label">Supplier</label>
          <select
            id="marketplaceProvider"
            className="form-control"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            {(status.providers || []).map((p) => (
              <option key={p.name} value={p.name}>{p.label || p.name}</option>
            ))}
          </select>
        </div>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy !== ''}>
            {busy === 'prepare' ? 'Preparing...' : 'Prepare supplier order'}
          </button>
        </div>
      </form>

      {message && (
        <p className="admin-muted" role="status">{message}</p>
      )}
      {error && (
        <p className="form-error" role="alert">{error}</p>
      )}

      {!loaded && <p className="admin-muted">Loading...</p>}

      {loaded && orders.length === 0 && (
        <p className="admin-muted">No supplier orders yet.</p>
      )}

      {loaded && orders.map((order) => {
        const preview = orderPreview(order.payload);
        const canSend = canSubmit(order, status);
        const showTracking = !!order.provider_order_id && (order.status === 'submitted' || order.status === 'shipped');
        const showSwitchedOff = !canSend && order.status === 'pending' && status.orders_enabled !== true;

        return (
          <div key={order.id} className="admin-card">
            <div>
              <strong>Order {order.payload?.order_ref || ''}</strong>{' '}
              <span className={"admin-status is-" + (order.status || '')}>{orderStatusLabel(order.status)}</span>
            </div>
            <p className="admin-muted">Supplier: {order.provider}</p>
            {order.provider_order_id && (
              <p className="admin-muted">Supplier order id: {order.provider_order_id}</p>
            )}
            {order.error && (
              <p className="form-error">{order.error}</p>
            )}

            <div>
              <small className="form-label">Items</small>
              <ul>
                {preview.items.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <small className="form-label">Delivering to</small>
              <ul>
                {preview.recipient.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            {canSend && (
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id={"confirm-" + order.id}
                  className="form-check-input"
                  checked={!!confirmed[order.id]}
                  onChange={(e) => setConfirmed({ ...confirmed, [order.id]: e.target.checked })}
                />
                <label htmlFor={"confirm-" + order.id} className="form-check-label">
                  I have checked this order and approve sending it to the supplier
                </label>
              </div>
            )}

            {canSend && (
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!confirmed[order.id] || busy === order.id}
                  onClick={() => handleSubmit(order.id)}
                >
                  {busy === order.id ? 'Sending...' : 'Send to supplier'}
                </button>
              </div>
            )}

            {showTracking && (
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={busy === 'track-' + order.id}
                  onClick={() => handleTracking(order.id)}
                >
                  {busy === 'track-' + order.id ? 'Checking...' : 'Check tracking'}
                </button>
              </div>
            )}

            {order.tracking && order.tracking.tracking_number && (
              <p className="admin-muted">Tracking number: {order.tracking.tracking_number}</p>
            )}

            {showSwitchedOff && (
              <p className="admin-muted">Sending orders to suppliers is switched off.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}