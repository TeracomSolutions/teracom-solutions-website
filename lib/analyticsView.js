/*
 * Helper functions for the analytics view
 */

import { dollarText } from './pricingBands.js'
import { formatNumber } from './searchInsights.js'

/**
 * weekDate(isoYearWeek): the Monday of an ISO week as 'YYYY-MM-DD'.
 * The input is text like '202641' (year then two-digit ISO week).
 * ISO week 1 is the week that contains 4 January; weeks start on Monday.
 * Do the arithmetic with Date.UTC so time zones do not matter.
 * Examples: '202641' gives '2026-10-05'; '202601' gives '2025-12-29';
 * '202553' is not valid, so anything that is not six digits or has a week
 * below 1 or above 53 gives ''.
 */

/**
 * weekSeries(weeks, field): turns the snapshot's weeks (a list of { week, sessions, orders })
 * into the list the bar chart wants: [{ date: weekDate(week.week), [field]: Number(week[field]) || 0 }],
 * leaving out entries whose date is ''.
 * Not an array gives []
 */
export function weekSeries(weeks, field) {
  if (!Array.isArray(weeks)) return []

  return weeks
    .map(week => {
      const date = weekDate(week.week)
      return { date, [field]: Number(week[field]) || 0 }
    })
    .filter(entry => entry.date !== '')
}

/**
 * changeLine(delta): delta is { now, before, change } where change is a fraction or null.
 * Returns { text, better }.
 * When change is null: { text: 'No figures from before', better: null }.
 * Otherwise text is the rounded whole-number percent with a plus sign when above zero,
 * then ' on the 28 days before' (for example '+12% on the 28 days before',
 * '-8% on the 28 days before', '0% on the 28 days before'), and better is true
 * when change is zero or above, otherwise false.
 * A missing or non-object delta gives { text: '', better: null }.
 */
export function changeLine(delta) {
  if (!delta || typeof delta !== 'object') {
    return { text: '', better: null }
  }

  if (delta.change === null) {
    return { text: 'No figures from before', better: null }
  }

  const changePercent = Math.round(delta.change * 100)
  const sign = changePercent > 0 ? '+' : ''
  const text = `${sign}${changePercent}% on the 28 days before`
  const better = delta.change >= 0

  return { text, better }
}

/**
 * moneyText(value): dollarText of the number, or '$0' for anything that is not a finite number.
 */
export function moneyText(value) {
  if (typeof value !== 'number' || !isFinite(value)) {
    return '$0'
  }

  return dollarText(value)
}

/**
 * stepLine(step): for a funnel step { label, count, users, share, step_rate } returns
 * { count: formatNumber(count), note }.
 * note is '' for the first step (step_rate null), otherwise Math.round(step_rate * 100) + '% of the step before'.
 * When step_rate is null and share is not null the note is '' too.
 */
export function stepLine(step) {
  const count = formatNumber(step.count)

  let note = ''
  if (step.step_rate !== null) {
    note = Math.round(step.step_rate * 100) + '% of the step before'
  }

  return { count, note }
}

/**
 * funnelWidth(step): the bar width in percent for a step:
 * Math.round(share * 100) clamped between 2 and 100 when count is above 0; 0 when count is 0 or share is null.
 */
export function funnelWidth(step) {
  if (step.count === 0 || step.share === null) return 0

  const width = Math.round(step.share * 100)
  return Math.max(2, Math.min(100, width))
}

/**
 * setupSteps(email): returns an array of strings, the steps to connect Google Analytics,
 * in this order:
 * 'Open https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=teracom-unifi and click Enable.'
 * 'Open https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=teracom-unifi and click Enable.'
 * 'In Google Analytics, open Admin, then Property access management, click the plus and add ' +
 * (email or 'the service account address shown under Connections') + ' as a Viewer.'
 * 'Come back here and press Pull the figures now.'
 */
export function setupSteps(email) {
  const emailPart = email || 'the service account address shown under Connections'

  return [
    'Open https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=teracom-unifi and click Enable.',
    'Open https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=teracom-unifi and click Enable.',
    'In Google Analytics, open Admin, then Property access management, click the plus and add ' + emailPart + ' as a Viewer.',
    'Come back here and press Pull the figures now.'
  ]
}

/**
 * lastNote(status): status is { last_at, running, error } as the backend sends it.
 * Returns 'Working on it now. Press Reload to see the result.' when running,
 * 'The last attempt stopped: ' + error when there is an error,
 * 'Not pulled yet.' when there is no last_at, otherwise 'Last pulled ' followed by
 * a short Australian date and time of last_at (use toLocaleString('en-AU', {
 * dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Melbourne' }))
 * and a full stop.
 */
export function lastNote(status) {
  if (!status || typeof status !== 'object') return ''

  if (status.running) {
    return 'Working on it now. Press Reload to see the result.'
  }

  if (status.error) {
    return 'The last attempt stopped: ' + status.error
  }

  if (!status.last_at) {
    return 'Not pulled yet.'
  }

  const date = new Date(status.last_at)
  const formattedDate = date.toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Australia/Melbourne'
  })

  return 'Last pulled ' + formattedDate + '.'
}

/**
 * weekDate(isoYearWeek): the Monday of an ISO week as 'YYYY-MM-DD'.
 * The input is text like '202641' (year then two-digit ISO week).
 * ISO week 1 is the week that contains 4 January; weeks start on Monday.
 * Do the arithmetic with Date.UTC so time zones do not matter.
 * Examples: '202641' gives '2026-10-05'; '202601' gives '2025-12-29';
 * '202553' is not valid, so anything that is not six digits or has a week
 * below 1 or above 53 gives ''.
 */
export function weekDate(isoYearWeek) {
  if (typeof isoYearWeek !== 'string' || isoYearWeek.length !== 6) return ''

  const year = Number(isoYearWeek.substring(0, 4))
  const week = Number(isoYearWeek.substring(4, 6))

  if (week < 1 || week > 53) return ''

  // Get the date of 4 January in that year
  const jan4 = Date.UTC(year, 0, 4)

  // Get weekday of Jan 4 (Sunday = 0, so we make Sunday = 7)
  const weekday = new Date(jan4).getUTCDay() || 7

  // Monday of ISO week 1
  const mondayOfWeek1 = Date.UTC(year, 0, 4 - (weekday - 1))

  // Monday of the requested week
  const mondayOfRequestedWeek = mondayOfWeek1 + (week - 1) * 7 * 24 * 60 * 60 * 1000

  // Format as YYYY-MM-DD
  const date = new Date(mondayOfRequestedWeek)
  const y = date.getUTCFullYear()
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const d = date.getUTCDate().toString().padStart(2, '0')

  return `${y}-${m}-${d}`
}
