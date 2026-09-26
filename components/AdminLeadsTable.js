'use client';

import { useState } from 'react';

import { formatDateTime, inquiryLabel } from '@/lib/adminFormat';

// Enquiries from the public contact form, newest first. Copied from the
// Global Platform's app/(admin)/data-feeds/LeadsTable.js; the form now
// writes straight to the website backend and this reads it back.
export default function AdminLeadsTable({ leads, loadError }) {
  const [rows, setRows] = useState(leads ?? []);
  const [error, setError] = useState(loadError ?? null);
  const [busyId, setBusyId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const reload = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setRows(data);
        setError(null);
      } else {
        setError(data.error || 'Unable to load website enquiries.');
      }
    } catch {
      setError('Unable to load website enquiries.');
    }
  };

  const markContacted = async (leadId) => {
    setBusyId(leadId);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/contacted`, { method: 'POST' });
      if (response.ok) {
        await reload();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Unable to mark this enquiry as contacted.');
      }
    } catch {
      setError('Unable to mark this enquiry as contacted.');
    } finally {
      setBusyId(null);
    }
  };

  const newCount = rows.filter((lead) => lead.status === 'new').length;

  return (
    <div>
      <div className="admin-refresh">
        <button type="button" className="btn btn-secondary btn-sm" onClick={reload}>Refresh</button>
        <span className="admin-muted">
          {rows.length} enquir{rows.length === 1 ? 'y' : 'ies'}
          {rows.length > 0 && `, ${newCount} not yet contacted`}
        </span>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Received</th>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Enquiry</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-muted">No enquiries yet.</td>
              </tr>
            )}
            {rows.map((lead) => (
              <tr key={lead.id}>
                <td>{formatDateTime(lead.created_at)}</td>
                <td className="wrap">
                  {lead.name}
                  {lead.message && (
                    <>
                      {' '}
                      <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => setOpenId(openId === lead.id ? null : lead.id)}
                      >
                        {openId === lead.id ? 'Hide message' : 'Message'}
                      </button>
                      {openId === lead.id && (
                        <p className="admin-message">{lead.message}</p>
                      )}
                    </>
                  )}
                </td>
                <td>{lead.company || '—'}</td>
                <td><a href={`mailto:${lead.email}`} className="admin-link">{lead.email}</a></td>
                <td>{inquiryLabel(lead.inquiry_type)}</td>
                <td>
                  {lead.status === 'contacted'
                    ? <span className="admin-status is-contacted">Contacted {lead.contacted_at ? formatDateTime(lead.contacted_at) : ''}</span>
                    : <span className="admin-status is-new">New</span>}
                </td>
                <td>
                  {lead.status !== 'contacted' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => markContacted(lead.id)}
                      disabled={busyId === lead.id}
                    >
                      {busyId === lead.id ? 'Saving…' : 'Mark contacted'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
