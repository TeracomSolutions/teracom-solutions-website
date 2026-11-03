# Data rack layout

The Data Rack Layout from the website's free tools (/tools/data-rack-layout), kept in one folder so the same
code can go into Teracom AI. A comms room of up to 12 racks, each a front view of a 6RU to 48RU rack: add patch panels, cable management, switches,
routers, recorders, servers, UPS, power rails, shelves and blanks, label each one, and drag them up and down.
Equipment can be moved to another rack, and All racks shows them side by side. It saves a branded picture of the
room, an Excel workbook (a racks summary, a schedule per rack with every unit top to bottom and the free space, and
the picture) and a rack file.

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
`ru` its height. A room is `{ format: "teracom-rack-room", name, site, racks: [{ id, name, size, depth, items }] }`,
saved in local storage under `teracom-rack-room-v1` and as `.teracom-racks.json` files. Single racks from the first
version (`format: "teracom-rack-layout"`, local storage `teracom-rack-layout-v1`) open as a room of one.

## Changing it

- A new kind of equipment: add it to `ITEM_TYPES` in `model.js` with its usual height and an `art` that `RackArt.js`
  draws (or `device` for a generic front panel).
- Rack sizes: `RACK_SIZES`; depths: `RACK_DEPTHS`.
