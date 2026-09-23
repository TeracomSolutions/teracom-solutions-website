import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseRssItems, categoriseHeadline } from '../industryNews.js';

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

test('categoriseHeadline tags headlines by whole-word topic', () => {
  assert.equal(categoriseHeadline('Greyhound Racing Victoria Plans Major CCTV Upgrade').id, 'video');
  assert.equal(categoriseHeadline('Inside Avigilon Intercom Touch').id, 'access');
  assert.equal(categoriseHeadline('Guardtech Launches 2-Way Duress Pen').id, 'alarms');
  assert.equal(categoriseHeadline('New cloud platform for integrators').id, 'cyber');
  assert.equal(categoriseHeadline('SecTech 2027 Early Exhibitor List Building').id, 'industry');
  // whole words only: "monkey" is not "key", "said" is not "ai"
  assert.equal(categoriseHeadline('The monkey said hello').id, 'industry');
  assert.equal(categoriseHeadline('WA Police plan electronic fingerprint capture upgrade').label, 'Access & locks');
});

test('categoriseHeadline lets the headline win over the preview text', () => {
  assert.equal(categoriseHeadline('Inside Avigilon Intercom Touch', 'You get video, 2-way audio and a door reader').id, 'access');
  assert.equal(categoriseHeadline('Fortis Wins Melbourne Market', 'The new video platform covers 40 sites').id, 'video');
});

test('parseRssItems keeps other hosts when told to, and can skip categories and titles', async () => {
  const { parseRssItems } = await import('../industryNews.js');
  const xml = `<rss><channel>
    <item><title>Switchboard upgrade rules</title><link>https://electricalconnection.com.au/a</link><category>Industry</category><description><![CDATA[<p>New rules – for boards.</p>]]></description></item>
    <item><title>Best tradie utes</title><link>https://electricalconnection.com.au/b</link><category>Transport</category></item>
    <item><title>Buy Disrupt tickets now</title><link>https://electricalconnection.com.au/c</link></item>
  </channel></rss>`;
  const items = parseRssItems(xml, {
    allowedHost: 'electricalconnection.com.au',
    excludeCategories: ['Transport'],
    excludeTitle: /\bdisrupt\b/i,
    stripLeadDash: false,
  });
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Switchboard upgrade rules');
  assert.equal(items[0].excerpt, 'New rules – for boards.');
});

test('NEWS_SOURCES are unique, https and start with SEN', async () => {
  const { NEWS_SOURCES, findNewsSource } = await import('../industryNews.js');
  assert.equal(NEWS_SOURCES[0].id, 'security');
  assert.equal(new Set(NEWS_SOURCES.map((s) => s.id)).size, NEWS_SOURCES.length);
  for (const s of NEWS_SOURCES) {
    assert.ok(s.feed.startsWith('https://') && s.site.startsWith('https://'), s.id);
    assert.ok(new URL(s.feed).hostname.endsWith(s.host), s.id);
    assert.equal(findNewsSource(s.id), s);
  }
  assert.equal(findNewsSource('nope'), undefined);
});

test('parseRssItems decodes double-encoded feeds only when asked', async () => {
  const { parseRssItems } = await import('../industryNews.js');
  const xml = `<rss><channel><item><title>Sydney&amp;#39;s Metro</title><link>https://www.ecdonline.com.au/a</link></item></channel></rss>`;
  assert.equal(parseRssItems(xml, { allowedHost: 'ecdonline.com.au' })[0].title, 'Sydney&#39;s Metro');
  assert.equal(parseRssItems(xml, { allowedHost: 'ecdonline.com.au', decodeTwice: true })[0].title, "Sydney's Metro");
});

test('every fallback feed is https on its own host', async () => {
  const { NEWS_SOURCES, NEWS_PUBLISHERS } = await import('../industryNews.js');
  for (const s of NEWS_SOURCES.filter((x) => x.fallback)) {
    assert.ok(s.fallback.feed.startsWith('https://'), s.id);
    assert.ok(new URL(s.fallback.feed).hostname.endsWith(s.fallback.host), s.id);
  }
  assert.ok(NEWS_PUBLISHERS.length > NEWS_SOURCES.length);
});

// --- The article's own picture -------------------------------------------
import { parseRssItems as parseForImages } from '../industryNews.js';

const itemWith = (body) => `<rss><channel><item>
  <title>A story</title>
  <link>https://sen.news/a-story/</link>
  <pubDate>Tue, 23 Sep 2026 01:00:00 +0000</pubDate>
  ${body}
</item></channel></rss>`;

test('finds the image in an enclosure, decoding the escaped query string', () => {
  const xml = itemWith(
    '<enclosure url="https://sen.news/wp-content/uploads/shot.jpg?quality=50&#038;strip=all" type="image/jpeg" />'
  );
  const [item] = parseForImages(xml, { allowedHost: 'sen.news' });
  // Undecoded, "&#038;" would be sent literally and the image would 404.
  assert.equal(item.imageUrl, 'https://sen.news/wp-content/uploads/shot.jpg?quality=50&strip=all');
});

test('finds the image in media:content and media:thumbnail', () => {
  const content = parseForImages(
    itemWith('<media:content url="https://sen.news/a.jpg" medium="image" />'),
    { allowedHost: 'sen.news' }
  );
  assert.equal(content[0].imageUrl, 'https://sen.news/a.jpg');

  const thumb = parseForImages(
    itemWith('<media:thumbnail url="https://sen.news/b.png" />'),
    { allowedHost: 'sen.news' }
  );
  assert.equal(thumb[0].imageUrl, 'https://sen.news/b.png');
});

test('falls back to the first img in the article body', () => {
  const xml = itemWith(
    '<description><![CDATA[<p>Lead</p><img fetchpriority="high" width="1024" src="https://sen.news/wp-content/uploads/bgw.jpg" />]]></description>'
  );
  const [item] = parseForImages(xml, { allowedHost: 'sen.news' });
  assert.equal(item.imageUrl, 'https://sen.news/wp-content/uploads/bgw.jpg');
});

test('a declared image beats the first img in the body', () => {
  const xml = itemWith(
    '<media:content url="https://sen.news/declared.jpg" medium="image" />' +
      '<description><![CDATA[<img src="https://sen.news/inline.jpg" />]]></description>'
  );
  const [item] = parseForImages(xml, { allowedHost: 'sen.news' });
  assert.equal(item.imageUrl, 'https://sen.news/declared.jpg');
});

test('skips things that are plainly not the article photo', () => {
  const rejected = [
    '<img src="https://feeds.feedburner.com/~r/pixel.gif" />',
    '<img src="https://secure.gravatar.com/avatar/abc.jpg" />',
    '<img src="https://sen.news/assets/spacer.gif" />',
    '<img src="https://sen.news/assets/site-logo.png" />',
    // http would be blocked as mixed content on an https page.
    '<img src="http://sen.news/insecure.jpg" />',
    // Not an image at all.
    '<enclosure url="https://sen.news/episode.mp3" type="audio/mpeg" />',
    '<img src="https://sen.news/tracker" />',
  ];
  for (const markup of rejected) {
    const [item] = parseForImages(itemWith(markup), { allowedHost: 'sen.news' });
    assert.equal(item.imageUrl, null, `should have rejected ${markup}`);
  }
});

test('an item with no image at all still parses', () => {
  const [item] = parseForImages(itemWith('<description>Just words.</description>'), {
    allowedHost: 'sen.news',
  });
  assert.equal(item.imageUrl, null);
  assert.equal(item.title, 'A story');
});

