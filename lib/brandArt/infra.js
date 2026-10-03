// Brand drawings of what sits underneath: the network, backup power,
// sound, storage, detectors and the bags that carry the kit.
import { TONES, alpha, bigIcon, chip, chipWidth, esc, frame, toneColour } from './kit.js';

// A switch powering and connecting every device from one cable each.
export function network(spec, { uid, accent }) {
  const ports = (spec.ports || []).slice(0, 6);
  const xs = ports.map((_, i) => 300 + (i - (ports.length - 1) / 2) * 92);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'The network underneath',
    body: (spec.uplink ? `<g transform="translate(240 20)"><rect width="120" height="40" rx="12" fill="${TONES.panel}" stroke="${TONES.line}"/>`
        + bigIcon('cloud', 26, 20, accent, 0.8)
        + `<text x="46" y="25" font-size="11" font-weight="700" fill="${TONES.text}">${esc(spec.uplink)}</text></g>`
        + `<path d="M300 60 V112" stroke="${accent}" stroke-width="2.5"/>` : '')
      + `<g transform="translate(110 112)"><rect width="380" height="64" rx="12" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + `<text x="20" y="28" font-size="13" font-weight="800" fill="${TONES.text}">${esc(spec.switchLabel || 'Switch')}</text>`
      + `<text x="20" y="46" font-size="10" fill="${TONES.muted}">${esc(spec.switchSub || '')}</text>`
      + Array.from({ length: 8 }, (_, i) => `<rect x="${196 + i * 22}" y="20" width="16" height="14" rx="2" fill="#0a121c" stroke="#3a4d68"/><circle cx="${204 + i * 22}" cy="44" r="2.5" fill="${i < ports.length ? TONES.ok : '#3a4d68'}"/>`).join('')
      + '</g>'
      + ports.map((p, i) => {
        const tone = toneColour(p.tone || 'accent', accent);
        return `<path d="M${306 + (i - (ports.length - 1) / 2) * 22} 176 C ${300 + (i - (ports.length - 1) / 2) * 22} 206, ${xs[i]} 200, ${xs[i]} 226" fill="none" stroke="${alpha(tone, 0.8)}" stroke-width="2.5"/>`
          + `<g transform="translate(${xs[i] - 40} 226)"><rect width="80" height="84" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
          + bigIcon(p.icon || 'camera', 40, 32, tone, 1.2)
          + `<text x="40" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${TONES.text}">${esc(p.label)}</text></g>`;
      }).join('')
      + (spec.caption ? `<text x="300" y="338" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.caption)}</text>` : ''),
  });
}

