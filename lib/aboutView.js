export function formatBuildTime(iso) {
  if (!iso) return '';
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    return '';
  }
}

export function formatReleased(date) {
  if (!date) return '';
  const match = date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
  if (!match) return date;
  const [, year, month, day] = match;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.toLocaleDateString('en-AU', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function notesLines(notes) {
  if (!notes) return [];
  return notes
    .split(/\r?\n/) // Split by line breaks
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      const bullet = line.startsWith('- ');
      return { text: bullet ? line.slice(2) : line, bullet };
    });
}

export function sameCopy(a, b) {
  if (!a || typeof a !== 'object' || !b || typeof b !== 'object') return false;
  return Boolean(a.version) && Boolean(a.commit) && a.version === b.version && a.commit === b.commit;
}