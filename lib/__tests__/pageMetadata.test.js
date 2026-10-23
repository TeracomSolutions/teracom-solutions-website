import test from 'node:test'
import assert from 'node:assert/strict'
import { SITE_NAME, NOINDEX, absoluteUrl, pageMetadata } from '../seo.js'

test('canonical and Open Graph agree', () => {
  const m = pageMetadata({ title: 'T', description: 'D', path: '/store' })
  assert.equal(m.title, 'T')
  assert.equal(m.description, 'D')
  assert.equal(m.alternates.canonical, absoluteUrl('/store'))
  assert.equal(m.openGraph.url, absoluteUrl('/store'))
  assert.equal(m.openGraph.siteName, SITE_NAME)
  assert.equal(m.openGraph.locale, 'en_AU')
  assert.equal(m.openGraph.type, 'website')
})

test('images', () => {
  // with no images given
  const m1 = pageMetadata({ title: 'T', description: 'D', path: '/store' })
  assert.equal(m1.openGraph.images[0].url, '/opengraph-image')
  assert.equal(m1.twitter.images[0].url, '/opengraph-image')
  assert.equal(m1.twitter.card, 'summary_large_image')

  // with images
  const m2 = pageMetadata({ title: 'T', description: 'D', path: '/store', images: [{ url: '/x.png' }] })
  assert.deepEqual(m2.openGraph.images, [{ url: '/x.png' }])
  assert.deepEqual(m2.twitter.images, [{ url: '/x.png' }])
})

test('type and noindex', () => {
  const m = pageMetadata({ title: 'T', description: 'D', path: '/a', type: 'article' })
  assert.equal(m.openGraph.type, 'article')

  assert.equal(NOINDEX.robots.index, false)
  assert.equal(NOINDEX.robots.follow, false)
  assert.equal(NOINDEX.robots.googleBot.index, false)
})
