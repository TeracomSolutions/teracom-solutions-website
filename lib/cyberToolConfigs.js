// Field/result definitions for the Essential Eight self-check, rendered by
// components/tools/ConfigCalculator.js. The questions and scoring are in
// lib/cyberCalculators.js.
import { fmt } from '@/lib/calcFormat';
import { ESSENTIAL_EIGHT, essentialEightCheck, levelText } from '@/lib/cyberCalculators';

export const cyberToolConfigs = {
  'essential-eight-self-check': {
    fields: ESSENTIAL_EIGHT.map((s) => ({
      id: s.id,
      label: s.title,
      type: 'select',
      default: '0',
      options: s.options,
    })),
    compute: (v) => essentialEightCheck(v),
    results: (r) => [
      { label: 'Overall (your weakest area)', value: levelText(r.overall) },
      { label: 'Score', value: `${fmt(r.score, 0)} of 24 (${fmt(r.scorePercent, 0)}%)` },
      ...r.strategies.map((s) => ({ label: s.title, value: levelText(s.level) })),
      ...r.priorities.map((s, i) => ({ label: `Fix ${i + 1}: ${s.title}`, value: s.fix })),
      ...(r.overall === 0
        ? [{ warn: 'At least one of the eight is not in place. Maturity Level One across all eight is the baseline the Australian Signals Directorate recommends for every organisation.' }]
        : []),
    ],
    note: 'A quick self-check in plain words, not an assessment or certification, and not endorsed by the Australian Signals Directorate. Your overall level is your weakest area, because attackers look for the gap. The full Essential Eight Maturity Model is published free at cyber.gov.au.',
  },
};
