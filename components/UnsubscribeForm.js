'use client';

import { useState } from 'react';
import Link from 'next/link';

// The page behind the link in every marketing email. One button; the link
// itself carries the proof (an HMAC of the customer id), so no sign-in.
export default function UnsubscribeForm({ customerId, token }) {
  const valid = Boolean(customerId && token);
  const [state, setState] = useState(valid ? 'ready' : 'invalid');

  async function stop() {
    setState('busy');
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, token }),
      });
      setState(response.ok ? 'done' : 'invalid');
    } catch {
      setState('invalid');
    }
  }

  if (state === 'done') {
    return <p className="form-note-banner" role="status">Done. You will not receive marketing emails from Teracom Solutions. Order and account emails still arrive as normal.</p>;
  }
  if (state === 'invalid') {
    return (
      <p className="form-error" role="alert">
        That link is not valid. Email <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a> and we will remove you by hand.
      </p>
    );
  }
  return (
    <div className="admin-actions">
      <button type="button" className="btn btn-primary" onClick={stop} disabled={state === 'busy'}>
        {state === 'busy' ? 'One moment…' : 'Stop marketing emails'}
      </button>
      <Link className="btn btn-secondary" href="/">Keep them</Link>
    </div>
  );
}
