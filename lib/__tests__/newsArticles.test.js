import { test } from 'node:test';
import assert from 'node:assert/strict';

import { articleFromNews, blocksFromBody } from '../newsArticles.js';
import { NEWS_SOURCES, publishersOf, sourcesFromBackend } from '../industryNews.js';

test('a news article body becomes paragraphs and headings', () => {
  assert.deepEqual(blocksFromBody('First line\nwraps.\n\n## What to do\n\nCheck it.'), [
    { type: 'p', text: 'First line wraps.' },
    { type: 'h2', text: 'What to do' },
    { type: 'p', text: 'Check it.' },
  ]);
  assert.deepEqual(blocksFromBody('## Heading\nStraight on.'), [{ type: 'h2', text: 'Heading' }, { type: 'p', text: 'Straight on.' }]);
});

test('a published news article takes the shape of the built-in ones, with its source', () => {
  const a = articleFromNews({ slug: 'x', title: 'X', summary: 'S', body: 'Hi', published_at: '2026-11-06T01:00:00Z', source_url: 'https://sen.news/a/', source_title: 'A', source_name: 'SEN.news' });
  assert.equal(a.published, '2026-11-06');
  assert.equal(a.description, 'S');
  assert.deepEqual(a.source, { title: 'A', url: 'https://sen.news/a/', name: 'SEN.news' });
  assert.equal(articleFromNews({ title: 'no slug' }), null);
});

test('sources from the console become the page\'s sources, unsafe or hidden ones dropped', () => {
  const list = sourcesFromBackend([
    { id: 'security', label: 'Security', source: 'SEN.news', site: 'https://sen.news', feed: 'https://sen.news/feed/', host: 'sen.news', excludeTitle: 'sponsored', active: true },
    { id: 'off', label: 'Off', source: 'Off', site: 'https://a.com', feed: 'https://a.com/feed', active: false },
    { id: 'http', label: 'Plain', source: 'Plain', site: 'http://b.com', feed: 'http://b.com/feed' },
    { id: 'bad', label: 'Bad', source: 'Bad', site: 'https://c.com', feed: 'https://c.com/feed', excludeTitle: '(unclosed', fallback: { source: 'F', site: 'https://f.com', feed: 'https://f.com/feed' } },
  ]);
  assert.deepEqual(list.map((s) => s.id), ['security', 'bad']);
  assert.ok(list[0].excludeTitle.test('SPONSORED post'));
  assert.equal(list[1].excludeTitle, null);
  assert.equal(list[1].fallback.source, 'F');
  assert.deepEqual(sourcesFromBackend(null), []);
  assert.equal(publishersOf(list).length, 3);
  assert.ok(publishersOf(NEWS_SOURCES).length > NEWS_SOURCES.length);
});
