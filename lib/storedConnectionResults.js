// This module handles merging stored connection results with current entries
// to show the last checked status of Stripe and Cloudflare Turnstile
// connections on the admin console page.

export const STORED_RESULT_MAX_AGE_MS = 24 * 60 * 60 * 1000

export const STORED_KEYS = ['stripe', 'turnstile']

export function mergeStoredResults (entries, stored, now = new Date()) {
  if (!Array.isArray(entries)) {
    throw new TypeError('entries must be an array')
  }

  if (stored && typeof stored !== 'object') {
    throw new TypeError('stored must be an object or null/undefined')
  }

  return entries.map(entry => {
    if (!entry || typeof entry !== 'object') {
      return entry
    }

    const { key, status, can_test, checked_at } = entry

    // Only process entries with keys in STORED_KEYS
    if (!STORED_KEYS.includes(key)) {
      return entry
    }

    // Only update entries that are testable and not not_set_up
    if (!can_test || status === 'not_set_up') {
      return entry
    }

    // Get the stored result for this key
    const storedResult = stored?.[key]

    // Check if stored result exists and is valid
    if (!storedResult || typeof storedResult !== 'object') {
      return entry
    }

    const { status: storedStatus, detail: storedDetail, checked_at: storedCheckedAt } = storedResult

    // Validate stored status
    const validStatuses = ['connected', 'attention', 'failing', 'not_set_up', 'unknown']
    if (!validStatuses.includes(storedStatus)) {
      return entry
    }

    // Parse and validate checked_at date
    const parsedCheckedAt = new Date(storedCheckedAt)
    if (isNaN(parsedCheckedAt.getTime())) {
      return entry
    }

    // Check that checked_at is not more than 5 minutes after now
    const fiveMinutesMs = 5 * 60 * 1000
    if (parsedCheckedAt > now.getTime() + fiveMinutesMs) {
      return entry
    }

    // Check that checked_at is not more than STORED_RESULT_MAX_AGE_MS before now
    const maxAgeCheck = now.getTime() - STORED_RESULT_MAX_AGE_MS
    if (parsedCheckedAt < maxAgeCheck) {
      return entry
    }

    // Create new entry with stored values
    const newEntry = { ...entry }

    // Use stored status and checked_at
    newEntry.status = storedStatus
    newEntry.checked_at = storedCheckedAt

    // Use stored detail only if it's a non-empty string
    if (typeof storedDetail === 'string' && storedDetail.trim() !== '') {
      newEntry.detail = storedDetail
    }

    return newEntry
  })
}