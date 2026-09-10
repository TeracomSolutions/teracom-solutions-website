import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { listCatalogProducts } from '@/lib/api/adminCatalog';
import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import AdminCatalogManager from '@/components/AdminCatalogManager';

export default async function AdminCatalogPage() {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  let initialData;
  try {
    initialData = await listCatalogProducts(token, { skip: 0, limit: 200 });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      redirect('/admin/login');
    }
    // Any other failure (backend unreachable, etc.) -- still render
    // the page with an empty list rather than a hard crash; the
    // upload form and manual refresh still work once the backend is
    // reachable again.
    initialData = { total: 0, skip: 0, limit: 200, products: [] };
  }

  return (
    <main>
      <section className="section section-spacious">
        <div className="container">
          <h1>Store Catalog</h1>
          <p className="lead">
            Upload a supplier price-list feed (CSV, JSON, or XML) to update product pricing and stock.
          </p>

          <AdminCatalogManager initialProducts={initialData.products} initialTotal={initialData.total} />
        </div>
      </section>
    </main>
  );
}
