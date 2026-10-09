'use client';

import { useState } from 'react';

import {
  DEFAULT_SCOPE,
  MAX_BANDS,
  bandsForScope,
  bandsFromEditor,
  editorFromBands,
  emptyMarkups,
  rangeLabels,
  scopesWithBands,
  supplierOfScope,
} from '@/lib/pricingBands';

// Pricing -> Markup by cost band (Robert, 2026-10-09): a markup for each tier
// that depends on what we pay for the product, so cheap items can carry more
// markup than dear ones. Each supplier can have its own bands, and the default
// bands cover every supplier without its own. A blank box goes on to the
// default bands, then the supplier's flat markup below, then the tier markup.

const inputStyle = { padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#0d0d0d', color: '#fff' };

async function save(supplierId, bands) {
  const response = await fetch('/api/admin/pricing/bands', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplier_id: supplierId, bands }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The bands were not saved.');
  return data;
}

export default function AdminPricingBands({ sets, suppliers, tiers, onSaved }) {
  const active = tiers.filter((tier) => tier.active !== false);
  const [saved, setSaved] = useState(sets);
  const [scope, setScope] = useState(DEFAULT_SCOPE);
  // Unsaved edits, kept for each set so that switching supplier loses nothing.
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const editor = drafts[scope] || editorFromBands(bandsForScope(saved, scope), active);
  const labels = rangeLabels(editor);
  const full = editor.rows.length + 1 >= MAX_BANDS;
  const withBands = scopesWithBands(saved);
  const supplier = suppliers.find((item) => String(item.supplier_id) === scope);

  function change(next) {
    setDrafts({ ...drafts, [scope]: next });
    setMessage('');
  }

  function switchTo(next) {
    setScope(next);
    setError('');
    setMessage('');
  }

  function setLimit(index, value) {
    change({ ...editor, rows: editor.rows.map((row, n) => (n === index ? { ...row, limit: value } : row)) });
  }

  function setRowMarkup(index, key, value) {
    change({
      ...editor,
      rows: editor.rows.map((row, n) => (n === index ? { ...row, markups: { ...row.markups, [key]: value } } : row)),
    });
  }

  function setRestMarkup(key, value) {
    change({ ...editor, rest: { ...editor.rest, [key]: value } });
  }

  function addBand() {
    change({ ...editor, rows: [...editor.rows, { limit: '', markups: emptyMarkups(active) }] });
  }

  function removeBand(index) {
    change({ ...editor, rows: editor.rows.filter((row, n) => n !== index) });
  }

  async function submit() {
    setError('');
    setMessage('');
    const result = bandsFromEditor(editor, active);
    if (result.error) {
      setError(result.error);
      return;
    }
    setBusy(true);
    try {
      const answer = await save(supplierOfScope(scope), result.bands);
      setSaved(answer.sets);
      setDrafts((current) => {
        const rest = { ...current };
        delete rest[scope];
        return rest;
      });
      const who = supplier ? supplier.supplier_name : 'every supplier';
      setMessage(
        result.bands.length
          ? `Saved. Prices for ${who} follow these bands now.`
          : `Saved. No bands for ${supplier ? supplier.supplier_name : 'the default'}, so its markups apply as before.`,
      );
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: '26px' }}>
      <h2 style={{ marginTop: 0 }}>Markup by cost band</h2>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Set a different markup for each tier depending on what we pay for the product (cost ex GST). For example, items under $100 can carry a bigger markup than items over $1,000.
        Each supplier can have its own bands. The default bands cover every supplier that has none of its own for that cost and tier.
        A blank box goes on to the default bands, then the supplier&apos;s markup below, then the tier markup above. Prices never go above RRP.
      </p>
      <p style={{ margin: '0 0 12px' }}>
        <label>
          <span className="admin-muted">Bands for </span>
          <select value={scope} onChange={(event) => switchTo(event.target.value)} style={{ ...inputStyle, minWidth: '260px' }} aria-label="Whose bands to edit">
            <option value={DEFAULT_SCOPE}>All suppliers (default){withBands.has(DEFAULT_SCOPE) ? ' ✓' : ''}</option>
            {suppliers.map((item) => (
              <option key={item.supplier_id} value={String(item.supplier_id)}>
                {item.supplier_name}
                {withBands.has(String(item.supplier_id)) ? ' ✓' : ''}
              </option>
            ))}
          </select>
        </label>
        <span className="admin-muted"> ✓ means it has bands set.</span>
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-note-banner" role="status">{message}</p>}
      <div className="admin-table-wrap" style={{ marginBottom: '12px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cost up to (ex GST)</th>
              <th>Covers</th>
              {active.map((tier) => (
                <th key={tier.key}>{tier.label} markup</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {editor.rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <span className="admin-actions">
                    <span className="admin-muted">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="100"
                      value={row.limit}
                      onChange={(event) => setLimit(index, event.target.value)}
                      style={{ ...inputStyle, width: '100px' }}
                      aria-label={`Band ${index + 1} cost limit in dollars`}
                    />
                  </span>
                </td>
                <td>{labels.rows[index]}</td>
                {active.map((tier) => (
                  <td key={tier.key}>
                    <span className="admin-actions">
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.5"
                        placeholder="–"
                        value={row.markups[tier.key]}
                        onChange={(event) => setRowMarkup(index, tier.key, event.target.value)}
                        style={{ ...inputStyle, width: '80px' }}
                        aria-label={`Band ${index + 1} ${tier.label} markup percent`}
                      />
                      <span className="admin-muted">%</span>
                    </span>
                  </td>
                ))}
                <td>
                  <button type="button" className="admin-link-btn" onClick={() => removeBand(index)} disabled={busy}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <span className="admin-muted">No limit</span>
              </td>
              <td>{labels.rest}</td>
              {active.map((tier) => (
                <td key={tier.key}>
                  <span className="admin-actions">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.5"
                      placeholder="–"
                      value={editor.rest[tier.key]}
                      onChange={(event) => setRestMarkup(tier.key, event.target.value)}
                      style={{ ...inputStyle, width: '80px' }}
                      aria-label={`Above the last band ${tier.label} markup percent`}
                    />
                    <span className="admin-muted">%</span>
                  </span>
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={addBand} disabled={busy || full}>
          + Add a band
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={submit} disabled={busy}>
          {busy ? 'Saving…' : `Save bands for ${supplier ? supplier.supplier_name : 'all suppliers'}`}
        </button>
      </div>
    </div>
  );
}
