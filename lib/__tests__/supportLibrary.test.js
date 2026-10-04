import test from 'node:test';
import assert from 'node:assert/strict';

import { helpItems, serviceItems, supportLibraryItems, toolItems } from '../supportLibrary.js';
import { helpCenterTopics } from '../helpCenterTopics.js';
import { services } from '../services.js';
import { tools } from '../tools.js';

const ORIGIN = 'https://www.example.com';

test('every help topic, tool and service is in the library once', () => {
  const items = supportLibraryItems(ORIGIN);
  assert.equal(items.length, helpCenterTopics.length + tools.length + services.length);
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
});
