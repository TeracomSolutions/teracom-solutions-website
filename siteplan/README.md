# Site plan designer

The Site Plan Designer from the website's free tools (/tools/site-plan-designer), kept in one folder so the
same code can go into Teracom AI. Nothing in here imports from the rest of the website.

A floor plan (an uploaded picture, the sample, or a blank grid) with over 50 kinds of equipment on it: what each
camera, detector, speaker and access point covers, an equipment schedule, and a cable schedule for each system
(CCTV, alarm, access control, intercom, fire, network, audio and display) with lengths and the cable to order.

## Files

| File | What it is |
|---|---|
| `model.js` | Device types and groups, coverage maths (DORI, detector wedges, speakers), the plan format, `cleanPlan` / `parsePlan`, the sample plan. Pure. |
| `cables.js` | Cable types, which cable each device takes and where it runs to, run lengths, `cableSchedules(plan)`, `schedulesCsv`. Pure. |
| `index.js` | Re-exports both. |
| `SitePlanner.js` | The React screen (client component). Keeps the plan in the browser's local storage; saves a picture, a plan file and CSV schedules. |
| `CableSchedule.js` | The cable schedule tabs, totals and CSV buttons. |
| `siteplan.css` | The planner's own styles. |
| `__tests__/` | `node --test` tests for the pure files. |

## Putting it in another app

1. Copy this folder as it is.
2. Needs `react` and `lucide-react`. The screen is a client component (`'use client'`), so in Next.js render it
   from any page: `import SitePlanner from './siteplan/SitePlanner.js'`.
3. `SitePlanner.js` imports `siteplan.css`. It also uses a few of the host's shared classes and colours, which the
   host app should define (or map to its own): `container`, `btn btn-primary btn-secondary`, `field`, `calculator`,
   `form-note`, `form-note-banner`, and the CSS variables `--line` and `--muted`.
4. The sample plan picture is at `/tools/sample-floor-plan.png` (website `public/tools/`); copy it to the same
   path, or change `SAMPLE_IMAGE` in `model.js`.

Plans are saved in local storage under `teracom-site-plan-v2` and as `.teracom-plan.json` files
(`format: "teracom-site-plan"`), so a plan saved on the website opens in Teracom AI and the other way round.

## Changing it

- A new kind of device: add it to `DEVICE_TYPES` in `model.js` (group, label, colour, coverage), its icon to
  `ICONS` in `SitePlanner.js`, and its cable to `CABLE_RULES` in `cables.js`.
- Cable rules: `CABLE_RULES[type] = { cable, to: [head-end types, preferred first] }`. Each device is cabled to the
  nearest head end of the first type on the plan. Staff can override the cable, head end, runs and extra metres
  per device; those are saved on the device as `cable`, `cableTo`, `cableRuns`, `cableExtra`.
- Run length: across then along between the two points (walls and ceilings), plus `DROP_METRES` (4 m) and
  `SLACK` (10%), rounded up to the metre. Lengths need the plan's scale.
