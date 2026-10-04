// Field/result definitions for the wireless link and transfer-time
// calculators, rendered by components/tools/ConfigCalculator.js.
import { durationText, fmt } from '@/lib/calcFormat';
import { LINK_FREQUENCIES_GHZ, SIZE_UNITS, SPEED_UNITS, transferTime, wirelessLink } from '@/lib/networkCalculators';

export const networkToolConfigs = {
  'wireless-link-calculator': {
    fields: [
      { id: 'distanceKm', label: 'Link distance (km)', type: 'number', default: '2', step: '0.1' },
      {
        id: 'frequencyGHz',
        label: 'Frequency',
        type: 'select',
        default: '5.8',
        options: LINK_FREQUENCIES_GHZ.map((f) => ({ value: f, label: `${f} GHz` })),
      },
      { id: 'clearancePercent', label: 'Fresnel zone to keep clear (%)', type: 'number', default: '60', step: '5', hint: '60% of the first Fresnel zone is the usual minimum.' },
      { id: 'txPowerDbm', label: 'Transmit power (dBm)', type: 'number', default: '20', step: '1' },
      { id: 'antennaGainDbi', label: 'Antenna gain at each end (dBi)', type: 'number', default: '23', step: '1' },
    ],
    compute: (v) => wirelessLink(v),
    results: (r, v) => [
      { label: 'First Fresnel zone radius at the midpoint', value: `${fmt(r.fresnelMetres)} m` },
      { label: `Clearance for ${fmt(Number(v.clearancePercent) || 0, 0)}% of it`, value: `${fmt(r.clearanceMetres)} m` },
      { label: 'Earth curvature at the midpoint', value: `${fmt(r.earthBulgeMetres)} m` },
      { label: 'Height above obstacles at the midpoint', value: `${fmt(r.totalClearanceMetres)} m` },
      { label: 'Free-space path loss', value: `${fmt(r.pathLossDb, 1)} dB` },
      { label: 'Signal at the receiver (before cable loss)', value: `${fmt(r.receivedDbm, 1)} dBm` },
    ],
    note: "Earth curvature uses the standard 4/3 earth radius for radio. Keep trees, roofs and terrain below the clearance line along the whole path, not just at the midpoint. Check the received signal against the radio's sensitivity and leave a fade margin.",
  },

  'data-transfer-time-calculator': {
    fields: [
      { id: 'size', label: 'Amount of data', type: 'number', default: '2', step: '0.1' },
      { id: 'sizeUnit', label: 'Data unit', type: 'select', default: 'TB', options: SIZE_UNITS.map((u) => ({ value: u.id, label: u.id })) },
      { id: 'speed', label: 'Link speed', type: 'number', default: '1', step: '0.1' },
      { id: 'speedUnit', label: 'Speed unit', type: 'select', default: 'Gbps', options: SPEED_UNITS.map((u) => ({ value: u.id, label: u.id })) },
      { id: 'efficiencyPercent', label: 'Efficiency (%)', type: 'number', default: '90', step: '5', hint: 'Allows for protocol overhead and disk speed.' },
    ],
    compute: (v) => transferTime(v),
    results: (r) => [
      { label: 'Transfer time', value: durationText(r.seconds) },
      { label: 'Data you can move in a day', value: `${fmt(r.tbPerDay, 2)} TB` },
    ],
    note: 'Counted in decimal units (1 TB = 1,000 GB), as drive makers do. Over the internet, use the slower of the sending upload speed and the receiving download speed.',
  },
};
