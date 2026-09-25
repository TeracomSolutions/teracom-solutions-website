import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminAddSupplierForm from '@/components/AdminAddSupplierForm';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchSuppliersForBusiness, findBusinessName } from '@/lib/api/adminWebsiteIntelligence';
import { formatDate, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Suppliers|Teracom Solutions',
};

// Copied from the Global Platform's app/(admin)/data-feeds/[businessId]/page.js.
export default async function AdminBusinessSuppliersPage({ params }) {
  const token = await requireAdminToken();
  const { businessId } = await params;

  let suppliers = [];
  let loadError = null;
  const businessName = await findBusinessName(token, businessId);

  try {
    suppliers = await fetchSuppliersForBusiness(token, businessId);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the suppliers for this business.';
  }

  return (
    <AdminShell>
      <p className="admin-muted"><Link href="/admin/website-intelligence" className="admin-link">&larr; Website Intelligence</Link></p>
      <h1 className="admin-heading">
        {businessName ? `${businessName} — Suppliers` : 'Suppliers'}
        <AdminHelpIcon>
          <p>The product suppliers this business buys from, whose price-list files it receives. Click a supplier to upload its files and see what has been uploaded.</p>
          <h4>Suppliers</h4>
          <ul>
            <li><strong>Name</strong> - the supplier&apos;s name; click it for its uploads.</li>
            <li><strong>Type</strong> - Manufacturer (makes the products) or Distributor (resells them).</li>
            <li><strong>Created</strong> - when it was added.</li>
          </ul>
          <h4>Add a supplier</h4>
          <ul>
            <li>Enter the <strong>Supplier name</strong> and choose its <strong>Supplier type</strong>, then save. Recorded in the audit log.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Manage the suppliers associated with this business.</p>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-muted">No suppliers found.</td>
                </tr>
              )}
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <Link href={`/admin/website-intelligence/${businessId}/${supplier.id}`} className="admin-link">
                      {supplier.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`admin-status ${supplier.supplier_type === 'manufacturer' ? 'is-approved' : 'is-pending'}`}>
                      {humanise(supplier.supplier_type)}
                    </span>
                  </td>
                  <td>{formatDate(supplier.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminAddSupplierForm businessId={businessId} />
    </AdminShell>
  );
}
