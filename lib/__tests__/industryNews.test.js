import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseRssItems } from '../industryNews.js';

function mockXml(items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
${items.map(item => `
<item>
<title>${item.title}</title>
<link>${item.link}</link>
<pubDate>${item.pubDate}</pubDate>
</item>`).join('')}
</channel>
</rss>`;
}

test('parseRssItems with CDATA title', () => {
  const xml = mockXml([{
    title: '<![CDATA[Breaking News: Security System Update]]>',
    link: 'https://sen.news/article1',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result[0].title, 'Breaking News: Security System Update');
});


test('parseRssItems with entity decoding', () => {
  const xml = mockXml([{
    title: 'Security &amp; Privacy &lt;Updates&gt;',
    link: 'https://sen.news/article1',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result[0].title, 'Security & Privacy <Updates>');
});


test('parseRssItems with numeric entity decoding', () => {
  const xml = mockXml([{
    title: 'Security &#160; System',
    link: 'https://sen.news/article1',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result[0].title, 'Security   System');
});


test('parseRssItems drops items with wrong host', () => {
  const xml = mockXml([{
    title: 'Wrong Host News',
    link: 'https://example.com/article1',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result.length, 0);
});


test('parseRssItems drops items with http protocol', () => {
  const xml = mockXml([{
    title: 'HTTP Link News',
    link: 'http://sen.news/article1',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result.length, 0);
});


test('parseRssItems respects limit', () => {
  const xml = mockXml([
    { title: 'News 1', link: 'https://sen.news/article1', pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT' },
    { title: 'News 2', link: 'https://sen.news/article2', pubDate: 'Mon, 02 Jan 2024 12:00:00 GMT' },
    { title: 'News 3', link: 'https://sen.news/article3', pubDate: 'Mon, 03 Jan 2024 12:00:00 GMT' }
  ]);
  
  const result = parseRssItems(xml, { limit: 2 });
  assert.equal(result.length, 2);
});


test('parseRssItems handles bad pubDate', () => {
  const xml = mockXml([{
    title: 'Bad Date News',
    link: 'https://sen.news/article1',
    pubDate: 'Invalid Date'
  }]);
  
  const result = parseRssItems(xml);
  assert.equal(result[0].date, null);
});