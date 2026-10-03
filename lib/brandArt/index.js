// One entry point for every brand drawing. A profile names the drawing it
// wants ({ type: 'search', ...labels }) and this returns the SVG text, drawn
// in the brand's own colour. Unknown types return an empty string.
import { usableAccent } from './kit.js';
import { activity, hero, perimeter, plate, prompt, search, thermal } from './scenes.js';
import { door, keying, lock, panel } from './access.js';
import { architecture, cloud, dashboard, map, mobile, onPrem } from './systems.js';
import { audio, bag, network, power, sensor, storage } from './infra.js';

const DRAWINGS = {
  hero,
  search,
  activity,
  plate,
  perimeter,
  thermal,
  prompt,
  door,
  keying,
  lock,
  panel,
  onPrem,
  cloud,
  architecture,
  dashboard,
  map,
  mobile,
  network,
  power,
  audio,
  storage,
  sensor,
  bag,
};

export const ART_TYPES = Object.keys(DRAWINGS);

export function renderArt(spec, { uid = 'art', accent = '#4f8cff' } = {}) {
  const draw = spec && DRAWINGS[spec.type];
  if (!draw) return '';
  const safeId = String(uid).replace(/[^a-zA-Z0-9_-]/g, '-');
  return draw(spec, { uid: safeId, accent: usableAccent(accent) });
}