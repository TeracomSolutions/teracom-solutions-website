# Data rack layout

The Data Rack Layout from the website's free tools (/tools/data-rack-layout), kept in one folder so the same
code can go into Teracom AI. A front view of a 6RU to 48RU rack: add patch panels, cable management, switches,
routers, recorders, servers, UPS, power rails, shelves and blanks, label each one, and drag them up and down.
It saves a branded picture, an Excel rack schedule (every unit top to bottom, free space included, plus the
picture) and a rack file.

## Files

| File | What it is |
|---|---|
| `model.js` | Rack sizes and depths, the equipment types (height, how it is drawn, colour), placing and moving without overlaps, free space, `rackRows`, the rack file format (`cleanRack` / `parseRack`), the sample rack. Pure. |
| `workbook.js` | The Excel workbook: Rack schedule and Rack picture, with the logo, website and quote links. Pure. |
| `RackArt.js` | How the front of each kind of equipment is drawn (ports, D-rings, drive bays, UPS screen, outlets). |
| `RackPlanner.js` | The React screen (client component). Keeps the rack in the browser's local storage. Takes an optional `brand` prop. |
| `rackplan.css` | The screen's own styles. |
| `__tests__/` | `node --test` tests for the pure files. |

It uses `../siteplan/brand.js` (the brand) and `../siteplan/xlsx.js` (the Excel writer); copy those with it.

Rack units count from the bottom: U1 is the lowest, as printed on the rails. An item's `u` is its bottom unit and
`ru` its height. Racks are saved in local storage under `teracom-rack-layout-v1` and as `.teracom-rack.json` files
(`format: "teracom-rack-layout"`).

## Changing it

- A new kind of equipment: add it to `ITEM_TYPES` in `model.js` with its usual height and an `art` that `RackArt.js`
  draws (or `device` for a generic front panel).
- Rack sizes: `RACK_SIZES`; depths: `RACK_DEPTHS`.
