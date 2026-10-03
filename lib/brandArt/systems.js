// Brand drawings of whole systems: what runs on site, what runs in the
// cloud, how the parts connect, the screens people use and the site map.
import { TONES, alpha, bigIcon, chip, chipWidth, esc, frame, readableOn, toneColour } from './kit.js';

function row({ x, y, w, h = 52, label, sub, icon, accent, hi = false }) {
  return `<g transform="translate(${x} ${y})">`
    + `<rect width="${w}" height="${h}" rx="12" fill="${hi ? alpha(accent, 0.14) : TONES.panel}" stroke="${hi ? accent : TONES.line}" stroke-width="${hi ? 2 : 1}"/>`
    + bigIcon(icon || 'camera', 28, h / 2, hi ? accent : '#c9d6e8', 1.1)
    + `<text x="54" y="${sub ? h / 2 - 3 : h / 2 + 5}" font-size="13" font-weight="700" fill="${TONES.text}">${esc(label)}</text>`
    + (sub ? `<text x="54" y="${h / 2 + 14}" font-size="11" fill="${TONES.muted}">${esc(sub)}</text>` : '')
    + '</g>';
}

function spread(count, top, bottom, size) {
  if (count <= 1) return [top + (bottom - top - size) / 2];
  const gap = (bottom - top - count * size) / (count - 1);
  return Array.from({ length: count }, (_, i) => top + i * (size + gap));
}

function link(x1, y1, x2, y2, colour, dashed = true) {
  const mid = (x1 + x2) / 2;
  return `<path d="M${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" fill="none" stroke="${colour}" stroke-width="2"${dashed ? ' stroke-dasharray="4 6"' : ''}/>`;
}

// Everything kept on the customer's own site: devices feed a server in
// the building and nothing has to leave.
export function onPrem(spec, { uid, accent }) {
  const devices = (spec.devices || []).slice(0, 4);
  const points = (spec.points || []).slice(0, 3);
  const ys = spread(devices.length, 92, 300, 46);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Running on site',
    body: `<path d="M24 76 L190 28 L356 76 V330 H24 Z" fill="${alpha(accent, 0.05)}" stroke="${alpha(accent, 0.55)}" stroke-width="2" stroke-dasharray="6 6"/>`
      + chip({ x: 128, y: 52, text: spec.badge || 'Stays on site', tone: 'accent', accent, size: 11 })
      + devices.map((d, i) => row({ x: 40, y: ys[i], w: 150, h: 46, label: d.label, icon: d.icon, accent })).join('')
      + devices.map((_, i) => link(190, ys[i] + 23, 236, 200, alpha(accent, 0.7))).join('')
      + `<g transform="translate(236 132)"><rect width="104" height="150" rx="12" fill="#121c2b" stroke="${accent}" stroke-width="2"/>`
      + [0, 1, 2, 3].map((i) => `<rect x="12" y="${14 + i * 30}" width="80" height="22" rx="4" fill="#0a121c" stroke="#2c3b50"/><circle cx="80" cy="${25 + i * 30}" r="3" fill="${i === 0 ? TONES.ok : alpha(accent, 0.8)}"/>`).join('')
      + `<text x="52" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="${TONES.text}">${esc(spec.server || 'Server')}</text></g>`
      + `<g transform="translate(380 76)"><rect width="196" height="254" rx="16" fill="${TONES.panel}" stroke="${TONES.line}"/>`
      + `<text x="20" y="34" font-size="14" font-weight="800" fill="${TONES.text}">${esc(spec.title || 'On your premises')}</text>`
      + `<text x="20" y="54" font-size="11" fill="${TONES.muted}">${esc(spec.sub || '')}</text>`
      + points.map((p, i) => `<g transform="translate(20 ${82 + i * 56})"><circle cx="8" cy="8" r="8" fill="${alpha(accent, 0.2)}" stroke="${accent}"/><path d="M4 8 l3 3 l5 -6" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>`
        + `<text x="26" y="13" font-size="12" font-weight="700" fill="${TONES.text}">${esc(p)}</text></g>`).join('')
      + '</g>',
  });
}

