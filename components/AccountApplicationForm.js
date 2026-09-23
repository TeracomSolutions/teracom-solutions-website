'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CircleCheckBig, Plus, Trash2, TriangleAlert } from 'lucide-react';

import SignaturePad from '@/components/SignaturePad';
import TurnstileWidget from '@/components/TurnstileWidget';
import { track } from '@/lib/gtag';
import {
  accountApplication,
  formatApplication,
  missingFrom,
  needsGuarantee,
  visibleDeclarations,
  visibleFields,
  visibleSteps,
} from '@/lib/accountApplication';

// The application, one step at a time.
//
// Which steps exist depends on the answers: a sole trader never sees the
// company page, a cash applicant never sees trade references, and only a
// company or trust on credit is told about the personal guarantee. The
// progress indicator counts the steps that apply to THIS applicant, so it
// never promises six pages and delivers four.

function Field({ field, value, onChange }) {
  const id = `aa-${field.id}`;
  if (field.type === 'heading') return <h3 className="request-form-heading">{field.label}</h3>;

  // An option is either a plain string or { value, label }.
  const options = (field.options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  const common = {
    id,
    name: field.id,
    value,
    required: field.required,
    autoComplete: field.autoComplete,
    onChange: (event) => onChange(field.id, event.target.value),
  };

  return (
    <div className={`field${field.width === 'half' ? ' field-half' : ''}`}>
      <label htmlFor={id}>
        {field.label}
        {field.required ? <span className="field-required"> *</span> : null}
      </label>
      {field.type === 'select' ? (
        <select {...common}>
          <option value="">Please select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="request-radios" role="group" aria-labelledby={id}>
          {options.map((option) => (
            <label className="request-radio" key={option.value}>
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(field.id, event.target.value)}
              />
              <span>{option.label}</span>
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

export default function AccountApplicationForm() {
  const [values, setValues] = useState({});
  const [directors, setDirectors] = useState([{}]);
  const [index, setIndex] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const steps = useMemo(() => visibleSteps(values), [values]);
  // Clamp rather than reset: changing entity type mid-way swaps a step in or
  // out, and the visitor should not be thrown back to the start for it.
  const step = steps[Math.min(index, steps.length - 1)];
  const position = Math.min(index, steps.length - 1);
  const isLast = position === steps.length - 1;

  const setValue = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    setError('');
  };

  const setDirector = (i, id, value) =>
    setDirectors((current) => current.map((row, n) => (n === i ? { ...row, [id]: value } : row)));

  function next() {
    const missing = missingFrom(step, values, step.repeatable ? directors : []);
    if (missing.length > 0) {
      setError(`Please complete ${missing.join(', ')}.`);
      return;
    }
    const declarations = visibleDeclarations(step, values).filter((d) => d.required && !values[d.id]);
    if (declarations.length > 0) {
      setError('Please tick each declaration before sending.');
      return;
    }
    if (step.signature && !values.signature) {
      setError('Please sign in the box before sending.');
      return;
    }
    setError('');
    if (!isLast) {
      setIndex(position + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    submit();
  }

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/account-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values, directors, turnstileToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not send that just now.');
      setStatus('sent');
      track('generate_lead', {
        currency: 'AUD',
        lead_source: 'account_application',
        form_location: '/resources/submit-a-request/account-application',
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
        <h2>Application received.</h2>
        <p>
          We will review it and come back to you either way. If we need anything else &mdash; trade references, or a
          guarantee for a company account &mdash; we will send it to you to sign.
        </p>
      </div>
    );
  }

  return (
    <div className="account-application">
      <ol className="cart-progress account-progress" aria-label="Application steps">
        {steps.map((s, i) => (
          <li key={s.id} className={i < position ? 'done' : i === position ? 'current' : ''} aria-current={i === position ? 'step' : undefined}>
            <span>{i + 1}</span>
            {s.title}
          </li>
        ))}
      </ol>

      <form
        className="request-form"
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
      >
        {visibleFields(step, values).map((field) => (
          <Field key={field.id} field={field} value={values[field.id] || ''} onChange={setValue} />
        ))}

        {step.repeatable ? (
          <div className="director-list">
            {directors.map((row, i) => (
              <fieldset className="director" key={i}>
                <legend>
                  {step.repeatable.singular} {i + 1}
                </legend>
                {step.repeatable.fields.map((field) => (
                  <Field
                    key={field.id}
                    field={field}
                    value={row[field.id] || ''}
                    onChange={(id, value) => setDirector(i, id, value)}
                  />
                ))}
                {directors.length > step.repeatable.min ? (
                  <button
                    type="button"
                    className="director-remove"
                    onClick={() => setDirectors((c) => c.filter((_, n) => n !== i))}
                  >
                    <Trash2 size={15} strokeWidth={1.9} aria-hidden="true" /> Remove
                  </button>
                ) : null}
              </fieldset>
            ))}
            <button type="button" className="btn btn-secondary" onClick={() => setDirectors((c) => [...c, {}])}>
              <Plus size={16} strokeWidth={2} aria-hidden="true" /> {step.repeatable.addLabel}
            </button>
          </div>
        ) : null}

        {step.signature ? (
          <SignaturePad
            label="Signature"
            value={values.signature}
            onChange={(data) => setValue('signature', data)}
          />
        ) : null}

        {visibleDeclarations(step, values).map((declaration) => (
          <label className="request-declaration" key={declaration.id}>
            <input
              type="checkbox"
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

        {isLast && needsGuarantee(values) ? (
          <p className="form-note account-guarantee-note">
            A personal guarantee is not collected through this form. We will send it to each director to sign once the
            application has been reviewed, so that everyone giving one gets their own copy and their own chance to take
            advice on it.
          </p>
        ) : null}

        {error ? (
          <div className="request-failed" role="alert">
            <p>
              <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> {error}
            </p>
            {status === 'failed' ? (
              <>
                <p>
                  Nothing you typed has been lost. Copy the summary below into an email to{' '}
                  <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a>.
                </p>
                <textarea
                  className="request-recovery"
                  readOnly
                  rows={12}
                  value={formatApplication(values, directors)}
                  aria-label="Your application, ready to copy"
                />
              </>
            ) : null}
          </div>
        ) : null}

        {/* Only on the last step: a token expires in minutes, and this
            form takes longer than that to fill in. */}
        {isLast ? <TurnstileWidget onToken={setTurnstileToken} /> : null}

        <div className="account-actions">
          {position > 0 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setError('');
                setIndex(position - 1);
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Back
            </button>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : isLast ? 'Send application' : 'Continue'}
            {isLast ? null : <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
          </button>
        </div>

        <p className="form-note">
          Step {position + 1} of {steps.length}. We only use these details to assess your application &mdash; see our{' '}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      </form>
    </div>
  );
}

export { accountApplication };
