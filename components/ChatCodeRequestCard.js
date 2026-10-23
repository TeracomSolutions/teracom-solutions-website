'use client';

import { useEffect, useState } from 'react';

const STATUS_TEXT = {
  queued: 'Waiting for the coding worker',
  building: 'OpenHands is writing it',
  built: 'Written; testing it',
  testing: 'Running the tests and the build',
  pr_open: 'Pull request ready to review',
  failed: 'Did not work',
  cancelled: 'Cancelled',
};
const FINISHED = ['pr_open', 'failed', 'cancelled'];

function tone(status) {
  if (status === 'pr_open') return 'is-ok';
  if (status === 'failed') return 'is-bad';
  if (status === 'cancelled') return '';
  return 'is-busy';
}

// The card that follows a front-end change request inside the chat: where it is, and the pull request when it is ready.
export default function ChatCodeRequestCard({ id, title }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    async function load() {
      try {
        const response = await fetch('/api/admin/code-requests', { cache: 'no-store' });
        const data = await response.json().catch(() => ({}));
        const found = (data.requests || []).find((entry) => entry.id === id) || null;
        if (!cancelled) setItem(found);
        if (!cancelled && (!found || !FINISHED.includes(found.status))) timer = setTimeout(load, 15000);
      } catch {
        if (!cancelled) timer = setTimeout(load, 30000);
      }
    }
    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [id]);

  const status = item ? item.status : 'queued';
  return (
    <div className="chat-card">
      <div className="chat-card-head">
        <strong>Front-end change</strong>
        <span className={`bp-chip ${tone(status)}`}>{STATUS_TEXT[status] || status}</span>
      </div>
      <p className="chat-card-title">{item ? item.title : title}</p>
      {item && item.detail ? <p className="admin-muted">{item.detail}</p> : null}
      {item && item.files && item.files.length > 0 ? <p className="admin-muted">Files: {item.files.join(', ')}</p> : null}
      {item && item.pr_url ? <p><a href={item.pr_url} target="_blank" rel="noopener noreferrer">Open the pull request</a></p> : null}
    </div>
  );
}
