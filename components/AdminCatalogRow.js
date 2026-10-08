'use client';

import { memo } from 'react';

import { formatDateTime } from '@/lib/adminFormat';
import { GST, dollars, inputStyle, marginClass, marginOf, money } from '@/lib/catalogShared';
import { contentStatusLabel } from '@/lib/content';

// One product on the Store Catalog sheet. It only draws again when its own
// product, draft, tick or busy state changes, so ticking one box or typing in
// one cell does not redraw the other rows.

const liveStyle = { color: '#7ee2a8', fontWeight: 600 };
const thumbStyle = { width: '36px', height: '36px', objectFit: 'contain', background: '#fff', borderRadius: '4px', flex: '0 0 auto' };
const noPhotoStyle = { ...thumbStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '9px', fontWeight: 700, textAlign: 'center' };

function AdminCatalogRow({ p, tiers, suppliers, draft, checked, busy, onToggle, onDraft, onSave, onDiscard, onDelete }) {
  const d = draft || {};
  const dirty = Object.keys(d).length > 0;

  function current(field) {
    if (field in d) return d[field];
    if (field === 'price') return dollars(p.price_cents);
    if (field === 'cost') return dollars(p.cost_cents);
    if (field === 'supplier_id') return p.supplier_id || '';
    return p[field] ?? '';
  }

  const priceCents = 'price' in d && d.price !== '' ? Math.round(Number(d.price) * 100) : p.price_cents;
  const costCents = 'cost' in d ? (d.cost === '' ? null : Math.round(Number(d.cost) * 100)) : p.cost_cents;
  const { cents, pct } = marginOf(priceCents, costCents);
  const tp = p.tier_prices_cents || {};

  return (
    <tr className={dirty ? 'is-dirty' : undefined} style={p.active ? undefined : { opacity: 0.55 }}>
      <td><input type="checkbox" checked={checked} onChange={() => onToggle(p.id)} aria-label={`Tick ${p.sku}`} /></td>
      <td>{p.published ? <span style={liveStyle}>Live</span> : <span className="admin-muted">Offline</span>}</td>
      <td><code>{p.sku}</code></td>
      <td className="wrap" style={{ minWidth: '260px' }}>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt="" loading="lazy" style={thumbStyle} />
          ) : (
            <span style={noPhotoStyle} title="No photo yet">No photo</span>
          )}
          <input type="text" value={current('name')} onChange={(e) => onDraft(p.id, 'name', e.target.value)} style={{ ...inputStyle, width: '100%' }} aria-label="Name" />
          {contentStatusLabel(p.content_status) ? <span className="admin-muted" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{contentStatusLabel(p.content_status)}</span> : null}
        </span>
      </td>
      <td><input type="text" value={current('brand')} onChange={(e) => onDraft(p.id, 'brand', e.target.value)} style={{ ...inputStyle, width: '110px' }} aria-label="Brand" /></td>
      <td><input type="text" value={current('category')} onChange={(e) => onDraft(p.id, 'category', e.target.value)} style={{ ...inputStyle, width: '130px' }} aria-label="Category" /></td>
      <td>
        <select value={current('supplier_id')} onChange={(e) => onDraft(p.id, 'supplier_id', e.target.value)} style={{ ...inputStyle, width: '150px' }} aria-label="Supplier">
          <option value="">{p.supplier && !p.supplier_id ? `${p.supplier} (feed)` : '—'}</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
      </td>
      <td><input type="number" min="0" step="0.01" value={current('cost')} onChange={(e) => onDraft(p.id, 'cost', e.target.value)} style={{ ...inputStyle, width: '90px' }} aria-label="Cost" /></td>
      <td><input type="number" min="0" step="0.01" value={current('price')} onChange={(e) => onDraft(p.id, 'price', e.target.value)} style={{ ...inputStyle, width: '90px' }} aria-label="RRP" /></td>
      <td>{money(priceCents / GST)}</td>
      <td className={marginClass(pct)}>{cents == null ? '—' : money(cents)}</td>
      <td className={marginClass(pct)}>{pct == null ? '—' : `${pct.toFixed(1)}%`}</td>
      {tiers.map((t) => <td key={t.key}>{money(tp[t.key])}</td>)}
      <td><input type="number" min="0" step="1" value={current('stock')} onChange={(e) => onDraft(p.id, 'stock', e.target.value)} style={{ ...inputStyle, width: '70px' }} aria-label="Stock" /></td>
      <td><input type="number" min="0" step="0.01" value={current('weight_kg')} onChange={(e) => onDraft(p.id, 'weight_kg', e.target.value)} style={{ ...inputStyle, width: '70px' }} aria-label="Shipping weight in kg" /></td>
      <td>
        <span style={{ display: 'inline-flex', gap: '4px' }}>
          <input type="number" min="0" step="0.1" value={current('length_cm')} onChange={(e) => onDraft(p.id, 'length_cm', e.target.value)} style={{ ...inputStyle, width: '58px' }} aria-label="Packed length in cm" />
          <input type="number" min="0" step="0.1" value={current('width_cm')} onChange={(e) => onDraft(p.id, 'width_cm', e.target.value)} style={{ ...inputStyle, width: '58px' }} aria-label="Packed width in cm" />
          <input type="number" min="0" step="0.1" value={current('height_cm')} onChange={(e) => onDraft(p.id, 'height_cm', e.target.value)} style={{ ...inputStyle, width: '58px' }} aria-label="Packed height in cm" />
        </span>
      </td>
      <td><input type="checkbox" checked={'active' in d ? Boolean(d.active) : p.active} onChange={(e) => onDraft(p.id, 'active', e.target.checked)} aria-label="Active" /></td>
      <td>{formatDateTime(p.last_imported_at, 'By hand')}</td>
      <td>
        {dirty && (
          <span className="admin-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onSave(p, d)} disabled={busy}>{busy ? '…' : 'Save'}</button>
            <button type="button" className="admin-link-btn" onClick={() => onDiscard(p.id)}>undo</button>
          </span>
        )}
        {!dirty && !p.active && (
          <button type="button" className="admin-link-btn" style={{ color: '#ff8a8a' }} onClick={() => onDelete(p)} disabled={busy}>Delete permanently</button>
        )}
      </td>
    </tr>
  );
}

export default memo(AdminCatalogRow);