import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminImportUploadButton from '@/components/AdminImportUploadButton';
import AdminShell from '@/components/AdminShell';
import AdminUploadFeedForm from '@/components/AdminUploadFeedForm';
import { fetchSupplierUploads, findBusinessName, findSupplierName } from '@/lib/api/adminSuppliers';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Supplier Uploads|Teracom Solutions',
};

const STATUS_CLASS = {
  uploaded: 'is-pending',
  imported: 'is-approved',
  failed: 'is-failed',
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
        {supplierName ? `${supplierName} — Price lists` : 'Supplier price lists'}
        <AdminHelpIcon>
          <p>Price-list files received from this supplier: upload a new one, import it into the store, and see every file uploaded so far.</p>
          <h4>Upload</h4>
          <p>Choose a .csv, .xlsx or .xls file (up to 4 MB). The file is kept on the website server with who uploaded it and when.</p>
          <h4>Import into store</h4>
          <p>Reads the file and adds or updates products in the store catalogue by SKU, linked to this supplier. Column names are matched loosely: SKU / item code / part number, name / product, RRP / price / retail, cost / trade / dealer, stock / qty, category, brand. Rows without a SKU, a name or a price are skipped and counted. Run it again after a new upload to update prices; the supplier&apos;s <em>Last import</em> date and each product&apos;s <em>Last imported</em> date are updated.</p>
          <h4>Columns</h4>
          <ul>
            <li><strong>Status</strong> - Uploaded (not yet imported), Imported, or Failed (nothing could be read; the reason is shown).</li>
            <li><strong>Rows</strong> - how many product rows the import read.</li>
            <li><strong>Imported</strong> - when it was last imported into the store.</li>
          </ul>
          <p>Prices imported here are RRP. Customer tiers are set on the <strong>Pricing</strong> page.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Upload a price list from this supplier and import it into the store.</p>

      <h2>Upload a price list</h2>
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
                <th>Imported</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {uploads.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-muted">No uploads yet.</td>
                </tr>
              )}
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td className="wrap">
                    {upload.filename}
                    {upload.error_message && (
                      <p className="admin-message" style={{ color: '#ff8a8a' }}>{upload.error_message}</p>
                    )}
                  </td>
                  <td>{formatDateTime(upload.uploaded_at)}</td>
                  <td>
                    <span className={`admin-status ${STATUS_CLASS[upload.status] || ''}`}>
                      {humanise(upload.status)}
                    </span>
                  </td>
                  <td>{upload.row_count ?? '—'}</td>
                  <td>{formatDateTime(upload.imported_at)}</td>
                  <td>
                    <AdminImportUploadButton uploadId={upload.id} alreadyImported={upload.status === 'imported'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
