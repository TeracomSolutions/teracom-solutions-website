import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ONLINE_FORMS, checkForm, findOnlineForm, summarise } from '../onlineForms/index.js';
import { applyFormEdits, cleanEdits, fieldAbilities, hasEdits, lockedFieldIds, newQuestionId } from '../onlineForms/edits.js';

const returns = () => findOnlineForm('return-request');

test('no edits leaves the form untouched', () => {
  for (const form of ONLINE_FORMS) {
    assert.equal(applyFormEdits(form, null), form);
    assert.equal(applyFormEdits(form, { reset: true, revision: 4 }), form);
  }
});

test('wording, required, hidden and choices are laid over the form', () => {
  const form = returns();
  const out = applyFormEdits(form, {
    revision: 2,
    title: 'Returns',
    sections: { you: { title: 'About you' } },
    fields: { dealer: { hidden: true }, invoices: { required: false, label: 'Invoice' }, outcome: { options: ['Repair', 'Refund'] } },
  });
  assert.equal(out.title, 'Returns');
  assert.equal(out.version, '1.2');
  assert.equal(out.sections[0].title, 'About you');
  assert.ok(!out.sections[0].fields.some((f) => f.id === 'dealer'));
  const invoices = out.sections[0].fields.find((f) => f.id === 'invoices');
  assert.equal(invoices.required, false);
  assert.equal(invoices.label, 'Invoice');
  assert.deepEqual(out.sections[1].fields.find((f) => f.id === 'outcome').options, ['Repair', 'Refund']);
  assert.equal(form.title, 'Returns (RMA) request');
  assert.ok(form.sections[0].fields.some((f) => f.id === 'dealer'));
});

test('needed fields cannot be hidden or made optional', () => {
  const form = returns();
  const locked = lockedFieldIds(form);
  assert.ok(locked.has('email') && locked.has('name'));
  const clean = cleanEdits(form, { fields: { email: { hidden: true, required: false, label: 'Your email' } } });
  assert.deepEqual(clean.fields.email, { label: 'Your email' });
  for (const f of ONLINE_FORMS) {
    for (const s of f.sections) {
      for (const field of s.fields) if (field.showIf) assert.equal(fieldAbilities(f, f.sections.flatMap((x) => x.fields).find((x) => x.id === field.showIf.field) || { id: field.showIf.field, type: 'text' }).hidden, false);
    }
  }
});

test('added questions are checked and summarised', () => {
  const form = returns();
  const id = newQuestionId(form, {}, 12345);
  const out = applyFormEdits(form, { revision: 1, added: [{ id, section: 'you', type: 'select', label: 'How did you hear of us?', required: true, options: ['Google', 'Friend'] }] });
  const q = out.sections[0].fields.at(-1);
  assert.equal(q.id, id);
  const problems = checkForm(out, {});
  assert.ok(problems.includes('Complete How did you hear of us?'));
  assert.ok(checkForm(out, { [id]: 'Nope' }).some((p) => p.startsWith('Choose one of the options')));
  const summary = summarise(out, { company: 'X', [id]: 'Google' });
  assert.ok(summary[0].rows.some((r) => r.label === 'How did you hear of us?' && r.value === 'Google'));
  assert.equal(cleanEdits(form, { added: [{ id: 'company', section: 'you', type: 'text', label: 'x' }] }).added, undefined);
  assert.equal(cleanEdits(form, { added: [{ id, section: 'nope', type: 'text', label: 'x' }] }).added, undefined);
});

test('clause changes carry a change number into the signed summary', () => {
  const form = returns();
  const out = applyFormEdits(form, { revision: 3, agreement_revision: 2, agreement: { clauses: [{ heading: 'Only', text: 'One clause.' }] } });
  assert.equal(out.agreement.document.version, '1, November 2026, change 2');
  const last = summarise(out, {}).at(-1);
  assert.ok(last.title.includes('change 2'));
  assert.deepEqual(last.rows, [{ label: 'Only', value: 'One clause.' }]);
  const untouched = applyFormEdits(form, { revision: 4, agreement_revision: 2, title: 'Returns' });
  assert.equal(untouched.agreement.document.version, form.agreement.document.version);
  assert.equal(hasEdits({ revision: 1 }), false);
});
