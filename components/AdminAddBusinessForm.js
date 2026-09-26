'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAddBusinessForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, websiteUrl }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add business');
      }

      setName('');
      setWebsiteUrl('');
      setIsExpanded(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsExpanded(true)}>
        Add Business
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-card">
      <label>
        Business name
        <input
          id="businessName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label>
        Website URL
        <input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          placeholder="https://www.example.com.au"
          required
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
          {isSubmitting ? 'Adding…' : 'Add Business'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsExpanded(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
