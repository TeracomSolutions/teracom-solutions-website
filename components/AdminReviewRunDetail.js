'use client';

import { useState } from 'react';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// One research run: the report, the critic's critique (or the error), and
// Approve / Reject with optional notes. Copied from the the previous platform's
// app/(admin)/scout/review/[runId]/ReviewRunDetail.js.
export default function AdminReviewRunDetail({ run }) {
  const [currentRun, setCurrentRun] = useState(run);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function decide(decision) {
    const notes = window.prompt(`Enter ${decision === 'approve' ? 'approval' : 'rejection'} notes (optional):`);
    if (notes === null) return; // cancelled the prompt -- do nothing

    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/scout-research/${currentRun.id}/${decision}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Unable to ${decision} this run.`);
      }
      setCurrentRun(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1>Research Run</h1>

      <dl className="admin-facts">
        <div>
          <dt>Query</dt>
          <dd>{currentRun.query}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd><span className={`admin-status is-${currentRun.status}`}>{humanise(currentRun.status)}</span></dd>
        </div>
        <div>
          <dt>Researcher</dt>
          <dd>{currentRun.researcher_provider || '—'} / {currentRun.researcher_model || '—'}</dd>
        </div>
        <div>
          <dt>Critic</dt>
          <dd>{currentRun.critic_provider || '—'} / {currentRun.critic_model || '—'}</dd>
        </div>
        <div>
          <dt>Started</dt>
          <dd>{formatDateTime(currentRun.created_at)}</dd>
        </div>
      </dl>

      {error && <p className="form-error" role="alert">{error}</p>}

      {currentRun.status === 'failed' ? (
        <>
          <h2>Error</h2>
          <pre className="admin-pre">{currentRun.error_message}</pre>
        </>
      ) : currentRun.status === 'running' ? (
        <p className="admin-muted">Still running. The report appears here once the researcher and critic have finished.</p>
      ) : (
        <>
          <h2>Report</h2>
          <div className="admin-pre">{currentRun.report_markdown}</div>

          <h2>Critique</h2>
          <div className="admin-pre">{currentRun.critique_markdown || 'No critique was produced.'}</div>
        </>
      )}

      {currentRun.status === 'needs_review' && (
        <div className="admin-actions" style={{ marginTop: '18px' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => decide('approve')} disabled={busy}>
            Approve
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => decide('reject')} disabled={busy}>
            Reject
          </button>
        </div>
      )}

      {(currentRun.status === 'approved' || currentRun.status === 'rejected') && (
        <>
          <h2>Review</h2>
          <dl className="admin-facts">
            <div>
              <dt>Reviewed by</dt>
              <dd>{currentRun.reviewed_by || '—'}</dd>
            </div>
            <div>
              <dt>Reviewed at</dt>
              <dd>{formatDateTime(currentRun.reviewed_at)}</dd>
            </div>
            {currentRun.review_notes && (
              <div>
                <dt>Notes</dt>
                <dd>{currentRun.review_notes}</dd>
              </div>
            )}
          </dl>
        </>
      )}
    </div>
  );
}
