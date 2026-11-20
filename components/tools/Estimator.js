'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Copy, FileDown, FolderOpen, Plus, Save, ShoppingCart, Trash2 } from 'lucide-react';

import EstimatorProductPicker from '@/components/tools/EstimatorProductPicker';
import { useCart } from '@/lib/cart-context';
import {
  DRAFT_KEY, cleanEstimate, emptyEstimate, estimateCsv, estimateTotals, exGst, forSaving, lineFigures,
  materialsList, money, newId, sectionTotals,
} from '@/lib/estimator';

const BUSINESS_KEY = 'teracom-estimator-business';
const CART_MAX = 20;

const readLocal = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeLocal = (key, value) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the estimate is still saved to the account.
  }
};

const dollars = (centsValue) => (centsValue === null || centsValue === undefined ? '' : (centsValue / 100).toFixed(2));
const toCents = (value) => {
  const n = Number(String(value).replace(/[$,\s]/g, ''));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : 0;
};
const when = (iso) => (iso ? new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');

function download(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const fileName = (estimate, ext) => `${(estimate.name || 'estimate').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'estimate'}.${ext}`;

function Text({ label, value, onChange, type = 'text', placeholder, wide, hint, ...rest }) {
  return (
    <div className={`field${wide ? ' est-wide' : ''}`}>
      <label>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} {...rest} />
      {hint ? <small className="est-hint">{hint}</small> : null}
    </div>
  );
}

function Area({ label, value, onChange, rows = 5, hint, placeholder }) {
  return (
    <div className="field est-wide">
      <label>{label}</label>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint ? <small className="est-hint">{hint}</small> : null}
    </div>
  );
}

// A money box that keeps what is typed until it loses focus.
function MoneyInput({ cents, onChange, placeholder, label }) {
  const [draft, setDraft] = useState(null);
  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      placeholder={placeholder}
      value={draft ?? (cents ? dollars(cents) : '')}
      onFocus={(e) => {
        // After the click that focused it, so typing replaces the amount instead of adding to it.
        const el = e.target;
        setTimeout(() => el.select(), 0);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== null) onChange(draft.trim() === '' ? null : toCents(draft));
        setDraft(null);
      }}
    />
  );
}

