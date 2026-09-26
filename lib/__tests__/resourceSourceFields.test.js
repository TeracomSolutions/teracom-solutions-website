import test from 'node:test';
import assert from 'node:assert/strict';

import { sourceFormDefaults, changedFields } from '../resourceSourceFields.js';

test('sourceFormDefaults returns correct default values', () => {
  const defaults = sourceFormDefaults();
  assert.deepStrictEqual(defaults, {
    name: '',
    url: '',
    supplier_id: '',
    doc_types: ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other'],
    recurrence: 'weekly',
    follow_links: true,
    max_pages: 60,
  });
});


test('changedFields returns empty object when objects are identical', () => {
  const initial = sourceFormDefaults();
  const values = sourceFormDefaults();
  assert.deepStrictEqual(changedFields(initial, values), {});
});

test('changedFields correctly identifies url change', () => {
  const initial = sourceFormDefaults();
  const values = { ...initial, url: 'https://example.com' };
  assert.deepStrictEqual(changedFields(initial, values), { url: 'https://example.com' });
});

test('changedFields correctly identifies supplier_id change from empty string to value', () => {
  const initial = sourceFormDefaults();
  const values = { ...initial, supplier_id: '123e4567-e89b-12d3-a456-426614174000' };
  assert.deepStrictEqual(changedFields(initial, values), { supplier_id: '123e4567-e89b-12d3-a456-426614174000' });
});


test('changedFields correctly identifies supplier_id change from value to empty string', () => {
  const initial = { ...sourceFormDefaults(), supplier_id: '123e4567-e89b-12d3-a456-426614174000' };
  const values = { ...initial, supplier_id: '' };
  assert.deepStrictEqual(changedFields(initial, values), { supplier_id: null });
});


test('changedFields correctly identifies supplier_id change from empty string to null', () => {
  const initial = sourceFormDefaults();
  const values = { ...initial, supplier_id: null };
  assert.deepStrictEqual(changedFields(initial, values), { supplier_id: null });
});


test('changedFields ignores doc_types reordering', () => {
  const initial = sourceFormDefaults();
  const values = { 
    ...initial, 
    doc_types: ['other', 'datasheet', 'user_manual', 'installer_manual', 'brochure'] 
  };
  assert.deepStrictEqual(changedFields(initial, values), {});
});

test('changedFields detects actual doc_types change', () => {
  const initial = sourceFormDefaults();
  const values = { ...initial, doc_types: ['datasheet', 'user_manual'] };
  assert.deepStrictEqual(changedFields(initial, values), { doc_types: ['datasheet', 'user_manual'] });
});


test('changedFields detects max_pages change', () => {
  const initial = sourceFormDefaults();
  const values = { ...initial, max_pages: 80 };
  assert.deepStrictEqual(changedFields(initial, values), { max_pages: 80 });
});


test('changedFields handles number comparison for max_pages', () => {
  const initial = { ...sourceFormDefaults(), max_pages: 60 };
  const values = { ...initial, max_pages: '80' };
  assert.deepStrictEqual(changedFields(initial, values), { max_pages: 80 });
});

