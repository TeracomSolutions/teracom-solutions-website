import test from 'node:test'
import assert from 'node:assert/strict'

import { readPostcode, writePostcode } from '../cartPostcode.js'

test('read and write postcode with localStorage mock', () => {
  const store = new Map()
  globalThis.window = { localStorage: {
    getItem(key) { return store.get(key) || null },
    setItem(key, value) { store.set(key, value) }
  }}

  writePostcode('3000')
  assert.equal(readPostcode(), '3000')

  // Clean up
  delete globalThis.window
})

test('read postcode when localStorage.getItem throws', () => {
  globalThis.window = { localStorage: {
    getItem() { throw new Error('localStorage error') },
    setItem() {}
  }}

  // Should not throw, but return empty string
  assert.equal(readPostcode(), '')

  // Clean up
  delete globalThis.window
})

test('write postcode when localStorage.setItem throws', () => {
  globalThis.window = { localStorage: {
    getItem() { return null },
    setItem() { throw new Error('localStorage error') }
  }}

  // Should not throw even if setItem fails
  assert.doesNotThrow(() => writePostcode('2000'))

  // Clean up
  delete globalThis.window
})
