const DAY = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

export function humanise(value) {
  if (!value) return '';
  const text = String(value).replace(/_/g, ' ');
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function shortDetail(detail) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) return '';
  const parts = [];
  for (const key of Object.keys(detail)) {
    const val = detail[key];
    if (val === null || val === '') continue;
    const label = key.replace(/_/g, ' ').toLowerCase();
    const text = typeof val === 'object' && val !== null
      ? JSON.stringify(val)
      : String(val);
    parts.push(label + ': ' + text);
  }
  if (!parts.length) return '';
  let out = parts.join(', ');
  if (out.length > 80) {
    out = out.slice(0, 77) + '...';
  }
  return out;
}

export function detailEntries(row) {
  const entries = [];
  function push(label, value) {
    if (value === null || value === undefined || value === '') return;
    entries.push({ label: label, value: String(value) });
  }

  push('When', row.at ? new Date(row.at).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' }) : '');
  push('Who', row.who);
  push('What happened', row.text);
  push('Where', row.area);
  push('Kind', row.label || humanise(row.event_type));

  if (row.detail && typeof row.detail === 'object' && !Array.isArray(row.detail)) {
    for (const key of Object.keys(row.detail)) {
      const val = row.detail[key];
      if (val === null || val === '') continue;
      const text = typeof val === 'object' && val !== null
        ? JSON.stringify(val)
        : String(val);
      push(humanise(key), text);
    }
  }

  push('Entry id', row.id);
  return entries;
}

export function exportQuery(filters) {
  if (!filters) return '';
  const parts = [];
  const q = (filters.q || '').trim();
  if (q) parts.push('q=' + encodeURIComponent(q));
  if (filters.eventType) parts.push('event_type=' + encodeURIComponent(filters.eventType));
  if (filters.since && DAY.test(filters.since)) parts.push('since=' + filters.since);
  if (filters.until && DAY.test(filters.until)) parts.push('until=' + filters.until);
  if (!parts.length) return '';
  return '?' + parts.join('&');
}
