import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import AuthShell from '@/components/AuthShell';
import CustomerOrders from '@/components/CustomerOrders';
import EmailPreferences from '@/components/EmailPreferences';
import { fetchMyOrders } from '@/lib/api/customerOrders';
import { BadgePercent, CircleUserRound, ReceiptText, ShoppingCart } from 'lucide-react';

export default async function CustomerAccountPage() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;

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

  // Their orders and where each is up to, loaded on their own so a failure leaves the rest of the page working.
  let orders = [];
  let ordersError = false;
  if (customer) {
    try {
      orders = (await fetchMyOrders(token)).orders || [];
    } catch {
      ordersError = true;
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Your account."
      icon={CircleUserRound}
      badges={[BadgePercent, ShoppingCart, ReceiptText]}
      benefits={[
        { icon: BadgePercent, text: 'Member pricing is applied at checkout' },
        { icon: ShoppingCart, text: 'Your cart is kept on this device' },
      ]}
    >

          {customer ? (
            <>
              <p className="lead">Welcome, {customer.email}!</p>
              <p>Your account was created on {new Date(customer.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>

              <CustomerOrders orders={orders} error={ordersError} />

              <EmailPreferences customer={customer} />

              <form action="/api/customer/logout" method="POST" style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-secondary">
                  Sign out
                </button>
              </form>
            </>
      ) : (
        <p>Unable to load account details.</p>
      )}
    </AuthShell>
  );
}