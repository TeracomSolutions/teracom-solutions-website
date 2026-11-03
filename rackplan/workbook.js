// The rack layout as a branded Excel workbook: the rack schedule (every unit top
// down, free space included) and the rack picture, with the logo, website and a quote
// link on each sheet like the site plan workbook. Pure: pictures come in as bytes.
import { BRAND, tagged } from '../siteplan/brand.js';
import { buildXlsx, colName } from '../siteplan/xlsx.js';
import { itemType, rackRows, unitsText, usage } from './model.js';

const SOURCE = { utm_source: 'data-rack-layout' };
const LOGO_HEIGHT = 64;
const newSheet = (name, cols, landscape = false) => ({ name, cols, rows: [], heights: {}, merges: [], links: [], pictures: [], validations: [], breaks: [], landscape, freeze: 0 });
const head = (labels) => labels.map((v) => ({ v, s: 'head' }));

function header(sheet, title, columns, brand, rackName, date, logo) {
  const end = colName(columns - 1);
  sheet.rows[0] = [{ v: `Free design tools from ${brand.name}  ·  ${brand.websiteLabel}`, s: 'bandRight' }];
  sheet.rows[1] = [{ v: rackName ? `${title}  ·  ${rackName}` : title, s: 'strip' }];
  sheet.rows[2] = [{ v: `Prepared ${date} with the free Data Rack Layout from ${brand.name}. A planning layout; check equipment depths and heights on the datasheets.`, s: 'muted' }];
  for (let c = 1; c < columns; c += 1) {
    sheet.rows[0][c] = { v: '', s: 'band' };
    sheet.rows[1][c] = { v: '', s: 'strip' };
  }
  sheet.heights[1] = 58;
  sheet.heights[2] = 26;
  sheet.heights[3] = 28;
  sheet.merges.push(`A1:${end}1`, `A2:${end}2`, `A3:${end}3`);
  sheet.links.push({ ref: 'A1', url: tagged(brand.toolsUrl, 'excel', SOURCE) });
  if (logo) sheet.pictures.push({ image: 0, col: 0, row: 0, dx: 10, dy: 7, height: LOGO_HEIGHT, width: Math.round((LOGO_HEIGHT * logo.width) / logo.height), alt: brand.name });
  sheet.footer = `&L&"Calibri,Bold"${brand.name}&"Calibri,Regular"  ·  ${brand.websiteLabel}  ·  ${brand.email}&RPage &P of &N`;
}

function callToAction(sheet, columns, brand) {
  const end = colName(columns - 1);
  const r = sheet.rows.length + 1;
  sheet.rows[r] = [{ v: `Need this rack built? ${brand.name} can supply, install, patch and label it. Get a free quote: ${brand.websiteLabel}/contact or ${brand.email}`, s: 'cta' }];
  for (let c = 1; c < columns; c += 1) sheet.rows[r][c] = { v: '', s: 'cta' };
  sheet.heights[r + 1] = 36;
  sheet.merges.push(`A${r + 1}:${end}${r + 1}`);
  sheet.links.push({ ref: `A${r + 1}`, url: tagged(brand.quoteUrl, 'excel', SOURCE) });
  sheet.rows[r + 1] = [{ v: `Shop racks, patch panels and switches at ${brand.websiteLabel}/store  ·  ${brand.tagline}`, s: 'link' }];
  sheet.links.push({ ref: `A${r + 2}`, url: tagged(brand.storeSearchUrl, 'excel', { ...SOURCE, q: 'rack' }) });
}

/** The workbook for a rack: { title, author, company, images, sheets } for buildXlsx. */
export function rackWorkbook(rack, { brand = BRAND, date = '', logo = null, picture = null } = {}) {
  const name = String(rack?.name || '').trim();
  const images = [];
  if (logo) images.push({ data: logo.data, type: logo.type });
  const sheets = [];

  const sheet = newSheet('Rack schedule', [14, 7, 40, 28, 40]);
  header(sheet, 'Rack schedule', 5, brand, name, date, logo);
  const r0 = sheet.rows;
  const { used, free, size } = usage(rack);
  r0[4] = [{ v: 'Rack', s: 'label' }, { v: name || 'Untitled rack', s: 'cell' }, { v: '', s: 'cell' }];
  r0[5] = [{ v: 'Site', s: 'label' }, { v: rack.site || '', s: 'cell' }, { v: '', s: 'cell' }];
  r0[6] = [{ v: 'Size', s: 'label' }, { v: `${size}RU, ${rack.depth} mm deep`, s: 'cell' }, { v: '', s: 'cell' }];
  r0[7] = [{ v: 'Space', s: 'label' }, { v: `${used}RU used, ${free}RU free`, s: 'cell' }, { v: '', s: 'cell' }];
  sheet.merges.push('B5:C5', 'B6:C6', 'B7:C7', 'B8:C8');
  r0[9] = head(['Position', 'RU', 'Label', 'Equipment', 'Notes']);
  sheet.freeze = 10;
  let r = 10;
  for (const row of rackRows(rack)) {
    r0[r] = row.item
      ? [{ v: unitsText(row), s: 'bold' }, { v: row.ru, s: 'centre' }, { v: row.item.label, s: 'cell' }, { v: itemType(row.item.type).label, s: 'cell' }, { v: row.item.note || '', s: 'wrap' }]
      : [{ v: unitsText(row), s: 'muted' }, { v: row.ru, s: 'centre' }, { v: 'Free', s: 'muted' }, { v: '', s: 'cell' }, { v: '', s: 'cell' }];
    r += 1;
  }
  r0[r] = [{ v: 'Total', s: 'total' }, { v: used, s: 'total' }, { v: `${rack.items.length} item${rack.items.length === 1 ? '' : 's'}, ${free}RU free`, s: 'total' }, { v: '', s: 'total' }, { v: '', s: 'total' }];
  callToAction(sheet, 5, brand);
  sheets.push(sheet);

  if (picture) {
    images.push({ data: picture.data, type: picture.type });
    const pic = { ...newSheet('Rack picture', [14, 14, 14, 14, 14, 14, 14]), onePage: true };
    header(pic, 'Rack front view', 7, brand, name, date, logo);
    const height = 760;
    const width = Math.round((height * picture.width) / picture.height);
    pic.pictures.push({ image: images.length - 1, col: 0, row: 4, dx: 20, dy: 0, width, height, alt: name || 'Rack front view' });
    const rowsUnder = Math.ceil(height / 20) + 6;
    for (let i = pic.rows.length; i < rowsUnder; i += 1) pic.rows[i] = [];
    callToAction(pic, 7, brand);
    sheets.push(pic);
  }

  return { title: name ? `${name} - rack layout` : 'Rack layout', author: brand.name, company: brand.name, images, sheets };
}

export function rackXlsx(rack, options) {
  return buildXlsx(rackWorkbook(rack, options));
}
