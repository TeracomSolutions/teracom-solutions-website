"use client";

import { useState } from 'react';
import AdminConnectionForm from '@/components/AdminConnectionForm';
import { supplierBadge, findConnection, supplierChoices } from '../lib/marketplaceView.js';
import { marketplaceRequest } from '../lib/marketplaceClient.js';

// Marketplace -> Suppliers (Robert, 2026-11-05): small tiles for the suppliers
// in use, an Add a supplier list for the rest (Australian ones first), and a
// tile opens its full set-up page: what it is, where it ships from, how to
// sign up, the key, Test and Connect.
export default function MarketplaceSuppliers({ suppliers, connections, selected, onSelect, onChanged }) {
  const [openName, setOpenName] = useState('');
  const [editing, setEditing] = useState('');
  const [adding, setAdding] = useState('');
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

  async function show(name, shown) {
    setBusy('shown-' + name);
    setError('');
    const res = await marketplaceRequest('suppliers/shown', { method: 'PUT', body: { name, shown } });
    setBusy('');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (shown) {
      setOpenName(name);
      setAdding('');
    } else if (openName === name) {
      setOpenName('');
    }
    if (onChanged) onChanged();
  }

  const list = suppliers || [];
  const tiles = list.filter((s) => s.shown);
  const choices = supplierChoices(list);
  const chosen = list.find((s) => s.name === adding);
  const open = list.find((s) => s.name === openName && s.shown);

  return (
    <section className="admin-card">
      <h2>Suppliers</h2>
      <p className="admin-muted">Open a supplier to set it up, then search it, import its spreadsheet or add products by hand below. Keys are typed in here by you, stored encrypted and never shown again.</p>

      {list.length === 0 && <p className="admin-muted">No suppliers loaded. Reload the page.</p>}

      <div className="mp-tiles">
        {tiles.map((supplier) => {
          const badge = supplierBadge(supplier);
          const isOpen = supplier.name === openName;
          const isSelected = supplier.name === selected;
          return (
            <button
              key={supplier.name}
              type="button"
              className={'mp-tile' + (isOpen ? ' is-open' : '') + (isSelected ? ' is-selected' : '')}
              onClick={() => setOpenName(isOpen ? '' : supplier.name)}
              aria-expanded={isOpen}
            >
              <strong>{supplier.label || supplier.name}</strong>
              <span className="mp-tile-region">{supplier.region}</span>
              <span className={'admin-status is-' + badge.tone}>{badge.label}</span>
              {isSelected ? <span className="mp-tile-using">In use below</span> : null}
            </button>
          );
        })}
      </div>

      <div className="mp-add">
        <label>
          Add a supplier
          <select value={adding} onChange={(e) => setAdding(e.target.value)}>
            <option value="">Choose one…</option>
            {choices.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.suppliers.map((s) => (
                  <option key={s.name} value={s.name}>{s.label}{s.kind ? ' · ' + s.kind : ''}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {chosen ? (
          <div className="mp-add-preview">
            <p><strong>{chosen.label}</strong> <span className="admin-muted">{chosen.region}{chosen.ships_from ? ' · ships from ' + chosen.ships_from : ''}</span></p>
            <p className="admin-muted">{chosen.about || chosen.note}</p>
            <button type="button" className="btn btn-primary btn-sm" disabled={busy === 'shown-' + chosen.name} onClick={() => show(chosen.name, true)}>
              Add {chosen.label}
            </button>
          </div>
        ) : null}
      </div>

      {open ? (
        <SupplierPage
          supplier={open}
          conn={open.connection_key ? findConnection(connections, open.connection_key) : null}
          result={open.connection_key ? results[open.connection_key] : null}
          editing={editing === open.connection_key}
          busy={busy}
          isSelected={open.name === selected}
          onEdit={() => setEditing(editing === open.connection_key ? '' : open.connection_key)}
          onSaved={() => { setEditing(''); if (onChanged) onChanged(); }}
          onTest={() => runTest(open.connection_key)}
          onConnect={() => connect(open.name)}
          onUse={() => onSelect(open.name)}
          onHide={() => show(open.name, false)}
          onClose={() => setOpenName('')}
        />
      ) : null}

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </section>
  );
}

function SupplierPage({ supplier, conn, result, editing, busy, isSelected, onEdit, onSaved, onTest, onConnect, onUse, onHide, onClose }) {
  const badge = supplierBadge(supplier);
  const key = supplier.connection_key;
  return (
    <div className="mp-page">
      <div className="mp-page-head">
        <h3>{supplier.label}</h3>
        <span className={'admin-status is-' + badge.tone}>{badge.label}</span>
        <button type="button" className="admin-link-btn" onClick={onClose}>Close</button>
      </div>
      <dl className="mp-page-facts">
        {supplier.kind ? (<><dt>What it is</dt><dd>{supplier.kind}</dd></>) : null}
        <dt>Region</dt><dd>{supplier.region || '—'}</dd>
        {supplier.ships_from ? (<><dt>Ships from</dt><dd>{supplier.ships_from}</dd></>) : null}
        <dt>How it connects</dt>
        <dd>{supplier.method === 'api' ? (supplier.adapter_ready ? 'Live connection with your key' : 'Has an API; the connector is not built yet, so import its spreadsheet meanwhile') : 'No connection: import its spreadsheet or add products by hand'}</dd>
      </dl>
      {supplier.about || supplier.note ? <p>{supplier.about || supplier.note}</p> : null}
      {supplier.detail ? <p className="admin-muted">{supplier.detail}</p> : null}
      <p className="mp-page-links">
        {supplier.signup ? <a href={supplier.signup} target="_blank" rel="noreferrer">Open an account</a> : null}
        {supplier.docs ? <a href={supplier.docs} target="_blank" rel="noreferrer">Their documentation</a> : null}
      </p>
      {result ? <p className="admin-muted">Test: {' ' + result.detail}</p> : null}
      <div className="admin-actions">
        <button type="button" className={'btn btn-sm ' + (isSelected ? 'btn-primary' : 'btn-secondary')} onClick={onUse}>
          {isSelected ? 'In use below' : 'Use this supplier'}
        </button>
        {key ? (
          <button type="button" className="btn btn-sm btn-secondary" onClick={onEdit}>
            {editing ? 'Close the key form' : (supplier.status !== 'not_set_up' ? 'Change key' : 'Set up key')}
          </button>
        ) : null}
        {key ? (
          <button type="button" className="btn btn-sm btn-secondary" disabled={busy === key} onClick={onTest}>
            {busy === key ? 'Testing...' : 'Test'}
          </button>
        ) : null}
        {supplier.name !== 'file' ? (
          <button type="button" className="admin-link-btn" disabled={busy === 'shown-' + supplier.name} onClick={onHide}>Take off my list</button>
        ) : null}
      </div>
      {supplier.connect === 'oauth' && supplier.status !== 'not_set_up' ? (
        <div>
          <p className="admin-muted">{supplier.connected ? 'Signed in to ' + supplier.label + '.' : 'Not signed in to ' + supplier.label + ' yet.'}</p>
          <button type="button" className="btn btn-sm btn-primary" disabled={busy === supplier.name} onClick={onConnect}>
            {(supplier.connected ? 'Sign in again to ' : 'Connect ') + supplier.label}
          </button>
        </div>
      ) : null}
      {editing && key ? (
        conn ? (
          <AdminConnectionForm connection={conn} onSaved={onSaved} onCancel={onEdit} />
        ) : (
          <p className="form-error">Reload the page to set up this key.</p>
        )
      ) : null}
    </div>
  );
}
