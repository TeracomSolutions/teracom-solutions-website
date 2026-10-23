import test from 'node:test'
import assert from 'node:assert/strict'

import { money, dollars } from '../catalogShared.js'

test('money function', () => {
  const DASH = money(null)
  assert.equal(DASH.length, 1)
  assert.equal(money(NaN), DASH)
  assert.equal(money(12345), '$123.45')
  assert.equal(money(100000), '$1,000.00')
  assert.equal(money(0), '$0.00')
})

test('dollars function', () => {
  assert.equal(dollars(null), '')
  assert.equal(dollars(1999), '19.99')
  assert.equal(dollars(0), '0.00')
  assert.equal(dollars(100), '1.00')
})
