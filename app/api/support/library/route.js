import { NextResponse } from 'next/server';

import { SITE_ORIGIN } from '@/lib/seo';
import { supportLibraryItems } from '@/lib/supportLibrary';

// Public: the help centre, calculators and services as plain text, for
// Ask Tera's library on the backend. All of it is already on the site.
export async function GET() {
  return NextResponse.json({ items: supportLibraryItems(SITE_ORIGIN) });
}