// The cloud in the middle: sites send up, people sign in from anywhere.
export function cloud(spec, { uid, accent }) {
  const sites = (spec.sites || []).slice(0, 3);
  const clients = (spec.clients || []).slice(0, 2);
  const siteX = sites.map((_, i) => 300 + (i - (sites.length - 1) / 2) * 180);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Running in the cloud',
    body: `<g transform="translate(300 128)"><path d="M-110 50 a42 42 0 0 1 8 -83 a62 62 0 0 1 116 -10 a46 46 0 0 1 90 22 a36 36 0 0 1 6 71 z" fill="${alpha(accent, 0.12)}" stroke="${accent}" stroke-width="2.5"/>`
      + `<text x="0" y="8" text-anchor="middle" font-size="16" font-weight="800" fill="${TONES.text}">${esc(spec.title || 'Cloud')}</text>`
      + `<text x="0" y="30" text-anchor="middle" font-size="11" fill="#c9d6e8">${esc(spec.sub || '')}</text></g>`
      + (spec.badge ? chip({ x: 300 - chipWidth(spec.badge, 11) / 2, y: 10, text: spec.badge, tone: 'ok', accent, size: 11 }) : '')
      + sites.map((s, i) => link(siteX[i], 262, 300, 178, alpha(accent, 0.7))).join('')
      + sites.map((s, i) => `<g transform="translate(${siteX[i] - 76} 262)"><rect width="152" height="70" rx="14" fill="${TONES.panel}" stroke="${TONES.line}"/>`
        + bigIcon(s.icon || 'camera', 30, 35, accent, 1.1)
        + `<text x="56" y="31" font-size="12" font-weight="700" fill="${TONES.text}">${esc(s.label)}</text>`
        + `<text x="56" y="49" font-size="10" fill="${TONES.muted}">${esc(s.sub || '')}</text></g>`).join('')
      + clients.map((c, i) => {
        const left = i === 0;
        const x = left ? 28 : 472;
        return link(left ? 128 : 472, 132, left ? 194 : 406, 128, alpha(accent, 0.5))
          + `<g transform="translate(${x} 104)"><rect width="100" height="56" rx="12" fill="${TONES.panel}" stroke="${TONES.line}"/>`
          + bigIcon(c.icon || 'laptop', 26, 28, '#c9d6e8', 1)
          + `<text x="48" y="33" font-size="11" font-weight="700" fill="${TONES.text}">${esc(c.label)}</text></g>`;
      }).join(''),
  });
}

// How it all connects: devices on the left, the platform in the middle,
// the people who use it on the right.
export function architecture(spec, { uid, accent }) {
  const devices = (spec.devices || []).slice(0, 5);
  const platforms = (spec.platforms || []).slice(0, 3);
  const people = (spec.people || []).slice(0, 4);
  const heads = spec.columns || ['On site', 'Platform', 'People'];
  const dY = spread(devices.length, 84, 404, 52);
  const pY = spread(platforms.length, 96, 392, 92);
  const uY = spread(people.length, 92, 396, 56);
  const pOf = (i, n) => Math.min(platforms.length - 1, Math.floor((i * platforms.length) / Math.max(n, 1)));
  return frame({
    uid, w: 1000, h: 470, accent, label: spec.alt || 'How the system fits together',
    body: heads.map((h, i) => `<text x="${[40, 390, 740][i]}" y="58" font-size="12" font-weight="800" letter-spacing="2" fill="${accent}">${esc(String(h).toUpperCase())}</text>`).join('')
      + devices.map((_, i) => link(260, dY[i] + 26, 390, pY[pOf(i, devices.length)] + 46, alpha(accent, 0.65))).join('')
      + people.map((_, i) => link(610, pY[pOf(i, people.length)] + 46, 740, uY[i] + 28, alpha(accent, 0.45), false)).join('')
      + devices.map((d, i) => row({ x: 40, y: dY[i], w: 220, label: d.label, sub: d.sub, icon: d.icon, accent })).join('')
      + platforms.map((p, i) => `<g transform="translate(390 ${pY[i]})"><rect width="220" height="92" rx="16" fill="${alpha(accent, 0.12)}" stroke="${accent}" stroke-width="2"${i === 0 ? ` filter="url(#${uid}-glow)"` : ''}/>`
        + bigIcon(p.icon || 'server', 34, 46, accent, 1.4)
        + `<text x="66" y="42" font-size="15" font-weight="800" fill="${TONES.text}">${esc(p.label)}</text>`
        + `<text x="66" y="62" font-size="11" fill="${TONES.muted}">${esc(p.sub || '')}</text></g>`).join('')
      + people.map((u, i) => row({ x: 740, y: uY[i], w: 220, h: 56, label: u.label, sub: u.sub, icon: u.icon || 'person', accent })).join('')
      + (spec.footer ? `<text x="500" y="448" text-anchor="middle" font-size="12" fill="${TONES.muted}">${esc(spec.footer)}</text>` : ''),
  });
}

