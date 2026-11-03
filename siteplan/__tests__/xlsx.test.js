import { test } from 'node:test';
import assert from 'node:assert/strict';

import { samplePlan } from '../model.js';
import { BRAND, tagged } from '../brand.js';
import { sitePlanWorkbook, sitePlanXlsx } from '../workbook.js';
import { buildXlsx, colName, crc32, sheetName, zip } from '../xlsx.js';

// The files in a stored zip, read back by walking its local headers.
function unzip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files = {};
  let at = 0;
  while (view.getUint32(at, true) === 0x04034b50) {
    const crc = view.getUint32(at + 14, true);
    const size = view.getUint32(at + 18, true);
    const nameLength = view.getUint16(at + 26, true);
    const name = new TextDecoder().decode(bytes.slice(at + 30, at + 30 + nameLength));
    const data = bytes.slice(at + 30 + nameLength, at + 30 + nameLength + size);
    assert.equal(crc32(data), crc, `${name} checksum`);
    files[name] = data;
    at += 30 + nameLength + size;
  }
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50, 'end of central directory');
  return files;
}
const text = (bytes) => new TextDecoder().decode(bytes);

test('crc32 and the zip round trip', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  const files = unzip(zip([{ name: 'a.txt', data: 'hello' }, { name: 'b/c.xml', data: new Uint8Array([1, 2, 3]) }]));
  assert.deepEqual(Object.keys(files), ['a.txt', 'b/c.xml']);
  assert.equal(text(files['a.txt']), 'hello');
});

test('column letters and sheet names Excel accepts', () => {
  assert.deepEqual([0, 25, 26, 27, 701, 702].map(colName), ['A', 'Z', 'AA', 'AB', 'ZZ', 'AAA']);
  const taken = new Set();
  assert.equal(sheetName('Cables: CCTV/IP [main]', taken), 'Cables  CCTV IP  main');
  assert.equal(sheetName('x'.repeat(40), taken).length, 31);
  assert.equal(sheetName('Summary', taken), 'Summary');
  assert.equal(sheetName('summary', taken), 'summary 2');
});

test('a workbook has its parts, escaped text, links and pictures', () => {
  const png = new Uint8Array([137, 80, 78, 71]);
  const files = unzip(buildXlsx({
    title: 'T',
    author: 'Teracom Solutions',
    images: [{ data: png, type: 'png' }],
    sheets: [{
      name: 'One',
      cols: [10, 20],
      rows: [[{ v: 'A & <b>', s: 'head' }, 5], [], ['x\u0001y']],
      merges: ['A1:B1'],
      links: [{ ref: 'A1', url: 'https://example.com/?a=1&b=2' }],
      pictures: [{ image: 0, width: 100, height: 40 }],
      footer: '&LTeracom&RPage &P',
    }],
  }));
  for (const part of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/styles.xml', 'xl/worksheets/sheet1.xml',
    'xl/worksheets/_rels/sheet1.xml.rels', 'xl/drawings/drawing1.xml', 'xl/drawings/_rels/drawing1.xml.rels', 'xl/media/image1.png', 'docProps/core.xml']) {
    assert.ok(files[part], part);
  }
  const sheet = text(files['xl/worksheets/sheet1.xml']);
  assert.ok(sheet.includes('<t xml:space="preserve">A &amp; &lt;b&gt;</t>'));
  assert.ok(sheet.includes('<c r="B1"><v>5</v></c>'));
  assert.ok(sheet.includes('>xy</t>'));
  assert.ok(sheet.includes('<mergeCell ref="A1:B1"/>'));
  assert.ok(sheet.indexOf('<hyperlinks>') < sheet.indexOf('<pageMargins') && sheet.indexOf('<headerFooter>') < sheet.indexOf('<drawing '));
  assert.ok(text(files['xl/worksheets/_rels/sheet1.xml.rels']).includes('Target="https://example.com/?a=1&amp;b=2" TargetMode="External"'));
  assert.ok(text(files['[Content_Types].xml']).includes('/xl/drawings/drawing1.xml'));
  assert.ok(text(files['docProps/core.xml']).includes('<dc:creator>Teracom Solutions</dc:creator>'));
});

test('the site plan workbook: a branded sheet for the summary, equipment and every system', () => {
  const plan = samplePlan();
  const logo = { data: new Uint8Array([1]), type: 'png', width: 480, height: 186 };
  const picture = { data: new Uint8Array([2]), type: 'jpeg', width: 1600, height: 1000 };
  const book = sitePlanWorkbook(plan, { date: '3 November 2026', logo, picture });
  assert.deepEqual(book.sheets.map((s) => s.name).slice(0, 3), ['Summary', 'Plan', 'Equipment']);
  assert.ok(book.sheets.some((s) => s.name === 'Cables CCTV') && book.sheets.some((s) => s.name === 'Cables Network'));
  for (const sheet of book.sheets) {
    assert.ok(sheet.pictures.some((p) => p.image === 0), `${sheet.name} has the logo`);
    assert.ok(sheet.rows.flat().some((c) => c && String(c.v).startsWith('Like this plan?')), `${sheet.name} has the quote line`);
    assert.ok(sheet.links.some((l) => l.url.startsWith(BRAND.quoteUrl) && l.url.includes('utm_medium=excel')), `${sheet.name} links to a quote`);
    assert.ok(sheet.footer.includes(BRAND.websiteLabel));
  }
  const equipment = book.sheets.find((s) => s.name === 'Equipment');
  assert.equal(equipment.rows.slice(5).filter((r) => r && typeof r[0]?.v === 'number').length, plan.devices.length);
  const summary = book.sheets[0];
  assert.ok(summary.links.some((l) => l.url.includes('/store/search') && l.url.includes('q=cat6+cable')));
  // Without pictures there is no Plan sheet and no logo, and it still builds.
  const plain = sitePlanWorkbook(plan, { date: 'today' });
  assert.equal(plain.sheets[1].name, 'Equipment');
  assert.ok(sitePlanXlsx(plan, { date: 'today' }).length > 1000);
});

test('links carry the campaign tags', () => {
  const url = new URL(tagged('https://www.teracomsolutions.com.au/contact', 'excel', { q: 'a b' }));
  assert.equal(url.searchParams.get('utm_source'), 'site-plan-designer');
  assert.equal(url.searchParams.get('utm_medium'), 'excel');
  assert.equal(url.searchParams.get('q'), 'a b');
  assert.equal(tagged('not a url', 'excel'), 'not a url');
});
