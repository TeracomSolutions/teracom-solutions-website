'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

import OnlineForm from '@/components/OnlineForm';
import { findOnlineForm, optionLabel, optionValue } from '@/lib/onlineForms';
import { ADDED_TYPES, cleanEdits, fieldAbilities, hasEdits, lockedFieldIds, newQuestionId } from '@/lib/onlineForms/edits';

// Console: change a form's wording, questions and agreement (lib/onlineForms/edits.js), with
// the form drawn beside it exactly as customers will see it. Nothing changes on the website
// until Save; "Put back as built" removes every change.

const STAMPS = ['revision', 'agreement_revision', 'updated_at', 'updated_by', 'reset'];
const strip = (edits) => (edits && !edits.reset ? Object.fromEntries(Object.entries(edits).filter(([k]) => !STAMPS.includes(k))) : {});
const lines = (text) => String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
const paragraphs = (text) => String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export default function AdminFormEditor({ formKey, initial, termsVersion, canEdit }) {
  const form = findOnlineForm(formKey);
  const [saved, setSaved] = useState(initial || null);
  const [draft, setDraft] = useState(() => strip(initial));
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const locked = useMemo(() => lockedFieldIds(form), [form]);
  const clean = useMemo(() => cleanEdits(form, draft), [form, draft]);
  const changed = JSON.stringify(clean) !== JSON.stringify(cleanEdits(form, strip(saved)));
  const previewEdits = useMemo(() => ({ ...clean, revision: saved?.revision || 0, agreement_revision: saved?.agreement_revision || 0 }), [clean, saved]);

  if (!form) return null;
  const disabled = !canEdit || busy;

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const setSection = (id, title) => setDraft((d) => ({ ...d, sections: { ...(d.sections || {}), [id]: { title } } }));
  const setField = (id, change) =>
    setDraft((d) => ({ ...d, fields: { ...(d.fields || {}), [id]: { ...((d.fields || {})[id] || {}), ...change } } }));
  const fieldDraft = (id) => (draft.fields || {})[id] || {};
  const added = draft.added || [];
  const setAdded = (list) => set('added', list);
  const agreement = draft.agreement || {};
  const setAgreement = (change) => set('agreement', { ...agreement, ...change });
  const doc = form.agreement.document;
  const clauses = agreement.clauses || doc?.clauses || [];
  const setClauses = (list) => setAgreement({ clauses: list });

  async function save() {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch(`/api/admin/forms/edits/${form.key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edits: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'Could not save the changes.');
      setSaved(data);
      setDraft(strip(data));
      setStatus('Saved. The website shows the changes within a minute.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function putBack() {
    if (!window.confirm(`Put the ${form.title} back as it was built? Every change made here is removed. Forms already signed keep their own copy.`)) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch(`/api/admin/forms/edits/${form.key}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'Could not put the form back.');
      const now = (data.forms || {})[form.key] || null;
      setSaved(now);
      setDraft({});
      setStatus('The form is back as built.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const viewHref = form.live ? `/forms/${form.key}` : `/forms/${form.key}?preview=1`;

  return (
    <div className="form-editor">
      <div className="form-editor-bar">
        <span className={`admin-status ${form.live ? 'is-done' : 'is-new'}`}>{form.live ? 'Live on the website' : 'Not live: preview only'}</span>
        <span className="admin-muted">
          {hasEdits(saved) ? `Changed here (change ${saved.revision})` : 'As built'}
          {changed ? ' · unsaved changes' : ''}
        </span>
        <span className="form-editor-actions">
          <a className="btn btn-secondary btn-sm" href={viewHref} target="_blank" rel="noopener">
            <Eye size={15} aria-hidden="true" /> View on the website
          </a>
          {canEdit ? (
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={putBack} disabled={busy || !hasEdits(saved)}>
                <RotateCcw size={15} aria-hidden="true" /> Put back as built
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={busy || !changed}>
                <Save size={15} aria-hidden="true" /> {busy ? 'Saving…' : 'Save changes'}
              </button>
            </>
          ) : null}
        </span>
      </div>
      {!canEdit ? <p className="admin-muted">Only an administrator can change forms. You can read the form and its preview.</p> : null}
      {status ? <p className="admin-muted" role="status">{status}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="form-editor-layout">
        <div className="form-editor-panel">
          <details className="connection-group" open>
            <summary><h2>The page</h2></summary>
            <label className="form-editor-label">
              Title
              <input value={draft.title ?? form.title} onChange={(e) => set('title', e.target.value)} disabled={disabled} />
            </label>
            <label className="form-editor-label">
              Short name (used in &quot;We have your …&quot;)
              <input value={draft.shortTitle ?? form.shortTitle} onChange={(e) => set('shortTitle', e.target.value)} disabled={disabled} />
            </label>
            <label className="form-editor-label">
              Line under the title
              <textarea rows={2} value={draft.lead ?? form.lead} onChange={(e) => set('lead', e.target.value)} disabled={disabled} />
            </label>
            <label className="form-editor-label">
              Introduction (leave a blank line between paragraphs)
              <textarea rows={6} value={(draft.intro ?? form.intro).join('\n\n')} onChange={(e) => set('intro', paragraphs(e.target.value))} disabled={disabled} />
            </label>
          </details>

          {form.sections.map((section) => (
            <details className="connection-group" key={section.id}>
              <summary>
                <h2>{(draft.sections || {})[section.id]?.title || section.title}</h2>
                <span className="admin-muted">{section.fields.length + added.filter((q) => q.section === section.id).length} questions</span>
              </summary>
              <label className="form-editor-label">
                Section heading
                <input value={(draft.sections || {})[section.id]?.title ?? section.title} onChange={(e) => setSection(section.id, e.target.value)} disabled={disabled} />
              </label>
              {section.showIf ? <p className="admin-muted">Shown only when {section.showIf.field} is {[].concat(section.showIf.equals).join(' or ')}.</p> : null}

              {section.fields.map((field) => {
                const can = fieldAbilities(form, field, locked);
                const c = fieldDraft(field.id);
                const hidden = c.hidden === true;
                return (
                  <div className={`form-editor-field${hidden ? ' is-hidden' : ''}`} key={field.id}>
                    <div className="form-editor-field-head">
                      <span className="admin-muted">{field.type}</span>
                      {can.locked ? <span className="admin-muted" title="Other questions or the reply email depend on it">· needed</span> : null}
                      {can.required ? (
                        <label className="form-editor-check">
                          <input type="checkbox" checked={c.required ?? Boolean(field.required)} onChange={(e) => setField(field.id, { required: e.target.checked })} disabled={disabled || hidden} /> Must answer
                        </label>
                      ) : null}
                      {can.hidden ? (
                        <label className="form-editor-check">
                          <input type="checkbox" checked={hidden} onChange={(e) => setField(field.id, { hidden: e.target.checked })} disabled={disabled} /> Hide
                        </label>
                      ) : null}
                    </div>
                    {can.label ? (
                      <input aria-label="Question" value={c.label ?? field.label} onChange={(e) => setField(field.id, { label: e.target.value })} disabled={disabled || hidden} />
                    ) : null}
                    {can.text ? (
                      <textarea aria-label="Note" rows={3} value={c.text ?? field.text} onChange={(e) => setField(field.id, { text: e.target.value })} disabled={disabled || hidden} />
                    ) : null}
                    {can.help ? (
                      <input aria-label="Help text" placeholder="Help text under the question (optional)" value={c.help ?? field.help ?? ''} onChange={(e) => setField(field.id, { help: e.target.value })} disabled={disabled || hidden} />
                    ) : null}
                    {can.options ? (
                      <label className="form-editor-label">
                        Choices, one per line
                        <textarea rows={Math.min(8, field.options.length + 1)} value={(c.options ?? field.options).join('\n')} onChange={(e) => setField(field.id, { options: e.target.value.split('\n') })} onBlur={(e) => setField(field.id, { options: lines(e.target.value) })} disabled={disabled || hidden} />
                      </label>
                    ) : null}
                    {can.optionText ? (
                      <div className="form-editor-options">
                        {field.options.map((o) => {
                          const v = optionValue(o);
                          const t = (c.optionText || {})[v] || {};
                          const setText = (change) => setField(field.id, { optionText: { ...(c.optionText || {}), [v]: { ...t, ...change } } });
                          return (
                            <div key={v}>
                              <input aria-label="Choice" value={t.label ?? optionLabel(o)} onChange={(e) => setText({ label: e.target.value })} disabled={disabled || hidden} />
                              {typeof o !== 'string' ? (
                                <input aria-label="Choice description" placeholder="Description (optional)" value={t.description ?? o.description ?? ''} onChange={(e) => setText({ description: e.target.value })} disabled={disabled || hidden} />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {added.filter((q) => q.section === section.id).map((q) => {
                const update = (change) => setAdded(added.map((x) => (x.id === q.id ? { ...x, ...change } : x)));
                const choice = ['select', 'radio', 'checkboxes'].includes(q.type);
                return (
                  <div className="form-editor-field is-added" key={q.id}>
                    <div className="form-editor-field-head">
                      <select aria-label="Kind of question" value={q.type} onChange={(e) => update({ type: e.target.value })} disabled={disabled}>
                        {ADDED_TYPES.map(([t, label]) => <option key={t} value={t}>{label}</option>)}
                      </select>
                      {q.type !== 'note' ? (
                        <label className="form-editor-check">
                          <input type="checkbox" checked={Boolean(q.required)} onChange={(e) => update({ required: e.target.checked })} disabled={disabled} /> Must answer
                        </label>
                      ) : null}
                      <button type="button" className="link-button" onClick={() => setAdded(added.filter((x) => x.id !== q.id))} disabled={disabled}>
                        <Trash2 size={14} aria-hidden="true" /> Remove
                      </button>
                    </div>
                    {q.type === 'note' ? (
                      <textarea aria-label="Note" rows={3} placeholder="The note customers read" value={q.text || ''} onChange={(e) => update({ text: e.target.value })} disabled={disabled} />
                    ) : (
                      <>
                        <input aria-label="New question" placeholder="The question" value={q.label || ''} onChange={(e) => update({ label: e.target.value })} disabled={disabled} />
                        <input aria-label="Help text" placeholder="Help text under the question (optional)" value={q.help || ''} onChange={(e) => update({ help: e.target.value })} disabled={disabled} />
                      </>
                    )}
                    {choice ? (
                      <label className="form-editor-label">
                        Choices, one per line
                        <textarea rows={4} value={(q.options || []).join('\n')} onChange={(e) => update({ options: e.target.value.split('\n') })} onBlur={(e) => update({ options: lines(e.target.value) })} disabled={disabled} />
                      </label>
                    ) : null}
                  </div>
                );
              })}
              {canEdit ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={disabled}
                  onClick={() => setAdded([...added, { id: newQuestionId(form, draft), section: section.id, type: 'text', label: '', required: false }])}
                >
                  <Plus size={15} aria-hidden="true" /> Add a question here
                </button>
              ) : null}
            </details>
          ))}

          <details className="connection-group">
            <summary><h2>Agreement and signature</h2></summary>
            <label className="form-editor-label">
              What the customer ticks
              <textarea rows={2} value={agreement.statement ?? form.agreement.statement} onChange={(e) => setAgreement({ statement: e.target.value })} disabled={disabled} />
            </label>
            {doc ? (
              <>
                <label className="form-editor-label">
                  Document title
                  <input value={agreement.title ?? doc.title} onChange={(e) => setAgreement({ title: e.target.value })} disabled={disabled} />
                </label>
                <p className="admin-muted">
                  Version {doc.version}. Changing the clauses gives it a new change number, which every signed copy records.
                </p>
                {clauses.map((clause, index) => {
                  const update = (change) => setClauses(clauses.map((c, i) => (i === index ? { ...c, ...change } : c)));
                  const move = (to) => {
                    const list = [...clauses];
                    const [item] = list.splice(index, 1);
                    list.splice(to, 0, item);
                    setClauses(list);
                  };
                  return (
                    <div className="form-editor-field" key={index}>
                      <div className="form-editor-field-head">
                        <span className="admin-muted">Clause {index + 1}</span>
                        <button type="button" className="link-button" onClick={() => move(index - 1)} disabled={disabled || index === 0} aria-label="Move up"><ArrowUp size={14} /></button>
                        <button type="button" className="link-button" onClick={() => move(index + 1)} disabled={disabled || index === clauses.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
                        <button type="button" className="link-button" onClick={() => setClauses(clauses.filter((_, i) => i !== index))} disabled={disabled || clauses.length === 1}>
                          <Trash2 size={14} aria-hidden="true" /> Remove
                        </button>
                      </div>
                      <input aria-label="Clause heading" value={clause.heading} onChange={(e) => update({ heading: e.target.value })} disabled={disabled} />
                      <textarea aria-label="Clause text" rows={5} value={clause.text} onChange={(e) => update({ text: e.target.value })} disabled={disabled} />
                    </div>
                  );
                })}
                {canEdit ? (
                  <button type="button" className="btn btn-secondary btn-sm" disabled={disabled} onClick={() => setClauses([...clauses, { heading: `New clause ${clauses.length + 1}`, text: '' }])}>
                    <Plus size={15} aria-hidden="true" /> Add a clause
                  </button>
                ) : null}
              </>
            ) : (
              <p className="admin-muted">This form asks customers to accept Teracom&apos;s Terms and Conditions; their wording is changed on the Terms page, not here.</p>
            )}
          </details>
        </div>

        <div className="form-editor-preview">
          <p className="admin-muted">How customers see it, with the changes above (a test only: nothing is sent from here).</p>
          <div className="form-editor-preview-frame">
            <OnlineForm formKey={form.key} edits={previewEdits} termsVersion={termsVersion} demo />
          </div>
        </div>
      </div>
    </div>
  );
}