// Mains in, battery holding the charge, the load kept running.
export function power(spec, { uid, accent }) {
  const loads = (spec.loads || []).slice(0, 3);
  const level = Math.max(0, Math.min(100, Number(spec.charge ?? 82)));
  const status = toneColour(spec.statusTone || 'ok', accent);
  const ys = loads.map((_, i) => 70 + i * 82);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Backup power',
    body: `<g transform="translate(28 128)"><rect width="120" height="76" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + bigIcon('bolt', 30, 38, TONES.warn, 1.2)
      + `<text x="54" y="34" font-size="12" font-weight="700" fill="${TONES.text}">${esc(spec.source || 'Mains')}</text>`
      + `<text x="54" y="52" font-size="10" fill="${TONES.muted}">${esc(spec.sourceSub || '')}</text></g>`
      + `<path d="M148 166 H200" stroke="${TONES.warn}" stroke-width="3" stroke-dasharray="6 6"/>`
      + `<g transform="translate(200 70)"><rect width="150" height="220" rx="18" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + `<text x="75" y="32" text-anchor="middle" font-size="13" font-weight="800" fill="${TONES.text}">${esc(spec.unit || 'UPS')}</text>`
      + `<rect x="45" y="50" width="60" height="120" rx="8" fill="#0a121c" stroke="#3a4d68"/><rect x="63" y="42" width="24" height="8" rx="2" fill="#3a4d68"/>`
      + `<rect x="50" y="${55 + (110 * (100 - level)) / 100}" width="50" height="${(110 * level) / 100}" rx="5" fill="${status}" opacity="0.85"/>`
      + `<text x="75" y="196" text-anchor="middle" font-size="16" font-weight="800" fill="${status}">${esc(spec.runtime || `${level}%`)}</text></g>`
      + loads.map((l, i) => `<path d="M350 180 C 380 180, 380 ${ys[i] + 32}, 410 ${ys[i] + 32}" fill="none" stroke="${alpha(accent, 0.7)}" stroke-width="2.5"/>`
        + `<g transform="translate(410 ${ys[i]})"><rect width="162" height="64" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
        + bigIcon(l.icon || 'server', 30, 32, accent, 1.1)
        + `<text x="56" y="30" font-size="12" font-weight="700" fill="${TONES.text}">${esc(l.label)}</text>`
        + `<text x="56" y="47" font-size="10" fill="${TONES.ok}">${esc(l.sub || 'Running')}</text></g>`).join('')
      + (spec.status ? chip({ x: 200 + 75 - chipWidth(spec.status, 11) / 2, y: 302, text: spec.status, tone: spec.statusTone || 'ok', accent, size: 11 }) : ''),
  });
}

// Sound to every zone, each at its own level.
export function audio(spec, { uid, accent }) {
  const zones = (spec.zones || []).slice(0, 4);
  const ys = zones.map((_, i) => 24 + i * 72);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Sound in every zone',
    body: `<g transform="translate(28 91)"><rect width="150" height="140" rx="16" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + bigIcon(spec.sourceIcon || 'mic', 75, 50, accent, 1.6)
      + `<text x="75" y="98" text-anchor="middle" font-size="13" font-weight="800" fill="${TONES.text}">${esc(spec.source || 'Source')}</text>`
      + `<text x="75" y="118" text-anchor="middle" font-size="10" fill="${TONES.muted}">${esc(spec.sourceSub || '')}</text></g>`
      + zones.map((z, i) => {
        const level = Math.max(0, Math.min(100, Number(z.level ?? 70)));
        const live = z.live !== false;
        return `<path d="M178 161 C 210 161, 210 ${ys[i] + 29}, 246 ${ys[i] + 29}" fill="none" stroke="${alpha(accent, live ? 0.75 : 0.25)}" stroke-width="2.5"/>`
          + `<g transform="translate(246 ${ys[i]})"><rect width="326" height="58" rx="14" fill="${TONES.panel}" stroke="${live ? alpha(accent, 0.6) : TONES.line}"/>`
          + bigIcon('speaker', 30, 29, live ? accent : TONES.muted, 1.1)
          + (live ? `<path d="M52 19 a14 14 0 0 1 0 20 M58 13 a22 22 0 0 1 0 32" fill="none" stroke="${alpha(accent, 0.6)}" stroke-width="2" stroke-linecap="round"/>` : '')
          + `<text x="76" y="25" font-size="12" font-weight="700" fill="${TONES.text}">${esc(z.name)}</text>`
          + `<text x="76" y="43" font-size="10" fill="${TONES.muted}">${esc(z.note || '')}</text>`
          + `<rect x="210" y="24" width="96" height="10" rx="5" fill="#1a2534"/><rect x="210" y="24" width="${(96 * level) / 100}" height="10" rx="5" fill="${live ? accent : TONES.muted}"/></g>`;
      }).join('')
      + (spec.announcement ? chip({ x: 28, y: 314, text: spec.announcement, tone: 'accent', accent, size: 11 }) : ''),
  });
}

// Where the footage or data lives: tiers from fast and local to cheap and far.
export function storage(spec, { uid, accent }) {
  const tiers = (spec.tiers || []).slice(0, 3);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Where the data is kept',
    body: tiers.map((t, i) => {
      const y = 40 + i * 92;
      const hi = i === (spec.active ?? tiers.length - 1);
      return `<g transform="translate(40 ${y})"><rect width="330" height="76" rx="16" fill="${hi ? alpha(accent, 0.14) : TONES.panel}" stroke="${hi ? accent : TONES.line}" stroke-width="${hi ? 2 : 1}"/>`
        + bigIcon(t.icon || 'server', 38, 38, hi ? accent : '#c9d6e8', 1.4)
        + `<text x="74" y="34" font-size="14" font-weight="800" fill="${TONES.text}">${esc(t.label)}</text>`
        + `<text x="74" y="54" font-size="11" fill="${TONES.muted}">${esc(t.sub || '')}</text></g>`
        + (i < tiers.length - 1 ? `<path d="M205 ${y + 76} V${y + 92}" stroke="${accent}" stroke-width="2.5"/>` : '');
    }).join('')
    + `<g transform="translate(394 40)"><rect width="176" height="260" rx="16" fill="${TONES.panel}" stroke="${TONES.line}"/>`
    + `<text x="20" y="38" font-size="11" fill="${TONES.muted}">${esc(spec.statLabel || 'Kept for')}</text>`
    + `<text x="20" y="74" font-size="30" font-weight="900" fill="${accent}">${esc(spec.stat || '90 days')}</text>`
    + (spec.badge ? `<rect x="20" y="96" width="136" height="28" rx="14" fill="${alpha(TONES.ok, 0.15)}" stroke="${TONES.ok}"/><text x="88" y="115" text-anchor="middle" font-size="11" font-weight="700" fill="${TONES.ok}">${esc(spec.badge)}</text>` : '')
    + (spec.points || []).slice(0, 3).map((p, i) => `<text x="20" y="${158 + i * 26}" font-size="11" fill="${TONES.text}">${esc(p)}</text>`).join('')
    + '</g>'
    + (spec.caption ? `<text x="300" y="336" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.caption)}</text>` : ''),
  });
}

