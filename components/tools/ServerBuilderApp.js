'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProjectState } from '@/components/tools/ToolProjectFrame';
import {
  baseOf, baysFor, cagesFor, checks, defaults, driveFormsFor, partsCsv, partsList, partsText, powerEstimate, restore,
  socketsFor, storageSummary, suggestedAccessories,
} from '@/lib/serverBuilderEngine';

// Server builder (Robert, 19 November 2026): choose an HPE ProLiant (Dell PowerEdge later) and its options, see what
// fits, and finish with a parts list to send for a quote. Options come from the maker's QuickSpecs (backend
// services/server_builder.py). No prices.
const list = (v) => (Array.isArray(v) ? v : []);
const opt = (item) => item.part ? `${item.label} (${item.part})` : item.label;

function Select({ id, label, value, onChange, items, none, keyOf = (i) => i.part, hint }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {none ? <option value="">{none}</option> : null}
        {items.map((i) => <option key={keyOf(i)} value={keyOf(i)}>{opt(i)}</option>)}
      </select>
      {hint ? <small className="sb-hint">{hint}</small> : null}
    </div>
  );
}

function Rows({ title, rows, items, onChange, addLabel, empty }) {
  const update = (n, field, value) => onChange(rows.map((r, i) => (i === n ? { ...r, [field]: value } : r)));
  return (
    <>
      <h2>{title}</h2>
      {rows.length ? null : <p className="sb-hint">{empty}</p>}
      {rows.map((row, n) => (
        <div className="calculator-row sb-row" key={n}>
          <div className="field">
            <label htmlFor={`${title}-${n}`}>{title.replace(/s$/, '')} {n + 1}</label>
            <select id={`${title}-${n}`} value={row.part} onChange={(e) => update(n, 'part', e.target.value)}>
              {items.map((i) => <option key={i.part} value={i.part}>{opt(i)}</option>)}
            </select>
          </div>
          <div className="field sb-qty">
            <label htmlFor={`${title}-qty-${n}`}>Quantity</label>
            <input id={`${title}-qty-${n}`} type="number" min="1" max="48" value={row.qty}
              onChange={(e) => update(n, 'qty', Math.max(1, Math.min(48, parseInt(e.target.value, 10) || 1)))} />
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => onChange(rows.filter((_, i) => i !== n))}>Remove</button>
        </div>
      ))}
      {items.length ? (
        <button type="button" className="btn btn-secondary sb-add" onClick={() => onChange([...rows, { part: items[0].part, qty: 1 }])}>{addLabel}</button>
      ) : null}
    </>
  );
}

