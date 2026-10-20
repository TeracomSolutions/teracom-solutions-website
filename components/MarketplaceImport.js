"use client";

import { useState } from 'react';
import { marketplaceRequest } from '../lib/marketplaceClient.js';
import { fileImportSummary, errorLines } from '../lib/marketplaceView.js';

export default function MarketplaceImport({ supplier, status, onImported }) {
  const defaultMarkup = String((status && status.settings && status.settings.default_markup) || 40);

  const [markup, setMarkup] = useState(defaultMarkup);
  const [shipping, setShipping] = useState('0');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [manual, setManual] = useState({
    title: '',
    cost: '',
    currency: 'AUD',
    code: '',
    stock: '0',
    category: '',
    country: '',
    link: '',
    image: '',
    description: ''
  });

  if (!supplier) {
    return (
      <div className="admin-card">
        <p className="admin-muted">Pick a supplier above to import its products.</p>
      </div>
    );
  }

  function updateManual(field, value) {
    setManual((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFileImport(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const file = formData.get('file');
    if (!file || file.size === 0) {
      setError('Choose a file first.');
      return;
    }
    formData.append('provider', supplier.name);
    formData.append('markup_percent', markup);
    formData.append('shipping_cents', shipping);
    setBusy(true);
    setError('');
    setMessage('');
    setSummary(null);
    try {
      const response = await fetch('/api/admin/marketplace/import-file', {
        method: 'POST',
        body: formData
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError((data && data.error) || 'That import did not work.');
        return;
      }
      setSummary(data);
      setMessage(fileImportSummary(data));
      if (typeof onImported === 'function') onImported();
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const summaryLines = summary ? errorLines(summary) : [];

  async function handleManualSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await marketplaceRequest('products/manual', {
        method: 'POST',
        body: {
          provider: supplier.name,
          title: manual.title,
          cost: Number(manual.cost),
          currency: manual.currency,
          provider_product_id: manual.code,
          stock: Number(manual.stock) || 0,
          category: manual.category,
          origin_country: manual.country,
          url: manual.link,
          image: manual.image,
          description: manual.description,
          markup_percent: Number(markup),
          shipping_cents: Number(shipping) || 0
        }
      });
      if (res.ok) {
        setMessage(
          res.data.status === 'created'
            ? 'Added as an unpublished draft. Approve it below before it can go live.'
            : 'That product was already added.'
        );
        setManual({
          title: '',
          cost: '',
          currency: 'AUD',
          code: '',
          stock: '0',
          category: '',
          country: '',
          link: '',
          image: '',
          description: ''
        });
        if (typeof onImported === 'function') onImported();
      } else {
        setError(res.error);
      }
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="admin-card">
        <h2>{'Import a spreadsheet from ' + supplier.label}</h2>
        <p className="admin-muted">A .csv or .xlsx file whose first row is headings. It needs a name column and a price column (for example Name and Price). SKU, Quantity, Image, Category, Country and Link columns are used when they are there. Prices are Australian dollars unless a Currency column says USD. Every product becomes an unpublished draft for you to approve.</p>
        <form onSubmit={handleFileImport} className="admin-form">
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-file">File</label>
            <input
              type="file"
              id="mp-file"
              name="file"
              accept=".csv,.xlsx"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-markup">Markup %</label>
            <input
              type="number"
              id="mp-markup"
              className="form-control"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-shipping">Shipping cents</label>
            <input
              type="number"
              id="mp-shipping"
              className="form-control"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
              Import
            </button>
          </div>
        </form>
        {message ? <p className="admin-muted" role="status">{message}</p> : null}
        {summaryLines.length > 0 ? (
          <ul className="form-error">
            {summaryLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </section>

      <section className="admin-card">
        <h2>Add one product by hand</h2>
        <form onSubmit={handleManualSubmit} className="admin-form">
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-title">Product name</label>
            <input
              type="text"
              id="mp-m-title"
              className="form-control"
              value={manual.title}
              onChange={(e) => updateManual('title', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-cost">Supplier price (dollars)</label>
            <input
              type="number"
              id="mp-m-cost"
              className="form-control"
              value={manual.cost}
              onChange={(e) => updateManual('cost', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-currency">Currency</label>
            <select
              id="mp-m-currency"
              className="form-control"
              value={manual.currency}
              onChange={(e) => updateManual('currency', e.target.value)}
            >
              <option value="AUD">AUD</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-code">Supplier code (optional)</label>
            <input
              type="text"
              id="mp-m-code"
              className="form-control"
              value={manual.code}
              onChange={(e) => updateManual('code', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-stock">Stock</label>
            <input
              type="number"
              id="mp-m-stock"
              className="form-control"
              value={manual.stock}
              onChange={(e) => updateManual('stock', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-category">Category</label>
            <input
              type="text"
              id="mp-m-category"
              className="form-control"
              value={manual.category}
              onChange={(e) => updateManual('category', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-country">Country made in (for example CN)</label>
            <input
              type="text"
              id="mp-m-country"
              className="form-control"
              value={manual.country}
              onChange={(e) => updateManual('country', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-link">Link to the product page</label>
            <input
              type="url"
              id="mp-m-link"
              className="form-control"
              value={manual.link}
              onChange={(e) => updateManual('link', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-image">Image link</label>
            <input
              type="url"
              id="mp-m-image"
              className="form-control"
              value={manual.image}
              onChange={(e) => updateManual('image', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-description">Description</label>
            <textarea
              id="mp-m-description"
              className="form-control"
              rows={4}
              value={manual.description}
              onChange={(e) => updateManual('description', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-markup">Markup %</label>
            <input
              type="number"
              id="mp-m-markup"
              className="form-control"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="mp-m-shipping">Shipping cents</label>
            <input
              type="number"
              id="mp-m-shipping"
              className="form-control"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
              Add as a draft
            </button>
          </div>
        </form>
      </section>
    </>
  );
}