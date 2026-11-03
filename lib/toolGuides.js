// How to use each free tool, step by step, for Ask Tera (Robert, 2026-11-03): Tera
// reads these with the tools' own descriptions (lib/supportLibrary.js), so it can walk
// a customer through a tool screen by screen. The backend also reads every page of the
// site itself, which gives Tera each tool's boxes and starting results. Pure, with
// relative imports, so the plain Node test runner can load this file.

const SITE_PLAN_STEPS = [
  'Open the Site Plan Designer at /tools/site-plan-designer. The first time it shows a sample office and warehouse plan so there is something to try; press Sample plan at any time to load it again.',
  'Upload your plan: press Upload your plan and choose a PNG, JPG or WebP picture of the floor plan, up to 25 MB. For a PDF plan, save the page as a picture first. With no plan you can draw on the grid, where one square is 1 metre.',
  'Set the scale: press Set scale, click two points on the plan whose real distance you know (the ends of a wall), type the distance in metres and press Set scale. Until the scale is set the plan is assumed to be 40 m across and cable lengths are not worked out.',
  'Add equipment: pick the device in the drop-down next to Add. It is grouped into CCTV, Alarm and intrusion, Access control, Intercom, Fire, Network and IT, Audio and display, and Power and other, with over 50 kinds of device. Press Add, then click the plan where it goes; keep clicking to add more.',
  'Move and turn: press Move and turn, then drag a device to move it. Cameras, detectors, wall speakers and wireless bridges have a small round handle; drag it to turn the device.',
  'Change a device: click it. You can rename it; for a camera set the resolution and the lens focal length and sensor size, or the datasheet field of view; for a detector its range and angle; for a ceiling speaker the ceiling and listening heights; for a Wi-Fi access point its coverage radius. Copy makes another the same; Remove deletes it.',
  'Coverage colours: cameras show the IEC 62676-4 DORI bands, red to identify, amber to recognise, green to observe and blue to detect. Other devices show their range or radius.',
  'Cabling: each device is cabled back to the nearest head end of its system (cameras to the recorder or a switch, detectors, keypads and sirens to the alarm panel, readers, locks and exit buttons to the door controller, network devices to the switch or rack, speakers to the amplifier). Click a device to change its Cable, where it Runs to, the Number of runs or an Extra length. Add the head ends (recorder, alarm panel, door controller, switch, amplifier) to the plan so the runs have somewhere to go.',
  'Equipment schedule: under the plan, every device with its type, coverage, cable and where it runs to. Click a row to select that device.',
  'Cable schedules: one tab for each system (CCTV, Alarm, Access control, Intercom, Fire, Network, Audio and display), with numbered cables (CC-01, AL-01 and so on), the cable type, number of runs, length each and total, and the cable to order with 305 m boxes for Cat6. Lengths follow the walls and ceiling plus 4 m for drops and terminations and 10% spare. Fire is point to panel, for estimating only.',
  'Download Excel (on the equipment schedule, or Save as Excel at the bottom) saves one workbook: a Summary with the cable to order and links to buy it, the Plan picture, the Equipment schedule, and a cable schedule sheet for each system.',
  'Save as a picture saves the plan with its coverage as a PNG. Save plan file saves a .teracom-plan.json file to keep or move to another computer; Open a plan file brings it back. Start a new plan clears it.',
  'The plan stays in that browser on that device; nothing is sent to Teracom. Save the plan file to keep it safe. For a quote on the plan, send the Excel workbook to the team through the contact page.',
];

const RACK_STEPS = [
  'Open the Data Rack Layout at /tools/data-rack-layout. The first time it shows a sample comms room with two racks; press Sample room at any time to load it again.',
  'Racks: each rack has a tab along the top. Add a rack adds another (up to 12), Copy rack makes one the same, and Remove rack takes the one you are on out. All racks shows them side by side; click a rack there to work on it. Give each rack a Rack name, and the room a Room name and Site at the bottom.',
  'Pick each rack\'s Rack size (6RU to 48RU) and Depth. A rack can only be made smaller while all the equipment still fits; move or remove anything above the new top first.',
  'Add equipment: choose it in the Add equipment list (patch panels, fibre panels, cable management, brush panels, switches, PoE switches, routers, NBN modem on a shelf, recorders, servers, NAS, KVM, amplifiers, UPS, power rails, shelves, fan trays, blank panels or other equipment) and press Add. It goes into the highest free space at its usual height.',
  'Move it: drag it up or down the rack, or click it and use Up and Down, or pick a Position. Equipment never overlaps; rack units count from the bottom, so U1 is the lowest.',
  'Label it: click it and type the Label shown on the front (for example Patch panel A, cameras 1-24). Change the Equipment type or the Height in RU to match the datasheet, and add Notes such as the model or IP address. Copy adds another the same; Remove takes it out. With more than one rack, pick another Rack to move it there: it keeps its position if that space is free, or goes to the highest free space.',
  'The table beside the rack lists every unit from the top, with the free space, and the line above the rack shows how many RU are used and free.',
  'Save as a picture saves every rack side by side with the Teracom logo as a PNG. Save as Excel saves a workbook with a summary of the racks, a schedule for each rack and the picture. Save rack file keeps a .teracom-racks.json file (all the racks) to open again later with Open a rack file; files from the single-rack version open too. Start again leaves one empty rack.',
  'The racks stay in that browser on that device; nothing is sent to Teracom. For a quote to supply and build the rack, send the Excel workbook to the team through the contact page.',
];

export const TOOL_GUIDES = {
  'site-plan-designer': SITE_PLAN_STEPS,
  'data-rack-layout': RACK_STEPS,
};

// Every calculator that is not its own planner works the same way.
export function commonSteps(tool) {
  return [
    `Open the ${tool.title} at /tools/${tool.slug}. All the free tools are listed at /tools, grouped by area.`,
    'Fill in the boxes at the top. Each one starts with a typical figure, and the results underneath change as you type. Where a box has a small note under it, the note says where to find that figure, such as the datasheet.',
    'Read the results and the note under them. How it works, further down the page, explains the sums.',
    'To keep the figures, type a name in Name this result (optional) and press Add to project. Add results from other calculators the same way, then press Open project: the project is one report where Save as PDF makes the report with the Teracom logo, Save project file keeps a copy, and Import a saved project brings a saved PDF or file back to change it.',
    'Save as PDF at the top of the tool page prints just this tool and its figures.',
    'For help with the figures, ask Tera. For a quote on the job, press Get a free quote at the bottom of the page.',
  ];
}

/** The step-by-step guide for a tool, as text: "How to use the X: 1. ... 2. ...". */
export function toolGuide(tool) {
  const steps = TOOL_GUIDES[tool.slug] || commonSteps(tool);
  return `How to use the ${tool.title}, step by step: ${steps.map((s, i) => `${i + 1}. ${s}`).join(' ')}`;
}
