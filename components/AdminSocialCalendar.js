'use client';

import { useEffect, useState } from 'react';

import { DAY_NAMES, melbourneDate, melbourneTime, monthGrid } from '@/lib/calendarDays';

// The posting calendar: what is scheduled and sent, month by month, and how
// often each network may get a post (Add to queue on Posting follows it).
const SHORT = { linkedin: 'in', facebook: 'fb', instagram: 'ig', x: 'x', email: 'email' };

function thisMonth() {
  const [year, month] = melbourneDate(new Date().toISOString()).split('-').map(Number);
  return { year, month };
}

function toForm(rule) {
  return { ...rule, times: (rule.times || []).join(', ') };
}

export default function AdminSocialCalendar({ initialCadence, loadError }) {
  const [{ year, month }, setMonth] = useState(thisMonth);
  const [items, setItems] = useState([]);
  const [calendarError, setCalendarError] = useState('');
  const [rules, setRules] = useState((initialCadence || []).map(toForm));
  const [error, setError] = useState(loadError || '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const weeks = monthGrid(year, month);
  const first = weeks[0][0].date;
  const title = new Date(Date.UTC(year, month - 1, 15)).toLocaleString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  useEffect(() => {
    let cancelled = false;
    setCalendarError('');
    fetch(`/api/admin/social/calendar?start=${first}&days=${weeks.length * 7}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (response.ok && Array.isArray(data)) setItems(data);
        else setCalendarError(data.error || 'The calendar could not be loaded.');
      })
      .catch(() => { if (!cancelled) setCalendarError('The calendar could not be loaded.'); });
    return () => { cancelled = true; };
  }, [first, weeks.length]);

  function step(delta) {
    setMonth(({ year: y, month: m }) => {
      const index = y * 12 + (m - 1) + delta;
      return { year: Math.floor(index / 12), month: (index % 12) + 1 };
    });
  }

  function change(network, field, value) {
    setRules((current) => current.map((r) => (r.network === network ? { ...r, [field]: value } : r)));
  }

  function toggleDay(network, day) {
    setRules((current) => current.map((r) => {
      if (r.network !== network) return r;
      const days = r.days.includes(day) ? r.days.filter((d) => d !== day) : [...r.days, day];
      return { ...r, days: days.sort((a, b) => a - b) };
    }));
  }

  async function save() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const body = rules.map((r) => ({
        network: r.network,
        enabled: Boolean(r.enabled),
        max_per_day: Number(r.max_per_day),
        max_per_week: Number(r.max_per_week),
        min_gap_hours: Number(r.min_gap_hours),
        days: r.days,
        times: String(r.times).split(',').map((t) => t.trim()).filter(Boolean),
      }));
      const response = await fetch('/api/admin/social/cadence', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The settings were not saved.');
      setRules(data.map(toForm));
      setNotice('Saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-social">
      <div className="admin-card">
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => step(-1)} aria-label="Previous month">◀</button>
          <h3>{title}</h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => step(1)} aria-label="Next month">▶</button>
        </div>
        {calendarError && <p className="form-error" role="alert">{calendarError}</p>}
        <table className="posting-calendar">
          <thead>
            <tr>{DAY_NAMES.map((d) => <th key={d}>{d}</th>)}</tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0].date}>
                {week.map((day) => (
                  <td key={day.date}>
                    <span className={day.inMonth ? '' : 'admin-muted'}>{Number(day.date.slice(8))}</span>
                    {items.filter((item) => melbourneDate(item.when) === day.date).map((item) => (
                      <div key={item.id} className={`posting-cal-item is-${item.status}`} title={item.title}>
                        {melbourneTime(item.when)} {item.title} · {(item.channels || []).map((c) => SHORT[c] || c).join(' · ')}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="admin-muted">Green: sent. Amber: scheduled. Red: failed.</p>
      </div>

      <form className="admin-form admin-card" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <h3>How often</h3>
        <p className="admin-muted">Add to queue on Posting picks the next time that suits every ticked network. Times are Melbourne time.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="form-note-banner" role="status">{notice}</p>}
        {rules.map((rule) => (
          <div key={rule.network} className="posting-cadence-row">
            <label className="admin-check">
              <input type="checkbox" checked={Boolean(rule.enabled)} onChange={(e) => change(rule.network, 'enabled', e.target.checked)} />
              <strong>{rule.label}</strong>
            </label>
            <label>
              Most a day
              <input type="number" min={1} max={10} value={rule.max_per_day} onChange={(e) => change(rule.network, 'max_per_day', e.target.value)} />
            </label>
            <label>
              Most a week
              <input type="number" min={1} max={50} value={rule.max_per_week} onChange={(e) => change(rule.network, 'max_per_week', e.target.value)} />
            </label>
            <label>
              Hours between posts
              <input type="number" min={0} max={336} value={rule.min_gap_hours} onChange={(e) => change(rule.network, 'min_gap_hours', e.target.value)} />
            </label>
            <fieldset className="posting-days">
              <legend>Days</legend>
              {DAY_NAMES.map((name, index) => (
                <label key={name} className="admin-check">
                  <input type="checkbox" checked={rule.days.includes(index)} onChange={() => toggleDay(rule.network, index)} />
                  {name}
                </label>
              ))}
            </fieldset>
            <label>
              Times
              <input value={rule.times} onChange={(e) => change(rule.network, 'times', e.target.value)} placeholder="09:30, 13:00" />
            </label>
          </div>
        ))}
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </section>
  );
}
