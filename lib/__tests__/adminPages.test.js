import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { ADMIN_PAGES, pageFor, pagesByMenu } from '../adminPages.js';

function pageFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(full);
    return entry.name === 'page.js' ? [full] : [];
  });
}

// A new console page must be added to lib/adminPages.js, or this test (and so the build) fails.
test('every console page is in the page list, and every entry is a real page', () => {
  const routes = pageFiles('app/admin').map((file) => '/' + path.dirname(file).split(path.sep).join('/').replace(/^app[/]/, ''));
  const listed = ADMIN_PAGES.map((page) => page.path);
  for (const route of routes) assert.ok(listed.includes(route), `${route} is missing from lib/adminPages.js`);
  for (const entry of listed) assert.ok(routes.includes(entry), `${entry} in lib/adminPages.js has no page`);
});

test('every entry says what it is, how to get there, what it shows and where it comes from', () => {
  const guides = fs.readFileSync('lib/adminGuide/index.js', 'utf8');
  for (const page of ADMIN_PAGES) {
    for (const field of ['title', 'what', 'shows', 'source', 'access']) assert.ok(String(page[field] || '').trim(), `${page.path} has no ${field}`);
    if (page.listed !== false) assert.ok(page.menu, `${page.path} has no menu path`);
    if (page.guide) assert.ok(guides.includes(`id: '${page.guide}'`), `${page.path} points at a missing help section ${page.guide}`);
  }
});

test('an address finds its entry, including pages for one order or run', () => {
  assert.equal(pageFor('/admin').title, 'Overview');
  assert.equal(pageFor('/admin/orders/123?x=1').title, 'Order');
  assert.equal(pageFor('/admin/scout/review/9/').title, 'Scout research run');
  assert.equal(pageFor('/somewhere'), null);
  assert.ok(pagesByMenu().every((group) => group.pages.every((page) => page.listed !== false)));
});
