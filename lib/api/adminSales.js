import { backendFetch } from './client.js'

export async function fetchSalesSummary(token, params = {}) {
  const searchParams = new URLSearchParams()
  if (params.range) searchParams.append('range', params.range)
  if (params.start) searchParams.append('start', params.start)
  if (params.end) searchParams.append('end', params.end)
  if (params.compare) searchParams.append('compare', params.compare)
  if (params.bucket) searchParams.append('bucket', params.bucket)

  return backendFetch('/staff/sales/summary', { token, searchParams })
}

export async function fetchSalesOrders(token, params = {}) {
  const searchParams = new URLSearchParams()
  if (params.range) searchParams.append('range', params.range)
  if (params.start) searchParams.append('start', params.start)
  if (params.end) searchParams.append('end', params.end)
  if (params.q) searchParams.append('q', params.q)
  if (params.skip) searchParams.append('skip', params.skip)
  if (params.limit) searchParams.append('limit', params.limit)

  return backendFetch('/staff/sales/orders', { token, searchParams })
}
