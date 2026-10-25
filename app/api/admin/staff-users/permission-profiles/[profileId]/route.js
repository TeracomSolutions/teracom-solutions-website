import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deletePermissionProfile, updatePermissionProfile } from '@/lib/api/adminStaffUsers';

const Level = z.enum(['none', 'read', 'write']);
const PermissionSet = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  permissions: z.record(z.string().regex(/^[a-z_]+([.][a-z_]+)?$/).max(60), Level),
});
const Id = z.string().uuid();

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = PermissionSet.safeParse(await req.json().catch(() => null));
  if (!Id.safeParse(params.profileId).success || !parsed.success) return NextResponse.json({ error: 'The permission set was not understood.' }, { status: 400 });
  return NextResponse.json(await updatePermissionProfile(token, params.profileId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  if (!Id.safeParse(params.profileId).success) return NextResponse.json({ error: 'Unknown permission set.' }, { status: 400 });
  return NextResponse.json(await deletePermissionProfile(token, params.profileId));
});
