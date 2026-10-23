import test from 'node:test'
import assert from 'node:assert/strict'

import { csvEscape } from '../catalogShared.js'

test('plain values', () => {
  assert.equal(csvEscape('abc'), 'abc')
  assert.equal(csvEscape(null), '')
  assert.equal(csvEscape(undefined), '')
  assert.equal(csvEscape(42), '42')
  assert.equal(csvEscape(''), '')
})

test('quoting', () => {
  const Q = String.fromCharCode(34)
  assert.equal(csvEscape('a,b'), Q + 'a,b' + Q)
  assert.equal(csvEscape("say " + Q + "hi" + Q), Q + 'say ' + Q + Q + 'hi' + Q + Q + Q)
  const newline = 'a' + String.fromCharCode(10) + 'b'
  assert.ok(csvEscape(newline).startsWith(Q) && csvEscape(newline).endsWith(Q))
})

test('spreadsheet formulas are defused', () => {
  assert.equal(csvEscape('=SUM(A1)'), "'=SUM(A1)")
  assert.equal(csvEscape('+61 2 9999'), "'+61 2 9999")
  assert.equal(csvEscape('@x'), "'@x")
  assert.equal(csvEscape('-5'), '-5')
  assert.equal(csvEscape('+5'), '+5')
})
