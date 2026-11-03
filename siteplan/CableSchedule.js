'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

import { DROP_METRES, cableSchedules, schedulesCsv } from './cables.js';

// The cable schedules under the plan (Robert, 2026-11-03): one tab per system,
// each run with its cable and length, the totals to order, and a spreadsheet of
// one system or all of them. Clicking a row opens that device for changes.
export default function CableSchedule({ plan, selected, onSelect, onDownload }) {
  const [tab, setTab] = useState('');
  const schedules = cableSchedules(plan);
  if (!schedules.length) return null;
  const current = schedules.find((s) => s.system === tab) || schedules[0];
  const csv = (list) => new Blob([schedulesCsv(list)], { type: 'text/csv;charset=utf-8' });

  return (
    <div className="site-planner-schedule site-planner-cables">
      <h2>Cable schedules</h2>
      <div className="site-planner-tabs" role="tablist" aria-label="Cable schedule for each system">
        {schedules.map((s) => (
          <button
            key={s.system}
            type="button"
            role="tab"
            aria-selected={s === current}
            className={s === current ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setTab(s.system)}
          >
            {s.label} ({s.rows.length})
          </button>
        ))}
      </div>
      {!(plan.pxPerMetre > 0) ? <p className="form-note-banner">Set the scale on the plan to work out the cable lengths.</p> : null}
      {current.note ? <p className="site-planner-summary">{current.note}</p> : null}
      <div className="site-planner-table">
        <table>
          <thead>
            <tr><th>Cable</th><th>From</th><th>To</th><th>Cable type</th><th>Runs</th><th>Each</th><th>Total</th></tr>
          </thead>
          <tbody>
            {current.rows.map((r) => (
              <tr key={r.id} className={r.deviceId === selected ? 'active' : undefined} onClick={() => onSelect(r.deviceId)}>
                <td>{r.id}</td>
                <td>{r.from}</td>
                <td>{r.to || <span className="site-planner-missing">{r.note}</span>}</td>
                <td>{r.cableLabel}</td>
                <td>{r.runs}</td>
                <td>{r.each ? `${r.each} m` : '--'}</td>
                <td>{r.total ? `${r.total} m` : '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="site-planner-totals" aria-label={`${current.label} cable to order`}>
        {current.totals.map((t) => (
          <li key={t.cable}>
            <strong>{t.label}</strong>: {t.runs} {t.runs === 1 ? 'run' : 'runs'}
            {t.metres ? `, ${t.metres} m${t.boxes ? ` (${t.boxes} x ${t.box} m ${t.boxes === 1 ? 'box' : 'boxes'})` : ''}` : ''}
          </li>
        ))}
      </ul>
      <div className="site-planner-row">
        <button type="button" className="btn btn-secondary" onClick={() => onDownload(csv([current]), current.label)}>
          <Download size={16} strokeWidth={2} aria-hidden="true" /> {current.label} schedule (CSV)
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onDownload(csv(schedules), 'all')}>
          <Download size={16} strokeWidth={2} aria-hidden="true" /> All cable schedules (CSV)
        </button>
      </div>
      <p className="form-note">
        Each device is cabled to the nearest head end of its system: cameras to the recorder (or a switch), detectors, keypads and
        sirens to the alarm panel, readers, locks and exit buttons to the door controller, network devices to the switch or rack, and
        speakers to the amplifier. Lengths follow the walls and ceiling (across, then along), plus {DROP_METRES} m for the drops and
        terminations and 10% spare. Click a row to change a device&apos;s cable, where it runs to, the number of runs or extra metres.
      </p>
    </div>
  );
}
