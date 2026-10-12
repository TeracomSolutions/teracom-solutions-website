/*
 * Helper functions for the merchant view
 */

/**
 * countCards(counts): the four tiles for the top of the section, as a list of { key, label, value, tone }
 * in this order: { key: 'approved', label: 'Approved by Google', tone: 'good' },
 * { key: 'pending', label: 'Waiting for Google', tone: 'wait' },
 * { key: 'disapproved', label: 'Not approved', tone: 'bad' },
 * { key: 'needs_action', label: 'We need to fix', tone: 'bad' }.
 * Each value is Number(counts[key]) || 0. A missing or non-object counts gives zeros.
 */
export function countCards(counts) {
  if (!counts || typeof counts !== 'object') {
    counts = {}
  }

  return [
    { key: 'approved', label: 'Approved by Google', tone: 'good' },
    { key: 'pending', label: 'Waiting for Google', tone: 'wait' },
    { key: 'disapproved', label: 'Not approved', tone: 'bad' },
    { key: 'needs_action', label: 'We need to fix', tone: 'bad' }
  ].map(({ key, label, tone }) => ({
    key,
    label,
    value: Number(counts[key]) || 0,
    tone
  }))
}

/**
 * resolutionText(resolution): 'merchant_action' gives 'We need to fix this';
 * 'pending_processing' gives 'Google is still checking'; anything else gives
 * 'Google looks after this'. Compare after lower-casing text; a non-string gives the last text.
 */
export function resolutionText(resolution) {
  if (typeof resolution !== 'string') {
    return 'Google looks after this'
  }

  const lowerResolution = resolution.toLowerCase()

  if (lowerResolution === 'merchant_action') {
    return 'We need to fix this'
  }

  if (lowerResolution === 'pending_processing') {
    return 'Google is still checking'
  }

  return 'Google looks after this'
}

/**
 * severityText(severity): 'disapproved' gives 'Keeps the product off Google';
 * 'demoted' gives 'Shown lower down'; 'not_impacted' gives 'No effect on showing';
 * anything else gives 'Notice'. Lower-case first; a non-string gives 'Notice'.
 */
export function severityText(severity) {
  if (typeof severity !== 'string') {
    return 'Notice'
  }

  const lowerSeverity = severity.toLowerCase()

  if (lowerSeverity === 'disapproved') {
    return 'Keeps the product off Google'
  }

  if (lowerSeverity === 'demoted') {
    return 'Shown lower down'
  }

  if (lowerSeverity === 'not_impacted') {
    return 'No effect on showing'
  }

  return 'Notice'
}

/**
 * issueLine(issue): the sentence for one reason Google gives: the number of products,
 * then the word product or products (product when the number is exactly 1), then a colon,
 * a space and the issue's title, for example '8 products: Missing attribute: [availability]'.
 * A missing products count counts as 0 (giving '0 products: ...'); a missing title gives 'Unknown reason';
 * a missing issue gives ''.
 */
export function issueLine(issue) {
  if (!issue || typeof issue !== 'object') {
    return ''
  }

  const count = Number(issue.products) || 0
  const productsWord = count === 1 ? 'product' : 'products'
  const title = issue.title || 'Unknown reason'

  return `${count} ${productsWord}: ${title}`
}

/**
 * sourceLine(source): the sentence for one feed source: the name (or 'Feed' when it is missing),
 * then ' - ', then the kind text, then ' - ', then 'on' when source.on is true and 'off' otherwise.
 * The kind text is 'fetched from the website' when kind is 'file' and daily is true,
 * 'file fetched by Google' when kind is 'file' and daily is not true,
 * 'automatic from the website' when kind is 'autofeed', and 'other' for anything else.
 * A missing source gives ''.
 */
export function sourceLine(source) {
  if (!source || typeof source !== 'object') {
    return ''
  }

  const name = source.name || 'Feed'

  let kindText = 'other'
  if (source.kind === 'file' && source.daily) {
    kindText = 'fetched from the website'
  } else if (source.kind === 'file') {
    kindText = 'file fetched by Google'
  } else if (source.kind === 'autofeed') {
    kindText = 'automatic from the website'
  }

  const onText = source.on ? 'on' : 'off'

  return `${name} - ${kindText} - ${onText}`
}

/**
 * problemLine(problem): the sentence for one product we need to fix: the offer_id,
 * then ' - ', then the title (or 'No title' when it is empty), then ' - ',
 * then the titles of its issues joined with '; ' (or 'No reason given' when it has none).
 * A missing problem gives ''.
 */
export function problemLine(problem) {
  if (!problem || typeof problem !== 'object') {
    return ''
  }

  const offerId = problem.offer_id || ''
  const title = problem.title || 'No title'

  let issuesText = 'No reason given'
  if (Array.isArray(problem.issues) && problem.issues.length > 0) {
    issuesText = problem.issues.map(issue => issue.title || '').join('; ')
  }

  return `${offerId} - ${title} - ${issuesText}`
}