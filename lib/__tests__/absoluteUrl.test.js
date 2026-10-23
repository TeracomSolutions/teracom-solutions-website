import test from 'node:test'
import assert from 'node:assert/strict'

import { SITE_ORIGIN, absoluteUrl } from '../seo.js'

test('SITE_ORIGIN is a string that starts with https:// or http:// and does not end with a slash', () => {
  assert.equal(typeof SITE_ORIGIN, 'string')
  assert.ok(SITE_ORIGIN.startsWith('https://') || SITE_ORIGIN.startsWith('http://'))
  assert.ok(!SITE_ORIGIN.endsWith('/'))
})

test('absoluteUrl function works correctly', () => {
  assert.equal(absoluteUrl('/store'), SITE_ORIGIN + '/store')
  assert.equal(absoluteUrl('store'), SITE_ORIGIN + '/store')
  assert.equal(absoluteUrl(), SITE_ORIGIN + '/')
  assert.equal(absoluteUrl('https://example.com/a?b=1'), 'https://example.com/a?b=1')
  assert.equal(absoluteUrl('http://example.com'), 'http://example.com')
})