// The screen people watch: headline numbers, a trend and the latest events.
export function dashboard(spec, { uid, accent }) {
  const tiles = (spec.tiles || []).slice(0, 4);
  const bars = (spec.bars || [4, 6, 5, 8, 7, 9, 6, 10]).slice(0, 8);
  const events = (spec.events || []).slice(0, 4);
  const top = Math.max(...bars, 1);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'The dashboard',
    body: `<rect x="24" y="20" width="552" height="320" rx="16" fill="${alpha(TONES.panel, 0.85)}" stroke="${TONES.line}"/>`
      + `<text x="44" y="50" font-size="14" font-weight="800" fill="${TONES.text}">${esc(spec.title || 'Overview')}</text>`
      + '<circle cx="540" cy="45" r="5" fill="#ff5f57"/><circle cx="522" cy="45" r="5" fill="#febc2e"/><circle cx="504" cy="45" r="5" fill="#28c840"/>'
      + tiles.map((t, i) => {
        const tone = toneColour(t.tone || 'accent', accent);
        return `<g transform="translate(${44 + i * 130} 66)"><rect width="118" height="68" rx="12" fill="#0a121c" stroke="${TONES.line}"/>`
          + `<text x="14" y="24" font-size="10" fill="${TONES.muted}">${esc(t.label)}</text>`
          + `<text x="14" y="52" font-size="20" font-weight="800" fill="${tone}">${esc(t.value)}</text></g>`;
      }).join('')
      + `<g transform="translate(44 152)"><rect width="300" height="168" rx="12" fill="#0a121c" stroke="${TONES.line}"/>`
      + `<text x="14" y="24" font-size="11" fill="${TONES.muted}">${esc(spec.chart || 'This week')}</text>`
      + bars.map((b, i) => {
        const h = Math.round((b / top) * 108);
        return `<rect x="${20 + i * 34}" y="${152 - h}" width="22" height="${h}" rx="4" fill="${i === bars.length - 1 ? accent : alpha(accent, 0.45)}"/>`;
      }).join('')
      + '</g>'
      + `<g transform="translate(360 152)"><rect width="196" height="168" rx="12" fill="#0a121c" stroke="${TONES.line}"/>`
      + `<text x="14" y="24" font-size="11" fill="${TONES.muted}">${esc(spec.eventsTitle || 'Latest')}</text>`
      + events.map((e, i) => `<circle cx="20" cy="${50 + i * 32}" r="5" fill="${toneColour(e.tone || 'ok', accent)}"/>`
        + `<text x="34" y="${54 + i * 32}" font-size="11" fill="${TONES.text}">${esc(e.text)}</text>`).join('')
      + '</g>',
  });
}

