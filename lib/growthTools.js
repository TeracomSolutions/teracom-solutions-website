// The pure parts of Scout -> Growth tools (Robert, 2026-11-05).

export const GROUP_TITLES = {
  Local: 'Local: Maps, reviews and your area',
  'Found faster': 'Getting found faster',
  Content: 'Content that ranks',
  Selling: 'Selling in more places',
};

export function growthGroups(tools) {
  const groups = [];
  for (const tool of tools || []) {
    const label = GROUP_TITLES[tool.group] || tool.group || 'Other';
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, tools: [] };
      groups.push(group);
    }
    group.tools.push(tool);
  }
  for (const group of groups) group.tools.sort((a, b) => (a.number || 0) - (b.number || 0));
  return groups;
}

export function growthStatus(tool) {
  if (!tool) return { label: '', tone: 'is-pending' };
  if (tool.running) return { label: 'Running', tone: 'is-running' };
  if (tool.error) return { label: 'Last run failed', tone: 'is-failed' };
  if (!tool.enabled) return { label: 'Off', tone: 'is-pending' };
  if (!tool.can_run) return { label: 'On', tone: 'is-approved' };
  if (!tool.last_at) return { label: 'On, not run yet', tone: 'is-pending' };
  return { label: tool.hours ? `On, runs every ${tool.hours >= 168 ? 'week' : tool.hours >= 24 ? 'day' : `${tool.hours} hours`}` : 'On', tone: 'is-approved' };
}
