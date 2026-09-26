'use client';

import { useState } from 'react';
import Link from 'next/link';

import { formatDate } from '@/lib/adminFormat';

import AdminAddBusinessForm from './AdminAddBusinessForm';
import AdminLeadsTable from './AdminLeadsTable';

// Same tab pattern as the Scout page: ?tab= keeps the chosen tab across a
// refresh and lets other pages link straight to the enquiries. Copied
// from the Global Platform's app/(admin)/data-feeds/WebsiteIntelligenceTabs.js.
const TABS = [
  { key: 'businesses', label: 'Businesses & Suppliers' },
  { key: 'leads', label: 'Leads' },
];

export default function AdminWebsiteIntelligenceTabs({ initialTab, businesses, loadError, leads, leadsError }) {
  const [activeTab, setActiveTab] = useState(
    TABS.some((tab) => tab.key === initialTab) ? initialTab : 'businesses'
  );

  function selectTab(key) {
    setActiveTab(key);
    window.history.replaceState(null, '', key === 'businesses' ? '/admin/website-intelligence' : `/admin/website-intelligence?tab=${key}`);
  }

  return (
    <div>
      <div className="admin-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => selectTab(tab.key)}
            className={activeTab === tab.key ? 'admin-tab active' : 'admin-tab'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'businesses' && (
        <>
          {loadError && <p className="form-error" role="alert">{loadError}</p>}

          {!loadError && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Website</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="admin-muted">No businesses found.</td>
                    </tr>
                  )}
                  {businesses.map((business) => (
                    <tr key={business.id}>
                      <td>
                        <Link href={`/admin/website-intelligence/${business.id}`} className="admin-link">{business.name}</Link>
                      </td>
                      <td>
                        {business.website_url ? (
                          <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="admin-link">
                            {business.website_url}
                          </a>
                        ) : '—'}
                      </td>
                      <td>{formatDate(business.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '18px' }}>
            <AdminAddBusinessForm />
          </div>
        </>
      )}

      {activeTab === 'leads' && <AdminLeadsTable leads={leads} loadError={leadsError} />}
    </div>
  );
}
