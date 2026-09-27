import { cookies } from 'next/headers';
import CartView from '@/components/CartView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCustomerPricing } from '@/lib/catalogue';

// Same flat rate /api/checkout/cart adds for orders with physical items.
const FLAT_SHIPPING_RATE_CENTS = Number(process.env.FLAT_SHIPPING_RATE_CENTS) || 1500;

export default async function CartPage() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const isMember = Boolean(token);
  const customer = await getCustomerPricing(token);
  return <CartView isMember={isMember} customer={customer} shippingCents={FLAT_SHIPPING_RATE_CENTS} />;
}
