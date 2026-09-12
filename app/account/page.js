import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';

export default async function CustomerAccountPage() {
  const token = cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  
  if (!token) {
    redirect('/account/login');
  }

  let customer;
  try {
    customer = await getCurrentCustomer(token);
  } catch (err) {
    // If we get a 401 or 403, the token is invalid or expired - redirect to login
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      redirect('/account/login');
    }
    // For any other error, we'll display a generic message rather than crashing
    // This matches the resilience pattern in app/admin/catalog/page.js
  }

  return (
    <main>
      <section className="section section-spacious">
        <div className="container" style={{ maxWidth: '420px' }}>
          <h1>Account</h1>
          
          {customer ? (
            <>
              <p className="lead">Welcome, {customer.email}!</p>
              <p>Your account was created on {new Date(customer.created_at).toLocaleDateString()}.</p>
              
              <form action="/api/customer/logout" method="POST" style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-secondary">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <p>Unable to load account details.</p>
          )}
        </div>
      </section>
    </main>
  );
}