export default function Estimator() {
  const cart = useCart();
  const [view, setView] = useState('list');
  const [list, setList] = useState(null);
  const [listError, setListError] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [signIn, setSignIn] = useState('');
  const [tab, setTab] = useState('estimate');
  const [picker, setPicker] = useState(null);
  const [draft, setDraft] = useState(null);
  const [quote, setQuote] = useState(null);
  const loaded = useRef(false);

  const onSignIn = useCallback((message) => setSignIn(message || 'Your sign-in has timed out. Sign in again: your work is kept in this browser.'), []);

  const loadList = useCallback(async () => {
    try {
      const res = await fetch('/api/tools/estimator/estimates', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        onSignIn(data.error);
        setList([]);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Your estimates could not be loaded.');
      setList(data.estimates || []);
      setListError('');
    } catch (err) {
      setListError(err.message);
      setList([]);
    }
  }, [onSignIn]);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadList();
    const saved = readLocal(DRAFT_KEY);
    if (saved?.estimate) setDraft(saved);
  }, [loadList]);

  // Every change is kept in this browser too, so a timed-out sign-in loses nothing.
  useEffect(() => {
    if (estimate && dirty) writeLocal(DRAFT_KEY, { id: savedId, estimate, at: new Date().toISOString() });
  }, [estimate, dirty, savedId]);

  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = useCallback((fn) => {
    setEstimate((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
    setStatus('');
  }, []);

  const totals = useMemo(() => (estimate ? estimateTotals(estimate) : null), [estimate]);

  const open = (est, id = null, isDirty = false) => {
    setEstimate(cleanEstimate(est));
    setSavedId(id);
    setDirty(isDirty);
    setStatus('');
    setTab(id ? 'estimate' : 'details');
    setView('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNew = () => {
    const business = readLocal(BUSINESS_KEY) || {};
    open(emptyEstimate(new Date().toISOString(), business), null, true);
  };

  const openSaved = async (id, copy = false) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/tools/estimator/estimates/${id}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) return onSignIn(data.error);
      if (!res.ok) throw new Error(data.error || 'That estimate could not be opened.');
      if (copy) open({ ...data.data, name: `${data.data.name || 'Estimate'} (copy)` }, null, true);
      else open(data.data, data.id);
    } catch (err) {
      setListError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/tools/estimator/estimates/${row.id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return onSignIn(data.error);
    if (!res.ok) return setListError(data.error || 'That estimate could not be deleted.');
    setList((prev) => prev.filter((r) => r.id !== row.id));
  };

  const save = async () => {
    if (!estimate) return;
    setBusy(true);
    setStatus('Saving…');
    try {
      const body = JSON.stringify({ estimate: forSaving(estimate) });
      const res = await fetch(savedId ? `/api/tools/estimator/estimates/${savedId}` : '/api/tools/estimator/estimates', {
        method: savedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        onSignIn(data.error);
        setStatus('Not saved: sign in again. Your work is kept in this browser.');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'The estimate could not be saved.');
      setEstimate(cleanEstimate(data.data));
      setSavedId(data.id);
      setDirty(false);
      writeLocal(DRAFT_KEY, null);
      writeLocal(BUSINESS_KEY, data.data?.business || estimate.business);
      setStatus(`Saved ${when(data.updated_at)}. Store prices checked.`);
      loadList();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  const backToList = () => {
    if (dirty && !window.confirm('Leave without saving? Your changes stay in this browser as a draft.')) return;
    setView('list');
    setEstimate(null);
    setDraft(readLocal(DRAFT_KEY));
    loadList();
  };

  // Section and line edits.
  const addSection = () => change((e) => {
    e.sections.push({ id: newId(e.sections.map((s) => s.id)), title: `Section ${e.sections.length + 1}`, lines: [] });
  });
  const moveSection = (i, step) => change((e) => {
    const j = i + step;
    if (j < 0 || j >= e.sections.length) return;
    [e.sections[i], e.sections[j]] = [e.sections[j], e.sections[i]];
  });
  const removeSection = (i) => {
    const s = estimate.sections[i];
    if (s.lines.length && !window.confirm(`Remove "${s.title || 'this section'}" and its ${s.lines.length} lines?`)) return;
    change((e) => {
      e.sections.splice(i, 1);
      if (!e.sections.length) e.sections.push({ id: newId(), title: 'Section 1', lines: [] });
    });
  };
  const allLineIds = (e) => e.sections.flatMap((s) => s.lines.map((l) => l.id));
  const addProduct = useCallback((sectionId, product, qty) => change((e) => {
    const section = e.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const same = section.lines.find((l) => l.type === 'product' && l.productId === product.id);
    if (same) {
      same.qty += qty;
      return;
    }
    section.lines.push({
      id: newId(allLineIds(e)), type: 'product', productId: product.id, sku: product.sku, name: product.name,
      brand: product.brand, href: product.href, qty, unitCents: product.unitCents, markupPct: null, unavailable: false,
    });
  }), [change]);
  const addLabour = (sectionId) => change((e) => {
    const section = e.sections.find((s) => s.id === sectionId);
    section?.lines.push({ id: newId(allLineIds(e)), type: 'labour', description: 'Installation labour', hours: 1, rateCents: null });
  });
  const setLine = (sectionId, lineId, patch) => change((e) => {
    const line = e.sections.find((s) => s.id === sectionId)?.lines.find((l) => l.id === lineId);
    if (line) Object.assign(line, patch);
  });
  const removeLine = (sectionId, lineId) => change((e) => {
    const section = e.sections.find((s) => s.id === sectionId);
    if (section) section.lines = section.lines.filter((l) => l.id !== lineId);
  });
  const moveLine = (sectionId, index, step) => change((e) => {
    const lines = e.sections.find((s) => s.id === sectionId)?.lines;
    const j = index + step;
    if (!lines || j < 0 || j >= lines.length) return;
    [lines[index], lines[j]] = [lines[j], lines[index]];
  });

  const addToCart = () => {
    const items = materialsList(estimate).filter((i) => !i.unavailable);
    let capped = 0;
    for (const item of items) {
      if (item.qty > CART_MAX) capped += 1;
      cart.addItem(item.productId, Math.min(CART_MAX, item.qty));
    }
    setStatus(`${items.length} products added to your cart.${capped ? ` The cart takes up to ${CART_MAX} of each, so ${capped} ${capped === 1 ? 'line was' : 'lines were'} capped: ask us to quote larger quantities.` : ''}`);
  };

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const { makeProposalPdf } = await import('@/lib/estimatorPdf');
      const bytes = await makeProposalPdf(cleanEstimate(estimate));
      download(fileName(estimate, 'pdf').replace(/\.pdf$/, '-proposal.pdf'), new Blob([bytes], { type: 'application/pdf' }));
    } catch (err) {
      setStatus(`The PDF could not be made: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const sendQuote = async () => {
    setQuote((q) => ({ ...q, busy: true, error: '' }));
    const res = await fetch('/api/tools/estimator/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estimate: forSaving(estimate), phone: quote.phone || '', notes: quote.notes || '' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setQuote(null);
      return onSignIn(data.error);
    }
    if (!res.ok) return setQuote((q) => ({ ...q, busy: false, error: data.error || 'It did not send.' }));
    setQuote({ sent: true });
  };

  const signInBanner = signIn ? (
    <div className="form-note-banner est-signin">
      {signIn}{' '}
      <Link href="/account/login?next=%2Ftools%2Festimator" target="_blank">Sign in (opens a new tab)</Link>, then come back and press Save again.
      <button type="button" className="est-link" onClick={() => setSignIn('')}>Dismiss</button>
    </div>
  ) : null;

  if (view === 'list') {
    return (
      <div className="est">
        {signInBanner}
        <div className="est-list-head">
          <div>
            <h2>Your estimates</h2>
            <p className="est-hint">Saved to your account, so you can open them on any device. Store prices are checked again whenever you open or save one.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={startNew}>
            <Plus size={18} aria-hidden="true" /> New estimate
          </button>
        </div>
        {draft?.estimate ? (
          <div className="est-draft">
            <span>You have unsaved work from {when(draft.at)}: <strong>{draft.estimate.name || 'Untitled estimate'}</strong></span>
            <button type="button" className="btn btn-secondary" onClick={() => open(draft.estimate, draft.id || null, true)}>Carry on</button>
            <button type="button" className="est-link" onClick={() => { writeLocal(DRAFT_KEY, null); setDraft(null); }}>Discard</button>
          </div>
        ) : null}
        {listError ? <p className="form-note-banner">{listError}</p> : null}
        {list === null ? <p className="est-hint">Loading your estimates…</p> : null}
        {list && !list.length && !listError ? (
          <div className="est-empty">
            <FolderOpen size={36} aria-hidden="true" />
            <p>No estimates yet. Start one: add sections for the job, pick materials from our store, add your labour and markup, then turn it into a proposal for your client.</p>
          </div>
        ) : null}
        {list?.length ? (
          <div className="est-table-wrap">
            <table className="est-table">
              <thead>
                <tr><th>Estimate</th><th>Client</th><th className="est-num">Total inc GST</th><th>Saved</th><th aria-label="Actions" /></tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.id}>
                    <td><button type="button" className="est-link est-strong" disabled={busy} onClick={() => openSaved(row.id)}>{row.name}</button></td>
                    <td>{row.client}</td>
                    <td className="est-num">{money(row.total_cents)}</td>
                    <td>{when(row.updated_at)}</td>
                    <td className="est-row-actions">
                      <button type="button" className="est-icon-btn" title="Copy to a new estimate" aria-label={`Copy ${row.name}`} disabled={busy} onClick={() => openSaved(row.id, true)}><Copy size={17} /></button>
                      <button type="button" className="est-icon-btn" title="Delete" aria-label={`Delete ${row.name}`} onClick={() => remove(row)}><Trash2 size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }

  const e = estimate;
  const setField = (path, value) => change((x) => {
    const keys = path.split('.');
    let target = x;
    for (const k of keys.slice(0, -1)) target = target[k];
    target[keys.at(-1)] = value;
  });
  const lineCount = e.sections.reduce((n, s) => n + s.lines.length, 0);
  const unavailable = e.sections.flatMap((s) => s.lines).filter((l) => l.unavailable).length;

  return (
    <div className="est">
      {signInBanner}
      <div className="est-bar">
        <button type="button" className="est-link" onClick={backToList}>← All estimates</button>
        <strong className="est-bar-name">{e.name || 'Untitled estimate'}</strong>
        <span className="est-bar-total">{money(totals.total_cents)} <small>inc GST</small></span>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={save}>
          <Save size={17} aria-hidden="true" /> {dirty || !savedId ? 'Save' : 'Saved'}
        </button>
      </div>
      {status ? <p className="est-status" role="status">{status}</p> : null}

      <div className="est-tabs" role="tablist">
        {[['details', 'Job details'], ['estimate', `Estimate${lineCount ? ` (${lineCount})` : ''}`], ['proposal', 'Proposal']].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'details' ? (
        <div className="est-panel">
          <h3>The job</h3>
          <div className="est-grid">
            <Text label="Job name" value={e.name} onChange={(v) => setField('name', v)} placeholder="e.g. Warehouse CCTV upgrade" wide />
            <Text label="Your reference" value={e.reference} onChange={(v) => setField('reference', v)} placeholder="e.g. Q-1042" />
            <Text label="Date" type="date" value={e.date} onChange={(v) => setField('date', v)} />
            <Text label="Valid for (days)" type="number" min="1" max="365" value={e.validDays} onChange={(v) => setField('validDays', Math.max(1, Math.min(365, Number(v) || 30)))} />
            <Text label="Site address" value={e.site} onChange={(v) => setField('site', v)} wide />
          </div>
          <h3>Your client</h3>
          <div className="est-grid">
            <Text label="Contact name" value={e.client.name} onChange={(v) => setField('client.name', v)} />
            <Text label="Company" value={e.client.company} onChange={(v) => setField('client.company', v)} />
            <Text label="Email" type="email" value={e.client.email} onChange={(v) => setField('client.email', v)} />
            <Text label="Phone" type="tel" value={e.client.phone} onChange={(v) => setField('client.phone', v)} />
            <Text label="Address" value={e.client.address} onChange={(v) => setField('client.address', v)} wide />
          </div>
          <h3>Your business <small className="est-hint">(shown on the proposal; remembered for your next estimate)</small></h3>
          <div className="est-grid">
            <Text label="Business name" value={e.business.name} onChange={(v) => setField('business.name', v)} />
            <Text label="ABN" value={e.business.abn} onChange={(v) => setField('business.abn', v)} />
            <Text label="Licence number" value={e.business.licence} onChange={(v) => setField('business.licence', v)} />
            <Text label="Phone" type="tel" value={e.business.phone} onChange={(v) => setField('business.phone', v)} />
            <Text label="Email" type="email" value={e.business.email} onChange={(v) => setField('business.email', v)} />
            <Text label="Address" value={e.business.address} onChange={(v) => setField('business.address', v)} wide />
          </div>
          <div className="est-actions">
            <button type="button" className="btn btn-primary" onClick={() => setTab('estimate')}>Next: the estimate</button>
          </div>
        </div>
      ) : null}

      {tab === 'estimate' ? (
        <>
          <div className="est-panel est-settings">
            <div className="field">
              <label>Labour rate per hour (ex GST)</label>
              <MoneyInput label="Labour rate per hour" cents={e.settings.labourRateCents} placeholder="0.00" onChange={(c) => setField('settings.labourRateCents', c ?? 0)} />
            </div>
            <div className="field">
              <label>Markup on materials (%)</label>
              <input type="number" min="0" max="500" step="1" value={e.settings.markupPct} onChange={(ev) => setField('settings.markupPct', Math.max(0, Math.min(500, Number(ev.target.value) || 0)))} />
            </div>
            <p className="est-hint">Material costs are your store price ex GST. Each line can have its own markup or labour rate; leave it blank to use these.</p>
          </div>
          {unavailable ? <p className="form-note-banner">{unavailable} {unavailable === 1 ? 'product is' : 'products are'} no longer in the store. Swap {unavailable === 1 ? 'it' : 'them'} for a current product.</p> : null}

          {e.sections.map((section, si) => {
            const st = sectionTotals(section, e.settings);
            return (
              <div className="est-panel est-section" key={section.id}>
                <div className="est-section-head">
                  <input className="est-section-title" value={section.title} aria-label="Section name" placeholder="Section name" onChange={(ev) => change((x) => { x.sections[si].title = ev.target.value; })} />
                  <span className="est-section-total">{money(st.sellCents)} <small>ex GST</small></span>
                  <button type="button" className="est-icon-btn" aria-label="Move section up" disabled={si === 0} onClick={() => moveSection(si, -1)}><ArrowUp size={16} /></button>
                  <button type="button" className="est-icon-btn" aria-label="Move section down" disabled={si === e.sections.length - 1} onClick={() => moveSection(si, 1)}><ArrowDown size={16} /></button>
                  <button type="button" className="est-icon-btn" aria-label="Remove section" onClick={() => removeSection(si)}><Trash2 size={16} /></button>
                </div>
                {section.lines.length ? (
                  <div className="est-table-wrap">
                    <table className="est-table est-lines">
                      <thead>
                        <tr><th>Item</th><th className="est-num">Qty / hrs</th><th className="est-num">Cost / rate</th><th className="est-num">Markup %</th><th className="est-num">Sell ex GST</th><th aria-label="Actions" /></tr>
                      </thead>
                      <tbody>
                        {section.lines.map((line, li) => {
                          const f = lineFigures(line, e.settings);
                          return (
                            <tr key={line.id} className={line.unavailable ? 'est-unavailable' : ''}>
                              {line.type === 'product' ? (
                                <>
                                  <td>
                                    {line.href ? <a href={line.href} target="_blank" rel="noreferrer">{line.name}</a> : line.name}
                                    <small className="est-sub">{[line.brand, line.sku].filter(Boolean).join(' · ')}{line.unavailable ? ' · no longer in the store' : ''}</small>
                                  </td>
                                  <td className="est-num"><input type="number" min="0" className="est-in-qty" aria-label="Quantity" value={line.qty} onChange={(ev) => setLine(section.id, line.id, { qty: Math.max(0, Math.min(99999, Math.round(Number(ev.target.value) || 0))) })} /></td>
                                  <td className="est-num">{typeof line.unitCents === 'number' ? money(exGst(line.unitCents)) : 'On request'}</td>
                                  <td className="est-num"><input type="number" min="0" max="500" className="est-in-pct" aria-label="Markup for this line" placeholder={String(e.settings.markupPct)} value={line.markupPct ?? ''} onChange={(ev) => setLine(section.id, line.id, { markupPct: ev.target.value === '' ? null : Math.max(0, Math.min(500, Number(ev.target.value) || 0)) })} /></td>
                                </>
                              ) : (
                                <>
                                  <td><input className="est-in-desc" aria-label="Labour description" value={line.description} onChange={(ev) => setLine(section.id, line.id, { description: ev.target.value })} /><small className="est-sub">Labour</small></td>
                                  <td className="est-num"><input type="number" min="0" step="0.25" className="est-in-qty" aria-label="Hours" value={line.hours} onChange={(ev) => setLine(section.id, line.id, { hours: Math.max(0, Math.min(9999, Number(ev.target.value) || 0)) })} /></td>
                                  <td className="est-num est-in-money"><MoneyInput label="Rate for this line" cents={line.rateCents} placeholder={dollars(e.settings.labourRateCents) || '0.00'} onChange={(c) => setLine(section.id, line.id, { rateCents: c })} /></td>
                                  <td className="est-num">–</td>
                                </>
                              )}
                              <td className="est-num"><strong>{f.priced ? money(f.sellCents) : '–'}</strong></td>
                              <td className="est-row-actions">
                                <button type="button" className="est-icon-btn" aria-label="Move up" disabled={li === 0} onClick={() => moveLine(section.id, li, -1)}><ArrowUp size={15} /></button>
                                <button type="button" className="est-icon-btn" aria-label="Move down" disabled={li === section.lines.length - 1} onClick={() => moveLine(section.id, li, 1)}><ArrowDown size={15} /></button>
                                <button type="button" className="est-icon-btn" aria-label="Remove line" onClick={() => removeLine(section.id, line.id)}><Trash2 size={15} /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="est-hint">Nothing in this section yet.</p>}
                <div className="est-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setPicker(section.id)}><Plus size={16} aria-hidden="true" /> Add materials</button>
                  <button type="button" className="btn btn-secondary" onClick={() => addLabour(section.id)}><Plus size={16} aria-hidden="true" /> Add labour</button>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn btn-secondary est-add-section" onClick={addSection}><Plus size={16} aria-hidden="true" /> Add a section</button>

          <div className="est-panel est-totals">
            <div><span>Materials (your cost)</span><strong>{money(totals.materials_cost_cents)}</strong></div>
            <div><span>Materials (sell)</span><strong>{money(totals.materials_sell_cents)}</strong></div>
            <div><span>Your margin on materials</span><strong>{money(totals.materials_margin_cents)}</strong></div>
            <div><span>Labour ({totals.labour_hours} hrs)</span><strong>{money(totals.labour_cents)}</strong></div>
            <div className="est-totals-rule"><span>Subtotal ex GST</span><strong>{money(totals.subtotal_cents)}</strong></div>
            <div><span>GST</span><strong>{money(totals.gst_cents)}</strong></div>
            <div className="est-grand"><span>Total inc GST</span><strong>{money(totals.total_cents)}</strong></div>
            {totals.unpriced ? <p className="est-hint">{totals.unpriced} {totals.unpriced === 1 ? 'product has' : 'products have'} no store price yet and {totals.unpriced === 1 ? 'is' : 'are'} not in the totals. Ask us to quote {totals.unpriced === 1 ? 'it' : 'them'}.</p> : null}
            <p className="est-hint">Your cost and margin are for you only; the proposal shows your sell prices.</p>
          </div>

          <div className="est-actions est-actions-main">
            <button type="button" className="btn btn-primary" onClick={() => setTab('proposal')}>Next: the proposal</button>
            <button type="button" className="btn btn-secondary" disabled={!materialsList(e).length} onClick={addToCart}><ShoppingCart size={16} aria-hidden="true" /> Add materials to cart</button>
            <button type="button" className="btn btn-secondary" disabled={!materialsList(e).length} onClick={() => setQuote({ phone: '', notes: '' })}>Ask us to quote the materials</button>
            <button type="button" className="btn btn-secondary" onClick={() => download(fileName(e, 'csv'), new Blob([estimateCsv(e)], { type: 'text/csv' }))}><FileDown size={16} aria-hidden="true" /> Download (Excel CSV)</button>
          </div>
        </>
      ) : null}

      {tab === 'proposal' ? (
        <div className="est-panel">
          <p className="est-hint">The proposal is in your business name and shows your sell prices, never your costs or markup. Edit the wording to suit the job; it is saved with the estimate.</p>
          <div className="est-grid">
            <Area label="Introduction" rows={3} value={e.proposal.intro} onChange={(v) => setField('proposal.intro', v)} />
            <Area label="Scope of works" rows={8} value={e.proposal.scope} onChange={(v) => setField('proposal.scope', v)} placeholder="Describe the work: what will be supplied and installed, where, and how it will be handed over." />
            <Area label="Included (one per line)" rows={6} value={e.proposal.inclusions} onChange={(v) => setField('proposal.inclusions', v)} />
            <Area label="Not included (one per line)" rows={6} value={e.proposal.exclusions} onChange={(v) => setField('proposal.exclusions', v)} />
            <Area label="Payment" rows={2} value={e.proposal.payment} onChange={(v) => setField('proposal.payment', v)} />
            <Area label="Terms" rows={4} value={e.proposal.terms} onChange={(v) => setField('proposal.terms', v)} />
          </div>
          <label className="est-check">
            <input type="checkbox" checked={e.proposal.showLinePrices} onChange={(ev) => setField('proposal.showLinePrices', ev.target.checked)} />
            Show a price on every line (otherwise each section shows one price)
          </label>
          <div className="est-proposal-sum">
            <span>{e.sections.filter((s) => s.lines.length).length} sections</span>
            <span>Subtotal {money(totals.subtotal_cents)} ex GST</span>
            <strong>Total {money(totals.total_cents)} inc GST</strong>
          </div>
          {!e.business.name ? <p className="form-note">Add your business name under Job details so it shows on the proposal.</p> : null}
          <div className="est-actions">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={downloadPdf}><FileDown size={16} aria-hidden="true" /> Download proposal (PDF)</button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={save}><Save size={16} aria-hidden="true" /> Save</button>
          </div>
        </div>
      ) : null}

      {picker ? (
        <EstimatorProductPicker
          sectionTitle={e.sections.find((s) => s.id === picker)?.title}
          onAdd={(product, qty) => addProduct(picker, product, qty)}
          onClose={() => setPicker(null)}
          onSignIn={(msg) => { setPicker(null); onSignIn(msg); }}
        />
      ) : null}

      {quote ? (
        <div className="est-modal" role="dialog" aria-modal="true" aria-label="Ask us to quote the materials">
          <div className="est-modal-panel">
            {quote.sent ? (
              <>
                <h2>Sent</h2>
                <p>Thanks. Our team will price the materials for this job and come back to you, usually within one business day.</p>
                <div className="est-modal-foot"><button type="button" className="btn btn-primary" onClick={() => setQuote(null)}>Close</button></div>
              </>
            ) : (
              <>
                <h2>Ask us to quote the materials</h2>
                <p className="est-hint">We get the store products in this estimate and their quantities. Your labour, markup and client details are not sent.</p>
                <div className="est-grid">
                  <Text label="Your phone (optional)" type="tel" value={quote.phone} onChange={(v) => setQuote((q) => ({ ...q, phone: v }))} />
                  <Area label="Notes (optional)" rows={3} value={quote.notes} onChange={(v) => setQuote((q) => ({ ...q, notes: v }))} placeholder="Delivery date, project pricing, alternatives you'd consider…" />
                </div>
                {quote.error ? <p className="form-note-banner">{quote.error}</p> : null}
                <div className="est-modal-foot">
                  <button type="button" className="btn btn-secondary" onClick={() => setQuote(null)}>Cancel</button>
                  <button type="button" className="btn btn-primary" disabled={quote.busy} onClick={sendQuote}>{quote.busy ? 'Sending…' : 'Send'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
