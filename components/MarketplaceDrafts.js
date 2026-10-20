"use client";

import { useState, useEffect } from 'react';
import { marketplaceRequest } from '../lib/marketplaceClient.js';
import { productStatusLabel, originNote } from '../lib/marketplaceView.js';
import { cents } from '../lib/orderView.js';

export default function MarketplaceDrafts({ refreshKey }) {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [reviews, setReviews] = useState({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await marketplaceRequest('products');
      if (res.ok) {
        setProducts(res.data.products || []);
      } else {
        setError(res.error);
      }
      setLoaded(true);
    } catch (err) {
      setError('Unable to reach the server. Please try again.');
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  async function checkReview(product) {
    setBusy(product.id);
    setError('');
    try {
      const res = await marketplaceRequest('products/' + product.store_product_id + '/review');
      if (res.ok) {
        setReviews((prev) => ({
          ...prev,
          [product.id]: { blockers: res.data.blockers || [], notes: res.data.notes || [] }
        }));
      } else {
        setError(res.error);
      }
    } finally {
      setBusy('');
    }
  }

  async function setDecision(product, decision) {
    setBusy(product.id);
    setError('');
    setMessage('');
    try {
      const res = await marketplaceRequest('products/' + product.id + '/' + decision, { method: 'POST' });
      if (res.ok) {
        setMessage(decision === 'approve' ? 'Approved.' : 'Rejected.');
        load();
      } else {
        setError(res.error);
      }
    } finally {
      setBusy('');
    }
  }

  return (
    <section className="admin-card">
      <h2>Supplier products</h2>
      <p className="admin-muted">Imported products stay offline until you approve them and press Go live in the Catalog.</p>

      {!loaded && <p className="admin-muted">Loading...</p>}

      {loaded && products.length === 0 && <p className="admin-muted">Nothing imported yet.</p>}

      {products.map((product) => {
        const review = reviews[product.id];
        const origin = originNote(product.origin_country);
        return (
          <div key={product.id} className="admin-card">
            <strong>{product.title}</strong>{' '}
            <span className={'admin-status is-' + product.status}>{productStatusLabel(product.status)}</span>

            <div className="admin-muted">
              Cost {cents(product.cost_cents)}
              {product.shipping_cents
                ? ' plus ' + cents(product.shipping_cents) + ' shipping'
                : ''}
            </div>

            {origin ? <div className="admin-muted">{origin}</div> : null}

            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => checkReview(product)}
                disabled={busy === product.id}
              >
                Check before going live
              </button>
              {product.status === 'draft' && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setDecision(product, 'approve')}
                    disabled={busy === product.id}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDecision(product, 'reject')}
                    disabled={busy === product.id}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>

            {review && (
              <div>
                {review.blockers.length > 0 ? (
                  <ul className="form-error">
                    {review.blockers.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-muted">Nothing is blocking this product.</p>
                )}
                {review.notes.length > 0 && (
                  <ul className="admin-muted">
                    {review.notes.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}

      {message && <p className="admin-muted" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