// A detector and the area it covers, with what it reported.
export function sensor(spec, { uid, accent }) {
  const events = (spec.events || []).slice(0, 3);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'A detector and its coverage',
    body: `<path d="M200 70 L40 320 H360 Z" fill="${alpha(accent, 0.12)}" stroke="${alpha(accent, 0.4)}"/>`
      + [0, 1, 2, 3].map((i) => `<path d="M${200 - 40 - i * 30} ${130 + i * 50} Q 200 ${150 + i * 54} ${200 + 40 + i * 30} ${130 + i * 50}" fill="none" stroke="${alpha(accent, 0.5 - i * 0.08)}" stroke-width="2" stroke-dasharray="3 6"/>`).join('')
      + `<path d="M200 70 L40 320 M200 70 L360 320" stroke="${alpha(accent, 0.45)}" stroke-width="1.5"/>`
      + `<circle cx="200" cy="62" r="30" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + bigIcon(spec.icon || 'motion', 200, 62, accent, 1.2)
      + (spec.target ? `<circle cx="250" cy="250" r="26" fill="${alpha(TONES.warn, 0.18)}"/>` + bigIcon(spec.target, 250, 250, TONES.warn, 1.2) : '')
      + `<text x="200" y="344" text-anchor="middle" font-size="11" fill="${TONES.muted}">${esc(spec.coverage || '')}</text>`
      + `<g transform="translate(392 40)"><rect width="180" height="280" rx="16" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<text x="20" y="36" font-size="14" font-weight="800" fill="${TONES.text}">${esc(spec.label || 'Detector')}</text>`
      + `<text x="20" y="56" font-size="11" fill="${TONES.muted}">${esc(spec.sub || '')}</text>`
      + events.map((e, i) => {
        const tone = toneColour(e.tone || 'ok', accent);
        return `<g transform="translate(16 ${80 + i * 62})"><rect width="148" height="50" rx="12" fill="${alpha(tone, 0.1)}" stroke="${alpha(tone, 0.6)}"/>`
          + `<circle cx="18" cy="25" r="5" fill="${tone}"/>`
          + `<text x="32" y="22" font-size="11" font-weight="700" fill="${TONES.text}">${esc(e.text)}</text>`
          + `<text x="32" y="38" font-size="10" fill="${TONES.muted}">${esc(e.sub || '')}</text></g>`;
      }).join('')
      + '</g>',
  });
}

// A bag opened up, each pocket labelled for the gear it carries.
export function bag(spec, { uid, accent }) {
  const pockets = (spec.pockets || []).slice(0, 4);
  const spots = [[60, 70], [60, 200], [430, 70], [430, 200]];
  const anchors = [[232, 120], [222, 236], [370, 128], [380, 232]];
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Every pocket has a job',
    body: `<g transform="translate(210 40)"><rect x="30" y="0" width="120" height="40" rx="20" fill="none" stroke="#5d6f83" stroke-width="8"/>`
      + `<rect x="0" y="30" width="180" height="250" rx="34" fill="#1b2533" stroke="${alpha(accent, 0.7)}" stroke-width="2.5"/>`
      + `<rect x="18" y="56" width="144" height="110" rx="14" fill="#121a26" stroke="#3a4d68"/>`
      + `<rect x="34" y="72" width="112" height="72" rx="6" fill="#0a121c" stroke="${accent}" stroke-width="2"/>`
      + `<path d="M34 152 h112" stroke="${accent}" stroke-width="3"/>`
      + `<rect x="18" y="182" width="144" height="80" rx="14" fill="#121a26" stroke="#3a4d68"/>`
      + `<path d="M30 196 h120" stroke="${alpha(accent, 0.8)}" stroke-width="3" stroke-dasharray="2 4"/>`
      + bigIcon('phone', 60, 232, '#c9d6e8', 0.9) + bigIcon('key', 120, 232, '#c9d6e8', 0.9)
      + '</g>'
      + pockets.map((p, i) => {
        const [x, y] = spots[i];
        const [ax, ay] = anchors[i];
        const left = i < 2;
        const w = chipWidth(p, 12);
        const cx = left ? Math.max(16, x + 110 - w) : x;
        return `<path d="M${left ? cx + w : cx} ${y + 16} L${ax} ${ay}" stroke="${alpha(accent, 0.6)}" stroke-width="1.5"/>`
          + `<circle cx="${ax}" cy="${ay}" r="4" fill="${accent}"/>`
          + chip({ x: cx, y, text: p, tone: 'accent', accent });
      }).join('')
      + (spec.caption ? `<text x="300" y="344" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.caption)}</text>` : ''),
  });
}