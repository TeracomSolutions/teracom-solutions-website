'use client';

import { useEffect, useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';

// Store > Pricing > Price check (Robert, 2026-10-26): every live product's price for every tier, worked out
// again and compared with the markup table. It runs each time prices are made live, and with Check prices now.
const KIND = {
  below_cost: { label: 'Below cost', tone: 'red', text: 'sells for less than cost plus GST' },
  no_markup: { label: 'No markup', tone: 'grey', text: 'nothing sets a markup for the tier, so it pays the RRP' },
  no_cost: { label: 'No cost', tone: 'grey', text: 'no cost price, so the tier prices are the RRP and cannot be checked' },
  above_rrp: { label: 'Above RRP', tone: 'amber', text: 'cost plus the markup is above the supplier RRP; the markup price is charged (for information)' },
};

const money = (cents) => (cents == null ? '–' : `$${(cents / 100).toFixed(2)}`);

function tierText(t) {
  if (t.kind === 'no_cost') return 'All tiers pay the RRP';
  const name = t.tier ? t.tier.charAt(0).toUpperCase() + t.tier.slice(1) : '';
  if (t.kind === 'above_rrp') return `${name}: ${money(t.price_cents)} (markup ${t.markup}%)`;
  if (t.kind === 'below_cost') return `${name}: ${money(t.price_cents)}`;
  return `${name}: ${money(t.price_cents)} (RRP)`;
}

function toCsv(issues) {
  const quote = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = [['SKU', 'Name', 'Supplier', 'Problem', 'Cost ex GST', 'RRP', 'Tiers'].map(quote).join(',')];
  for (const i of issues) {
    lines.push([i.sku, i.name, i.supplier, KIND[i.worst]?.label, money(i.cost_cents), money(i.rrp_cents), i.tiers.map(tierText).join('; ')].map(quote).join(','));
  }
  return lines.join('\n');
}

export default function AdminPriceCheck({ initial }) {
  const [check, setCheck] = useState(initial && initial.checked_at ? initial : null);
  const [kind, setKind] = useState('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load(method = 'GET') {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/pricing/check', { method, cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The price check did not run.');
      if (data.checked_at) setCheck(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Making prices live runs the check on the backend; this picks up the new result.
  useEffect(() => {
    const reload = () => load('GET');
    window.addEventListener('price-check-updated', reload);
    return () => window.removeEventListener('price-check-updated', reload);
    // Only once: load() reads nothing that changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function download() {
    const blob = new Blob([toCsv(check.issues)], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'price-check.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const issues = check ? check.issues.filter((i) => kind === 'all' || i.worst === kind) : [];
  const allGood = check && check.issues_total === 0;

  return (
    <section className="admin-card admin-price-check">
      <h2>Price check</h2>
      <p className="admin-muted">Every live product&apos;s price for every tier, worked out again and compared with the markups on this page. It runs each time prices are made live.</p>
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => load('POST')} disabled={busy}>{busy ? 'Checking…' : 'Check prices now'}</button>
        {check && check.issues_total > 0 && <button type="button" className="btn btn-secondary btn-sm" onClick={download}>Download the list (CSV)</button>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!check && !error && <p className="admin-muted">Not checked yet. Press Check prices now.</p>}
      {check && (
        <>
          <p>
            <span className={`admin-status admin-status-${allGood ? 'green' : check.counts.below_cost ? 'red' : 'amber'}`}>
              {allGood ? 'Every live price matches the markups' : `${check.matching} of ${check.products} live products match the markups exactly`}
            </span>{' '}
            <span className="admin-muted">Checked {formatDateTime(check.checked_at)}</span>
          </p>
          <div className="admin-price-check-counts">
            {Object.entries(KIND).map(([key, k]) => (
              <button key={key} type="button" className={`admin-price-check-count is-${k.tone}${kind === key ? ' is-on' : ''}`} onClick={() => setKind(kind === key ? 'all' : key)} title={k.text}>
                <strong>{check.counts[key] || 0}</strong>
                <span>{k.label}</span>
              </button>
            ))}
          </div>
          {check.issues_total > check.issues.length && <p className="admin-muted">Showing the first {check.issues.length} of {check.issues_total}, worst first.</p>}
          {issues.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Product</th><th>Supplier</th><th>Problem</th><th>Cost ex GST</th><th>RRP</th><th>Tiers affected</th></tr>
                </thead>
                <tbody>
                  {issues.slice(0, 300).map((i) => (
                    <tr key={i.sku}>
                      <td><strong>{i.sku}</strong><div className="admin-muted">{i.name}</div></td>
                      <td>{i.supplier || '–'}</td>
                      <td><span className={`admin-pill admin-pill-${KIND[i.worst]?.tone === 'red' ? 'bad' : KIND[i.worst]?.tone === 'amber' ? 'warn' : 'muted'}`}>{KIND[i.worst]?.label}</span></td>
                      <td>{money(i.cost_cents)}</td>
                      <td>{money(i.rrp_cents)}</td>
                      <td>{i.tiers.map((t, n) => <div key={n}>{tierText(t)}</div>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {issues.length > 300 && <p className="admin-muted">The first 300 are shown here; the CSV has them all.</p>}
            </div>
          )}
          <p className="admin-muted">Above RRP is not an error: cost plus your markup is above the supplier&apos;s RRP, so customers pay the markup price and visitors see it too. Worth a look in case the supplier&apos;s RRP or cost is wrong. Products whose RRP is below cost never go live; they wait on Data Feeds &gt; Needs review.</p>
        </>
      )}
    </section>
  );
}
