/*
 * Sales view helpers
 */

export const PRESETS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'this_month', label: 'This month' },
  { key: 'last_month', label: 'Last month' },
  { key: 'this_year', label: 'This year so far' },
  { key: 'custom', label: 'Choose dates' }
];

export const COMPARISONS = [
  { key: 'previous', label: 'Compared with the period before' },
  { key: 'last_year', label: 'Compared with the same dates last year' },
  { key: 'none', label: 'No comparison' }
];

/**
 * Format cents as dollars (en-AU, two decimals), '—' for null, undefined or NaN
 */
export function dollars(cents) {
  if (cents === null || cents === undefined || isNaN(cents)) {
    return '—';
  }
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
}

/**
 * Format percent change, '—' for null or undefined; '+12.5%' for a positive number, '-3.0%' for a negative one, '0.0%' for zero (one decimal, a plain hyphen for minus)
 */
export function percentChange(pct) {
  if (pct === null || pct === undefined) {
    return '—';
  }
  const formatted = pct.toFixed(1);
  if (pct > 0) {
    return `+${formatted}%`;
  } else if (pct < 0) {
    return `${formatted}%`;
  } else {
    return '0.0%';
  }
}

/**
 * Determine tone for change, 'muted' for null or undefined or 0; otherwise 'good' when the change is in the good direction and 'bad' when not
 */
export function changeTone(pct, higherIsBetter = true) {
  if (pct === null || pct === undefined || pct === 0) {
    return 'muted';
  }
  if ((higherIsBetter && pct > 0) || (!higherIsBetter && pct < 0)) {
    return 'good';
  } else {
    return 'bad';
  }
}

/**
 * Generate KPI cards data from summary
 */
export function kpiCards(summary) {
  if (!summary || !summary.kpis) {
    return [];
  }

  const kpis = summary.kpis;
  const change = summary.change || {};

  const cards = [
    { key: 'orders', label: 'Orders', value: kpis.orders, change: percentChange(change.orders), tone: changeTone(change.orders) },
    { key: 'revenue_inc_cents', label: 'Sales (inc GST)', value: dollars(kpis.revenue_inc_cents), change: percentChange(change.revenue_inc_cents), tone: changeTone(change.revenue_inc_cents) },
    { key: 'revenue_ex_cents', label: 'Sales (ex GST)', value: dollars(kpis.revenue_ex_cents), change: percentChange(change.revenue_ex_cents), tone: changeTone(change.revenue_ex_cents) },
    { key: 'aov_cents', label: 'Average order', value: dollars(kpis.aov_cents), change: percentChange(change.aov_cents), tone: changeTone(change.aov_cents) },
    { key: 'units', label: 'Items sold', value: kpis.units, change: percentChange(change.units), tone: changeTone(change.units) },
    { key: 'margin_cents', label: 'Margin (ex GST)', value: dollars(kpis.margin_cents), change: percentChange(change.margin_cents), tone: changeTone(change.margin_cents), note: kpis.margin_percent !== null ? `${kpis.margin_percent}% of sales ex GST, after discounts` : 'Not enough cost data' },
    { key: 'discount_cents', label: 'Discounts given', value: dollars(kpis.discount_cents), change: percentChange(change.discount_cents), tone: changeTone(change.discount_cents, true) },
    { key: 'freight_cents', label: 'Freight charged', value: dollars(kpis.freight_cents), change: percentChange(change.freight_cents), tone: changeTone(change.freight_cents) },
    { key: 'new_customer_orders', label: 'Orders from new customers', value: kpis.new_customer_orders, change: percentChange(change.new_customer_orders), tone: changeTone(change.new_customer_orders) },
    { key: 'returning_customer_orders', label: 'Orders from returning customers', value: kpis.returning_customer_orders, change: percentChange(change.returning_customer_orders), tone: changeTone(change.returning_customer_orders) }
  ];

  // Add note about lines without cost
  if (kpis.lines_without_cost > 0 && cards[5].note !== 'Not enough cost data') {
    cards[5].note += ` (${kpis.lines_without_cost} lines have no cost)`;
  }

  return cards;
}

/**
 * Convert series to format for bars chart
 */
export function seriesForBars(series, field) {
  return series.map(item => ({
    date: item.bucket,
    value: field === 'revenue_inc_cents' ? Math.round(item[field] / 100) : item[field]
  }));
}

/**
 * Escape CSV cell value
 */
export function csvEscape(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes(String.fromCharCode(10))) {
    // Double all quotes and wrap in quotes
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Generate CSV from headers and rows
 */
export function toCsv(headers, rows) {
  const escapedHeaders = headers.map(csvEscape).join(',');
  const escapedRows = rows.map(row => row.map(csvEscape).join(','));
  return [escapedHeaders, ...escapedRows].join(String.fromCharCode(13) + String.fromCharCode(10));
}

/**
 * Generate query string for summary API
 */
export function summaryQuery(filters) {
  const params = new URLSearchParams();

  if (filters.range) params.append('range', filters.range);
  if (filters.range === 'custom' && filters.start) params.append('start', filters.start);
  if (filters.range === 'custom' && filters.end) params.append('end', filters.end);
  if (filters.compare) params.append('compare', filters.compare);

  const queryString = params.toString();
  return queryString ? '?' + queryString : '';
}
