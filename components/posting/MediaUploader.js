'use client';

import { useEffect, useRef, useState } from 'react';

import { ACCEPT, canAdd, durationLabel, kindOf, sizeLabel, tooBig } from '@/lib/mediaFormat';

// Pictures or one video for a post. Files go from the browser straight to the
// backend with a short-lived ticket (the website's own server has a 4.5 MB
// request limit); the backend answers with the stored item.
function sendFile(url, file, ticket, onProgress) {
  return new Promise((resolve) => {
    const form = new FormData();
    form.append('file', file);
    form.append('ticket', ticket);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'json';
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response;
      if (xhr.status === 200 && body && body.id) resolve({ item: body });
      else resolve({ error: (body && typeof body.detail === 'string' && body.detail) || 'The upload failed.' });
    };
    xhr.onerror = () => resolve({ error: 'The upload failed. Check the connection and try again.' });
    xhr.send(form);
  });
}

export default function MediaUploader({ media, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [errors, setErrors] = useState([]);
  const [altDrafts, setAltDrafts] = useState({});
  const inputRef = useRef(null);
  const mediaRef = useRef(media);
  const pendingRef = useRef([]);
  const counterRef = useRef(0);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  function setMedia(next) {
    mediaRef.current = next;
    onChange(next);
  }

  function addError(message) {
    setErrors((current) => [...current, message]);
  }

  async function uploadFile(file) {
    const key = (counterRef.current += 1);
    const kind = kindOf(file);
    pendingRef.current = [...pendingRef.current, { key, kind }];
    setUploads((current) => [...current, { key, name: file.name, progress: 0 }]);
    try {
      const ticketResponse = await fetch('/api/admin/social/media/ticket', { method: 'POST' });
      const ticketData = await ticketResponse.json().catch(() => ({}));
      if (!ticketResponse.ok) {
        addError(`${file.name}: ${ticketData.error || 'The upload could not start.'}`);
        return;
      }
      const big = tooBig(file, ticketData.max_image_bytes, ticketData.max_video_bytes);
      if (big) {
        addError(`${file.name}: ${big}`);
        return;
      }
      const result = await sendFile(ticketData.upload_url, file, ticketData.ticket, (progress) => {
        setUploads((current) => current.map((u) => (u.key === key ? { ...u, progress } : u)));
      });
      if (result.item) setMedia([...mediaRef.current, result.item]);
      else addError(`${file.name}: ${result.error}`);
    } catch {
      addError(`${file.name}: The upload failed.`);
    } finally {
      pendingRef.current = pendingRef.current.filter((p) => p.key !== key);
      setUploads((current) => current.filter((u) => u.key !== key));
    }
  }

  async function processFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setErrors([]);
    for (const file of files) {
      const existing = [...mediaRef.current, ...pendingRef.current.map((p) => ({ kind: p.kind }))];
      const problem = canAdd(existing, file);
      if (problem) {
        addError(`${file.name}: ${problem}`);
        continue;
      }
      await uploadFile(file);
    }
  }

  async function handleRemove(id) {
    try {
      const response = await fetch(`/api/admin/social/media/${id}`, { method: 'DELETE' });
      if (response.status === 409) {
        addError('This file is used by a saved post.');
        return;
      }
      if (!response.ok) {
        addError('The file could not be removed.');
        return;
      }
      setMedia(mediaRef.current.filter((item) => item.id !== id));
    } catch {
      addError('The file could not be removed.');
    }
  }

  async function saveAltText(item) {
    const draft = altDrafts[item.id];
    if (draft === undefined || draft === (item.alt_text || '')) return;
    try {
      const response = await fetch(`/api/admin/social/media/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: draft }),
      });
      if (!response.ok) throw new Error('not saved');
      setMedia(mediaRef.current.map((m) => (m.id === item.id ? { ...m, alt_text: draft.trim() || null } : m)));
    } catch {
      addError('The alt text could not be saved.');
    }
  }

  function moveItem(index, step) {
    const next = [...mediaRef.current];
    const target = index + step;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setMedia(next);
  }

  function describe(item) {
    const parts = [sizeLabel(item.size_bytes || 0)];
    if (item.kind === 'video') {
      const length = durationLabel(item.duration_seconds);
      if (length) parts.push(length);
    } else if (item.width && item.height) {
      parts.push(`${item.width} × ${item.height}`);
    }
    return parts.join(' · ');
  }

  return (
    <div className="posting-media">
      <div
        className={isDragging ? 'posting-dropzone is-dragging' : 'posting-dropzone'}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          accept={ACCEPT}
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = '';
            processFiles(files);
          }}
        />
        <p>Drop pictures or a video here, or</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>Choose files</button>
        <p className="admin-muted">Pictures: JPEG, PNG or WebP. Video: one MP4 or MOV.</p>
      </div>

      {errors.map((message, index) => (
        <p key={index} className="form-error" role="alert">{message}</p>
      ))}

      {uploads.map((upload) => (
        <div key={upload.key}>
          <p className="admin-muted">{upload.name}: {upload.progress}%</p>
          <div className="posting-progress"><div style={{ width: `${upload.progress}%` }} /></div>
        </div>
      ))}

      {media.length > 0 && (
        <div className="posting-tiles">
          {media.map((item, index) => (
            <div key={item.id} className="posting-tile">
              {item.kind === 'video' ? (
                <video src={item.url} muted controls preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt_text || ''} />
              )}
              <span className="admin-muted">{describe(item)}</span>
              <input
                type="text"
                value={altDrafts[item.id] ?? item.alt_text ?? ''}
                onChange={(e) => setAltDrafts((current) => ({ ...current, [item.id]: e.target.value }))}
                onBlur={() => saveAltText(item)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                placeholder={item.kind === 'video' ? 'Describe the video' : 'Describe the picture (alt text)'}
                maxLength={500}
                aria-label="Alt text"
              />
              <div className="admin-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label="Move earlier">◀</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => moveItem(index, 1)} disabled={index === media.length - 1} aria-label="Move later">▶</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
