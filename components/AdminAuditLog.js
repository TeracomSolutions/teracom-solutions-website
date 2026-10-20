'use client';

import { Fragment, useState } from 'react';
import AdminPager from '@/components/AdminPager';
import { DEFAULT_PAGE_SIZE } from '@/lib/pageRange';
import { formatDateTime } from '@/lib/adminFormat';
import { detailEntries, shortDetail, exportQuery } from '../lib/auditView.js';

export default function AdminAuditLog({ initial }) {
  const [rows, setRows] = useState(initial.rows || []);
  const [total, setTotal] = useState(initial.total || 0);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [q, setQ] = useState('');
  const [eventType, setEventType] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');
  const [applied, setApplied] = useState({ q: '', eventType: '', since: '', until: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState('');

  async function load(nextOffset = 0, size = pageSize, filters = applied) {
    setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: String(size), offset: String(nextOffset) });
      if (filters.q) params.set('q', filters.q);
      if (filters.eventType) params.set('event_type', filters.eventType);
      if (filters.since) params.set('since', filters.since);
      if (filters.until) params.set('until', filters.until);

      const response = await fetch('/api/admin/activity?' + params.toString());
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to load the audit log.');

      setRows(result.rows || []);
      setTotal(result.total || 0);
      setOffset(nextOffset);
      setApplied(filters);
      setOpen('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    load(0, pageSize, { q, eventType, since, until });
  }

  function handleReset() {
    setQ('');
    setEventType('');
    setSince('');
    setUntil('');
    load(0, pageSize, { q: '', eventType: '', since: '', until: '' });
  }

  function changePageSize(size) {
    setPageSize(size);
    load(0, size);
  }

  function toggleOpen(rowId) {
    setOpen(open === rowId ? '' : rowId);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="admin-form">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: a product, file, supplier, person..."
          maxLength="100"
          className="form-control"
        />
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="form-control"
        >
          <option value="">All kinds</option>
          {(initial.types || []).map((type) => (
            <option key={type.type} value={type.type}>
              {type.label} ({type.count})
            </option>
          ))}
        </select>
        <label>
          From
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="form-control"
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="form-control"
          />
        </label>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
          Search
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
          Reset
        </button>
        <a
          className="btn btn-secondary btn-sm"
          href={'/api/admin/activity/export' + exportQuery(applied)}
        >
          Export to CSV
        </a>
      </form>

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <AdminPager
        total={total}
        offset={offset}
        pageSize={pageSize}
        busy={busy}
        onPage={(next) => load(next)}
        onSize={changePageSize}
      />

      <div className="admin-table-wrap">
        <table className="admin-table audit-log-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>What happened</th>
              <th>Where</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5">Nothing found.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className="audit-log-row"
                    role="button"
                    tabIndex={0}
                    aria-expanded={open === row.id}
                    onClick={() => toggleOpen(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOpen(row.id);
                      }
                    }}
                  >
                    <td>{formatDateTime(row.at)}</td>
                    <td>{row.who}</td>
                    <td>{row.text}</td>
                    <td>{row.area}</td>
                    <td>{shortDetail(row.detail)}</td>
                  </tr>
                  {open === row.id && (
                    <tr>
                      <td colSpan="5">
                        <dl className="audit-detail-list">
                          {detailEntries(row).map((entry) => (
                            <div className="audit-detail-item" key={entry.label}>
                              <dt>{entry.label}:</dt>
                              <dd>{entry.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPager
        total={total}
        offset={offset}
        pageSize={pageSize}
        busy={busy}
        onPage={(next) => load(next)}
        onSize={changePageSize}
      />
    </div>
  );
}
