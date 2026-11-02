'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Cctv,
  Copy,
  CreditCard,
  DoorOpen,
  Download,
  FileUp,
  Grid3x3,
  ImageUp,
  LayoutTemplate,
  MapPin,
  MousePointer2,
  Plus,
  Radar,
  Ruler,
  Save,
  Siren,
  Smartphone,
  Speaker,
  Trash2,
  Wifi,
} from 'lucide-react';
import {
  BLANK_PLAN,
  DEVICE_TYPES,
  DORI,
  MAX_DEVICES,
  OLD_PLAN_STORAGE_KEY,
  PLAN_STORAGE_KEY,
  RESOLUTIONS,
  SAMPLE_IMAGE,
  SENSORS,
  cameraFov,
  coverageShapes,
  coverageText,
  deviceType,
  doriDistances,
  effectiveScale,
  emptyPlan,
  newDevice,
  parsePlan,
  samplePlan,
  scaleFromPoints,
  speakerRadius,
} from '@/lib/sitePlan';

// Site plan designer (Robert, 2026-11-02): upload a floor plan (or start from the
// sample), drop cameras, detectors, speakers, access points, doors and more on it, and
// see what each one covers. Kept in this browser; saved as a picture or a plan file.
const ICONS = { camera: Cctv, motion: Radar, speaker: Speaker, wifi: Wifi, door: DoorOpen, reader: CreditCard, keypad: Grid3x3, siren: Siren, intercom: Smartphone, other: MapPin };
const LETTERS = { camera: 'C', motion: 'M', speaker: 'S', wifi: 'W', door: 'D', reader: 'R', keypad: 'K', siren: 'A', intercom: 'I', other: 'O' };
const MAX_SIDE = 2400;
const DORI_COLOURS = { identify: '#ef4444', recognise: '#f59e0b', observe: '#22c55e', detect: '#3b82f6' };

// Always through an object URL, so the link never points at anything typed or opened.
function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// A saved plan picture back into something a canvas can draw, without pointing an
// <img> at text that came from a file.
async function decodeDataUrl(dataUrl) {
  const [head, body] = dataUrl.split(',');
  const type = /^data:(image\/(?:png|jpeg|webp));base64$/.exec(head)?.[1];
  if (!type || !body) throw new Error('Not a plan picture.');
  const bytes = Uint8Array.from(window.atob(body), (ch) => ch.charCodeAt(0));
  return window.createImageBitmap(new Blob([bytes], { type }));
}

async function planBitmap(image) {
  if (image.src === SAMPLE_IMAGE.src) return window.createImageBitmap(await (await fetch(SAMPLE_IMAGE.src)).blob());
  return decodeDataUrl(image.dataUrl);
}

