import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_SECTIONS,
  PROJECT_FORMAT,
  addSection,
  cleanProject,
  emptyProject,
  fileNameFor,
  moveSection,
  parseProject,
  pdfSafe,
  removeSection,
  sectionTitle,
  serializeProject,
  updateDetails,
  updateSection,
  wrapText,
} from '../toolProject.js';

const NOW = '2026-11-02T00:00:00.000Z';
const storage = { slug: 'cctv-storage-calculator', label: '', state: { cameras: 8 }, inputs: [{ label: 'Number of cameras', value: '8' }], results: [{ label: 'Total storage needed', value: '9.27 TB' }] };

test('results are added, renamed, updated, moved and removed', () => {
  let project = emptyProject(NOW);
  const first = addSection(project, storage, NOW);
  project = first.project;
  const second = addSection(project, { slug: 'voltage-drop-calculator', state: { supplyVolts: '12' }, results: [{ warn: 'Over your 10% limit' }] }, NOW);
  project = second.project;
  assert.equal(project.sections.length, 2);
  assert.notEqual(first.id, second.id);
  assert.equal(sectionTitle(project.sections[0]), 'CCTV Storage Calculator');

  project = updateSection(project, first.id, { label: 'Warehouse cameras', notes: 'Allow for 12 later' }, NOW);
  assert.equal(sectionTitle(project.sections[0]), 'Warehouse cameras');
  assert.deepEqual(project.sections[0].state, { cameras: 8 }, 'renaming keeps the inputs');

  project = updateSection(project, first.id, { state: { cameras: 12 }, results: [{ label: 'Total storage needed', value: '13.9 TB' }] }, '2026-11-03T00:00:00.000Z');
  assert.equal(project.sections[0].state.cameras, 12);
  assert.equal(project.sections[0].savedAt, '2026-11-03T00:00:00.000Z');
  assert.equal(project.sections[0].id, first.id);
  assert.equal(project.sections[0].slug, 'cctv-storage-calculator');

  project = moveSection(project, second.id, -1, NOW);
  assert.deepEqual(project.sections.map((s) => s.id), [second.id, first.id]);
  assert.equal(moveSection(project, second.id, -1, NOW), project, 'the first cannot move up');

  project = removeSection(project, second.id, NOW);
  assert.deepEqual(project.sections.map((s) => s.id), [first.id]);
});

test('unknown calculators and full projects are refused', () => {
  assert.throws(() => addSection(emptyProject(NOW), { slug: 'not-a-tool' }), /cannot be added/);
  let project = emptyProject(NOW);
  for (let i = 0; i < MAX_SECTIONS; i += 1) project = addSection(project, storage, NOW).project;
  assert.throws(() => addSection(project, storage), /up to/);
});

test('a saved project survives a round trip and anything odd in a file is dropped', () => {
  let project = updateDetails(emptyProject(NOW), { name: 'Smith St', client: 'ACME', notes: 'Line one\nLine two' }, NOW);
  project = addSection(project, storage, NOW).project;
  const back = parseProject(serializeProject(project));
  assert.deepEqual(back, project);

  const messy = cleanProject({
    format: PROJECT_FORMAT,
    name: 'x'.repeat(500),
    sections: [
      { slug: 'nope', state: {} },
      { slug: 'cctv-storage-calculator', id: '../../etc', state: [1, 2], inputs: 'bad', results: [null, { label: 'A', value: 'B' }, { warn: 'W' }] },
      { slug: 'cctv-storage-calculator', id: 'abcd1234' },
      { slug: 'cctv-storage-calculator', id: 'abcd1234' },
    ],
  });
  assert.equal(messy.name.length, 200);
  assert.equal(messy.sections.length, 3);
  assert.match(messy.sections[0].id, /^[a-z0-9]{8}$/);
  assert.deepEqual(messy.sections[0].state, {});
  assert.deepEqual(messy.sections[0].inputs, []);
  assert.deepEqual(messy.sections[0].results, [{ label: 'A', value: 'B' }, { warn: 'W' }]);
  assert.equal(messy.sections[1].id, 'abcd1234');
  assert.notEqual(messy.sections[2].id, 'abcd1234', 'a repeated id gets a new one');

  assert.equal(parseProject('not json'), null);
  assert.equal(parseProject('{"format":"something-else"}'), null);
});

test('text for the PDF keeps what the fonts can draw and spells out the rest', () => {
  assert.equal(pdfSafe('Loop resistance: 1.25 Ω'), 'Loop resistance: 1.25 ohm');
  assert.equal(pdfSafe('2.5 mm² at 20°C — ok'), '2.5 mm² at 20°C — ok');
  assert.equal(pdfSafe('a\tb≈c😀'), 'a b~c?');
  assert.equal(pdfSafe('one\ntwo'), 'one\ntwo');
});

test('long text wraps to the width, and very long words are split', () => {
  const widthOf = (t) => t.length;
  assert.deepEqual(wrapText('the quick brown fox', 10, widthOf), ['the quick', 'brown fox']);
  assert.deepEqual(wrapText('abcdefghijkl', 5, widthOf), ['abcde', 'fghij', 'kl']);
  assert.deepEqual(wrapText('one\n\ntwo', 10, widthOf), ['one', '', 'two']);
});

test('file names come from the project name', () => {
  assert.equal(fileNameFor({ name: 'Smith St / Stage 2' }, 'pdf'), 'Smith-St-Stage-2.pdf');
  assert.equal(fileNameFor({ name: '' }, 'json'), 'Teracom-tools-project.json');
});
