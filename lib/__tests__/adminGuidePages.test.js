import test from 'node:test';
import assert from 'node:assert/strict';

import { ADMIN_PAGES } from '../adminPages.js';
import { GUIDE_SECTIONS } from '../adminGuide/index.js';
import { pagesMarkdown } from '../adminGuide/pages.js';

test('the guide has a chapter with every listed console page', () => {
  const chapter = GUIDE_SECTIONS.find((s) => s.id === 'pages');
  assert.ok(chapter, 'Every console page chapter');
  for (const page of ADMIN_PAGES.filter((p) => p.listed !== false)) {
    assert.ok(chapter.markdown.includes(page.path), `missing ${page.path}`);
    assert.ok(page.what && page.shows, `${page.path} needs what and shows in lib/adminPages.js`);
  }
});

test('every guide link in the register points to a real chapter', () => {
  const ids = new Set(GUIDE_SECTIONS.map((s) => s.id));
  for (const page of ADMIN_PAGES) {
    if (page.guide) assert.ok(ids.has(page.guide), `${page.path} points to unknown guide section ${page.guide}`);
  }
});

test('the chapter is written from the register', () => {
  const md = pagesMarkdown([{ path: '/admin/x', title: 'X', menu: 'M', what: 'W', shows: 'S', source: 'Z', access: 'Staff' }]);
  assert.ok(md.includes('### X') && md.includes('(/admin/x)') && md.includes('**Where it comes from:** Z'));
});

test("every guide chapter fits what the console assistant accepts", () => {
  // The backend takes at most 40 sections of 40,000 characters each (api/staff_assistant.py GuideSection).
  assert.ok(GUIDE_SECTIONS.length <= 40, "too many guide sections for the assistant");
  for (const s of GUIDE_SECTIONS) assert.ok(s.markdown.length <= 40000, s.id + " is longer than 40,000 characters; split it");
});
