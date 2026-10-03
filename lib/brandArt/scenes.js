// Brand drawings of what a device sees or does: the hero scene, searching,
// unusual activity, plates, perimeters, heat and alerts written in plain
// words. Each takes the spec from a brand profile and returns an SVG string.
import { TONES, alpha, bigIcon, brackets, chip, chipWidth, esc, frame, readableOn, toneColour } from './kit.js';

function sideCard(spec, x, y, accent) {
  if (!spec) return '';
  return `<g transform="translate(${x} ${y})">`
    + `<rect width="170" height="118" rx="16" fill="${TONES.panel}" stroke="${alpha(accent, 0.45)}" stroke-width="1.5"/>`
    + bigIcon(spec.icon || 'server', 44, 50, accent, 1.6)
    + `<text x="82" y="44" font-size="13" font-weight="700" fill="${TONES.text}">${esc(spec.title)}</text>`
    + `<text x="82" y="62" font-size="11" fill="${TONES.muted}">${esc(spec.sub || '')}</text>`
    + `<text x="20" y="102" font-size="11" fill="${TONES.muted}">${esc(spec.foot || '')}</text>`
    + '</g>';
}

// The opening drawing: the brand's main device at the top, what it feeds
// on either side, and up to three things it is dealing with on the floor.
export function hero(spec, { uid, accent }) {
  const device = spec.device || 'camera';
  const floor = '<g stroke-opacity="0.22" stroke-width="1" fill="none" stroke="' + accent + '">'
    + '<path d="M0 470 H900 M0 492 H900 M0 518 H900 M0 550 H900 M0 590 H900 M0 640 H900 M0 702 H900"/>'
    + '<path d="M375 470 L-150 720 M400 470 L0 720 M425 470 L150 720 M450 470 L300 720 M475 470 L450 720 M500 470 L600 720 M525 470 L750 720 M550 470 L900 720 M575 470 L1050 720"/>'
    + '</g>';
  const links = `<g fill="none" stroke="${accent}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round">`
    + '<path d="M380 150 C 300 150, 230 190, 190 250"/><path d="M520 150 C 600 150, 670 190, 710 250"/></g>';
  const reach = device === 'camera' || device === 'bullet'
    ? `<polygon points="425,212 475,212 760,600 140,600" fill="url(#${uid}-beam)"/>`
    : `<g fill="none" stroke="${accent}" stroke-linecap="round"><circle cx="450" cy="160" r="120" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="2 9"/><circle cx="450" cy="160" r="170" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="2 12"/></g>`
      + `<path d="M450 236 V440" stroke="${accent}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="3 8"/>`;
  const core = device === 'camera'
    ? `<rect x="410" y="52" width="80" height="22" rx="6" fill="#1a2536" stroke="#3a4d68"/><rect x="440" y="74" width="20" height="26" fill="#1a2536" stroke="#3a4d68"/>`
      + `<circle cx="450" cy="160" r="72" fill="#121c2b" stroke="${alpha(accent, 0.6)}" stroke-width="2"/>`
      + `<circle cx="450" cy="172" r="30" fill="#05090f" stroke="${accent}" stroke-width="3"/><circle cx="450" cy="172" r="12" fill="${accent}" filter="url(#${uid}-glow)"/><circle cx="444" cy="166" r="4" fill="#ffffff"/>`
    : `<circle cx="450" cy="160" r="72" fill="#121c2b" stroke="${alpha(accent, 0.6)}" stroke-width="2"/>`
      + `<circle cx="450" cy="160" r="96" fill="none" stroke="${alpha(accent, 0.35)}" stroke-width="2" stroke-dasharray="2 9"/>`
      + bigIcon(device, 450, 160, accent, 3.2);
  const spots = [[250, 470], [470, 500], [680, 450]];
  const tags = (spec.tags || []).slice(0, 3).map((tag, i) => {
    const [x, y] = spots[i];
    const colour = toneColour(tag.tone, accent);
    const width = chipWidth(tag.text, 12) - 10;
    return `<rect x="${x}" y="${y}" width="110" height="92" rx="14" fill="${alpha(colour, 0.08)}" stroke="${alpha(colour, 0.35)}"/>`
      + bigIcon(tag.icon || 'person', x + 55, y + 46, '#c9d6e8', 2)
      + brackets(x - 10, y - 10, 130, 112, colour)
      + `<rect x="${x + 55 - width / 2}" y="${y - 44}" width="${width}" height="24" rx="12" fill="${colour}"/>`
      + `<text x="${x + 55}" y="${y - 27}" text-anchor="middle" font-size="12" font-weight="700" fill="${readableOn(colour)}">${esc(tag.text)}</text>`;
  }).join('');
  const chips = (spec.chips || []).slice(0, 2).map((c, i) => (
    i === 0 ? chip({ x: 50, y: 92, text: c.text, tone: c.tone, accent }) : chip({ x: 850 - chipWidth(c.text), y: 92, text: c.text, tone: c.tone, accent })
  )).join('');
  return frame({
    uid, w: 900, h: 720, accent, label: spec.alt || spec.label || 'Illustration',
    body: floor + links + reach + core + sideCard(spec.left, 104, 250, accent) + sideCard(spec.right, 626, 250, accent) + tags + chips,
  });
}

