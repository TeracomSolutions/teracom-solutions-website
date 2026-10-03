// Brand drawings for doors, keys, locks and alarm panels.
import { TONES, alpha, bigIcon, chip, chipWidth, esc, frame, toneColour } from './kit.js';

const STATE_TONES = { secure: 'ok', open: 'warn', alarm: 'alert', bypassed: 'muted', armed: 'accent' };

// Someone presents a credential at a reader and the door decides.
export function door(spec, { uid, accent }) {
  const creds = (spec.credentials || []).slice(0, 4);
  const resultTone = toneColour(spec.resultTone || 'ok', accent);
  const log = (spec.log || []).slice(0, 4);
  const credList = creds.map((c, i) => {
    const y = 44 + i * 70;
    const hi = i === (spec.active ?? 1);
    return `<g transform="translate(32 ${y})">`
      + `<rect width="150" height="56" rx="14" fill="${hi ? alpha(accent, 0.14) : TONES.panel}" stroke="${hi ? accent : TONES.line}" stroke-width="${hi ? 2 : 1}"/>`
      + bigIcon(c.icon || 'card', 30, 28, hi ? accent : '#c9d6e8', 1.2)
      + `<text x="56" y="33" font-size="13" font-weight="700" fill="${TONES.text}">${esc(c.label)}</text>`
      + '</g>';
  }).join('');
  const activeY = 44 + (spec.active ?? 1) * 70 + 28;
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Access control at a door',
    body: credList
      + `<path d="M182 ${activeY} C 220 ${activeY}, 220 180, 248 180" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="4 6"/>`
      + `<g transform="translate(248 128)"><rect width="44" height="104" rx="12" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + `<path d="M12 38 a14 14 0 0 1 20 0 M16 46 a8 8 0 0 1 12 0" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>`
      + `<circle cx="22" cy="82" r="5" fill="${resultTone}" filter="url(#${uid}-glow)"/></g>`
      + `<g transform="translate(314 48)"><rect width="96" height="272" rx="6" fill="#16202e" stroke="#3a4d68" stroke-width="2"/>`
      + `<rect x="10" y="10" width="76" height="252" rx="3" fill="#1d2939" stroke="#2c3b50"/>`
      + `<rect x="68" y="128" width="12" height="30" rx="4" fill="#5d6f83"/>`
      + `<rect x="-6" y="120" width="8" height="46" rx="2" fill="${resultTone}"/></g>`
      + `<g transform="translate(430 48)"><rect width="140" height="272" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<rect x="14" y="16" width="112" height="34" rx="17" fill="${alpha(resultTone, 0.15)}" stroke="${resultTone}"/>`
      + `<text x="70" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="${resultTone}">${esc(spec.result || 'Access granted')}</text>`
      + log.map((line, i) => `<text x="16" y="${84 + i * 24}" font-size="11" fill="${i === 0 ? TONES.text : TONES.muted}">${esc(line)}</text>`).join('')
      + `<path d="M16 ${84 + log.length * 24 + 4} H124" stroke="${alpha(accent, 0.25)}" stroke-width="5" stroke-linecap="round"/>`
      + '</g>',
  });
}

// A master key system as a tree: one key at the top opens everything
// beneath it, each level opens less.
export function keying(spec, { uid, accent }) {
  const middle = (spec.middle || []).slice(0, 3);
  const leaves = (spec.leaves || []).slice(0, 6);
  const midX = middle.map((_, i) => 300 + (i - (middle.length - 1) / 2) * 180);
  const leafX = leaves.map((_, i) => 300 + (i - (leaves.length - 1) / 2) * 92);
  const node = (x, y, label, hi, w = 140) => `<g transform="translate(${x - w / 2} ${y - 22})">`
    + `<rect width="${w}" height="44" rx="12" fill="${hi ? alpha(accent, 0.16) : TONES.panel}" stroke="${hi ? accent : TONES.line}" stroke-width="${hi ? 2 : 1}"/>`
    + bigIcon('key', 24, 22, hi ? accent : '#c9d6e8', 0.9)
    + `<text x="42" y="27" font-size="${w < 100 ? 10 : 12}" font-weight="700" fill="${TONES.text}">${esc(label)}</text>`
    + '</g>';
  const parentOf = (i) => Math.min(middle.length - 1, Math.floor((i * middle.length) / Math.max(leaves.length, 1)));
  const lines = midX.map((x) => `<path d="M300 92 V118 H${x} V138" fill="none" stroke="${alpha(accent, 0.5)}" stroke-width="2"/>`).join('')
    + leafX.map((x, i) => `<path d="M${midX[parentOf(i)]} 182 V206 H${x} V228" fill="none" stroke="${alpha(accent, 0.35)}" stroke-width="2"/>`).join('');
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'A master key system',
    body: lines
      + node(300, 70, spec.top || 'Grand master', true, 170)
      + middle.map((m, i) => node(midX[i], 160, m, i === 0)).join('')
      + leaves.map((l, i) => node(leafX[i], 250, l, false, 84)).join('')
      + `<text x="300" y="320" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.caption || '')}</text>`,
  });
}

// A lock opened up, with what each part does.
export function lock(spec, { uid, accent }) {
  const parts = (spec.parts || []).slice(0, 4);
  const electronic = spec.variant === 'electronic';
  const spots = [[130, 112], [130, 200], [380, 120], [380, 236]];
  const anchors = [[232, 134], [236, 210], [312, 150], [300, 236]];
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Inside a lock',
    body: `<g transform="translate(220 70)">`
      + `<rect width="110" height="220" rx="12" fill="#1b2533" stroke="${alpha(accent, 0.7)}" stroke-width="2"/>`
      + `<rect x="-14" y="16" width="14" height="188" rx="3" fill="#2a3646" stroke="#4a5b71"/>`
      + `<circle cx="55" cy="72" r="22" fill="#0e1520" stroke="${accent}" stroke-width="3"/>`
      + `<path d="M55 60 V84" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`
      + `<rect x="80" y="118" width="64" height="26" rx="4" fill="${alpha(accent, 0.35)}" stroke="${accent}" stroke-width="2"/>`
      + `<rect x="80" y="160" width="40" height="18" rx="9" fill="#2a3646" stroke="#4a5b71"/>`
      + (electronic
        ? `<rect x="22" y="176" width="66" height="30" rx="6" fill="#0e1520" stroke="${accent}"/><circle cx="36" cy="191" r="4" fill="${TONES.ok}" filter="url(#${uid}-glow)"/><path d="M48 191 h30" stroke="${accent}" stroke-width="2"/><path d="M55 220 v22" stroke="${accent}" stroke-width="2" stroke-dasharray="4 4"/>`
        : `<path d="M30 190 h50" stroke="#4a5b71" stroke-width="6" stroke-linecap="round"/>`)
      + '</g>'
      + parts.map((p, i) => {
        const [x, y] = spots[i];
        const [ax, ay] = anchors[i];
        const left = i < 2;
        const w = chipWidth(p.label || p, 12);
        const cx = left ? x - w + 60 : x;
        return `<path d="M${left ? cx + w : cx} ${y + 16} L${ax} ${ay}" stroke="${alpha(accent, 0.6)}" stroke-width="1.5"/>`
          + `<circle cx="${ax}" cy="${ay}" r="4" fill="${accent}"/>`
          + chip({ x: cx, y, text: p.label || p, tone: p.tone || 'accent', accent });
      }).join('')
      + `<text x="300" y="334" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.caption || '')}</text>`,
  });
}

// An alarm panel: the keypad and the state of every zone.
export function panel(spec, { uid, accent }) {
  const zones = (spec.zones || []).slice(0, 8);
  const mode = spec.mode || 'Armed';
  const modeTone = toneColour(spec.modeTone || 'accent', accent);
  const zoneCells = zones.map((z, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tone = toneColour(STATE_TONES[z.state] || 'ok', accent);
    const x = 238 + col * 168;
    const y = 52 + row * 64;
    return `<g transform="translate(${x} ${y})">`
      + `<rect width="156" height="52" rx="12" fill="${TONES.panel}" stroke="${z.state === 'alarm' ? tone : TONES.line}" stroke-width="${z.state === 'alarm' ? 2 : 1}"/>`
      + `<circle cx="20" cy="26" r="7" fill="${tone}"${z.state === 'alarm' ? ` filter="url(#${uid}-glow)"` : ''}/>`
      + `<text x="36" y="23" font-size="12" font-weight="700" fill="${TONES.text}">${esc(z.name)}</text>`
      + `<text x="36" y="39" font-size="10" fill="${TONES.muted}">${esc(z.label || z.state || '')}</text>`
      + '</g>';
  }).join('');
  const keys = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      keys.push(`<rect x="${26 + c * 44}" y="${142 + r * 40}" width="34" height="30" rx="8" fill="#16202e" stroke="#2c3b50"/>`);
    }
  }
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'An alarm panel and its zones',
    body: `<g transform="translate(36 40)"><rect width="168" height="290" rx="18" fill="#121a26" stroke="${alpha(accent, 0.6)}" stroke-width="2"/>`
      + `<rect x="18" y="20" width="132" height="96" rx="10" fill="#08101a" stroke="${alpha(accent, 0.5)}"/>`
      + `<text x="84" y="56" text-anchor="middle" font-size="16" font-weight="800" fill="${modeTone}">${esc(mode)}</text>`
      + `<text x="84" y="80" text-anchor="middle" font-size="11" fill="${TONES.muted}">${esc(spec.status || 'All zones ready')}</text>`
      + `<circle cx="84" cy="100" r="5" fill="${modeTone}" filter="url(#${uid}-glow)"/>`
      + keys.join('')
      + '</g>'
      + zoneCells,
  });
}