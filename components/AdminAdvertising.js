'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AdminTabs from '@/components/AdminTabs';
import {
  ACTION_TEXT, MODE_TEXT, actionsFor, campaignPayload, centsToDollars, charsLeft, dollarsToCents, emptyCampaign,
  formFromCampaign, money, ratio, statusText, statusTone,
} from '@/lib/advertisingView';

// Admin -> Advertising: make ads, send them to the platform switched off, put them live by hand inside
// the monthly limits, and watch spend and sales (api/staff_advertising.py).
async function call(path, method = 'GET', body) {
  const response = await fetch('/api/admin/advertising' + (path ? '/' + path : ''), {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'That did not work. Try again.');
  return data;
}

function Counter({ text, limit }) {
  const left = charsLeft(text, limit);
  if (left === null) return null;
  return <span className={left < 0 ? 'ads-count is-over' : 'ads-count'}>{left} left</span>;
}

function ProductPicker({ chosen, onChange }) {
  const [q, setQ] = useState('');
  const [found, setFound] = useState([]);
  const [rows, setRows] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!chosen.length) { setRows([]); return; }
    let stop = false;
    fetch('/api/admin/advertising/products?ids=' + encodeURIComponent(chosen.join(',')))
      .then((r) => r.json()).then((data) => { if (!stop) setRows(data.products || []); }).catch(() => {});
    return () => { stop = true; };
  }, [chosen]);

  async function search(event) {
    event.preventDefault();
    setSearching(true);
    try {
      const data = await call('products?q=' + encodeURIComponent(q));
      setFound(data.products || []);
    } catch {
      setFound([]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="ads-picker">
      <div className="ads-picker-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products on the website by name, SKU or brand"
          onKeyDown={(e) => { if (e.key === 'Enter') search(e); }} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={search} disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
      </div>
      {found.length ? (
        <ul className="ads-product-list">
          {found.map((p) => (
            <li key={p.id}>
              <span><strong>{p.name}</strong> <span className="admin-muted">{p.sku} · {money(p.price_cents)} · {p.stock > 0 ? p.stock + ' in stock' : 'none in stock'}</span></span>
              <button type="button" className="btn btn-secondary btn-sm" disabled={chosen.includes(p.id)}
                onClick={() => onChange([...chosen, p.id])}>{chosen.includes(p.id) ? 'Added' : 'Add'}</button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="admin-muted">{chosen.length ? chosen.length + ' product' + (chosen.length === 1 ? '' : 's') + ' in this ad:' : 'No products chosen yet.'}</p>
      {rows.length ? (
        <ul className="ads-product-list">
          {rows.map((p) => (
            <li key={p.id}>
              <span><strong>{p.name}</strong> <span className="admin-muted">{p.sku} · {money(p.price_cents)}{p.live_on_site ? '' : ' · not on the website'}</span></span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange(chosen.filter((id) => id !== p.id))}>Remove</button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CampaignForm({ initial, platforms, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial);
  const info = platforms.find((p) => p.name === form.platform) || {};
  const limits = info.limits || {};
  const set = (name) => (event) => setForm({ ...form, [name]: event.target.value });
  const setOption = (name) => (event) => setForm({ ...form, options: { ...form.options, [name]: event.target.value } });
  const choices = platforms.filter((p) => p.method === 'manual' || p.can_create);

  return (
    <form className="admin-form ads-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <label>Platform
        <select value={form.platform} onChange={set('platform')}>
          {choices.map((p) => <option key={p.name} value={p.name}>{p.label}{p.method === 'manual' ? ' (record spend by hand)' : p.connected ? '' : ' (keys not added yet)'}</option>)}
        </select>
      </label>
      <p className="admin-muted">{info.note}</p>
      <label>Campaign name<input value={form.name} onChange={set('name')} maxLength={200} required placeholder="Synology NAS, November" /></label>
      <div>
        <strong className="ads-label">Products to advertise</strong>
        <ProductPicker chosen={form.product_ids} onChange={(ids) => setForm({ ...form, product_ids: ids })} />
        {form.platform === 'google_ads' ? <p className="admin-muted">Google Shopping shows these products from the shopping feed; with none chosen it shows every product in the feed.</p> : null}
      </div>
      {limits.headline ? (
        <label>Headline <Counter text={form.headline} limit={limits.headline} />
          <input value={form.headline} onChange={set('headline')} maxLength={limits.headline} />
        </label>
      ) : null}
      {limits.body ? (
        <label>Main text <Counter text={form.body} limit={limits.body} />
          <textarea value={form.body} onChange={set('body')} rows={4} maxLength={limits.body} />
        </label>
      ) : null}
      {limits.description ? (
        <label>Description <Counter text={form.description} limit={limits.description} />
          <input value={form.description} onChange={set('description')} maxLength={limits.description} />
        </label>
      ) : null}
      {limits.headline || limits.body ? <p className="admin-muted">Save, then press Write the text to have the AI write it from the products; change anything before sending.</p> : null}
      {form.platform !== 'google_ads' && form.platform !== 'ebay' ? (
        <>
          <label>Link (blank: the product&apos;s page, or the store for several products)<input value={form.link_url} onChange={set('link_url')} maxLength={1000} placeholder="https://www.teracomsolutions.com.au/..." /></label>
          <label>Picture (blank: the first product&apos;s photo)<input value={form.image_url} onChange={set('image_url')} maxLength={1000} placeholder="https://..." /></label>
        </>
      ) : null}
      {form.platform !== 'ebay' ? (
        <label>Daily budget ($)<input value={form.budget} onChange={set('budget')} inputMode="decimal" placeholder="20.00" /></label>
      ) : (
        <>
          <label>eBay category ID (blank: the default on the Connections page)<input value={form.options.category_id || ''} onChange={setOption('category_id')} /></label>
          <label>Ad rate % of the sale (blank: the default; you pay it only when a promoted item sells)<input value={form.options.ad_rate || ''} onChange={setOption('ad_rate')} inputMode="decimal" /></label>
        </>
      )}
      {form.platform === 'google_ads' ? (
        <label>Most to pay for a click ($, blank: $1.00)<input value={form.options.max_cpc || ''} onChange={setOption('max_cpc')} inputMode="decimal" /></label>
      ) : null}
      <label>Last day (optional; it ends itself after this)<input type="date" value={form.ends_on || ''} onChange={set('ends_on')} /></label>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>Save draft</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

function RecordForm({ campaign, today, onSave, onCancel, busy }) {
  const [form, setForm] = useState({ day: today, spend: '', clicks: '', impressions: '', conversions: '', revenue: '' });
  const set = (name) => (event) => setForm({ ...form, [name]: event.target.value });
  function submit(event) {
    event.preventDefault();
    onSave({
      day: form.day, spend_cents: dollarsToCents(form.spend) || 0, clicks: Number(form.clicks) || 0,
      impressions: Number(form.impressions) || 0, conversions: Number(form.conversions) || 0,
      revenue_cents: dollarsToCents(form.revenue) || 0,
    });
  }
  return (
    <form className="admin-form ads-record" onSubmit={submit}>
      <p className="admin-muted">Results for {campaign.name}. A day already recorded is replaced.</p>
      <div className="ads-form-row">
        <label>Day<input type="date" value={form.day} onChange={set('day')} required /></label>
        <label>Spent ($)<input value={form.spend} onChange={set('spend')} inputMode="decimal" required /></label>
        <label>Clicks<input value={form.clicks} onChange={set('clicks')} inputMode="numeric" /></label>
      </div>
      <div className="ads-form-row">
        <label>Seen (impressions)<input value={form.impressions} onChange={set('impressions')} inputMode="numeric" /></label>
        <label>Sales<input value={form.conversions} onChange={set('conversions')} inputMode="decimal" /></label>
        <label>Sales value ($)<input value={form.revenue} onChange={set('revenue')} inputMode="decimal" /></label>
      </div>
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>Save results</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

function CampaignsTab({ data, busy, run, setNotice }) {
  const [editing, setEditing] = useState(null);
  const [recording, setRecording] = useState(null);
  const firstPlatform = (data.platforms.find((p) => p.can_create && p.connected) || data.platforms.find((p) => p.can_create) || {}).name;

  async function save(form) {
    let body;
    try {
      body = campaignPayload(form);
    } catch (err) {
      setNotice({ error: err.message });
      return;
    }
    const ok = await run(() => (editing === 'new' ? call('campaigns', 'POST', body) : call('campaigns/' + editing, 'PUT', body)), 'Draft saved.');
    if (ok) setEditing(null);
  }

  async function act(c, action) {
    if (action === 'edit') { setEditing(c.id); return; }
    if (action === 'record') { setRecording(c.id); return; }
    if (action === 'delete') {
      if (!window.confirm('Delete the draft ' + c.name + '?')) return;
      await run(() => call('campaigns/' + c.id, 'DELETE'), 'Draft deleted.');
      return;
    }
    if (action === 'write') {
      const brief = window.prompt('Anything the ad should say? (optional; the AI writes from the products)', '');
      if (brief === null) return;
      await run(() => call('campaigns/' + c.id + '/write', 'POST', { brief }), 'Text written. Read it and change anything before sending.');
      return;
    }
    if (action === 'send') {
      await run(() => call('campaigns/' + c.id + '/send', 'POST'), c.method === 'manual' ? 'Ready.' : 'Made on ' + c.platform_label + ', switched off. Check it there, then press Go live.');
      return;
    }
    if (action === 'live') {
      const budget = c.daily_budget_cents ? money(c.daily_budget_cents) + ' a day' : 'its budget';
      if (!window.confirm('Switch ' + c.name + ' on at ' + c.platform_label + '? It starts spending ' + budget + ' until it is paused.')) return;
      await run(() => call('campaigns/' + c.id + '/live', 'POST'), c.name + ' is live.');
      return;
    }
    if (action === 'budget') {
      const answer = window.prompt('New daily budget in dollars for ' + c.name, centsToDollars(c.daily_budget_cents));
      if (answer === null) return;
      const cents = dollarsToCents(answer);
      if (cents === null || Number.isNaN(cents)) { setNotice({ error: 'Type a number of dollars.' }); return; }
      await run(() => call('campaigns/' + c.id + '/budget', 'POST', { daily_budget_cents: cents }), 'Budget changed.');
      return;
    }
    if (action === 'pause') {
      await run(() => call('campaigns/' + c.id + '/pause', 'POST'), c.name + ' is paused.');
      return;
    }
    if (action === 'end') {
      if (!window.confirm('End ' + c.name + '? It is switched off and cannot be restarted from here.')) return;
      await run(() => call('campaigns/' + c.id + '/end', 'POST'), c.name + ' has ended.');
    }
  }

  async function record(c, body) {
    const ok = await run(() => call('campaigns/' + c.id + '/results', 'POST', body), 'Results saved.');
    if (ok) setRecording(null);
  }

  const editingCampaign = editing && editing !== 'new' ? data.campaigns.find((c) => c.id === editing) : null;

  return (
    <section className="admin-card">
      <div className="marketing-head">
        <h2>Campaigns</h2>
        {!editing ? <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>New campaign</button> : null}
      </div>
      {editing ? (
        <CampaignForm
          key={editing}
          initial={editingCampaign ? formFromCampaign(editingCampaign) : emptyCampaign(firstPlatform || 'meta')}
          platforms={data.platforms}
          busy={busy}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : null}
      {data.campaigns.length === 0 && !editing ? (
        <p className="admin-muted">No campaigns yet. Press New campaign, choose a platform and the products, save, write the text, then send it. It arrives on the platform switched off; Go live switches it on.</p>
      ) : null}
      {data.campaigns.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table ads-table">
            <thead>
              <tr><th>Campaign</th><th>Status</th><th>Daily budget</th><th>This month</th><th>Sales</th><th></th></tr>
            </thead>
            <tbody>
              {data.campaigns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong><br />
                    <span className="admin-muted">{c.platform_label}{c.source === 'imported' ? ' · brought in' : ''}{c.ends_on ? ' · ends ' + c.ends_on : ''}</span>
                    {c.headline ? <><br /><span className="admin-muted">“{c.headline}”</span></> : null}
                    {c.last_error ? <p className="form-error ads-row-note">{c.last_error}</p> : null}
                    {c.paused_reason && c.status !== 'live' ? <p className="admin-muted ads-row-note">{c.paused_reason}</p> : null}
                    {recording === c.id ? (
                      <RecordForm campaign={c} today={data.today} busy={busy} onSave={(body) => record(c, body)} onCancel={() => setRecording(null)} />
                    ) : null}
                  </td>
                  <td><span className={`admin-status is-${statusTone(c.status)}`}>{statusText(c.status)}</span></td>
                  <td>{c.platform === 'ebay' ? 'Per sale' : money(c.daily_budget_cents)}</td>
                  <td>{money(c.totals.spend_cents)}</td>
                  <td>{c.totals.conversions || 0}{c.totals.revenue_cents ? ' (' + money(c.totals.revenue_cents) + ')' : ''}</td>
                  <td className="admin-actions">
                    {actionsFor(c).map((action) => (
                      <button key={action} type="button" disabled={busy}
                        className={action === 'live' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        onClick={() => act(c, action)}>{ACTION_TEXT[action]}</button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function SpendChart({ daily }) {
  if (!daily.length) return null;
  const W = 760, H = 180, L = 56, B = 24;
  const top = Math.max(...daily.map((d) => d.spend_cents), 100);
  const step = (W - L) / daily.length;
  const bar = Math.max(2, Math.min(24, step - 4));
  return (
    <svg className="ads-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Spend each day">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={L} x2={W} y1={(H - B) * (1 - f) + 2} y2={(H - B) * (1 - f) + 2} className="ads-grid" />
          <text x={L - 8} y={(H - B) * (1 - f) + 6} textAnchor="end" className="ads-axis">{money(top * f).replace('.00', '')}</text>
        </g>
      ))}
      {daily.map((d, i) => {
        const h = Math.max(1, ((H - B) - 2) * (d.spend_cents / top));
        return (
          <rect key={d.day} x={L + i * step + (step - bar) / 2} y={H - B - h + 2} width={bar} height={h} rx="3" className="ads-bar">
            <title>{d.day}: {money(d.spend_cents)} spent, {money(d.revenue_cents)} in sales, {d.clicks} clicks</title>
          </rect>
        );
      })}
      <text x={L} y={H - 4} className="ads-axis">{daily[0].day}</text>
      <text x={W} y={H - 4} textAnchor="end" className="ads-axis">{daily[daily.length - 1].day}</text>
    </svg>
  );
}

function ResultsTab({ data, busy, run, reloadKey }) {
  const [days, setDays] = useState(30);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let stop = false;
    call('results?days=' + days).then((r) => { if (!stop) { setResult(r); setError(''); } }).catch((err) => { if (!stop) setError(err.message); });
    return () => { stop = true; };
  }, [days, reloadKey]);

  async function bringIn(row) {
    const answer = window.prompt('Daily budget in dollars for ' + row.name + ' (as set on ' + row.platform_label + '; blank if it has none)', '');
    if (answer === null) return;
    const cents = dollarsToCents(answer);
    if (Number.isNaN(cents)) return;
    await run(() => call('bring-in', 'POST', { platform: row.platform, external_id: row.external_id, name: row.name, daily_budget_cents: cents, live: true }),
      row.name + ' is now managed here.');
  }

  const totals = result?.totals;
  const job = data.job || {};
  return (
    <section className="admin-card">
      <div className="marketing-head">
        <h2>Spend and results</h2>
        <div className="admin-actions">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Period">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy || job.running}
            onClick={() => run(() => call('refresh', 'POST'), 'Reading the platforms now; this takes a minute.')}>{job.running ? 'Reading…' : 'Read the platforms now'}</button>
        </div>
      </div>
      <p className="admin-muted">Read from each connected platform every hour{job.last_at ? '; last read ' + new Date(job.last_at).toLocaleString('en-AU') : ''}. Sales are what each platform counts. Platforms without a connector have their results recorded by hand on the Campaigns tab.</p>
      {job.error ? <p className="form-error">Last read failed: {job.error}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {totals ? (
        <div className="ads-tiles">
          <div><span>Spent</span><strong>{money(totals.spend_cents)}</strong></div>
          <div><span>Clicks</span><strong>{totals.clicks.toLocaleString('en-AU')}</strong></div>
          <div><span>Cost a click</span><strong>{money(totals.cost_per_click_cents)}</strong></div>
          <div><span>Sales</span><strong>{totals.conversions}</strong></div>
          <div><span>Cost a sale</span><strong>{money(totals.cost_per_sale_cents)}</strong></div>
          <div><span>Sales value</span><strong>{money(totals.revenue_cents)}</strong></div>
          <div><span>Return on spend</span><strong>{ratio(totals.return)}</strong></div>
        </div>
      ) : null}
      {result ? <SpendChart daily={result.daily} /> : null}
      {result && result.platforms.length ? (
        <>
          <h3>Each platform</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Platform</th><th>Spent</th><th>Clicks</th><th>Sales</th><th>Cost a sale</th><th>Sales value</th><th>Return</th></tr></thead>
              <tbody>
                {result.platforms.map((p) => (
                  <tr key={p.platform}><td>{p.label}</td><td>{money(p.spend_cents)}</td><td>{p.clicks}</td><td>{p.conversions}</td>
                    <td>{money(p.cost_per_sale_cents)}</td><td>{money(p.revenue_cents)}</td><td>{ratio(p.return)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {result && result.campaigns.length ? (
        <>
          <h3>Each campaign</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Campaign</th><th>Spent</th><th>Clicks</th><th>Sales</th><th>Cost a sale</th><th>Return</th><th></th></tr></thead>
              <tbody>
                {result.campaigns.map((c) => (
                  <tr key={c.platform + c.external_id}>
                    <td><strong>{c.name}</strong><br /><span className="admin-muted">{c.platform_label}{c.in_console ? ' · ' + statusText(c.status) : ' · made outside the console'}</span></td>
                    <td>{money(c.spend_cents)}</td><td>{c.clicks}</td><td>{c.conversions}</td><td>{money(c.cost_per_sale_cents)}</td><td>{ratio(c.return)}</td>
                    <td>{!c.in_console && (data.platforms.find((p) => p.name === c.platform) || {}).can_manage ? (
                      <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => bringIn(c)}>Bring in</button>
                    ) : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="admin-muted">Bring in a campaign made in a platform&apos;s own ads manager to pause it, change its budget and have the limits watch it from here.</p>
        </>
      ) : result ? <p className="admin-muted">No spend recorded in this period.</p> : null}
    </section>
  );
}

function PlatformsTab({ data, busy, run }) {
  const [tested, setTested] = useState({});
  async function test(p) {
    const ok = await run(async () => {
      const result = await call('test/' + p.name, 'POST');
      setTested((t) => ({ ...t, [p.name]: result }));
      return result;
    }, null);
    return ok;
  }
  return (
    <section className="ads-platforms">
      {data.platforms.map((p) => {
        const can = p.method === 'manual'
          ? ['Spend recorded by hand']
          : [p.can_create ? 'Makes ads from products' : 'Ads made in its own ads manager', p.can_manage ? 'Switches on and off, budgets' : null, p.can_report ? 'Reads spend and sales' : null].filter(Boolean);
        const result = tested[p.name];
        return (
          <article key={p.name} className="connection-card">
            <header>
              <h3>{p.label}</h3>
              <span className={`admin-status is-${p.method === 'manual' ? 'set_up' : p.connected ? 'connected' : 'not_set_up'}`}>
                {p.method === 'manual' ? 'By hand' : p.connected ? 'Keys added' : 'Not set up'}
              </span>
            </header>
            <p className="admin-muted">{p.note}</p>
            <p className="connection-detail">{can.join(' · ')}</p>
            {result ? <p className={result.status === 'connected' ? 'connection-detail' : 'form-error'}>{result.detail}</p> : null}
            <div className="admin-actions">
              {p.method === 'api' ? <Link className="btn btn-secondary btn-sm" href="/admin/connections">{p.connected ? 'Change keys' : 'Add keys'}</Link> : null}
              {p.method === 'api' && p.connected ? <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => test(p)}>Test</button> : null}
              {p.docs ? <a className="btn btn-secondary btn-sm" href={p.docs} target="_blank" rel="noopener noreferrer">{p.method === 'api' ? 'Developer docs' : 'Website'}</a> : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

function RulesTab({ data, busy, run }) {
  const rules = data.rules;
  const [form, setForm] = useState({
    mode: rules.mode, total: rules.monthly_cap_total ?? '', cost: rules.max_cost_per_sale ?? '', judge: rules.judge_after ?? '',
    stock: rules.pause_out_of_stock, below: rules.pause_below_cost,
    caps: Object.fromEntries(data.platforms.map((p) => [p.name, (rules.caps || {})[p.name] ?? ''])),
  });
  const set = (name) => (event) => setForm({ ...form, [name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });

  function save(event) {
    event.preventDefault();
    const num = (v) => (v === '' || v === null ? null : Number(v));
    run(() => call('rules', 'PUT', {
      mode: form.mode, monthly_cap_total: num(form.total), max_cost_per_sale: num(form.cost), judge_after: num(form.judge) ?? 0,
      pause_out_of_stock: form.stock, pause_below_cost: form.below,
      caps: Object.fromEntries(Object.entries(form.caps).map(([k, v]) => [k, num(v)])),
    }), 'Rules saved.');
  }

  const month = data.month;
  const last = rules.last_run;
  return (
    <form className="admin-card admin-form ads-rules" onSubmit={save}>
      <h2>Rules and limits</h2>
      <label>Mode
        <select value={form.mode} onChange={set('mode')}>
          {data.modes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <p className="admin-muted">{MODE_TEXT[form.mode]}</p>
      <label>Most to spend on all advertising in a month ($). Nothing goes live until this is set.
        <input value={form.total} onChange={set('total')} inputMode="decimal" placeholder="500" />
      </label>
      <p className="admin-muted">This month: {money(month.spend_cents)} spent; about {money(month.projected_cents)} by the end of the month at today&apos;s live budgets.</p>
      <fieldset className="ads-caps">
        <legend>Most to spend in a month on each platform ($, blank: only the overall limit)</legend>
        {data.platforms.map((p) => (
          <label key={p.name}>{p.label}
            <span className="admin-muted">{money(month.by_platform[p.name]?.spend_cents)} so far</span>
            <input value={form.caps[p.name]} onChange={(e) => setForm({ ...form, caps: { ...form.caps, [p.name]: e.target.value } })} inputMode="decimal" />
          </label>
        ))}
      </fieldset>
      <label>Pause a campaign when each sale costs more than ($, blank: not checked)
        <input value={form.cost} onChange={set('cost')} inputMode="decimal" />
      </label>
      <label>…judged once it has spent this much in the month ($)
        <input value={form.judge} onChange={set('judge')} inputMode="decimal" />
      </label>
      <label className="marketing-check"><input type="checkbox" checked={form.stock} onChange={set('stock')} /> Pause a campaign when one of its products is out of stock or taken off the website</label>
      <label className="marketing-check"><input type="checkbox" checked={form.below} onChange={set('below')} /> Pause a campaign when one of its products is priced below cost</label>
      <p className="admin-muted">These checks run every hour after the spend is read. They only ever pause; switching back on and raising a budget always take a person, inside the limits. A limit is reached on the spend the platforms report, which can lag by a few hours, so set limits with a little room.</p>
      <div className="admin-actions"><button type="submit" className="btn btn-primary" disabled={busy}>Save rules</button></div>
      {last && last.paused && last.paused.length ? (
        <>
          <h3>Paused at the last check</h3>
          <ul>{last.paused.map((p, i) => <li key={i}><strong>{p.name}</strong>: {p.reason} ({p.outcome})</li>)}</ul>
        </>
      ) : null}
    </form>
  );
}

export default function AdminAdvertising({ initial }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  async function reload() {
    try {
      setData(await call(''));
      setReloadKey((k) => k + 1);
    } catch (err) {
      setNotice({ error: err.message });
    }
  }

  // Runs one change, shows its result and reloads the page's figures. Returns true when it worked.
  async function run(task, message) {
    setBusy(true);
    setNotice(null);
    try {
      await task();
      if (message) setNotice({ message });
      await reload();
      return true;
    } catch (err) {
      setNotice({ error: err.message });
      await reload();
      return false;
    } finally {
      setBusy(false);
    }
  }

  const month = data.month;
  const live = data.campaigns.filter((c) => c.status === 'live').length;
  return (
    <div className="ads-page">
      <div className="connection-summary">
        <span className={`admin-status is-${data.rules.mode === 'live' ? 'connected' : data.rules.mode === 'prepare' ? 'attention' : 'not_set_up'}`}>Mode: {data.rules.mode}</span>
        <span className="admin-status is-unknown">{live} live</span>
        <span className="admin-status is-unknown">{money(month.spend_cents)} spent this month</span>
        <span className={`admin-status is-${month.cap_total ? 'unknown' : 'attention'}`}>{month.cap_total ? 'Limit ' + money(Math.round(month.cap_total * 100)) : 'No monthly limit set'}</span>
      </div>
      {notice?.error ? <p className="form-error" role="alert">{notice.error}</p> : null}
      {notice?.message ? <p className="form-note-banner" role="status">{notice.message}</p> : null}
      <AdminTabs ariaLabel="Advertising" tabs={[
        { key: 'campaigns', label: 'Campaigns', content: <CampaignsTab data={data} busy={busy} run={run} setNotice={setNotice} /> },
        { key: 'results', label: 'Results', content: <ResultsTab data={data} busy={busy} run={run} reloadKey={reloadKey} /> },
        { key: 'platforms', label: 'Platforms', content: <PlatformsTab data={data} busy={busy} run={run} /> },
        { key: 'rules', label: 'Rules', content: <RulesTab data={data} busy={busy} run={run} /> },
      ]} />
    </div>
  );
}
