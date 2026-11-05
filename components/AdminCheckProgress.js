'use client';

import { useEffect, useRef, useState } from 'react';
import { isRunning, progressView } from '@/lib/checkProgress';

// The progress bar under Check (Robert, 2026-11-05): polls the check every two seconds until it ends.
const POLL_MS = 2000;

export default function AdminCheckProgress({ runId, initialRun, onDone }) {
  const [run, setRun] = useState(initialRun ? { status: 'running', ...initialRun } : { status: 'running', phase: 'reading', progress_done: 0, progress_total: 0 });
  const [now, setNow] = useState(() => Date.now());

  // The parent passes a new onDone function on every render, so keep it in a ref and do NOT list it as a dependency:
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    let stopped = false;
    let timer = null;

    async function poll() {
      try {
        const response = await fetch(`/api/admin/resources/runs/${encodeURIComponent(runId)}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (stopped) return;
          setRun(data);
          setNow(Date.now());
          if (!isRunning(data)) {
            if (doneRef.current) doneRef.current(data);
            return;
          }
        }
      } catch {
        // A missed poll is fine; the next one catches up.
      }
      if (!stopped) timer = setTimeout(poll, POLL_MS);
    }

    poll();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [runId]);

  const view = progressView(run, now);
  if (!view) return null;

  return (
    <div className="check-progress" role="status" aria-live="polite">
      <div className="check-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={view.percent} aria-label="Check progress">
        <span style={{ width: `${view.percent}%` }} />
      </div>
      <span className="check-progress-label">{view.label}</span>
      {view.detail && <span className="check-progress-detail">{view.detail}</span>}
    </div>
  );
}
