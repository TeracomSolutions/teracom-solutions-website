'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, FileDown, FileUp, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  emptyProject,
  fileNameFor,
  moveSection,
  parseProject,
  removeSection,
  sectionTitle,
  serializeProject,
  toolTitle,
  updateDetails,
  updateSection,
} from '@/lib/toolProject';
import { clearProject, loadProject, saveProject } from '@/lib/toolProjectStore';
import { toolGroups, tools } from '@/lib/tools';

// /tools/project (Robert, 2026-11-02): every result added from the calculators,
// in one report. Details and notes are typed here; each result can be reopened in
// its calculator to change it. Save as PDF makes one document with the project
// tucked inside it, so importing that PDF later carries on where it left off.
function download(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// The site logo is a 1 MB picture; a 480 px copy keeps the PDF small and still sharp in print.
async function smallLogo() {
  try {
    const image = new window.Image();
    image.src = '/assets/teracom-logo.png';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = Math.round((480 * image.naturalHeight) / image.naturalWidth);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    return blob ? await blob.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function Lines({ lines }) {
  return (
    <dl className="tool-project-lines">
      {lines.map((line, i) =>
        line.warn ? (
          <p className="form-note-banner" key={i}>{line.warn}</p>
        ) : line.note ? (
          <p className="form-note" key={i}>{line.note}</p>
        ) : (
          <div key={i}>
            <dt>{line.label}</dt>
            <dd>{line.value}</dd>
          </div>
        )
      )}
    </dl>
  );
}

export default function ToolProject() {
  const [project, setProject] = useState(null);
  const [stored, setStored] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    setProject(loadProject() || emptyProject());
  }, []);

  const commit = (next) => {
    setProject(next);
    setStored(saveProject(next));
  };

  if (!project) return <div className="container tool-project"><p>Loading your project...</p></div>;

  const field = (key, label, placeholder) => (
    <div className="field">
      <label htmlFor={`project-${key}`}>{label}</label>
      <input id={`project-${key}`} type="text" maxLength={200} value={project[key]} placeholder={placeholder} onChange={(e) => commit(updateDetails(project, { [key]: e.target.value }))} />
    </div>
  );

  const savePdf = async () => {
    setBusy('pdf');
    setMessage('');
    try {
      const { makeProjectPdf } = await import('@/lib/toolProjectPdf');
      const logo = await smallLogo();
      const bytes = await makeProjectPdf(project, logo);
      download(bytes, fileNameFor(project, 'pdf'), 'application/pdf');
      setMessage('PDF saved. Keep it: importing it here later brings the whole project back to change.');
    } catch {
      setMessage('The PDF could not be made. Try again, or save the project file instead.');
    } finally {
      setBusy('');
    }
  };

  const saveFile = () => download(serializeProject(project), fileNameFor(project, 'json'), 'application/json');

  const accept = (incoming) => {
    commit(incoming);
    setPending(null);
    setMessage(`Imported "${incoming.name || 'project'}" with ${incoming.sections.length} result${incoming.sections.length === 1 ? '' : 's'}. Change anything, then save it again.`);
  };

  const importFile = async (file) => {
    if (!file) return;
    setBusy('import');
    setMessage('');
    try {
      let incoming = null;
      if (file.size > 15 * 1024 * 1024) throw new Error('That file is too large to be a project.');
      const bytes = new Uint8Array(await file.arrayBuffer());
      const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
      if (isPdf) {
        const { readProjectPdf } = await import('@/lib/toolProjectPdf');
        incoming = await readProjectPdf(bytes);
        if (!incoming) throw new Error('That PDF has no project inside it. Only PDFs saved from this page can be imported.');
      } else {
        incoming = parseProject(new TextDecoder().decode(bytes));
        if (!incoming) throw new Error('That file is not a Teracom tools project.');
      }
      if (project.sections.length) setPending(incoming);
      else accept(incoming);
    } catch (error) {
      setMessage(error.message || 'That file could not be read.');
    } finally {
      setBusy('');
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const startAgain = () => {
    clearProject();
    setProject(emptyProject());
    setConfirmClear(false);
    setMessage('Started a new, empty project.');
  };

  return (
    <div className="container tool-project">
      <div className="tool-project-actions">
        <button type="button" className="btn btn-primary" onClick={savePdf} disabled={busy !== '' || !project.sections.length}>
          <FileDown size={18} strokeWidth={2} aria-hidden="true" /> {busy === 'pdf' ? 'Making the PDF...' : 'Save as PDF'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => fileInput.current?.click()} disabled={busy !== ''}>
          <FileUp size={18} strokeWidth={2} aria-hidden="true" /> {busy === 'import' ? 'Reading...' : 'Import a saved project'}
        </button>
        <input ref={fileInput} type="file" accept="application/pdf,.pdf,application/json,.json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
        <button type="button" className="btn btn-secondary" onClick={saveFile} disabled={!project.sections.length}>
          Save project file
        </button>
      </div>
      {message ? <p className="form-note tool-project-message" role="status">{message}</p> : null}
      {!stored ? (
        <p className="form-note-banner" role="status">
          Your browser is not letting this site store the project, so it will be lost when you leave this page. Save it as a PDF before you go, or allow this site to store data.
        </p>
      ) : null}
      {pending ? (
        <div className="form-note-banner tool-project-confirm" role="alert">
          <p>
            Replace your current project ({project.sections.length} result{project.sections.length === 1 ? '' : 's'}) with &quot;{pending.name || 'the imported project'}&quot; ({pending.sections.length})?
          </p>
          <button type="button" className="btn btn-primary" onClick={() => accept(pending)}>Replace it</button>
          <button type="button" className="btn btn-secondary" onClick={() => setPending(null)}>Keep my current project</button>
        </div>
      ) : null}

      <div className="calculator tool-project-details">
        <h2>Project details</h2>
        {field('name', 'Project name', 'e.g. Smith Street warehouse security upgrade')}
        {field('client', 'Client', 'Who the report is for')}
        {field('site', 'Site', 'Address or site name')}
        {field('preparedBy', 'Prepared by', 'Your name or company')}
        <div className="field">
          <label htmlFor="project-notes">Notes for the report</label>
          <textarea id="project-notes" rows={4} maxLength={4000} value={project.notes} onChange={(e) => commit(updateDetails(project, { notes: e.target.value }))} />
        </div>
      </div>

      <h2 className="tool-project-heading">Results ({project.sections.length})</h2>
      {!project.sections.length ? (
        <p className="tool-project-empty">
          Nothing here yet. Open any calculator below, enter your figures and press <strong>Add to project</strong>. Each result you add appears here, in order, and they all go into one PDF.
        </p>
      ) : null}

      <ol className="tool-project-sections">
        {project.sections.map((section, i) => (
          <li className="tool-project-section" key={section.id}>
            <div className="tool-project-section-head">
              <div>
                <span className="eyebrow">{i + 1}. {toolTitle(section.slug)}</span>
                <input
                  className="tool-project-section-name"
                  type="text"
                  maxLength={200}
                  aria-label="Result name"
                  value={section.label}
                  placeholder={toolTitle(section.slug)}
                  onChange={(e) => commit(updateSection(project, section.id, { label: e.target.value }))}
                />
              </div>
              <div className="tool-project-section-buttons">
                <Link className="btn btn-primary" href={`/tools/${section.slug}?section=${section.id}`}>
                  <Pencil size={16} strokeWidth={2} aria-hidden="true" /> Change figures
                </Link>
                <button type="button" className="btn btn-secondary" aria-label={`Move ${sectionTitle(section)} up`} disabled={i === 0} onClick={() => commit(moveSection(project, section.id, -1))}>
                  <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                <button type="button" className="btn btn-secondary" aria-label={`Move ${sectionTitle(section)} down`} disabled={i === project.sections.length - 1} onClick={() => commit(moveSection(project, section.id, 1))}>
                  <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                <button type="button" className="btn btn-secondary" aria-label={`Remove ${sectionTitle(section)}`} onClick={() => commit(removeSection(project, section.id))}>
                  <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="tool-project-section-body">
              <div>
                <h3>Figures entered</h3>
                <Lines lines={section.inputs} />
              </div>
              <div>
                <h3>Results</h3>
                <Lines lines={section.results} />
              </div>
            </div>
            <div className="field">
              <label htmlFor={`notes-${section.id}`}>Notes for this result</label>
              <textarea id={`notes-${section.id}`} rows={2} maxLength={4000} value={section.notes} onChange={(e) => commit(updateSection(project, section.id, { notes: e.target.value }))} />
            </div>
          </li>
        ))}
      </ol>

      <div className="tool-project-add">
        <h2>
          <Plus size={20} strokeWidth={2} aria-hidden="true" /> Add a result from a calculator
        </h2>
        {toolGroups.map((group) => (
          <div key={group.id} className="tool-project-add-group">
            <h3>{group.eyebrow}</h3>
            <div className="tool-project-add-links">
              {tools.filter((tool) => tool.group === group.id).map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>{tool.title}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tool-project-footer">
        <p className="form-note">
          Your project is kept only in this browser on this device; nothing is sent to Teracom. To move it to another device or keep a copy, save it as a PDF (or a project file) and import it there.
        </p>
        {confirmClear ? (
          <>
            <button type="button" className="btn btn-primary" onClick={startAgain}>Yes, clear everything</button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(false)}>Keep it</button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)} disabled={!project.sections.length && !project.name}>
            Start a new project
          </button>
        )}
      </div>
    </div>
  );
}
