// Server-only. Tera's voice from the backend (api/voice.py): which voice
// visitors should use, and a reply turned into audio. The audio call carries
// the service token, because the website has already checked that someone
// is signed in.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/voice.js must only be used on the server.');
}

import { BACKEND_API_URL } from '../config.js';
import { ApiError, backendFetch } from './client.js';

export async function fetchVoiceConfig() {
  return backendFetch('/voice/config');
}

// The MP3 audio for text, as a Buffer. ApiError when the cloud voice is off,
// over its monthly limit or failing, so the caller can use the browser's voice.
export async function speakText(text) {
  let response;
  try {
    response = await fetch(`${BACKEND_API_URL}/internal/voice/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
        'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '',
      },
      body: JSON.stringify({ text }),
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('Unable to reach the voice service.', 0, {});
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError((data && (data.detail || data.error)) || 'The voice service did not answer.', response.status, { body: data });
  }
  return Buffer.from(await response.arrayBuffer());
}