'use client';

import { useState } from 'react';

import { send } from '@/lib/catalogShared';

// A one-off product entered by hand, for something no supplier feed carries.

const EMPTY = { sku: '', name: '', category: '', brand: '', supplier_id: '', price: '', cost: '', stock: '0', description: '', weight_kg: '', length_cm: '', width_cm: '', height_cm: '' };

export default function AdminCatalogAddProduct({ suppliers, onDone }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await send('/api/admin/catalog/products', 'POST', {
        sku: form.sku,
        name: form.name,
        category: form.category || 'Uncategorised',
        brand: form.brand || null,
        supplier_id: form.supplier_id || null,
        price: Number(form.price),
        cost: form.cost === '' ? null : Number(form.cost),
        stock: Number(form.stock) || 0,
        weight_kg: form.weight_kg === '' ? null : Number(form.weight_kg),
        length_cm: form.length_cm === '' ? null : Number(form.length_cm),
        width_cm: form.width_cm === '' ? null : Number(form.width_cm),
        height_cm: form.height_cm === '' ? null : Number(form.height_cm),
        description: form.description || null,
      });
      setForm(EMPTY);
      setOpen(false);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>Add product</button>;
  }

  return (
    <form onSubmit={submit} className="admin-form admin-card" style={{ maxWidth: 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      <label>SKU<input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)} required /></label>
      <label>Name<input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
      <label>Category<input type="text" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Uncategorised" /></label>
      <label>Brand<input type="text" value={form.brand} onChange={(e) => set('brand', e.target.value)} /></label>
      <label>Supplier
        <select value={form.supplier_id} onChange={(e) => set('supplier_id', e.target.value)}>
          <option value="">—</option>
          {suppliers.map((s) => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
        </select>
      </label>
      <label>Cost ex GST ($)<input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set('cost', e.target.value)} /></label>
      <label>RRP inc GST ($)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
      <label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></label>
      <label>Shipping weight (kg)<input type="number" min="0" step="0.01" value={form.weight_kg} onChange={(e) => set('weight_kg', e.target.value)} /></label>
      <label>Packed length (cm)<input type="number" min="0" step="0.1" value={form.length_cm} onChange={(e) => set('length_cm', e.target.value)} /></label>
      <label>Packed width (cm)<input type="number" min="0" step="0.1" value={form.width_cm} onChange={(e) => set('width_cm', e.target.value)} /></label>
      <label>Packed height (cm)<input type="number" min="0" step="0.1" value={form.height_cm} onChange={(e) => set('height_cm', e.target.value)} /></label>
      <label style={{ gridColumn: '1 / -1' }}>Description<input type="text" value={form.description} onChange={(e) => set('description', e.target.value)} /></label>
      {error && <p className="form-error" role="alert" style={{ gridColumn: '1 / -1' }}>{error}</p>}
      <div className="admin-actions" style={{ gridColumn: '1 / -1' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Adding…' : 'Add product'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
