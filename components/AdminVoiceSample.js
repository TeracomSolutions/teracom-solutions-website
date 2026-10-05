'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';

import { pickVoice } from '@/lib/assistantVoice';
import { normaliseVoiceConfig } from '@/lib/voiceConfig';
import { speakReply } from '@/lib/voicePlayer';

// "Hear it" on the Voice card of the Connections page: speaks a sample the
// way Tera will, with the voice settings as saved, and says which voice
// answered (Robert, 2026-10-06). The browser voice is named, so a wish for a
// different one can be put in the "Browser voice to prefer" box.
const SAMPLE = "G'day, I'm Tera. This is how I sound.";

function describe(config, voice, fellBack) {
  if (config.engine === 'cloud' && !fellBack) return `Speaking with the Azure voice ${voice.voice}.`;
  const speech = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  const chosen = speech ? pickVoice(speech.getVoices(), config.browserVoice) : undefined;
  const name = chosen ? `${chosen.name} (${chosen.lang})` : 'the default voice';
  const lead = fellBack ? 'The Azure voice did not answer, so this is the browser voice: ' : 'Speaking with the browser voice: ';
  return `${lead}${name}.`;
}

export default function AdminVoiceSample({ voice }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function hear() {
    const config = normaliseVoiceConfig({
      engine: voice.cloud ? 'cloud' : 'browser',
      rate: voice.rate,
      browserVoice: voice.browser_voice,
    });
    let fellBack = false;
    setBusy(true);
    setMessage('');
    await speakReply(SAMPLE, config, {
      onStart: () => setMessage(describe(config, voice, fellBack)),
      onEnd: () => setBusy(false),
      onError: () => {
        setBusy(false);
        setMessage('Nothing could speak here. Voices need Chrome or Edge.');
      },
      onFallback: () => {
        fellBack = true;
      },
    });
  }

  return (
    <div className="admin-actions">
      <button type="button" className="btn btn-secondary btn-sm" onClick={hear} disabled={busy}>
        <Volume2 size={15} strokeWidth={2} aria-hidden="true" />
        {' '}{busy ? 'Speaking…' : 'Hear it'}
      </button>
      {voice.engine === 'azure' ? (
        <span className="connection-checked">{voice.used.toLocaleString('en-AU')} of {voice.cap.toLocaleString('en-AU')} characters spoken this month.</span>
      ) : null}
      {message ? <span className="admin-muted" role="status">{message}</span> : null}
    </div>
  );
}
