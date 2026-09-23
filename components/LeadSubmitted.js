'use client';

import { useEffect } from 'react';

import { track } from '@/lib/gtag';

// Reports an enquiry.
//
// The contact form is a plain HTML POST that redirects back with
// ?lead=received, so there is no client-side submit handler to hook. This
// fires on the page the visitor lands on afterwards, then strips the
// parameter, so a refresh or a shared link cannot report a second enquiry
// that never happened.
//
// generate_lead rather than a bespoke name: it is a GA4 recommended event, so
// it feeds the built-in lead reporting and imports cleanly into Ads later.
// For this site it will be the largest commercial signal by volume -- trade
// buyers ask before they buy.

export default function LeadSubmitted({ source = 'contact_form' }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('lead') !== 'received') return;

    track('generate_lead', {
      currency: 'AUD',
      lead_source: source,
      form_location: window.location.pathname,
    });

    params.delete('lead');
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
  }, [source]);

  return null;
}
