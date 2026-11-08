'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/adminFormat';

export default function AdminAiActivity() {
  const [days, setDays] = useState(1);
  const [area, setArea] = useState('');
  const [provider, setProvider] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setBusy(true);
      setError('');
      try {
        const response = await fetch(`/api/admin/ai-activity?days=${encodeURIComponent(days)}&area=${encodeURIComponent(area)}&provider=${encodeURIComponent(provider)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to load the AI activity.');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    }

    fetchData();
  }, [days, area, provider]);

  if (busy && !data) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="form-error" role="alert">{error}</p>;
  }

  const totals = data?.totals || {};
  
  // Helper to format numbers
  function formatNumber(num) {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  }

  // Helper to format percentage
  function formatPercentage(num) {
    if (num === null || num === undefined) return '-';
    return `${(num * 100).toFixed(1)}%`;
  }

  // Helper to format milliseconds
  function formatMs(ms) {
    if (ms === null || ms === undefined) return '-';
    return `${Math.round(ms)}ms`;
  }

  // Render timeline bars
  function renderTimeline() {
    if (!data?.timeline || data.timeline.length === 0) {
      return <p className="muted">No data available.</p>;
    }

    const maxCalls = Math.max(...data.timeline.map(item => item.calls), 1);
    
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '80px', gap: '2px' }}>
        {data.timeline.map((item, index) => {
          const height = Math.max(2, (item.calls / maxCalls) * 80);
          const failedHeight = (item.failed / item.calls) * height || 0;
          const passedHeight = height - failedHeight;
          
          // Determine if we should label this bar
          let showLabel = false;
          if (data.timeline.length <= 10) {
            showLabel = true;
          } else if (data.timeline.length <= 24) {
            showLabel = index % 4 === 0;  // Every 4th bar for daily
          } else {
            showLabel = index % 5 === 0;  // Every 5th bar for hourly
          }
          
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '16px',
                  height: `${height}px`,
                  position: 'relative',
                }}
                title={`${item.label}: ${item.calls} calls, ${item.failed} failed`}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${passedHeight}px`,
                    backgroundColor: '#3b82f6',
                    position: 'absolute',
                    bottom: 0,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: `${failedHeight}px`,
                    backgroundColor: '#dc2626',
                    position: 'absolute',
                    bottom: `${passedHeight}px`,
                  }}
                />
              </div>
              {showLabel && (
                <span style={{ fontSize: '10px', color: '#6b7280' }}>{item.label}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="admin-actions">
        <button
          type="button"
          className={`btn btn-sm ${days === 1 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDays(1)}
        >
          Last 24 hours
        </button>
        <button
          type="button"
          className={`btn btn-sm ${days === 7 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDays(7)}
        >
          Last 7 days
        </button>
        <button
          type="button"
          className={`btn btn-sm ${days === 30 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDays(30)}
        >
          Last 30 days
        </button>
        
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="admin-form"
        >
          <option value="">All areas</option>
          {(data?.areas_all || []).map((areaOption) => (
            <option key={areaOption} value={areaOption}>
              {areaOption}
            </option>
          ))}
        </select>
        
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="admin-form"
        >
          <option value="">All providers</option>
          {(data?.providers_all || []).map((providerOption) => (
            <option key={providerOption} value={providerOption}>
              {providerOption}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        <h2>Totals</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-card">
            <p>Calls</p>
            <p><strong>{formatNumber(totals.calls)}</strong></p>
          </div>
          <div className="admin-card">
            <p>Worked</p>
            <p><strong>{formatPercentage(totals.ok_rate)}</strong></p>
          </div>
          <div className="admin-card">
            <p>Failed</p>
            <p><strong>{formatNumber(totals.failed)}</strong></p>
          </div>
          <div className="admin-card">
            <p>Average speed</p>
            <p><strong>{formatMs(totals.avg_latency_ms)}</strong></p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Calls over time</h2>
        {renderTimeline()}
      </div>

      {data?.providers && (
        <div className="admin-card">
          <h2>Providers</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Where</th>
                  <th>Calls</th>
                  <th>Worked</th>
                  <th>Failed</th>
                  <th>Speed</th>
                  <th>Last problem</th>
                </tr>
              </thead>
              <tbody>
                {data.providers.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.charge === 'local' ? 'Our own server' : 'Paid service'}</td>
                    <td>{formatNumber(row.calls)}</td>
                    <td>{formatPercentage(row.ok_rate)}</td>
                    <td>{formatNumber(row.failed)}</td>
                    <td>{formatMs(row.avg_latency_ms)}</td>
                    <td>{row.last_error || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.areas && (
        <div className="admin-card">
          <h2>What the calls were for</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Calls</th>
                  <th>Worked</th>
                  <th>Failed</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                {data.areas.map((row) => (
                  <tr key={row.area}>
                    <td>{row.area}</td>
                    <td>{formatNumber(row.calls)}</td>
                    <td>{formatPercentage(row.ok_rate)}</td>
                    <td>{formatNumber(row.failed)}</td>
                    <td>{formatMs(row.avg_latency_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.errors && (
        <div className="admin-card">
          <h2>Why calls failed</h2>
          {data.errors.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.errors.map((row) => (
                    <tr key={row.reason}>
                      <td>{row.reason}</td>
                      <td>{formatNumber(row.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">Nothing has failed in this period.</p>
          )}
        </div>
      )}

      {data?.newest && (
        <div className="admin-card">
          <h2>Newest calls</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Provider</th>
                  <th>What for</th>
                  <th>Model</th>
                  <th>Result</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                {data.newest.map((row) => (
                  <tr key={row.at + row.name + row.area}>
                    <td>{formatDateTime(row.at)}</td>
                    <td>{row.name}</td>
                    <td>{row.area}</td>
                    <td>{row.model || '-'}</td>
                    <td>{row.ok ? 'Worked' : row.reason}</td>
                    <td>{formatMs(row.latency_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}