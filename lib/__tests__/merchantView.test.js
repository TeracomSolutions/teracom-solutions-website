import test from 'node:test'
import assert from 'node:assert/strict'

import {
  countCards,
  resolutionText,
  severityText,
  issueLine,
  sourceLine,
  problemLine
} from '../merchantView.js'

// Test countCards
await test('countCards with full counts', () => {
  const counts = {
    approved: 10,
    pending: 5,
    disapproved: 3,
    needs_action: 2
  }

  const result = countCards(counts)

  assert.equal(result.length, 4)

  assert.equal(result[0].key, 'approved')
  assert.equal(result[0].label, 'Approved by Google')
  assert.equal(result[0].value, 10)
  assert.equal(result[0].tone, 'good')

  assert.equal(result[1].key, 'pending')
  assert.equal(result[1].label, 'Waiting for Google')
  assert.equal(result[1].value, 5)
  assert.equal(result[1].tone, 'wait')

  assert.equal(result[2].key, 'disapproved')
  assert.equal(result[2].label, 'Not approved')
  assert.equal(result[2].value, 3)
  assert.equal(result[2].tone, 'bad')

  assert.equal(result[3].key, 'needs_action')
  assert.equal(result[3].label, 'We need to fix')
  assert.equal(result[3].value, 2)
  assert.equal(result[3].tone, 'bad')
})

await test('countCards with missing counts', () => {
  const result = countCards(null)

  assert.equal(result.length, 4)

  for (let i = 0; i < result.length; i++) {
    assert.equal(result[i].value, 0)
  }
})

await test('countCards with string values', () => {
  const counts = {
    approved: '5',
    pending: '3',
    disapproved: '2',
    needs_action: '1'
  }

  const result = countCards(counts)

  assert.equal(result[0].value, 5)
  assert.equal(result[1].value, 3)
  assert.equal(result[2].value, 2)
  assert.equal(result[3].value, 1)
})

// Test resolutionText
await test('resolutionText with merchant_action', () => {
  assert.equal(resolutionText('merchant_action'), 'We need to fix this')
  assert.equal(resolutionText('MERCHANT_ACTION'), 'We need to fix this')
})

await test('resolutionText with pending_processing', () => {
  assert.equal(resolutionText('pending_processing'), 'Google is still checking')
  assert.equal(resolutionText('PENDING_PROCESSING'), 'Google is still checking')
})

await test('resolutionText with other values', () => {
  assert.equal(resolutionText('other_value'), 'Google looks after this')
  assert.equal(resolutionText(''), 'Google looks after this')
  assert.equal(resolutionText(undefined), 'Google looks after this')
  assert.equal(resolutionText(null), 'Google looks after this')
  assert.equal(resolutionText(123), 'Google looks after this')
})

// Test severityText
await test('severityText with disapproved', () => {
  assert.equal(severityText('disapproved'), 'Keeps the product off Google')
  assert.equal(severityText('DISAPPROVED'), 'Keeps the product off Google')
})

await test('severityText with demoted', () => {
  assert.equal(severityText('demoted'), 'Shown lower down')
  assert.equal(severityText('DEMOTED'), 'Shown lower down')
})

await test('severityText with not_impacted', () => {
  assert.equal(severityText('not_impacted'), 'No effect on showing')
  assert.equal(severityText('NOT_IMPACTED'), 'No effect on showing')
})

await test('severityText with other values', () => {
  assert.equal(severityText('other_value'), 'Notice')
  assert.equal(severityText(''), 'Notice')
  assert.equal(severityText(undefined), 'Notice')
  assert.equal(severityText(null), 'Notice')
  assert.equal(severityText(123), 'Notice')
})

// Test issueLine
await test('issueLine with 8 products', () => {
  const issue = {
    products: 8,
    title: 'Missing attribute: [availability]'
  }

  assert.equal(issueLine(issue), '8 products: Missing attribute: [availability]')
})

await test('issueLine with exactly 1 product', () => {
  const issue = {
    products: 1,
    title: 'Missing attribute: [availability]'
  }

  assert.equal(issueLine(issue), '1 product: Missing attribute: [availability]')
})

await test('issueLine with missing count', () => {
  const issue = {
    title: 'Missing attribute: [availability]'
  }

  assert.equal(issueLine(issue), '0 products: Missing attribute: [availability]')
})

await test('issueLine with missing title', () => {
  const issue = {
    products: 5
  }

  assert.equal(issueLine(issue), '5 products: Unknown reason')
})

await test('issueLine with missing issue', () => {
  assert.equal(issueLine(null), '')
})

// Test sourceLine
await test('sourceLine with daily file source that is on', () => {
  const source = {
    name: 'My Website Feed',
    kind: 'file',
    daily: true,
    on: true
  }

  assert.equal(sourceLine(source), 'My Website Feed - fetched from the website - on')
})

await test('sourceLine with file source that is not daily and off', () => {
  const source = {
    name: 'My Website Feed',
    kind: 'file',
    daily: false,
    on: false
  }

  assert.equal(sourceLine(source), 'My Website Feed - file fetched by Google - off')
})

await test('sourceLine with autofeed source', () => {
  const source = {
    name: 'My Website Feed',
    kind: 'autofeed',
    daily: false,
    on: true
  }

  assert.equal(sourceLine(source), 'My Website Feed - automatic from the website - on')
})

await test('sourceLine with unknown kind', () => {
  const source = {
    name: 'My Website Feed',
    kind: 'unknown_kind',
    daily: false,
    on: true
  }

  assert.equal(sourceLine(source), 'My Website Feed - other - on')
})

await test('sourceLine with missing source', () => {
  assert.equal(sourceLine(null), '')
})

// Test problemLine
await test('problemLine with two issues', () => {
  const problem = {
    offer_id: '12345',
    title: 'My Product Title',
    issues: [
      { title: 'Missing attribute: [availability]' },
      { title: 'Missing attribute: [price]' }
    ]
  }

  assert.equal(problemLine(problem), '12345 - My Product Title - Missing attribute: [availability]; Missing attribute: [price]')
})

await test('problemLine with no issues', () => {
  const problem = {
    offer_id: '12345',
    title: 'My Product Title',
    issues: []
  }

  assert.equal(problemLine(problem), '12345 - My Product Title - No reason given')
})

await test('problemLine with empty title', () => {
  const problem = {
    offer_id: '12345',
    title: '',
    issues: [
      { title: 'Missing attribute: [availability]' }
    ]
  }

  assert.equal(problemLine(problem), '12345 - No title - Missing attribute: [availability]')
})

await test('problemLine with missing problem', () => {
  assert.equal(problemLine(null), '')
})