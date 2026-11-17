'use client';

import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, DollarSign, Receipt, ShoppingCart, TrendingUp, Users } from 'lucide-react';

import { formatDateTime } from '@/lib/adminFormat';
import { dollars } from '@/lib/salesView';

// The one-screen snapshot at the top of Sales (Robert, 18 November 2026: "a quick view ... and then we can click on
// each one of those to bring up the real data"). Every panel opens its full detail section further down the page
// (openDetail). Figures come from the same /staff/sales/summary the details use, so the two never disagree.

function shortDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

// The change against the comparison period, as money or a count AND a percentage: with few orders a percentage
// alone exaggerates ("+50%" can be one more sale). goodUp=false for things that are better when they fall.
function Change({ now, before, money, goodUp = true }) {
  if (before === null || before === undefined) return <span className="snap-change is-muted">No comparison</span>;
  const diff = (now || 0) - before;
  if (diff === 0) return <span className="snap-change is-muted">Same as before</span>;
  const good = goodUp ? diff > 0 : diff < 0;
  const Icon = diff > 0 ? ArrowUpRight : ArrowDownRight;
  const amount = money ? dollars(Math.abs(diff)) : Math.abs(diff).toLocaleString('en-AU');
  const pct = before ? ` (${diff > 0 ? '+' : '-'}${Math.abs((diff / before) * 100).toFixed(0)}%)` : '';
  return (
    <span className={good ? 'snap-change is-good' : 'snap-change is-bad'}>
      <Icon size={14} aria-hidden="true" /> {diff > 0 ? '+' : '-'}{amount}{pct}
    </span>
  );
}

