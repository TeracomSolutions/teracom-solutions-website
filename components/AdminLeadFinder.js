'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Play, Plus, RefreshCw } from 'lucide-react';

import { formatDateTime } from '@/lib/adminFormat';

// The lead finder on the Leads page (api/staff_leadgen.py in the backend): find businesses that could buy from us,
// review them, have the AI draft a first email, approve it, and send it within the Spam Act. Four parts, each its
// own tab on the page: Find leads, Businesses, Emails and Lead finder settings.

const BASE = '/api/admin/leads/finder';

async function call(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'The backend did not answer.');
  return data;
}

const STATUS_LABELS = {
  new: 'To review', approved: 'Approved', rejected: 'Not a fit', contacted: 'Emailed', replied: 'Replied',
  won: 'Customer', do_not_contact: 'Do not contact',
};
const MESSAGE_LABELS = { draft: 'Draft', approved: 'Approved, waiting to send', sent: 'Sent', failed: 'Not sent', discarded: 'Discarded' };
const CONSENT = { published: 'Published on their site', express: 'They asked us', existing: 'Existing customer', none: 'No consent' };

function useOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    call('').then((d) => { setData(d); setError(''); }).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);
  return { data, error, load };
}

function Tiles({ counts }) {
  if (!counts) return null;
  const tiles = [
    ['Businesses found', counts.prospects],
    ['To review', counts.by_status?.new || 0],
    ['Emails sent', counts.sent],
    ['Replies', counts.replied],
    ['Reply rate', counts.reply_rate === null ? '—' : `${counts.reply_rate}%`],
    ['Unsubscribed', counts.unsubscribed],
    ['Sent today', counts.sent_today],
  ];
  return (
    <div className="ads-tiles">
      {tiles.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </div>
  );
}

// --- Find leads ------------------------------------------------------------------
function SearchForm({ segments, initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => initial || { name: '', segment: 'strata', terms: '', places: [], per_place: 8, every_days: 7, active: true });
  const [places, setPlaces] = useState((initial?.places || []).join('\n'));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = { ...form, places: places.split('\n').map((p) => p.trim()).filter(Boolean), per_place: Number(form.per_place), every_days: Number(form.every_days) };
      const saved = initial?.id ? await call(`/searches/${initial.id}`, 'PUT', body) : await call('/searches', 'POST', body);
      onSaved(saved);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card leadfinder-form" onSubmit={save}>
      <div className="ads-form-row">
        <label className="form-editor-label">Name<input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Strata managers, south-east" required /></label>
        <label className="form-editor-label">Kind of business
          <select value={form.segment} onChange={(e) => set('segment', e.target.value)}>
            {segments.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <label className="form-editor-label">Search words<input value={form.terms} onChange={(e) => set('terms', e.target.value)} placeholder="strata management company" required /></label>
      </div>
      <div className="ads-form-row">
        <label className="form-editor-label">Places, one per line
          <textarea rows={4} value={places} onChange={(e) => setPlaces(e.target.value)} placeholder={'Frankston VIC\nDandenong VIC\nMelbourne CBD'} />
        </label>
        <label className="form-editor-label">Websites to look at per place<input type="number" min={3} max={20} value={form.per_place} onChange={(e) => set('per_place', e.target.value)} /></label>
        <label className="form-editor-label">Run again every (days)<input type="number" min={1} max={90} value={form.every_days} onChange={(e) => set('every_days', e.target.value)} /></label>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save search'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export function LeadFinderFind() {
  const { data, error, load } = useOverview();
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  async function run(s) {
    setNotice('');
    try {
      const r = await call(`/searches/${s.id}/run`, 'POST');
      setNotice(r.started ? `Running "${s.name}". New businesses appear on the Businesses tab as they are found; it takes a few minutes.` : r.message);
      setTimeout(load, 4000);
    } catch (e) {
      setNotice(e.message);
    }
  }

  async function stop(s) {
    if (!window.confirm(`Stop running "${s.name}"? The businesses it found stay.`)) return;
    try {
      await call(`/searches/${s.id}`, 'DELETE');
      load();
    } catch (e) {
      setNotice(e.message);
    }
  }

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!data) return <p className="admin-muted">Loading…</p>;
  return (
    <div className="leadfinder">
      <Tiles counts={data.counts} />
      <p className="admin-muted">
        A search looks for a kind of business in the places you list, reads each business&apos;s own website (never directories or social
        networks), and keeps the email addresses it publishes with the page they were on. Nothing is sent to anyone.
        {data.abn_lookup ? ' ABNs are checked with ABN Lookup.' : ' Add an ABN Lookup GUID on Connections (Leads group) to check ABNs too.'}
        {data.job?.running ? ' The finder is running now.' : ''}
      </p>
      {notice ? <p className="admin-muted" role="status">{notice}</p> : null}
      {editing ? (
        <SearchForm segments={data.segments} initial={editing === 'new' ? null : editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      ) : (
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing('new')}><Plus size={15} aria-hidden="true" /> New search</button>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact">
          <thead><tr><th>Search</th><th>Kind</th><th>Places</th><th>Every</th><th>Last run</th><th>Found last time</th><th></th></tr></thead>
          <tbody>
            {data.searches.length === 0 ? <tr><td colSpan={7} className="admin-muted">No searches yet. Start with New search.</td></tr> : null}
            {data.searches.map((s) => (
              <tr key={s.id} className={s.active ? undefined : 'is-muted'}>
                <td>{s.name}<br /><span className="admin-muted">{s.terms}</span></td>
                <td>{data.segments.find((g) => g.key === s.segment)?.label || s.segment}</td>
                <td className="wrap">{(s.places || []).join(', ') || '—'}</td>
                <td>{s.active ? `${s.every_days} days` : 'Stopped'}</td>
                <td>{s.last_run_at ? formatDateTime(s.last_run_at) : 'Never'}</td>
                <td>{s.last_result?.added !== undefined ? `${s.last_result.added} new of ${s.last_result.sites_read} read` : '—'}</td>
                <td className="lead-actions">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => run(s)} disabled={!s.active}><Play size={14} aria-hidden="true" /> Run now</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(s)}>Change</button>
                  {s.active ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => stop(s)}>Stop</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Businesses ------------------------------------------------------------------
function ProspectDetail({ id, onChanged }) {
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [brief, setBrief] = useState('');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [contact, setContact] = useState({ email: '', name: '', role: '', consent_basis: 'express', evidence: '' });

  const load = useCallback(() => {
    call(`/prospects/${id}`).then((d) => { setP(d); setNotes(d.notes || ''); }).catch((e) => setError(e.message));
  }, [id]);
  useEffect(load, [load]);

  async function act(label, fn) {
    setBusy(label);
    setError('');
    try {
      await fn();
      load();
      onChanged?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }

  if (error && !p) return <p className="form-error" role="alert">{error}</p>;
  if (!p) return <p className="admin-muted">Loading…</p>;
  return (
    <div className="lead-detail">
      <dl className="lead-facts">
        <div><dt>Website</dt><dd>{p.website ? <a className="admin-link" href={p.website} target="_blank" rel="noopener noreferrer">{p.domain} <ExternalLink size={12} aria-hidden="true" /></a> : '—'}</dd></div>
        <div><dt>Kind</dt><dd>{p.segment_label}</dd></div>
        <div><dt>Where</dt><dd>{[p.suburb, p.state].filter(Boolean).join(' ') || '—'}</dd></div>
        <div><dt>Phone</dt><dd>{p.phone ? <a className="admin-link" href={`tel:${p.phone}`}>{p.phone}</a> : '—'}</dd></div>
        <div><dt>ABN</dt><dd>{p.abn ? `${p.abn} (${p.abn_status || 'status unknown'})` : '—'}</dd></div>
        <div><dt>Found by</dt><dd>{p.source_ref || p.source}</dd></div>
      </dl>
      {p.summary ? <p>{p.summary}</p> : null}
      <p className="admin-muted">Fit {p.fit_score}: {(p.fit_reasons || []).join(' · ')}</p>

      <h4 className="leadfinder-h">Contacts</h4>
      {(p.contacts || []).length === 0 ? <p className="admin-muted">No email address published on their site. Call them, or add a contact who asked you to get in touch.</p> : null}
      <ul className="leadfinder-contacts">
        {(p.contacts || []).map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.email}</strong> {c.name ? `· ${c.name}` : ''} {c.role ? `· ${c.role}` : ''}
              <span className={`admin-status ${c.consent_basis === 'none' ? 'is-cancelled' : 'is-done'}`}>{CONSENT[c.consent_basis] || c.consent_basis}</span>
            </div>
            <span className="admin-muted">
              {c.evidence?.url ? <>Found on <a className="admin-link" href={c.evidence.url} target="_blank" rel="noopener noreferrer">{c.evidence.url}</a>{c.evidence.captured_at ? ` on ${formatDateTime(c.evidence.captured_at)}` : ''}</> : c.evidence?.note || ''}
              {c.evidence?.excerpt ? <>: “{c.evidence.excerpt.slice(0, 200)}…”</> : null}
            </span>
            {c.consent_basis !== 'none' && !['rejected', 'replied', 'do_not_contact'].includes(p.status) ? (
              <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('draft', () => call(`/prospects/${p.id}/draft`, 'POST', { contact_id: c.id, brief }))}>
                {busy === 'draft' ? 'Writing…' : 'Draft an email'}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <label className="form-editor-label">Note for the AI when it drafts (optional)
        <input value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={400} placeholder="For example: mention we already look after two buildings in Frankston" />
      </label>
      {adding ? (
        <div className="admin-card">
          <div className="ads-form-row">
            <label className="form-editor-label">Email<input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
            <label className="form-editor-label">Name<input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></label>
            <label className="form-editor-label">Role<input value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })} /></label>
          </div>
          <div className="ads-form-row">
            <label className="form-editor-label">May we email them?
              <select value={contact.consent_basis} onChange={(e) => setContact({ ...contact, consent_basis: e.target.value })}>
                <option value="express">They asked us to</option>
                <option value="existing">They are a customer</option>
                <option value="published">They publish it for business enquiries</option>
              </select>
            </label>
            <label className="form-editor-label">How you know (kept as the evidence)<input value={contact.evidence} onChange={(e) => setContact({ ...contact, evidence: e.target.value })} placeholder="Met at the SCAV expo 12 Nov, asked for a quote" /></label>
          </div>
          <div className="admin-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => act('contact', async () => { await call(`/prospects/${p.id}/contacts`, 'POST', contact); setAdding(false); })}>Add contact</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAdding(true)}><Plus size={14} aria-hidden="true" /> Add a contact</button>
      )}

      {(p.messages || []).length ? (
        <>
          <h4 className="leadfinder-h">Emails</h4>
          <ul className="leadfinder-contacts">
            {p.messages.map((m) => <li key={m.id}><strong>{m.subject}</strong> <span className="admin-muted">to {m.to_email} · {MESSAGE_LABELS[m.status]}{m.sent_at ? ` ${formatDateTime(m.sent_at)}` : ''}</span></li>)}
          </ul>
        </>
      ) : null}

      <label className="form-editor-label">Notes<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('notes', () => call(`/prospects/${p.id}`, 'PATCH', { notes }))}>Save notes</button>
        {p.status === 'new' ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('ok', () => call(`/prospects/${p.id}`, 'PATCH', { status: 'approved' }))}>Good fit</button> : null}
        {!['rejected', 'won'].includes(p.status) ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('no', () => call(`/prospects/${p.id}`, 'PATCH', { status: 'rejected' }))}>Not a fit</button> : null}
        {p.status === 'replied' ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('won', () => call(`/prospects/${p.id}`, 'PATCH', { status: 'won' }))}>Became a customer</button> : null}
        {p.status !== 'do_not_contact' ? (
          <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => { if (window.confirm(`Never email ${p.company} again? Every address there goes on the never-email list.`)) act('dnc', () => call(`/prospects/${p.id}`, 'PATCH', { status: 'do_not_contact' })); }}>Do not contact</button>
        ) : null}
      </div>
    </div>
  );
}

