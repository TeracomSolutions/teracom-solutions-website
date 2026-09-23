import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  charges,
  findRequestForm,
  formatSubmission,
  requestForms,
  valueFields,
} from '../requestForms.js';

test('every form is complete enough to render and to submit', () => {
  assert.ok(requestForms.length >= 2);
  for (const form of requestForms) {
    assert.match(form.slug, /^[a-z0-9-]+$/);
    assert.ok(form.title && form.lead && form.seoTitle);
    assert.ok(form.description.length >= 70 && form.description.length <= 160, form.slug);
    assert.ok(form.intro.length >= 1);
    assert.ok(form.inquiryType, `${form.slug} has no inquiry type`);
    assert.equal(findRequestForm(form.slug), form);
  }
  assert.equal(findRequestForm('nope'), null);
});

test('field ids are unique within a form and every field is usable', () => {
  const known = new Set(['text', 'email', 'tel', 'textarea', 'select', 'radio', 'datetime-local', 'heading']);
  for (const form of requestForms) {
    const ids = form.fields.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, `${form.slug} repeats a field id`);
    for (const field of form.fields) {
      assert.ok(known.has(field.type), `${form.slug}.${field.id} has unknown type "${field.type}"`);
      assert.ok(field.label, `${form.slug}.${field.id} has no label`);
      if (field.type === 'select' || field.type === 'radio') {
        assert.ok(field.options?.length >= 2, `${form.slug}.${field.id} needs options`);
      }
    }
  }
});

test('name and email are always collected, because a request has to be answerable', () => {
  for (const form of requestForms) {
    const required = valueFields(form).filter((f) => f.required).map((f) => f.id);
    for (const id of ['name', 'email', 'phone']) {
      assert.ok(required.includes(id), `${form.slug} does not require ${id}`);
    }
  }
});

test('declarations are separate, required and never pre-ticked', () => {
  for (const form of requestForms) {
    assert.ok(form.declarations.length >= 3, form.slug);
    const ids = form.declarations.map((d) => d.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const declaration of form.declarations) {
      assert.ok(declaration.text.length > 30);
      assert.equal(declaration.required, true);
      // A default value would be a pre-ticked box, which is not acceptance.
      assert.equal(declaration.checked, undefined);
    }
    assert.ok(
      form.declarations.some((d) => d.termsLink),
      `${form.slug} never links the terms it asks people to accept`
    );
  }
});

test('the password reset asks who owns the equipment', () => {
  // Resetting a recorder password for whoever asks is how stolen gear gets
  // unlocked. The declaration is the whole point of the form.
  const form = findRequestForm('password-reset');
  assert.ok(form.declarations.some((d) => /own this equipment|authorised by the owner/i.test(d.text)));
  const required = valueFields(form).filter((f) => f.required).map((f) => f.id);
  assert.ok(required.includes('model'), 'the model is what the manufacturer asks for');
});

test('no stale prices are published', () => {
  // The Zoho forms quote 2021 rates. A wrong price on a public page is a
  // misleading pricing claim, so figures only appear once `charges` is
  // filled in with current ones.
  const text = JSON.stringify({ requestForms, charges });
  assert.ok(!/\$\d/.test(text), 'a dollar figure has crept into the form copy');
  for (const form of requestForms) {
    assert.ok(
      form.declarations.some((d) => /charges apply/i.test(d.text)),
      `${form.slug} does not tell the customer charges apply`
    );
  }
});

test('the submission reads as something a person can act on', () => {
  const form = findRequestForm('service-request');
  const message = formatSubmission(form, {
    name: 'Jo Tradie',
    phone: '0400 000 000',
    email: 'jo@example.com',
    street: '1 Example St',
    suburb: 'Carrum Downs',
    state: 'VIC',
    postcode: '3201',
    serviceRequired: 'Service call',
    work: 'Camera 4 offline since the storm.',
    accurate: true,
    terms: true,
  });
  assert.match(message, /SERVICE REQUEST/);
  assert.match(message, /Your name: Jo Tradie/);
  assert.match(message, /Work required: Camera 4 offline since the storm\./);
  assert.match(message, /Declarations accepted:/);
  // Empty fields are left out rather than padding the message with blanks.
  assert.ok(!message.includes('Company:'));
  // A heading with nothing under it still orients the reader.
  assert.match(message, /Site address:/);
});
