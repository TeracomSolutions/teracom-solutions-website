// A small Excel (.xlsx) writer for the site plan's schedules (Robert, 2026-11-03):
// sheets of text and numbers, a fixed set of branded styles, merged cells, links,
// pictures (the logo and the plan) and print settings. No libraries: an .xlsx is a
// zip of XML files, written here uncompressed. Pure, so it runs in the browser, in
// Node for the tests, and in any other app that takes this folder.

// ---- zip (stored, no compression) ----

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const encoder = new TextEncoder();
const toBytes = (data) => (typeof data === 'string' ? encoder.encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data));

/** A zip of [{ name, data }] with every file stored as is. */
export function zip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  // 1 January 2026, 00:00, in DOS form: the files carry a fixed date.
  const dosTime = 0;
  const dosDate = ((2026 - 1980) << 9) | (1 << 5) | 1;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = toBytes(file.data);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), name, data);
    const entry = new DataView(new ArrayBuffer(46));
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true);
    entry.setUint16(6, 20, true);
    entry.setUint16(8, 0x0800, true);
    entry.setUint16(10, 0, true);
    entry.setUint16(12, dosTime, true);
    entry.setUint16(14, dosDate, true);
    entry.setUint32(16, crc, true);
    entry.setUint32(20, data.length, true);
    entry.setUint32(24, data.length, true);
    entry.setUint16(28, name.length, true);
    entry.setUint32(42, offset, true);
    central.push(new Uint8Array(entry.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const centralSize = central.reduce((sum, p) => sum + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((sum, p) => sum + p.length, 0));
  let at = 0;
  for (const p of all) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

// ---- the workbook ----

export const COLOURS = { black: 'FF0B0B0B', red: 'FFE3161B', dark: 'FF1F2937', light: 'FFF3F4F6', muted: 'FF6B7280', link: 'FF0563C1' };

// Named styles, in the order of cellXfs in styles.xml.
export const STYLES = ['default', 'band', 'bandTitle', 'bandRight', 'strip', 'head', 'muted', 'link', 'section', 'total', 'cta', 'bold', 'wrap', 'label', 'cell', 'centre'];
const styleIndex = (name) => Math.max(0, STYLES.indexOf(name || 'default'));

const xml = (text) => String(text ?? '')
  // Characters XML 1.0 does not allow at all.
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** Column letters for a 0-based index: 0 is A, 26 is AA. */
export function colName(index) {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** A sheet name Excel accepts: no []:*?/\, at most 31 characters, not empty. */
export function sheetName(name, taken = new Set()) {
  const base = String(name || 'Sheet').replace(/[[\]:*?/\\]/g, ' ').trim().slice(0, 31) || 'Sheet';
  let candidate = base;
  for (let i = 2; taken.has(candidate.toLowerCase()); i += 1) candidate = `${base.slice(0, 28)} ${i}`;
  taken.add(candidate.toLowerCase());
  return candidate;
}

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="9">
<font><sz val="11"/><color rgb="FF111827"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF111827"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><i/><sz val="10"/><color rgb="${COLOURS.muted}"/><name val="Calibri"/><family val="2"/></font>
<font><u/><sz val="11"/><color rgb="${COLOURS.link}"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="13"/><color rgb="${COLOURS.red}"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="6">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="${COLOURS.black}"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="${COLOURS.red}"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="${COLOURS.dark}"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="${COLOURS.light}"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="3">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left/><right/><top/><bottom style="thin"><color rgb="FFD1D5DB"/></bottom><diagonal/></border>
<border><left/><right/><top style="thin"><color rgb="FF111827"/></top><bottom/><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${STYLES.length}">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="8" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="4" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="6" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="7" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="1" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="8" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const EMU = 9525; // per pixel

function cellXml(ref, cell) {
  if (cell === null || cell === undefined || cell === '') return '';
  const value = typeof cell === 'object' ? cell.v : cell;
  const s = styleIndex(typeof cell === 'object' ? cell.s : undefined);
  const style = s ? ` s="${s}"` : '';
  if (value === null || value === undefined || value === '') return s ? `<c r="${ref}"${style}/>` : '';
  if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${ref}"${style}><v>${value}</v></c>`;
  return `<c r="${ref}"${style} t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
}

function sheetXml(sheet, hasDrawing, linkIds) {
  const rows = sheet.rows || [];
  const heights = sheet.heights || {};
  const out = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet ${NS}>`];
  out.push('<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>');
  const pane = sheet.freeze ? `<pane ySplit="${sheet.freeze}" topLeftCell="A${sheet.freeze + 1}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft"/>` : '';
  out.push(`<sheetViews><sheetView workbookViewId="0" showGridLines="0">${pane}</sheetView></sheetViews>`);
  out.push('<sheetFormatPr defaultRowHeight="15"/>');
  if (sheet.cols?.length) {
    out.push(`<cols>${sheet.cols.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`);
  }
  out.push('<sheetData>');
  const last = Math.max(rows.length, ...Object.keys(heights).map(Number));
  for (let r = 0; r < last; r += 1) {
    const cells = (rows[r] || []).map((cell, c) => cellXml(`${colName(c)}${r + 1}`, cell)).join('');
    const ht = heights[r + 1] ? ` ht="${heights[r + 1]}" customHeight="1"` : '';
    if (cells || ht) out.push(`<row r="${r + 1}"${ht}>${cells}</row>`);
  }
  out.push('</sheetData>');
  if (sheet.merges?.length) out.push(`<mergeCells count="${sheet.merges.length}">${sheet.merges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>`);
  if (sheet.validations?.length) {
    const lists = sheet.validations.map((v) => `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${v.ref}"><formula1>"${xml(v.list.join(','))}"</formula1></dataValidation>`);
    out.push(`<dataValidations count="${lists.length}">${lists.join('')}</dataValidations>`);
  }
  if (linkIds.length) out.push(`<hyperlinks>${linkIds.map(({ ref, id }) => `<hyperlink ref="${ref}" r:id="${id}"/>`).join('')}</hyperlinks>`);
  out.push('<printOptions horizontalCentered="1"/>');
  out.push('<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.6" header="0.3" footer="0.3"/>');
  out.push(`<pageSetup paperSize="9" orientation="${sheet.landscape ? 'landscape' : 'portrait'}" fitToWidth="1" fitToHeight="${sheet.onePage ? 1 : 0}"/>`);
  if (sheet.footer) out.push(`<headerFooter><oddFooter>${xml(sheet.footer)}</oddFooter></headerFooter>`);
  // Page breaks above the given 0-based rows.
  if (sheet.breaks?.length) out.push(`<rowBreaks count="${sheet.breaks.length}" manualBreakCount="${sheet.breaks.length}">${sheet.breaks.map((r) => `<brk id="${r}" max="16383" man="1"/>`).join('')}</rowBreaks>`);
  if (hasDrawing) out.push('<drawing r:id="rIdDrawing"/>');
  out.push('</worksheet>');
  return out.join('');
}

function drawingXml(pictures) {
  const anchors = pictures.map((p, i) => `<xdr:oneCellAnchor><xdr:from><xdr:col>${p.col || 0}</xdr:col><xdr:colOff>${Math.round((p.dx || 0) * EMU)}</xdr:colOff><xdr:row>${p.row || 0}</xdr:row><xdr:rowOff>${Math.round((p.dy || 0) * EMU)}</xdr:rowOff></xdr:from><xdr:ext cx="${Math.round(p.width * EMU)}" cy="${Math.round(p.height * EMU)}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${i + 2}" name="Picture ${i + 1}" descr="${xml(p.alt || '')}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rIdImage${i + 1}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${Math.round(p.width * EMU)}" cy="${Math.round(p.height * EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${REL}">${anchors}</xdr:wsDr>`;
}

const rels = (items) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.map((r) => `<Relationship Id="${r.id}" Type="${r.type}" Target="${xml(r.target)}"${r.external ? ' TargetMode="External"' : ''}/>`).join('')}</Relationships>`;

/**
 * The .xlsx bytes for a workbook:
 * { title, author, company, images: [{ data: Uint8Array, type: 'png' | 'jpeg' }],
 *   sheets: [{ name, cols: [widths], rows: [[cell]], heights: { rowNumber: points }, merges: ['A1:F1'],
 *              links: [{ ref, url }], pictures: [{ image, col, row, dx, dy, width, height, alt }],
 *              validations: [{ ref: 'E10:E40', list: ['Pass', 'Fail'] }], breaks: [rows], freeze, landscape, onePage, footer }] }
 * A cell is a string, a number, or { v, s } with s one of STYLES.
 */
export function buildXlsx(book) {
  const taken = new Set();
  const sheets = (book.sheets || []).map((s) => ({ ...s, name: sheetName(s.name, taken) }));
  const images = book.images || [];
  const files = [];
  const types = [
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Default Extension="png" ContentType="image/png"/>',
    '<Default Extension="jpeg" ContentType="image/jpeg"/>',
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
  ];
  let drawings = 0;
  sheets.forEach((sheet, i) => {
    const n = i + 1;
    types.push(`<Override PartName="/xl/worksheets/sheet${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
    const sheetRels = [];
    const linkIds = (sheet.links || []).map((link, k) => {
      const id = `rIdLink${k + 1}`;
      sheetRels.push({ id, type: `${REL}/hyperlink`, target: link.url, external: true });
      return { ref: link.ref, id };
    });
    const pictures = (sheet.pictures || []).filter((p) => images[p.image]);
    if (pictures.length) {
      drawings += 1;
      sheetRels.push({ id: 'rIdDrawing', type: `${REL}/drawing`, target: `../drawings/drawing${drawings}.xml` });
      types.push(`<Override PartName="/xl/drawings/drawing${drawings}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);
      files.push({ name: `xl/drawings/drawing${drawings}.xml`, data: drawingXml(pictures) });
      files.push({
        name: `xl/drawings/_rels/drawing${drawings}.xml.rels`,
        data: rels(pictures.map((p, k) => ({ id: `rIdImage${k + 1}`, type: `${REL}/image`, target: `../media/image${p.image + 1}.${images[p.image].type === 'jpeg' ? 'jpeg' : 'png'}` }))),
      });
    }
    files.push({ name: `xl/worksheets/sheet${n}.xml`, data: sheetXml(sheet, pictures.length > 0, linkIds) });
    if (sheetRels.length) files.push({ name: `xl/worksheets/_rels/sheet${n}.xml.rels`, data: rels(sheetRels) });
  });
  images.forEach((image, i) => files.push({ name: `xl/media/image${i + 1}.${image.type === 'jpeg' ? 'jpeg' : 'png'}`, data: image.data }));

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook ${NS}><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheets.map((s, i) => `<sheet name="${xml(s.name)}" sheetId="${i + 1}" r:id="rIdSheet${i + 1}"/>`).join('')}</sheets></workbook>`;
  const workbookRels = rels([
    ...sheets.map((s, i) => ({ id: `rIdSheet${i + 1}`, type: `${REL}/worksheet`, target: `worksheets/sheet${i + 1}.xml` })),
    { id: 'rIdStyles', type: `${REL}/styles`, target: 'styles.xml' },
  ]);
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(book.title || '')}</dc:title><dc:creator>${xml(book.author || '')}</dc:creator></cp:coreProperties>`;
  const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>${xml(book.author || 'Microsoft Excel')}</Application><Company>${xml(book.company || '')}</Company></Properties>`;

  return zip([
    { name: '[Content_Types].xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${types.join('')}</Types>` },
    { name: '_rels/.rels', data: rels([
      { id: 'rId1', type: `${REL}/officeDocument`, target: 'xl/workbook.xml' },
      { id: 'rId2', type: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', target: 'docProps/core.xml' },
      { id: 'rId3', type: `${REL}/extended-properties`, target: 'docProps/app.xml' },
    ]) },
    { name: 'docProps/core.xml', data: core },
    { name: 'docProps/app.xml', data: app },
    { name: 'xl/workbook.xml', data: workbook },
    { name: 'xl/_rels/workbook.xml.rels', data: workbookRels },
    { name: 'xl/styles.xml', data: STYLES_XML },
    ...files,
  ]);
}
