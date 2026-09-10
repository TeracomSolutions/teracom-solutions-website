import Image from 'next/image';

export default function StripeTrustBadge() {
  return (
    <div className="stripe-trust-badge">
      <svg className="stripe-trust-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
      <div>
        <p>
          You&apos;ll be securely redirected to Stripe to complete your payment. We never see or store your card
          details -- everything is encrypted and processed directly by Stripe, a PCI DSS Level 1 certified payment
          provider trusted by millions of businesses worldwide.
        </p>
        <div className="stripe-trust-logo-row">
          <span>Payments powered by</span>
          <Image src="/assets/logos/stripe.svg" alt="Stripe" width={70} height={29} />
        </div>
      </div>
    </div>
  );
}
