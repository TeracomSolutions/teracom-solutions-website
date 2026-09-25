import { loadStripe } from '@stripe/stripe-js';

// The publishable key is public by design -- it ends up in the page source
// and can only create payment attempts, never read or move money. It still
// has to be set in Vercel for checkout to render at all.
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise = null;

/**
 * One Stripe instance for the whole session. loadStripe injects a script
 * tag, so calling it per render would add one on every mount.
 *
 * Returns null when no key is configured, so the checkout page can say so
 * plainly instead of failing somewhere inside Stripe's library.
 */
export function getStripe() {
  if (!STRIPE_PUBLISHABLE_KEY) return null;
  if (!stripePromise) stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
}
