import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  TERMS_EFFECTIVE,
  TERMS_PDF,
  TERMS_VERSION,
  findTermsPart,
  termsAcceptanceRecord,
  termsParts,
  termsVersionHistory,
} from '../termsDocument.js';

const allSections = termsParts.flatMap((part) => part.sections);
const allBlocks = allSections.flatMap((section) => section.blocks);
const allText = allBlocks.map((block) => block.text).join('\n');

test('the document is complete: Part A, seven schedules and the annexure', () => {
  // v3.3 added Schedule 6 (trade credit account) and Schedule 7 (personal
  // guarantee). Both hang off the trade account application, so the form and
  // these schedules have to agree about what is collected and when.
  assert.deepEqual(
    termsParts.map((part) => part.id),
    [
      'part-a',
      'schedule-1',
      'schedule-2',
      'schedule-3',
      'schedule-4',
      'schedule-5',
      'schedule-6',
      'schedule-7',
      'annexure-a',
    ]
  );
  for (const part of termsParts) {
    assert.ok(part.title, `${part.id} has no title`);
    assert.ok(part.sections.length > 0, `${part.id} has no sections`);
  }
});

test('anchors are unique and permanent', () => {
  // These ids are published. Checkout, the monitoring application and every
  // stored acceptance record point at them, so renaming one silently breaks
  // a link in somebody's contract record. Adding is fine; changing is not.
  const ids = [...termsParts.map((p) => p.id), ...allSections.map((s) => s.id)];
  assert.equal(new Set(ids).size, ids.length, 'duplicate anchor id');
  for (const id of ids) {
    assert.match(id, /^[a-z0-9-]+$/, `${id} is not a safe fragment`);
  }
  for (const required of [
    'part-a',
    'schedule-1',
    'schedule-2',
    'schedule-3',
    'schedule-4',
    'schedule-5',
    'annexure-a',
    'consumer-guarantees',
    'clause-3-2',
    'clause-4-10',
  ]) {
    assert.ok(ids.includes(required), `anchor #${required} has gone missing`);
  }
});

test('the prescribed ACL warranty statement is reproduced word for word', () => {
  // Mandatory wording. It is a prescribed form, so it may not be paraphrased,
  // reworded to fit the page, or split into separate blocks. The
  // goods-and-services form is the right one here: Teracom supplies both.
  const section = allSections.find((s) => s.id === 'consumer-guarantees');
  assert.ok(section, 'the ACL statement section is missing');
  assert.equal(section.prescribed, true, 'the ACL statement must be marked prescribed');

  const text = section.blocks.map((b) => b.text).join(' ');
  assert.ok(
    text.startsWith(
      'Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law.'
    ),
    'the prescribed opening sentence has been altered'
  );
  for (const phrase of [
    'to cancel your service contract with us',
    'to a refund for the unused portion, or to compensation for its reduced value',
    'You are also entitled to choose a refund or replacement for major failures with goods',
    'entitled to have the failure rectified in a reasonable time',
    'compensated for any other reasonably foreseeable loss or damage',
  ]) {
    assert.ok(text.includes(phrase), `prescribed wording missing: "${phrase}"`);
  }
  // A claim has to be actionable: the statement names where to take it.
  assert.ok(text.includes('+61 3 9708 2685'));
  assert.ok(text.includes('sales@teracomsolutions.com.au'));
  assert.ok(text.includes('1B Yazaki Way, Carrum Downs VIC 3201'));
});

test('the version and effective date are consistent throughout', () => {
  // Not a literal: the version comes from the document, and asserting a
  // number here would only move the hardcoding into the test suite.
  assert.match(TERMS_VERSION, /^\d+\.\d+$/);
  assert.equal(TERMS_EFFECTIVE, '1 October 2026');
  assert.equal(TERMS_PDF, `/legal/Teracom-Terms-and-Conditions-v${TERMS_VERSION}.pdf`);
  // The document was drafted against 1 November before the date moved.
  assert.ok(!/1 November 2026/.test(allText), 'a superseded effective date survives in the text');
  assert.ok(allText.includes('on or after 1 October 2026'), 'the transition clause is missing');
  assert.ok(termsVersionHistory && /v\d+\.\d+/.test(termsVersionHistory));
});

test('the transition clauses that protect existing customers are present', () => {
  // Existing monitoring customers stay on their 2019 agreement until their
  // next renewal. Without these the site would be promising new terms to
  // people whose contract does not give them.
  const partA = findTermsPart('part-a');
  const clause16 = partA.sections.find((s) => s.number === '16');
  assert.ok(
    clause16.blocks.some((b) => b.number === '16.4' && b.text.includes('continues under the terms that applied')),
    'Part A clause 16.4 is missing'
  );
  const schedule3 = findTermsPart('schedule-3');
  const clause32 = schedule3.sections.find((s) => s.id === 'clause-3-2');
  assert.ok(
    clause32.blocks.some((b) => b.number === '(g)' && b.text.includes('on or after 1 October 2026')),
    'Schedule 3 clause 3.2(g) is missing'
  );
});

test('every block is a type the renderer knows how to draw', () => {
  // A legal document must not lose a clause because the renderer had no case
  // for it. Any new type shows up here rather than on the published page.
  const known = new Set(['para', 'clause', 'letter', 'bullet', 'definition']);
  for (const block of allBlocks) {
    assert.ok(known.has(block.type), `unknown block type "${block.type}"`);
    assert.ok(block.text && block.text.trim().length > 0, 'empty block');
  }
});

test('the acceptable use policy can stand on its own', () => {
  const schedule5 = findTermsPart('schedule-5');
  assert.ok(schedule5.sections[0].blocks.length >= 10);
  assert.equal(findTermsPart('nope'), null);
});

test('the acceptance record names everything a stored acceptance needs', () => {
  const fields = termsAcceptanceRecord.map((row) => row.field.toLowerCase());
  for (const required of ['document and version', 'accepted by', 'account', 'date and time', 'options selected']) {
    assert.ok(
      fields.some((field) => field.includes(required)),
      `the acceptance record has no "${required}" field`
    );
  }
});

test('the monitoring control room is never named', () => {
  for (const name of ['staysafe', 'stay safe', 'permaconn', 'securitas']) {
    assert.ok(!allText.toLowerCase().includes(name), `the terms name ${name}`);
  }
});
