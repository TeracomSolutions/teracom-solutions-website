import test from 'node:test';
import assert from 'node:assert/strict';

import { articles, getArticle } from '../articles/index.js';

const BLOCK_TYPES = ['p', 'h2', 'h3', 'ul', 'ol'];
const BROKEN = String.fromCharCode(65533);

function textOf(article) {
  const parts = [article.title, article.description];
  for (const block of article.blocks) {
    if (block.text) parts.push(block.text);
    for (const item of block.items || []) parts.push(typeof item === 'string' ? item : `${item.term} ${item.text}`);
  }
  return parts.join(' ');
}

test('every article has what its page and its search listing need', () => {
  assert.ok(articles.length >= 4);
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, article.slug);
    assert.ok(article.title.length > 10 && article.title.length <= 80, article.slug);
    assert.ok(article.description.length >= 100 && article.description.length <= 170, `${article.slug} description is ${article.description.length} long`);
    assert.match(article.published, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
    assert.ok(article.blocks.length >= 8, article.slug);
  }
});

test('slugs are not repeated', () => {
  const slugs = articles.map((article) => article.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every block is a known kind with something in it', () => {
  for (const article of articles) {
    for (const block of article.blocks) {
      assert.ok(BLOCK_TYPES.includes(block.type), `${article.slug}: ${block.type}`);
      if (block.type === 'ul' || block.type === 'ol') {
        assert.ok(Array.isArray(block.items) && block.items.length >= 2, article.slug);
        for (const item of block.items) {
          if (typeof item === 'string') assert.ok(item.length > 10);
          else assert.ok(item.term && item.text, `${article.slug}: ${JSON.stringify(item)}`);
        }
      } else {
        assert.ok(typeof block.text === 'string' && block.text.length > 5, article.slug);
      }
    }
  }
});

test('the related links stay on this site', () => {
  for (const article of articles) {
    assert.ok(article.related.length >= 2, article.slug);
    for (const link of article.related) {
      assert.ok(link.label && link.href.startsWith('/') && !link.href.startsWith('//'), `${article.slug}: ${link.href}`);
    }
  }
});

test('the text has no broken characters, double spaces or placeholders', () => {
  for (const article of articles) {
    const text = textOf(article);
    assert.ok(!text.includes(BROKEN), article.slug);
    assert.ok(!text.includes('  '), article.slug);
    assert.ok(!/TODO|lorem|undefined/i.test(text), article.slug);
  }
});

test('an article is found by its slug, and an unknown one is not', () => {
  assert.equal(getArticle('what-is-a-ups').title, 'What is a UPS (uninterruptible power supply)?');
  assert.equal(getArticle('no-such-article'), null);
});
