// Pure helpers for the "Prices on the website" card on the Pricing page.

export function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-AU', {
    timeZone: 'Australia/Melbourne',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function publishState(status) {
  if (!status || typeof status !== 'object') {
    return { tone: 'unknown', headline: 'Status unavailable' };
  }
  if (status.pending) {
    return { tone: 'pending', headline: 'Changes not yet on the website' };
  }
  if (!status.last_changed_at && !status.last_published_at) {
    return { tone: 'ok', headline: 'No price changes recorded yet' };
  }
  return { tone: 'ok', headline: 'Website is up to date' };
}

export function publishDetails(status) {
  const s = status && typeof status === 'object' ? status : {};
  const changed = formatWhen(s.last_changed_at);
  const published = formatWhen(s.last_published_at);
  const by = s.last_published_by ? ' by ' + s.last_published_by : '';
  return {
    changed: changed || 'No changes recorded',
    published: published ? published + by : 'Never made live from here',
  };
}