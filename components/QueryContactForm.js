'use client';

import { useLayoutEffect, useState } from 'react';
import ContactForm from '@/components/ContactForm';
import { parseLeadQuery } from '@/lib/leadQuery';

export default function QueryContactForm({ returnTo = '/', modules = [] }) {
  const [start, setStart] = useState({ interest: '', message: '' });

  useLayoutEffect(() => {
    const parsed = parseLeadQuery(window.location.search, modules);
    setStart({ interest: parsed.interest, message: parsed.message });
  }, []);

  return (
    <ContactForm
      key={start.interest + '|' + start.message}
      preselectedInterest={start.interest}
      preselectedMessage={start.message}
      returnTo={returnTo}
    />
  );
}