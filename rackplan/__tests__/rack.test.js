import { test } from 'node:test';
import assert from 'node:assert/strict';

import { RACK_FORMAT, addItem, cleanRack, emptyRack, firstFree, fits, gaps, moveItem, parseRack, rackRows, resizeItem, resizeRack, sampleRack, unitsText, usage } from '../model.js';
import { rackWorkbook, rackXlsx } from '../workbook.js';
import { BRAND } from '../../siteplan/brand.js';

test('items stack from the top and never overlap', () => {
  let rack = emptyRack(12);
  rack = addItem(rack, 'patch24', 'a');
  rack = addItem(rack, 'nvr', 'b');
  assert.deepEqual(rack.items.map((it) => [it.u, it.ru]), [[12, 1], [10, 2]]);
  assert.equal(fits(rack, 11, 1), false);
  assert.equal(fits(rack, 9, 1), true);
  assert.equal(firstFree(rack, 3), 7);
  assert.equal(moveItem(rack, 'a', 11), null, 'cannot move onto the recorder');
  assert.equal(moveItem(rack, 'a', 1).items[0].u, 1);
  assert.equal(resizeItem(rack, 'a', 3), null, 'a taller panel would hit the recorder');
  assert.deepEqual(usage(rack), { used: 3, free: 9, size: 12 });
});

test('free space, the rows top down and the rack size', () => {
  const rack = sampleRack();
  const free = gaps(rack);
  assert.ok(free.length > 0);
  assert.equal(usage(rack).used + free.reduce((s, g) => s + g.ru, 0), rack.size);
  const rows = rackRows(rack);
  assert.equal(rows[0].top, 24);
  assert.equal(rows.reduce((s, r) => s + r.ru, 0), 24);
  assert.equal(unitsText({ top: 12, bottom: 11, ru: 2 }), 'U12-U11');
  assert.equal(resizeRack(rack, 12), null, 'items above U12');
  assert.equal(resizeRack(rack, 42).size, 42);
  assert.equal(resizeRack(rack, 13), null, 'not a rack size');
  // A full rack refuses more.
  let full = emptyRack(6);
  for (let i = 0; i < 6; i += 1) full = addItem(full, 'blank', `b${i}`);
  assert.equal(addItem(full, 'blank', 'x'), null);
});

test('saved racks are cleaned: overlaps, bad sizes and other files are dropped', () => {
  assert.equal(parseRack('{"format":"teracom-site-plan"}'), null);
  assert.equal(parseRack('not json'), null);
  const rack = cleanRack({ format: RACK_FORMAT, size: 99, depth: 7, name: 'R\u0001', items: [
    { id: 'a', type: 'nope', u: 1, ru: 2, label: 'x' },
    { id: 'b', type: 'ups', u: 2, ru: 1 },
    { id: 'a', type: 'ups', u: 10, ru: 1 },
    { id: 'c', type: 'ups', u: 24, ru: 2 },
  ] });
  assert.equal(rack.size, 24);
  assert.equal(rack.depth, 600);
  assert.equal(rack.name, 'R ');
  assert.deepEqual(rack.items.map((it) => it.id), ['a']);
  assert.equal(rack.items[0].type, 'other');
});

test('the workbook: a branded rack schedule with every unit, and the picture', () => {
  const rack = sampleRack();
  const logo = { data: new Uint8Array([1]), type: 'png', width: 480, height: 186 };
  const picture = { data: new Uint8Array([2]), type: 'png', width: 1200, height: 1800 };
  const book = rackWorkbook(rack, { date: '3 November 2026', logo, picture });
  assert.deepEqual(book.sheets.map((s) => s.name), ['Rack schedule', 'Rack picture']);
  const schedule = book.sheets[0];
  const cells = schedule.rows.flat().map((c) => (c && typeof c === 'object' ? c.v : c));
  assert.ok(cells.includes('Recorder, 32 channel'));
  assert.ok(cells.includes('Free'));
  for (const sheet of book.sheets) {
    assert.ok(sheet.pictures.some((p) => p.image === 0), 'logo');
    assert.ok(sheet.links.some((l) => l.url.startsWith(BRAND.quoteUrl) && l.url.includes('utm_source=data-rack-layout')));
  }
  assert.ok(rackXlsx(rack, { date: 'today' }).length > 1000);
});
