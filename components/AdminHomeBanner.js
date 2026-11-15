'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

// Resources > Home banner: what the big rotating banner at the top of the public home page shows and how long
// each slide stays (backend services/home_banner.py). Nothing changes on the website until Save.

const PICTURES = [
  ['/assets/hero-tera-intelligence.webp', 'Tera: real intelligence'],
  ['/assets/hero-bigger-together.webp', 'Tera over a city at sunset'],
  ['/assets/hero-stronger-together.webp', 'Tera training'],
  ['/assets/hero-security-command-centre.webp', 'Tera at a security command centre'],
  ['/assets/teracom-ai-command-centre.webp', 'Tera at a Teracom AI desk'],
  ['/assets/teracom-ai-ask-tera.webp', 'Ask Tera'],
  ['/assets/teracom-on-site.webp', 'Tera on a building site'],
  ['/assets/teracom-storefront-van.webp', 'Teracom storefront and van'],
  ['/assets/teracom-mascot-store.webp', 'Tera in the store'],
  ['/assets/store-preview.svg', 'Store preview drawing'],
  ['/assets/hero-technology.svg', 'Technology drawing'],
];
const KNOWN = new Set(PICTURES.map(([path]) => path));

const NEW_SLIDE = {
  enabled: true, place: 'after_news', eyebrow: 'Teracom', headline: '', body: '', image: PICTURES[0][0], imageAlt: '',
  ctaHref: '/contact', ctaLabel: 'Get in Touch', secondaryHref: '', secondaryLabel: '',
};

function Field({ label, help, children }) {
  return (
    <label className="form-editor-label">{label}
      {children}
      {help ? <span className="admin-muted">{help}</span> : null}
    </label>
  );
}

function SlideEditor({ slide, onChange }) {
  const custom = !KNOWN.has(slide.image);
  const set = (key) => (e) => onChange({ [key]: e.target.value });
  return (
    <div className="banner-editor">
      <div className="ads-form-row">
        <Field label="Small heading above the headline"><input type="text" maxLength={60} value={slide.eyebrow} onChange={set('eyebrow')} /></Field>
        <Field label="Where it sits">
          <select value={slide.place} onChange={set('place')}>
            <option value="first">First, before the news (always shown)</option>
            <option value="after_news">After the news (when there is room)</option>
          </select>
        </Field>
        <Field label="Picture">
          <select value={custom ? 'other' : slide.image} onChange={(e) => onChange({ image: e.target.value === 'other' ? 'https://' : e.target.value })}>
            {PICTURES.map(([path, name]) => <option key={path} value={path}>{name}</option>)}
            <option value="other">Another picture (web address)</option>
          </select>
        </Field>
      </div>
      {custom ? <Field label="Picture web address" help="Must start with https://"><input type="url" maxLength={400} value={slide.image} onChange={set('image')} /></Field> : null}
      <Field label={`Headline (${slide.headline.length} of 120)`} help="Keep it under about 95 characters so it fits on a phone."><input type="text" maxLength={120} value={slide.headline} onChange={set('headline')} /></Field>
      <Field label={`Text under the headline (${slide.body.length} of 400)`}><textarea rows={3} maxLength={400} value={slide.body} onChange={set('body')} /></Field>
      <Field label="What the picture shows (for screen readers)"><input type="text" maxLength={200} value={slide.imageAlt} onChange={set('imageAlt')} /></Field>
      <div className="ads-form-row banner-buttons">
        <Field label="Main button wording"><input type="text" maxLength={40} value={slide.ctaLabel} onChange={set('ctaLabel')} /></Field>
        <Field label="Main button goes to" help="A page on the website such as /store, or https://"><input type="text" maxLength={400} value={slide.ctaHref} onChange={set('ctaHref')} /></Field>
        <span />
        <Field label="Second button wording (optional)"><input type="text" maxLength={40} value={slide.secondaryLabel || ''} onChange={set('secondaryLabel')} /></Field>
        <Field label="Second button goes to"><input type="text" maxLength={400} value={slide.secondaryHref || ''} onChange={set('secondaryHref')} /></Field>
      </div>
    </div>
  );
}

