'use client';

import { useState } from 'react';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import AdminSystemEvents from '@/components/AdminSystemEvents';
import AdminAuditLog from '@/components/AdminAuditLog';

export default function AdminActivity({ initial }) {
  const [tab, setTab] = useState('activity');
  const [error, setError] = useState('');

  const [logs, setLogs] = useState(initial.logs || []);
  const [job, setJob] = useState('');
  const [log, setLog] = useState(null);
  const [logBusy, setLogBusy] = useState(false);

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


  return (
    <div>
      <div className="admin-actions">
        <button
          type="button"
          className={`btn btn-sm ${tab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('activity')}
        >
          Audit log
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
<AdminAuditLog initial={initial} />
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