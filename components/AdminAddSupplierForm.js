'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Adds a supplier on the Data Feeds page. There is one website, so the
// backend files it under that business; nobody picks one here.
export default function AdminAddSupplierForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState('');
  const [supplierType, setSupplierType] = useState('distributor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, supplierType }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add supplier');
      }

      setName('');
      setSupplierType('distributor');
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
        Add Supplier
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-card">
      <label>
        Supplier name
        <input
          id="supplierName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Leader Computers"
          required
        />
      </label>

      <label>
        Supplier type
        <select id="supplierType" value={supplierType} onChange={(event) => setSupplierType(event.target.value)}>
          <option value="distributor">Distributor (sells many brands)</option>
          <option value="manufacturer">Manufacturer (makes its own)</option>
        </select>
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
          {isSubmitting ? 'Adding…' : 'Add Supplier'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsExpanded(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}