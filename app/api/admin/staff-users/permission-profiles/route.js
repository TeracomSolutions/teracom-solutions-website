import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createPermissionProfile, listPermissionProfiles } from '@/lib/api/adminStaffUsers';

const Level = z.enum(['none', 'read', 'write']);
const PermissionSet = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  permissions: z.record(z.string().regex(/^[a-z_]+([.][a-z_]+)?$/).max(60), Level),
});

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await listPermissionProfiles(token)));

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = PermissionSet.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The permission set was not understood.' }, { status: 400 });
  return NextResponse.json(await createPermissionProfile(token, parsed.data), { status: 201 });
});
