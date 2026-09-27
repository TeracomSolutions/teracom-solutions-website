'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { CATEGORIES, MODES, SCOPES, countsSentence, enforcementSentence, labelFor, validateRule } from '@/lib/aiGovernance';

// The rules every AI call follows. Each one is told to the model on every
// request; the filter rules also strip details out of what leaves for a
// provider. The Test box shows exactly what a provider would receive.
async function send(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'The backend did not accept that.');
  return data;
}

const EMPTY = { title: '', rule_text: '', category: 'conduct', mode: 'instruct', scope: 'all' };

function RuleFields({ value, onChange }) {
  const set = (field) => (event) => onChange({ ...value, [field]: event.target.value });
  return (
    <>
      <label>
        Title
        <input value={value.title} onChange={set('title')} maxLength={120} />
      </label>
      <label>
        Rule
        <textarea value={value.rule_text} onChange={set('rule_text')} rows={3} maxLength={1000} />
      </label>
      <div className="admin-gov-selects">
        <label>
          Category
          <select value={value.category} onChange={set('category')}>
            {CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label>
          Enforcement
          <select value={value.mode} onChange={set('mode')}>
            {MODES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label>
          Applies to
          <select value={value.scope} onChange={set('scope')}>
            {SCOPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
      </div>
    </>
  );
}

export default function AdminAiGovernance({ initialRules, providers, loadError }) {
  const [rules, setRules] = useState(initialRules || []);
  const [draft, setDraft] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // { id, ...fields }
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(loadError || '');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const providerKeys = (providers || []).map((p) => p.key || p.provider).filter(Boolean);
  const [testText, setTestText] = useState('');
  const [testProvider, setTestProvider] = useState(providerKeys[0] || 'openai');
  const [testResult, setTestResult] = useState(null);

  async function reload() {
    setRules(await send('/api/admin/ai-connections/governance', 'GET'));
  }

  async function run(label, action, done) {
    setBusy(label);
    setError('');
    setNotice('');
    try {
      await action();
      await reload();
      if (done) setNotice(done);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  function add(event) {
    event.preventDefault();
    const found = validateRule(draft);
    setErrors(found);
    if (found.length) return;
    run('add', () => send('/api/admin/ai-connections/governance', 'POST', { ...draft, enabled: true }), 'Rule added. It applies from the next request.').then(() => setDraft(EMPTY));
  }

  function saveEdit(event) {
    event.preventDefault();
    const found = validateRule(editing);
    setErrors(found);
    if (found.length) return;
    const { id, title, rule_text: ruleText, category, mode, scope } = editing;
    run(`save:${id}`, () => send(`/api/admin/ai-connections/governance/${id}`, 'PUT', { title, rule_text: ruleText, category, mode, scope }), 'Rule saved.').then(() => setEditing(null));
  }

  function toggle(rule) {
    run(`toggle:${rule.id}`, () => send(`/api/admin/ai-connections/governance/${rule.id}`, 'PUT', { enabled: !rule.enabled }));
  }

  function remove(rule) {
    if (!window.confirm(`Delete the rule "${rule.title}"?`)) return;
    run(`delete:${rule.id}`, () => send(`/api/admin/ai-connections/governance/${rule.id}`, 'DELETE'), 'Rule deleted.');
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= rules.length) return;
    const ids = rules.map((r) => r.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run('order', () => send('/api/admin/ai-connections/governance/order', 'PUT', { ids }));
  }

  async function testFilter(event) {
    event.preventDefault();
    setBusy('test');
    setError('');
    setTestResult(null);
    try {
      setTestResult(await send('/api/admin/ai-connections/governance/check', 'POST', { text: testText, provider: testProvider }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <section className="admin-governance">
      <p className="lead">The rules every AI call follows. Each enabled rule is placed in front of the model on every Assistant, Scout and critique request; a rule marked Filter also strips the matching details out of anything before it leaves for a provider.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table admin-gov-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Rule</th>
              <th>Category</th>
              <th>Enforcement</th>
              <th>Applies to</th>
              <th>On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 && <tr><td colSpan={7} className="admin-muted">No rules yet.</td></tr>}
            {rules.map((rule, index) => (
              <tr key={rule.id} className={rule.enabled ? undefined : 'admin-gov-off'}>
                <td>
                  <span className="admin-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => move(index, -1)} disabled={index === 0 || Boolean(busy)} aria-label={`Move ${rule.title} up`}><ArrowUp size={14} strokeWidth={2} aria-hidden="true" /></button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => move(index, 1)} disabled={index === rules.length - 1 || Boolean(busy)} aria-label={`Move ${rule.title} down`}><ArrowDown size={14} strokeWidth={2} aria-hidden="true" /></button>
                  </span>
                </td>
                <td className="wrap">
                  {editing && editing.id === rule.id ? (
                    <form className="admin-form admin-gov-edit" onSubmit={saveEdit}>
                      {errors.length > 0 && <ul className="form-error" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
                      <RuleFields value={editing} onChange={setEditing} />
                      <div className="admin-actions">
                        <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>Save</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setErrors([]); }} disabled={Boolean(busy)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <strong>{rule.title}</strong>
                      <div className="admin-muted">{rule.rule_text}</div>
                      <div className="admin-muted admin-gov-how">{enforcementSentence(rule)}</div>
                    </>
                  )}
                </td>
                <td>{labelFor(CATEGORIES, rule.category)}</td>
                <td>{labelFor(MODES, rule.mode)}</td>
                <td>{labelFor(SCOPES, rule.scope)}</td>
                <td>
                  <button type="button" className={`btn btn-sm ${rule.enabled ? 'btn-primary' : 'btn-secondary'}`} onClick={() => toggle(rule)} disabled={Boolean(busy)} aria-pressed={rule.enabled}>
                    {rule.enabled ? 'On' : 'Off'}
                  </button>
                </td>
                <td>
                  <span className="admin-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing({ ...rule }); setErrors([]); }} disabled={Boolean(busy)}>Edit</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(rule)} disabled={Boolean(busy)}>Delete</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="admin-form admin-card" onSubmit={add}>
        <h3>Add a rule</h3>
        {!editing && errors.length > 0 && <ul className="form-error" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
        <RuleFields value={draft} onChange={setDraft} />
        <p className="admin-muted">Instruction: the rule is told to the model. Filter: the matching details (personal, financial, or passwords and keys) are removed before anything reaches the provider. External providers are Anthropic and the hosted APIs; All includes our own self-hosted models.</p>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy)}>{busy === 'add' ? 'Adding…' : 'Add rule'}</button>
        </div>
      </form>

      <form className="admin-form admin-card" onSubmit={testFilter}>
        <h3>Test the filter</h3>
        <label>
          Text to test
          <textarea value={testText} onChange={(e) => setTestText(e.target.value)} rows={4} maxLength={20000} placeholder="Paste anything: a customer note, an email, a lead. Nothing typed here is stored." />
        </label>
        <label>
          As sent to
          <select value={testProvider} onChange={(e) => setTestProvider(e.target.value)}>
            {(providerKeys.length ? providerKeys : ['openai', 'anthropic', 'ollama']).map((key) => <option key={key} value={key}>{(providers || []).find((p) => (p.key || p.provider) === key)?.label || key}</option>)}
          </select>
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={Boolean(busy) || !testText.trim()}>{busy === 'test' ? 'Checking…' : 'Show what the provider would receive'}</button>
        </div>
        {testResult && (
          <div className="admin-gov-result">
            <p className="admin-muted">{testResult.summary || countsSentence(testResult.counts)}{testResult.categories?.length ? ` (filters on for this provider: ${testResult.categories.map((c) => labelFor(CATEGORIES, c).toLowerCase()).join(', ')})` : ' (no filters apply to this provider)'}</p>
            <pre>{testResult.clean}</pre>
          </div>
        )}
      </form>
    </section>
  );
}
