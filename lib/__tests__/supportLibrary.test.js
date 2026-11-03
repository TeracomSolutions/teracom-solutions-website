import test from 'node:test';
import assert from 'node:assert/strict';

import { brandItems, helpItems, serviceItems, supportLibraryItems, toolItems } from '../supportLibrary.js';
import { brands } from '../brands.js';
import { helpCenterTopics } from '../helpCenterTopics.js';
import { services } from '../services.js';
import { tools } from '../tools.js';

const ORIGIN = 'https://www.example.com';

test('every help topic, tool, service and brand is in the library once', () => {
  const items = supportLibraryItems(ORIGIN);
  assert.equal(items.length, helpCenterTopics.length + tools.length + services.length + brands.length);
  const keys = items.map((i) => `${i.type}:${i.key}`);
  assert.equal(new Set(keys).size, keys.length);
});

test('each item links back to its page and has text to search', () => {
  for (const item of supportLibraryItems(ORIGIN)) {
    assert.ok(item.url.startsWith(`${ORIGIN}/`), item.url);
    assert.ok(item.title.length > 0);
    assert.ok(item.content.length > 40, `${item.key} has too little text`);
  }
});

test('help topics include their FAQs, and tools how they work', () => {
  const xmeye = helpItems(ORIGIN).find((i) => i.key === 'xmeye');
  assert.equal(xmeye.url, `${ORIGIN}/resources/help-centre#xmeye`);
  const firstFaq = helpCenterTopics.find((t) => t.slug === 'xmeye').faqs[0];
  assert.ok(xmeye.content.includes(firstFaq.q));
  const storage = toolItems(ORIGIN).find((i) => i.key === 'cctv-storage-calculator');
  assert.ok(storage.content.includes('Storage per camera per day'));
  assert.ok(serviceItems(ORIGIN).every((i) => i.url.startsWith(`${ORIGIN}/services/`)));
  const kantech = brandItems(ORIGIN).find((i) => i.key === 'kantech');
  assert.equal(kantech.url, `${ORIGIN}/brands/kantech`);
  assert.ok(kantech.content.includes('Teracom Solutions works with Kantech'));
});

test('every tool carries a step-by-step guide, the site plan designer its own', async () => {
  const { toolItems } = await import('../supportLibrary.js');
  const items = toolItems('https://example.test');
  for (const item of items) assert.ok(item.content.includes(`How to use the ${item.title}, step by step: 1. `), item.key);
  const plan = items.find((i) => i.key === 'site-plan-designer');
  for (const words of ['Set scale', 'Move and turn', 'Cable schedules', 'Download Excel', 'Save plan file']) assert.ok(plan.content.includes(words), words);
  const lens = items.find((i) => i.key === 'cctv-lens-calculator');
  assert.ok(lens.content.includes('Add to project') && lens.content.includes('Open project'));
});