export default function AdminHomeBanner({ initial, saved, industries }) {
  const [form, setForm] = useState(initial);
  const [isSaved, setIsSaved] = useState(saved);
  const [open, setOpen] = useState(null);
  const [state, setState] = useState('');
  const [problem, setProblem] = useState('');

  const set = (changes) => { setForm((f) => ({ ...f, ...changes })); setState(''); };
  const setSlide = (i, changes) => set({ slides: form.slides.map((s, n) => (n === i ? { ...s, ...changes } : s)) });
  const move = (i, by) => {
    const slides = [...form.slides];
    const j = i + by;
    if (j < 0 || j >= slides.length) return;
    [slides[i], slides[j]] = [slides[j], slides[i]];
    set({ slides });
    setOpen(open === i ? j : open === j ? i : open);
  };
  const toggleIndustry = (id) => {
    const on = form.news_industries.includes(id);
    set({ news_industries: on ? form.news_industries.filter((x) => x !== id) : industries.map((x) => x.id).filter((x) => x === id || form.news_industries.includes(x)) });
  };

  async function send(method, body) {
    setState('saving');
    setProblem('');
    try {
      const res = await fetch('/api/admin/home-banner', {
        method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'That could not be saved.');
      return data;
    } catch (e) {
      setProblem(e.message);
      setState('');
      return null;
    }
  }

  async function save() {
    const data = await send('PUT', form);
    if (!data) return;
    if (data.banner) setForm(data.banner);
    setIsSaved(true);
    setState('saved');
  }

  async function reset() {
    if (!window.confirm('Put the home page banner back to the one built into the website? Your slides and settings here will be removed.')) return;
    const data = await send('DELETE');
    if (!data) return;
    window.location.reload();
  }

  const first = form.slides.filter((s) => s.enabled && s.place === 'first').length;
  const cycle = Number(form.dwell_seconds) * Number(form.total_slides);

  return (
    <div className="banner-page">
      {!isSaved ? <p className="form-note-banner" role="status">This is the banner built into the website. Change anything and press Save to start keeping your own.</p> : null}

      <fieldset className="banner-set">
        <legend>Timing and size</legend>
        <div className="ads-form-row">
          <Field label="Seconds each slide stays (dwell time)" help="3 to 60. It was 6.">
            <input type="number" min={3} max={60} value={form.dwell_seconds} onChange={(e) => set({ dwell_seconds: e.target.value })} />
          </Field>
          <Field label="Slides in the banner" help="Teracom slides and news together, 1 to 12.">
            <input type="number" min={1} max={12} value={form.total_slides} onChange={(e) => set({ total_slides: e.target.value })} />
          </Field>
          <p className="admin-muted banner-note">A full turn of the banner takes about {Number.isFinite(cycle) ? cycle : 0} seconds. Visitors can also step through with the arrows and dots; it does not move by itself for people who ask their device for less motion.</p>
        </div>
      </fieldset>

      <fieldset className="banner-set">
        <legend>Teracom slides</legend>
        <p className="admin-muted">Slides set to First always show, in this order, before any news. Slides set to After the news fill the places the news does not use.</p>
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-compact admin-lines banner-slides">
            <colgroup><col className="col-on" /><col /><col className="col-place" /><col className="col-move" /></colgroup>
            <thead><tr><th>Show</th><th>Slide</th><th>Where</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {form.slides.map((s, i) => (
                <tr key={s.id} className={open === i ? 'is-open' : undefined}>
                  <td><input type="checkbox" checked={s.enabled} onChange={(e) => setSlide(i, { enabled: e.target.checked })} aria-label={`Show ${s.headline || 'this slide'}`} /></td>
                  <td className="banner-wrap">
                    <button type="button" className="banner-open" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                      <span className="admin-muted">{s.eyebrow}</span> {s.headline || <em>New slide: add a headline</em>}
                    </button>
                    {open === i ? <SlideEditor slide={s} onChange={(changes) => setSlide(i, changes)} /> : null}
                  </td>
                  <td>{s.place === 'first' ? 'First' : 'After the news'}</td>
                  <td className="banner-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(open === i ? null : i)}>{open === i ? 'Done' : 'Edit'}</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} aria-hidden="true" /></button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => move(i, 1)} disabled={i === form.slides.length - 1} aria-label="Move down"><ArrowDown size={14} aria-hidden="true" /></button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { set({ slides: form.slides.filter((_, n) => n !== i) }); setOpen(null); }} disabled={form.slides.length === 1} aria-label="Remove this slide"><Trash2 size={14} aria-hidden="true" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-sm" disabled={form.slides.length >= 12}
            onClick={() => { set({ slides: [...form.slides, { ...NEW_SLIDE, id: `slide-${Date.now().toString(36)}` }] }); setOpen(form.slides.length); }}>
            <Plus size={14} aria-hidden="true" /> Add a slide
          </button>
        </div>
      </fieldset>

      <fieldset className="banner-set">
        <legend>Industry news in the banner</legend>
        <label className="form-editor-check"><input type="checkbox" checked={form.news_enabled} onChange={(e) => set({ news_enabled: e.target.checked })} /> Fill the banner with the newest industry news after the First slides</label>
        {form.news_enabled ? (
          <>
            <p className="admin-muted">One newest story from each ticked industry, in this order, until the banner is full ({Math.max(0, Number(form.total_slides) - first)} places after your First slides). The publications themselves are on the Industry news tab.</p>
            <div className="banner-industries">
              {industries.map((x) => (
                <label key={x.id} className="form-editor-check"><input type="checkbox" checked={form.news_industries.includes(x.id)} onChange={() => toggleIndustry(x.id)} /> {x.label}</label>
              ))}
            </div>
          </>
        ) : <p className="admin-muted">Only Teracom slides will show.</p>}
      </fieldset>

      <fieldset className="banner-set">
        <legend>News line under the banner</legend>
        <label className="form-editor-check"><input type="checkbox" checked={form.ticker_enabled} onChange={(e) => set({ ticker_enabled: e.target.checked })} /> Show the scrolling line of live headlines under the banner</label>
        {form.ticker_enabled ? (
          <div className="ads-form-row">
            <Field label="Seconds for the line to scroll past once" help="20 to 300. Lower is faster. It was 70.">
              <input type="number" min={20} max={300} value={form.ticker_seconds} onChange={(e) => set({ ticker_seconds: e.target.value })} />
            </Field>
          </div>
        ) : null}
      </fieldset>

      {problem ? <p className="form-error" role="alert">{problem}</p> : null}
      <div className="admin-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save'}</button>
        <a className="btn btn-secondary btn-sm" href="/" target="_blank" rel="noopener noreferrer">Open the home page</a>
        {isSaved ? <button type="button" className="btn btn-secondary btn-sm" onClick={reset} disabled={state === 'saving'}>Back to the built-in banner</button> : null}
        {state === 'saved' ? <span className="admin-muted" role="status">Saved. The home page shows it straight away.</span> : null}
      </div>
    </div>
  );
}
