'use client';

import { useEffect, useRef, useState } from 'react';

import { formatDate } from '@/lib/adminFormat';
import {
  CONSENT_FILTERS,
  LOGIN_FILTERS,
  NO_TIER,
  SORTS,
  consentLabel,
  consentTone,
  customerName,
  customerQuery,
  shownSentence,
  summarySentence,
  tierSummary,
} from '@/lib/customerList';

// Every customer account on the website, who receives email updates, and
// who does not. Read-only: consent is the customer's own choice.
const PAGE_SIZE = 100;

export default function AdminSocialCustomers({ initial, loadError }) {
  const [data, setData] = useState(initial || null);
  const [q, setQ] = useState('');
  const [consent, setConsent] = useState('');
  const [tier, setTier] = useState('');
  const [login, setLogin] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError || '');
  const firstRun = useRef(Boolean(initial));
  const requestId = useRef(0);

  // Any change of search, filter, sort or page asks the backend again; the
  // search waits 300 ms after the last key. The first render uses the page
  // the server already loaded.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    const mine = ++requestId.current;
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        const res = await fetch(`/api/admin/customers?${customerQuery({ q, consent, tier, login, sort, page, pageSize: PAGE_SIZE })}`);
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || 'Unable to load the customers.');
        if (mine === requestId.current) {
          setData(body);
          setError('');
        }
      } catch (err) {
        if (mine === requestId.current) setError(err.message);
      } finally {
        if (mine === requestId.current) setBusy(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, consent, tier, login, sort, page]);

  function change(setter) {
    return (event) => {
      setter(event.target.value);
      setPage(1);
    };
  }

  const counts = data?.counts;
  const rows = data?.customers || [];
  const pages = data?.pages || 1;

  return (
    <section className="admin-customers">
      {counts && (
        <p className="admin-customers-summary">
          <strong>{summarySentence(counts)}</strong>{' '}
          <span className="admin-muted">{tierSummary(counts.by_tier)}</span>
        </p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-refresh">
        <input
          type="search"
          className="admin-compact-input admin-customers-search"
          placeholder="Search name, email, company or phone"
          aria-label="Search customers"
          value={q}
          maxLength={200}
          onChange={change(setQ)}
        />
        <select value={consent} onChange={change(setConsent)} aria-label="Updates">
          {CONSENT_FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={tier} onChange={change(setTier)} aria-label="Tier">
          <option value="">All tiers</option>
          {(data?.tiers || []).map((t) => <option key={t} value={t}>{t}</option>)}
          <option value="none">{NO_TIER}</option>
        </select>
        <select value={login} onChange={change(setLogin)} aria-label="Account">
          {LOGIN_FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={sort} onChange={change(setSort)} aria-label="Sort">
          {SORTS.map(([value, label]) => <option key={value} value={value}>Sort: {label}</option>)}
        </select>
        <span className="admin-muted" aria-live="polite">{busy ? 'Loading…' : shownSentence(data)}</span>
      </div>

      <div className="admin-table-wrap admin-docs-wrap">
        <table className="admin-table admin-table-compact">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tier</th>
              <th>State</th>
              <th>Updates</th>
              <th>Account</th>
              <th>Customer since</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="admin-muted">{data ? 'No customers match.' : 'The customer list is unavailable.'}</td></tr>
            )}
            {rows.map((c) => {
              const name = customerName(c);
              return (
                <tr key={c.id} style={c.is_active === false ? { opacity: 0.55 } : undefined}>
                  <td>
                    <strong>{name}</strong>
                    {c.company && c.company !== name && <span className="admin-muted admin-customers-company">{c.company}</span>}
                  </td>
                  <td><a href={`mailto:${c.email}`} className="admin-link">{c.email}</a></td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.pricing_tier || '—'}</td>
                  <td>{c.state || '—'}</td>
                  <td><span className={`admin-pill admin-pill-${consentTone(c.marketing_consent)}`}>{consentLabel(c.marketing_consent)}</span></td>
                  <td>{c.has_login ? 'Login set' : 'Imported'}</td>
                  <td>{formatDate(c.customer_since || c.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || busy}>Previous</button>
          <span className="admin-muted">Page {page} of {pages}</span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages || busy}>Next</button>
        </div>
      )}

      <p className="admin-muted">
        Customer email updates go to everyone marked Receives updates, or only the tiers you choose in Updates. Customers change this themselves, from the unsubscribe link in every email or their account.
      </p>
    </section>
  );
}
