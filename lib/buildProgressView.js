// Pure display helpers for the Build progress page (Robert, 2026-10-22).

export const STAGES = ['Planned', 'Being built', 'In tests', 'Merged', 'Live'];
export const GROUPS = ['Today', 'Tomorrow', 'After that', 'Other work'];
export const STALE_AFTER_MINUTES = 30;

export function formatAge(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) return 'never';
  const m = Math.max(0, Math.round(Number(minutes)));
  if (m < 1) return 'just now';
  if (m < 120) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} hours ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function snapshotWarning(label, age) {
  if (!age) return `No ${label} snapshot has arrived yet.`;
  if (age.stale || Number(age.age_minutes) > STALE_AFTER_MINUTES) {
    return `The ${label} information is ${formatAge(age.age_minutes)}. Something may have stopped; check the collector.`;
  }
  return '';
}

export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || Number.isNaN(Number(seconds))) return '-';
  const s = Math.max(0, Math.round(Number(seconds)));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, '0')}m`;
}

export function formatTokens(count) {
  if (count === null || count === undefined || Number.isNaN(Number(count))) return '-';
  const n = Number(count);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

export function clampPercent(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function groupItems(items) {
  const list = Array.isArray(items) ? items : [];
  return GROUPS.map((name) => ({ name, items: list.filter((item) => item.group === name) })).filter((group) => group.items.length > 0);
}

export function stageSteps(index) {
  const current = Number.isInteger(index) ? index : 0;
  return STAGES.map((label, n) => ({ label, done: n < current, current: n === current }));
}

export function jobTone(status) {
  const text = String(status || '').toLowerCase();
  if (['running', 'busy', 'in_progress'].includes(text)) return 'busy';
  if (['ok', 'done', 'passed', 'success', 'check_ok', 'finished'].includes(text)) return 'ok';
  if (['failed', 'error', 'check_failed'].includes(text)) return 'bad';
  return 'wait';
}

export function gpuLine(gpu) {
  if (!gpu || typeof gpu !== 'object') return 'GPU: no reading yet';
  const parts = [];
  if (gpu.util_pct !== undefined && gpu.util_pct !== null) parts.push(`${gpu.util_pct}% busy`);
  if (gpu.mem_used_mib !== undefined && gpu.mem_total_mib) parts.push(`${Math.round(gpu.mem_used_mib / 1024)} of ${Math.round(gpu.mem_total_mib / 1024)} GB memory`);
  const models = Array.isArray(gpu.models) ? gpu.models.filter(Boolean) : [];
  parts.push(models.length ? `model loaded: ${models.join(', ')}` : 'no model loaded');
  return `GPU: ${parts.join(', ')}`;
}