// Searching across many cameras or records for one match.
export function search(spec, { uid, accent }) {
  const results = (spec.results || []).slice(0, 4);
  const cards = results.map((r, i) => {
    const x = 32 + i * 138;
    const hi = Boolean(r.highlight);
    const figure = r.kind && r.kind !== 'person'
      ? bigIcon(r.kind, x + 61, 178, hi ? accent : '#c9d6e8', 2.6)
      : `<circle cx="${x + 61}" cy="148" r="14" fill="#c9d6e8"/><rect x="${x + 44}" y="164" width="34" height="58" rx="12" fill="${hi ? accent : alpha(accent, 0.55)}"/>`;
    return `<g>`
      + `<rect x="${x}" y="96" width="122" height="150" rx="12" fill="${TONES.panel}" stroke="${hi ? accent : TONES.line}" stroke-width="${hi ? 2.5 : 1}"${hi ? ` filter="url(#${uid}-glow)"` : ''}/>`
      + figure
      + `<rect x="${x + 10}" y="106" width="48" height="18" rx="9" fill="${hi ? accent : alpha(accent, 0.25)}"/>`
      + `<text x="${x + 34}" y="119" text-anchor="middle" font-size="11" font-weight="700" fill="${hi ? readableOn(accent) : TONES.text}">${esc(r.score || '')}</text>`
      + `<text x="${x + 12}" y="238" font-size="11" fill="${hi ? TONES.text : TONES.muted}">${esc(r.label || '')}</text>`
      + '</g>';
  }).join('');
  const marks = results.map((r, i) => `<circle cx="${128 + i * 84}" cy="281" r="${r.highlight ? 9 : 6}" fill="${r.highlight ? accent : alpha(accent, 0.6)}"${r.highlight ? ` filter="url(#${uid}-glow)"` : ''}/>`).join('');
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Search',
    body: `<g transform="translate(32 28)"><rect width="536" height="44" rx="22" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<circle cx="26" cy="22" r="9" fill="none" stroke="${accent}" stroke-width="2.5"/><path d="M33 29 L40 36" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>`
      + `<text x="52" y="27" font-size="14" fill="${TONES.text}">${esc(spec.query || '')}</text>`
      + (spec.badge ? `<rect x="${536 - chipWidth(spec.badge) + 20}" y="9" width="${chipWidth(spec.badge) - 30}" height="26" rx="13" fill="${accent}"/><text x="${536 - (chipWidth(spec.badge) - 30) / 2 - 10}" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${readableOn(accent)}">${esc(spec.badge)}</text>` : '')
      + '</g>'
      + cards
      + `<rect x="32" y="278" width="536" height="6" rx="3" fill="#1a2534"/>${marks}`
      + `<text x="300" y="316" text-anchor="middle" font-size="12" fill="${TONES.text}">${esc(spec.caption || '')}</text>`,
  });
}

