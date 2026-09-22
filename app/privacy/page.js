import Link from 'next/link';
import { CreditCard, ShieldCheck, UserCheck } from 'lucide-react';
import LegalDocument from '@/components/LegalDocument';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy | Teracom Solutions',
  description: 'How Teracom Solutions Pty Ltd collects, uses and protects personal information through this website.',
  path: '/privacy',
});

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'We never sell your information.', text: 'It is used to run our business and this website, nothing else.' },
  { icon: CreditCard, title: 'Card payments go through Stripe.', text: 'We never see or store your card details.' },
  { icon: UserCheck, title: 'Your information, your say.', text: 'Ask us any time to see or correct what we hold about you.' },
];

const SECTIONS = [
  {
    title: '1. About this policy',
    body: [
      'This policy explains how Teracom Solutions Pty Ltd (ABN 49 107 979 546) ("Teracom", "we", "us") collects, uses, discloses and protects personal information through teracomsolutions.com.au. We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.',
    ],
  },
  {
    title: '2. What we collect',
    body: [
      { label: 'Enquiries', text: 'When you use our contact form we collect your name, email address, company (optional), the area you are interested in and your message.' },
      { label: 'Customer accounts', text: 'When you create an account we collect your first and last name, email address, password and postal address.' },
      { label: 'Orders', text: 'When you buy from the Teracom Store we collect your name, email address, delivery details and what you ordered. Card payments are processed by Stripe; we never see or store your card details.' },
      { label: 'Website use', text: 'We use Google Analytics to understand how the website is used -- for example the pages visited, how long visitors stay, the type of device and browser, the website that referred them and their approximate location (city or region). This information does not identify you by name.' },
    ],
  },
  {
    title: '3. How we use it',
    body: [
      'We use personal information to respond to enquiries, provide quotes, services and support, run customer accounts and member pricing, process and deliver orders, issue invoices, meet our legal obligations and improve our website and services.',
      'We do not sell personal information.',
    ],
  },
  {
    title: '4. Who we share it with',
    body: [
      'We share personal information only with service providers who help us run the business and this website, and only as far as they need it:',
      { label: 'Stripe', text: 'Card payments.' },
      { label: 'Zoho', text: 'Accounting and invoicing.' },
      { label: 'Google', text: 'Website analytics and embedded maps.' },
      { label: 'YouTube', text: 'Embedded product videos.' },
      { label: 'Vercel', text: 'Website hosting.' },
      'Some of these providers store or process information outside Australia. We may also disclose information where the law requires it.',
    ],
  },
  {
    title: '5. Cookies and browser storage',
    body: [
      'If you sign in, a cookie keeps you signed in. Your cart is saved in your own browser so it is still there when you come back. Google Analytics sets cookies to tell visits apart. Embedded Google Maps and YouTube videos may set their own cookies under Google\'s privacy policy.',
      <>
        You can block or delete cookies in your browser settings, and you can opt out of Google Analytics on every
        website with{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google&apos;s opt-out browser add-on
        </a>
        . Blocking cookies may stop sign-in or the cart from working.
      </>,
    ],
  },
  {
    title: '6. Keeping it secure',
    body: [
      'We take reasonable steps to protect personal information from misuse, loss and unauthorised access. The website is served over an encrypted (HTTPS) connection.',
    ],
  },
  {
    title: '7. Access, correction and complaints',
    body: [
      'You can ask to access or correct the personal information we hold about you, or make a privacy complaint, by contacting us using the details below. We will respond within a reasonable time.',
      <>
        If you are not satisfied with our response, you can contact the{' '}
        <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
          Office of the Australian Information Commissioner
        </a>
        .
      </>,
    ],
  },
  {
    title: '8. Contact us',
    body: [
      'Teracom Solutions Pty Ltd, 1B Yazaki Way, Carrum Downs VIC 3201, Australia.',
      <>
        Email <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a> or phone{' '}
        <a href="tel:+61397082685">+61 3 9708 2685</a>. You can also use our <Link href="/contact">contact page</Link>.
      </>,
    ],
  },
  {
    title: '9. Changes to this policy',
    body: ['We may update this policy from time to time; the current version is always on this page.'],
  },
];

export default function Privacy() {
  return (
    <LegalDocument
      icon={ShieldCheck}
      title="Privacy Policy"
      lead="How Teracom Solutions Pty Ltd handles personal information collected through this website."
      updated="22 September 2026"
      highlights={HIGHLIGHTS}
      sections={SECTIONS}
    />
  );
}
