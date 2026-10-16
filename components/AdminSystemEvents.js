'use client';

import { Fragment, useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/adminFormat';
import AdminPager from '@/components/AdminPager';
import { DEFAULT_PAGE_SIZE } from '@/lib/pageRange';

export default function AdminSystemEvents() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [kinds, setKinds] = useState([]);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function load(nextOffset = 0, size = pageSize, query = q, type = kind) {
    setBusy(true);
    setError(null);

    const params = new URLSearchParams({
      limit: String(size),
      offset: String(nextOffset),
      q: query,
      kind: type,
    });

    try {
      const res = await fetch(`/api/admin/activity/system?${params}`);
      const result = await res.json();

      if (res.ok) {
        setRows(result.rows);
        setTotal(result.total || 0);
        setOffset(nextOffset);
        setKinds(result.kinds);
        setOpen(null);
      } else {
        setError(result.error || 'Unable to load the system events.');
      }
    } catch (err) {
      setError('Unable to load the system events.');
    } finally {
      setBusy(false);
      setLoaded(true);
    }
  }

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(0);
  }

  function handleReset() {
    setQ('');
    setKind('');
    load(0, pageSize, '', '');
  }

  function toggleDetails(id) {
    setOpen(open === id ? null : id);
  }

  function changePageSize(size) {
    setPageSize(size);
    load(0, size);
  }

  return (
    <>
      <form onSubmit={handleSearch} className="admin-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search: a job, a page, an error..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="form-control"
          >
            <option value="">All kinds</option>
            {kinds.map((k) => (
              <option key={k.kind} value={k.kind}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
            Reset
          </button>
        </div>
      </form>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <AdminPager total={total} offset={offset} pageSize={pageSize} busy={busy} onPage={(next) => load(next)} onSize={changePageSize} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>When</th>
            <th>What</th>
          </tr>
        </thead>
        <tbody>
          {loaded ? (
            rows.length > 0 ? (
              rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td>{formatDateTime(row.at)}</td>
                    <td>
                      {row.text}
                      <button
                        className="admin-link-button"
                        onClick={() => toggleDetails(row.id)}
                        aria-expanded={open === row.id}
                      >
                        {open === row.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {open === row.id && (
                    <tr>
                      <td colSpan="2">
                        <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(row.detail, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2">Nothing found.</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="2">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      <AdminPager total={total} offset={offset} pageSize={pageSize} busy={busy} onPage={(next) => load(next)} onSize={changePageSize} />
    </>
  );
}