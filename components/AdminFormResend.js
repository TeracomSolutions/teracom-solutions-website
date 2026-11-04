'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Send again on a form's page: repeats every place the form's route lists, and the
// customer's copy too when ticked. The results appear under Where it went.
export default function AdminFormResend({ id }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(false);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  async function send() {
    setState('sending');
    setError('');
    try {
      const res = await fetch(`/api/admin/forms/${id}/deliver`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That could not be sent.');
      setState('sent');
      // The sending runs after the answer; look again shortly for the results.
      setTimeout(() => router.refresh(), 4000);
    } catch (e) {
      setState('idle');
      setError(e.message || 'That could not be sent.');
    }
  }

  return (
    <div className="admin-actions">
      <label className="checkbox-row">
        <input type="checkbox" checked={customer} onChange={(e) => setCustomer(e.target.checked)} />
        Email the customer their copy again too
      </label>
      <button type="button" className="btn btn-secondary btn-sm" onClick={send} disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send again'}
      </button>
      {state === 'sent' ? <span className="admin-muted" role="status">Sending; the results appear here in a few seconds.</span> : null}
      {error ? <span className="form-error" role="alert">{error}</span> : null}
    </div>
  );
}
