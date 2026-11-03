// The site plan as a branded Excel workbook (Robert, 2026-11-03): a summary with
// the cable to order and where to buy it, the plan picture, the equipment schedule
// with each device's cable, and one cable schedule per system. Every sheet carries
// the logo, the website and a quote link: the free tools are there to advertise.
// Then an inspection and test plan per system, to sign off at handover (itp.js).
// Pure: the pictures come in as bytes, so this runs in the browser and in tests.
import { BRAND, tagged } from './brand.js';
import { CABLE_TYPES, SYSTEMS, cableFor, cableSchedules, cableType, headEndFor } from './cables.js';
import { ITP_POINTS, ITP_RESULTS, ITP_TEMPLATES, inspectionPlans } from './itp.js';
import { coverageText, deviceType } from './model.js';
import { buildXlsx, colName } from './xlsx.js';

const LOGO_HEIGHT = 64; // px, in a 58 pt (77 px) band

// The band, title strip and note at the top of every sheet; the table starts on row 5.
function header(sheet, title, columns, brand, planName, date, logo) {
  const end = colName(columns - 1);
  sheet.rows[0] = [{ v: `Free design tools from ${brand.name}  ·  ${brand.websiteLabel}`, s: 'bandRight' }];
  sheet.rows[1] = [{ v: planName ? `${title}  ·  ${planName}` : title, s: 'strip' }];
  sheet.rows[2] = [{ v: `Prepared ${date} with the free Site Plan Designer from ${brand.name}. Planning estimates only; confirm on site.`, s: 'muted' }];
  for (let c = 1; c < columns; c += 1) {
    sheet.rows[0][c] = { v: '', s: 'band' };
    sheet.rows[1][c] = { v: '', s: 'strip' };
  }
  sheet.heights[1] = 58;
  sheet.heights[2] = 26;
  sheet.heights[3] = 28;
  sheet.merges.push(`A1:${end}1`, `A2:${end}2`, `A3:${end}3`);
  sheet.links.push({ ref: 'A1', url: tagged(brand.toolsUrl, 'excel') });
  if (logo) {
    sheet.pictures.push({ image: 0, col: 0, row: 0, dx: 10, dy: 7, height: LOGO_HEIGHT, width: Math.round((LOGO_HEIGHT * logo.width) / logo.height), alt: brand.name });
  }
  sheet.footer = `&L&"Calibri,Bold"${brand.name}&"Calibri,Regular"  ·  ${brand.websiteLabel}  ·  ${brand.email}&RPage &P of &N`;
}

// The call to action under every sheet's table.
function callToAction(sheet, columns, brand) {
  const end = colName(columns - 1);
  const r = sheet.rows.length + 1; // leave a blank row
  sheet.rows[r] = [{ v: `Like this plan? ${brand.name} can design, supply, install and monitor it. Get a free quote: ${brand.websiteLabel}/contact or ${brand.email}`, s: 'cta' }];
  for (let c = 1; c < columns; c += 1) sheet.rows[r][c] = { v: '', s: 'cta' };
  sheet.heights[r + 1] = 36;
  sheet.merges.push(`A${r + 1}:${end}${r + 1}`);
  sheet.links.push({ ref: `A${r + 1}`, url: tagged(brand.quoteUrl, 'excel') });
  sheet.rows[r + 1] = [{ v: `Shop the parts at ${brand.websiteLabel}/store  ·  ${brand.tagline}`, s: 'link' }];
  sheet.links.push({ ref: `A${r + 2}`, url: tagged(brand.storeUrl, 'excel') });
}

const newSheet = (name, cols, landscape = true) => ({ name, cols, rows: [], heights: {}, merges: [], links: [], pictures: [], validations: [], breaks: [], landscape, freeze: 0 });
const head = (labels) => labels.map((v) => ({ v, s: 'head' }));

