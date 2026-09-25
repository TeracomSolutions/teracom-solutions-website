import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { deleteAiConnection, upsertAiConnection } from '@/lib/api/adminAiConnections';

const PROVIDERS = ['ollama', 'anthropic', 'openai', 'groq'];

// Each field optional; only the ones present change. The key is passed
// straight through to the backend, which encrypts it -- it is never logged
// or stored here.
const UpdateRequest = z
  .object({
    api_key: z.string().trim().min(1).max(500).optional(),
    base_url: z.string().trim().url().max(500).optional(),
    default_model: z.string().trim().min(1).max(200).optional(),
    enabled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PUT = withAdminSession(async ({ req, token, params }) => {
  if (!PROVIDERS.includes(params.provider)) {
    return NextResponse.json({ error: 'Unknown provider.' }, { status: 400 });
  }

  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the key, host or model and try again.' }, { status: 400 });
  }

  return NextResponse.json(await upsertAiConnection(token, params.provider, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  if (!PROVIDERS.includes(params.provider)) {
    return NextResponse.json({ error: 'Unknown provider.' }, { status: 400 });
  }
  return NextResponse.json(await deleteAiConnection(token, params.provider));
});
