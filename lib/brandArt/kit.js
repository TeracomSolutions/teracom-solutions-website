// Shared pieces for the brand drawings (lib/brandArt). Every drawing is a
// plain SVG string built from data, so one set of drawings serves every
// brand: the brand's own colour runs through it and the labels come from
// the brand's profile. Pure functions: no React, no browser.

export const TONES = {
  ok: '#3ecf8e',
  warn: '#ffb020',
  alert: '#ff4b4b',
  muted: '#7f93ad',
  text: '#e8f1ff',
  panel: '#0e1520',
  line: '#2b3a50',
  deep: '#0a1018',
};

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const APOSTROPHE = String.fromCharCode(39);

export function esc(value) {
  return String(value ?? '').replace(/["]|&|<|>/g, (ch) => ESCAPES[ch]).split(APOSTROPHE).join('&#39;');
}

function rgb(hex) {
  const clean = String(hex || '#0082ff').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean.padEnd(6, '0').slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) || 0);
}

// Text that stays readable on a filled chip of this colour.
export function readableOn(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? '#0b0b0b' : '#ffffff';
}

// The colour at a given strength, for fills and glows.
export function alpha(hex, a) {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// A brand colour too grey to carry the drawing gets a neutral blue instead.
export function usableAccent(hex) {
  const [r, g, b] = rgb(hex);
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return spread < 64 ? '#4f8cff' : `#${rgb(hex).map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function toneColour(tone, accent) {
  if (tone === 'accent' || !tone) return accent;
  return TONES[tone] || accent;
}

// The frame every drawing sits in: background, a faint grid and a soft
// glow of the brand colour, plus the defs the pieces below rely on.
export function frame({ uid, w, h, accent, label, body }) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Arial, sans-serif" role="img" aria-label="${esc(label)}">`
    + '<defs>'
    + `<radialGradient id="${uid}-bg" cx="50%" cy="25%" r="85%"><stop offset="0" stop-color="${alpha(accent, 0.22)}"/><stop offset="0.6" stop-color="#080c12"/><stop offset="1" stop-color="#050505"/></radialGradient>`
    + `<pattern id="${uid}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${alpha(accent, 0.09)}"/></pattern>`
    + `<linearGradient id="${uid}-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${alpha(accent, 0.45)}"/><stop offset="1" stop-color="${alpha(accent, 0)}"/></linearGradient>`
    + `<filter id="${uid}-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
    + '</defs>'
    + `<rect width="${w}" height="${h}" fill="url(#${uid}-bg)"/>`
    + `<rect width="${w}" height="${h}" fill="url(#${uid}-grid)"/>`
    + body
    + '</svg>';
}

// A rounded pill with a dot and a short label. Width follows the text.
export function chip({ x, y, text, tone, accent, filled = false, size = 12 }) {
  const colour = toneColour(tone, accent);
  const width = Math.round(String(text).length * size * 0.56 + 44);
  const fill = filled ? colour : TONES.panel;
  const ink = filled ? readableOn(colour) : TONES.text;
  return `<g transform="translate(${x} ${y})">`
    + `<rect width="${width}" height="${size + 20}" rx="${(size + 20) / 2}" fill="${fill}" stroke="${filled ? colour : alpha(colour, 0.7)}"/>`
    + (filled ? '' : `<circle cx="18" cy="${(size + 20) / 2}" r="5" fill="${colour}"/>`)
    + `<text x="${filled ? width / 2 : 30}" y="${(size + 20) / 2 + size * 0.36}" ${filled ? 'text-anchor="middle" ' : ''}font-size="${size}" font-weight="700" fill="${ink}">${esc(text)}</text>`
    + '</g>';
}

export function chipWidth(text, size = 12) {
  return Math.round(String(text).length * size * 0.56 + 44);
}

// A dark card with an optional title and subtitle.
export function card({ x, y, w, h, title, sub, accent, highlight = false, r = 14 }) {
  return `<g transform="translate(${x} ${y})">`
    + `<rect width="${w}" height="${h}" rx="${r}" fill="${TONES.panel}" stroke="${highlight ? accent : TONES.line}" stroke-width="${highlight ? 2 : 1}"/>`
    + (title ? `<text x="16" y="${sub ? 26 : h / 2 + 5}" font-size="13" font-weight="700" fill="${TONES.text}">${esc(title)}</text>` : '')
    + (sub ? `<text x="16" y="44" font-size="11" fill="${TONES.muted}">${esc(sub)}</text>` : '')
    + '</g>';
}

// Corner brackets around something a device has picked out.
export function brackets(x, y, w, h, colour) {
  const k = 12;
  return `<g fill="none" stroke="${colour}" stroke-width="3">`
    + `<path d="M${x} ${y + k} V${y} H${x + k} M${x + w - k} ${y} H${x + w} V${y + k} M${x + w} ${y + h - k} V${y + h} H${x + w - k} M${x + k} ${y + h} H${x} V${y + h - k}"/>`
    + '</g>';
}

// One of the icons below, scaled up about its own centre.
export function bigIcon(type, cx, cy, colour, scale) {
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">${icon(type, cx, cy, colour)}</g>`;
}

// Small line icons, drawn centred on (x, y) in a box about 28 wide.
export function icon(type, x, y, colour) {
  const c = colour;
  const t = `transform="translate(${x - 14} ${y - 14})"`;
  const s = `fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  switch (type) {
    case 'camera':
      return `<g ${t}><circle cx="14" cy="14" r="11" ${s}/><circle cx="14" cy="14" r="4" fill="${c}"/></g>`;
    case 'bullet':
      return `<g ${t}><rect x="3" y="8" width="18" height="11" rx="3" ${s}/><path d="M21 11 l5 -3 v11 l-5 -3" ${s}/></g>`;
    case 'door':
      return `<g ${t}><rect x="7" y="3" width="14" height="22" rx="2" ${s}/><circle cx="17" cy="15" r="1.6" fill="${c}"/></g>`;
    case 'reader':
      return `<g ${t}><rect x="8" y="3" width="12" height="22" rx="3" ${s}/><path d="M11 9 a4 4 0 0 1 6 0 M12.5 12 a2 2 0 0 1 3 0" ${s}/><circle cx="14" cy="20" r="1.6" fill="${c}"/></g>`;
    case 'card':
      return `<g ${t}><rect x="3" y="7" width="22" height="15" rx="3" ${s}/><path d="M7 17 h7" ${s}/></g>`;
    case 'phone':
      return `<g ${t}><rect x="8" y="3" width="12" height="22" rx="3" ${s}/><path d="M12 21 h4" ${s}/></g>`;
    case 'pin':
      return `<g ${t}><rect x="5" y="4" width="18" height="20" rx="3" ${s}/><path d="M9 10 h2 M13 10 h2 M17 10 h2 M9 15 h2 M13 15 h2 M17 15 h2 M13 20 h2" ${s}/></g>`;
    case 'face':
      return `<g ${t}><path d="M4 9 V5 h4 M20 5 h4 v4 M24 19 v4 h-4 M8 23 H4 v-4" ${s}/><circle cx="14" cy="13" r="4.5" ${s}/><path d="M9 21 a5 5 0 0 1 10 0" ${s}/></g>`;
    case 'fob':
      return `<g ${t}><path d="M14 4 a7 7 0 0 1 7 7 c0 5 -7 13 -7 13 s-7 -8 -7 -13 a7 7 0 0 1 7 -7 z" ${s}/><circle cx="14" cy="11" r="2.5" fill="${c}"/></g>`;
    case 'sensor':
      return `<g ${t}><rect x="5" y="5" width="18" height="18" rx="6" ${s}/><circle cx="14" cy="14" r="3" fill="${c}"/></g>`;
    case 'motion':
      return `<g ${t}><path d="M6 20 a10 10 0 0 1 16 0" ${s}/><path d="M9 16 a6 6 0 0 1 10 0" ${s}/><circle cx="14" cy="20" r="2" fill="${c}"/></g>`;
    case 'server':
      return `<g ${t}><rect x="6" y="3" width="16" height="22" rx="2" ${s}/><path d="M6 10 h16 M6 17 h16" ${s}/><circle cx="18" cy="6.5" r="1.3" fill="${c}"/><circle cx="18" cy="13.5" r="1.3" fill="${c}"/><circle cx="18" cy="20.5" r="1.3" fill="${c}"/></g>`;
    case 'cloud':
      return `<g ${t}><path d="M8 21 a5 5 0 0 1 0.5 -10 a7 7 0 0 1 13 1 a4.5 4.5 0 0 1 0 9 z" ${s}/></g>`;
    case 'laptop':
      return `<g ${t}><rect x="5" y="6" width="18" height="12" rx="2" ${s}/><path d="M2 22 h24" ${s}/></g>`;
    case 'switch':
      return `<g ${t}><rect x="2" y="9" width="24" height="10" rx="2" ${s}/><path d="M6 14 h2 M10 14 h2 M14 14 h2 M18 14 h2" ${s}/></g>`;
    case 'wifi':
      return `<g ${t}><path d="M4 11 a14 14 0 0 1 20 0 M8 15 a8 8 0 0 1 12 0" ${s}/><circle cx="14" cy="20" r="2" fill="${c}"/></g>`;
    case 'speaker':
      return `<g ${t}><path d="M5 11 h5 l6 -5 v16 l-6 -5 h-5 z" ${s}/><path d="M20 10 a5 5 0 0 1 0 8" ${s}/></g>`;
    case 'mic':
      return `<g ${t}><rect x="10" y="3" width="8" height="14" rx="4" ${s}/><path d="M6 13 a8 8 0 0 0 16 0 M14 21 v4" ${s}/></g>`;
    case 'battery':
      return `<g ${t}><rect x="3" y="8" width="20" height="12" rx="2" ${s}/><path d="M25 12 v4" ${s}/><rect x="6" y="11" width="10" height="6" fill="${c}"/></g>`;
    case 'bolt':
      return `<g ${t}><path d="M15 3 L6 16 h7 l-2 9 l9 -13 h-7 z" ${s}/></g>`;
    case 'lock':
      return `<g ${t}><rect x="6" y="12" width="16" height="12" rx="2" ${s}/><path d="M9 12 V8 a5 5 0 0 1 10 0 v4" ${s}/><circle cx="14" cy="18" r="1.6" fill="${c}"/></g>`;
    case 'key':
      return `<g ${t}><circle cx="9" cy="14" r="5" ${s}/><path d="M14 14 h11 M21 14 v4 M24 14 v3" ${s}/></g>`;
    case 'alarm':
      return `<g ${t}><path d="M14 4 L25 23 H3 Z" ${s}/><path d="M14 11 v6" ${s}/><circle cx="14" cy="20" r="1.3" fill="${c}"/></g>`;
    case 'shield':
      return `<g ${t}><path d="M14 3 L23 7 v7 c0 6 -4 9 -9 11 c-5 -2 -9 -5 -9 -11 V7 z" ${s}/><path d="M10 14 l3 3 l5 -6" ${s}/></g>`;
    case 'map':
      return `<g ${t}><path d="M14 25 s-8 -8 -8 -13 a8 8 0 0 1 16 0 c0 5 -8 13 -8 13 z" ${s}/><circle cx="14" cy="12" r="3" fill="${c}"/></g>`;
    case 'person':
      return `<g ${t}><circle cx="14" cy="8" r="4" ${s}/><path d="M6 24 a8 8 0 0 1 16 0" ${s}/></g>`;
    case 'vehicle':
      return `<g ${t}><path d="M4 18 l3 -7 h14 l3 7 v4 H4 z" ${s}/><circle cx="9" cy="22" r="2" fill="${c}"/><circle cx="19" cy="22" r="2" fill="${c}"/></g>`;
    case 'thermo':
      return `<g ${t}><path d="M12 5 a2 2 0 0 1 4 0 v11 a5 5 0 1 1 -4 0 z" ${s}/><circle cx="14" cy="20" r="2.5" fill="${c}"/></g>`;
    case 'bag':
      return `<g ${t}><rect x="4" y="9" width="20" height="15" rx="3" ${s}/><path d="M10 9 V6 a2 2 0 0 1 2 -2 h4 a2 2 0 0 1 2 2 v3" ${s}/></g>`;
    case 'headset':
      return `<g ${t}><path d="M5 17 v-3 a9 9 0 0 1 18 0 v3" ${s}/><rect x="3" y="16" width="5" height="7" rx="2" ${s}/><rect x="20" y="16" width="5" height="7" rx="2" ${s}/></g>`;
    case 'chart':
      return `<g ${t}><path d="M4 22 h20" ${s}/><path d="M7 18 v-5 M12 18 v-9 M17 18 v-6 M22 18 v-11" ${s}/></g>`;
    default:
      return `<g ${t}><circle cx="14" cy="14" r="10" ${s}/></g>`;
  }
}