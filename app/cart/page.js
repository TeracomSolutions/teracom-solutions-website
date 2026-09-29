import { cookies } from 'next/headers';
import CartView from '@/components/CartView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCustomerPricing } from '@/lib/catalogue';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { cleanPostcode } from '@/lib/freightParcels';

export default async function CartPage() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const isMember = Boolean(token);
  const customer = await getCustomerPricing(token);
  // The delivery postcode on the account, as a starting point for the
  // delivery price. Any failure just leaves the box empty.
  let savedPostcode = '';
  if (token) {
    try {
      const me = await getCurrentCustomer(token);
      savedPostcode = cleanPostcode(me?.shipping_postcode);
    } catch {
      savedPostcode = '';
    }
  }
  return <CartView isMember={isMember} customer={customer} savedPostcode={savedPostcode} />;
}
