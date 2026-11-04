'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleCheckBig, Paperclip, Plus, Trash2, TriangleAlert } from 'lucide-react';

import { useFormGuard } from '@/components/FormGuard';
import SignaturePad from '@/components/SignaturePad';
import TurnstileWidget from '@/components/TurnstileWidget';
import {
  DAYS,
  FILE_RULES,
  checkForm,
  findOnlineForm,
  optionLabel,
  optionValue,
  summarise,
  summaryText,
  termsTitle,
  visibleSections,
} from '@/lib/onlineForms';

// Draws any form in lib/onlineForms, checks it, and sends it with the signature and files.
// The page passes only the form's key (the definition is imported here, so nothing that
// cannot be serialised crosses from the server) and the terms version on show.
//
// As with the request forms, a failed send never throws the answers away: the customer
// gets their answers as text to copy into an email.

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Choice({ type, name, option, checked, onChange }) {
  const description = typeof option === 'string' ? '' : option.description;
  return (
    <label className="request-radio">
      <input type={type} name={name} value={optionValue(option)} checked={checked} onChange={onChange} />
      <span>
        {optionLabel(option)}
        {description ? <span className="online-form-option-note">{description}</span> : null}
      </span>
    </label>
  );
}

function Field({ field, value, setValue, files, addFiles, removeFile }) {
  const id = `field-${field.id}`;
  const label = (
    <label htmlFor={id}>
      {field.label}
      {field.required ? <span className="field-required"> *</span> : null}
    </label>
  );
  const help = field.help ? <p className="form-note">{field.help}</p> : null;

  if (field.type === 'note') return <p className="online-form-note">{field.text}</p>;

  if (field.type === 'radio' || field.type === 'checkboxes') {
    const many = field.type === 'checkboxes';
    const list = many ? (Array.isArray(value) ? value : []) : value;
    return (
      <fieldset className="field online-form-fieldset">
        <legend>
          {field.label}
          {field.required ? <span className="field-required"> *</span> : null}
        </legend>
        <div className="request-radios">
          {field.options.map((option) => {
            const v = optionValue(option);
            return (
              <Choice
                key={v}
                type={many ? 'checkbox' : 'radio'}
                name={field.id}
                option={option}
                checked={many ? list.includes(v) : list === v}
                onChange={(event) =>
                  setValue(field.id, many ? (event.target.checked ? [...list, v] : list.filter((x) => x !== v)) : v)
                }
              />
            );
          })}
        </div>
        {help}
      </fieldset>
    );
  }

  if (field.type === 'file') {
    const mine = files.filter((f) => f.field === field.id);
    return (
      <div className="field">
        {label}
        <input
          id={id}
          type="file"
          multiple
          accept={FILE_RULES.extensions.map((e) => `.${e}`).join(',')}
          onChange={(event) => {
            addFiles(field.id, Array.from(event.target.files || []));
            event.target.value = '';
          }}
        />
        {mine.length ? (
          <ul className="online-form-files">
            {mine.map((f) => (
              <li key={f.key}>
                <Paperclip size={14} aria-hidden="true" /> {f.name}{' '}
                <span className="form-note">({Math.ceil(f.size / 1024)} KB)</span>{' '}
                <button type="button" className="link-button" onClick={() => removeFile(f.key)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="form-note">{field.help || `PDF, spreadsheet, document or photo; up to 3 MB for all files together.`}</p>
      </div>
    );
  }

  if (field.type === 'repeater') {
    const rows = Array.isArray(value) && value.length ? value : [{}];
    const setRow = (index, sub, v) => setValue(field.id, rows.map((row, i) => (i === index ? { ...row, [sub]: v } : row)));
    return (
      <fieldset className="field online-form-fieldset">
        <legend>
          {field.label}
          {field.required ? <span className="field-required"> *</span> : null}
        </legend>
        {help}
        <div className="director-list">
          {rows.map((row, index) => (
            <fieldset className="director online-form-row" key={index}>
              <legend>{`${field.rowLabel ? field.rowLabel[0].toUpperCase() + field.rowLabel.slice(1) : 'Row'} ${index + 1}`}</legend>
              {field.fields.map((sub) => (
                <div className={`field${sub.width === 'half' ? ' field-half' : ''}`} key={sub.id}>
                  <label htmlFor={`${id}-${index}-${sub.id}`}>
                    {sub.label}
                    {sub.required ? <span className="field-required"> *</span> : null}
                  </label>
                  <input
                    id={`${id}-${index}-${sub.id}`}
                    type={sub.type || 'text'}
                    value={row[sub.id] || ''}
                    onChange={(event) => setRow(index, sub.id, event.target.value)}
                  />
                  {sub.help ? <p className="form-note">{sub.help}</p> : null}
                </div>
              ))}
              {rows.length > 1 ? (
                <button type="button" className="director-remove link-button" onClick={() => setValue(field.id, rows.filter((_, i) => i !== index))}>
                  <Trash2 size={14} aria-hidden="true" /> Remove
                </button>
              ) : null}
            </fieldset>
          ))}
        </div>
        {!field.max || rows.length < field.max ? (
          <button type="button" className="btn btn-secondary" onClick={() => setValue(field.id, [...rows, {}])}>
            <Plus size={16} aria-hidden="true" /> Add another {field.rowLabel || 'row'}
          </button>
        ) : null}
      </fieldset>
    );
  }

  if (field.type === 'hours') {
    const hours = value && typeof value === 'object' ? value : {};
    const set = (day, part, v) => setValue(field.id, { ...hours, [day]: { ...(hours[day] || {}), [part]: v } });
    return (
      <fieldset className="field online-form-fieldset">
        <legend>{field.label}</legend>
        {help}
        <table className="online-form-hours">
          <thead>
            <tr><th scope="col">Day</th><th scope="col">Opens</th><th scope="col">Closes</th></tr>
          </thead>
          <tbody>
            {DAYS.map(([day, name]) => (
              <tr key={day}>
                <th scope="row">{name}</th>
                <td><input aria-label={`${name} opens`} inputMode="numeric" maxLength={5} value={hours[day]?.open || ''} onChange={(e) => set(day, 'open', e.target.value)} /></td>
                <td><input aria-label={`${name} closes`} inputMode="numeric" maxLength={5} value={hours[day]?.close || ''} onChange={(e) => set(day, 'close', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    );
  }

  if (field.type === 'grid') {
    const answers = value && typeof value === 'object' ? value : {};
    return (
      <fieldset className="field online-form-fieldset">
        <legend>
          {field.label}
          {field.required ? <span className="field-required"> *</span> : null}
        </legend>
        {help}
        <div className="online-form-grid">
          {field.rows.map((row) => (
            <div className="field" key={row.id}>
              <label htmlFor={`${id}-${row.id}`}>{row.label}</label>
              <select id={`${id}-${row.id}`} value={answers[row.id] || ''} onChange={(e) => setValue(field.id, { ...answers, [row.id]: e.target.value })}>
                <option value="">Please select</option>
                {field.options.map((option) => (
                  <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </fieldset>
    );
  }

  const common = { id, name: field.id, value: value || '', onChange: (event) => setValue(field.id, event.target.value), autoComplete: field.autoComplete };
  return (
    <div className={`field${field.width === 'half' ? ' field-half' : ''}`}>
      {label}
      {field.type === 'textarea' ? (
        <textarea {...common} rows={field.rows || 4} />
      ) : field.type === 'select' ? (
        <select {...common}>
          <option value="">Please select</option>
          {field.options.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>
          ))}
        </select>
      ) : (
        <input type={field.type === 'number' ? 'text' : field.type} inputMode={field.type === 'number' ? 'numeric' : undefined} {...common} />
      )}
      {help}
    </div>
  );
}

export default function OnlineForm({ formKey, termsVersion, preview = false }) {
  const form = findOnlineForm(formKey);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState([]);
  const [problems, setProblems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const guard = useFormGuard();

  if (!form) return null;
  const setValue = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const addFiles = (field, list) =>
    setFiles((current) => [
      ...current,
      ...list.map((file) => ({ key: `${field}-${file.name}-${file.size}-${Math.random()}`, field, name: file.name, size: file.size, file })),
    ]);
  const removeFile = (key) => setFiles((current) => current.filter((f) => f.key !== key));
  const sections = visibleSections(form, values);
  const fileInfo = files.map(({ field, name, size }) => ({ field, name, size }));

  async function handleSubmit(event) {
    event.preventDefault();
    const found = checkForm(form, values, fileInfo);
    if (!values.agree) found.push('Tick the agreement');
    if (!String(values.signedName || '').trim()) found.push('Type your full name under the signature');
    if (!values.signature) found.push('Sign in the box');
    setProblems(found);
    if (found.length) {
      document.getElementById('online-form-problems')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const attached = await Promise.all(
        files.map(async (f) => ({ field: f.field, name: f.name, type: f.file.type || 'application/octet-stream', base64: await readFile(f.file) }))
      );
      const res = await fetch(`/api/forms/${form.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values, files: attached, turnstileToken, guard: guard.values(), preview }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not send that just now.');
      setReference(data.reference || '');
      setStatus('sent');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <h2>Thank you. We have your {form.shortTitle.toLowerCase()}.</h2>
        <p>
          Your reference is <strong>{reference}</strong>. A signed copy is on its way to {values[form.identity.email] || 'your email'}. We will be
          in touch if we need anything else.
        </p>
      </div>
    );
  }

  return (
    <form className="request-form online-form" onSubmit={handleSubmit} noValidate>
      {sections.map((section) => (
        <section className="online-form-section" key={section.id} aria-labelledby={`section-${section.id}`}>
          <h2 className="request-form-heading" id={`section-${section.id}`}>{section.title}</h2>
          {section.fields.map((field) => (
            <Field
              key={field.id}
              field={field}
              value={values[field.id]}
              setValue={setValue}
              files={files}
              addFiles={addFiles}
              removeFile={removeFile}
            />
          ))}
        </section>
      ))}

      <section className="online-form-section" aria-labelledby="section-sign">
        <h2 className="request-form-heading" id="section-sign">Agreement and signature</h2>
        <p className="form-note">
          You are agreeing to {termsTitle(form, values, termsVersion)}.{' '}
          <Link href="/terms" target="_blank">Read the terms</Link> (opens in a new tab).
        </p>
        <label className="request-declaration">
          <input type="checkbox" checked={Boolean(values.agree)} onChange={(event) => setValue('agree', event.target.checked)} />
          <span>{form.agreement.statement}</span>
        </label>
        <div className="field">
          <label htmlFor="field-signedName">
            Your full name<span className="field-required"> *</span>
          </label>
          <input id="field-signedName" value={values.signedName || ''} onChange={(event) => setValue('signedName', event.target.value)} autoComplete="name" />
        </div>
        <SignaturePad label="Signature" value={values.signature} onChange={(data) => setValue('signature', data)} />
      </section>

      {problems.length ? (
        <div className="request-failed" role="alert" id="online-form-problems">
          <p>
            <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> Before you send:
          </p>
          <ul>
            {problems.map((problem) => <li key={problem}>{problem}</li>)}
          </ul>
        </div>
      ) : null}

      {status === 'failed' ? (
        <div className="request-failed" role="alert">
          <p>
            <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" focusable="false" /> {error}
          </p>
          <p>
            Nothing you typed has been lost. Copy your answers below into an email to{' '}
            <a href="mailto:support@teracomsolutions.com.au">support@teracomsolutions.com.au</a> and we will take it from there.
          </p>
          <textarea className="request-recovery" readOnly rows={10} value={summaryText(summarise(form, values, fileInfo))} aria-label="Your answers, ready to copy" />
        </div>
      ) : null}

      {guard.fields}
      <TurnstileWidget onToken={setTurnstileToken} />

      <button type="submit" className="btn btn-primary request-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Sign and send'}
      </button>
      <p className="form-note">
        We use these details to set up and run your service; see our <Link href="/privacy">privacy policy</Link>.
      </p>
    </form>
  );
}
