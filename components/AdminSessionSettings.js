'use client';

import { useEffect, useState } from 'react';

import { IDLE_CHOICES, IDLE_COOKIE, LAST_TOUCH_KEY, formatCountdown, idleLabel, parseIdleMinutes, remainingMs } from '@/lib/adminIdle';

// Account: how long the console may sit unused before it signs this person
// out, and how long this session has left right now.
function readIdleMinutes() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${IDLE_COOKIE}=(\\d+)`));
  return parseIdleMinutes(match ? match[1] : undefined);
}

function readSharedTouch() {
  try {
    return Number(window.localStorage.getItem(LAST_TOUCH_KEY)) || 0;
  } catch {
    return 0;
  }
}

export default function AdminSessionSettings({ initial }) {
  const [saved, setSaved] = useState(initial?.idle_minutes || 15);
  const [choice, setChoice] = useState(String(initial?.idle_minutes || 15));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [left, setLeft] = useState(null);
  const choices = initial?.choices?.length ? initial.choices : IDLE_CHOICES;

  useEffect(() => {
    const mountedAt = Date.now();
    const tick = setInterval(() => {
      const newest = Math.max(readSharedTouch(), mountedAt);
      setLeft(remainingMs({ lastTouch: newest, idleMinutes: readIdleMinutes(), now: Date.now() }));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idle_minutes: Number(choice) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The setting was not saved.');
      setSaved(data.idle_minutes);
      try {
        window.localStorage.setItem(LAST_TOUCH_KEY, String(Date.now()));
      } catch {
        // the timer falls back to its own clock
      }
      setNotice(`Saved. The console now signs you out after ${idleLabel(data.idle_minutes)} without activity.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!initial) {
    return <p className="admin-muted">The automatic sign-out setting is unavailable until the backend is updated.</p>;
  }

  return (
    <form className="admin-form admin-card" onSubmit={save}>
      <h2>Automatic sign-out</h2>
      <p className="admin-muted">
        The console signs you out after this long without any activity. Anything you do (clicking, typing, scrolling, moving between pages) starts the clock again, and a minute before the end it warns you with a button to stay signed in.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}
      <label>
        Sign me out after
        <select value={choice} onChange={(e) => setChoice(e.target.value)}>
          {choices.map((m) => <option key={m} value={m}>{idleLabel(m)} without activity</option>)}
        </select>
      </label>
      <p className="admin-muted" aria-live="off">
        Current setting: {idleLabel(saved)}.{left !== null ? ` This session signs out in ${formatCountdown(left)} if left alone.` : ''}
      </p>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy || Number(choice) === saved}>{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}
