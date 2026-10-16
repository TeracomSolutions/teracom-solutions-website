'use client';

import { Fragment, useState } from 'react';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import AdminSystemEvents from '@/components/AdminSystemEvents';
import AdminPager from '@/components/AdminPager';
import { DEFAULT_PAGE_SIZE } from '@/lib/pageRange';

export default function AdminActivity({ initial }) {
  const [tab, setTab] = useState('activity');
  const [rows, setRows] = useState(initial.rows || []);
  const [total, setTotal] = useState(initial.total || 0);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [q, setQ] = useState('');
  const [eventType, setEventType] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState('');

  const [logs, setLogs] = useState(initial.logs || []);
  const [job, setJob] = useState('');
  const [log, setLog] = useState(null);
  const [logBusy, setLogBusy] = useState(false);

  async function load(nextOffset = 0, size = pageSize, query = q, type = eventType) {
    setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: String(size), offset: String(nextOffset) });
      if (query) params.set('q', query);
      if (type) params.set('event_type', type);

      const response = await fetch(`/api/admin/activity?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to load the activity.');

      setRows(result.rows || []);
      setTotal(result.total || 0);
      setOffset(nextOffset);
      setOpen('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadLog(jobId) {
    setLogBusy(true);
    setJob(jobId);
    try {
      const response = await fetch(`/api/admin/activity/logs/${jobId}?lines=200`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to load the log.');
      setLog(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLogBusy(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    load(0);
  }

  function handleReset() {
    setQ('');
    setEventType('');
    load(0, pageSize, '', '');
  }

  function changePageSize(size) {
    setPageSize(size);
    load(0, size);
  }


  return (
    <div>
      <div className="admin-actions">
        <button
          type="button"
          className={`btn btn-sm ${tab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('activity')}
        >
          What happened
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('logs')}
        >
          Job logs
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === 'system' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('system')}
        >
          System
        </button>
      </div>

      {tab === 'activity' ? (
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
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={busy}
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
            >
              Reset
            </button>
          </form>

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <AdminPager total={total} offset={offset} pageSize={pageSize} busy={busy} onPage={(next) => load(next)} onSize={changePageSize} />

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Who</th>
                  <th>What</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="3">Nothing found.</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <Fragment key={row.id}>
                      <tr>
                        <td>{formatDateTime(row.at)}</td>
                        <td>{row.who}</td>
                        <td>
                          {row.text}
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => setOpen(open === row.id ? '' : row.id)}
                          >
                            {open === row.id ? 'Hide' : 'Details'}
                          </button>
                        </td>
                      </tr>
                      {open === row.id && (
                        <tr>
                          <td colSpan="3">
                            <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                              {JSON.stringify(row.detail, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AdminPager total={total} offset={offset} pageSize={pageSize} busy={busy} onPage={(next) => load(next)} onSize={changePageSize} />
        </div>
      ) : tab === 'system' ? (
        <AdminSystemEvents />
      ) : (
        <div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Files</th>
                  <th>Last written</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4">No job logs found.</td>
                  </tr>
                ) : (
                  logs.map((entry) => (
                    <tr key={entry.job}>
                      <td>{humanise(entry.job)}</td>
                      <td>{entry.files}</td>
                      <td>{formatDateTime(entry.last_at)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => loadLog(entry.job)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          {log && (
            <div>
              <p className="admin-muted">
                {log.file} — {formatDateTime(log.modified)}
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => loadLog(job)}
                disabled={logBusy}
              >
                Refresh log
              </button>
              <pre
                style={{
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  maxHeight: 480,
                  overflow: 'auto'
                }}
              >
                {log.lines.length > 0 ? log.lines.join('\n') : 'This log is empty.'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}