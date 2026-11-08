'use client';

import { useEffect, useState } from 'react';

// Helper to format numbers
function fmtNum(n) {
  if (n === null || n === undefined) return '—';
  return n.toLocaleString('en-AU');
}

// Helper to format bytes
function fmtBytes(b) {
  if (b === null || b === undefined) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let value = b;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  if (unitIndex === 0) return `${b} B`;
  const rounded = value >= 100 ? Math.round(value) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
}

// Helper to format milliseconds
function fmtMs(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)} s`;
  }
  return `${Math.round(ms)} ms`;
}

// Helper to format percentage
function fmtPct(p) {
  if (p === null || p === undefined) return '—';
  return `${p}%`;
}

// Helper to format date
function fmtDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleString('en-AU', {
    timeZone: 'Australia/Melbourne',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const CHART_W = 800;
const CHART_H = 240;
const LEFT = 70;
const RIGHT = 790;
const TOP = 10;
const BOTTOM = 205;
function xAt(index, count) {
  return count <= 1 ? LEFT : LEFT + (index / (count - 1)) * (RIGHT - LEFT);
}
function yAt(value, min, max) {
  return BOTTOM - ((value - min) / (max - min || 1)) * (BOTTOM - TOP);
}

export default function AdminMemory() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Define load function before useEffect that calls it
  const load = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/memory', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load the memory overview.');
      const result = await response.json();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (busy && !data) {
    return <p>Loading...</p>;
  }

  if (error && !data) {
    return <p className="form-error" role="alert">{error}</p>;
  }

  const totals = data?.totals || {};
  const stores = data?.stores || [];
  const growth = data?.growth || [];
  const answers = data?.answers || [];
  const recent = data?.recent || [];

  // Render chart for growth
  function renderGrowthChart() {
    if (growth.length === 0) return null;
    
    // Find min and max entries values to set the y-axis
    const entriesValues = growth.map(item => item.entries);
    const minEntries = Math.min(...entriesValues);
    const maxEntries = Math.max(...entriesValues);
    const range = maxEntries - minEntries;
    
    // If all values are equal, add a small padding
    const yMin = range === 0 ? minEntries : minEntries;
    const yMax = range === 0 ? minEntries + 1 : maxEntries;
    
    // Create the path for the polyline
    const points = [];
    growth.forEach((item, index) => {
      const x = xAt(index, growth.length);
      const y = yAt(item.entries, yMin, yMax);
      points.push(`${x},${y}`);
    });
    
    // Create grid lines
    const gridLines = [];
    const gridCount = 3;
    for (let i = 0; i < gridCount; i++) {
      const gridValue = yMin + (yMax - yMin) * i / (gridCount - 1);
      const y = yAt(gridValue, yMin, yMax);
      const value = Math.round(gridValue);
      gridLines.push(
        <g key={i}>
          <line
            x1={LEFT}
            y1={y}
            x2={RIGHT}
            y2={y}
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="2,2" />
          <text
            x={LEFT - 5}
            y={y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#9ca3af"
          >
            {fmtNum(value)}
          </text>
        </g>
      );
    }
    
    // Create x labels
    const xLabels = [];
    for (let i = 0; i < growth.length; i += 5) {
      if (i >= growth.length) break;
      const item = growth[i];
      const x = xAt(i, growth.length);
      xLabels.push(
        <text
          key={i}
          x={x}
          y="228"
          textAnchor="middle"
          fontSize="12"
          fill="#9ca3af"
        >
          {item.label}
        </text>
      );
    }
    
    // Add last label
    const lastItem = growth[growth.length - 1];
    if (lastItem && growth.length > 0 && (growth.length - 1) % 5 !== 0) {
      const x = RIGHT;
      xLabels.push(
        <text
          key="last"
          x={x}
          y="228"
          textAnchor="end"
          fontSize="12"
          fill="#9ca3af"
        >
          {lastItem.label}
        </text>
      );
    }
    
    // Create data points with tooltips
    const dataPoints = growth.map((item, index) => {
      const x = xAt(index, growth.length);
      const y = yAt(item.entries, yMin, yMax);
      return (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="8"
            fill="transparent"
          >
            <title>{`${item.label}: ${fmtNum(item.entries)} entries (+${fmtNum(item.added)})`}</title>
          </circle>
        </g>
      );
    });
    
    return (
      <svg viewBox="0 0 800 240" width="100%" style={{ marginTop: '1rem' }}>
        {gridLines}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinejoin="round"
          points={points.join(' ')}
        />
        {xLabels}
        {dataPoints}
      </svg>
    );
  }

  // Render chart for answers
  function renderAnswersChart() {
    let maxAvgMs = 0;
    answers.forEach((area) => {
      (area.daily || []).forEach((day) => {
        if (day.avg_ms != null) maxAvgMs = Math.max(maxAvgMs, day.avg_ms);
      });
    });
    if (maxAvgMs === 0) return <p className="admin-muted">No answers in the last 30 days yet.</p>;

    const colors = ['#ef4444', '#9ca3af'];
    const days = answers[0]?.daily || [];
    const count = days.length;
    const grid = [0, maxAvgMs / 2, maxAvgMs];

    return (
      <>
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0 0.5rem' }}>
          {answers.map((area, i) => (
            <span key={area.area} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#d1d5db' }}>
              <span style={{ width: 12, height: 12, background: colors[i % 2], display: 'inline-block' }} />
              {area.name}
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%">
          {grid.map((value) => {
            const y = yAt(value, 0, maxAvgMs);
            return (
              <g key={value}>
                <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="#374151" strokeWidth="1" />
                <text x={LEFT - 5} y={y + 4} textAnchor="end" fontSize="12" fill="#9ca3af">{fmtMs(value)}</text>
              </g>
            );
          })}
          {days.map((day, i) => (i % 5 === 0 ? (
            <text key={day.label} x={xAt(i, count)} y={CHART_H - 12} textAnchor="middle" fontSize="12" fill="#9ca3af">{day.label}</text>
          ) : null))}
          {count > 0 && (count - 1) % 5 !== 0 && (
            <text x={RIGHT} y={CHART_H - 12} textAnchor="end" fontSize="12" fill="#9ca3af">{days[count - 1].label}</text>
          )}
          {answers.map((area, a) => {
            const pts = (area.daily || [])
              .map((day, i) => ({ day, x: xAt(i, count), y: day.avg_ms == null ? null : yAt(day.avg_ms, 0, maxAvgMs) }))
              .filter((p) => p.y != null);
            return (
              <g key={area.area}>
                <polyline fill="none" stroke={colors[a % 2]} strokeWidth="2" strokeLinejoin="round" points={pts.map((p) => `${p.x},${p.y}`).join(' ')} />
                {pts.map((p) => (
                  <circle key={p.day.label} cx={p.x} cy={p.y} r="8" fill="transparent">
                    <title>{`${area.name} ${p.day.label}: ${fmtMs(p.day.avg_ms)} over ${fmtNum(p.day.answers)} answers`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
        <p className="admin-muted" style={{ fontSize: '0.9rem' }}>Average time to answer per day. Only answers that worked are timed.</p>
      </>
    );
  }

  return (
    <div>
      <div className="admin-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={load}
          disabled={busy}
        >
          {busy ? 'Refreshing...' : 'Refresh'}
        </button>
        {error && (
          <span style={{ color: '#ef4444', marginLeft: '1rem' }}>{error}</span>
        )}
      </div>

      <div className="admin-card">
        <h2>Storage</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Entries</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtNum(totals.entries)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Content</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtBytes(totals.content_bytes)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Search indexes and database overhead</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtBytes(totals.overhead_bytes)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total on disk</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtBytes(totals.disk_bytes)}</strong></p>
          </div>
        </div>
        <p className="admin-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Content is the stored text. Indexes and database overhead is what the database adds to find entries quickly. Content plus overhead is the total on disk. There is no size limit; it can grow up to the free space on the server.
        </p>
        <p className="admin-muted" style={{ fontSize: '0.9rem' }}>
          Free space on the server: {data?.free_disk_bytes ? fmtBytes(data.free_disk_bytes) : 'not measured'}
        </p>
      </div>

      <div className="admin-card">
        <h2>Growth: entries over the last 30 days</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Added today</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtNum(totals.added_today)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Added in the last 7 days</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtNum(totals.added_7)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Added in the last 30 days</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtNum(totals.added_30)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Growth over 30 days</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{fmtPct(totals.growth_30_pct)}</strong></p>
          </div>
        </div>
        {renderGrowthChart()}
        <p className="admin-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Total entries at the end of each day, Melbourne time.
        </p>
      </div>

      <div className="admin-card">
        <h2>What is stored</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Entries</th>
                <th>Content</th>
                <th>On disk</th>
                <th>Added today</th>
                <th>Added 7 days</th>
                <th>Added 30 days</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.key}>
                  <td>{store.name}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(store.entries)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtBytes(store.content_bytes)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtBytes(store.disk_bytes)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(store.added_today)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(store.added_7)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(store.added_30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <h2>How quickly they answer</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Answers (30 days)</th>
                <th>Average today</th>
                <th>Average 7 days</th>
                <th>Average 30 days</th>
                <th>Middle (30 days)</th>
                <th>Slowest (30 days)</th>
                <th>Failed (30 days)</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((area) => (
                <tr key={area.area}>
                  <td>{area.name}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(area.month?.answers)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMs(area.today?.avg_ms)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMs(area.week?.avg_ms)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMs(area.month?.avg_ms)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMs(area.month?.median_ms)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtMs(area.month?.slowest_ms)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtNum(area.failed_30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderAnswersChart()}
      </div>

      <div className="admin-card">
        <h2>Newest memory</h2>
        {recent.length === 0 ? (
          <p className="admin-muted">Nothing saved yet. The Assistant saves a note when you tell it something worth remembering; Ask Tera saves an answer when staff approve one.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Kind</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.at + item.text + item.source}>
                    <td>{fmtDate(item.at)}</td>
                    <td>{item.kind}</td>
                    <td>{item.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}