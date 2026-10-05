'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mic, MicOff, ThumbsDown, ThumbsUp, Volume2, VolumeX } from 'lucide-react';

import TeraHandover from '@/components/TeraHandover';
import TeraPose from '@/components/TeraPose';
import { nextState, pickVoice, speakableText } from '@/lib/assistantVoice';
import { endsDictation, joinSpeech } from '@/lib/dictation';
import { takeEvents } from '@/lib/teraStream';

// Ask Tera: Teracom's AI support assistant, for signed-in customers only
// (Robert, 2026-10-04). Signed-out visitors are asked to sign in. Answers
// come from Teracom's own manuals, product details and help pages, with
// links to them; when Tera is not sure it says so and offers a request.
const REQUEST_HREF = '/resources/submit-a-request';

let nextId = 1;
const newId = () => nextId++;

// Voice (Ask Tera phase 2): the browser's own speech, as in the console
// Assistant, so it costs nothing. Speak fills the box until the microphone
// is pressed again; Read aloud speaks Tera's answers; Tera's face shows
// listening, thinking and speaking.
const READ_ALOUD_KEY = 'tera-read-aloud';

function recognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function synth() {
  return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
}

export default function AskTeraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null); // null while checking, then { signedIn, firstName }
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [avatarState, setAvatarState] = useState('idle');
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const recognitionRef = useRef(null);
  const stopRequestedRef = useRef(false);
  const clearOnStopRef = useRef(false);

  useEffect(() => {
    setSpeechSupported(Boolean(recognitionClass()));
    try {
      setReadAloud(window.localStorage.getItem(READ_ALOUD_KEY) === 'on');
    } catch {
      // No storage (a private window, say): read aloud starts off.
    }
    return () => {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      synth()?.cancel();
    };
  }, []);

  // Opened from a product or calculator page with a question ready to send
  // (components/AskTeraNudge.js, Ask Tera phase 5).
  useEffect(() => {
    function onAsk(event) {
      open();
      if (event.detail?.question) setInputValue(event.detail.question);
    }
    window.addEventListener('tera:ask', onAsk);
    return () => window.removeEventListener('tera:ask', onAsk);
  });

  function dispatch(event) {
    setAvatarState((current) => nextState(current, event));
  }

  function toggleReadAloud() {
    const next = !readAloud;
    setReadAloud(next);
    if (!next) {
      synth()?.cancel();
      setAvatarState((current) => (current === 'speaking' ? 'idle' : current));
    }
    try {
      window.localStorage.setItem(READ_ALOUD_KEY, next ? 'on' : 'off');
    } catch {
      // Not remembered, but it still works for this visit.
    }
  }

  function speak(text) {
    const speech = synth();
    if (!speech) return;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(speakableText(text));
    const voice = pickVoice(speech.getVoices());
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setAvatarState('speaking');
    utterance.onend = () => dispatch('speak_end');
    utterance.onerror = () => dispatch('error');
    speech.speak(utterance);
  }

  // The microphone stays open (Chrome ends a session after a pause, so a
  // new one starts straight away) until it is pressed again; the words wait
  // in the box to be read, changed and sent.
  function toggleListening() {
    if (listening) {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = recognitionClass();
    if (!Recognition) return;
    synth()?.cancel();
    stopRequestedRef.current = false;
    const typed = inputValue;
    let finalText = '';
    const listen = () => {
      const recognition = new Recognition();
      recognition.lang = 'en-AU';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText = joinSpeech(finalText, piece);
          else interim += piece;
        }
        setInputValue(joinSpeech(typed, finalText, interim));
      };
      recognition.onerror = (event) => {
        if (endsDictation(event.error)) stopRequestedRef.current = true;
      };
      recognition.onend = () => {
        if (!stopRequestedRef.current) {
          try {
            listen();
            return;
          } catch {
            // The browser would not start again; stop as if pressed.
          }
        }
        recognitionRef.current = null;
        setListening(false);
        dispatch('listen_end');
        if (clearOnStopRef.current) {
          clearOnStopRef.current = false;
          setInputValue('');
        } else {
          setInputValue(joinSpeech(typed, finalText));
        }
      };
      recognitionRef.current = recognition;
      recognition.start();
    };
    setListening(true);
    dispatch('listen_start');
    listen();
  }

  async function open() {
    setIsOpen(true);
    if (status) return;
    try {
      const res = await fetch('/api/tera/status', { cache: 'no-store' });
      const data = await res.json();
      setStatus({ signedIn: Boolean(data.signedIn), firstName: data.firstName || '' });
      if (data.signedIn) {
        setMessages([{
          id: newId(),
          type: 'assistant',
          pose: 'wink',
          text: `Hi${data.firstName ? ` ${data.firstName}` : ''}, I'm Tera, Teracom's AI support assistant. Ask me about our products, setting them up, or the free calculators. I answer from Teracom's manuals and help pages, and I'll tell you if I'm not sure.`,
        }]);
      }
    } catch {
      setStatus({ signedIn: false, firstName: '' });
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || sending) return;
    const placeholderId = newId();
    setMessages((prev) => [
      ...prev,
      { id: newId(), type: 'user', text },
      { id: placeholderId, type: 'assistant', text: 'Tera is looking that up...', pending: true },
    ]);
    setInputValue('');
    if (listening) {
      clearOnStopRef.current = true;
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
    }
    synth()?.cancel();
    dispatch('send');
    setSending(true);
    // The answer arrives as it is written (lib/teraStream.js): the words
    // fill the placeholder, then the sources and rating buttons follow.
    const update = (changes) => setMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, ...changes } : m)));
    try {
      const res = await fetch('/api/tera/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 && data.signIn) {
          setStatus({ signedIn: false, firstName: '' });
          return;
        }
        throw new Error(data.error || 'Tera is not available right now.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let written = '';
      let finished = false;
      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = takeEvents(buffer);
        buffer = rest;
        for (const event of events) {
          if (event.type === 'text') {
            written += event.text;
            update({ text: written, pending: false });
          } else if (event.type === 'done') {
            finished = true;
            setConversationId(event.conversation_id || conversationId);
            update({ text: event.reply, sources: event.sources || [], answered: event.answered, messageId: event.message_id, pending: false });
            const wantSpeech = readAloud && Boolean(event.reply);
            dispatch({ type: 'reply', speak: wantSpeech });
            if (wantSpeech) speak(event.reply);
          } else if (event.type === 'error') {
            throw new Error(event.error || 'Tera is not available right now.');
          }
        }
      }
      if (!finished) throw new Error('Tera stopped before finishing. Please try again.');
    } catch (err) {
      dispatch('error');
      setMessages((prev) => prev.map((m) => (m.id === placeholderId
        ? { id: placeholderId, type: 'assistant', text: err.message || 'Sorry, something went wrong. Please try again.', answered: false }
        : m)));
    } finally {
      setSending(false);
    }
  }

  async function rate(message, value) {
    setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, feedback: value } : m)));
    try {
      await fetch('/api/tera/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: message.messageId, value }),
      });
    } catch {
      // A lost rating is not worth interrupting the chat for.
    }
  }

  return (
    <>
      <button
        className="tera-toggle-button"
        onClick={isOpen ? () => setIsOpen(false) : open}
        aria-label={isOpen ? 'Close chat with Tera' : 'Open chat with Tera'}
      >
        {isOpen ? '✕' : <Image src="/assets/tera-avatar.webp" alt="" width={60} height={60} className="tera-toggle-avatar" />}
      </button>

      {isOpen && (
        <div className="tera-panel" role="dialog" aria-label="Ask Tera">
          <div className="tera-header">
            <Image src="/assets/tera-avatar.webp" alt="" width={36} height={36} className={`tera-avatar-badge is-${avatarState}`} />
            <h3>Ask Tera</h3>
            <button
              type="button"
              className="tera-voice-toggle"
              aria-pressed={readAloud}
              onClick={toggleReadAloud}
              aria-label={readAloud ? 'Stop reading answers aloud' : 'Read answers aloud'}
              title={readAloud ? 'Stop reading answers aloud' : 'Read answers aloud'}
            >
              {readAloud ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            </button>
            <button className="tera-close-button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          {status === null ? (
            <div className="tera-messages"><p className="tera-note">One moment...</p></div>
          ) : !status.signedIn ? (
            <div className="tera-messages">
              <div className="tera-message tera-message-assistant">
                I&apos;m Tera, Teracom&apos;s AI support assistant. I answer questions for signed-in customers: sign in, or create a free account, to chat with me.
              </div>
              <div className="tera-signin">
                <Link href="/account/login" className="btn btn-primary">Sign in</Link>
                <Link href="/account/signup" className="btn btn-secondary">Create an account</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="tera-messages" aria-live="polite">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`tera-message ${message.type === 'user' ? 'tera-message-user' : 'tera-message-assistant'}`}
                  >
                    {message.pose ? <TeraPose pose={message.pose} size={72} className="tera-pose-chat" /> : null}
                    {message.pending ? <TeraPose pose="laptop" size={64} className="tera-pose-chat" /> : null}
                    {message.text}
                    {message.sources?.length ? (
                      <ul className="tera-sources">
                        {message.sources.map((source) => (
                          <li key={source.url || source.title}>
                            {source.url ? (
                              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                            ) : (
                              source.title
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {message.type === 'assistant' && message.answered === false && !message.pending ? (
                      message.messageId ? (
                        <TeraHandover conversationId={conversationId} />
                      ) : (
                        <p className="tera-handover">
                          <Link href={REQUEST_HREF}>Submit a request</Link> and the team will get back to you.
                        </p>
                      )
                    ) : null}
                    {message.messageId ? (
                      <div className="tera-feedback">
                        <button
                          type="button"
                          aria-label="Helpful"
                          aria-pressed={message.feedback === 1}
                          className={message.feedback === 1 ? 'is-on' : undefined}
                          onClick={() => rate(message, 1)}
                        >
                          <ThumbsUp size={14} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Not helpful"
                          aria-pressed={message.feedback === -1}
                          className={message.feedback === -1 ? 'is-on' : undefined}
                          onClick={() => rate(message, -1)}
                        >
                          <ThumbsDown size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <form className="tera-input-row" onSubmit={handleSend}>
                <input
                  type="text"
                  className="tera-input"
                  value={inputValue}
                  maxLength={1000}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={listening ? 'Listening... press the microphone again when you have finished.' : 'Ask about a product or setup...'}
                  aria-label="Your question for Tera"
                />
                {speechSupported ? (
                  <button
                    type="button"
                    className={`tera-mic-button${listening ? ' is-on' : ''}`}
                    onClick={toggleListening}
                    aria-pressed={listening}
                    aria-label={listening ? 'Stop listening' : 'Speak your question'}
                    title={listening ? 'Stop listening' : 'Speak your question'}
                  >
                    {listening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                  </button>
                ) : null}
                <button type="submit" className="tera-send-button" disabled={sending} aria-label="Send question">
                  Send
                </button>
              </form>
              <p className="tera-note">Tera is an AI assistant and can make mistakes. Chats are kept for 90 days.</p>
            </>
          )}
        </div>
      )}
    </>
  );
}