import { categories, findCategory } from './categories.js';
import { tools } from './tools.js';

// The calculators are the site's best traffic magnet and, until now, a dead
// end: pages that answer "how much storage do I need" and then offer
// nowhere to buy the drive. This maps each calculator to the store categories
// its answer sends you shopping for, and back again.
//
// Deliberately narrow. A calculator listed against five categories is really
// listed against none -- the point is the one or two things you go looking for
// the moment the number appears on screen.
export const TOOL_STORE_CATEGORIES = {
  'cctv-storage-calculator': ['nas', 'cctv'],
  'cctv-lens-calculator': ['cctv'],
  'cctv-bandwidth-calculator': ['networking', 'cctv'],
  'nvr-raid-planner': ['nas', 'cctv'],
  'poe-power-budget-calculator': ['video-accessories', 'networking'],
  'access-control-psu-calculator': ['power-supplies', 'access-control'],
  'battery-standby-calculator': ['power-supplies', 'intrusion'],
  'voltage-drop-calculator': ['cable'],
  'ups-runtime-calculator': ['ups'],
  'ip-subnet-calculator': ['networking'],
  'speaker-load-calculator': ['audio', 'cable'],
  'projector-throw-calculator': ['projectors', 'screens'],
  'cctv-bitrate-calculator': ['cctv', 'nas'],
  'cctv-mounting-height-calculator': ['cctv', 'video-accessories'],
  '4g-cctv-data-calculator': ['cctv', 'networking'],
  'solar-battery-calculator': ['power-supplies', 'cctv'],
  'running-cost-calculator': ['power-supplies', 'ups'],
  'fibre-loss-budget-calculator': ['cable', 'networking'],
  'pc-power-supply-calculator': ['it-equipment', 'ups'],
  'cctv-recording-server-calculator': ['nas', 'cctv'],
  'virtual-server-calculator': ['it-equipment', 'nas'],
  'rack-size-heat-calculator': ['networking', 'ups'],
  'cable-quantity-calculator': ['cable'],
  'wireless-link-calculator': ['networking'],
  'data-transfer-time-calculator': ['nas', 'networking'],
  'screen-size-calculator': ['screens'],
  'projector-brightness-calculator': ['projectors', 'screens'],
};

/** Store categories worth visiting once this calculator has given its answer. */
export function storeCategoriesForTool(slug) {
  return (TOOL_STORE_CATEGORIES[slug] || []).map(findCategory).filter(Boolean);
}

/** The reverse: calculators worth running before buying from this category. */
export function toolsForStoreCategory(slug) {
  if (!slug) return [];
  return tools.filter((tool) => (TOOL_STORE_CATEGORIES[tool.slug] || []).includes(slug));
}

/** Every category that at least one calculator points at. */
export function linkedStoreCategorySlugs() {
  return [...new Set(Object.values(TOOL_STORE_CATEGORIES).flat())].sort();
}

export { categories };