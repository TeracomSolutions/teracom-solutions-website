import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminImportUploadButton from '@/components/AdminImportUploadButton';
import AdminShell from '@/components/AdminShell';
import AdminSupplierFeeds from '@/components/AdminSupplierFeeds';
import AdminUploadFeedForm from '@/components/AdminUploadFeedForm';
import { fetchSupplierFeeds } from '@/lib/api/adminSupplierFeeds';
import { fetchSupplierUploads, findBusinessName, findSupplierName } from '@/lib/api/adminSuppliers';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Supplier price lists|Teracom Solutions',
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
  let feeds = [];
  let loadError = null;
  const [businessName, supplierName] = await Promise.all([
    findBusinessName(token, businessId),
    findSupplierName(token, businessId, supplierId),
  ]);

  try {
    [uploads, feeds] = await Promise.all([fetchSupplierUploads(token, supplierId), fetchSupplierFeeds(token, supplierId)]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load this supplier from the backend.';
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
          <p>Two ways a price list gets in: upload a file by hand, or set up an automatic feed the server pulls on a schedule. Either way the file is kept, listed in the upload history, and imported into the store catalogue by SKU.</p>
          <h4>Automatic feeds</h4>
          <p>Give it the address the supplier publishes -- a CSV or Excel file, a JSON or XML feed, or an API -- and how often to pull it (the scheduler runs every 15 minutes and pulls whatever is due). If the address needs a key, add it as a header (for example <em>X-Api-Key</em>, or <em>Authorization</em> with a value of <em>Bearer …</em>); it is stored encrypted and never shown again. <em>Pull now</em> runs one immediately; each pull imports straight away and shows how many products were added or updated.</p>
          <h4>Upload by hand</h4>
          <p>Choose a .csv, .xlsx or .xls file (up to 4 MB), then click <em>Import into store</em>.</p>
          <h4>What the import reads</h4>
          <p>Column names are matched loosely: SKU / item code / part number, name / product, RRP / price / retail, cost / trade / dealer, stock / qty / SOH, category / group, brand. Rows without a SKU, a name or a price are skipped and counted. Prices are RRP; customer tiers are set on the Pricing page. Re-importing the same SKUs updates them.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Automatic feeds and hand uploads for this supplier, each imported into the store catalogue.</p>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <>
          <h2>Automatic feeds</h2>
          <AdminSupplierFeeds supplierId={supplierId} feeds={feeds} />

          <h2>Upload a price list by hand</h2>
          <AdminUploadFeedForm supplierId={supplierId} />

          <h2>Upload history</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>How</th>
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
                    <td colSpan={7} className="admin-muted">Nothing yet.</td>
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
                    <td>{upload.feed_id ? 'Feed' : 'By hand'}</td>
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
        </>
      )}
    </AdminShell>
  );
}
