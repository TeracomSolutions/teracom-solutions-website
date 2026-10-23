import { test } from 'node:test'
import * as assert from 'node:assert/strict'
import { marginOf, marginClass } from '../catalogShared.js'

const near = (a, b, eps = 0.01) => Math.abs(a - b) < eps

test('marginOf with a missing value', () => {
  assert.deepStrictEqual(marginOf(null, 100), { cents: null, pct: null })
  assert.deepStrictEqual(marginOf(100, null), { cents: null, pct: null })
})

test('marginOf maths', () => {
  // GST is 1.1; use a small tolerance helper
  const result1 = marginOf(1100, 1000)
  assert.ok(near(result1.cents, 0), `Expected cents near 0, got ${result1.cents}`)
  assert.ok(near(result1.pct, 0), `Expected pct near 0, got ${result1.pct}`)

  const result2 = marginOf(1650, 1000)
  assert.ok(near(result2.cents, 500), `Expected cents near 500, got ${result2.cents}`)
  assert.ok(near(result2.pct, 33.33), `Expected pct near 33.33, got ${result2.pct}`)

  const result3 = marginOf(0, 1000)
  assert.strictEqual(result3.pct, null)
})

test('marginClass', () => {
  assert.strictEqual(marginClass(null), 'admin-muted')
  assert.strictEqual(marginClass(-1), 'admin-margin bad')
  assert.strictEqual(marginClass(0), 'admin-margin thin')
  assert.strictEqual(marginClass(14.9), 'admin-margin thin')
  assert.strictEqual(marginClass(15), 'admin-margin good')
  assert.strictEqual(marginClass(40), 'admin-margin good')
})
