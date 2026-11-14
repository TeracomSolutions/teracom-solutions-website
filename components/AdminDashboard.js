'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';

import { formatDateTime } from '@/lib/adminFormat';

// The Dashboard (api/staff_dashboard.py in the backend): one tile per area of the console with a green, amber or
// red light, why, and two or three numbers. Each tile opens its area. It reloads by itself every minute.

const LIGHT = { good: 'Healthy', attention: 'Needs a look', failing: 'Problem', unknown: 'Unknown' };
const OVERALL = {
  good: 'Everything is healthy.',
  attention: 'The platform is running. Some areas need a look.',
  failing: 'Some areas have a problem.',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'The dashboard did not load.');
      setData(body);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const timer = setInterval(load, 60000);
    return () => { clearTimeout(first); clearInterval(timer); };
  }, [load]);

  if (error && !data) return <p className="form-error" role="alert">{error}</p>;
  if (!data) return <p className="admin-muted">Loading…</p>;

  const { counts, tiles } = data;
  return (
    <div className="dash">
      <div className={`dash-overall is-${data.overall}`} role="status">
        <span className={`dash-light is-${data.overall}`} aria-hidden="true" />
        <strong>{OVERALL[data.overall] || OVERALL.attention}</strong>
        <span className="dash-counts">
          <span><i className="dash-light is-good" aria-hidden="true" /> {counts.good} healthy</span>
          <span><i className="dash-light is-attention" aria-hidden="true" /> {counts.attention + counts.unknown} need a look</span>
          <span><i className="dash-light is-failing" aria-hidden="true" /> {counts.failing} with a problem</span>
        </span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={load} disabled={busy}>
          <RefreshCw size={14} aria-hidden="true" /> {busy ? 'Checking…' : 'Refresh'}
        </button>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="dash-grid">
        {tiles.map((t) => (
          <Link key={t.key} href={t.href} className={`dash-tile is-${t.status}`}>
            <span className="dash-tile-head">
              <span className={`dash-light is-${t.status}`} role="img" aria-label={LIGHT[t.status] || t.status} />
              <strong>{t.title}</strong>
              <ArrowRight size={15} aria-hidden="true" />
            </span>
            <span className="dash-headline">{t.headline}</span>
            {t.facts.length ? (
              <span className="dash-facts">
                {t.facts.map((f) => (
                  <span key={f.label}><span>{f.label}</span><b>{f.value}</b></span>
                ))}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      <p className="admin-muted">Checked {formatDateTime(data.checked_at)}. Green: healthy. Amber: working, with something to look at. Red: a problem. Click a tile to open that area.</p>
    </div>
  );
}
