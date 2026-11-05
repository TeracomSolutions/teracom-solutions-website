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

// The pages each content tool makes, and what its editor calls things.
export const ITEM_KINDS = {
  service_areas: {
    plural: 'Area pages', addLabel: 'Add an area', titleLabel: 'Area (suburb or region)',
    summaryLabel: 'Short description (search results and the areas list)', bodyLabel: 'The page',
    notesHint: 'For example: jobs done there, nearby suburbs, what local customers ask for',
    fields: [{ name: 'suburbs', label: 'Suburbs it covers (shown on the page)' }, { name: 'services', label: 'Services to mention' }],
    photos: true, path: '/areas/',
  },
  projects: {
    plural: 'Projects', addLabel: 'Add a project', titleLabel: 'Project title',
    summaryLabel: 'Short description (the projects list)', bodyLabel: 'The case study',
    notesHint: 'What the customer needed, what was installed, how it turned out (no customer names unless they agreed)',
    fields: [{ name: 'suburb', label: 'Suburb or region' }, { name: 'products', label: 'Products and systems used' }],
    photos: true, path: '/projects/',
  },
  questions: {
    plural: 'Questions', addLabel: 'Add a question', titleLabel: 'Question',
    summaryLabel: 'Short answer (shown first and given to Google)', bodyLabel: 'The full answer',
    notesHint: 'Anything the answer should say', fields: [], photos: false, path: '/questions#',
  },
  newsletter: {
    plural: 'Issues', addLabel: 'Write an issue', titleLabel: 'Subject',
    summaryLabel: 'Preview line', bodyLabel: 'The email',
    notesHint: 'What to include this month', fields: [], photos: false, path: null,
  },
};

export function itemPublicPath(tool, item) {
  const kind = ITEM_KINDS[tool];
  if (!kind || !kind.path || !item || !item.slug) return null;
  return kind.path + item.slug;
}
