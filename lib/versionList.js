// Pure helpers for the About page's version lists.

export const FILTERS = [
  { key: 'all', label: (n) => `All versions (${n})` },
  { key: 'recent', label: () => 'Latest 5' },
  { key: 'month', label: () => 'Last 30 days' },
];

// Entries as { version, date, notes: [text] } from the backend's { version, date, notes: 'text with - bullets' }.
export function fromBackend(versions) {
  return (Array.isArray(versions) ? versions : []).map((entry) => ({
    version: String(entry.version || ''),
    date: String(entry.date || ''),
    notes: String(entry.notes || '')
      .split(String.fromCharCode(10))
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => (line.startsWith('- ') ? line.slice(2) : line)),
  }));
}

export function filterVersions(items, mode, now = new Date()) {
  const list = Array.isArray(items) ? items : [];
  if (mode === 'recent') return list.slice(0, 5);
  if (mode === 'month') {
    const cutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    return list.filter((entry) => {
      const when = new Date(`${entry.date}T00:00:00Z`);
      return !Number.isNaN(when.getTime()) && when >= cutoff;
    });
  }
  return list;
}

export function filterLabel(filter, count) {
  return filter.label(count);
}
