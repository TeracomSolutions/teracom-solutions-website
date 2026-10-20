import { NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/adminApi'
import { fetchActivityPeople } from '@/lib/api/adminActivity'

// The people who appear in the audit log, for the Who filter.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchActivityPeople(token)))
