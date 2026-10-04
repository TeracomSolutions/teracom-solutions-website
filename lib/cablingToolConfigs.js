// Field/result definitions for the fibre and cable calculators, rendered by
// components/tools/ConfigCalculator.js.
import { fmt } from '@/lib/calcFormat';
import { FIBRE_TYPES, PERMANENT_LINK_MAX_METRES, cableQuantity, fibreLossBudget } from '@/lib/cablingCalculators';

export const cablingToolConfigs = {
  'fibre-loss-budget-calculator': {
    fields: [
      { id: 'fibre', label: 'Fibre and wavelength', type: 'select', default: 'sm-osp', options: FIBRE_TYPES.map((f) => ({ value: f.id, label: f.label })) },
      { id: 'lengthKm', label: 'Length (km)', type: 'number', default: '2', step: '0.1' },
      { id: 'connections', label: 'Mated connections', type: 'number', default: '2', step: '1', hint: 'Count every connector pair, including the ones at each end of the link.' },
      { id: 'connectionLossDb', label: 'Loss per connection (dB)', type: 'number', default: '0.75', step: '0.05', hint: '0.75 dB is the TIA-568 maximum; good factory-made connections are about 0.3 dB.' },
      { id: 'splices', label: 'Splices', type: 'number', default: '2', step: '1' },
      { id: 'spliceLossDb', label: 'Loss per splice (dB)', type: 'number', default: '0.3', step: '0.05', hint: '0.3 dB is the TIA-568 maximum.' },
      { id: 'opticBudgetDb', label: 'Optic power budget (dB, optional)', type: 'number', default: '0', step: '0.5', hint: 'From the SFP or media converter datasheet: transmit power minus receiver sensitivity.' },
      { id: 'safetyMarginDb', label: 'Safety margin (dB)', type: 'number', default: '3', step: '0.5' },
    ],
    compute: (v) => fibreLossBudget(v),
    results: (r) => [
      { label: 'Fibre loss', value: `${fmt(r.fibreLossDb)} dB` },
      { label: 'Connection loss', value: `${fmt(r.connectionsLossDb)} dB` },
      { label: 'Splice loss', value: `${fmt(r.splicesLossDb)} dB` },
      { label: 'Total link loss', value: `${fmt(r.totalLossDb)} dB` },
      ...(r.hasBudget ? [{ label: 'Margin left after the safety allowance', value: `${fmt(r.marginDb)} dB` }] : []),
      ...(r.hasBudget && r.marginDb < 0
        ? [{ warn: 'The link loss is more than the optics can cover. Use longer-reach optics, fewer connections or a lower-loss fibre.' }]
        : []),
    ],
    note: 'Attenuation figures are the TIA-568 maximums quoted by the Fiber Optic Association; real cable is usually better. Test the finished link with a light source and power meter.',
  },

  'cable-quantity-calculator': {
    fields: [
      { id: 'runs', label: 'Number of cable runs', type: 'number', default: '24', step: '1' },
      { id: 'averageMetres', label: 'Average run length (m)', type: 'number', default: '35', step: '1', hint: 'Along the cable path from the rack to the outlet, not in a straight line.' },
      { id: 'longestMetres', label: 'Longest run (m)', type: 'number', default: '70', step: '1' },
      { id: 'slackMetres', label: 'Slack per run (m)', type: 'number', default: '3', step: '0.5', hint: 'Service loops and termination at both ends.' },
      { id: 'wastePercent', label: 'Waste allowance (%)', type: 'number', default: '10', step: '1' },
      {
        id: 'boxMetres',
        label: 'Box or reel size',
        type: 'select',
        default: '305',
        options: [
          { value: '305', label: '305 m box' },
          { value: '500', label: '500 m reel' },
        ],
      },
    ],
    compute: (v) => cableQuantity(v),
    results: (r, v) => [
      { label: 'Cable needed', value: `${fmt(r.totalMetres, 0)} m` },
      { label: `${v.boxMetres === '500' ? 'Reels' : 'Boxes'} to order`, value: String(r.boxes) },
      { label: 'Left over', value: `${fmt(r.spareMetres, 0)} m` },
      { label: 'Longest run with slack', value: `${fmt(r.longestWithSlack, 0)} m` },
      ...(r.overPermanentLink
        ? [{ warn: `The longest run is over the ${PERMANENT_LINK_MAX_METRES} m permanent link that TIA-568 allows (100 m including patch leads). Add a switch, a PoE extender or fibre for that run.` }]
        : []),
    ],
    note: 'Runs over 90 m will not pass certification for Ethernet; plan a closer switch or fibre for them.',
  },
};
