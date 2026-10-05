'use client';

import { useState } from 'react';
import Link from 'next/link';

import { isOpenNow } from '@/lib/teraHours';

// Under an answer Tera could not give: in business hours, send the question
// to the team; outside them, ask for a callback (Robert, 2026-10-04). Either
// way the team sees it on the console's Leads page, with Tera's draft reply.
const REQUEST_HREF = '/resources/submit-a-request';

export default function TeraHandover({ conversationId }) {
  const [open] = useState(() => isOpenNow());
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [note, setNote] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  async function send(kind) {
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/tera/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, kind, phone: phone || undefined, bestTime: bestTime || undefined, note: note || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That did not send. Please use Submit a request instead.');
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <p className="tera-handover">
        {open
          ? 'Sent to the team. They will reply by email.'
          : 'Thanks. The team will call you back on the next business day.'}
      </p>
    );
  }

  if (open) {
    return (
      <div className="tera-handover">
        <button type="button" className="tera-handover-button" disabled={state === 'sending'} onClick={() => send('question')}>
          {state === 'sending' ? 'Sending…' : 'Send this to the team'}
        </button>
        <span> or <Link href={REQUEST_HREF}>Submit a request</Link>.</span>
        {error ? <p className="tera-handover-error" role="alert">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="tera-handover">
      {showForm ? (
        <form
          className="tera-callback"
          onSubmit={(e) => {
            e.preventDefault();
            send('callback');
          }}
        >
          <label>
            Phone
            <input type="tel" value={phone} maxLength={40} required onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            Best time to call
            <input type="text" value={bestTime} maxLength={120} placeholder="Weekday mornings" onChange={(e) => setBestTime(e.target.value)} />
          </label>
          <label>
            Anything else (optional)
            <input type="text" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button type="submit" className="tera-handover-button" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Request a callback'}
          </button>
        </form>
      ) : (
        <>
          <span>The team is away right now (weekdays 9am to 4:30pm). </span>
          <button type="button" className="tera-handover-button" onClick={() => setShowForm(true)}>Request a callback</button>
          <span> or <Link href={REQUEST_HREF}>Submit a request</Link>.</span>
        </>
      )}
      {error ? <p className="tera-handover-error" role="alert">{error}</p> : null}
    </div>
  );
}