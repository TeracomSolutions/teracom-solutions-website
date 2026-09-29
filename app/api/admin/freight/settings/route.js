import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { getFreightSettings, saveFreightSettings } from '@/lib/api/adminFreight';

// Only these go to the backend; it checks every value again.
const FIELDS = [
  'min_fee_cents', 'included_kg', 'per_kg_cents', 'cubic_kg_per_m3',
  'default_weight_kg', 'default_length_cm', 'default_width_cm', 'default_height_cm',
  'origin_postcode', 'own_rate_enabled', 'own_rate_label',
  'auspost_enabled', 'auspost_services', 'auspost_key', 'clear_auspost_key',
  'startrack_enabled', 'startrack_products', 'startrack_api_key', 'startrack_password',
  'startrack_account_number', 'clear_startrack',
];

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await getFreightSettings(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = (await req.json().catch(() => null)) || {};
  const picked = Object.fromEntries(FIELDS.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
  return NextResponse.json(await saveFreightSettings(token, picked));
});