// Everyday movement fades back while the one that breaks the pattern is flagged.
export function activity(spec, { uid, accent }) {
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Unusual activity',
    body: `<g stroke="${alpha(accent, 0.35)}" stroke-width="2" fill="none"><rect x="40" y="40" width="520" height="280" rx="18"/>`
      + '<path d="M140 40 V120 M220 40 V120 M300 40 V120 M380 40 V120 M460 40 V120 M140 320 V240 M220 320 V240 M300 320 V240 M380 320 V240 M460 320 V240"/></g>'
      + `<rect x="500" y="150" width="60" height="60" rx="6" fill="#132030" stroke="${alpha(accent, 0.5)}"/>`
      + `<text x="530" y="185" text-anchor="middle" font-size="11" fill="${TONES.muted}">${esc(spec.place || 'Door')}</text>`
      + `<g fill="none" stroke="${TONES.ok}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round">`
      + '<path d="M60 180 C 160 170, 340 190, 498 178"/><path d="M60 196 C 180 206, 320 196, 498 192"/><path d="M100 300 C 140 240, 200 210, 300 186"/><path d="M180 60 C 200 120, 240 160, 330 176"/></g>'
      + `<path d="M120 140 C 220 130, 300 150, 420 150 C 470 150, 480 130, 470 120 C 455 104, 430 118, 440 136 C 452 158, 488 150, 486 132" fill="none" stroke="${TONES.alert}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="8 6"/>`
      + `<circle cx="462" cy="134" r="40" fill="${alpha(TONES.alert, 0.16)}"/><circle cx="486" cy="132" r="7" fill="${TONES.alert}"/>`
      + chip({ x: 60, y: 266, text: spec.alert || 'Unusual motion', tone: 'alert', accent })
      + chip({ x: 600 - 60 - chipWidth(spec.note || 'Normal paths learnt'), y: 266, text: spec.note || 'Normal paths learnt', tone: 'ok', accent }),
  });
}

// A plate read at a gate and the decision that follows.
export function plate(spec, { uid, accent }) {
  const tone = toneColour(spec.statusTone || 'ok', accent);
  const lines = (spec.lines || []).slice(0, 2);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Licence plate recognition',
    body: '<g transform="translate(60 70)">'
      + `<path d="M30 120 L60 50 C 66 36, 80 28, 96 28 H204 C 220 28, 234 36, 240 50 L270 120 Z" fill="#33404f" stroke="#5d6f83" stroke-width="2"/>`
      + `<path d="M72 60 C 76 50, 84 46, 96 46 H204 C 216 46, 224 50, 228 60 L240 96 H60 Z" fill="${TONES.panel}" stroke="${alpha(accent, 0.5)}"/>`
      + `<rect x="10" y="114" width="280" height="64" rx="18" fill="#3e4c5e" stroke="#5d6f83" stroke-width="2"/>`
      + '<circle cx="48" cy="140" r="14" fill="#fff4c2"/><circle cx="252" cy="140" r="14" fill="#fff4c2"/>'
      + `<rect x="100" y="134" width="100" height="34" rx="5" fill="#f2f6fb" stroke="${accent}" stroke-width="3"/>`
      + `<text x="150" y="158" text-anchor="middle" font-size="18" font-weight="800" fill="#0b1220" letter-spacing="1">${esc(spec.plate || '1AB 2CD')}</text>`
      + '<rect x="30" y="178" width="40" height="26" rx="8" fill="#1a2330"/><rect x="230" y="178" width="40" height="26" rx="8" fill="#1a2330"/>'
      + `<g fill="none" stroke="${accent}" stroke-width="3"><path d="M88 126 v-10 h10 M202 116 h10 v10 M212 176 v10 h-10 M98 186 h-10 v-10"/></g>`
      + '</g>'
      + '<g transform="translate(36 286)"><rect width="24" height="40" rx="4" fill="#5a2c2c"/><rect x="24" y="8" width="300" height="10" rx="5" fill="#e8f1ff"/>'
      + `<path d="M60 8 h30 v10 h-30 z M150 8 h30 v10 h-30 z M240 8 h30 v10 h-30 z" fill="${TONES.alert}"/></g>`
      + `<g transform="translate(392 70)"><rect width="176" height="218" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<text x="16" y="30" font-size="11" fill="${TONES.muted}">Plate read</text>`
      + `<text x="16" y="56" font-size="22" font-weight="800" fill="${TONES.text}">${esc(spec.plate || '1AB 2CD')}</text>`
      + `<text x="16" y="78" font-size="12" fill="${TONES.muted}">${esc(spec.confidence || 'Confidence 99%')}</text>`
      + `<rect x="16" y="94" width="144" height="30" rx="15" fill="${alpha(tone, 0.15)}" stroke="${tone}"/>`
      + `<text x="88" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="${tone}">${esc(spec.status || 'On the allow list')}</text>`
      + lines.map((l, i) => `<text x="16" y="${150 + i * 20}" font-size="12" fill="${TONES.muted}">${esc(l)}</text>`).join('')
      + `<path d="M16 196 H160" stroke="${alpha(accent, 0.25)}" stroke-width="6" stroke-linecap="round"/>`
      + '</g>',
  });
}

