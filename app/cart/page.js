import { cookies } from 'next/headers';
import CartView from '@/components/CartView';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

export default function CartPage() {
  const isMember = Boolean(cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value);
  return <CartView isMember={isMember} />;
}
