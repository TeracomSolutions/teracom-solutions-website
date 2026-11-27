'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Which accounting platform the business uses (Robert, 28 November 2026). Only that platform's card shows under
// Accounts and payments, and the Zoho order flow only for Zoho Books.
export default function AdminAccountingPlatform({ initial }) {
  const router = useRouter();
  const [platform, setPlatform] = useState(initial?.platform || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function choose(value) {
    setPlatform(value);
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/connections/accounting-platform', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'The choice was not saved.');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card">
      <label className="field-label" htmlFor="accounting-platform">Accounting platform</label>
      <div className="bp-inline">
        <select id="accounting-platform" value={platform} disabled={busy} onChange={(e) => choose(e.target.value)}>
          <option value="">Choose your accounting platform…</option>
          {(initial?.choices || []).map((choice) => (
            <option key={choice.key} value={choice.key}>{choice.label}</option>
          ))}
        </select>
      </div>
      <p className="admin-muted">Only the chosen platform&apos;s card is shown under Accounts and payments, with its Help steps to connect it. The order flow (invoices and purchase orders from website orders) works with Zoho Books today.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
