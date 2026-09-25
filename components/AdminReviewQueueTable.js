'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import AdminAutoRefreshControl from './AdminAutoRefreshControl';
import { formatDateTime } from '@/lib/adminFormat';

// Finished research runs waiting for a decision. Loads itself on first
// render. Copied from the Global Platform's
// app/(admin)/scout/review/ReviewQueueTable.js.
export default function AdminReviewQueueTable() {
  const [runs, setRuns] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const handleRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/scout-research/needs-review');
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setRuns(data);
        setLoadError(null);
      } else {
        setLoadError(data.error || 'Failed to load the review queue.');
      }
    } catch {
      setLoadError('Failed to load the review queue.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div>
      <AdminAutoRefreshControl onRefresh={handleRefresh} storageKey="scout-review-queue-refresh" />
      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Query</th>
              <th>Researcher</th>
              <th>Critic</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-muted">{loaded ? 'No runs need review.' : 'Loading…'}</td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.id}>
                  <td className="wrap">{run.query}</td>
                  <td>{run.researcher_provider}/{run.researcher_model}</td>
                  <td>{run.critic_provider}/{run.critic_model}</td>
                  <td>{formatDateTime(run.created_at)}</td>
                  <td>
                    <Link href={`/admin/scout/review/${run.id}`} className="btn btn-secondary btn-sm">
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
