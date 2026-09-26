'use client';

import { useEffect, useRef, useState } from 'react';

// Chat with the console. Each turn sends the whole conversation (the
// backend keeps no session), shows the reply, and lists any actions the
// assistant took so nothing happens silently.
const SUGGESTIONS = [
  'Which suppliers have never had a price list imported?',
  'Set the Gold tier to 15% off RRP.',
  'Create a weekly Scout task: what are competitors charging for Hikvision 8MP turret cameras in Australia?',
  'Watch https://www.example.com/support/downloads for data sheets and installer manuals, weekly.',
  'Show me the new leads and summarise what each one wants.',
  'How did the website do in the last 7 days compared with the week before?',
];

export default function AdminAssistantChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  async function send(text) {
    const content = (text ?? draft).trim();
    if (!content || busy) return;
    const history = [...messages, { role: 'user', content }];
    setMessages(history);
    setDraft('');
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-24).map(({ role, content: c }) => ({ role, content: c })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The assistant did not answer.');
      setMessages([...history, { role: 'assistant', content: data.reply, actions: data.actions || [], model: data.model }]);
    } catch (err) {
      setError(err.message);
      setMessages(history);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="admin-assistant">
      <div className="admin-assistant-log" aria-live="polite">
        {messages.length === 0 && (
          <div className="admin-assistant-empty">
            <p className="admin-muted">Ask about, or ask for changes to, suppliers and price lists, the catalogue and price tiers, Scout research, watched websites, leads and visitor numbers. Try one of these:</p>
            <div className="admin-actions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="btn btn-secondary btn-sm" onClick={() => send(s)} disabled={busy}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`admin-assistant-msg ${m.role}`}>
            <div className="admin-assistant-bubble">
              {m.content.split('\n').map((line, j) => <p key={j}>{line || ' '}</p>)}
              {m.actions && m.actions.length > 0 && (
                <ul className="admin-assistant-actions">
                  {m.actions.map((a, j) => <li key={j}>✓ {a}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="admin-assistant-msg assistant"><div className="admin-assistant-bubble admin-muted">Working…</div></div>}
        <div ref={endRef} />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="admin-assistant-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Tell the console what to do… (Enter to send, Shift+Enter for a new line)"
          disabled={busy}
        />
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !draft.trim()}>{busy ? 'Working…' : 'Send'}</button>
          {messages.length > 0 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMessages([]); setError(''); }} disabled={busy}>New conversation</button>
          )}
        </div>
      </form>
    </div>
  );
}
