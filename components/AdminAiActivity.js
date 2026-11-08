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
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [days, area, provider]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, days, area, provider]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

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
    return `${num.toFixed(1)}%`;
  }

  // Helper to format milliseconds
  function formatMs(ms) {
    if (ms === null || ms === undefined) return '-';
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${Math.round(ms)}ms`;
  }

  // Render timeline bars
  function renderTimeline() {
    if (!data?.timeline || data.timeline.length === 0) {
      return <p className="muted">No data available.</p>;
    }

    const maxCalls = Math.max(...data.timeline.map(item => item.calls), 1);
    
    // Determine chart title based on period
    const chartTitle = days === 1 ? 'Calls per hour, last 24 hours' : `Calls per day, last ${days} days`;
    
    return (
      <div>
        <h2>{chartTitle}</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '2px' }}>
          {data.timeline.map((item, index) => {
            const height = Math.max(2, (item.calls / maxCalls) * 200);
            const failedHeight = (item.failed / item.calls) * height || 0;
            const passedHeight = height - failedHeight;
            
            // Determine if we should label this bar
            let showLabel = false;
            if (data.timeline.length <= 10) {
              showLabel = true;
            } else if (data.timeline.length <= 24) {
              showLabel = index % 4 === 0;  // Every 4th bar for daily
            } else {
              showLabel = index % 3 === 0;  // Every 3rd bar for hourly
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
                      backgroundColor: '#6b7280',
                      position: 'absolute',
                      bottom: 0,
                    }}
                  />
                  <div
                    style={{
                      width: '100%',
                      height: `${failedHeight}px`,
                      backgroundColor: '#ef4444',
                      position: 'absolute',
                      bottom: `${passedHeight}px`,
                    }}
                  />
                </div>
                {showLabel && (
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{item.label}</span>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#6b7280' }}>Grey: answered. Red: failed. Times are Melbourne time.</p>
      </div>
    );
  }

  // Get provider with most failures
  function getMostFailedProvider() {
    if (!data?.providers) return null;
    return data.providers.reduce((max, provider) => provider.failed > max.failed ? provider : max, { failed: 0 });
  }

  const mostFailedProvider = getMostFailedProvider();
  
  // Format summary text
  function formatSummary() {
    if (!data?.failures || data.failures.length === 0) return null;
    
    const providerName = mostFailedProvider?.name || 'Unknown';
    const failedCount = mostFailedProvider?.failed || 0;
    const timePeriod = days === 1 ? '24 hours' : `${days} days`;
    
    let summaryText = `${providerName} failed ${failedCount} times in the last ${timePeriod}: ${mostFailedProvider.last_error}`;
    
    // Add other failures if there are more than one
    const otherFailures = data.failures.filter(f => f.provider !== providerName);
    if (otherFailures.length > 0) {
      summaryText += `; ${otherFailures.length} other failures.`;
    }
    
    return summaryText;
  }

  const summaryText = formatSummary();

  return (
    <div>
      <div className="admin-actions">
        <button
          type="button"
          style={{
            backgroundColor: days === 1 ? '#ef4444' : '',
            color: days === 1 ? 'white' : '',
            border: days === 1 ? '' : '1px solid #374151',
          }}
          className="btn btn-sm"
          onClick={() => setDays(1)}
        >
          Today
        </button>
        <button
          type="button"
          style={{
            backgroundColor: days === 7 ? '#ef4444' : '',
            color: days === 7 ? 'white' : '',
            border: days === 7 ? '' : '1px solid #374151',
          }}
          className="btn btn-sm"
          onClick={() => setDays(7)}
        >
          7 days
        </button>
        <button
          type="button"
          style={{
            backgroundColor: days === 30 ? '#ef4444' : '',
            color: days === 30 ? 'white' : '',
            border: days === 30 ? '' : '1px solid #374151',
          }}
          className="btn btn-sm"
          onClick={() => setDays(30)}
        >
          30 days
        </button>
        
        <label style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Refresh every 30 s
        </label>
        
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchData}
          style={{ marginLeft: '1rem' }}
        >
          Refresh
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

      {summaryText && (
        <div style={{
          border: '1px solid #f59e0b',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '1rem',
          color: '#f59e0b',
        }}>
          {summaryText}
        </div>
      )}

      <div className="admin-card">
        <h2>Totals</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Calls</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{formatNumber(totals.calls)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Success rate</p>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: totals.ok_rate >= 95 ? '#22c55e' : totals.ok_rate >= 70 ? '#f59e0b' : '#ef4444'
            }}>
              <strong>{formatPercentage(totals.ok_rate)}</strong>
            </p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Failed</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{formatNumber(totals.failed)}</strong></p>
          </div>
          <div className="admin-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Average wait</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}><strong>{formatMs(totals.avg_latency_ms)}</strong></p>
          </div>
        </div>
      </div>

      <div className="admin-card">
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
          <h2>What failed</h2>
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