'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleCheckBig, TriangleAlert } from 'lucide-react';

import { track } from '@/lib/gtag';
import { formatSubmission, valueFields } from '@/lib/requestForms';
import TurnstileWidget from '@/components/TurnstileWidget';

// Renders any form described in lib/requestForms.js.
//
// If the submission cannot be delivered, the form does NOT pretend it worked
// and does NOT throw the answers away. It shows the phone number and gives
// the customer their own submission as selectable text, so a filled-in
// service request can still be phoned or emailed through rather than lost
// because a server was down. Someone who has just typed out a fault
// description should never have to type it twice.

function Field({ field, value, onChange }) {
  const id = `field-${field.id}`;

  if (field.type === 'heading') {
    return <h2 className="request-form-heading">{field.label}</h2>;
  }

  const common = {
    id,
    name: field.id,
    required: field.required,
    value,
    onChange: (event) => onChange(field.id, event.target.value),
    autoComplete: field.autoComplete,
  };

  return (
    <div className={`field${field.width === 'half' ? ' field-half' : ''}`}>
      <label htmlFor={id}>
        {field.label}
        {field.required ? <span className="field-required"> *</span> : null}
      </label>

      {field.type === 'textarea' ? (
        <textarea {...common} rows={field.rows || 4} />
      ) : field.type === 'select' ? (
        <select {...common}>
          <option value="">Please select</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="request-radios" role="group" aria-labelledby={id}>
          {field.options.map((option) => (
            <label className="request-radio" key={option}>
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                required={field.required}
                onChange={(event) => onChange(field.id, event.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <input type={field.type} {...common} />
      )}

      {field.help ? <p className="form-note">{field.help}</p> : null}
    </div>
  );
}

export default function RequestForm({ form }) {
  const [values, setValues] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const setValue = (id, value) => setValues((current) => ({ ...current, [id]: value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.slug, values, turnstileToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not send that just now.');

      setStatus('sent');
      track('generate_lead', {
        currency: 'AUD',
        lead_source: form.slug,
        form_location: `/resources/submit-a-request/${form.slug}`,
      });
    } catch (e) {
      setStatus('failed');
      setError(e.message || 'We could not send that just now.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="request-result" role="status">
        <span className="request-result-icon">
          <CircleCheckBig size={26} strokeWidth={1.8} aria-hidden="true" focusable="false" />
        </span>
        <h2>Thanks &mdash; we have your request.</h2>
        <p>
          We will be in touch to confirm a time. If anything changes in the meantime, email{' '}
          <a href="mailto:support@teracomsolutions.com.au">support@teracomsolutions.com.au</a> and quote your site
          address.
        </p>
      </div>
    );
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      {form.fields.map((field) => (
        <Field key={field.id} field={field} value={values[field.id] || ''} onChange={setValue} />
      ))}

      <h2 className="request-form-heading">Before you send</h2>
      {form.declarations.map((declaration) => (
        <label className="request-declaration" key={declaration.id}>
          {/* Never pre-ticked. */}
          <input
            type="checkbox"
            name={declaration.id}
            required={declaration.required}
            checked={Boolean(values[declaration.id])}
            onChange={(event) => setValue(declaration.id, event.target.checked)}
          />
          <span>
            {declaration.text}
            {declaration.termsLink ? (
              <>
                {' '}
                <Link href="/terms">Read the terms</Link>.
              </>
            ) : null}
          </span>
        </label>
      ))}

      {status === 'failed' ? (
        <div className="request-failed" role="alert">
          <p>
            <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> {error}
          </p>
          <p>
            Nothing you typed has been lost. Copy the summary below into an email to{' '}
            <a href="mailto:support@teracomsolutions.com.au">support@teracomsolutions.com.au</a> and we will pick it
            up from there.
          </p>
          <textarea
            className="request-recovery"
            readOnly
            rows={10}
            value={formatSubmission(form, values)}
            aria-label="Your request, ready to copy"
          />
        </div>
      ) : null}

      <TurnstileWidget onToken={setTurnstileToken} />

      <button type="submit" className="btn btn-primary request-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : `Send ${form.title.toLowerCase()}`}
      </button>

      <p className="form-note">
        {valueFields(form).filter((f) => f.required).length} required fields. We only use these details to handle your
        request &mdash; see our <Link href="/privacy">privacy policy</Link>.
      </p>
    </form>
  );
}
