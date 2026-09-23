'use client';

import { useEffect } from 'react';

import { track } from '@/lib/gtag';

// Reports that a calculator was actually used.
//
// The calculators recompute on every keystroke, so there is no submit button
// to hang an event on, and "the page loaded" is not the same as "someone
// used it". This listens for input on the calculator itself and reports once,
// a moment after the typing stops -- so the event means "worked out an
// answer" rather than "arrived and left".
//
// Done at the page level rather than inside each calculator: one listener
// covers all twelve, including the ones built from lib/toolConfigs.js, and a
// new calculator is measured without anyone remembering to wire it up.
//
// One event name for every calculator, with the name as a parameter. Twelve
// event names would burn GA4's distinct-name budget, clutter the events list
// and make cross-calculator comparison impossible.

const SETTLE_MS = 1500;

export default function CalculatorUsage({ slug, group }) {
  useEffect(() => {
    if (!slug) return undefined;

    const stage = document.querySelector('.tool-stage');
    if (!stage) return undefined;

    let timer = null;
    let reported = false;

    const onInput = () => {
      if (reported) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        reported = true;
        track('calculator_complete', {
          calculator_name: slug,
          calculator_category: group || 'general',
        });
      }, SETTLE_MS);
    };

    stage.addEventListener('input', onInput);
    stage.addEventListener('change', onInput);
    return () => {
      clearTimeout(timer);
      stage.removeEventListener('input', onInput);
      stage.removeEventListener('change', onInput);
    };
  }, [slug, group]);

  return null;
}