function Panel({ title, icon: Icon, detail, onOpen, className = '', children }) {
  return (
    <section className={`snap-panel ${className}`}>
      <div className="snap-panel-head">
        <h3>{Icon ? <Icon size={16} aria-hidden="true" /> : null}{title}</h3>
        {detail ? (
          <button type="button" className="snap-more" onClick={() => onOpen(detail)}>
            Details <ArrowRight size={13} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Trend({ series, prior }) {
  const [hover, setHover] = useState(null);
  const w = 560;
  const h = 190;
  const pad = { top: 12, right: 10, bottom: 24, left: 52 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const now = series.map((p) => p.revenue_inc_cents / 100);
  const before = (prior || []).slice(0, series.length).map((p) => p.revenue_inc_cents / 100);
  const max = Math.max(1, ...now, ...before);
  const x = (i) => pad.left + (series.length > 1 ? (i / (series.length - 1)) * iw : iw / 2);
  const y = (v) => pad.top + ih - (v / max) * ih;
  const path = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${path(now)} L${x(now.length - 1).toFixed(1)},${pad.top + ih} L${x(0).toFixed(1)},${pad.top + ih} Z`;
  const ticks = [0, 0.5, 1].map((f) => max * f);
  const every = Math.max(1, Math.ceil(series.length / 6));
  return (
    <div className="snap-chart">
      <div className="snap-legend">
        <span><i className="snap-key is-now" /> This period</span>
        {before.length ? <span><i className="snap-key is-before" /> Period before</span> : null}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Sales including GST per day, this period and the period before"
        onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="snapFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={w - pad.right} y1={y(t)} y2={y(t)} className="snap-grid" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="snap-axis">${Math.round(t).toLocaleString('en-AU')}</text>
          </g>
        ))}
        {before.length ? <path d={path(before)} className="snap-line-before" /> : null}
        <path d={area} fill="url(#snapFill)" />
        <path d={path(now)} className="snap-line-now" />
        {series.map((p, i) => (i % every === 0 ? (
          <text key={p.bucket} x={x(i)} y={h - 6} textAnchor="middle" className="snap-axis">{shortDate(p.bucket)}</text>
        ) : null))}
        {series.map((p, i) => (
          <rect key={`h${p.bucket}`} x={x(i) - iw / Math.max(1, series.length) / 2} y={pad.top} width={iw / Math.max(1, series.length)}
            height={ih} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + ih} className="snap-cross" />
            <circle cx={x(hover)} cy={y(now[hover])} r="4" className="snap-dot" />
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <p className="snap-tip" role="status">
          {shortDate(series[hover].bucket)}: <strong>{dollars(series[hover].revenue_inc_cents)}</strong>
          {before[hover] !== undefined ? <> · period before {dollars(Math.round(before[hover] * 100))}</> : null}
        </p>
      ) : <p className="snap-tip admin-muted">Point at the chart for a day&apos;s figure.</p>}
    </div>
  );
}

function OrderBars({ series }) {
  const [hover, setHover] = useState(null);
  const w = 360;
  const h = 190;
  const pad = { top: 12, right: 6, bottom: 24, left: 28 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const max = Math.max(1, ...series.map((p) => p.orders));
  const step = iw / Math.max(1, series.length);
  const bw = Math.max(2, Math.min(14, step * 0.65));
  const every = Math.max(1, Math.ceil(series.length / 5));
  return (
    <div className="snap-chart">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Orders per day" onMouseLeave={() => setHover(null)}>
        {[0, max].map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={w - pad.right} y1={pad.top + ih - (t / max) * ih} y2={pad.top + ih - (t / max) * ih} className="snap-grid" />
            <text x={pad.left - 6} y={pad.top + ih - (t / max) * ih + 4} textAnchor="end" className="snap-axis">{t}</text>
          </g>
        ))}
        {series.map((p, i) => {
          const bh = (p.orders / max) * ih;
          const cx = pad.left + step * i + step / 2;
          return (
            <g key={p.bucket} onMouseEnter={() => setHover(i)}>
              <rect x={pad.left + step * i} y={pad.top} width={step} height={ih} fill="transparent" />
              {p.orders ? <rect x={cx - bw / 2} y={pad.top + ih - bh} width={bw} height={bh} rx="3" className={hover === i ? 'snap-bar is-hover' : 'snap-bar'} /> : null}
              {i % every === 0 ? <text x={cx} y={h - 6} textAnchor="middle" className="snap-axis">{shortDate(p.bucket)}</text> : null}
            </g>
          );
        })}
      </svg>
      {hover !== null ? (
        <p className="snap-tip" role="status">{shortDate(series[hover].bucket)}: <strong>{series[hover].orders}</strong> order{series[hover].orders === 1 ? '' : 's'}</p>
      ) : <p className="snap-tip admin-muted">Point at a bar for the day.</p>}
    </div>
  );
}

function Ranking({ rows, value, label, empty }) {
  if (!rows || !rows.length) return <p className="admin-muted snap-empty">{empty}</p>;
  const top = rows.slice(0, 5);
  const max = Math.max(1, ...top.map(value));
  return (
    <ol className="snap-rank">
      {top.map((row) => (
        <li key={row.label}>
          <span className="snap-rank-label" title={row.label}>{row.label}</span>
          <span className="snap-rank-bar"><i style={{ width: `${Math.max(4, (value(row) / max) * 100)}%` }} /></span>
          <span className="snap-rank-value">{label(row)}</span>
        </li>
      ))}
    </ol>
  );
}

export default function AdminSalesSnapshot({ summary, orders, openDetail }) {
  const [carts, setCarts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/sales/carts?days=30', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (!cancelled) setCarts(body); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const k = summary.kpis || {};
  const p = summary.prior_kpis || null;
  const series = summary.series || [];
  const recent = (orders.orders || []).slice(0, 5);
  const newOrders = k.new_customer_orders || 0;
  const returning = k.returning_customer_orders || 0;
  const customerTotal = newOrders + returning;
  const cards = [
    { key: 'revenue_inc_cents', label: 'Sales (inc GST)', icon: DollarSign, value: dollars(k.revenue_inc_cents), money: true, detail: 'sales-figures' },
    { key: 'revenue_ex_cents', label: 'Sales (ex GST)', icon: Receipt, value: dollars(k.revenue_ex_cents), money: true, detail: 'sales-figures',
      note: k.margin_percent !== null && k.margin_percent !== undefined ? `Margin ${dollars(k.margin_cents)} (${k.margin_percent}%)` : null },
    { key: 'orders', label: 'Orders', icon: ShoppingCart, value: (k.orders || 0).toLocaleString('en-AU'), detail: 'sales-orders',
      note: `${(k.units || 0).toLocaleString('en-AU')} items sold` },
    { key: 'aov_cents', label: 'Average order', icon: BarChart3, value: dollars(k.aov_cents), money: true, detail: 'sales-figures' },
  ];

  return (
    <div className="snap">
      <div className="snap-kpis">
        {cards.map((c) => (
          <button key={c.key} type="button" className="snap-kpi" onClick={() => openDetail(c.detail)}>
            <span className="snap-kpi-icon"><c.icon size={20} aria-hidden="true" /></span>
            <span className="snap-kpi-body">
              <span className="snap-kpi-label">{c.label}</span>
              <strong className="snap-kpi-value">{c.value}</strong>
              <Change now={k[c.key]} before={p ? p[c.key] : null} money={c.money} />
              {c.note ? <span className="snap-kpi-note">{c.note}</span> : null}
            </span>
          </button>
        ))}
      </div>

      <div className="snap-row snap-row-charts">
        <Panel title="Sales trend (inc GST)" icon={TrendingUp} detail="sales-figures" onOpen={openDetail} className="is-wide">
          {series.length ? <Trend series={series} prior={summary.prior_series} /> : <p className="admin-muted snap-empty">No sales in this period yet.</p>}
        </Panel>
        <Panel title={`Orders per ${summary.period?.bucket === 'week' ? 'week' : 'day'}`} icon={ShoppingCart} detail="sales-orders" onOpen={openDetail}>
          {series.length ? <OrderBars series={series} /> : <p className="admin-muted snap-empty">No orders in this period yet.</p>}
        </Panel>
      </div>

      <div className="snap-row snap-row-three">
        <Panel title="Customers" icon={Users} detail="sales-breakdowns" onOpen={openDetail}>
          {customerTotal ? (
            <div className="snap-split">
              <div className="snap-split-bar" aria-hidden="true">
                <i className="is-new" style={{ width: `${(newOrders / customerTotal) * 100}%` }} />
                <i className="is-returning" style={{ width: `${(returning / customerTotal) * 100}%` }} />
              </div>
              <dl>
                <div><dt><i className="snap-key is-now" /> New customers</dt><dd>{newOrders} <span>({Math.round((newOrders / customerTotal) * 100)}%)</span></dd></div>
                <div><dt><i className="snap-key is-before" /> Returning customers</dt><dd>{returning} <span>({Math.round((returning / customerTotal) * 100)}%)</span></dd></div>
              </dl>
              <p className="admin-muted">Orders in the period, by whether the buyer had ordered before.</p>
            </div>
          ) : <p className="admin-muted snap-empty">No orders in this period yet.</p>}
        </Panel>
        <Panel title="Top products" icon={BarChart3} detail="sales-breakdowns" onOpen={openDetail}>
          <Ranking rows={summary.top?.product} value={(r) => r.revenue_ex_cents || 0} label={(r) => dollars(r.revenue_ex_cents)} empty="No products sold in this period yet." />
        </Panel>
        <Panel title="Carts and checkouts" icon={ShoppingCart} detail="sales-carts" onOpen={openDetail}>
          {carts ? (
            <div className="snap-tiles">
              <div><strong>{carts.counts?.abandoned ?? 0}</strong><span>Abandoned carts</span></div>
              <div><strong>{dollars(carts.abandoned_value_cents ?? 0)}</strong><span>Left in carts</span></div>
              <div><strong>{carts.checkouts?.expired ?? 0}</strong><span>Expired checkouts</span></div>
              <div><strong>{carts.checkouts?.failed ?? 0}</strong><span>Failed payments</span></div>
              {carts.settings && (!carts.settings.carts || !carts.settings.checkouts) ? (
                <p className="admin-muted">Recording is off for {!carts.settings.carts && !carts.settings.checkouts ? 'carts and checkouts' : !carts.settings.carts ? 'carts' : 'checkouts'}; turn it on under Details.</p>
              ) : null}
            </div>
          ) : <p className="admin-muted snap-empty">Loading…</p>}
        </Panel>
      </div>

      <Panel title="Recent orders" icon={Receipt} detail="sales-orders" onOpen={openDetail} className="snap-recent">
        {recent.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-compact">
              <thead><tr><th>Date</th><th>Customer</th><th>State</th><th>Items</th><th>Total (inc GST)</th></tr></thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}><td>{formatDateTime(o.created_at)}</td><td>{o.name}</td><td>{o.state}</td><td>{o.units}</td><td>{dollars(o.total_cents)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="admin-muted snap-empty">No orders in this period yet.</p>}
      </Panel>
    </div>
  );
}
