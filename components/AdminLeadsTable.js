'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import AdminLeadReply from '@/components/AdminLeadReply';
import { formatDateTime, inquiryLabel } from '@/lib/adminFormat';

// Enquiries from the public contact form, request forms and Ask Tera, newest first. One short
// line each (Robert, 14 November 2026); click a line to open it: the message, the contact
// details, Mark contacted and Tera's draft reply (AdminLeadReply).
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

  const toggle = (id) => setOpenId(openId === id ? null : id);
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
        <table className="admin-table admin-table-compact admin-lines leads-lines">
          <colgroup>
            <col className="col-open" />
            <col className="col-when" />
            <col className="col-name" />
            <col className="col-company" />
            <col className="col-email" />
            <col className="col-kind" />
            <col className="col-status" />
          </colgroup>
          <thead>
            <tr>
              <th aria-label="Open"></th>
              <th>Received</th>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Enquiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-muted">No enquiries yet.</td>
              </tr>
            )}
            {rows.map((lead) => {
              const open = openId === lead.id;
              return (
                <Fragment key={lead.id}>
                  <tr
                    className={`admin-line${open ? ' is-open' : ''}${lead.status === 'new' ? ' is-unread' : ''}`}
                    onClick={() => toggle(lead.id)}
                  >
                    <td>
                      <button
                        type="button"
                        className="admin-line-toggle"
                        aria-expanded={open}
                        aria-label={open ? `Close the enquiry from ${lead.name}` : `Open the enquiry from ${lead.name}`}
                        onClick={(event) => { event.stopPropagation(); toggle(lead.id); }}
                      >
                        {open ? <ChevronDown size={15} aria-hidden="true" /> : <ChevronRight size={15} aria-hidden="true" />}
                      </button>
                    </td>
                    <td title={formatDateTime(lead.created_at)}>{formatDateTime(lead.created_at)}</td>
                    <td title={lead.name}>{lead.name}</td>
                    <td title={lead.company || ''}>{lead.company || '—'}</td>
                    <td title={lead.email}>{lead.email}</td>
                    <td title={inquiryLabel(lead.inquiry_type)}>{inquiryLabel(lead.inquiry_type)}</td>
                    <td>
                      {lead.status === 'contacted'
                        ? <span className="admin-status is-contacted">Contacted</span>
                        : <span className="admin-status is-new">New</span>}
                      {lead.status !== 'contacted' && lead.draft?.status === 'ready' ? <span className="admin-status is-draft">Draft</span> : null}
                    </td>
                  </tr>
                  {open ? (
                    <tr className="lead-reply-row">
                      <td colSpan={7}>
                        <div className="lead-detail">
                          <dl className="lead-facts">
                            <div><dt>Received</dt><dd>{formatDateTime(lead.created_at)}</dd></div>
                            <div><dt>From</dt><dd>{lead.name}{lead.company ? `, ${lead.company}` : ''}</dd></div>
                            <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`} className="admin-link">{lead.email}</a></dd></div>
                            {lead.phone ? <div><dt>Phone</dt><dd><a href={`tel:${lead.phone}`} className="admin-link">{lead.phone}</a></dd></div> : null}
                            <div><dt>Enquiry</dt><dd>{inquiryLabel(lead.inquiry_type)}</dd></div>
                            <div>
                              <dt>Status</dt>
                              <dd>{lead.status === 'contacted' ? `Contacted ${lead.contacted_at ? formatDateTime(lead.contacted_at) : ''}` : 'New, not yet contacted'}</dd>
                            </div>
                          </dl>
                          {lead.message ? <p className="admin-message">{lead.message}</p> : <p className="admin-muted">No message.</p>}
                          {lead.status !== 'contacted' && (
                            <div className="lead-actions">
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => { if (window.confirm('Mark this lead as contacted? There is no undo.')) markContacted(lead.id); }}
                                disabled={busyId === lead.id}
                              >
                                {busyId === lead.id ? 'Saving…' : 'Mark contacted'}
                              </button>
                            </div>
                          )}
                          <AdminLeadReply key={`${lead.id}-${lead.draft?.status}-${lead.draft?.updated_at}`} lead={lead} onChange={reload} />
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