/**
 * The workbook for a plan: { title, author, company, images, sheets } for buildXlsx.
 * logo / picture: { data: Uint8Array, type, width, height } or null. itp: the inspection and test
 * plan checks (ITP_TEMPLATES, or a company's own in the same shape), or false for none.
 */
export function sitePlanWorkbook(plan, { brand = BRAND, date = '', logo = null, picture = null, itp = ITP_TEMPLATES } = {}) {
  const devices = plan?.devices || [];
  const name = String(plan?.name || '').trim();
  const schedules = cableSchedules(plan);
  const scaled = plan?.pxPerMetre > 0;
  const images = [];
  if (logo) images.push({ data: logo.data, type: logo.type });
  const sheets = [];

  // ---- Summary ----
  const summary = newSheet('Summary', [34, 14, 14, 14, 34], false);
  header(summary, 'Site plan summary', 5, brand, name, date, logo);
  const s = summary.rows;
  s[4] = [{ v: 'Your plan', s: 'section' }];
  s[5] = [{ v: 'Plan', s: 'label' }, name || 'Untitled site plan'];
  s[6] = [{ v: 'Prepared', s: 'label' }, date];
  s[7] = [{ v: 'Scale', s: 'label' }, scaled ? 'Set on the plan' : 'Not set, so cable lengths are not worked out'];
  s[8] = [{ v: 'Devices', s: 'label' }, devices.length];
  if (itp && devices.length) s[9] = [{ v: 'Sign-off', s: 'label' }, 'An inspection and test plan (ITP) sheet for each system, to sign at handover'];
  s[10] = [{ v: 'By system', s: 'section' }];
  s[11] = head(['System', 'Devices', 'Cable runs', 'Cable (m)']);
  let row = 12;
  let allRuns = 0;
  let allMetres = 0;
  for (const system of SYSTEMS) {
    const count = devices.filter((d) => deviceType(d.type).group === system.group).length;
    if (!count) continue;
    const sched = schedules.find((x) => x.system === system.group);
    const runs = sched ? sched.rows.reduce((sum, r) => sum + r.runs, 0) : 0;
    const metres = sched ? sched.rows.reduce((sum, r) => sum + r.total, 0) : 0;
    allRuns += runs;
    allMetres += metres;
    s[row] = [{ v: system.label, s: 'cell' }, { v: count, s: 'cell' }, { v: runs, s: 'cell' }, { v: metres || (scaled ? 0 : '--'), s: 'cell' }];
    row += 1;
  }
  s[row] = [{ v: 'Total', s: 'total' }, { v: devices.length, s: 'total' }, { v: allRuns, s: 'total' }, { v: allMetres || (scaled ? 0 : '--'), s: 'total' }];
  row += 2;
  s[row] = [{ v: 'Cable to order', s: 'section' }];
  s[row + 1] = head(['Cable', 'Runs', 'Metres', 'Boxes', 'Where to buy']);
  row += 2;
  const order = CABLE_TYPES.map((c) => {
    const rows = schedules.flatMap((x) => x.rows).filter((r) => r.cable === c.id);
    const metres = rows.reduce((sum, r) => sum + r.total, 0);
    return { c, runs: rows.reduce((sum, r) => sum + r.runs, 0), metres };
  }).filter((o) => o.runs);
  for (const o of order) {
    s[row] = [
      { v: o.c.label, s: 'cell' },
      { v: o.runs, s: 'cell' },
      { v: o.metres || '--', s: 'cell' },
      { v: o.c.box && o.metres ? `${Math.ceil(o.metres / o.c.box)} x ${o.c.box} m` : '', s: 'cell' },
      { v: `Shop ${o.c.label} at ${brand.name}`, s: 'link' },
    ];
    summary.links.push({ ref: `E${row + 1}`, url: tagged(brand.storeSearchUrl, 'excel', { q: o.c.shop || o.c.label }) });
    row += 1;
  }
  if (!order.length) {
    s[row] = [{ v: 'No cabled devices on the plan yet.', s: 'muted' }];
    row += 1;
  }
  row += 1;
  s[row] = [{ v: `About ${brand.name}`, s: 'section' }];
  s[row + 1] = [{ v: brand.pitch, s: 'wrap' }];
  for (let c = 1; c < 5; c += 1) s[row + 1][c] = { v: '', s: 'wrap' };
  summary.merges.push(`A${row + 2}:E${row + 2}`);
  summary.heights[row + 2] = 34;
  callToAction(summary, 5, brand);
  sheets.push(summary);

  // ---- The plan picture ----
  if (picture) {
    images.push({ data: picture.data, type: picture.type });
    const sheet = { ...newSheet('Plan', [14, 14, 14, 14, 14, 14, 14, 14, 14, 14]), onePage: true };
    header(sheet, 'Site plan', 10, brand, name, date, logo);
    const width = 900;
    sheet.pictures.push({ image: images.length - 1, col: 0, row: 4, dx: 0, dy: 0, width, height: Math.round((width * picture.height) / picture.width), alt: name || 'Site plan' });
    // Rows under the picture, so the call to action lands below it.
    const rowsUnder = Math.ceil(((width * picture.height) / picture.width) / 20) + 6;
    for (let r = sheet.rows.length; r < rowsUnder; r += 1) sheet.rows[r] = [];
    callToAction(sheet, 10, brand);
    sheets.push(sheet);
  }

  // ---- Equipment schedule, with each device's cabling ----
  const equipment = newSheet('Equipment', [6, 28, 26, 18, 56, 28, 26]);
  header(equipment, 'Equipment schedule', 7, brand, name, date, logo);
  equipment.rows[4] = head(['No.', 'Device', 'Type', 'System', 'Coverage', 'Cable', 'Runs to']);
  equipment.freeze = 5;
  devices.forEach((d, i) => {
    const kind = deviceType(d.type);
    const system = SYSTEMS.find((x) => x.group === kind.group);
    const cable = cableFor(d);
    const end = cable ? headEndFor(d, devices) : null;
    equipment.rows[5 + i] = [
      { v: i + 1, s: 'cell' },
      { v: d.name, s: 'bold' },
      { v: kind.label, s: 'cell' },
      { v: system ? system.label : kind.group, s: 'cell' },
      { v: coverageText(d), s: 'wrap' },
      { v: cable ? cableType(cable).label : '', s: 'cell' },
      { v: cable ? (end ? end.name : 'Not placed yet') : '', s: 'cell' },
    ];
  });
  callToAction(equipment, 7, brand);
  sheets.push(equipment);

  // ---- One cable schedule per system ----
  for (const sched of schedules) {
    const sheet = newSheet(`Cables ${sched.label}`, [9, 28, 28, 30, 7, 10, 10, 40]);
    header(sheet, `${sched.label} cable schedule`, 8, brand, name, date, logo);
    sheet.rows[4] = head(['Cable', 'From', 'To', 'Cable type', 'Runs', 'Each (m)', 'Total (m)', 'Note']);
    sheet.freeze = 5;
    let r = 5;
    for (const c of sched.rows) {
      sheet.rows[r] = [
        { v: c.id, s: 'bold' },
        { v: c.from, s: 'cell' },
        { v: c.to || 'Not placed yet', s: 'cell' },
        { v: c.cableLabel, s: 'cell' },
        { v: c.runs, s: 'cell' },
        { v: c.each || '--', s: 'cell' },
        { v: c.total || '--', s: 'cell' },
        { v: c.note, s: 'wrap' },
      ];
      r += 1;
    }
    for (const t of sched.totals) {
      sheet.rows[r] = [
        { v: 'Total', s: 'total' }, { v: '', s: 'total' }, { v: '', s: 'total' }, { v: t.label, s: 'total' },
        { v: t.runs, s: 'total' }, { v: '', s: 'total' }, { v: t.metres || '--', s: 'total' },
        { v: t.boxes ? `${t.boxes} x ${t.box} m ${t.boxes === 1 ? 'box' : 'boxes'}` : '', s: 'total' },
      ];
      r += 1;
    }
    if (sched.note) sheet.rows[r + 1] = [{ v: sched.note, s: 'muted' }];
    callToAction(sheet, 8, brand);
    sheets.push(sheet);
  }

  // ---- One inspection and test plan per system, to sign off at handover ----
  if (itp) {
    for (const sys of inspectionPlans(plan, itp)) {
      const sheet = newSheet(`ITP ${sys.label}`, [7, 30, 58, 7, 9, 10, 16, 12, 26]);
      header(sheet, `${sys.label} inspection and test plan`, 9, brand, name, date, logo);
      const r0 = sheet.rows;
      r0[4] = [{ v: 'Site', s: 'label' }, { v: name, s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'default' }, { v: 'ITP no.', s: 'label' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }];
      r0[5] = [{ v: 'Client', s: 'label' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'default' }, { v: 'Revision', s: 'label' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }];
      r0[6] = [{ v: 'Installer', s: 'label' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'default' }, { v: 'Date', s: 'label' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }];
      sheet.merges.push('B5:C5', 'B6:C6', 'B7:C7', 'F5:G5', 'F6:G6', 'F7:G7');
      r0[7] = [{ v: `Points: ${ITP_POINTS.map((p) => `${p.id} ${p.label.toLowerCase()} (${p.text.replace(/\.$/, '').toLowerCase()})`).join(';  ')}. Result: ${ITP_RESULTS.join(', ')}.`, s: 'muted' }];
      sheet.merges.push('A8:I8');
      sheet.heights[8] = 30;
      r0[8] = head(['No.', 'Check', 'Acceptance criteria', 'Point', 'Result', 'Reading', 'Checked by', 'Date', 'Comments']);
      sheet.freeze = 9;
      let r = 9;
      const first = r + 1;
      for (const section of sys.sections) {
        r0[r] = [{ v: section.ref ? `${section.title}  ·  ${section.ref}` : section.title, s: 'total' }];
        for (let k = 1; k < 9; k += 1) r0[r][k] = { v: '', s: 'total' };
        sheet.merges.push(`A${r + 1}:I${r + 1}`);
        r += 1;
        for (const item of section.items) {
          r0[r] = [
            { v: item.no, s: 'cell' },
            { v: item.check, s: 'bold' },
            { v: item.criteria, s: 'wrap' },
            { v: item.point, s: 'centre' },
            { v: '', s: 'centre' },
            { v: item.reading ? `____ ${item.reading}` : '', s: 'cell' },
            { v: '', s: 'cell' },
            { v: '', s: 'cell' },
            { v: '', s: 'wrap' },
          ];
          r += 1;
        }
      }
      sheet.validations.push({ ref: `E${first}:E${r}`, list: ITP_RESULTS });
      r += 1;
      sheet.breaks.push(r); // the sign-off starts a page, so it is never split
      r0[r] = [{ v: 'Sign-off', s: 'section' }];
      r0[r + 1] = head(['', 'Role', 'Name', '', 'Signature', '', '', 'Date', 'Company']);
      sheet.merges.push(`C${r + 2}:D${r + 2}`, `E${r + 2}:G${r + 2}`);
      r += 2;
      for (const role of ['Installed by', 'Checked by (supervisor)', 'Accepted by (client)']) {
        r0[r] = [{ v: '', s: 'default' }, { v: role, s: 'bold' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }];
        sheet.merges.push(`C${r + 1}:D${r + 1}`, `E${r + 1}:G${r + 1}`);
        sheet.heights[r + 1] = 30;
        r += 1;
      }
      callToAction(sheet, 9, brand);
      sheets.push(sheet);
    }
  }

  return {
    title: name ? `${name} - site plan` : 'Site plan',
    author: brand.name,
    company: brand.name,
    images,
    sheets,
  };
}

/** The .xlsx bytes for a plan. */
export function sitePlanXlsx(plan, options) {
  return buildXlsx(sitePlanWorkbook(plan, options));
}
