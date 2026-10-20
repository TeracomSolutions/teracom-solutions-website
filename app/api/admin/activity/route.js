import { NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/adminApi'
import { fetchActivity } from '@/lib/api/adminActivity'

// The audit trail, newest first.
// ?limit= (1 to 200), ?before= (an ISO time, for paging), ?event_type= and ?q= narrow it.
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

  // event_type = the text of 'event_type' kept only when it is at most 100 characters
  // and made only of lower-case letters, digits and underscores (check each character;
  // otherwise empty text)
  let event_type = ''
  const eventTypeParam = params.get('event_type')
  if (eventTypeParam) {
    if (eventTypeParam.length <= 100) {
      let valid = true
      for (let i = 0; i < eventTypeParam.length; i++) {
        const char = eventTypeParam[i]
        if (!(char >= 'a' && char <= 'z') && !(char >= '0' && char <= '9') && char !== '_') {
          valid = false
          break
        }
      }
      if (valid) {
        event_type = eventTypeParam
      }
    }
  }

  // q = the text of 'q' trimmed and cut to 100 characters
  let q = ''
  const qParam = params.get('q')
  if (qParam) {
    q = qParam.trim().substring(0, 100)
  }

  // since and until = a day written YYYY-MM-DD (empty text when missing or not in that form)
  const dayPattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
  const sinceParam = params.get('since') || ''
  const untilParam = params.get('until') || ''
  const since = dayPattern.test(sinceParam) ? sinceParam : ''
  const until = dayPattern.test(untilParam) ? untilParam : ''

  return NextResponse.json(await fetchActivity(token, { limit, offset, before, event_type, q, since, until }))
})
