// Which free calculators help with a store product (Ask Tera phase 5, "help
// before people ask"): by the product's store category, then by words in its
// name, so an NVR page offers the storage calculator and a PoE switch page
// the PoE budget. At most three, most useful first.
const BY_CATEGORY = {
  cctv: ['cctv-storage-calculator', 'cctv-bitrate-calculator', 'cctv-lens-calculator'],
  'video-accessories': ['cctv-mounting-height-calculator', 'cctv-lens-calculator'],
  networking: ['poe-power-budget-calculator', 'wireless-link-calculator', 'ip-subnet-calculator'],
  ups: ['ups-runtime-calculator', 'running-cost-calculator'],
  'power-supplies': ['access-control-psu-calculator', 'battery-standby-calculator', 'voltage-drop-calculator'],
  'access-control': ['access-control-psu-calculator', 'battery-standby-calculator'],
  intrusion: ['battery-standby-calculator'],
  cable: ['cable-quantity-calculator', 'voltage-drop-calculator', 'fibre-loss-budget-calculator'],
  nas: ['cctv-storage-calculator', 'nvr-raid-planner', 'data-transfer-time-calculator'],
  audio: ['speaker-load-calculator'],
  screens: ['screen-size-calculator'],
  projectors: ['projector-brightness-calculator', 'projector-throw-calculator'],
};

// Words in a product's name, and the calculator each one points to.
const BY_WORD = [
  [['nvr', 'dvr', 'recorder', 'surveillance hdd', 'purple', 'skyhawk'], 'cctv-storage-calculator'],
  [['raid'], 'nvr-raid-planner'],
  [['camera', 'bullet', 'dome', 'turret'], 'cctv-bitrate-calculator'],
  [['4g', 'lte'], '4g-cctv-data-calculator'],
  [['poe', 'switch'], 'poe-power-budget-calculator'],
  [['ups'], 'ups-runtime-calculator'],
  [['battery', 'sla'], 'battery-standby-calculator'],
  [['solar'], 'solar-battery-calculator'],
  [['fibre', 'fiber', 'sfp'], 'fibre-loss-budget-calculator'],
  [['cat5', 'cat6', 'cable'], 'cable-quantity-calculator'],
  [['bridge', 'airmax', 'point-to-point', 'ptp'], 'wireless-link-calculator'],
  [['speaker', 'amplifier', '100v'], 'speaker-load-calculator'],
  [['projector'], 'projector-brightness-calculator'],
  [['display', 'monitor', 'tv'], 'screen-size-calculator'],
];

export function toolsForProduct(categorySlug, name, limit = 3) {
  const slugs = [];
  const add = (slug) => {
    if (slug && !slugs.includes(slug)) slugs.push(slug);
  };
  const lower = String(name || '').toLowerCase();
  for (const [words, slug] of BY_WORD) {
    if (words.some((word) => lower.includes(word))) add(slug);
  }
  for (const slug of BY_CATEGORY[categorySlug] || []) add(slug);
  return slugs.slice(0, limit);
}