// Field/result definitions for the solar and running-cost calculators,
// rendered by components/tools/ConfigCalculator.js.
import { fmt } from '@/lib/calcFormat';
import { BATTERY_TYPES, runningCost, solarCamera } from '@/lib/powerCalculators';

export const powerToolConfigs = {
  'solar-battery-calculator': {
    fields: [
      { id: 'loadWatts', label: 'Average load (W)', type: 'number', default: '8', step: '0.5', hint: 'The camera plus any 4G router, from the datasheets.' },
      { id: 'hoursPerDay', label: 'Hours running per day', type: 'number', default: '24', step: '1' },
      {
        id: 'systemVolts',
        label: 'System voltage',
        type: 'select',
        default: '12',
        options: [
          { value: '12', label: '12 V' },
          { value: '24', label: '24 V' },
        ],
      },
      { id: 'autonomyDays', label: 'Days with no sun', type: 'number', default: '3', step: '1', hint: 'How long the battery must keep the camera running through cloudy weather.' },
      { id: 'batteryType', label: 'Battery type', type: 'select', default: 'lithium', options: BATTERY_TYPES.map((b) => ({ value: b.id, label: b.label })) },
      {
        id: 'sunHours',
        label: 'Peak sun hours in the worst month',
        type: 'number',
        default: '2.5',
        step: '0.1',
        hint: "The Bureau of Meteorology's daily solar exposure for the site, in MJ/m², divided by 3.6.",
      },
      { id: 'lossesPercent', label: 'System losses (%)', type: 'number', default: '25', step: '5', hint: 'Dust, heat, wiring and charging losses.' },
    ],
    compute: (v) => solarCamera(v),
    results: (r, v) => [
      { label: 'Energy per day', value: `${fmt(r.dailyWh, 0)} Wh` },
      { label: 'Battery capacity', value: `${fmt(r.batteryWh, 0)} Wh (${fmt(r.batteryAh, 0)} Ah at ${v.systemVolts} V)` },
      { label: 'Solar panel', value: `at least ${fmt(r.panelWatts, 0)} W` },
      { label: 'Charge controller', value: `at least ${fmt(r.controllerAmps, 1)} A` },
    ],
    note: 'A starting point for a remote camera site, not a full stand-alone power system design. Size for the worst month: winter sun in southern Australia is a fraction of summer.',
  },

  'running-cost-calculator': {
    fields: [
      { id: 'centsPerKwh', label: 'Electricity rate (cents per kWh)', type: 'number', default: '30', step: '0.5', hint: 'From your electricity bill.' },
    ],
    rows: {
      label: 'Equipment',
      addLabel: 'Add equipment',
      columns: [
        { id: 'name', label: 'Equipment', type: 'text' },
        { id: 'watts', label: 'Power each (W)', type: 'number', step: '1' },
        { id: 'quantity', label: 'Quantity', type: 'number', step: '1' },
        { id: 'hoursPerDay', label: 'Hours per day', type: 'number', step: '1' },
      ],
      defaults: [
        { name: 'NVR', watts: '40', quantity: '1', hoursPerDay: '24' },
        { name: 'Cameras', watts: '6', quantity: '8', hoursPerDay: '24' },
        { name: 'PoE switch', watts: '25', quantity: '1', hoursPerDay: '24' },
      ],
      blank: { name: '', watts: '0', quantity: '1', hoursPerDay: '24' },
    },
    compute: (v, rows) => runningCost({ devices: rows, centsPerKwh: v.centsPerKwh }),
    results: (r) => [
      { label: 'Total power', value: `${fmt(r.watts, 0)} W` },
      { label: 'Energy per day', value: `${fmt(r.kwhPerDay, 2)} kWh` },
      { label: 'Energy per year', value: `${fmt(r.kwhPerYear, 0)} kWh` },
      { label: 'Cost per year', value: `$${fmt(r.dollarsPerYear, 2)}` },
      { label: 'Cost per quarter', value: `$${fmt(r.dollarsPerQuarter, 2)}` },
    ],
    note: "The starting values are examples only. Use each device's measured or typical draw, not its power supply rating, which is usually much higher.",
  },
};
