import { NextResponse } from 'next/server';

import { fetchVoiceConfig } from '@/lib/api/voice';
import { DEFAULT_VOICE_CONFIG, normaliseVoiceConfig } from '@/lib/voiceConfig';

export const dynamic = 'force-dynamic';

// Which voice visitors should hear Tera in (Robert, 2026-10-06). It never
// fails: when the backend cannot be reached the browser's own voice is used.
export async function GET() {
  let config = DEFAULT_VOICE_CONFIG;
  try {
    config = normaliseVoiceConfig(await fetchVoiceConfig());
  } catch {
    // The browser's own voice.
  }
  return NextResponse.json(config, { headers: { 'Cache-Control': 'public, max-age=60' } });
}