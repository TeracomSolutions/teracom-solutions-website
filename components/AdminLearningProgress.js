'use client';

import { CheckCircle2, Circle, CircleDashed, LoaderCircle, XCircle } from 'lucide-react';

// One live progress card on the Support page (Robert, 2026-11-03: "I need feedback"):
// the overall bar, the step it is on with its own count, what it is reading right
// now, every step ticked off as it finishes, and the latest lines of its log. The
// page polls the backend every few seconds while a run is going, so nothing needs
// a refresh. state comes from services/support_progress.py on the backend.
const STATUS = { running: 'Running', ok: 'Finished', failed: 'Stopped', starting: 'Starting' };
const STEP_ICON = { done: CheckCircle2, running: LoaderCircle, failed: XCircle, skipped: CircleDashed, waiting: Circle };
const STALE_SECONDS = 180;

function seconds(from, to) {
  const a = Date.parse(from || '');
  const b = typeof to === 'number' ? to : Date.parse(to || '');
  return Number.isFinite(a) && Number.isFinite(b) ? Math.max(0, Math.round((b - a) / 1000)) : null;
}

export function duration(total) {
  if (total == null) return '';
  if (total < 60) return `${total} s`;
  const m = Math.floor(total / 60);
  if (m < 60) return `${m} min ${total % 60} s`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

const time = (iso) => {
  const d = new Date(iso || '');
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: 'Australia/Melbourne' });
};

export default function AdminLearningProgress({ title, state, now }) {
  if (!state) {
    return (
      <section className="learning-progress">
        <div className="learning-progress-head">
          <h3>{title}</h3>
          <span className="admin-pill">Not run since progress was added</span>
        </div>
        <p className="admin-muted">Start it and its progress shows here as it goes.</p>
      </section>
    );
  }
  const running = state.status === 'running' || state.status === 'starting';
  const pct = Math.max(0, Math.min(100, Number(state.percent) || 0));
  const step = (state.steps || []).find((s) => s.state === 'running');
  const sinceUpdate = seconds(state.updated_at, now);
  const stale = running && sinceUpdate != null && sinceUpdate > STALE_SECONDS;
  const elapsed = seconds(state.started_at, running ? now : state.finished_at);
  const tone = state.status === 'failed' ? 'bad' : running ? (stale ? 'warn' : 'muted') : 'ok';

  return (
    <section className={`learning-progress is-${state.status}`} aria-live="polite">
      <div className="learning-progress-head">
        <h3>{title}</h3>
        <span className={`admin-pill admin-pill-${tone}`}>{STATUS[state.status] || state.status}</span>
        <span className="admin-muted">
          {running ? `${duration(elapsed)} so far` : state.finished_at ? `Took ${duration(elapsed)}, finished ${time(state.finished_at)}` : ''}
          {running && sinceUpdate != null ? ` · last update ${sinceUpdate} s ago` : ''}
        </span>
      </div>

      <div className="learning-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${title} progress`}>
        <span style={{ width: `${pct}%` }} className={running ? 'is-moving' : undefined} />
        <strong>{pct}%</strong>
      </div>

      {stale ? (
        <p className="form-note-banner" role="status">
          No progress for {duration(sinceUpdate)}. It may have stopped; if nothing moves in a few more minutes, start it again.
        </p>
      ) : null}
      {state.status === 'failed' && state.detail ? <p className="form-error">{state.detail}</p> : null}
      {state.status === 'ok' && state.detail ? <p className="admin-muted">{state.detail}</p> : null}

      {step ? (
        <div className="learning-step">
          <p>
            <strong>{step.label}</strong>
            {step.total ? ` · ${step.done} of ${step.total}` : ''}
          </p>
          {step.total ? (
            <div className="learning-bar is-small" aria-hidden="true">
              <span style={{ width: `${Math.min(100, Math.round((step.done / step.total) * 100))}%` }} />
            </div>
          ) : null}
          {state.current ? <p className="admin-muted learning-current">Now: {state.current}</p> : null}
        </div>
      ) : null}

      <ol className="learning-steps">
        {(state.steps || []).map((s) => {
          const Icon = STEP_ICON[s.state] || Circle;
          return (
            <li key={s.label} className={`is-${s.state}`}>
              <Icon size={16} strokeWidth={2} aria-hidden="true" className={s.state === 'running' ? 'learning-spin' : undefined} />
              <span>{s.label}</span>
              <span className="admin-muted">
                {s.state === 'running' && s.total ? `${s.done} of ${s.total}` : s.detail || (s.state === 'waiting' ? 'Waiting' : s.state === 'skipped' ? 'Skipped' : '')}
              </span>
            </li>
          );
        })}
      </ol>

      {(state.log || []).length ? (
        <details className="learning-log" open={running}>
          <summary>Log ({state.log.length} latest)</summary>
          <ul>
            {[...state.log].reverse().map((line, i) => (
              <li key={`${line.at}-${i}`}>
                <time>{time(line.at)}</time> {line.text}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
