'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, MicOff, Square, Volume2, VolumeX } from 'lucide-react';

import AdminAssistantAvatar from './AdminAssistantAvatar';
import { nextState } from '@/lib/assistantVoice';
import { LISTEN_DELAY_MS, conversationNotice, conversationStep } from '@/lib/assistantConversation';
import { PAUSE_BEFORE_SEND_MS, endsDictation, joinSpeech } from '@/lib/dictation';
import { speakReply, speechControl } from '@/lib/voicePlayer';

// Chat with the console. Each turn sends the whole conversation (the
// backend keeps no session), shows the reply, and lists any actions the
// assistant took so nothing happens silently. Voice is the browser's own
// Web Speech API (Chrome and Edge): the mic button dictates into the box
// and, by default, sends after a few seconds of quiet (untick that to keep
// the microphone open until Done and send yourself); Read replies aloud
// speaks each answer. Hold a conversation turns both on and keeps going: it
// listens, sends when you pause, speaks the reply, then listens again, and
// stops only when you press End conversation or Stop (Robert, 2026-10-17).
// Stop cuts off the microphone, the spoken reply and an answer still being
// written, and puts your words back in the box. Nothing spoken leaves the
// browser except as the text sent.
const SUGGESTIONS = [
  'How does a supplier price list become a price in the store?',
  'Which suppliers have never had a price list imported?',
  'Set the Gold tier to 12% on cost.',
  'Create a weekly Scout task: what are competitors charging for Hikvision 8MP turret cameras in Australia?',
  'Show me the new leads and summarise what each one wants.',
  'How did the website do in the last 7 days compared with the week before?',
  'Write a master prompt to add a stock level column to the Store catalogue.',
  'Which AI model are you running on, and what do you remember?',
];

const STATE_LABEL = { idle: 'Ready', listening: 'Listening…', thinking: 'Thinking…', speaking: 'Speaking…' };

function recognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// Something to cancel speech with, or undefined where the browser cannot
// speak: it stops the cloud voice as well as the browser's own.
function synth() {
  return speechControl();
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
  const [copied, setCopied] = useState(null);
  const [conversation, setConversation] = useState(false);
  const [notice, setNotice] = useState('');
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  // The recogniser's callbacks outlive a render, so they read the latest
  // send() and settings through refs rather than stale closures.
  const sendRef = useRef(null);
  const autoSendRef = useRef(autoSend);
  const readAloudRef = useRef(readAloud);
  // Set when Stop (or New conversation) ends dictation, so a held-open
  // microphone does not start listening again.
  const stopRequestedRef = useRef(false);
  // Hold a conversation: whether it is on (callbacks outlive a render, so they
  // read it here), what Read replies aloud was set to before it began, and the
  // timer that reopens the microphone after a reply has been spoken.
  const conversationRef = useRef(false);
  const readAloudBeforeRef = useRef(false);
  const listenRef = useRef(null);
  const listenTimerRef = useRef(null);
  // The quiet after the last word that counts as a pause, and the request
  // to the assistant that Stop can call off.
  const pauseTimerRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setSpeechSupported(Boolean(recognitionClass()));
    setSynthSupported(Boolean(synth()));
    return () => {
      conversationRef.current = false;
      clearTimeout(listenTimerRef.current);
      clearTimeout(pauseTimerRef.current);
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      abortRef.current?.abort();
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
    speakReply(reply, null, {
      onStart: () => setAvatarState('speaking'),
      onEnd: () => {
        dispatch('speak_end');
        if (conversationRef.current) listenSoon();
      },
      onError: (event) => {
        dispatch('error');
        if (conversationRef.current && event?.error !== 'canceled' && event?.error !== 'interrupted') listenSoon();
      },
    });
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
    setNotice('');
    dispatch('send');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/admin/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-24).map(({ role, content: c }) => ({ role, content: c })),
          voice: conversationRef.current,
        }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The assistant did not answer.');
      setMessages([...history, { role: 'assistant', content: data.reply, actions: data.actions || [], model: data.model }]);
      const wantSpeech = readAloudRef.current && Boolean(data.reply);
      dispatch({ type: 'reply', speak: wantSpeech });
      if (wantSpeech) speak(data.reply);
      else if (conversationRef.current) listenSoon();
    } catch (err) {
      if (controller.signal.aborted) {
        // Stop was pressed: the words go back in the box to be corrected.
        setMessages(messages);
        setDraft(content);
        setNotice('Stopped. If a change was already under way it may still have gone through: check the Audit log under Activity.');
        dispatch('error');
        return;
      }
      setError(err.message);
      setMessages(history);
      dispatch('error');
      if (conversationRef.current) listenSoon();
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  }
  sendRef.current = send;
  listenRef.current = startListening;

  // Speak dictates into the box. With "Send when I stop talking" ticked,
  // the words are sent after a few seconds of quiet (PAUSE_BEFORE_SEND_MS), so
  // a breath or a think does not cut you off. Unticked, the microphone stays
  // open (Chrome ends a session after a long silence, so a new one starts
  // straight away) until Done is pressed, and the words wait in the box to be
  // read, changed and sent (Robert, 2026-10-04).
  function toggleListening() {
    if (listening) {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      return;
    }
    startListening();
  }

  function startListening() {
    const Recognition = recognitionClass();
    if (!Recognition || recognitionRef.current) return;
    synth()?.cancel();
    stopRequestedRef.current = false;
    const holdOpen = !autoSendRef.current && !conversationRef.current;
    const typed = conversationRef.current ? '' : draft;
    let finalText = '';

    const listen = () => {
      const recognition = new Recognition();
      recognition.lang = 'en-AU';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText = joinSpeech(finalText, piece);
          else interim += piece;
        }
        setDraft(joinSpeech(typed, finalText, interim));
        if (!holdOpen) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = setTimeout(() => recognition.stop(), PAUSE_BEFORE_SEND_MS);
        }
      };
      recognition.onerror = (event) => {
        if (endsDictation(event.error)) {
          stopRequestedRef.current = true;
          setError(`Voice input stopped: ${event.error}.`);
        }
      };
      recognition.onend = () => {
        clearTimeout(pauseTimerRef.current);
        if (holdOpen && !stopRequestedRef.current) {
          try {
            listen();
            return;
          } catch {
            // The browser would not start again; finish as if Done was pressed.
          }
        }
        recognitionRef.current = null;
        setListening(false);
        dispatch('listen_end');
        const spoken = joinSpeech(typed, finalText);
        if (conversationRef.current) {
          afterListening(spoken, Boolean(finalText));
          return;
        }
        setDraft(spoken);
        if (finalText && !holdOpen && autoSendRef.current) sendRef.current?.(spoken);
      };
      recognitionRef.current = recognition;
      recognition.start();
    };

    setError('');
    setListening(true);
    dispatch('listen_start');
    listen();
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  // A reply (a master prompt, say) goes to the clipboard in one click.
  function copyReply(text, index) {
    navigator.clipboard?.writeText(text)
      .then(() => {
        setCopied(index);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => setError('Copy did not work here. Select the text and copy it instead.'));
  }

  // Open the microphone again a moment after a reply has been spoken.
  function listenSoon() {
    clearTimeout(listenTimerRef.current);
    listenTimerRef.current = setTimeout(() => {
      if (conversationRef.current) listenRef.current?.();
    }, LISTEN_DELAY_MS);
  }

  // A listening round has ended in a conversation: send what was said, or
  // listen again. Only the person ends a conversation.
  function afterListening(spoken, heard) {
    if (stopRequestedRef.current) {
      endConversation('mic');
      return;
    }
    const step = conversationStep({ heard, spoken });
    if (step.action === 'send') sendRef.current?.(spoken);
    else listenSoon();
  }

  function startConversation() {
    if (!speechSupported || !synthSupported || busy) return;
    readAloudBeforeRef.current = readAloudRef.current;
    readAloudRef.current = true;
    setReadAloud(true);
    autoSendRef.current = true;
    setAutoSend(true);
    conversationRef.current = true;
    setConversation(true);
    setNotice('');
    setDraft('');
    startListening();
  }

  // Finish the conversation. The microphone's handlers are detached first, so
  // words caught in the last moment are dropped rather than sent.
  function endConversation(reason = 'stopped') {
    if (!conversationRef.current) return;
    conversationRef.current = false;
    clearTimeout(listenTimerRef.current);
    clearTimeout(pauseTimerRef.current);
    stopRequestedRef.current = true;
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
      setListening(false);
    }
    synth()?.cancel();
    readAloudRef.current = readAloudBeforeRef.current;
    setReadAloud(readAloudBeforeRef.current);
    setConversation(false);
    setNotice(conversationNotice(reason));
    setAvatarState('idle');
  }

  // Stop: cuts off everything at once, the conversation, the microphone, the
  // spoken reply and an answer still being written. The words already caught
  // stay in the box so they can be corrected and sent by hand (Robert, 2026-10-17).
  function stopAll() {
    stopRequestedRef.current = true;
    clearTimeout(listenTimerRef.current);
    clearTimeout(pauseTimerRef.current);
    endConversation('stopped');
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
      setListening(false);
    }
    synth()?.cancel();
    abortRef.current?.abort();
    setAvatarState('idle');
  }

  function reset() {
    endConversation('stopped');
    setNotice('');
    synth()?.cancel();
    stopRequestedRef.current = true;
    recognitionRef.current?.stop();
    setMessages([]);
    setError('');
    setAvatarState('idle');
  }

  const stoppable = listening || busy || conversation || avatarState === 'speaking';

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
            <p className="admin-muted">Ask anything about the console and the website, ask for changes to suppliers and price lists, the catalogue and price tiers, Scout research, watched websites and leads, or ask for a master prompt to get something coded and fixed. Try one of these, or press the microphone and just say it:</p>
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
              {m.content.split(String.fromCharCode(10)).map((line, j) => <p key={j}>{line || ' '}</p>)}
              {m.actions && m.actions.length > 0 && (
                <ul className="admin-assistant-actions">
                  {m.actions.map((a, j) => <li key={j}>✓ {a}</li>)}
                </ul>
              )}
              {m.role === 'assistant' && (
                <div className="admin-assistant-meta">
                  {m.model && <span>Answered by {m.model}</span>}
                  <button type="button" className="admin-assistant-copy" onClick={() => copyReply(m.content, i)}>
                    {copied === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
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
      {conversation && (
        <div className="admin-assistant-conversation" role="status">
          <span className="admin-assistant-conversation-dot" aria-hidden="true" />
          <span>
            Conversation on · {STATE_LABEL[avatarState] || 'Ready'} It keeps going until you press End conversation or Stop.
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={stopAll}>End conversation</button>
        </div>
      )}
      {!conversation && notice && <p className="admin-muted" role="status">{notice}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="admin-assistant-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={conversation
            ? 'Conversation is on: just talk, and the answer is read aloud.'
            : listening
              ? (autoSend ? 'Listening… speak now, and pause for a few seconds to send.' : 'Listening… press Done when you have finished.')
              : 'Tell the console what to do… (Enter to send, Shift+Enter for a new line)'}
          disabled={busy || conversation}
        />
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || conversation || !draft.trim()}>{busy ? 'Working…' : 'Send'}</button>
          {stoppable && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={stopAll}
              title="Stop everything: the microphone, the spoken reply and any answer being written"
            >
              <Square size={14} strokeWidth={2} aria-hidden="true" />
              {' '}Stop
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm admin-assistant-mic"
            onClick={toggleListening}
            disabled={busy || !speechSupported || conversation}
            aria-pressed={listening}
            title={speechSupported ? (listening ? 'Finish speaking' : 'Speak instead of typing') : 'Voice input needs Chrome or Edge'}
          >
            {listening ? <MicOff size={15} strokeWidth={2} aria-hidden="true" /> : <Mic size={15} strokeWidth={2} aria-hidden="true" />}
            {' '}{listening ? 'Done' : 'Speak'}
          </button>
          {!conversation && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={startConversation}
              disabled={busy || !speechSupported || !synthSupported}
              title={speechSupported && synthSupported ? 'Talk back and forth: it listens, answers aloud, then listens again' : 'A conversation needs Chrome or Edge'}
            >
              <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
              {' '}Hold a conversation
            </button>
          )}
          {messages.length > 0 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={reset} disabled={busy}>New conversation</button>
          )}
        </div>
        <div className="admin-assistant-voice">
          <label>
            <input type="checkbox" checked={autoSend} onChange={(e) => setAutoSend(e.target.checked)} disabled={!speechSupported || conversation} />
            Send when I stop talking
          </label>
          <label>
            <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} disabled={!synthSupported || conversation} />
            {readAloud ? <Volume2 size={14} strokeWidth={2} aria-hidden="true" /> : <VolumeX size={14} strokeWidth={2} aria-hidden="true" />}
            {' '}Read replies aloud
          </label>
          {!speechSupported && <span>Voice input needs Chrome or Edge.</span>}
        </div>
      </form>
    </div>
  );
}
