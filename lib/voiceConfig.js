// The voice settings a browser is given (GET /api/voice/config): which engine
// speaks Tera's and the assistant's replies, how fast, and which browser voice
// to prefer (Robert, 2026-10-06). Whatever arrives is reduced to safe values,
// so a bad answer just means the browser's own voice.

export const DEFAULT_VOICE_CONFIG = { engine: 'browser', rate: 1, browserVoice: '' };

export const MIN_RATE = 0.5;
export const MAX_RATE = 1.5;

export function normaliseVoiceConfig(raw) {
  const rate = raw && raw.rate != null ? Number(raw.rate) : Number.NaN;
  return {
    engine: raw && raw.engine === 'cloud' ? 'cloud' : 'browser',
    rate: Number.isFinite(rate) ? Math.min(MAX_RATE, Math.max(MIN_RATE, rate)) : 1,
    browserVoice: raw && typeof raw.browserVoice === 'string' ? raw.browserVoice.trim().slice(0, 80) : '',
  };
}