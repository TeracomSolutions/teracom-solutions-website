import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE_SECTIONS } from '../adminGuide/index.js';

// Test 1: there are at least 20 sections; every section has an id matching /^[a-z0-9-]+$/, a non-empty title and markdown longer than 100 characters; no two sections share an id.
test('guide sections meet requirements', () => {
  assert.ok(GUIDE_SECTIONS.length >= 20, 'There are at least 20 sections');

  const ids = [];
  for (const section of GUIDE_SECTIONS) {
    assert.ok(/^[a-z0-9-]+$/.test(section.id), `Section id '${section.id}' matches /^[a-z0-9-]+$/`);
    assert.ok(section.title, 'Section has a non-empty title');
    assert.ok(section.markdown.length > 100, `Section markdown longer than 100 characters for id '${section.id}'`);
    assert.ok(!ids.includes(section.id), `No two sections share an id: '${section.id}' is duplicated`);
    ids.push(section.id);
  }
});

// Test 2: the sections include ids 'getting-started', 'assistant', 'about' and 'build-progress'.
test('guide sections include required ids', () => {
  const sectionIds = GUIDE_SECTIONS.map(s => s.id);
  assert.ok(sectionIds.includes('getting-started'), "Section 'getting-started' is present");
  assert.ok(sectionIds.includes('assistant'), "Section 'assistant' is present");
  assert.ok(sectionIds.includes('about'), "Section 'about' is present");
  assert.ok(sectionIds.includes('build-progress'), "Section 'build-progress' is present");
});