import test from 'node:test'
import assert from 'node:assert/strict'

import {
  weekDate,
  weekSeries,
  changeLine,
  moneyText,
  stepLine,
  funnelWidth,
  setupSteps,
  lastNote
} from '../analyticsView.js'

// Test weekDate function
await test('weekDate function', () => {
  assert.strictEqual(weekDate('202641'), '2026-10-05')
  assert.strictEqual(weekDate('202601'), '2025-12-29')
  assert.strictEqual(weekDate('202600'), '') // Invalid week
  assert.strictEqual(weekDate('2026410'), '') // Too many digits
  assert.strictEqual(weekDate('202600'), '') // Week 0 is invalid
  assert.strictEqual(weekDate('202654'), '') // Week 54 is invalid
  assert.strictEqual(weekDate('abcde'), '') // Not numeric
})

// Test weekSeries function
await test('weekSeries function', () => {
  const weeks = [
    { week: '202641', sessions: 100, orders: 5 },
    { week: '202601', sessions: 200, orders: 10 },
    { week: '202600', sessions: 150, orders: 7 } // Invalid week
  ]

  const result = weekSeries(weeks, 'sessions')
  assert.strictEqual(result.length, 2)
  assert.strictEqual(result[0].date, '2026-10-05')
  assert.strictEqual(result[0].sessions, 100)
  assert.strictEqual(result[1].date, '2025-12-29')
  assert.strictEqual(result[1].sessions, 200)

  // Test with invalid input
  assert.deepStrictEqual(weekSeries(null, 'sessions'), [])
  assert.deepStrictEqual(weekSeries('invalid', 'sessions'), [])
})

// Test changeLine function
await test('changeLine function', () => {
  // Test positive change
  assert.deepStrictEqual(changeLine({ now: 100, before: 90, change: 0.123 }),
    { text: '+12% on the 28 days before', better: true })

  // Test negative change
  assert.deepStrictEqual(changeLine({ now: 80, before: 100, change: -0.2 }),
    { text: '-20% on the 28 days before', better: false })

  // Test zero change
  assert.deepStrictEqual(changeLine({ now: 100, before: 100, change: 0 }),
    { text: '0% on the 28 days before', better: true })

  // Test null change
  assert.deepStrictEqual(changeLine({ now: 100, before: 100, change: null }),
    { text: 'No figures from before', better: null })

  // Test invalid input
  assert.deepStrictEqual(changeLine(null), { text: '', better: null })
  assert.deepStrictEqual(changeLine('invalid'), { text: '', better: null })
})

// Test moneyText function
await test('moneyText function', () => {
  assert.strictEqual(moneyText(1234.5), '$1,234.50')
  assert.strictEqual(moneyText(0), '$0')
  assert.strictEqual(moneyText('x'), '$0')
  assert.strictEqual(moneyText(null), '$0')
  assert.strictEqual(moneyText(undefined), '$0')
  assert.strictEqual(moneyText(NaN), '$0')
})

// Test stepLine function
await test('stepLine function', () => {
  // Test first step (step_rate is null)
  assert.deepStrictEqual(stepLine({ label: 'Step 1', count: 100, users: 50, share: 1, step_rate: null }),
    { count: '100', note: '' })

  // Test later step (step_rate is 0.4231)
  assert.deepStrictEqual(stepLine({ label: 'Step 2', count: 50, users: 25, share: 0.5, step_rate: 0.4231 }),
    { count: '50', note: '42% of the step before' })
})

// Test funnelWidth function
await test('funnelWidth function', () => {
  // Test share 1 (should give 100)
  assert.strictEqual(funnelWidth({ count: 100, share: 1 }), 100)

  // Test share 0.004 (should be clamped to 2)
  assert.strictEqual(funnelWidth({ count: 100, share: 0.004 }), 2)

  // Test share 0.5
  assert.strictEqual(funnelWidth({ count: 100, share: 0.5 }), 50)

  // Test count 0 (should return 0)
  assert.strictEqual(funnelWidth({ count: 0, share: 0.5 }), 0)

  // Test share null (should return 0)
  assert.strictEqual(funnelWidth({ count: 100, share: null }), 0)
})

// Test setupSteps function
await test('setupSteps function', () => {
  // Test with email
  assert.deepStrictEqual(setupSteps('test@example.com'), [
    'Open https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=teracom-unifi and click Enable.',
    'Open https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=teracom-unifi and click Enable.',
    'In Google Analytics, open Admin, then Property access management, click the plus and add test@example.com as a Viewer.',
    'Come back here and press Pull the figures now.'
  ])

  // Test without email
  assert.deepStrictEqual(setupSteps(null), [
    'Open https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=teracom-unifi and click Enable.',
    'Open https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=teracom-unifi and click Enable.',
    'In Google Analytics, open Admin, then Property access management, click the plus and add the service account address shown under Connections as a Viewer.',
    'Come back here and press Pull the figures now.'
  ])
})

// Test lastNote function
await test('lastNote function', () => {
  // Test running status
  assert.strictEqual(lastNote({ running: true }), 'Working on it now. Press Reload to see the result.')

  // Test error status
  assert.strictEqual(lastNote({ error: 'Connection failed' }), 'The last attempt stopped: Connection failed')

  // Test no last_at
  assert.strictEqual(lastNote({}), 'Not pulled yet.')

  // Test normal case (just check beginning and ending)
  const note = lastNote({ last_at: '2026-10-11T01:07:29.241Z' })
  assert(note.startsWith('Last pulled '))
  assert(note.endsWith('.'))
})