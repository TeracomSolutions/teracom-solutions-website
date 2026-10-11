import { NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/adminApi'
import { getAllProducts } from '@/lib/catalogue'
import { summarise, listProducts, FEED_CODES } from '@/lib/shoppingFeed'

/**
 * Returns shopping feed insights for products.
 */
export const GET = withAdminSession(async ({ req }) => {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const code = FEED_CODES.hasOwnProperty(searchParams.get('code')) ? searchParams.get('code') : ''
  const q = (searchParams.get('q') || '').trim().substring(0, 100)
  const skip = Math.max(0, Number.parseInt(searchParams.get('skip') || '0', 10))

  const products = await getAllProducts()
  const summary = summarise(products)
  const matches = listProducts(products, code, q)

  const codes = Object.entries(FEED_CODES).map(([code, { severity, label, help }]) => ({
    code,
    severity,
    label,
    help,
    count: summary.counts[code]
  }))

  return NextResponse.json({
    summary: {
      ...summary,
      codes
    },
    total: matches.length,
    products: matches.slice(skip, skip + 100)
  })
})