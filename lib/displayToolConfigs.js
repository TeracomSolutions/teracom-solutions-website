// Field/result definitions for the screen size and projector brightness
// calculators, rendered by components/tools/ConfigCalculator.js.
import { fmt } from '@/lib/calcFormat';
import { ASPECT_RATIOS } from '@/lib/calculators';
import { CONTRAST_CATEGORIES, projectorBrightness, screenSize } from '@/lib/displayCalculators';

const aspectOptions = ASPECT_RATIOS.map((a) => ({ value: a.id, label: a.id }));

export const displayToolConfigs = {
  'screen-size-calculator': {
    fields: [
      { id: 'distanceMetres', label: 'Viewing distance (m)', type: 'number', default: '3', step: '0.1' },
      { id: 'aspect', label: 'Screen shape', type: 'select', default: '16:9', options: aspectOptions },
      { id: 'screenInches', label: 'A screen you are considering (inches, optional)', type: 'number', default: '65', step: '1' },
    ],
    compute: (v) => screenSize(v),
    results: (r, v) => [
      { label: 'Screen for general viewing (30°)', value: `${fmt(r.smpteInches, 0)} in` },
      { label: 'Screen for an immersive seat (40°)', value: `${fmt(r.thxInches, 0)} in` },
      ...(Number(v.screenInches) > 0
        ? [
            { label: `Seat for a ${fmt(Number(v.screenInches), 0)} in screen at 30°`, value: `${fmt(r.smpteMetres, 1)} m` },
            { label: `Seats for a ${fmt(Number(v.screenInches), 0)} in screen at 40° to 28°`, value: `${fmt(r.thxNearestMetres, 1)} m to ${fmt(r.thxFurthestMetres, 1)} m` },
          ]
        : []),
    ],
    note: 'The 30° view angle is the widely quoted SMPTE figure for general viewing; THX recommends 40° for an immersive seat, with a range down to 28°. In meeting rooms, also check that text is readable from the back row.',
  },

  'projector-brightness-calculator': {
    fields: [
      { id: 'widthMetres', label: 'Screen width (m)', type: 'number', default: '2.5', step: '0.1' },
      { id: 'aspect', label: 'Screen shape', type: 'select', default: '16:9', options: aspectOptions },
      { id: 'ambientLux', label: 'Room light on the screen (lux)', type: 'number', default: '150', step: '10', hint: 'Measure at the screen with the room set up as it will be used. A light meter, or a phone app for a rough figure, gives it.' },
      { id: 'category', label: 'What the audience is watching', type: 'select', default: 'basic', options: CONTRAST_CATEGORIES.map((c) => ({ value: c.id, label: c.label })) },
      { id: 'ageingPercent', label: 'Allowance for the projector dimming with age (%)', type: 'number', default: '20', step: '5' },
    ],
    compute: (v) => projectorBrightness(v),
    results: (r, v) => [
      { label: 'Screen area', value: `${fmt(r.areaM2)} m²` },
      { label: 'Contrast target', value: `${r.ratio}:1` },
      { label: 'Light needed on the screen', value: `${fmt(r.screenLux, 0)} lux` },
      { label: 'Projector brightness', value: `at least ${fmt(r.lumens, 0)} lumens` },
      { label: 'With the ageing allowance', value: `${fmt(r.lumensWithAgeing, 0)} lumens` },
      ...(Number(v.ambientLux) > 0
        ? []
        : [{ warn: 'With no room light on the screen, any projector meets the contrast target. Choose by image size and how bright you want it.' }]),
    ],
    note: "Contrast targets are the four ANSI/INFOCOMM 3M-2011 viewing categories. The sum assumes the projector's own black level is small next to the room light. An ambient-light-rejecting screen lowers the brightness you need.",
  },
};
