import test from 'node:test'
import assert from 'node:assert/strict'

import { resourcesSections, SITE_DOCUMENT_SECTIONS, DOC_TYPE_LABELS, findResourcesSection } from '../resourcesSections.js'

test('every section has a non-empty slug, title and description, and no two sections share a slug', () => {
  const slugs = resourcesSections.map(section => section.slug)

  // Check each section has required properties
  for (const section of resourcesSections) {
    assert.ok(section.slug, 'Section must have a slug')
    assert.ok(section.title, 'Section must have a title')
    assert.ok(section.description, 'Section must have a description')

    // Check slug is non-empty string
    assert.equal(typeof section.slug, 'string')
    assert.ok(section.slug.trim(), 'Slug must be non-empty')

    // Check title is non-empty string
    assert.equal(typeof section.title, 'string')
    assert.ok(section.title.trim(), 'Title must be non-empty')

    // Check description is non-empty string
    assert.equal(typeof section.description, 'string')
    assert.ok(section.description.trim(), 'Description must be non-empty')
  }

  // Check no duplicate slugs
  assert.equal(new Set(slugs).size, resourcesSections.length, 'No two sections can share a slug')
})

test('every slug in SITE_DOCUMENT_SECTIONS is the slug of a section in resourcesSections', () => {
  for (const slug of SITE_DOCUMENT_SECTIONS) {
    const found = resourcesSections.find(section => section.slug === slug)
    assert.ok(found, `Slug '${slug}' from SITE_DOCUMENT_SECTIONS must be present in resourcesSections`)
  }
})

test('DOC_TYPE_LABELS has exactly the keys datasheet, user_manual, installer_manual, brochure, other', () => {
  const expectedKeys = ['datasheet', 'user_manual', 'installer_manual', 'brochure', 'other']

  assert.deepEqual(Object.keys(DOC_TYPE_LABELS).sort(), expectedKeys.sort())

  // Check each label is a non-empty string
  for (const key of expectedKeys) {
    assert.equal(typeof DOC_TYPE_LABELS[key], 'string')
    assert.ok(DOC_TYPE_LABELS[key].trim(), `Label for '${key}' must be non-empty`)
  }
})

test('findResourcesSection function works correctly', () => {
  // Test finding existing section
  const datasheetsSection = findResourcesSection('datasheets')
  assert.ok(datasheetsSection, 'findResourcesSection should return a section for "datasheets"')
  assert.equal(datasheetsSection.title, 'Datasheets')

  // Test finding non-existing section
  const nopeSection = findResourcesSection('nope')
  assert.equal(nopeSection, undefined, 'findResourcesSection should return undefined for non-existing slug')
})
