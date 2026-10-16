import { NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/adminApi'
import { fetchSystemEvents } from '@/lib/api/adminActivity'

// What the system itself did, newest first.
// ?limit= (1 to 200), ?before= (an ISO time, for paging), ?kind= and ?q= narrow it.
export const GET = withAdminSession(async ({ req, token }) => {
  const url = new URL(req.url)
  const params = url.searchParams

  // limit = a whole number kept between 1 and 200 (default 50)
  let limit = 50
  const limitParam = params.get('limit')
  if (limitParam) {
    const parsed = parseInt(limitParam, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 200) {
      limit = parsed
    }
  }

  // offset = how many rows to skip, for the numbered pages (0 to 1,000,000)
  let offset = 0
  const offsetParam = params.get('offset')
  if (offsetParam) {
    const parsedOffset = parseInt(offsetParam, 10)
    if (!isNaN(parsedOffset) && parsedOffset >= 0 && parsedOffset <= 1000000) {
      offset = parsedOffset
    }
  }

  // before = the text of 'before' cut to 40 characters (empty text when missing)
  let before = ''
  const beforeParam = params.get('before')
  if (beforeParam) {
    before = beforeParam.substring(0, 40)
  }

  // kind = the text of 'kind' kept only when it is at most 100 characters
  // and made only of lower-case letters, digits and underscores (check each character;
  // otherwise empty text)
  let kind = ''
  const kindParam = params.get('kind')
  if (kindParam) {
    if (kindParam.length <= 100) {
      let valid = true
      for (let i = 0; i < kindParam.length; i++) {
        const char = kindParam[i]
        if (!(char >= 'a' && char <= 'z') && !(char >= '0' && char <= '9') && char !== '_') {
          valid = false
          break
        }
      }
      if (valid) {
        kind = kindParam
      }
    }
  }

  // q = the text of 'q' trimmed and cut to 100 characters
  let q = ''
  const qParam = params.get('q')
  if (qParam) {
    q = qParam.trim().substring(0, 100)
  }

  return NextResponse.json(await fetchSystemEvents(token, { limit, offset, before, kind, q }))
})
