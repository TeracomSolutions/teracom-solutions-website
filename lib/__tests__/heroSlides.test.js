import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildHeroSlides,
  FALLBACK_SLIDES,
  heroSlides,
  PINNED_SLIDES,
} from '../heroSlides.js';

const story = (title, extra = {}) => ({
  title,
  link: `https://example.com/${title.toLowerCase().replace(/\W+/g, '-')}`,
  excerpt: 'A short summary of the story.',
  date: '2026-09-23T00:00:00.000Z',
  source: 'Example News',
  ...extra,
});

test('the first two slides are always Teracom, whatever the news does', () => {
  const withNews = buildHeroSlides({
    security: [story('Something happened in security')],
    electrical: [story('Something happened in electrical')],
    ai: [story('Something happened in AI')],
  });
  const withoutNews = buildHeroSlides({});

  for (const slides of [withNews, withoutNews]) {
    assert.equal(slides[0].id, PINNED_SLIDES[0].id);
    assert.equal(slides[1].id, PINNED_SLIDES[1].id);
    assert.ok(!slides[0].ctaExternal);
    assert.ok(!slides[1].ctaExternal);
  }
});

test('news fills the slots after the pinned slides', () => {
  const slides = buildHeroSlides({
    security: [story('Security story')],
    electrical: [story('Electrical story')],
  });
  assert.equal(slides[2].headline, 'Security story');
  assert.equal(slides[3].headline, 'Electrical story');
  assert.equal(slides[2].ctaExternal, true);
  assert.equal(slides[2].secondaryHref, '/resources/industry-news');
  // The publisher is credited on the slide itself.
  assert.match(slides[2].eyebrow, /Example News/);
});

test('at most one story per industry, so one busy publisher cannot take every slot', () => {
  const slides = buildHeroSlides({
    security: [story('First security story'), story('Second security story'), story('Third security story')],
  });
  const fromSecurity = slides.filter((s) => s.headline && s.headline.includes('security story'));
  assert.equal(fromSecurity.length, 1);
});

test('headlines too long for an h1 are skipped rather than truncated', () => {
  const tooLong = 'x'.repeat(120);
  const slides = buildHeroSlides({ security: [story(tooLong), story('A usable security headline')] });
  assert.equal(slides[2].headline, 'A usable security headline');
  assert.ok(!slides.some((s) => s.headline === tooLong));
});

test('industries that are not a Teracom customer concern stay off the hero', () => {
  // They still appear on /resources/industry-news -- just not the front door.
  const slides = buildHeroSlides({
    plumbing: [story('A plumbing story')],
    marketing: [story('A marketing story')],
    security: [story('A security story')],
  });
  assert.equal(slides[2].headline, 'A security story');
  assert.ok(!slides.some((s) => s.headline === 'A plumbing story'));
  assert.ok(!slides.some((s) => s.headline === 'A marketing story'));
});

test('an industry with no usable story is skipped, not left blank', () => {
  const slides = buildHeroSlides({ security: [], electrical: [story('Electrical story')] });
  assert.equal(slides[2].headline, 'Electrical story');
  for (const slide of slides) {
    assert.ok(slide.headline, 'every slide needs a headline');
    assert.ok(slide.ctaHref, 'every slide needs a call to action');
    assert.ok(slide.image, 'every slide needs an image');
    assert.ok(slide.imageAlt, 'every slide image needs alt text');
  }
});

test('the carousel is always full, and never repeats a slide', () => {
  for (const news of [{}, { security: [story('One story')] }]) {
    const slides = buildHeroSlides(news);
    assert.equal(slides.length, 7);
    assert.equal(new Set(slides.map((s) => s.id)).size, 7);
  }
});

test('a feed failure falls back to Teracom slides only', () => {
  const slides = buildHeroSlides({});
  assert.deepEqual(
    slides.map((s) => s.id),
    [...PINNED_SLIDES, ...FALLBACK_SLIDES].slice(0, 7).map((s) => s.id)
  );
  assert.equal(heroSlides.length >= 7, true);
});
