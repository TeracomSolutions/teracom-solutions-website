'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ExternalLink, RotateCcw } from 'lucide-react';

// Resources > Product comparisons (Robert, 19 November 2026): competing products side by side, every fact from
// the maker's own website with a link to it. The table, rows and Help me choose questions come from the backend
// (services/comparisons.py), which checks each product against its maker's website every week.

const FIRST_SHOWN = 8;

export function fitScore(product, answers, questions) {
  let score = 0;
  let of = 0;
  const misses = [];
  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    of += 1;
    if ((product.fit?.[q.id] || []).includes(answer)) score += 1;
    else misses.push(q.miss);
  }
  return { score, of, misses };
}

export function formatChecked(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Melbourne' });
  } catch {
    return '';
  }
}

export default function ComparisonTable({ comparison }) {
  const { products, template } = comparison;
  const questions = template.questions || [];
  // Big comparisons (20 camera brands) open with the first eight; the rest are a tick away.
  const [shown, setShown] = useState(() => products.slice(0, FIRST_SHOWN).map((p) => p.id));
  const [answers, setAnswers] = useState({});
  const [group, setGroup] = useState('all');

  const columns = products.filter((p) => shown.includes(p.id));
  const asked = Object.values(answers).some(Boolean);
  const scores = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, fitScore(p, answers, questions)])),
    [products, answers, questions],
  );
  const best = asked && columns.length ? Math.max(...columns.map((p) => scores[p.id].score)) : 0;
  const groups = group === 'all' ? template.groups : template.groups.filter((g) => g.id === group);
  const checked = formatChecked(comparison.checked_at);

  // One scroll for the whole page (Robert, 19 November 2026: not "window in window"). When every column fits, the
  // table sits flat in the page and the product names stay under the site header as you scroll down; when it is
  // wider than the screen it only scrolls sideways.
  const box = useRef(null);
  const [fits, setFits] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const check = () => {
      const table = el.querySelector('table');
      setFits(!table || table.scrollWidth <= el.clientWidth + 1);
    };
    check();
    const watch = new ResizeObserver(check);
    watch.observe(el);
    return () => watch.disconnect();
  }, [shown]);

  function toggle(id) {
    setShown((s) => {
      if (s.includes(id)) return s.length > 1 ? s.filter((x) => x !== id) : s;
      return products.map((p) => p.id).filter((x) => x === id || s.includes(x));
    });
  }

  return (
    <div className="cmp">
      <div className="cmp-controls print-hide">
        <fieldset className="cmp-pick">
          <legend>Compare</legend>
          {products.length > FIRST_SHOWN ? (
            <span className="cmp-pick-all">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShown(products.map((p) => p.id))}>Show all {products.length}</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShown(products.slice(0, FIRST_SHOWN).map((p) => p.id))}>First {FIRST_SHOWN}</button>
            </span>
          ) : null}
          {products.map((p) => {
            const on = shown.includes(p.id);
            return (
              <label key={p.id} className={on ? 'cmp-chip is-on' : 'cmp-chip'}>
                <input type="checkbox" checked={on} onChange={() => toggle(p.id)} />
                {on ? <Check size={14} aria-hidden="true" /> : null}
                {p.name}
              </label>
            );
          })}
        </fieldset>

        {questions.length ? (
          <fieldset className="cmp-help">
            <legend>Help me choose</legend>
            <div className="cmp-questions">
              {questions.map((q) => (
                <label key={q.id} htmlFor={`cmp-q-${q.id}`}>
                  {q.label}
                  <select id={`cmp-q-${q.id}`} value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}>
                    <option value="">Doesn&apos;t matter</option>
                    {q.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
            {asked ? (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAnswers({})}>
                <RotateCcw size={14} aria-hidden="true" /> Clear answers
              </button>
            ) : null}
          </fieldset>
        ) : null}

        <label className="cmp-section-pick" htmlFor="cmp-section">
          Show
          <select id="cmp-section" value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Everything</option>
            {template.groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </label>
      </div>

      {fits ? null : <p className="cmp-swipe print-hide">Scroll sideways for more products →</p>}
      <div ref={box} className={fits ? 'cmp-scroll fits' : 'cmp-scroll'} role="region" aria-label={`${comparison.title} table`} tabIndex={fits ? undefined : 0}>
        <table className="cmp-table" style={{ minWidth: `${140 + columns.length * 155}px` }}>
          <thead>
            <tr>
              <th scope="col" className="cmp-rowhead"><span className="sr-only">Feature</span></th>
              {columns.map((p) => {
                const fit = scores[p.id];
                const top = asked && fit.score === best && best > 0;
                return (
                  <th key={p.id} scope="col" className={top ? 'cmp-best' : undefined}>
                    <span className="cmp-name">{p.name}</span>
                    <span className="cmp-maker">{p.maker}</span>
                    {asked ? (
                      <span className={top ? 'cmp-fit is-top' : 'cmp-fit'}>{top ? 'Best fit' : `${fit.score} of ${fit.of} match`}</span>
                    ) : null}
                    {asked && fit.misses.length ? <span className="cmp-miss">{fit.misses.join('; ')}</span> : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.id}>
              <tr className="cmp-group">
                <th scope="rowgroup" colSpan={columns.length + 1}>{g.title}</th>
              </tr>
              {g.rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row" className="cmp-rowhead">{row.label}</th>
                  {columns.map((p) => {
                    const cell = p.facts?.[row.key];
                    return (
                      <td key={p.id}>
                        {cell?.text || 'Not stated by the maker'}
                        {cell?.source ? (
                          <a className="cmp-source print-hide" href={cell.source} target="_blank" rel="noopener noreferrer"
                            aria-label={`Source: ${p.name}, ${row.label}`} title="Where this comes from">
                            <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <p className="form-note cmp-note">
        Taken from each maker&apos;s own website and datasheets{checked ? ` and last checked on ${checked}` : ''}; we check
        them every week. The <ExternalLink size={12} aria-hidden="true" /> link beside an entry opens where it came from.
        &ldquo;Best suited to&rdquo; is our own view. Makers change editions and licensing often, so confirm the details
        for your project with us before you buy.
      </p>
    </div>
  );
}
