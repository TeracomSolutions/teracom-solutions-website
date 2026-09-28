'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  IDLE_COOKIE,
  LAST_TOUCH_KEY,
  REFRESH_AFTER_SECONDS,
  WARN_BEFORE_MS,
  formatCountdown,
  idleLabel,
  parseIdleMinutes,
  remainingMs,
} from '@/lib/adminIdle';

// The console's sign-out clock, next to Sign out. It counts down from the
// last moment the server recorded activity; clicking, typing, scrolling or
// moving the mouse tells the server "still here" at most once a minute.
// A minute before the end it warns, with a button to stay signed in; at the
// end it signs out. The time is shared between open console tabs, so one
// idle tab does not sign out a person working in another.
function readIdleMinutes() {
  const match = typeof document !== 'undefined' ? document.cookie.match(new RegExp(`(?:^|; )${IDLE_COOKIE}=(\\d+)`)) : null;
  return parseIdleMinutes(match ? match[1] : undefined);
}

function readSharedTouch() {
  try {
    return Number(window.localStorage.getItem(LAST_TOUCH_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeSharedTouch(value) {
  try {
    window.localStorage.setItem(LAST_TOUCH_KEY, String(value));
  } catch {
    // private windows: this tab keeps its own clock
  }
}

function goToSignIn(reason) {
  window.location.assign(`/admin/login?reason=${reason || 'idle'}`);
}

export default function AdminSessionTimer() {
  const [remaining, setRemaining] = useState(null);
  const [idle, setIdle] = useState(15);
  const lastTouch = useRef(0);
  const pinging = useRef(false);
  const ended = useRef(false);

  const touch = useCallback(async () => {
    if (pinging.current || ended.current) return;
    pinging.current = true;
    try {
      const res = await fetch('/api/admin/session', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        ended.current = true;
        goToSignIn(data.reason);
        return;
      }
      if (res.ok) {
        lastTouch.current = Date.now();
        writeSharedTouch(lastTouch.current);
      }
    } catch {
      // offline for a moment: the clock keeps running from the last touch
    } finally {
      pinging.current = false;
    }
  }, []);

  useEffect(() => {
    lastTouch.current = Date.now();
    touch();

    const onActivity = () => {
      const newest = Math.max(lastTouch.current, readSharedTouch());
      if (Date.now() - newest > REFRESH_AFTER_SECONDS * 1000) touch();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') onActivity();
    };
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('teracom-admin-session', touch);

    const tick = setInterval(async () => {
      const minutes = readIdleMinutes();
      setIdle(minutes);
      const newest = Math.max(lastTouch.current, readSharedTouch());
      const left = remainingMs({ lastTouch: newest, idleMinutes: minutes, now: Date.now() });
      setRemaining(left);
      if (left <= 0 && !ended.current) {
        ended.current = true;
        await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
        goToSignIn('idle');
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('teracom-admin-session', touch);
      clearInterval(tick);
    };
  }, [touch]);

  if (remaining === null) return null;
  const warn = remaining <= WARN_BEFORE_MS;

  return (
    <>
      <span className="admin-session-timer" title={`Signs out after ${idleLabel(idle)} of no activity. Change it under Account.`}>
        Signs out in {formatCountdown(remaining)}
      </span>
      {warn && (
        <div className="admin-session-warning" role="alert">
          <span>You will be signed out in {formatCountdown(remaining)} for inactivity.</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={touch}>Stay signed in</button>
        </div>
      )}
    </>
  );
}
