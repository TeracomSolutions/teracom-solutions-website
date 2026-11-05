// The progress bar under Check on the Resources page (Robert, 2026-11-05): how far a
// resource check has got and how fast it is going. Pure, so it is tested on its own.

export function formatElapsed(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  if (s < 60) return `${s} s`;
  return `${Math.floor(s / 60)} min ${s % 60} s`;
}

export function isRunning(run) {
  return Boolean(run) && typeof run === 'object' && run.status === 'running';
}

export function progressView(run, nowMs) {
  if (!run) return null;
  const done = Math.max(0, Number(run.progress_done) || 0);
  const total = Math.max(0, Number(run.progress_total) || 0);
  if (run.status === 'ok') return { percent: 100, label: 'Finished', detail: '' };
  if (run.status === 'failed') return { percent: 100, label: 'Failed', detail: '' };

  // While reading, the total is the Max pages limit (the check may finish
  // reading early); while downloading it is the number of PDF links found.
  const downloading = run.phase === 'downloading';
  let percent;
  let label;
  if (downloading) {
    percent = total ? Math.round(50 + (50 * Math.min(done, total)) / total) : 50;
    label = `Downloading documents: ${done} of ${total}`;
  } else {
    percent = total ? Math.round((50 * Math.min(done, total)) / total) : 0;
    label = done ? `Reading pages: ${done} of up to ${total}` : 'Starting…';
  }
  percent = Math.min(100, Math.max(0, percent));

  let detail = '';
  const started = Date.parse(run.started_at);
  if (run.started_at && !Number.isNaN(started)) {
    const elapsed = Math.max(0, (nowMs - started) / 1000);
    if (done > 0 && elapsed >= 1) {
      const rate = done / elapsed;
      const unit = downloading ? 'document' : 'page';
      const speed = rate >= 1 ? `about ${Math.round(rate * 10) / 10} ${unit}s a second` : `about ${Math.round(1 / rate)} seconds a ${unit}`;
      detail = `${formatElapsed(elapsed)} so far · ${speed}`;
    } else {
      detail = `${formatElapsed(elapsed)} so far`;
    }
  }
  return { percent, label, detail };
}
