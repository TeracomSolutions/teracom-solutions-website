// Admin -> Connections: how each connection's state reads, and the order the
// page lists them in. Pure, so the server page, the client component and
// the tests share it.

export const STATUS_LABELS = {
  connected: 'Connected',
  attention: 'Needs attention',
  failing: 'Failing',
  not_set_up: 'Not set up',
  unknown: 'Not checked yet',
  set_up: 'Set up',
};

// Worst first, for the summary line.
export const STATUS_ORDER = ['failing', 'attention', 'unknown', 'not_set_up', 'set_up', 'connected'];

export const GROUP_ORDER = [
  'Servers and computers',
  'Hosting and network',
  'Accounts and payments',
  'Store',
  'Marketing',
  'AI',
  'Email',
];

export function statusLabel(status) {
  return STATUS_LABELS[status] || 'Unknown';
}

export function groupConnections(list) {
  const groups = new Map();
  for (const item of list || []) {
    const name = item.group || 'Other';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(item);
  }
  const rank = (name) => {
    const index = GROUP_ORDER.indexOf(name);
    return index === -1 ? GROUP_ORDER.length : index;
  };
  return [...groups.keys()]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((group) => ({ group, items: groups.get(group) }));
}

export function summarise(list) {
  const counts = {};
  for (const item of list || []) counts[item.status] = (counts[item.status] || 0) + 1;
  return STATUS_ORDER.filter((status) => counts[status]).map((status) => ({
    status,
    label: statusLabel(status),
    count: counts[status],
  }));
}

export function withResult(list, result) {
  return (list || []).map((item) =>
    item.key === result.key
      ? { ...item, status: result.status, detail: result.detail, checked_at: result.checked_at }
      : item,
  );
}

export function checkedText(iso, now = new Date()) {
  if (!iso) return '';
  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return '';
  const minutes = Math.floor((now.getTime() - when.getTime()) / 60000);
  if (minutes < 1) return 'Checked just now';
  if (minutes < 60) return `Checked ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Checked ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `Checked ${days} day${days === 1 ? '' : 's'} ago`;
}