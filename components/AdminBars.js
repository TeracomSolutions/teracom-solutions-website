'use client';

import { useState } from 'react';

// One series as thin rounded bars with a hover tooltip and a table view
// (the same look as the Website Data charts). series is [{ date, <field> }],
// oldest first; each bar is a day or, on the Search overview, a week.
function shortDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export default function AdminBars({ title, series, field, unit = 'week of' }) {
  const [hover, setHover] = useState(null);
  const [asTable, setAsTable] = useState(false);
  const width = 720;
  const height = 200;
  const pad = { top: 18, right: 12, bottom: 28, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...series.map((d) => d[field]));
  const step = innerW / Math.max(1, series.length);
  const barW = Math.max(2, Math.min(22, step * 0.6));
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  const labelEvery = series.length > 10 ? 2 : 1;

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
            <thead>
              <tr>
                <th>{unit === 'week of' ? 'Week starting' : 'Day'}</th>
                <th>{title}</th>
              </tr>
            </thead>
            <tbody>
              {series.map((d) => (
                <tr key={d.date}>
                  <td>{shortDate(d.date)}</td>
                  <td>{d[field].toLocaleString('en-AU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-chart-body">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} by ${unit === 'week of' ? 'week' : 'day'}`} onMouseLeave={() => setHover(null)}>
            {ticks.map((t) => {
              const y = pad.top + innerH - (t / max) * innerH;
              return (
                <g key={t}>
                  <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="admin-chart-grid" />
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" className="admin-chart-tick">{t.toLocaleString('en-AU')}</text>
                </g>
              );
            })}
            {series.map((d, i) => {
              const v = d[field];
              const h = (v / max) * innerH;
              const x = pad.left + i * step + (step - barW) / 2;
              const y = pad.top + innerH - h;
              const cap = Math.min(4, h);
              return (
                <g key={d.date}>
                  <rect x={pad.left + i * step} y={pad.top} width={step} height={innerH} fill="transparent" onMouseEnter={() => setHover(i)} />
                  {h > 0 && (
                    <path
                      d={`M${x} ${y + h} v${-(h - cap)} q0 -${cap} ${cap} -${cap} h${barW - 2 * cap} q${cap} 0 ${cap} ${cap} v${h - cap} z`}
                      className={hover === i ? 'admin-chart-bar active' : 'admin-chart-bar'}
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
              <strong>{series[hover][field].toLocaleString('en-AU')}</strong> {title.toLowerCase()} · {unit} {shortDate(series[hover].date)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