export default function ServerBuilderApp({ models }) {
  const [slug, setSlug] = useState(models[0]?.slug || '');
  const model = models.find((m) => m.slug === slug) || models[0];
  const [state, setState] = useState(() => (model ? defaults(model) : {}));
  const [copied, setCopied] = useState(false);

  useProjectState(state, (saved) => {
    const m = models.find((x) => x.slug === saved?.slug);
    if (!m) return;
    setSlug(m.slug);
    setState(restore(m, saved));
  });

  // Kits the new choices call for are ticked; a kit the visitor unticked stays unticked.
  const set = (patch) => setState((s) => {
    const next = { ...s, ...patch };
    const extras = { ...(next.extras || {}) };
    for (const part of suggestedAccessories(model, next)) if (!(part in extras)) extras[part] = true;
    return { ...next, extras };
  });

  const base = baseOf(model, state.baseId);
  const forms = useMemo(() => (model ? driveFormsFor(model, base) : new Set()), [model, base]);
  if (!model) return <p>The server builder is being updated. Please check back soon.</p>;

  const sockets = socketsFor(model, base);
  const result = checks(model, state);
  const rows = partsList(model, state);
  const storage = storageSummary(model, state);
  const watts = powerEstimate(model, state);
  // Drives that fit the bays already there come first, so Add drives starts with one that fits.
  const bays = baysFor(model, state);
  const drives = list(model.drives).filter((d) => !forms.size || forms.has(d.form))
    .sort((a, b) => (bays[a.form] ? 0 : 1) - (bays[b.form] ? 0 : 1));
  const suggested = new Set(suggestedAccessories(model, state));
  const otherKits = list(model.accessories).filter((a) => !suggested.has(a.part));
  const valid = list(model.memory_rules?.valid_counts_per_cpu);
  const memCounts = valid.length ? valid : [1, 2, 4, 8];
  const psuMax = Math.max(1, Number(base?.psu_slots) || Number(model.psu_rules?.max) || 1);

  const changeModel = (next) => {
    const m = models.find((x) => x.slug === next);
    if (!m) return;
    setSlug(m.slug);
    setState(defaults(m));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(partsText(model, rows));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const blob = new Blob([partsCsv(rows)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${model.slug}-parts.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="section calculator-section">
      <div className="container calculator sb">
        <Select id="sb-model" label="Server" value={model.slug} onChange={changeModel} keyOf={(m) => m.slug} hint={model.summary}
          items={models.map((m) => ({ slug: m.slug, label: `${m.maker} ${m.model}${m.form ? ` (${m.form})` : ''}` }))} />
        <Select id="sb-base" label="Chassis" value={state.baseId} onChange={(v) => set({ baseId: v, cages: {}, drives: [] })}
          items={list(model.bases)} keyOf={(b) => b.id} hint={base?.notes} />

        <h2>Processor and memory</h2>
        <Select id="sb-cpu" label="Processor" value={state.cpuPart} onChange={(v) => set({ cpuPart: v })} items={list(model.cpus)} />
        {sockets > 1 ? (
          <div className="field">
            <label htmlFor="sb-cpuqty">Processors</label>
            <select id="sb-cpuqty" value={state.cpuQty} onChange={(e) => set({ cpuQty: Number(e.target.value) })}>
              {Array.from({ length: sockets }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ) : null}
        <Select id="sb-mem" label="Memory module" value={state.memPart} onChange={(v) => set({ memPart: v })} items={list(model.memory)} />
        <div className="field">
          <label htmlFor="sb-memqty">Memory modules per processor</label>
          <select id="sb-memqty" value={state.memPerCpu} onChange={(e) => set({ memPerCpu: Number(e.target.value) })}>
            {memCounts.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {model.memory_rules?.notes ? <small className="sb-hint">{model.memory_rules.notes}</small> : null}
        </div>

        <h2>Drive bays</h2>
        {cagesFor(model, base).length ? cagesFor(model, base).map((cage) => (
          <div className="field" key={cage.part}>
            <label htmlFor={`sb-cage-${cage.part}`}>{cage.label}</label>
            <select id={`sb-cage-${cage.part}`} value={state.cages?.[cage.part] || 0}
              onChange={(e) => set({ cages: { ...state.cages, [cage.part]: Number(e.target.value) } })}>
              <option value={0}>Not fitted</option>
              <option value={1}>Fitted ({cage.part})</option>
            </select>
            {cage.notes ? <small className="sb-hint">{cage.notes}</small> : null}
          </div>
        )) : <p className="sb-hint">This chassis has its bays built in.</p>}

        <Rows title="Drives" rows={state.drives || []} items={drives} onChange={(v) => set({ drives: v })}
          addLabel="Add drives" empty="No drives yet. Add the drives for recordings or data; boot drives are chosen below." />

        <h2>Storage and boot</h2>
        <Select id="sb-ctrl" label="Storage controller (RAID)" value={state.controller} onChange={(v) => set({ controller: v })}
          items={list(model.controllers)} keyOf={(c) => c.part || c.label} none="None"
          hint={list(model.controllers).find((c) => (c.part || c.label) === state.controller)?.notes} />
        <Select id="sb-boot" label="Boot device" value={state.boot} onChange={(v) => set({ boot: v })} items={list(model.boot)} none="None (boot from the drives)" />

        <Rows title="Network cards" rows={state.nics || []} items={list(model.nics)} onChange={(v) => set({ nics: v })}
          addLabel="Add a network card" empty="The server's own management port is always included. Add network cards for cameras and users." />

        <h2>Power and extras</h2>
        <Select id="sb-psu" label="Power supply" value={state.psuPart} onChange={(v) => set({ psuPart: v })} items={list(model.psus)}
          hint={model.psu_rules?.notes} />
        <div className="field">
          <label htmlFor="sb-psuqty">Power supplies</label>
          <select id="sb-psuqty" value={state.psuQty} onChange={(e) => set({ psuQty: Number(e.target.value) })}>
            {Array.from({ length: psuMax }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}{n === 2 ? ' (redundant)' : ''}</option>)}
          </select>
        </div>
        {list(model.management).length ? <Select id="sb-mgmt" label="Remote management licence" value={state.management} onChange={(v) => set({ management: v })} items={list(model.management)} none="Standard (no licence)" /> : null}
        {list(model.rails).length ? <Select id="sb-rails" label={/tower/i.test(model.form || '') ? 'Rack conversion' : 'Rail kit'} value={state.rails} onChange={(v) => set({ rails: v })} items={list(model.rails)} none="None" /> : null}
        {list(model.support).filter((s) => s.part).length ? <Select id="sb-support" label="Support" value={state.support} onChange={(v) => set({ support: v })} items={list(model.support).filter((s) => s.part)} none="Standard warranty" /> : null}

        {list(model.accessories).length ? (
          <details className="sb-kits" open={suggested.size > 0}>
            <summary>Kits and cables ({Object.values(state.extras || {}).filter(Boolean).length} chosen)</summary>
            <p className="sb-hint">Kits your choices call for are ticked. {model.maker}&apos;s own configurator confirms the exact cables when we quote.</p>
            {[...list(model.accessories).filter((a) => suggested.has(a.part)), ...otherKits].map((a) => (
              <label className="sb-kit" key={a.part}>
                <input type="checkbox" checked={!!state.extras?.[a.part]}
                  onChange={(e) => setState((s) => ({ ...s, extras: { ...s.extras, [a.part]: e.target.checked } }))} />
                <span><strong>{a.part}</strong> {a.label}{a.needed_when ? <em> {a.needed_when}</em> : null}</span>
              </label>
            ))}
          </details>
        ) : null}

        <div className="calculator-results">
          <h2>Your server</h2>
          <p>Server: <strong>{model.maker} {model.model}</strong></p>
          <p>Raw storage: <strong>{storage.raw} TB</strong> on {storage.drives} drive{storage.drives === 1 ? '' : 's'}</p>
          <p>Estimated power draw: <strong>about {watts} W</strong></p>
          {result.errors.map((e) => <p className="form-note-banner sb-error" key={e}>{e}</p>)}
          {result.warnings.map((w) => <p className="form-note sb-warn" key={w}>{w}</p>)}
          {!result.errors.length ? <p className="form-note">This build passes the rules we check. {model.maker}&apos;s configurator checks it again when we quote.</p> : null}

          <h2>Parts list</h2>
          {rows.map((r) => (
            <p key={r.part} className="sb-part">{r.group}: <strong>{r.qty} x {r.part}</strong> {r.label}</p>
          ))}
          <div className="sb-actions print-hide">
            <button type="button" className="btn btn-primary" onClick={copy}>{copied ? 'Copied' : 'Copy parts list'}</button>
            <button type="button" className="btn btn-secondary" onClick={download}>Download (Excel CSV)</button>
            <Link className="btn btn-secondary" href="/contact">Ask us for a quote</Link>
          </div>
          <p className="form-note">
            Paste the parts list into your message and we&apos;ll price it. Options are from {model.maker}&apos;s QuickSpecs
            ({model.quickspecs_version}), checked weekly. Need help with drive sizes? Try the{' '}
            <Link href="/tools/cctv-storage-calculator">CCTV storage calculator</Link>.
          </p>
        </div>

        {list(model.rules).length ? (
          <details className="sb-rules">
            <summary>{model.maker}&apos;s configuration rules for the {model.model}</summary>
            <ul>{list(model.rules).map((r) => <li key={r}>{r}</li>)}</ul>
          </details>
        ) : null}
        <p className="sb-hint">{model.maker === 'HPE' ? 'HPE and ProLiant are trademarks of Hewlett Packard Enterprise.' : `${model.maker} is a trademark of its owner.`} Prices are not shown; we quote each build.</p>
      </div>
    </div>
  );
}
