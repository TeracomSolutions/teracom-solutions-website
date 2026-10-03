import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminBrandRule from '@/components/AdminBrandRule';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminImportUploadButton from '@/components/AdminImportUploadButton';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminSupplierFeeds from '@/components/AdminSupplierFeeds';
import AdminUploadFeedForm from '@/components/AdminUploadFeedForm';
import { fetchSupplierFeeds } from '@/lib/api/adminSupplierFeeds';
import { fetchSupplier, fetchSupplierUploads } from '@/lib/api/adminSuppliers';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Supplier data feed|Teracom Solutions',
};

const STATUS_CLASS = {
  uploaded: 'is-pending',
  imported: 'is-approved',
  failed: 'is-failed',
};

// One supplier's feeds, hand uploads and brand rule (Store, Data Feeds).
export default async function AdminSupplierPage({ params }) {
  const token = await requireAdminToken();
  const { supplierId } = await params;

  let supplier = null;
  let uploads = [];
  let feeds = [];
  let loadError = null;

  try {
    [supplier, uploads, feeds] = await Promise.all([
      fetchSupplier(token, supplierId),
      fetchSupplierUploads(token, supplierId),
      fetchSupplierFeeds(token, supplierId),
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load this supplier from the backend.';
  }

  const hasRule = Boolean(supplier?.brand_filter && supplier.brand_filter.length > 0);
  const latestUpload = [...uploads].sort((a, b) => String(b.uploaded_at).localeCompare(String(a.uploaded_at)))[0];

  return (
    <AdminShell>
      <p className="admin-muted">
        <Link href="/admin/suppliers" className="admin-link">&larr; Data Feeds</Link>
      </p>
      <h1 className="admin-heading">
        {supplier ? supplier.name : 'Supplier'}
        <AdminHelpIcon>
          <p>Two ways a price list gets in: a direct link or automatic feed the server pulls on a schedule, or a file uploaded by hand. Either way the file is kept in the upload history and imported into the store catalogue by SKU.</p>
          <h4>Brands</h4>
          <p>A distributor file can carry many brands. The first import asks which brands to take and remembers them: every later import, by hand or from the feed, takes only those brands. Until they are chosen, a feed that brings several brands waits instead of importing everything. Change brands or Clear rule at any time; products already imported stay in the store.</p>
          <h4>Direct links</h4>
          <p>Paste the supplier&apos;s direct download link (for Leader: Data Feed Center, then CopyLink next to Stock Data Feed - CSV with Heading). The link is stored encrypted and only its start is shown, because it carries your account key. If the address needs a key in a header instead, add it as a header; it is stored encrypted and never shown again.</p>
          <h4>What the import reads</h4>
          <p>Column names are matched loosely: SKU / item code / stock code / part number, name / product / short description, RRP / price / retail, cost / trade / dealer / DBP, stock / qty / SOH, category / group, brand / manufacturer / vendor. Rows without a SKU, a name or a price are skipped and counted. Re-importing the same SKUs updates them.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && supplier && (
        <>
          <p className="lead">{humanise(supplier.supplier_type)}. Its feed or uploaded files fill the store, keeping to the brands chosen below.</p>

          <h2>Brands</h2>
          <AdminBrandRule
            supplierId={supplierId}
            supplierName={supplier.name}
            rule={supplier.brand_filter}
            latestUploadId={latestUpload?.id || null}
          />

          <h2>Direct link or automatic feed</h2>
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
                      <AdminImportUploadButton
                        uploadId={upload.id}
                        alreadyImported={upload.status === 'imported'}
                        hasRule={hasRule}
                        supplierName={supplier.name}
                      />
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