// A floor plan with every device placed and the one that needs attention lit.
export function map(spec, { uid, accent }) {
  const markers = (spec.markers || []).slice(0, 7);
  const px = (v) => 44 + (Number(v) / 100) * 512;
  const py = (v) => 44 + (Number(v) / 100) * 248;
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'Every device on the site plan',
    body: `<g fill="none" stroke="${alpha(accent, 0.45)}" stroke-width="2"><rect x="36" y="36" width="528" height="264" rx="10"/>`
      + '<path d="M36 150 H230 V36 M230 150 V300 M230 210 H380 V300 M380 36 V140 H564 M470 140 V300"/></g>'
      + '<g fill="#0a1018"><rect x="200" y="146" width="40" height="8"/><rect x="376" y="250" width="8" height="30"/><rect x="430" y="136" width="30" height="8"/></g>'
      + markers.map((m) => {
        const x = px(m.x);
        const y = py(m.y);
        const tone = toneColour(m.tone || 'accent', accent);
        const hot = m.tone === 'alert' || m.tone === 'warn';
        return (hot ? `<circle cx="${x}" cy="${y}" r="30" fill="${alpha(tone, 0.15)}"/>` : '')
          + `<circle cx="${x}" cy="${y}" r="16" fill="${TONES.panel}" stroke="${tone}" stroke-width="2"${hot ? ` filter="url(#${uid}-glow)"` : ''}/>`
          + bigIcon(m.icon || 'camera', x, y, tone, 0.7)
          + (m.label && hot ? `<rect x="${x - (chipWidth(m.label, 10) - 24) / 2}" y="${y + 20}" width="${chipWidth(m.label, 10) - 24}" height="18" rx="9" fill="${tone}"/>` : '')
          + (m.label ? `<text x="${x}" y="${y + 33}" text-anchor="middle" font-size="10" font-weight="700" fill="${hot ? readableOn(tone) : TONES.muted}">${esc(m.label)}</text>` : '');
      }).join('')
      + (spec.caption ? chip({ x: 36, y: 314, text: spec.caption, tone: spec.captionTone || 'accent', accent, size: 11 }) : ''),
  });
}

// A phone with an alert on it and the buttons that act on it.
export function mobile(spec, { uid, accent }) {
  const actions = (spec.actions || []).slice(0, 2);
  const side = (spec.side || []).slice(0, 3);
  const tone = toneColour(spec.tone || 'accent', accent);
  return frame({
    uid, w: 600, h: 360, accent, label: spec.alt || 'On the phone',
    body: `<g transform="translate(208 16)"><rect width="184" height="328" rx="30" fill="#0b1119" stroke="#3a4d68" stroke-width="3"/>`
      + '<rect x="66" y="12" width="52" height="12" rx="6" fill="#1a2536"/>'
      + `<text x="22" y="56" font-size="11" fill="${TONES.muted}">${esc(spec.app || 'App')}</text>`
      + `<rect x="14" y="70" width="156" height="112" rx="16" fill="${TONES.panel}" stroke="${tone}" stroke-width="2"/>`
      + bigIcon(spec.icon || 'alarm', 38, 98, tone, 0.9)
      + `<text x="58" y="103" font-size="12" font-weight="800" fill="${TONES.text}">${esc(spec.notice || 'Alert')}</text>`
      + `<text x="26" y="132" font-size="10" fill="${TONES.muted}">${esc(spec.sub || '')}</text>`
      + `<text x="26" y="150" font-size="10" fill="${TONES.muted}">${esc(spec.time || 'Just now')}</text>`
      + actions.map((a, i) => `<rect x="14" y="${198 + i * 50}" width="156" height="40" rx="20" fill="${i === 0 ? accent : 'none'}" stroke="${accent}" stroke-width="2"/>`
        + `<text x="92" y="${223 + i * 50}" text-anchor="middle" font-size="12" font-weight="800" fill="${i === 0 ? readableOn(accent) : TONES.text}">${esc(a)}</text>`).join('')
      + '<rect x="62" y="306" width="60" height="5" rx="2.5" fill="#3a4d68"/></g>'
      + side.map((s, i) => {
        const left = i !== 1;
        const x = left ? 24 : 424;
        const y = i === 2 ? 220 : 80;
        return link(left ? 176 : 424, y + 28, left ? 208 : 392, 130, alpha(accent, 0.5))
          + row({ x, y, w: 152, h: 56, label: s.label, sub: s.sub, icon: s.icon, accent });
      }).join(''),
  });
}