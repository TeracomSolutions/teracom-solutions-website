'use client';

import { useState } from 'react';

import {
  API_MODELS, CHECKED, DEFAULT_AUD_PER_USD, GROK_SEATS_NOTE, PRESETS, SEAT_PLANS, WORK_DAYS_PER_MONTH, WORKLOADS,
  apiMonthly, aud, cleanUsers, pricedDepartments, seatMonthly, teracomMonthly, tokens, windowDay,
} from '@/lib/aiPlanPrices';

// Teracom AI against Claude, ChatGPT and Grok (Robert, 20 November 2026). lib/aiPlanPrices.js
// holds every price with its source and the date it was read.
const DAY_START = 8;
const clock = (h) => {
  const t = DAY_START + h;
  const hour = Math.floor(t);
  const min = Math.round((t - hour) * 60);
  const h12 = ((hour + 11) % 12) + 1;
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''}${hour < 12 ? 'am' : 'pm'}`;
};

function DayBar({ label, day, note }) {
  return (
    <div className="aicmp-day">
      <div className="aicmp-day-label"><strong>{label}</strong><span>{note}</span></div>
      <div className="aicmp-day-track" role="img" aria-label={`${label}: ${note}`}>
        {day.parts.map((p) => (
          <span key={`${p.from}-${p.kind}`} className={`aicmp-day-${p.kind}`} style={{ width: `${((p.to - p.from) / 10) * 100}%` }}
            title={`${clock(p.from)} to ${clock(p.to)}: ${p.kind === 'work' ? 'working' : 'waiting for the limit to reset'}`} />
        ))}
      </div>
    </div>
  );
}

function CostRows({ rows, teracom }) {
  const all = teracom ? [...rows, teracom] : rows;
  const top = Math.max(...all.map((r) => r.cost), 1);
  const sorted = [...all].sort((a, b) => a.cost - b.cost);
  return (
    <ul className="aicmp-rows">
      {sorted.map((r) => (
        <li key={r.id} className={r.id === 'teracom' ? 'aicmp-row aicmp-row-teracom' : 'aicmp-row'}>
          <div className="aicmp-row-head">
            <span className="aicmp-row-name">{r.name}</span>
            <span className="aicmp-row-cost">{aud(r.cost)}<small> a month</small></span>
          </div>
          <div className="aicmp-bar"><span style={{ width: `${Math.max(1, (r.cost / top) * 100)}%` }} /></div>
          <p className="aicmp-row-note">
            {r.note}
            {r.source ? <> · <a href={r.source} target="_blank" rel="noopener noreferrer">source</a></> : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function AiCostComparison({ prices }) {
  const departments = pricedDepartments(prices);
  const [users, setUsers] = useState('5');
  const [chosen, setChosen] = useState(PRESETS[1].departments);
  const [tab, setTab] = useState('seats');
  const [billing, setBilling] = useState('monthly');
  const [rate, setRate] = useState(String(DEFAULT_AUD_PER_USD));
  const [workload, setWorkload] = useState('steady');
  const [inputPerDay, setInputPerDay] = useState(String(WORKLOADS[1].input));
  const [outputPerDay, setOutputPerDay] = useState(String(WORKLOADS[1].output));
  const [hours, setHours] = useState('2');

  if (!departments.length) return null;
  const people = cleanUsers(users);
  const teracom = teracomMonthly(chosen, prices);
  const teracomRow = {
    id: 'teracom', name: `Teracom AI, ${teracom.departments} ${teracom.departments === 1 ? 'Department' : 'Departments'}`, cost: teracom.total,
    note: `Base platform plus ${teracom.departments === 1 ? 'the Department' : 'the Departments'}${teracom.discount ? `, ${Math.round(teracom.discount * 100)}% bundle discount` : ''}, ex GST. Priced per Department, not per person. Runs on your own server, so there is no 5-hour window or weekly cap; your hardware sets the pace.`,
  };
  const toggle = (slug) => setChosen((list) => (list.includes(slug) ? (list.length > 1 ? list.filter((s) => s !== slug) : list) : [...list, slug]));
  const pickPreset = (p) => { setUsers(String(p.users)); setChosen(p.departments.filter((s) => departments.some((d) => d.slug === s))); };
  const pickWorkload = (w) => { setWorkload(w.id); setInputPerDay(String(w.input)); setOutputPerDay(String(w.output)); };

  const seatRows = SEAT_PLANS.map((p) => ({
    id: p.id, name: `${p.name} x ${people}`, cost: seatMonthly(p, people, billing, rate), source: p.source,
    note: `${p.currency === 'USD' ? `US$${billing === 'annual' && p.annual != null ? p.annual : p.monthly}` : `A$${billing === 'annual' && p.annual != null ? p.annual : p.monthly}`} a person a month${billing === 'annual' && p.annual == null ? ' (no yearly price)' : ''}. ${p.limits}.`,
  }));
  const apiRows = API_MODELS.map((m) => ({
    id: m.id, name: m.name, cost: apiMonthly(m, people, inputPerDay, outputPerDay, rate), source: m.source,
    note: `US$${m.input} in, US$${m.output} out per million tokens. No 5-hour window; the bill grows with every task.`,
  }));
  const pro = windowDay(hours);
  const max = windowDay(Number(hours) * 5);
  const open = { parts: [{ from: 0, to: 10, kind: 'open' }], worked: 10 };

  return (
    <div className="aicmp">
      <div className="aicmp-presets" role="group" aria-label="Examples">
        {PRESETS.map((p) => <button type="button" key={p.id} className="btn btn-secondary btn-sm" onClick={() => pickPreset(p)}>{p.name}</button>)}
      </div>
      <div className="aicmp-inputs">
        <div className="field">
          <label htmlFor="aicmp-users">People using AI</label>
          <input id="aicmp-users" type="number" min="1" step="1" value={users} onChange={(e) => setUsers(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="aicmp-rate">A$ for one US$</label>
          <input id="aicmp-rate" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          <p className="form-note">Change it to today&apos;s rate.</p>
        </div>
      </div>
      <fieldset className="aicmp-depts">
        <legend>Teracom AI Departments</legend>
        {departments.map((d) => (
          <label key={d.slug} className={chosen.includes(d.slug) ? 'aicmp-chip aicmp-chip-on' : 'aicmp-chip'}>
            <input type="checkbox" checked={chosen.includes(d.slug)} onChange={() => toggle(d.slug)} /> {d.name}
          </label>
        ))}
      </fieldset>

      <div className="aicmp-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'seats'} className={tab === 'seats' ? 'aicmp-tab aicmp-tab-on' : 'aicmp-tab'} onClick={() => setTab('seats')}>Chat subscriptions</button>
        <button type="button" role="tab" aria-selected={tab === 'api'} className={tab === 'api' ? 'aicmp-tab aicmp-tab-on' : 'aicmp-tab'} onClick={() => setTab('api')}>Pay per token (API)</button>
        <button type="button" role="tab" aria-selected={tab === 'day'} className={tab === 'day' ? 'aicmp-tab aicmp-tab-on' : 'aicmp-tab'} onClick={() => setTab('day')}>The 5-hour limit</button>
      </div>

      {tab === 'seats' ? (
        <div role="tabpanel">
          <div className="aicmp-toggle" role="group" aria-label="Billing">
            {['monthly', 'annual'].map((b) => (
              <button type="button" key={b} className={billing === b ? 'aicmp-tab aicmp-tab-on' : 'aicmp-tab'} onClick={() => setBilling(b)}>{b === 'monthly' ? 'Billed monthly' : 'Billed yearly'}</button>
            ))}
          </div>
          <CostRows rows={seatRows} teracom={teracomRow} />
          <p className="aicmp-note">{GROK_SEATS_NOTE}</p>
        </div>
      ) : null}

      {tab === 'api' ? (
        <div role="tabpanel">
          <div className="aicmp-presets" role="group" aria-label="How much each person uses">
            {WORKLOADS.map((w) => (
              <button type="button" key={w.id} className={workload === w.id ? 'aicmp-tab aicmp-tab-on' : 'aicmp-tab'} onClick={() => pickWorkload(w)} title={w.detail}>{w.name}</button>
            ))}
          </div>
          <div className="aicmp-inputs">
            <div className="field">
              <label htmlFor="aicmp-in">Tokens sent per person per working day</label>
              <input id="aicmp-in" type="number" min="0" step="10000" value={inputPerDay} onChange={(e) => { setWorkload(''); setInputPerDay(e.target.value); }} />
            </div>
            <div className="field">
              <label htmlFor="aicmp-out">Tokens returned per person per working day</label>
              <input id="aicmp-out" type="number" min="0" step="1000" value={outputPerDay} onChange={(e) => { setWorkload(''); setOutputPerDay(e.target.value); }} />
            </div>
          </div>
          <p className="aicmp-note">
            {tokens(Number(inputPerDay) || 0)} in and {tokens(Number(outputPerDay) || 0)} out x {people} {people === 1 ? 'person' : 'people'} x {WORK_DAYS_PER_MONTH} working days. About 1,000 tokens is 750 words; agents re-read files and tool results, so they use far more than chat. Illustrative, change it to match your team.
          </p>
          <CostRows rows={apiRows} teracom={teracomRow} />
          <p className="aicmp-note">Before prompt caching or batch discounts, which can lower the input cost.</p>
        </div>
      ) : null}

      {tab === 'day' ? (
        <div role="tabpanel">
          <div className="field aicmp-hours">
            <label htmlFor="aicmp-hours">Hours of heavy work before you hit the limit on Claude Pro: <strong>{hours}</strong></label>
            <input id="aicmp-hours" type="range" min="0.5" max="5" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} />
            <p className="form-note">Your own estimate. Anthropic does not publish hours or tokens for a session, only that a session lasts 5 hours from your first message and Max gives 5 times Pro.</p>
          </div>
          <DayBar label="Claude Pro" day={pro} note={`${pro.worked} hours working, ${pro.waiting} waiting`} />
          <DayBar label="Claude Max (5x)" day={max} note={`${max.worked} hours working, ${max.waiting} waiting`} />
          <DayBar label="Teracom AI on your server" day={open} note="10 hours working, no usage window" />
          <div className="aicmp-day" aria-hidden="true"><span /><div className="aicmp-axis"><span>8am</span><span>1pm</span><span>6pm</span></div></div>
          <p className="aicmp-legend"><span className="aicmp-key aicmp-day-work" /> Working <span className="aicmp-key aicmp-day-wait" /> Waiting for the limit to reset <span className="aicmp-key aicmp-day-open" /> Teracom AI</p>
          <p className="aicmp-note">A weekly limit applies on top. When you hit a limit you wait, or pay for extra usage.</p>
        </div>
      ) : null}

      <p className="savings-qualifier">
        Prices read from each provider&apos;s own page on {CHECKED}; they change, so check the source before you decide. Claude and Teracom AI figures are before GST; ChatGPT shows A$ prices to Australian visitors as listed. Teracom AI runs on your own server: the hardware is not included here. Claude, ChatGPT and Grok are trademarks of their owners, who do not endorse Teracom.
      </p>
    </div>
  );
}
