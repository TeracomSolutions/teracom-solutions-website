'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, HardDrive } from 'lucide-react';

import { formatDateTime, humanise } from '@/lib/adminFormat';

// Where a watched site's files live on the server, drawn as the folder
// tree it really is: site folder -> kind folder -> files.
function sizeLabel(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClass(status) {
  if (status === 'new') return 'is-needs_review';
  if (status === 'changed') return 'is-pending';
  if (status === 'missing') return 'is-failed';
  return 'is-approved';
}

export default function AdminResourceTree({ tree, downloadBase }) {
  const [open, setOpen] = useState(() => Object.fromEntries(tree.folders.map((f) => [f.name, true])));

  return (
    <div className="admin-card admin-tree">
      <div className="admin-tree-root">
        <HardDrive size={18} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <strong>{tree.name}</strong>
          <code className="admin-tree-path">{tree.root}</code>
          <span className="admin-muted">{tree.file_count} file{tree.file_count === 1 ? '' : 's'} · {sizeLabel(tree.total_bytes)}</span>
        </div>
      </div>
      {tree.folders.length === 0 && <p className="admin-muted" style={{ margin: '10px 0 0 30px' }}>Nothing collected yet — run a check.</p>}
      <ul className="admin-tree-level">
        {tree.folders.map((folder) => {
          const expanded = open[folder.name] !== false;
          return (
            <li key={folder.name}>
              <button type="button" className="admin-tree-node" onClick={() => setOpen({ ...open, [folder.name]: !expanded })} aria-expanded={expanded}>
                {expanded ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
                {expanded ? <FolderOpen size={16} strokeWidth={1.8} aria-hidden="true" className="admin-tree-folder" /> : <Folder size={16} strokeWidth={1.8} aria-hidden="true" className="admin-tree-folder" />}
                <span className="admin-tree-name">{folder.name}/</span>
                <span className="admin-muted">{folder.files.length} file{folder.files.length === 1 ? '' : 's'} · {sizeLabel(folder.bytes)}</span>
              </button>
              {expanded && (
                <ul className="admin-tree-level">
                  {folder.files.map((file) => (
                    <li key={file.document_id} className="admin-tree-file">
                      <FileText size={15} strokeWidth={1.8} aria-hidden="true" className="admin-tree-fileicon" />
                      <a href={`${downloadBase}/resources/${file.document_id}/download`} target="_blank" rel="noopener noreferrer" className="admin-link admin-tree-name" title={file.title}>
                        {file.name}
                      </a>
                      <span className="admin-muted">{sizeLabel(file.size_bytes)}</span>
                      <span className={`admin-status ${statusClass(file.status)}`}>{humanise(file.status)}</span>
                      {file.sku ? <span className="admin-muted">SKU {file.sku}</span> : <span className="admin-muted">no SKU</span>}
                      {!file.published && <span className="admin-muted">hidden</span>}
                      {!file.exists && <span className="admin-error-inline" style={{ marginLeft: 0 }}>file missing on disk</span>}
                      <span className="admin-muted">{formatDateTime(file.last_changed_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
