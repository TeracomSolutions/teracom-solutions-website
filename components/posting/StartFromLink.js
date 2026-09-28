'use client';

import { useState } from 'react';

export default function StartFromLink({ onDraft, onPicture }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(''); // '' | 'draft' | 'picture'
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleClick() {
    if (!url.trim() || busy) return;
    
    setBusy('draft');
    setError('');
    
    try {
      const response = await fetch('/api/admin/social/drafts/from-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'That link could not be used.');
      }
      
      setResult(data);
      onDraft(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function handleUsePicture() {
    if (!result?.image_url || busy === 'picture') return;
    
    setBusy('picture');
    setError('');
    
    try {
      const response = await fetch('/api/admin/social/media/from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.image_url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch the image.');
      }
      
      onPicture(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="posting-from-link">
      <label>
        Start from a link
        <input 
          type="url" 
          placeholder="https://... an article to share"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleClick(); } }}
        />
      </label>
      <button 
        type="button" 
        className="btn btn-secondary btn-sm" 
        onClick={handleClick} 
        disabled={Boolean(busy) || !url.trim()}
      >
        {busy === 'draft' ? 'Reading and writing…' : 'Write posts from it'}
      </button>
      
      {error && <p className="form-error" role="alert">{error}</p>}
      
      {result && (
        <>
          <p className="admin-muted">
            Written by {result.model} from {result.source.site_name}: {result.source.title}. Check the facts before posting.
          </p>
          
          {result.image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.image_url} alt="" className="posting-from-link-image" />
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleUsePicture}
                disabled={Boolean(busy)}
              >
                Use this picture
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}