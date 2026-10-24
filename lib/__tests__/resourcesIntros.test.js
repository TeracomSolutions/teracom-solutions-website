import { test } from 'node:test'
import assert from 'node:assert/strict'

import { resourcesIntros } from '../resourcesIntros.js'
import { resourcesSections } from '../resourcesSections.js'

// 1. every key of resourcesIntros is either 'index' or the slug of a section in resourcesSections.
test('keys are valid', () => {
  const sectionSlugs = resourcesSections.map(section => section.slug)

  for (const key of Object.keys(resourcesIntros)) {
    assert.ok(key === 'index' || sectionSlugs.includes(key),
      `Key '${key}' is neither 'index' nor a section slug`)
  }
})

// 2. every value of resourcesIntros is an array of exactly 2 strings, and each string is longer than 40 characters.
test('values are valid arrays of strings', () => {
  for (const [key, intros] of Object.entries(resourcesIntros)) {
    assert.ok(Array.isArray(intros),
      `Value for key '${key}' is not an array`)

    assert.strictEqual(intros.length, 2,
      `Value for key '${key}' does not have exactly 2 elements`)

    for (const [i, intro] of intros.entries()) {
      assert.ok(typeof intro === 'string',
        `Element ${i} for key '${key}' is not a string`)

      assert.ok(intro.length > 40,
        `Element ${i} for key '${key}' is not longer than 40 characters`)
    }
  }
})