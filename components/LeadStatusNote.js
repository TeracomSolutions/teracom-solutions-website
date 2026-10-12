'use client';

import { useLayoutEffect, useState } from 'react';
import { parseLeadQuery } from '@/lib/leadQuery.js';

export default function LeadStatusNote() {
  const [lead, setLead] = useState('');

  useLayoutEffect(() => {
    setLead(parseLeadQuery(window.location.search).lead);
  }, []);

  if (lead === 'received') {
    return (
      <p className="form-note-banner" role="status">Thanks — we&apos;ve received your enquiry and will be in touch shortly.</p>
    );
  }

  if (lead === 'error') {
    return (
      <p className="form-error" role="alert">Something went wrong submitting your enquiry. Please try again, or email us directly.</p>
    );
  }

  return null;
}