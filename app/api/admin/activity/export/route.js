import { NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/adminApi'
import { BACKEND_API_URL } from '@/lib/config'

const DAY = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
const KIND = /^[a-z0-9_]{1,100}$/

// Only these filters are forwarded, so this is not an open proxy to the backend.
export const GET = withAdminSession(async ({ req, token }) => {
  const incoming = new URL(req.url).searchParams
  const forward = new URLSearchParams()
  const q = (incoming.get('q') || '').trim().slice(0, 100)
  if (q) forward.set('q', q)
  const kind = incoming.get('event_type') || ''
  if (KIND.test(kind)) forward.set('event_type', kind)
  const since = incoming.get('since') || ''
  if (DAY.test(since)) forward.set('since', since)
  const until = incoming.get('until') || ''
  if (DAY.test(until)) forward.set('until', until)
  const query = forward.toString()
  const url = BACKEND_API_URL.replace(/[/]$/, '') + '/staff/activity/export' + (query ? '?' + query : '')
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store' })
  if (!response.ok) {
    return NextResponse.json({ error: 'That export could not be produced.' }, { status: response.status || 502 })
  }
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': response.headers.get('content-disposition') || 'attachment; filename="audit-log.csv"',
      'Cache-Control': 'no-store',
    },
  })
})
