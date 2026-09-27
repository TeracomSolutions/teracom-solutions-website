'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Globe, RefreshCw } from 'lucide-react';

import { formatDateTime } from '@/lib/adminFormat';
import { internetSentence, moveInList, orderList, providerState, ringLayout, stateLabel } from '@/lib/aiRouting';

// The picture of where the website's AI traffic goes: the site in the middle,
// each connected provider around it coloured by how it is doing, the lines
// showing who is first in line and who last did the Assistant, the research
// and the critique, and the internet Scout searches through. Under it the
// order staff can change, and the last seven days of work per provider.
const COLOURS = { healthy: '#4ade80', failing: '#ff4b4b', off: '#6b7280', unknown: '#fbbf24' };
const W = 760;
const H = 480;
const CX = 300;
const CY = 240;
const RING = 150;
const NET = { x: 660, y: 240 };

function shorten(text, max = 26) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function plainKind(kind) {
  return { credit: 'out of credit', auth: 'key rejected', rate_limit: 'rate limited', unreachable: 'not reachable', model: 'model not available', error: 'last call failed' }[kind] || kind;
}

export default function AdminAiRouting({ initialRouting }) {
  const [routing, setRouting] = useState(initialRouting);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [checkResult, setCheckResult] = useState({});

  async function load() {
    const res = await fetch('/api/admin/ai-connections/routing');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Unable to load the routing.');
    setRouting(data);
  }

  useEffect(() => {
    const timer = setInterval(() => { load().catch(() => {}); }, 60000);
    return () => clearInterval(timer);
  }, []);

  async function refresh() {
    setBusy('refresh');
    setError('');
    try { await load(); } catch (err) { setError(err.message); } finally { setBusy(''); }
  }

  async function reorder(key, direction) {
    const current = orderList(routing);
    const next = moveInList(current, key, direction);
    if (next === current) return;
    setBusy(`order:${key}`);
    setError('');
    try {
      const res = await fetch('/api/admin/ai-connections/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to change the order.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function checkNow(key) {
    setBusy(`check:${key}`);
    setError('');
    try {
      const res = await fetch(`/api/admin/ai-connections/${encodeURIComponent(key)}/check`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The check could not run.');
      setCheckResult((current) => ({ ...current, [key]: data.ok ? `Responding in ${data.latency_ms} ms${data.detail ? ` (${data.detail})` : ''}` : `Failed: ${data.error || data.detail || 'no answer'}` }));
      await load();
    } catch (err) {
      setCheckResult((current) => ({ ...current, [key]: `Failed: ${err.message}` }));
    } finally {
      setBusy('');
    }
  }

  async function toggleInternet() {
    const on = Boolean(routing?.internet?.enabled);
    setBusy('internet');
    setError('');
    try {
      const res = await fetch('/api/admin/ai-connections/internet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !on }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to switch the Internet.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  const providers = routing?.providers || {};
  const assistantOrder = routing?.assistant_order || [];
  const order = orderList(routing);
  const internet = routing?.internet || null;
  const internetOn = Boolean(internet?.enabled);
  const internetMode = internet ? internet.mode : null;
  const researchOrder = routing?.research_order || [];
  const lastUsed = routing?.last_used || {};
  const shown = Object.entries(providers).filter(([key, info]) => info.configured !== false && key !== 'internet').map(([key, info]) => ({ key, ...info }));
  const positions = ringLayout(shown.length, CX, CY, RING);

  function rolesFor(key) {
    const roles = [];
    if (assistantOrder[0] === key) roles.push('Assistant');
    if (researchOrder[0] === key) roles.push('Research');
    if (lastUsed.critique === key) roles.push('Critique');
    if (!roles.length) {
      if (lastUsed.assistant === key) roles.push('last Assistant');
      if (lastUsed.research === key) roles.push('last Research');
    }
    return roles;
  }

  return (
    <div className="admin-ai-routing">
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-ai-map">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How the website routes its AI traffic">
          <defs>
            <marker id="ai-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#c084fc" />
            </marker>
          </defs>

          {shown.map((p, i) => {
            const pos = positions[i];
            const roles = rolesFor(p.key);
            const first = assistantOrder[0] === p.key || researchOrder[0] === p.key;
            const mx = (CX + pos.x) / 2;
            const my = (CY + pos.y) / 2;
            return (
              <g key={`line-${p.key}`}>
                <line x1={CX} y1={CY} x2={pos.x} y2={pos.y} stroke={first ? '#ffffff' : 'rgba(255,255,255,.28)'} strokeWidth={first ? 2.5 : 1.2} />
                {roles.length > 0 && (
                  <text x={mx} y={my - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill={first ? '#ffffff' : 'rgba(255,255,255,.7)'}>
                    {roles.join(' · ')}
                  </text>
                )}
              </g>
            );
          })}

          <line x1={CX + 62} y1={CY - 6} x2={NET.x - 46} y2={NET.y - 6} stroke="#c084fc" strokeWidth={internetMode === 'web_first' ? 2.5 : 1.5} strokeOpacity={internetMode === 'off' ? 0.3 : 1} strokeDasharray="6 5" markerEnd="url(#ai-arrow)" />
          <text x={(CX + NET.x) / 2} y={CY - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#c084fc" fillOpacity={internetMode === 'off' ? 0.5 : 1}>{internetMode === 'model_first' ? 'Research: web as the fallback' : internetMode === 'off' ? 'Web search switched off' : 'Research: web search first (DuckDuckGo)'}</text>
          <path d={`M ${NET.x - 46} ${NET.y + 10} Q ${(CX + NET.x) / 2} ${CY + 70} ${CX + 62} ${CY + 10}`} fill="none" stroke="#c084fc" strokeWidth="1.5" markerEnd="url(#ai-arrow)" />
          <text x={(CX + NET.x) / 2} y={CY + 56} textAnchor="middle" fontSize="11" fill="#c084fc">results verified by the critique model</text>

          <g>
            <title>{internetSentence(internetMode) || 'Web search for Scout research'}</title>
            <rect x={NET.x - 44} y={NET.y - 26} width="88" height="52" rx="12" fill={internetMode === 'off' ? 'rgba(107,114,128,.15)' : 'rgba(192,132,252,.12)'} stroke={internetMode === 'off' ? COLOURS.off : '#c084fc'} strokeWidth="1.5" />
            <text x={NET.x} y={NET.y - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">Internet</text>
            <text x={NET.x} y={NET.y + 13} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,.7)">{internetMode === 'model_first' ? 'fallback for Scout' : internetMode === 'off' ? 'switched off' : 'sources for Scout'}</text>
          </g>

          <g>
            <rect x={CX - 62} y={CY - 32} width="124" height="64" rx="14" fill="rgba(255,23,23,.14)" stroke="#ff4b4b" strokeWidth="1.5" />
            <text x={CX} y={CY - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">Teracom website</text>
            <text x={CX} y={CY + 9} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,.75)">Assistant · Scout</text>
            <text x={CX} y={CY + 22} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.55)">VM 101 backend</text>
          </g>

          {shown.map((p, i) => {
            const pos = positions[i];
            const state = providerState(p);
            const colour = COLOURS[state];
            const above = pos.y < CY;
            return (
              <g key={`node-${p.key}`}>
                <title>{`${p.label}: ${stateLabel(state, p)}${p.last_error ? ` (${p.last_error})` : ''}`}</title>
                <circle cx={pos.x} cy={pos.y} r="20" fill={colour} fillOpacity={state === 'unknown' ? 0.55 : 0.9} stroke={colour} strokeWidth="2" />
                <text x={pos.x} y={above ? pos.y - 30 : pos.y + 38} textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">{p.label}</text>
                <text x={pos.x} y={above ? pos.y - 46 : pos.y + 52} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,.65)">{shorten(p.model)}</text>
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#111">{state === 'healthy' ? 'OK' : state === 'failing' ? '!' : state === 'off' ? 'off' : '?'}</text>
              </g>
            );
          })}

          {shown.length === 0 && (
            <text x={CX} y={CY + 80} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,.7)">No providers connected yet.</text>
          )}
        </svg>
      </div>

      <div className="admin-ai-legend">
        <span><span className="admin-ai-dot" style={{ background: COLOURS.healthy }} />Responding</span>
        <span><span className="admin-ai-dot" style={{ background: COLOURS.failing }} />Failing</span>
        <span><span className="admin-ai-dot" style={{ background: COLOURS.off }} />Disabled</span>
        <span><span className="admin-ai-dot" style={{ background: COLOURS.unknown }} />Not used yet</span>
        <span>A provider that fails is skipped for that request and tried again on the next one; nothing needs to be reset.</span>
      </div>

      <div className="admin-card">
        <h3>Order of preference</h3>
        <p className="admin-muted">One order applies to the Assistant and to Scout; the Assistant skips the Internet. Scout always critiques with a different provider from the one that researched.</p>
        <ol className="admin-ai-order">
          {order.map((key, index) => {
            const isInternet = key === 'internet';
            const info = providers[key] || { label: isInternet ? 'Internet (web search)' : key };
            const state = isInternet ? (internetOn ? 'healthy' : 'off') : providerState(info);
            return (
              <li key={key} className={isInternet && !internetOn ? 'admin-ai-off' : undefined}>
                {isInternet ? (
                  <Globe size={16} strokeWidth={2} aria-hidden="true" style={{ color: internetOn ? '#c084fc' : COLOURS.off, flex: '0 0 auto' }} />
                ) : (
                  <span className="admin-ai-dot" style={{ background: COLOURS[state] }} />
                )}
                <strong>{index + 1}. {info.label}</strong>
                <span className="admin-muted">{isInternet ? (internetOn ? 'DuckDuckGo, sources for Scout research' : 'switched off') : shorten(info.model, 40)}</span>
                <span className="admin-actions" style={{ marginLeft: 'auto' }}>
                  {isInternet && (
                    <>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={toggleInternet} disabled={Boolean(busy)}>{busy === 'internet' ? 'Saving…' : internetOn ? 'Switch off' : 'Switch on'}</button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => checkNow('internet')} disabled={Boolean(busy)}>{busy === 'check:internet' ? 'Checking…' : 'Check now'}</button>
                    </>
                  )}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => reorder(key, -1)} disabled={index === 0 || Boolean(busy)} aria-label={`Move ${info.label} up`}><ArrowUp size={14} strokeWidth={2} aria-hidden="true" /></button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => reorder(key, 1)} disabled={index === order.length - 1 || Boolean(busy)} aria-label={`Move ${info.label} down`}><ArrowDown size={14} strokeWidth={2} aria-hidden="true" /></button>
                </span>
              </li>
            );
          })}
        </ol>
        {order.length === 0 && <p className="admin-muted">No enabled providers.</p>}
        {internet && (
          <p className="admin-muted">
            {internetSentence(internetMode)}
            {checkResult.internet ? ` Last check: ${checkResult.internet}.` : ''}
          </p>
        )}
        <p className="admin-muted">Assistant will try: {assistantOrder.map((k) => providers[k]?.label || k).join(' → ') || '—'}. Scout research will try: {researchOrder.map((k) => providers[k]?.label || k).join(' → ') || '—'}.</p>
      </div>

      <div className="admin-card">
        <h3>Who did the work in the last 7 days</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>State</th>
                <th>Assistant</th>
                <th>Research</th>
                <th>Critique</th>
                <th>Average response</th>
                <th>Last problem</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && <tr><td colSpan={8} className="admin-muted">No providers connected yet.</td></tr>}
              {shown.map((p) => {
                const state = providerState(p);
                const c = p.counts || {};
                const cell = (k) => `${c[k]?.ok || 0} ok / ${c[k]?.failed || 0} failed`;
                return (
                  <tr key={p.key}>
                    <td><span className="admin-ai-dot" style={{ background: COLOURS[state] }} />{p.label}</td>
                    <td className="wrap">{stateLabel(state, p)}</td>
                    <td>{cell('assistant')}</td>
                    <td>{cell('research')}</td>
                    <td>{cell('critique')}</td>
                    <td>{p.avg_latency_ms ? `${(p.avg_latency_ms / 1000).toFixed(1)} s` : '—'}</td>
                    <td className="wrap">
                      {p.last_failed_at ? (
                        <span title={p.last_error || ''}>{plainKind(p.last_error_kind)} · {formatDateTime(p.last_failed_at)}</span>
                      ) : '—'}
                    </td>
                    <td>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => checkNow(p.key)} disabled={Boolean(busy)}>
                        {busy === `check:${p.key}` ? 'Checking…' : 'Check now'}
                      </button>
                      {checkResult[p.key] && <span className="admin-muted" style={{ display: 'block', fontSize: '12px', marginTop: '4px', maxWidth: '28ch', overflowWrap: 'anywhere' }}>{checkResult[p.key]}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={refresh} disabled={Boolean(busy)}>
            <RefreshCw size={14} strokeWidth={2} aria-hidden="true" /> {busy === 'refresh' ? 'Refreshing…' : 'Refresh'}
          </button>
          <span className="admin-muted">Refreshes itself every minute while this page is open.</span>
        </div>
      </div>
    </div>
  );
}
