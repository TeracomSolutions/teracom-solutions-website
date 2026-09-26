'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

import AdminAssistantAvatar from './AdminAssistantAvatar';
import { nextState, pickVoice, speakableText } from '@/lib/assistantVoice';

// Chat with the console. Each turn sends the whole conversation (the
// backend keeps no session), shows the reply, and lists any actions the
// assistant took so nothing happens silently. Voice is the browser's own
// Web Speech API (Chrome and Edge): the mic button dictates into the box
// and, by default, sends when you stop talking; Read replies aloud speaks
// each answer. Nothing spoken leaves the browser except as the text sent.
const SUGGESTIONS = [
  'Which suppliers have never had a price list imported?',
  'Set the Gold tier to 15% off RRP.',
  'Create a weekly Scout task: what are competitors charging for Hikvision 8MP turret cameras in Australia?',
  'Watch https://www.example.com/support/downloads for data sheets and installer manuals, weekly.',
  'Show me the new leads and summarise what each one wants.',
  'How did the website do in the last 7 days compared with the week before?',
];

const STATE_LABEL = { idle: 'Ready', listening: 'Listening…', thinking: 'Thinking…', speaking: 'Speaking…' };

function recognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function synth() {
  return typeof window !== 'undefined' ? window.speechSynthesis : undefined;
}

export default function AdminAssistantChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [avatarState, setAvatarState] = useState('idle');
  const [listening, setListening] = useState(false);
  const [autoSend, setAutoSend] = useState(true);
  const [readAloud, setReadAloud] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [synthSupported, setSynthSupported] = useState(false);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  // The recogniser's callbacks outlive a render, so they read the latest
  // send() and settings through refs rather than stale closures.
  const sendRef = useRef(null);
  const autoSendRef = useRef(autoSend);
  const readAloudRef = useRef(readAloud);

  useEffect(() => {
    setSpeechSupported(Boolean(recognitionClass()));
    setSynthSupported(Boolean(synth()));
    return () => {
      recognitionRef.current?.stop();
      synth()?.cancel();
    };
  }, []);

  useEffect(() => {
    autoSendRef.current = autoSend;
  }, [autoSend]);

  useEffect(() => {
    readAloudRef.current = readAloud;
    if (!readAloud) {
      synth()?.cancel();
      setAvatarState((current) => (current === 'speaking' ? 'idle' : current));
    }
  }, [readAloud]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  function dispatch(event) {
    setAvatarState((current) => nextState(current, event));
  }

  function speak(reply) {
    const speech = synth();
    if (!speech) return;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(speakableText(reply));
    const voice = pickVoice(speech.getVoices());
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.onstart = () => setAvatarState('speaking');
    utterance.onend = () => dispatch('speak_end');
    utterance.onerror = () => dispatch('error');
    speech.speak(utterance);
  }

  async function send(text) {
    const content = (text ?? draft).trim();
    if (!content || busy) return;
    synth()?.cancel();
    const history = [...messages, { role: 'user', content }];
    setMessages(history);
    setDraft('');
    setBusy(true);
    setError('');
    dispatch('send');
    try {
      const response = await fetch('/api/admin/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-24).map(({ role, content: c }) => ({ role, content: c })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The assistant did not answer.');
      setMessages([...history, { role: 'assistant', content: data.reply, actions: data.actions || [], model: data.model }]);
      const wantSpeech = readAloudRef.current && Boolean(data.reply);
      dispatch({ type: 'reply', speak: wantSpeech });
      if (wantSpeech) speak(data.reply);
    } catch (err) {
      setError(err.message);
      setMessages(history);
      dispatch('error');
    } finally {
      setBusy(false);
    }
  }
  sendRef.current = send;

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = recognitionClass();
    if (!Recognition) return;
    synth()?.cancel();
    const recognition = new Recognition();
    recognition.lang = 'en-AU';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    let finalText = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += piece;
        else interim += piece;
      }
      setDraft(`${finalText}${interim}`.trim());
    };
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Voice input stopped: ${event.error}.`);
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      dispatch('listen_end');
      const spoken = finalText.trim();
      if (spoken && autoSendRef.current) sendRef.current?.(spoken);
    };
    recognitionRef.current = recognition;
    setError('');
    setListening(true);
    dispatch('listen_start');
    recognition.start();
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function reset() {
    synth()?.cancel();
    recognitionRef.current?.stop();
    setMessages([]);
    setError('');
    setAvatarState('idle');
  }

  return (
    <div className="admin-assistant">
      <div className="admin-assistant-log" aria-live="polite">
        <div className="admin-assistant-head">
          <AdminAssistantAvatar state={avatarState} size={44} />
          <div>
            <strong>Teracom assistant</strong>
            <span className="admin-muted"> · {STATE_LABEL[avatarState] || 'Ready'}</span>
          </div>
        </div>
        {messages.length === 0 && (
          <div className="admin-assistant-empty">
            <p className="admin-muted">Ask about, or ask for changes to, suppliers and price lists, the catalogue and price tiers, Scout research, watched websites, leads and visitor numbers. Try one of these, or press the microphone and just say it:</p>
            <div className="admin-actions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="btn btn-secondary btn-sm" onClick={() => send(s)} disabled={busy}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`admin-assistant-msg ${m.role}`}>
            {m.role === 'assistant' && <AdminAssistantAvatar state="idle" size={26} />}
            <div className="admin-assistant-bubble">
              {m.content.split('\n').map((line, j) => <p key={j}>{line || ' '}</p>)}
              {m.actions && m.actions.length > 0 && (
                <ul className="admin-assistant-actions">
                  {m.actions.map((a, j) => <li key={j}>✓ {a}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="admin-assistant-msg assistant">
            <AdminAssistantAvatar state="thinking" size={26} />
            <div className="admin-assistant-bubble admin-muted">Working…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="admin-assistant-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={listening ? 'Listening… speak now.' : 'Tell the console what to do… (Enter to send, Shift+Enter for a new line)'}
          disabled={busy}
        />
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !draft.trim()}>{busy ? 'Working…' : 'Send'}</button>
          <button
            type="button"
            className="btn btn-secondary btn-sm admin-assistant-mic"
            onClick={toggleListening}
            disabled={busy || !speechSupported}
            aria-pressed={listening}
            title={speechSupported ? (listening ? 'Stop listening' : 'Speak instead of typing') : 'Voice input needs Chrome or Edge'}
          >
            {listening ? <MicOff size={15} strokeWidth={2} aria-hidden="true" /> : <Mic size={15} strokeWidth={2} aria-hidden="true" />}
            {' '}{listening ? 'Stop' : 'Speak'}
          </button>
          {messages.length > 0 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={reset} disabled={busy}>New conversation</button>
          )}
        </div>
        <div className="admin-assistant-voice">
          <label>
            <input type="checkbox" checked={autoSend} onChange={(e) => setAutoSend(e.target.checked)} disabled={!speechSupported} />
            Send when I stop talking
          </label>
          <label>
            <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} disabled={!synthSupported} />
            {readAloud ? <Volume2 size={14} strokeWidth={2} aria-hidden="true" /> : <VolumeX size={14} strokeWidth={2} aria-hidden="true" />}
            {' '}Read replies aloud
          </label>
          {!speechSupported && <span>Voice input needs Chrome or Edge.</span>}
        </div>
      </form>
    </div>
  );
}
