'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { DEFAULTS, DISCLAIMER, GST_RATE, ILLUSTRATIVE, arithmetic, costAndNet, money, rowSaving } from '@/lib/savings';

// The savings calculator (Robert, 3 November 2026): the visitor picks Departments, enters
// each team's size and the share of its work they expect to hand over, and the cost of one
// person. Every starting figure is labelled illustrative and the working is shown. Prices
// only arrive (prices prop) once Robert has approved publishing them; until then no cost,
// net saving or payback is shown.
let nextId = 1;

export default function SavingsCalculator({ departments, prices = null, initial = null }) {
  const first = departments.find((d) => d.slug === (initial?.department || 'finance')) || departments[0];
  const [cost, setCost] = useState(String(initial?.costPerPerson ?? DEFAULTS.costPerPerson));
  const [rows, setRows] = useState(() => [
    { id: nextId++, department: first?.slug || '', teamSize: String(initial?.teamSize ?? DEFAULTS.teamSize), sharePercent: String(initial?.sharePercent ?? DEFAULTS.sharePercent) },
  ]);

  const update = (id, changes) => setRows((list) => list.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  const results = rows.map((r) => ({ row: r, ...rowSaving({ ...r, costPerPerson: cost }) }));
  const total = results.reduce((s, r) => s + r.saving, 0);
  const people = results.reduce((s, r) => s + r.people, 0);
  const priced = costAndNet(rows.map((r) => r.department), total, prices);
  const nameOf = (slug) => departments.find((d) => d.slug === slug)?.name || slug;

  return (
    <div className="calculator savings-calculator">
      <div className="field">
        <label htmlFor="savings-cost">Yearly cost of one person, all-in (A$)</label>
        <input id="savings-cost" type="text" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} />
        <p className="form-note">Wages, super, leave, desk and overheads. {ILLUSTRATIVE}</p>
      </div>

      {rows.map((r, i) => (
        <fieldset className="savings-row" key={r.id}>
          <legend>Department {rows.length > 1 ? i + 1 : ''}</legend>
          <div className="savings-row-fields">
            <div className="field">
              <label htmlFor={`savings-dept-${r.id}`}>Department</label>
              <select id={`savings-dept-${r.id}`} value={r.department} onChange={(e) => update(r.id, { department: e.target.value })}>
                {departments.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`savings-team-${r.id}`}>People in that team today</label>
              <input id={`savings-team-${r.id}`} type="number" min="0" step="1" value={r.teamSize} onChange={(e) => update(r.id, { teamSize: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor={`savings-share-${r.id}`}>Share of their work handed to the Department (%)</label>
              <input id={`savings-share-${r.id}`} type="number" min="0" max="100" step="5" value={r.sharePercent} onChange={(e) => update(r.id, { sharePercent: e.target.value })} />
            </div>
          </div>
          <p className="savings-working">{nameOf(r.department)}: {arithmetic({ ...r, costPerPerson: cost })}</p>
          {rows.length > 1 ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRows((list) => list.filter((x) => x.id !== r.id))}>
              <Trash2 size={14} aria-hidden="true" /> Remove
            </button>
          ) : null}
        </fieldset>
      ))}
      <p className="form-note">The team sizes and shares start at {DEFAULTS.teamSize} people and {DEFAULTS.sharePercent}%. {ILLUSTRATIVE}</p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setRows((list) => [...list, { id: nextId++, department: departments.find((d) => !list.some((x) => x.department === d.slug))?.slug || first?.slug, teamSize: String(DEFAULTS.teamSize), sharePercent: String(DEFAULTS.sharePercent) }])}
      >
        <Plus size={16} aria-hidden="true" /> Add another Department
      </button>

      <div className="savings-result" aria-live="polite">
        <p className="savings-result-label">Your estimate: the yearly cost of the work handed over</p>
        <p className="savings-result-value">{money(total)}</p>
        <p className="admin-muted">On your figures: about {Number.isInteger(people) ? people : people.toFixed(1)} {people === 1 ? 'person' : 'people'}&apos;s work a year, if the Departments take on the share you entered. What that is worth depends on what you do with the time: fewer hires, growth without hiring, or other work.</p>
        {priced.yearlyCost != null ? (
          <p>
            The Departments cost {money(priced.yearlyCost * (1 + GST_RATE))} a year including GST ({money(priced.yearlyCost)} ex GST
            {priced.discount ? `, with a ${priced.discount * 100}% bundle discount` : ''}). Against your estimate that leaves{' '}
            <strong>{money(priced.net)}</strong> before GST{priced.paybackMonths != null ? `; on your figures the cost equals about ${priced.paybackMonths} months of the estimate` : ''}.
          </p>
        ) : null}
      </div>
      <p className="savings-disclaimer">{DISCLAIMER}</p>
    </div>
  );
}
