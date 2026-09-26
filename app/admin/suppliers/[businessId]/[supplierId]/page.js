import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminUploadFeedForm from '@/components/AdminUploadFeedForm';
import { fetchSupplierUploads, findBusinessName, findSupplierName } from '@/lib/api/adminSuppliers';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Supplier Uploads|Teracom Solutions',
};

const STATUS_CLASS = {
  uploaded: 'is-approved',
  processing: 'is-pending',
  failed: 'is-failed',
  imported: 'is-approved',
};

export default async function AdminSupplierUploadsPage({ params }) {
  const token = await requireAdminToken();
  const { businessId, supplierId } = await params;

  let uploads = [];
  let loadError = null;
  const [businessName, supplierName] = await Promise.all([
    findBusinessName(token, businessId),
    findSupplierName(token, businessId, supplierId),
  ]);

  try {
    uploads = await fetchSupplierUploads(token, supplierId);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the upload history for this supplier.';
  }

  return (
    <AdminShell>
      <p className="admin-muted">
        <Link href={`/admin/suppliers/${businessId}`} className="admin-link">
          &larr; {businessName ? `${businessName} suppliers` : 'Suppliers'}
        </Link>
      </p>
      <h1 className="admin-heading">
        {supplierName ? `${supplierName} — Uploads` : 'Supplier Uploads'}
        <AdminHelpIcon>
          <p>Price-list files received from this supplier: upload a new one, and see every file uploaded so far.</p>
          <h4>Upload a feed file</h4>
          <p>Choose a .csv, .xlsx or .xls file (up to 4 MB) and upload it. The file is stored on the website server with who uploaded it and when, and the upload is recorded in the audit log.</p>
          <p>Nothing reads or imports the file automatically yet, so its status stays <em>Uploaded</em> and Rows stays blank. The store&apos;s product catalogue is loaded separately, through the Store Catalog page.</p>
          <h4>Upload history</h4>
          <ul>
            <li><strong>Filename</strong> - the file&apos;s name.</li>
            <li><strong>Uploaded</strong> - when it was uploaded.</li>
            <li><strong>Status</strong> - Uploaded. Processing, Imported and Failed are reserved for when automatic importing is added.</li>
            <li><strong>Rows</strong> - how many rows the file had, once importing exists; blank until then.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Upload a feed file from this supplier, and see its upload history below.</p>

      <h2>Upload a feed file</h2>
      <AdminUploadFeedForm supplierId={supplierId} />

      <h2>Upload history</h2>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Rows</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-muted">No uploads yet.</td>
                </tr>
              )}
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td className="wrap">{upload.filename}</td>
                  <td>{formatDateTime(upload.uploaded_at)}</td>
                  <td>
                    <span className={`admin-status ${STATUS_CLASS[upload.status] || ''}`}>
                      {humanise(upload.status)}
                    </span>
                  </td>
                  <td>{upload.row_count ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
