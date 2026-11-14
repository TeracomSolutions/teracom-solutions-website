'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StopEmailsForm({ email, token }) {
  const valid = Boolean(email && token);
  const [state, setState] = useState(valid ? 'ready' : 'invalid');

  async function stop() {
    setState('busy');
    try {
      const response = await fetch('/api/stop-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e: email, t: token }),
      });
      setState(response.ok ? 'done' : 'invalid');
    } catch {
      setState('invalid');
    }
  }

  if (state === 'done') return <p className="form-note-banner" role="status">Done. We will not email {email} again.</p>;
  if (state === 'invalid') {
    return (
      <p className="form-error" role="alert">
        That link is not valid. Reply to our email with &quot;unsubscribe&quot;, or email{' '}
        <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a>, and we will stop by hand.
      </p>
    );
  }
  return (
    <div className="admin-actions">
      <button type="button" className="btn btn-primary" onClick={stop} disabled={state === 'busy'}>{state === 'busy' ? 'One moment…' : 'Stop emails'}</button>
      <Link className="btn btn-secondary" href="/">Go to the website</Link>
    </div>
  );
}