// Decoded straight from the file, shrunk to 2,400 px on the long side and redrawn as a JPEG.
async function readPlanImage(file) {
  const source = await window.createImageBitmap(file);
  const ratio = Math.min(1, MAX_SIDE / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * ratio);
  canvas.height = Math.round(source.height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close?.();
  return { dataUrl: canvas.toDataURL('image/jpeg', 0.85), width: canvas.width, height: canvas.height };
}

const fileName = (plan, ext) => `${(plan.name || 'site-plan').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'site-plan'}.${ext}`;

function readStored() {
  try {
    const stored = parsePlan(window.localStorage.getItem(PLAN_STORAGE_KEY) || '');
    if (stored) return stored;
    // Plans made with the first, camera-only version carry straight over.
    return parsePlan(window.localStorage.getItem(OLD_PLAN_STORAGE_KEY) || '');
  } catch {
    return null;
  }
}

export default function SitePlanner() {
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('select');
  const [addType, setAddType] = useState('camera');
  const [scalePoints, setScalePoints] = useState([]);
  const [scaleMetres, setScaleMetres] = useState('10');
  const [message, setMessage] = useState('');
  const [stored, setStored] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const svgRef = useRef(null);
  const drag = useRef(null);
  const justDragged = useRef(false);
  const planRef = useRef(null);
  const planInput = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    planRef.current = plan;
  });

  useEffect(() => {
    // First visit: the sample plan, so there is something to try straight away.
    setPlan(readStored() || samplePlan());
  }, []);

  const save = (next) => {
    try {
      window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(next));
      setStored(true);
    } catch {
      setStored(false);
    }
  };
  const commit = (next) => {
    setPlan(next);
    save(next);
  };

  if (!plan) return <div className="container site-planner"><p>Loading the planner...</p></div>;

  const size = plan.image || BLANK_PLAN;
  const unit = Math.max(size.width, size.height) / 100;
  const scale = effectiveScale(plan);
  const device = plan.devices.find((d) => d.id === selected) || null;
  const kind = device ? deviceType(device.type) : null;
  const typesUsed = DEVICE_TYPES.filter((t) => plan.devices.some((d) => d.type === t.type));

  const point = (event) => {
    const svg = svgRef.current;
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const local = p.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.max(0, Math.min(size.width, local.x)), y: Math.max(0, Math.min(size.height, local.y)) };
  };

  const updateDevice = (id, changes) => commit({ ...plan, devices: plan.devices.map((d) => (d.id === id ? { ...d, ...changes } : d)) });

  const onPlanClick = (event) => {
    // The click that ends a drag is not a click on the plan.
    if (drag.current || justDragged.current) {
      justDragged.current = false;
      return;
    }
    const p = point(event);
    if (mode === 'add') {
      if (plan.devices.length >= MAX_DEVICES) {
        setMessage(`A plan can hold up to ${MAX_DEVICES} devices.`);
        return;
      }
      const id = `d${Date.now().toString(36)}`;
      const count = plan.devices.filter((d) => d.type === addType).length + 1;
      commit({ ...plan, devices: [...plan.devices, newDevice(addType, id, p.x, p.y, count)] });
      setSelected(id);
      setMessage(`${deviceType(addType).label} added. Click again to add another, or press Move and turn.`);
    } else if (mode === 'scale') {
      const next = [...scalePoints, p].slice(-2);
      setScalePoints(next);
      if (next.length === 2) setMessage('Now enter the real distance between the two points and press Set scale.');
    } else {
      setSelected(null);
    }
  };

  const startDrag = (event, id, how) => {
    if (mode !== 'select') return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { id, how, moved: false };
    setSelected(id);
  };

  const onMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const p = point(event);
    d.moved = true;
    setPlan((current) => ({
      ...current,
      devices: current.devices.map((item) => {
        if (item.id !== d.id) return item;
        if (d.how === 'move') return { ...item, x: p.x, y: p.y };
        const angle = (Math.atan2(p.y - item.y, p.x - item.x) * 180) / Math.PI;
        return { ...item, rotation: Math.round((angle + 360) % 360) };
      }),
    }));
  };

  const endDrag = () => {
    if (!drag.current) return;
    justDragged.current = drag.current.moved;
    drag.current = null;
    // Only the click that comes straight after this drag is ignored.
    window.setTimeout(() => {
      justDragged.current = false;
    }, 0);
    save(planRef.current);
  };

  const uploadPlan = async (file) => {
    if (!file) return;
    setMessage('');
    try {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error('Upload the plan as a PNG or JPG picture. For a PDF plan, save the page as a picture first.');
      if (file.size > 25 * 1024 * 1024) throw new Error('That picture is over 25 MB. Save a smaller copy and try again.');
      const image = await readPlanImage(file);
      commit({ ...plan, image, pxPerMetre: 0 });
      setMessage('Plan added. Set the scale next, so the distances are right.');
      setMode('scale');
      setScalePoints([]);
    } catch (error) {
      setMessage(error.message || 'That picture could not be read.');
    } finally {
      if (planInput.current) planInput.current.value = '';
    }
  };

  const setScale = () => {
    const pxPerMetre = scaleFromPoints(scalePoints[0], scalePoints[1], scaleMetres);
    if (!pxPerMetre) {
      setMessage('Click two points on the plan and enter the distance between them in metres.');
      return;
    }
    commit({ ...plan, pxPerMetre });
    setScalePoints([]);
    setMode('select');
    setMessage('Scale set. The coloured areas now show real distances.');
  };

  const savePicture = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size.width, size.height);
      if (plan.image) ctx.drawImage(await planBitmap(plan.image), 0, 0, size.width, size.height);
      for (const d of plan.devices) {
        for (const shape of coverageShapes(d, scale)) {
          ctx.globalAlpha = shape.opacity;
          ctx.fillStyle = shape.colour;
          if (shape.path) ctx.fill(new Path2D(shape.path));
          else {
            ctx.beginPath();
            ctx.arc(shape.circle.cx, shape.circle.cy, shape.circle.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (const d of plan.devices) {
        ctx.fillStyle = deviceType(d.type).colour;
        ctx.beginPath();
        ctx.arc(d.x, d.y, unit * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(unit * 1.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(LETTERS[d.type] || 'O', d.x, d.y + unit * 0.05);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.lineWidth = unit * 0.35;
        ctx.strokeStyle = '#ffffff';
        ctx.font = `bold ${Math.round(unit * 1.2)}px sans-serif`;
        const left = d.x > size.width * 0.8;
        ctx.textAlign = left ? 'right' : 'left';
        const lx = left ? d.x - unit * 1.7 : d.x + unit * 1.7;
        ctx.strokeText(d.name, lx, d.y - unit * 1.2);
        ctx.fillStyle = '#111827';
        ctx.fillText(d.name, lx, d.y - unit * 1.2);
      }
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('No picture');
      download(blob, fileName(plan, 'png'));
    } catch {
      setMessage('The picture could not be made. Try again, or save the plan file instead.');
    }
  };

  const savePlanFile = () => download(new Blob([JSON.stringify(plan)], { type: 'application/json' }), fileName(plan, 'teracom-plan.json'));

  const openPlanFile = async (file) => {
    if (!file) return;
    try {
      if (file.size > 30 * 1024 * 1024) throw new Error('That file is too large to be a site plan.');
      const opened = parsePlan(await file.text());
      if (!opened) throw new Error('That file is not a Teracom site plan.');
      commit(opened);
      setSelected(null);
      setMessage(`Opened "${opened.name || 'site plan'}" with ${opened.devices.length} device${opened.devices.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setMessage(error.message || 'That file could not be read.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const loadSample = () => {
    commit(samplePlan());
    setSelected(null);
    setMode('select');
    setMessage('Sample plan loaded. Drag anything to move it, or add your own devices.');
  };

  const startAgain = () => {
    commit(emptyPlan());
    setSelected(null);
    setConfirmClear(false);
    setMode('add');
    setMessage('Started a new, empty plan. Upload your plan, or click the grid to add devices.');
  };

  const field = (id, label, value, onChange, props = {}) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min="0" step="any" inputMode="decimal" value={value} onChange={onChange} {...props} />
    </div>
  );

  return (
    <div className="container site-planner">
      <div className="site-planner-toolbar">
        <button type="button" className="btn btn-secondary" onClick={() => planInput.current?.click()}>
          <ImageUp size={18} strokeWidth={2} aria-hidden="true" /> {plan.image && plan.image.src !== SAMPLE_IMAGE.src ? 'Change plan' : 'Upload your plan'}
        </button>
        <input ref={planInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => uploadPlan(e.target.files?.[0])} />
        <div className="site-planner-add">
          <label htmlFor="site-add-type" className="site-planner-hidden-label">Device to add</label>
          <select id="site-add-type" value={addType} onChange={(e) => { setAddType(e.target.value); setMode('add'); setMessage(`Click the plan to add a ${deviceType(e.target.value).label.toLowerCase()}.`); }}>
            {DEVICE_TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
          </select>
          <button type="button" className={mode === 'add' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => { setMode(mode === 'add' ? 'select' : 'add'); setMessage(`Click the plan to add a ${deviceType(addType).label.toLowerCase()}.`); }}>
            <Plus size={18} strokeWidth={2} aria-hidden="true" /> Add
          </button>
        </div>
        <button type="button" className={mode === 'select' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('select')}>
          <MousePointer2 size={18} strokeWidth={2} aria-hidden="true" /> Move and turn
        </button>
        <button type="button" className={mode === 'scale' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => { setMode(mode === 'scale' ? 'select' : 'scale'); setScalePoints([]); setMessage('Click two points on the plan whose distance apart you know, such as the ends of a wall.'); }}>
          <Ruler size={18} strokeWidth={2} aria-hidden="true" /> Set scale
        </button>
        <button type="button" className="btn btn-secondary" onClick={loadSample}>
          <LayoutTemplate size={18} strokeWidth={2} aria-hidden="true" /> Sample plan
        </button>
      </div>

      {mode === 'scale' && scalePoints.length === 2 ? (
        <div className="site-planner-scale">
          <label htmlFor="plan-scale-metres">Distance between the two points (m)</label>
          <input id="plan-scale-metres" type="number" min="0" step="any" inputMode="decimal" value={scaleMetres} onChange={(e) => setScaleMetres(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={setScale}>Set scale</button>
        </div>
      ) : null}
      {message ? <p className="form-note site-planner-message" role="status">{message}</p> : null}
      {!plan.pxPerMetre ? <p className="form-note-banner">The scale is not set, so the plan is assumed to be 40 m across. Use Set scale for real distances.</p> : null}
      {!stored ? <p className="form-note-banner" role="status">This browser would not store the plan, so it will be lost when you leave. Save the plan file before you go.</p> : null}

      <div className={`site-planner-canvas mode-${mode}`}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${size.width} ${size.height}`}
          role="img"
          aria-label={`Site plan with ${plan.devices.length} device${plan.devices.length === 1 ? '' : 's'}`}
          onClick={onPlanClick}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {plan.image ? (
            <image href={plan.image.src || plan.image.dataUrl} x="0" y="0" width={size.width} height={size.height} />
          ) : (
            <>
              <defs>
                <pattern id="plan-grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                  <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#d1d5db" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={size.width} height={size.height} fill="#f9fafb" />
              <rect width={size.width} height={size.height} fill="url(#plan-grid)" />
              <text x={size.width / 2} y={size.height / 2} textAnchor="middle" fontSize={unit * 2.4} fill="#6b7280">
                Upload your plan, or click the grid to add devices (one square = 1 m)
              </text>
            </>
          )}

          {plan.devices.map((d) =>
            coverageShapes(d, scale).map((shape) =>
              shape.path ? (
                <path key={`${d.id}-${shape.key}`} d={shape.path} fill={shape.colour} fillOpacity={shape.opacity} pointerEvents="none" />
              ) : (
                <circle key={`${d.id}-${shape.key}`} {...shape.circle} fill={shape.colour} fillOpacity={shape.opacity} stroke={shape.colour} strokeOpacity={0.5} strokeWidth={unit * 0.15} pointerEvents="none" />
              ),
            ),
          )}

          {scalePoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={unit * 0.8} fill="#ff1717" />)}
          {scalePoints.length === 2 ? (
            <line x1={scalePoints[0].x} y1={scalePoints[0].y} x2={scalePoints[1].x} y2={scalePoints[1].y} stroke="#ff1717" strokeWidth={unit * 0.3} strokeDasharray={`${unit} ${unit * 0.6}`} />
          ) : null}

          {plan.devices.map((d) => {
            const t = deviceType(d.type);
            const Icon = ICONS[t.type] || MapPin;
            const active = d.id === selected;
            const r = unit * 1.5;
            const handle = unit * 5;
            const hx = d.x + handle * Math.cos((d.rotation * Math.PI) / 180);
            const hy = d.y + handle * Math.sin((d.rotation * Math.PI) / 180);
            // Names near the right edge go on the left of the icon so they are not cut off.
            const labelLeft = d.x > size.width * 0.8;
            return (
              <g key={d.id}>
                {active && t.turns ? (
                  <>
                    <line x1={d.x} y1={d.y} x2={hx} y2={hy} stroke="#111827" strokeWidth={unit * 0.25} />
                    <circle cx={hx} cy={hy} r={unit * 0.9} fill="#ffffff" stroke="#111827" strokeWidth={unit * 0.25} className="site-planner-handle" onPointerDown={(e) => startDrag(e, d.id, 'turn')} onClick={(e) => e.stopPropagation()} />
                  </>
                ) : null}
                <g className="site-planner-device" onPointerDown={(e) => startDrag(e, d.id, 'move')} onClick={(e) => { e.stopPropagation(); setSelected(d.id); }}>
                  <circle cx={d.x} cy={d.y} r={r} fill={t.colour} stroke={active ? '#111827' : '#ffffff'} strokeWidth={unit * (active ? 0.45 : 0.3)} />
                  <Icon x={d.x - r * 0.6} y={d.y - r * 0.6} size={r * 1.2} color="#ffffff" strokeWidth={2.2} aria-hidden="true" />
                </g>
                <text x={labelLeft ? d.x - r - unit * 0.4 : d.x + r + unit * 0.4} y={d.y - r * 0.6} textAnchor={labelLeft ? 'end' : 'start'} fontSize={unit * 1.25} fontWeight="700" fill="#111827" stroke="#ffffff" strokeWidth={unit * 0.35} paintOrder="stroke" pointerEvents="none">
                  {d.name}
                </text>
              </g>
            );
          })}
        </svg>
        <ul className="site-planner-legend" aria-label="Colour key">
          {typesUsed.map((t) => (
            <li key={t.type}>
              <span style={{ background: t.colour }} aria-hidden="true" /> {t.label} ({plan.devices.filter((d) => d.type === t.type).length})
            </li>
          ))}
          {typesUsed.some((t) => t.type === 'camera')
            ? [...DORI].reverse().map((level) => (
                <li key={level.id} className="site-planner-legend-band">
                  <span style={{ background: DORI_COLOURS[level.id] }} aria-hidden="true" /> Camera: {level.label.toLowerCase()}
                </li>
              ))
            : null}
        </ul>
      </div>

      {device ? (
        <div className="site-planner-editor calculator">
          <div className="site-planner-editor-head">
            <span className="site-planner-chip" style={{ background: kind.colour }}>{kind.label}</span>
            <div className="site-planner-row">
              <button type="button" className="btn btn-secondary" disabled={plan.devices.length >= MAX_DEVICES} onClick={() => {
                const id = `d${Date.now().toString(36)}`;
                commit({ ...plan, devices: [...plan.devices, { ...device, id, name: `${device.name} copy`, x: device.x + unit * 4, y: device.y + unit * 4 }] });
                setSelected(id);
              }}>
                <Copy size={16} strokeWidth={2} aria-hidden="true" /> Copy
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { commit({ ...plan, devices: plan.devices.filter((d) => d.id !== device.id) }); setSelected(null); }}>
                <Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remove
              </button>
            </div>
          </div>
          <div className="site-planner-fields">
            <div className="field">
              <label htmlFor="dev-name">Name</label>
              <input id="dev-name" type="text" maxLength={80} value={device.name} onChange={(e) => updateDevice(device.id, { name: e.target.value })} />
            </div>
            {device.type === 'camera' ? (
              <>
                <div className="field">
                  <label htmlFor="dev-resolution">Resolution</label>
                  <select id="dev-resolution" value={device.resolution} onChange={(e) => updateDevice(device.id, { resolution: e.target.value })}>
                    {RESOLUTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="dev-mode">Field of view from</label>
                  <select id="dev-mode" value={device.fovMode} onChange={(e) => updateDevice(device.id, { fovMode: e.target.value })}>
                    <option value="lens">The lens (focal length)</option>
                    <option value="fov">The datasheet angle</option>
                  </select>
                </div>
                {device.fovMode === 'lens' ? (
                  <>
                    {field('dev-focal', 'Lens focal length (mm)', device.focal, (e) => updateDevice(device.id, { focal: e.target.value }), { step: '0.1' })}
                    <div className="field">
                      <label htmlFor="dev-sensor">Sensor size</label>
                      <select id="dev-sensor" value={device.sensor} onChange={(e) => updateDevice(device.id, { sensor: e.target.value })}>
                        {SENSORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  field('dev-fov', 'Horizontal field of view (degrees)', device.hfov, (e) => updateDevice(device.id, { hfov: e.target.value }), { max: '179' })
                )}
              </>
            ) : null}
            {device.type === 'motion' ? (
              <>
                {field('dev-range', 'Detection range (m)', device.range, (e) => updateDevice(device.id, { range: e.target.value }))}
                {field('dev-angle', 'Detection angle (degrees)', device.angle, (e) => updateDevice(device.id, { angle: e.target.value }), { max: '360' })}
              </>
            ) : null}
            {device.type === 'speaker' ? (
              <>
                {field('dev-ceiling', 'Ceiling height (m)', device.ceiling, (e) => updateDevice(device.id, { ceiling: e.target.value }))}
                {field('dev-listen', 'Listening height (m)', device.listen, (e) => updateDevice(device.id, { listen: e.target.value }))}
                {field('dev-angle', 'Coverage angle (degrees)', device.angle, (e) => updateDevice(device.id, { angle: e.target.value }))}
              </>
            ) : null}
            {device.type === 'wifi' || device.type === 'other'
              ? field('dev-radius', device.type === 'wifi' ? 'Coverage radius (m)' : 'Coverage radius (m, 0 for none)', device.radius, (e) => updateDevice(device.id, { radius: e.target.value }))
              : null}
            {kind.turns ? (
              <div className="field">
                <label htmlFor="dev-rotation">Direction ({device.rotation}°)</label>
                <input id="dev-rotation" type="range" min="0" max="359" value={device.rotation} onChange={(e) => updateDevice(device.id, { rotation: Number(e.target.value) })} />
              </div>
            ) : null}
          </div>
          {device.type === 'camera' ? (
            <p className="site-planner-summary">
              {cameraFov(device).toFixed(0)}° view ·{' '}
              {[...doriDistances(device.resolution, cameraFov(device))].reverse().map((l) => `${l.label} ${l.metres.toFixed(1)} m`).join(' · ')}
            </p>
          ) : null}
          {device.type === 'speaker' ? (
            <p className="site-planner-summary">Covers {(speakerRadius(device.ceiling, device.listen, device.angle) * 2).toFixed(1)} m across at listening height.</p>
          ) : null}
          {device.type === 'wifi' ? <p className="site-planner-summary">Indoor range depends on walls and the access point; 10 to 15 m is a common planning figure. Check with a site survey.</p> : null}
        </div>
      ) : (
        <p className="form-note">Click a device to change it. Drag it to move it; drag the small handle on cameras and detectors to turn them.</p>
      )}

      {plan.devices.length ? (
        <div className="site-planner-schedule">
          <h2>Equipment schedule</h2>
          <div className="site-planner-table">
            <table>
              <thead>
                <tr><th>Device</th><th>Type</th><th>Coverage</th></tr>
              </thead>
              <tbody>
                {plan.devices.map((d) => (
                  <tr key={d.id} className={d.id === selected ? 'active' : undefined} onClick={() => setSelected(d.id)}>
                    <td>{d.name}</td>
                    <td>{deviceType(d.type).label}</td>
                    <td>{coverageText(d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="site-planner-toolbar site-planner-save">
        <div className="field site-planner-name">
          <label htmlFor="plan-name">Plan name</label>
          <input id="plan-name" type="text" maxLength={200} value={plan.name} placeholder="e.g. Warehouse ground floor" onChange={(e) => commit({ ...plan, name: e.target.value })} />
        </div>
        <button type="button" className="btn btn-primary" onClick={savePicture}>
          <Download size={18} strokeWidth={2} aria-hidden="true" /> Save as a picture
        </button>
        <button type="button" className="btn btn-secondary" onClick={savePlanFile}>
          <Save size={18} strokeWidth={2} aria-hidden="true" /> Save plan file
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => fileInput.current?.click()}>
          <FileUp size={18} strokeWidth={2} aria-hidden="true" /> Open a plan file
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(e) => openPlanFile(e.target.files?.[0])} />
        {confirmClear ? (
          <>
            <button type="button" className="btn btn-primary" onClick={startAgain}>Yes, clear the plan</button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(false)}>Keep it</button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)}>
            Start a new plan
          </button>
        )}
      </div>
      <p className="form-note">
        Your plan stays in this browser on this device; nothing is sent to Teracom. Save the plan file to keep it or move it to
        another device, and open it here to carry on. Coverage is drawn from the figures you enter (cameras use the IEC 62676-4
        DORI pixel densities) and ignores walls, shelving and mounting details, so confirm it on site.
      </p>
    </div>
  );
}
