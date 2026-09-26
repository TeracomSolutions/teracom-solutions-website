'use client';

import { useEffect, useState } from 'react';

// Refresh now, or every N seconds. Copied from the Global Platform's
// components/AutoRefreshControl.js.
const INTERVAL_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '5s', value: 5000 },
  { label: '30s', value: 30000 },
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
];

export default function AdminAutoRefreshControl({ onRefresh, storageKey }) {
  const [intervalMs, setIntervalMs] = useState(0);

  // Restore the viewer's last choice for this control (per browser, per
  // storageKey). localStorage can throw (private browsing, blocked site
  // data), in which case the default is Off.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored !== null) setIntervalMs(Number(stored));
    } catch {
      // default to Off
    }
  }, [storageKey]);

  useEffect(() => {
    if (!intervalMs) return undefined;
    const id = setInterval(() => {
      onRefresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, onRefresh]);

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setIntervalMs(value);
    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch {
      // ignore
    }
  };

  return (
    <div className="admin-refresh">
      <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
        Refresh
      </button>
      <label>
        Auto-refresh
        <select value={intervalMs} onChange={handleChange}>
          {INTERVAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
