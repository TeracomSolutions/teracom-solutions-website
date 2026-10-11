'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { formatNumber } from '@/lib/searchInsights';

async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'That did not work.');
  return data;
}

export default function AdminSeoShopping({ initial, feedUrl }) {
  const [data, setData] = useState(initial);
  const [code, setCode] = useState('');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const summary = data.summary || {};
  const codes = summary.codes || [];
  const products = data.products || [];

  const query = useCallback(async (next, skip = 0, quiet = false) => {
    if (!quiet) setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({ skip: String(skip) });
      if (next.code) params.set('code', next.code);
      if (next.q) params.set('q', next.q);
      const response = await fetch(`/api/admin/seo/insights/shopping?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not load the list.');
      setData((current) => (skip > 0 ? { ...result, products: [...(current.products || []), ...result.products] } : result));
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setBusy(false);
    }
  }, []);

  function filter(next) {
    const merged = { code, q, ...next };
    setCode(merged.code);
    setQ(merged.q);
    query(merged);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      const button = document.activeElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied.';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      setError('Could not copy. Select the address and copy it by hand.');
    }
  }

  function formatPrice(cents) {
    return (cents / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
  }

  const problemCodes = codes.filter((item) => item.severity === 'problem');
  const noteCodes = codes.filter((item) => item.severity === 'note');

  return (
    <div>
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-label">Products in the store</span>
          <strong className="admin-stat-value">{formatNumber(summary.hardware)}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Ready for Google</span>
          <strong className="admin-stat-value">{formatNumber(summary.ready)}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Not ready</span>
          <strong className="admin-stat-value">{formatNumber(summary.hardware - summary.ready)}</strong>
        </div>
      </div>

      <p>Google Merchant Center reads the products from this address: <code>{feedUrl}</code></p>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={copyAddress}>Copy address</button>
        <a href={feedUrl} target="_blank" rel="noopener noreferrer" className="admin-link">Open the feed</a>
      </div>

      {summary.hardware === 0 ? (
        <p className="admin-muted">There are no products in the store yet.</p>
      ) : (
        <>
          {problemCodes.length > 0 && (
            <div>
              <h2>Stops a product going to Google</h2>
              <div className="admin-stats">
                {problemCodes.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className="admin-stat"
                    disabled={item.count === 0 && code !== item.code}
                    style={{ textAlign: 'left', cursor: item.count > 0 ? 'pointer' : 'default', opacity: item.count === 0 ? 0.55 : 1, outline: code === item.code ? '2px solid var(--red)' : 'none' }}
                    onClick={() => filter({ code: code === item.code ? '' : item.code })}
                    title={item.help}
                  >
                    <span className="admin-stat-label">{item.label}</span>
                    <strong className="admin-stat-value">{formatNumber(item.count)}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {noteCodes.length > 0 && (
            <div>
              <h2>For information</h2>
              <div className="admin-stats">
                {noteCodes.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className="admin-stat"
                    disabled={item.count === 0 && code !== item.code}
                    style={{ textAlign: 'left', cursor: item.count > 0 ? 'pointer' : 'default', opacity: item.count === 0 ? 0.55 : 1, outline: code === item.code ? '2px solid var(--red)' : 'none' }}
                    onClick={() => filter({ code: code === item.code ? '' : item.code })}
                    title={item.help}
                  >
                    <span className="admin-stat-label">{item.label}</span>
                    <strong className="admin-stat-value">{formatNumber(item.count)}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="admin-actions">
            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') filter({ q });
              }}
              placeholder="Name, part number or brand"
              aria-label="Search products"
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => filter({ q })} disabled={busy}>Search</button>
            {code ? <button type="button" className="admin-link-btn" onClick={() => filter({ code: '' })}>Show every problem</button> : null}
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Problems</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="wrap" style={{ minWidth: '240px' }}>
                      <a href={`/store/product/${product.id}`} target="_blank" rel="noopener noreferrer">
                        <strong>{product.name}</strong>
                      </a>
                      <br />
                      <span className="admin-muted" style={{ fontSize: '12px' }}>
                        {product.sku} • {product.brand}
                      </span>
                      {product.problems && (product.problems.some(p => p.code === 'no_image') || product.problems.some(p => p.code === 'no_description')) ? (
                        <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                          Photos and text can find these.
                          <br />
                          <Link href="/admin/content" className="admin-link">
                            Find photos and text
                          </Link>
                        </p>
                      ) : null}
                    </td>
                    <td>{formatPrice(product.priceCents)}</td>
                    <td className="wrap" style={{ minWidth: '200px' }}>
                      {product.problems && product.problems.map((problem) => (
                        <div key={problem.code}>
                          <strong>{problem.label}</strong>
                          <span className="admin-muted"> · {problem.severity}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length < (data.total || 0) ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => query({ code, q }, products.length)}>
                Show more ({formatNumber(data.total - products.length)} left)
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}