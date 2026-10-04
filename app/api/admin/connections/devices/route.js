import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { addDevice } from '@/lib/api/adminConnections';

const DeviceRequest = z.object({
  name: z.string().trim().min(1).max(120),
  kind: z.enum(['server', 'workstation', 'network', 'other']),
  every_minutes: z.coerce.number().int().refine((n) => [5, 10, 15, 30, 60].includes(n)),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = DeviceRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Give the device a name and pick how often it checks in.' }, { status: 400 });
  }
  return NextResponse.json(await addDevice(token, parsed.data));
});