// A virtual line that tells a person from an animal.
export function perimeter(spec, { uid, accent }) {
  const alertText = spec.alert || 'Person crossed · alert';
  const alertW = chipWidth(alertText, 13) - 10;
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Perimeter protection',
    body: `<g stroke="${alpha(accent, 0.2)}" fill="none"><path d="M0 200 H600 M0 236 H600 M0 280 H600 M0 334 H600"/>`
      + '<path d="M260 160 L40 360 M300 160 L200 360 M340 160 L360 360 M380 160 L520 360 M220 160 L-120 360 M420 160 L680 360"/></g>'
      + `<polygon points="70,150 530,150 600,206 0,206" fill="${alpha(TONES.alert, 0.12)}"/>`
      + `<g stroke="#5d6f83" stroke-width="2"><path d="M40 150 H560"/><path d="M40 120 H560" stroke-opacity="0.5"/>`
      + '<path d="M60 110 V150 M120 110 V150 M180 110 V150 M240 110 V150 M300 110 V150 M360 110 V150 M420 110 V150 M480 110 V150 M540 110 V150"/></g>'
      + `<path d="M10 206 H590" stroke="${TONES.alert}" stroke-opacity="0.35" stroke-width="9"/><path d="M10 206 H590" stroke="${TONES.alert}" stroke-width="3" stroke-dasharray="12 8"/>`
      + chip({ x: 16, y: 214, text: spec.lineLabel || 'Virtual line', tone: 'alert', accent, size: 11 })
      + '<circle cx="330" cy="168" r="11" fill="#c9d6e8"/><rect x="317" y="181" width="26" height="46" rx="10" fill="#9fb3cc"/>'
      + '<path d="M330 227 l-10 22 M330 227 l12 20" stroke="#9fb3cc" stroke-width="7" stroke-linecap="round"/>'
      + brackets(302, 144, 56, 114, TONES.alert)
      + `<path d="M330 270 v28" stroke="${TONES.alert}" stroke-width="2"/>`
      + `<rect x="${330 - alertW / 2}" y="298" width="${alertW}" height="34" rx="17" fill="${TONES.alert}"/>`
      + `<text x="330" y="320" text-anchor="middle" font-size="13" font-weight="800" fill="#2a0508">${esc(alertText)}</text>`
      + '<ellipse cx="490" cy="250" rx="30" ry="14" fill="#5d6f87"/><circle cx="520" cy="238" r="9" fill="#5d6f87"/>'
      + '<path d="M472 260 v14 M482 262 v14 M500 262 v14 M510 260 v14" stroke="#5d6f87" stroke-width="5" stroke-linecap="round"/>'
      + brackets(452, 214, 82, 74, TONES.ok)
      + `<text x="493" y="306" text-anchor="middle" font-size="11" fill="${TONES.muted}">${esc(spec.ignored || 'Animal · ignored')}</text>`,
  });
}

