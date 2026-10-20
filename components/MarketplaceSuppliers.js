"use client";

import { useState } from 'react';
import AdminConnectionForm from '@/components/AdminConnectionForm';
import { supplierBadge, findConnection } from '../lib/marketplaceView.js';
import { marketplaceRequest } from '../lib/marketplaceClient.js';

export default function MarketplaceSuppliers({ suppliers, connections, selected, onSelect, onChanged }) {
  const [editing, setEditing] = useState('');
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function runTest(key) {
    setBusy(key);
    setError('');
    try {
      const res = await fetch('/api/admin/connections/' + key + '/check', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'That did not work. Try again.');
      } else {
        setResults((prev) => ({ ...prev, [key]: { status: data.status, detail: data.detail } }));
      }
      if (onChanged) onChanged();
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setBusy('');
    }
  }

  async function connect(name) {
    setBusy(name);
    setError('');
    const res = await marketplaceRequest(name + '/authorize', { method: 'POST' });
    if (res.ok && res.data && res.data.url) {
      window.location.href = res.data.url;
      return;
    }
    setError(res.error || 'Could not start the sign-in.');
    setBusy('');
  }

  const list = suppliers || [];

  return (
    <section className="admin-card">
      <h2>Suppliers</h2>
      <p className="admin-muted">Pick a supplier, then search it, import its spreadsheet or add products by hand below. Keys are typed in here by you, stored encrypted and never shown again.</p>

      {list.length === 0 && <p className="admin-muted">No suppliers loaded. Reload the page.</p>}

      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {list.map((supplier) => {
          const badge = supplierBadge(supplier);
          const key = supplier.connection_key;
          const result = key ? results[key] : null;
          const conn = key ? findConnection(connections, key) : null;
          const isSelected = supplier.name === selected;
          const btnClass = 'btn btn-sm ' + (isSelected ? 'btn-primary' : 'btn-secondary');
          return (
            <div key={supplier.name} className={'admin-card' + (isSelected ? ' is-selected' : '')}>
              <strong>{supplier.label || supplier.name}</strong>
              {supplier.region ? <span className="admin-muted"> {' ' + supplier.region}</span> : null}
              <div>
                <span className={'admin-status is-' + badge.tone}>{badge.label}</span>
              </div>
              {supplier.note ? <p className="admin-muted">{supplier.note}</p> : null}
              {supplier.detail ? <p className="admin-muted">{supplier.detail}</p> : null}
              {supplier.docs ? (
                <a href={supplier.docs} target="_blank" rel="noreferrer">Their documentation</a>
              ) : null}
              {result ? <p className="admin-muted">Test: {' ' + result.detail}</p> : null}
              <div className="admin-actions">
                <button type="button" className={btnClass} onClick={() => onSelect(supplier.name)}>
                  Use this supplier
                </button>
                {key ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditing(editing === key ? '' : key)}
                  >
                    {editing === key ? 'Close' : (supplier.status !== 'not_set_up' ? 'Change key' : 'Set up key')}
                  </button>
                ) : null}
                {key ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    disabled={busy === key}
                    onClick={() => runTest(key)}
                  >
                    {busy === key ? 'Testing...' : 'Test'}
                  </button>
                ) : null}
              </div>
              {supplier.connect === 'oauth' && supplier.status !== 'not_set_up' ? (
                <div>
                  <p className="admin-muted">{supplier.connected ? 'Signed in to ' + supplier.label + '.' : 'Not signed in to ' + supplier.label + ' yet.'}</p>
                  <button type="button" className="btn btn-sm btn-primary" disabled={busy === supplier.name} onClick={() => connect(supplier.name)}>
                    {(supplier.connected ? 'Sign in again to ' : 'Connect ') + supplier.label}
                  </button>
                </div>
              ) : null}
              {editing === key && key ? (
                conn ? (
                  <AdminConnectionForm
                    connection={conn}
                    onSaved={() => { setEditing(''); if (onChanged) onChanged(); }}
                    onCancel={() => setEditing('')}
                  />
                ) : (
                  <p className="form-error">Reload the page to set up this key.</p>
                )
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </section>
  );
}
