'use client';

import { useState } from 'react';
import { toolConfigs } from '@/lib/toolConfigs';

// Renders any calculator described in lib/toolConfigs.js: plain fields, an
// optional list of repeatable rows (devices, speakers...), and a results panel.
// Inputs are kept as the strings typed so decimals can be entered naturally.
export default function ConfigCalculator({ slug }) {
  const config = toolConfigs[slug];
  const [values, setValues] = useState(() => Object.fromEntries(config.fields.map((f) => [f.id, f.default])));
  const [rows, setRows] = useState(() => (config.rows ? config.rows.defaults.map((r, i) => ({ key: i + 1, ...r })) : []));

  const setValue = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));
  const setRowValue = (key, id) => (e) =>
    setRows((current) => current.map((r) => (r.key === key ? { ...r, [id]: e.target.value } : r)));
  const addRow = () =>
    setRows((current) => [...current, { key: current.reduce((max, r) => Math.max(max, r.key), 0) + 1, ...config.rows.blank }]);
  const removeRow = (key) => setRows((current) => current.filter((r) => r.key !== key));

  const result = config.compute(values, rows);
  const lines = config.results(result, values);

  const input = (id, type, value, onChange, step) => (
    <input
      id={id}
      type={type === 'text' ? 'text' : 'number'}
      min={type === 'text' ? undefined : '0'}
      step={type === 'text' ? undefined : step || 'any'}
      inputMode={type === 'text' ? undefined : 'decimal'}
      value={value}
      onChange={onChange}
    />
  );

  return (
    <div className="section calculator-section">
      <div className="container calculator">
        {config.fields.map((f) => (
          <div className="field" key={f.id}>
            <label htmlFor={`${slug}-${f.id}`}>{f.label}</label>
            {f.type === 'select' ? (
              <select id={`${slug}-${f.id}`} value={values[f.id]} onChange={setValue(f.id)}>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              input(`${slug}-${f.id}`, f.type, values[f.id], setValue(f.id), f.step)
            )}
            {f.hint ? <p className="form-note">{f.hint}</p> : null}
          </div>
        ))}

        {config.rows ? (
          <>
            <h2>{config.rows.label}</h2>
            {rows.map((r) => (
              <div className="calculator-row" key={r.key}>
                {config.rows.columns.map((c) => (
                  <div className="field" key={c.id}>
                    <label htmlFor={`${slug}-${c.id}-${r.key}`}>{c.label}</label>
                    {input(`${slug}-${c.id}-${r.key}`, c.type, r[c.id], setRowValue(r.key, c.id), c.step)}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => removeRow(r.key)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addRow}>
              {config.rows.addLabel}
            </button>
          </>
        ) : null}

        <div className="calculator-results">
          <h2>Results</h2>
          {lines.map((line, i) =>
            line.warn ? (
              <p className="form-note-banner" role="status" key={i}>{line.warn}</p>
            ) : (
              <p key={i}>
                {line.label}: <strong>{line.value}</strong>
              </p>
            )
          )}
          {config.note ? <p className="form-note">{config.note}</p> : null}
        </div>
      </div>
    </div>
  );
}
