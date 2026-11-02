'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FolderPlus, FolderOpen, Save } from 'lucide-react';
import { addSection, emptyProject, toolTitle, updateSection } from '@/lib/toolProject';
import { loadProject, saveProject } from '@/lib/toolProjectStore';

// Wraps every calculator on /tools/<slug> (Robert, 2026-11-02): "Add to project"
// saves what was entered and the results into the visitor's project; opened from
// the project with ?section=<id>, it loads that section back in and "Update in
// project" saves the changes over it.
const ProjectContext = createContext(null);

// Each calculator calls this with its current inputs and a function that puts
// saved inputs back, so a section can be reopened exactly as it was.
export function useProjectState(state, apply) {
  const register = useContext(ProjectContext);
  const latest = useRef({ state, apply });
  useEffect(() => {
    latest.current = { state, apply };
  });
  useEffect(() => {
    if (!register) return undefined;
    return register({ get: () => latest.current.state, set: (saved) => latest.current.apply(saved) });
  }, [register]);
}

const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();

function controlText(control) {
  if (!control) return '';
  if (control.tagName === 'SELECT') return clean(control.options[control.selectedIndex]?.text);
  return clean(control.value);
}

// What the visitor sees, read off the page: each field's label and value, each
// repeated row as one line, and every result line. This is what the report shows;
// the calculator's own state (above) is what reopening uses.
function readPage(root) {
  const inputs = [];
  const results = [];
  const calculator = root?.querySelector('.calculator');
  if (!calculator) return { inputs, results };
  let rowHeading = 'Item';
  let rowNumber = 0;
  for (const node of calculator.children) {
    if (node.tagName === 'H2' && !node.closest('.calculator-results')) {
      rowHeading = clean(node.textContent).replace(/s$/, '') || 'Item';
      rowNumber = 0;
    } else if (node.classList.contains('field')) {
      const label = clean(node.querySelector('label')?.textContent);
      if (label) inputs.push({ label, value: controlText(node.querySelector('input, select, textarea')) });
    } else if (node.classList.contains('calculator-row')) {
      rowNumber += 1;
      const parts = [...node.querySelectorAll('.field')].map((field) => `${clean(field.querySelector('label')?.textContent)}: ${controlText(field.querySelector('input, select, textarea'))}`);
      inputs.push({ label: `${rowHeading} ${rowNumber}`, value: parts.join('; ') });
    }
  }
  for (const line of calculator.querySelectorAll('.calculator-results p')) {
    const strong = [...line.querySelectorAll('strong')].map((s) => clean(s.textContent));
    const all = clean(line.textContent);
    if (line.classList.contains('form-note-banner')) results.push({ warn: all });
    else if (line.classList.contains('form-note')) results.push({ note: all });
    else if (strong.length) {
      const label = clean(all.split(strong[0])[0]).replace(/[:\s]+$/, '');
      results.push(label ? { label, value: clean(all.slice(all.indexOf(strong[0]))) } : { note: all });
    } else if (all) results.push({ note: all });
  }
  return { inputs, results };
}

export default function ToolProjectFrame({ slug, children }) {
  const root = useRef(null);
  const calculator = useRef(null);
  const [count, setCount] = useState(null);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [label, setLabel] = useState('');

  const register = useCallback((api) => {
    calculator.current = api;
    return () => {
      if (calculator.current === api) calculator.current = null;
    };
  }, []);

  // Read the project once the page is in the browser; if the address names one of
  // its sections, put that section's inputs back into the calculator.
  useEffect(() => {
    const project = loadProject();
    setCount(project?.sections.length || 0);
    const id = new URLSearchParams(window.location.search).get('section');
    const section = id && project?.sections.find((s) => s.id === id && s.slug === slug);
    if (!section) return undefined;
    setEditing(section);
    setLabel(section.label);
    const timer = window.setTimeout(() => calculator.current?.set(section.state || {}), 0);
    return () => window.clearTimeout(timer);
  }, [slug]);

  const capture = () => ({ slug, label: clean(label), state: calculator.current?.get() || {}, ...readPage(root.current) });

  const save = (asNew) => {
    try {
      const project = loadProject() || emptyProject();
      let next;
      if (editing && !asNew && project.sections.some((s) => s.id === editing.id)) {
        next = updateSection(project, editing.id, capture());
        setMessage('Saved over this result in your project.');
      } else {
        const added = addSection(project, capture());
        next = added.project;
        const section = next.sections.find((s) => s.id === added.id);
        setEditing(section);
        window.history.replaceState(null, '', `${window.location.pathname}?section=${added.id}`);
        setMessage(`Added to your project as result ${next.sections.length}.`);
      }
      if (!saveProject(next)) setMessage('Your browser would not let the project be saved. Turn off private browsing, or allow this site to store data, and try again.');
      setCount(next.sections.length);
    } catch (error) {
      setMessage(error.message || 'That could not be saved.');
    }
  };

  return (
    <div ref={root}>
      {children}
      <div className="container tool-project-bar print-hide">
        <div className="tool-project-bar-text">
          <strong>{editing ? `Editing "${editing.label || toolTitle(slug)}" in your project` : 'Building a bigger job?'}</strong>
          <span>
            {editing
              ? 'Change the figures above, then save them over this result, or keep both by saving a new one.'
              : 'Add these figures to a project, then add results from any of the other calculators. The project becomes one report you can save as a PDF and import again later to make changes.'}
          </span>
        </div>
        <div className="tool-project-bar-actions">
          <label className="tool-project-label">
            <span>Name this result (optional)</span>
            <input type="text" value={label} maxLength={200} placeholder="e.g. Warehouse cameras" onChange={(e) => setLabel(e.target.value)} />
          </label>
          {editing ? (
            <>
              <button type="button" className="btn btn-primary" onClick={() => save(false)}>
                <Save size={18} strokeWidth={2} aria-hidden="true" /> Update in project
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => save(true)}>
                Save as a new result
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => save(false)}>
              <FolderPlus size={18} strokeWidth={2} aria-hidden="true" /> Add to project
            </button>
          )}
          <Link className="btn btn-secondary" href="/tools/project">
            <FolderOpen size={18} strokeWidth={2} aria-hidden="true" /> Open project{count ? ` (${count})` : ''}
          </Link>
        </div>
        {message ? <p className="form-note" role="status">{message}</p> : null}
      </div>
    </div>
  );
}