export function LeadFinderBusinesses() {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('new');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q.trim()) params.set('q', q.trim());
    call(`/prospects?${params}`).then((d) => { setRows(d.prospects); setError(''); }).catch((e) => setError(e.message));
  }, [status, q]);
  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  return (
    <div className="leadfinder">
      <div className="admin-refresh">
        <label>Show
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label>Search<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, website or suburb" /></label>
        <button type="button" className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} aria-hidden="true" /> Refresh</button>
        <span className="admin-muted">{rows ? `${rows.length} businesses` : ''}</span>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact admin-lines leadfinder-lines">
          <colgroup><col className="col-open" /><col className="col-fit" /><col className="col-company" /><col className="col-kind" /><col className="col-where" /><col className="col-emails" /><col className="col-status" /></colgroup>
          <thead><tr><th aria-label="Open"></th><th>Fit</th><th>Business</th><th>Kind</th><th>Where</th><th>Emails</th><th>Status</th></tr></thead>
          <tbody>
            {rows && rows.length === 0 ? <tr><td colSpan={7} className="admin-muted">Nothing here. Run a search on the Find leads tab.</td></tr> : null}
            {(rows || []).map((p) => {
              const open = openId === p.id;
              return (
                <Fragment key={p.id}>
                  <tr className={`admin-line${open ? ' is-open' : ''}${p.status === 'new' ? ' is-unread' : ''}`} onClick={() => setOpenId(open ? null : p.id)}>
                    <td><button type="button" className="admin-line-toggle" aria-expanded={open} aria-label={`Open ${p.company}`} onClick={(e) => { e.stopPropagation(); setOpenId(open ? null : p.id); }}>{open ? <ChevronDown size={15} aria-hidden="true" /> : <ChevronRight size={15} aria-hidden="true" />}</button></td>
                    <td><span className={`leadfinder-fit ${p.fit_score >= 40 ? 'is-high' : p.fit_score >= 25 ? 'is-mid' : 'is-low'}`}>{p.fit_score}</span></td>
                    <td title={p.company}>{p.company}</td>
                    <td title={p.segment_label}>{p.segment_label}</td>
                    <td>{[p.suburb, p.state].filter(Boolean).join(' ') || '—'}</td>
                    <td>{p.emailable || '—'}</td>
                    <td><span className="admin-status">{STATUS_LABELS[p.status] || p.status}</span></td>
                  </tr>
                  {open ? <tr className="lead-reply-row"><td colSpan={7}><ProspectDetail id={p.id} onChanged={load} /></td></tr> : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Emails ----------------------------------------------------------------------
function MessageDetail({ m, canSend, onChanged }) {
  const [subject, setSubject] = useState(m.subject);
  const [body, setBody] = useState(m.body);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const editable = ['draft', 'approved', 'failed'].includes(m.status);
  const changed = subject !== m.subject || body !== m.body;

  async function act(label, fn) {
    setBusy(label);
    setError('');
    try {
      await fn();
      onChanged();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="lead-detail">
      {m.why_now ? <p className="admin-muted">Why them: {m.why_now}</p> : null}
      <label className="form-editor-label">Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!editable} /></label>
      <label className="form-editor-label">Email (the sender details, where we found their address and the unsubscribe link are added below it when it is sent)
        <textarea rows={9} value={body} onChange={(e) => setBody(e.target.value)} disabled={!editable} />
      </label>
      <p className="admin-muted">{body.split(/\s+/).filter(Boolean).length} words{m.model ? ` · written by ${m.model}` : ''}{m.edited ? ' · changed by staff' : ''}</p>
      {m.error ? <p className="form-error">{m.error}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        {editable && changed ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('save', () => call(`/messages/${m.id}`, 'PUT', { subject, body }))}>Save changes</button> : null}
        {['draft', 'failed'].includes(m.status) && canSend ? (
          <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy) || changed} title={changed ? 'Save your changes first' : ''}
            onClick={() => { if (window.confirm(`Approve this email to ${m.to_email}? It goes in business hours once sending is on.`)) act('approve', () => call(`/messages/${m.id}/approve`, 'POST')); }}>
            {busy === 'approve' ? 'Approving…' : 'Approve and send'}
          </button>
        ) : null}
        {editable ? <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('discard', () => call(`/messages/${m.id}/discard`, 'POST'))}>Discard</button> : null}
      </div>
      {m.status === 'sent' && !m.replied_at ? (
        <div className="admin-actions">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What they said (optional)" maxLength={2000} />
          <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => act('replied', () => call(`/messages/${m.id}/replied`, 'POST', { note }))}>They replied: make it a lead</button>
        </div>
      ) : null}
      {m.replied_at ? <p className="admin-muted">Replied {formatDateTime(m.replied_at)}; it is on the Enquiries tab.</p> : null}
    </div>
  );
}

export function LeadFinderEmails() {
  const { data: overview } = useOverview();
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('draft');
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    call(`/messages${status ? `?status=${status}` : ''}`).then((d) => { setRows(d.messages); setError(''); }).catch((e) => setError(e.message));
  }, [status]);
  useEffect(load, [load]);
  const s = overview?.settings;

  return (
    <div className="leadfinder">
      {s ? (
        <p className={s.sending ? 'admin-muted' : 'form-error'}>
          {s.sending
            ? `Sending is on: approved emails go on business days ${s.hours_from}:00 to ${s.hours_to}:00 Melbourne time, up to ${s.daily_limit} a day (${overview.counts.sent_today} sent today).`
            : 'Sending is off: you can draft and approve, but nothing is sent until an administrator switches it on in Lead finder settings.'}
        </p>
      ) : null}
      <div className="admin-refresh">
        <label>Show
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {Object.entries(MESSAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} aria-hidden="true" /> Refresh</button>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact admin-lines leadfinder-lines">
          <colgroup><col className="col-open" /><col className="col-company" /><col className="col-subject" /><col className="col-email" /><col className="col-status" /><col className="col-when" /></colgroup>
          <thead><tr><th aria-label="Open"></th><th>Business</th><th>Subject</th><th>To</th><th>Status</th><th>When</th></tr></thead>
          <tbody>
            {rows && rows.length === 0 ? <tr><td colSpan={6} className="admin-muted">Nothing here. Draft an email from a business on the Businesses tab.</td></tr> : null}
            {(rows || []).map((m) => {
              const open = openId === m.id;
              return (
                <Fragment key={m.id}>
                  <tr className={`admin-line${open ? ' is-open' : ''}`} onClick={() => setOpenId(open ? null : m.id)}>
                    <td><button type="button" className="admin-line-toggle" aria-expanded={open} aria-label={`Open the email to ${m.company}`} onClick={(e) => { e.stopPropagation(); setOpenId(open ? null : m.id); }}>{open ? <ChevronDown size={15} aria-hidden="true" /> : <ChevronRight size={15} aria-hidden="true" />}</button></td>
                    <td title={m.company}>{m.company}</td>
                    <td title={m.subject}>{m.subject}</td>
                    <td title={m.to_email}>{m.to_email}</td>
                    <td><span className="admin-status">{MESSAGE_LABELS[m.status]}{m.replied_at ? ', replied' : ''}</span></td>
                    <td>{formatDateTime(m.sent_at || m.approved_at || m.created_at)}</td>
                  </tr>
                  {open ? <tr className="lead-reply-row"><td colSpan={6}><MessageDetail m={m} canSend={overview?.can_change} onChanged={load} /></td></tr> : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Settings --------------------------------------------------------------------
export function LeadFinderSettings() {
  const { data, error, load } = useOverview();
  const [form, setForm] = useState(null);
  const [state, setState] = useState('');
  const [problem, setProblem] = useState('');
  const [never, setNever] = useState(null);
  const [neverValue, setNeverValue] = useState('');

  useEffect(() => {
    if (data) setForm({ ...data.settings, home_region: (data.settings.home_region || []).join(', ') });
  }, [data]);
  const loadNever = useCallback(() => { call('/suppressions').then((d) => setNever(d.suppressions)).catch(() => setNever([])); }, []);
  useEffect(loadNever, [loadNever]);

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!form) return <p className="admin-muted">Loading…</p>;
  const can = data.can_change;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setState('saving');
    setProblem('');
    try {
      await call('/settings', 'PUT', { ...form, home_region: String(form.home_region).split(',').map((s) => s.trim()).filter(Boolean) });
      setState('saved');
      load();
    } catch (e) {
      setProblem(e.message);
      setState('');
    }
  }

  return (
    <div className="leadfinder ads-rules">
      {!can ? <p className="admin-muted">Only an administrator can change these.</p> : null}
      <fieldset className="ads-caps" disabled={!can}>
        <legend>Sending</legend>
        <label className="form-editor-check"><input type="checkbox" checked={Boolean(form.sending)} onChange={(e) => set('sending', e.target.checked)} /> Send approved emails (off: nothing is sent)</label>
        <div className="ads-form-row">
          <label className="form-editor-label">Most emails a day<input type="number" min={1} max={200} value={form.daily_limit} onChange={(e) => set('daily_limit', e.target.value)} /></label>
          <label className="form-editor-label">From (hour, Melbourne)<input type="number" min={0} max={23} value={form.hours_from} onChange={(e) => set('hours_from', e.target.value)} /></label>
          <label className="form-editor-label">Until (hour)<input type="number" min={1} max={23} value={form.hours_to} onChange={(e) => set('hours_to', e.target.value)} /></label>
        </div>
        <p className="admin-muted">Emails only go Monday to Friday. Start low (20 a day) so mail providers trust the address.</p>
      </fieldset>
      <fieldset className="ads-caps" disabled={!can}>
        <legend>Who it is from (in every email, as the Spam Act requires)</legend>
        <div className="ads-form-row">
          <label className="form-editor-label">Sender name<input value={form.sender_name} onChange={(e) => set('sender_name', e.target.value)} /></label>
          <label className="form-editor-label">Business name<input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} /></label>
          <label className="form-editor-label">ABN<input value={form.abn} onChange={(e) => set('abn', e.target.value)} /></label>
        </div>
        <div className="ads-form-row">
          <label className="form-editor-label">Address<input value={form.address} onChange={(e) => set('address', e.target.value)} /></label>
          <label className="form-editor-label">Phone (optional)<input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label className="form-editor-label">Replies go to<input value={form.reply_to} onChange={(e) => set('reply_to', e.target.value)} /></label>
        </div>
      </fieldset>
      <fieldset className="ads-caps" disabled={!can}>
        <legend>What the AI knows about us</legend>
        <label className="form-editor-label">What we offer (the AI uses only this)<textarea rows={4} value={form.offer} onChange={(e) => set('offer', e.target.value)} /></label>
        <div className="ads-form-row">
          <label className="form-editor-label">Home states (score higher)<input value={form.home_region} onChange={(e) => set('home_region', e.target.value)} placeholder="VIC" /></label>
          <label className="form-editor-label">Websites read per run<input type="number" min={1} max={200} value={form.max_sites_per_run} onChange={(e) => set('max_sites_per_run', e.target.value)} /></label>
        </div>
      </fieldset>
      {problem ? <p className="form-error" role="alert">{problem}</p> : null}
      {can ? (
        <div className="admin-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save settings'}</button>
          {state === 'saved' ? <span className="admin-muted" role="status">Saved.</span> : null}
        </div>
      ) : null}

      <h3 className="admin-subheading">Never email</h3>
      <p className="admin-muted">Addresses and whole domains that must never get an email from the lead finder: everyone who unsubscribed, and any you add. Nothing on this list is ever sent to, and it is never cleared.</p>
      <div className="admin-actions">
        <input value={neverValue} onChange={(e) => setNeverValue(e.target.value)} placeholder="name@business.com.au or business.com.au" />
        <button type="button" className="btn btn-secondary btn-sm" disabled={!neverValue.trim()} onClick={async () => { await call('/suppressions', 'POST', { value: neverValue }); setNeverValue(''); loadNever(); }}>Add</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table admin-table-compact">
          <thead><tr><th>Address or domain</th><th>Why</th><th>Since</th></tr></thead>
          <tbody>
            {never && never.length === 0 ? <tr><td colSpan={3} className="admin-muted">Nobody yet.</td></tr> : null}
            {(never || []).map((s) => <tr key={s.id}><td>{s.value}</td><td>{s.reason === 'unsubscribed' ? 'Unsubscribed' : s.note || 'Added by staff'}</td><td>{formatDateTime(s.created_at)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
