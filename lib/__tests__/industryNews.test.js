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
<description>${item.description || ''}</description>
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

const SEN_DESCRIPTION = `<![CDATA[<p>SecTech 2027 Early Exhibitor List Building With Early Bird Rates Closing Soon! SecTech 2027 Early Exhibitor List &#8211; SecTech Australia and SecTech New Zealand are building momentum towards upcoming May and June 2027 events, with a strong group of electronic security manufacturers and suppliers already committed. Companies confirmed for SecTech 2027 include BGW Technologies, Stentofon, [&#8230;]</p>
<p>The post <a rel="nofollow" href="https://sen.news/x/">SecTech 2027 Early Exhibitor List Building</a> appeared first on <a rel="nofollow" href="https://sen.news">SEN.news - No. 1</a>.</p>
]]>`;

test('parseRssItems builds a short plain-text excerpt from the SEN description', () => {
  const xml = mockXml([{
    title: 'SecTech 2027 Early Exhibitor List Building',
    link: 'https://sen.news/x/',
    pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT',
    description: SEN_DESCRIPTION,
  }]);
  const [item] = parseRssItems(xml);
  assert.ok(item.excerpt.startsWith('SecTech Australia and SecTech New Zealand are building momentum'), item.excerpt);
  assert.ok(item.excerpt.endsWith('…'));
  assert.ok(item.excerpt.length <= 201);
  assert.ok(!item.excerpt.includes('appeared first on'));
  assert.ok(!item.excerpt.includes('<'));
});

test('parseRssItems gives an empty excerpt when there is no description', () => {
  const xml = mockXml([{ title: 'No summary', link: 'https://sen.news/y/', pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT' }]);
  assert.equal(parseRssItems(xml)[0].excerpt, '');
});

