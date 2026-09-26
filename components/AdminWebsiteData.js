'use client';

import { useState } from 'react';
import Link from 'next/link';

// The Website Data page: how many people, which pages, where from, on
// what, and the daily trend -- from our own page-view log.

const RANGES = [7, 30, 90];

function pct(current, previous) {
  if (!previous) return current ? '+100%' : '—';
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  return `${sign}${Math.round(change)}%`;
}

function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

function StatTile({ label, value, previous }) {
  const change = pct(value, previous);
  const up = value >= previous;
  return (
    <div className="admin-stat">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value">{value.toLocaleString('en-AU')}</strong>
      <span className={`admin-stat-delta ${up ? 'up' : 'down'}`} title="Compared with the previous period">
        {change} vs previous {previous.toLocaleString('en-AU')}
      </span>
    </div>
  );
}

// One series, thin rounded bars, hover tooltip, recessive grid. Values in
// text tokens; the bar carries the identity.
function DailyBars({ title, series, field }) {
  const [hover, setHover] = useState(null);
  const [asTable, setAsTable] = useState(false);
  const width = 720;
  const height = 200;
  const pad = { top: 18, right: 12, bottom: 28, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...series.map((d) => d[field]));
  const step = innerW / series.length;
  const barW = Math.max(2, Math.min(18, step * 0.6));
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  const labelEvery = series.length > 45 ? 15 : series.length > 14 ? 7 : 1;

  return (
    <div className="admin-card admin-chart">
      <div className="admin-chart-head">
        <h3>{title}</h3>
        <button type="button" className="admin-link-btn" onClick={() => setAsTable((v) => !v)}>
          {asTable ? 'Show chart' : 'Show table'}
        </button>
      </div>
      {asTable ? (
        <div className="admin-table-wrap" style={{ marginBottom: 0, maxHeight: '260px', overflowY: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Day</th><th>{title}</th></tr></thead>
            <tbody>
              {series.map((d) => <tr key={d.date}><td>{shortDate(d.date)}</td><td>{d[field]}</td></tr>)}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-chart-body">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} per day`} onMouseLeave={() => setHover(null)}>
            {ticks.map((t) => {
              const y = pad.top + innerH - (t / max) * innerH;
              return (
                <g key={t}>
                  <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="admin-chart-grid" />
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" className="admin-chart-tick">{t}</text>
                </g>
              );
            })}
            {series.map((d, i) => {
              const v = d[field];
              const h = (v / max) * innerH;
              const x = pad.left + i * step + (step - barW) / 2;
              const y = pad.top + innerH - h;
              const active = hover === i;
              return (
                <g key={d.date}>
                  <rect x={pad.left + i * step} y={pad.top} width={step} height={innerH} fill="transparent" onMouseEnter={() => setHover(i)} />
                  {h > 0 && (
                    <path
                      d={`M${x} ${pad.top + innerH} v${-(h - Math.min(4, h))} q0 -${Math.min(4, h)} 4 -${Math.min(4, h)} h${barW - 8} q4 0 4 ${Math.min(4, h)} v${h - Math.min(4, h)} z`}
                      className={active ? 'admin-chart-bar active' : 'admin-chart-bar'}
                      pointerEvents="none"
                    />
                  )}
                  {i % labelEvery === 0 && (
                    <text x={pad.left + i * step + step / 2} y={height - 8} textAnchor="middle" className="admin-chart-tick">{shortDate(d.date)}</text>
                  )}
                </g>
              );
            })}
          </svg>
          {hover !== null && series[hover] && (
            <div className="admin-chart-tooltip" style={{ left: `${((pad.left + hover * step + step / 2) / width) * 100}%` }}>
              <strong>{series[hover][field].toLocaleString('en-AU')}</strong> {title.toLowerCase()} · {shortDate(series[hover].date)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TopTable({ title, rows, keyLabel, formatKey }) {
  const total = rows.reduce((sum, r) => sum + r.views, 0) || 1;
  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      <h3 style={{ margin: '16px 20px 8px' }}>{title}</h3>
      <table className="admin-table">
        <thead><tr><th>{keyLabel}</th><th>Views</th><th>Visitors</th><th>Share</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={4} className="admin-muted">Nothing yet.</td></tr>}
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="wrap">{formatKey ? formatKey(r.key) : r.key}</td>
              <td>{r.views.toLocaleString('en-AU')}</td>
              <td>{r.visitors.toLocaleString('en-AU')}</td>
              <td>
                <span className="admin-share" aria-label={`${Math.round((r.views / total) * 100)} per cent`}>
                  <span style={{ width: `${Math.round((r.views / total) * 100)}%` }} />
                </span>
                <span className="admin-muted" style={{ fontSize: '12px', marginLeft: '8px' }}>{Math.round((r.views / total) * 100)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COUNTRY_NAMES = { AU: 'Australia', NZ: 'New Zealand', US: 'United States', GB: 'United Kingdom', SG: 'Singapore', IN: 'India', CN: 'China', DE: 'Germany', CA: 'Canada', PH: 'Philippines', ID: 'Indonesia', MY: 'Malaysia', JP: 'Japan', HK: 'Hong Kong', ZA: 'South Africa', IE: 'Ireland', FR: 'France', NL: 'Netherlands' };

export default function AdminWebsiteData({ summary, days }) {
  const { totals, previous, series, top_pages: topPages, top_referrers: topReferrers, countries, regions, devices } = summary;
  return (
    <div>
      <div className="admin-refresh">
        <span className="admin-muted">Last</span>
        {RANGES.map((n) => (
          <Link key={n} href={`/admin/website-data?days=${n}`} className={`admin-tab${n === days ? ' active' : ''}`} style={{ padding: '6px 12px' }}>
            {n} days
          </Link>
        ))}
        {summary.tracking_since && (
          <span className="admin-muted">Recording since {new Date(summary.tracking_since).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Australia/Sydney' })}. Compared with the {days} days before.</span>
        )}
      </div>

      <div className="admin-stats">
        <StatTile label="Page views" value={totals.views} previous={previous.views} />
        <StatTile label="Visitors" value={totals.visitors} previous={previous.visitors} />
        <StatTile label="Views per visitor" value={totals.visitors ? Math.round((totals.views / totals.visitors) * 10) / 10 : 0} previous={previous.visitors ? Math.round((previous.views / previous.visitors) * 10) / 10 : 0} />
      </div>

      <div className="admin-charts">
        <DailyBars title="Page views" series={series} field="views" />
        <DailyBars title="Visitors" series={series} field="visitors" />
      </div>

      <div className="admin-two-col">
        <TopTable title="Top pages" rows={topPages} keyLabel="Page" />
        <TopTable title="Where visitors came from" rows={topReferrers} keyLabel="Site" />
        <TopTable title="Countries" rows={countries} keyLabel="Country" formatKey={(k) => COUNTRY_NAMES[k] || k} />
        <TopTable title="Devices" rows={devices} keyLabel="Device" formatKey={(k) => k.charAt(0).toUpperCase() + k.slice(1)} />
        {regions.length > 0 && <TopTable title="States and regions" rows={regions} keyLabel="Region" />}
      </div>
    </div>
  );
}
