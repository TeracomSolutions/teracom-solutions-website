# Site plan designer

The Site Plan Designer from the website's free tools (/tools/site-plan-designer), kept in one folder so the
same code can go into Teracom AI. Nothing in here imports from the rest of the website.

A floor plan (an uploaded picture, the sample, or a blank grid) with over 50 kinds of equipment on it: what each
camera, detector, speaker and access point covers, an equipment schedule, and a cable schedule for each system
(CCTV, alarm, access control, intercom, fire, network, audio and display) with lengths and the cable to order.
It all downloads as one branded Excel workbook, and the saved picture carries the logo too: the tools are there
to advertise the business.

## Files

| File | What it is |
|---|---|
| `model.js` | Device types and groups, coverage maths (DORI, detector wedges, speakers), the plan format, `cleanPlan` / `parsePlan`, the sample plan. Pure. |
| `cables.js` | Cable types, which cable each device takes and where it runs to, run lengths, `cableSchedules(plan)`, `schedulesCsv`. Pure. |
| `brand.js` | Whose name, logo, website, quote link and shop go on everything it makes. |
| `xlsx.js` | A small .xlsx writer (zip, styles, merged cells, links, pictures, print setup). No libraries. |
| `itp.js` | Inspection and test plans: the checks for each device type, cable type and system (`ITP_TEMPLATES`), and `inspectionPlans(plan)`. Pure. |
| `workbook.js` | The workbook: Summary (with cable to order and shop links), Plan picture, Equipment, a cable schedule and an ITP sheet per system. |
| `index.js` | Re-exports model, cables, brand and workbook. |
| `SitePlanner.js` | The React screen (client component). Keeps the plan in the browser's local storage; saves a branded picture, the Excel workbook and a plan file. Takes an optional `brand` prop. |
| `CableSchedule.js` | The cable schedule tabs and totals. |
| `quote.js` | Parts and price: the plan as a parts list (`partsList`), what to search the shop for (`PART_SEARCH`), saved picks (`cleanParts`), prices and the text sent with a quote request. Pure. |
| `PartsList.js` | The Parts and price table: a product per line, Add to cart and Ask for an installed quote. |
| `siteplan.css` | The planner's own styles. |
| `__tests__/` | `node --test` tests for the pure files. |

## Putting it in another app

1. Copy this folder as it is.
2. Needs `react` and `lucide-react`. The screen is a client component (`'use client'`), so in Next.js render it
   from any page: `import SitePlanner from './siteplan/SitePlanner.js'`.
3. `SitePlanner.js` imports `siteplan.css`. It also uses a few of the host's shared classes and colours, which the
   host app should define (or map to its own): `container`, `btn btn-primary btn-secondary`, `field`, `calculator`,
   `form-note`, `form-note-banner`, and the CSS variables `--line` and `--muted`.
4. The brand: pass `brand={{ ...BRAND, ... }}` to `SitePlanner`, or change `brand.js`. The logo must be on the
   same site (or allow cross-origin use), since it is drawn onto the saved picture.
5. The sample plan picture is at `/tools/sample-floor-plan.png` (website `public/tools/`); copy it to the same
   path, or change `SAMPLE_IMAGE` in `model.js`.

Plans are saved in local storage under `teracom-site-plan-v2` and as `.teracom-plan.json` files
(`format: "teracom-site-plan"`), so a plan saved on the website opens in Teracom AI and the other way round.

## Parts and price

Under the cable schedules, each kind of device on the plan and each cable to order is a line with a suggested product,
its price, a quantity and a line total. The host app supplies the shop as SitePlanner's `shop` prop:

```js
{
  findParts(keys) -> Promise<{ parts: { [key]: [{ id, sku, name, href, priceCents }] }, signedIn }>,
  addToCart([{ id, qty }]),
  requestQuote({ planName, deviceCount, site, phone, notes, lines: [{ key, qty, productId, metres }] }) -> Promise<{ ok, error }>,
  cartHref, maxQty,
}
```

Without `shop` the list shows the parts with links to search the store. The website's version is
`components/tools/SitePlanDesigner.js` with `/api/tools/site-plan-parts` (suggestions, `lib/sitePlanParts.js`) and
`/api/tools/site-plan-quote` (sends the list to Sales as an enquiry). The products chosen are saved on the plan as
`parts: { [key]: { id, qty } }` (`id: ''` means none from the store).

## Changing it

- A new kind of device: add it to `DEVICE_TYPES` in `model.js` (group, label, colour, coverage), its icon to
  `ICONS` in `SitePlanner.js`, and its cable to `CABLE_RULES` in `cables.js`.
- Cable rules: `CABLE_RULES[type] = { cable, to: [head-end types, preferred first] }`. Each device is cabled to the
  nearest head end of the first type on the plan. Staff can override the cable, head end, runs and extra metres
  per device; those are saved on the device as `cable`, `cableTo`, `cableRuns`, `cableExtra`.
- Run length: across then along between the two points (walls and ceilings), plus `DROP_METRES` (4 m) and
  `SLACK` (10%), rounded up to the metre. Lengths need the plan's scale.

## Inspection and test plans (ITP)

Each system on the plan gets an ITP sheet in the workbook for signing the site off at handover: every device with
its checks (a camera's mounting, field of view, line and level, focus, night picture and recording; a door's card,
exit, fire release and forced/held alarms), then its cable's checks (route, separation, labels, termination, and
the test for that cable), then the system's commissioning checks and the handover checks. Each check has
acceptance criteria, a point (H hold, W witness, I inspect, T test), a Pass / Fail / N/A drop-down, a reading
column with its unit, who checked it and when, and a sign-off block for installer, supervisor and client.

The checks are data in `ITP_TEMPLATES` (`itp.js`):

- `types[deviceType]`: the checks for that kind of device. `{coverage}` in the criteria becomes what the plan says
  the device covers.
- `groups[group].device`: checks for a device whose type has no entry; `groups[group].system`: the system checks.
- `cables.default` for every run, then `cables[cableId]` for that cable type.
- `handover`: the last section of every system.

A check is `{ check, criteria, point, reading }`. To use a company's own ITP (for example a sample from AV,
security or electrical work), pass `itp: { ...ITP_TEMPLATES, types: { ...ITP_TEMPLATES.types, camera: [...] } }`
to `sitePlanWorkbook`, or change `ITP_TEMPLATES`. `itp: false` leaves the ITP sheets out.
