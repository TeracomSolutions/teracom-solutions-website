import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { updateGrowthTool } from '@/lib/api/adminGrowth';

// Switches a growth tool on or off and saves its settings.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const payload = {};
  if (typeof body.enabled === 'boolean') payload.enabled = body.enabled;
  if (body.values && typeof body.values === 'object' && !Array.isArray(body.values)) payload.values = body.values;
  return NextResponse.json(await updateGrowthTool(token, params.key, payload));
});
