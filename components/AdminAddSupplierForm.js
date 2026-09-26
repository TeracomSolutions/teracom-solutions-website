'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Copied from the Global Platform's
// app/(admin)/data-feeds/[businessId]/AddSupplierForm.js.
export default function AdminAddSupplierForm({ businessId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState('');
  const [supplierType, setSupplierType] = useState('manufacturer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/website-intelligence/businesses/${businessId}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, supplierType }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add supplier');
      }

      setName('');
      setSupplierType('manufacturer');
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
          required
        />
      </label>

      <label>
        Supplier type
        <select id="supplierType" value={supplierType} onChange={(event) => setSupplierType(event.target.value)}>
          <option value="manufacturer">Manufacturer</option>
          <option value="distributor">Distributor</option>
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