// A heat picture: something running hot stands out from the scene.
export function thermal(spec, { uid, accent }) {
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Thermal imaging',
    body: `<defs><radialGradient id="${uid}-hot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff2a8"/><stop offset="0.35" stop-color="#ffb020"/><stop offset="0.7" stop-color="#ff4b4b" stop-opacity="0.8"/><stop offset="1" stop-color="#7a1fa2" stop-opacity="0"/></radialGradient>`
      + `<linearGradient id="${uid}-cold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1446"/><stop offset="1" stop-color="#2a1a6e"/></linearGradient></defs>`
      + `<rect x="40" y="40" width="360" height="280" rx="16" fill="url(#${uid}-cold)" stroke="${alpha(accent, 0.5)}"/>`
      + '<g fill="#3b2a8a"><rect x="70" y="190" width="70" height="110" rx="6"/><rect x="160" y="160" width="70" height="140" rx="6"/><rect x="250" y="210" width="120" height="90" rx="6"/></g>'
      + `<circle cx="195" cy="200" r="54" fill="url(#${uid}-hot)"/>`
      + `<circle cx="310" cy="250" r="26" fill="url(#${uid}-hot)" opacity="0.55"/>`
      + brackets(140, 146, 110, 110, TONES.alert)
      + `<text x="195" y="135" text-anchor="middle" font-size="13" font-weight="800" fill="#ffd6d6">${esc(spec.temp || '78 °C')}</text>`
      + `<g transform="translate(420 40)"><rect width="140" height="280" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<defs><linearGradient id="${uid}-scale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset="0.3" stop-color="#ffb020"/><stop offset="0.6" stop-color="#ff4b4b"/><stop offset="1" stop-color="#2a1a6e"/></linearGradient></defs>`
      + `<rect x="20" y="24" width="16" height="200" rx="8" fill="url(#${uid}-scale)"/>`
      + `<text x="48" y="36" font-size="11" fill="${TONES.muted}">Hot</text><text x="48" y="224" font-size="11" fill="${TONES.muted}">Cold</text>`
      + `<text x="20" y="252" font-size="12" font-weight="700" fill="${TONES.alert}">${esc(spec.alert || 'Over threshold')}</text>`
      + '</g>',
  });
}

// An alert written in ordinary words turning into a rule.
export function prompt(spec, { uid, accent }) {
  const cards = (spec.cards || []).slice(0, 3).map((c, i) => `<g transform="translate(${40 + i * 180} 232)">`
    + `<rect width="160" height="88" rx="14" fill="${TONES.panel}" stroke="${i === 2 ? accent : TONES.line}" stroke-width="${i === 2 ? 2 : 1}"/>`
    + `<text x="16" y="26" font-size="11" fill="${TONES.muted}">${esc(c.label)}</text>`
    + `<text x="16" y="52" font-size="15" font-weight="700" fill="${TONES.text}">${esc(c.value)}</text>`
    + `<text x="16" y="72" font-size="11" fill="${i === 2 ? TONES.ok : TONES.muted}">${esc(c.sub || '')}</text>`
    + '</g>').join('');
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Plain-language alerts',
    body: `<g transform="translate(40 34)"><rect width="520" height="70" rx="16" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<text x="22" y="30" font-size="11" fill="${TONES.muted}">${esc(spec.heading || 'New alert')}</text>`
      + `<text x="22" y="54" font-size="15" fill="${TONES.text}">${esc(spec.prompt || '')}</text></g>`
      + `<path d="M300 112 V150" stroke="${accent}" stroke-width="3"/>`
      + `<g transform="translate(276 148)"><rect width="48" height="48" rx="14" fill="${alpha(accent, 0.18)}" stroke="${accent}"/>`
      + `<path d="M24 10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="${accent}"/></g>`
      + `<path d="M300 204 V230" stroke="${accent}" stroke-width="3"/><path d="M120 230 H480" stroke="${alpha(accent, 0.5)}" stroke-width="2"/>`
      + cards,
  });
}