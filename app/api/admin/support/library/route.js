import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { rebuildSupportLibrary } from '@/lib/api/support';

// Starts a rebuild of Ask Tera's library on the backend.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await rebuildSupportLibrary(token)));