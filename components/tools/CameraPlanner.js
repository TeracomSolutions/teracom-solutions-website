'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Copy, Download, FileUp, ImageUp, MousePointer2, Ruler, Save, Trash2 } from 'lucide-react';
import {
  BLANK_PLAN,
  DORI,
  MAX_CAMERAS,
  PLAN_STORAGE_KEY,
  RESOLUTIONS,
  SENSORS,
  cameraFov,
  cleanPlan,
  doriDistances,
  effectiveScale,
  emptyPlan,
  newCamera,
  parsePlan,
  scaleFromPoints,
  sectorPath,
} from '@/lib/cameraPlan';

// Camera plan designer (Robert, 2026-11-02): upload a floor plan, drop cameras on it,
// and see each one's field of view in the four DORI bands. Kept in this browser;
// saved as a picture or a plan file that can be opened again to carry on.
const BAND_COLOURS = { identify: '#ef4444', recognise: '#f59e0b', observe: '#22c55e', detect: '#3b82f6' };
const BAND_ALPHA = { identify: 0.38, recognise: 0.3, observe: 0.22, detect: 0.14 };
const MAX_SIDE = 2400;

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

// Plans are shrunk to 2,400 px on the long side so they fit in the browser's storage.
// Decoded straight from the file (no <img> pointed at it), then redrawn as a JPEG.
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

function bands(camera, pxPerMetre) {
  const fov = cameraFov(camera);
  const distances = doriDistances(camera.resolution, fov);
  // Widest first, each band a ring from the next closer level out to its own distance.
  return distances.map((level, i) => ({
    ...level,
    fov,
    inner: (distances[i + 1]?.metres || 0) * pxPerMetre,
    outer: level.metres * pxPerMetre,
  }));
}

export default function CameraPlanner() {
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('select');
  const [scalePoints, setScalePoints] = useState([]);
  const [scaleMetres, setScaleMetres] = useState('10');
  const [message, setMessage] = useState('');
  const [stored, setStored] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const svgRef = useRef(null);
  const drag = useRef(null);
  const justDragged = useRef(false);
  const planRef = useRef(null);
  useEffect(() => {
    planRef.current = plan;
  });
  const planInput = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = parsePlan(window.localStorage.getItem(PLAN_STORAGE_KEY) || '');
    } catch {
      saved = null;
    }
    setPlan(saved || emptyPlan());
  }, []);

  const commit = (next) => {
    setPlan(next);
    try {
      window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(next));
      setStored(true);
    } catch {
      setStored(false);
    }
  };

  if (!plan) return <div className="container camera-planner"><p>Loading the planner...</p></div>;

  const size = plan.image || BLANK_PLAN;
  const unit = Math.max(size.width, size.height) / 100;
  const scale = effectiveScale(plan);
  const camera = plan.cameras.find((c) => c.id === selected) || null;

  const point = (event) => {
    const svg = svgRef.current;
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const local = p.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.max(0, Math.min(size.width, local.x)), y: Math.max(0, Math.min(size.height, local.y)) };
  };

  const updateCamera = (id, changes) => commit({ ...plan, cameras: plan.cameras.map((c) => (c.id === id ? { ...c, ...changes } : c)) });

  const onPlanClick = (event) => {
    // The click that ends a drag is not a click on the plan.
    if (drag.current || justDragged.current) {
      justDragged.current = false;
      return;
    }
    const p = point(event);
    if (mode === 'add') {
      if (plan.cameras.length >= MAX_CAMERAS) {
        setMessage(`A plan can hold up to ${MAX_CAMERAS} cameras.`);
        return;
      }
      const id = `c${Date.now().toString(36)}`;
      commit({ ...plan, cameras: [...plan.cameras, newCamera(id, p.x, p.y, plan.cameras.length + 1)] });
      setSelected(id);
      setMode('select');
      setMessage('Camera added. Drag it to move it, and drag the small handle to turn it.');
    } else if (mode === 'scale') {
      const next = [...scalePoints, p].slice(-2);
      setScalePoints(next);
      if (next.length === 2) setMessage('Now enter the real distance between the two points and press Set scale.');
    } else {
      setSelected(null);
    }
  };

  const startDrag = (event, id, kind) => {
    if (mode !== 'select') return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { id, kind, moved: false };
    setSelected(id);
  };

  const onMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const p = point(event);
    d.moved = true;
    setPlan((current) => ({
      ...current,
      cameras: current.cameras.map((c) => {
        if (c.id !== d.id) return c;
        if (d.kind === 'move') return { ...c, x: p.x, y: p.y };
        const angle = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI;
        return { ...c, rotation: Math.round((angle + 360) % 360) };
      }),
    }));
  };

  const endDrag = () => {
    if (!drag.current) return;
    justDragged.current = drag.current.moved;
    drag.current = null;
    try {
      window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planRef.current));
    } catch {
      setStored(false);
    }
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
      if (plan.image) ctx.drawImage(await decodeDataUrl(plan.image.dataUrl), 0, 0, size.width, size.height);
      for (const c of plan.cameras) {
        for (const band of bands(c, scale)) {
          ctx.globalAlpha = BAND_ALPHA[band.id];
          ctx.fillStyle = BAND_COLOURS[band.id];
          ctx.fill(new Path2D(sectorPath(c.x, c.y, band.inner, band.outer, c.rotation, band.fov)));
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(c.x, c.y, unit * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `bold ${Math.round(unit * 1.4)}px sans-serif`;
        ctx.fillText(c.name, c.x + unit * 1.6, c.y - unit * 1.2);
      }
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('No picture');
      download(blob, `${(plan.name || 'camera-plan').replace(/[^a-z0-9-]+/gi, '-')}.png`);
    } catch {
      setMessage('The picture could not be made. Try again, or save the plan file instead.');
    }
  };

  const savePlanFile = () => download(new Blob([JSON.stringify(plan)], { type: 'application/json' }), `${(plan.name || 'camera-plan').replace(/[^a-z0-9-]+/gi, '-')}.teracom-plan.json`);

  const openPlanFile = async (file) => {
    if (!file) return;
    try {
      if (file.size > 30 * 1024 * 1024) throw new Error('That file is too large to be a camera plan.');
      const opened = parsePlan(await file.text());
      if (!opened) throw new Error('That file is not a Teracom camera plan.');
      commit(opened);
      setSelected(null);
      setMessage(`Opened "${opened.name || 'camera plan'}" with ${opened.cameras.length} camera${opened.cameras.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setMessage(error.message || 'That file could not be read.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const startAgain = () => {
    try {
      window.localStorage.removeItem(PLAN_STORAGE_KEY);
    } catch {
      // Nothing stored to remove.
    }
    setPlan(emptyPlan());
    setSelected(null);
    setConfirmClear(false);
    setMessage('Started a new, empty plan.');
  };

  const fov = camera ? cameraFov(camera) : 0;

  return (
    <div className="container camera-planner">
      <div className="camera-planner-toolbar">
        <button type="button" className="btn btn-secondary" onClick={() => planInput.current?.click()}>
          <ImageUp size={18} strokeWidth={2} aria-hidden="true" /> {plan.image ? 'Change plan' : 'Upload a plan'}
        </button>
        <input ref={planInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => uploadPlan(e.target.files?.[0])} />
        <button type="button" className={mode === 'add' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => { setMode(mode === 'add' ? 'select' : 'add'); setMessage('Click the plan where the camera goes.'); }}>
          <Camera size={18} strokeWidth={2} aria-hidden="true" /> Add camera
        </button>
        <button type="button" className={mode === 'scale' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => { setMode(mode === 'scale' ? 'select' : 'scale'); setScalePoints([]); setMessage('Click two points on the plan whose distance apart you know, such as the ends of a wall.'); }}>
          <Ruler size={18} strokeWidth={2} aria-hidden="true" /> Set scale
        </button>
        <button type="button" className={mode === 'select' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('select')}>
          <MousePointer2 size={18} strokeWidth={2} aria-hidden="true" /> Move and turn
        </button>
      </div>

      {mode === 'scale' && scalePoints.length === 2 ? (
        <div className="camera-planner-scale">
          <label htmlFor="plan-scale-metres">Distance between the two points (m)</label>
          <input id="plan-scale-metres" type="number" min="0" step="any" inputMode="decimal" value={scaleMetres} onChange={(e) => setScaleMetres(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={setScale}>Set scale</button>
        </div>
      ) : null}
      {message ? <p className="form-note camera-planner-message" role="status">{message}</p> : null}
      {!plan.pxPerMetre ? (
        <p className="form-note-banner">The scale is not set, so the plan is assumed to be 40 m across. Use Set scale for real distances.</p>
      ) : null}
      {!stored ? (
        <p className="form-note-banner" role="status">This browser would not store the plan, so it will be lost when you leave. Save the plan file before you go.</p>
      ) : null}

      <div className="camera-planner-layout">
        <div className={`camera-planner-canvas mode-${mode}`}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size.width} ${size.height}`}
            role="img"
            aria-label={`Floor plan with ${plan.cameras.length} camera${plan.cameras.length === 1 ? '' : 's'}`}
            onClick={onPlanClick}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            {plan.image ? (
              <image href={plan.image.dataUrl} x="0" y="0" width={size.width} height={size.height} />
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
                  Upload a plan, or try it on this grid (one square = 1 m)
                </text>
              </>
            )}

            {plan.cameras.map((c) =>
              bands(c, scale).map((band) => (
                <path key={`${c.id}-${band.id}`} d={sectorPath(c.x, c.y, band.inner, band.outer, c.rotation, band.fov)} fill={BAND_COLOURS[band.id]} fillOpacity={BAND_ALPHA[band.id]} pointerEvents="none" />
              )),
            )}

            {scalePoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={unit * 0.8} fill="#ff1717" />
            ))}
            {scalePoints.length === 2 ? (
              <line x1={scalePoints[0].x} y1={scalePoints[0].y} x2={scalePoints[1].x} y2={scalePoints[1].y} stroke="#ff1717" strokeWidth={unit * 0.3} strokeDasharray={`${unit} ${unit * 0.6}`} />
            ) : null}

            {plan.cameras.map((c) => {
              const handle = unit * 5;
              const hx = c.x + handle * Math.cos((c.rotation * Math.PI) / 180);
              const hy = c.y + handle * Math.sin((c.rotation * Math.PI) / 180);
              const active = c.id === selected;
              return (
                <g key={c.id} className="camera-planner-camera">
                  {active ? <line x1={c.x} y1={c.y} x2={hx} y2={hy} stroke="#111827" strokeWidth={unit * 0.25} /> : null}
                  {active ? (
                    <circle cx={hx} cy={hy} r={unit * 0.9} fill="#ffffff" stroke="#111827" strokeWidth={unit * 0.25} className="camera-planner-handle" onPointerDown={(e) => startDrag(e, c.id, 'turn')} onClick={(e) => e.stopPropagation()} />
                  ) : null}
                  <circle cx={c.x} cy={c.y} r={unit * 1.3} fill={active ? '#ff1717' : '#111827'} stroke="#ffffff" strokeWidth={unit * 0.3} className="camera-planner-dot" onPointerDown={(e) => startDrag(e, c.id, 'move')} onClick={(e) => { e.stopPropagation(); setSelected(c.id); }} />
                  <text x={c.x + unit * 1.8} y={c.y - unit * 1.4} fontSize={unit * 1.5} fontWeight="700" fill="#111827" stroke="#ffffff" strokeWidth={unit * 0.35} paintOrder="stroke" pointerEvents="none">
                    {c.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <ul className="camera-planner-legend" aria-label="Colour key">
            {[...DORI].reverse().map((level) => (
              <li key={level.id}>
                <span style={{ background: BAND_COLOURS[level.id] }} aria-hidden="true" /> {level.label} ({level.ppm} px/m)
              </li>
            ))}
          </ul>
        </div>

        <div className="camera-planner-side calculator">
          <div className="field">
            <label htmlFor="plan-name">Plan name</label>
            <input id="plan-name" type="text" maxLength={200} value={plan.name} placeholder="e.g. Warehouse ground floor" onChange={(e) => commit({ ...plan, name: e.target.value })} />
          </div>
          {camera ? (
            <>
              <h2>{camera.name}</h2>
              <div className="field">
                <label htmlFor="cam-name">Name</label>
                <input id="cam-name" type="text" maxLength={80} value={camera.name} onChange={(e) => updateCamera(camera.id, { name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="cam-resolution">Resolution</label>
                <select id="cam-resolution" value={camera.resolution} onChange={(e) => updateCamera(camera.id, { resolution: e.target.value })}>
                  {RESOLUTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="cam-mode">Field of view from</label>
                <select id="cam-mode" value={camera.fovMode} onChange={(e) => updateCamera(camera.id, { fovMode: e.target.value })}>
                  <option value="lens">The lens (focal length)</option>
                  <option value="fov">The datasheet angle</option>
                </select>
              </div>
              {camera.fovMode === 'lens' ? (
                <>
                  <div className="field">
                    <label htmlFor="cam-focal">Lens focal length (mm)</label>
                    <input id="cam-focal" type="number" min="0" step="0.1" inputMode="decimal" value={camera.focal} onChange={(e) => updateCamera(camera.id, { focal: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="cam-sensor">Sensor size</label>
                    <select id="cam-sensor" value={camera.sensor} onChange={(e) => updateCamera(camera.id, { sensor: e.target.value })}>
                      {SENSORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="field">
                  <label htmlFor="cam-fov">Horizontal field of view (degrees)</label>
                  <input id="cam-fov" type="number" min="1" max="179" step="1" inputMode="decimal" value={camera.hfov} onChange={(e) => updateCamera(camera.id, { hfov: e.target.value })} />
                </div>
              )}
              <div className="field">
                <label htmlFor="cam-rotation">Direction ({camera.rotation}°)</label>
                <input id="cam-rotation" type="range" min="0" max="359" value={camera.rotation} onChange={(e) => updateCamera(camera.id, { rotation: Number(e.target.value) })} />
              </div>
              <div className="calculator-results">
                <p>Horizontal field of view: <strong>{fov.toFixed(0)}°</strong></p>
                {[...doriDistances(camera.resolution, fov)].reverse().map((level) => (
                  <p key={level.id}>{level.label} up to: <strong>{level.metres.toFixed(1)} m</strong></p>
                ))}
              </div>
              <div className="camera-planner-row">
                <button type="button" className="btn btn-secondary" disabled={plan.cameras.length >= MAX_CAMERAS} onClick={() => {
                  const id = `c${Date.now().toString(36)}`;
                  commit({ ...plan, cameras: [...plan.cameras, { ...camera, id, name: `${camera.name} copy`, x: camera.x + unit * 4, y: camera.y + unit * 4 }] });
                  setSelected(id);
                }}>
                  <Copy size={16} strokeWidth={2} aria-hidden="true" /> Copy
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { commit({ ...plan, cameras: plan.cameras.filter((c) => c.id !== camera.id) }); setSelected(null); }}>
                  <Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remove
                </button>
              </div>
            </>
          ) : (
            <p className="form-note">
              {plan.cameras.length ? 'Click a camera to change its lens, resolution and direction.' : 'Press Add camera, then click the plan where it goes.'}
            </p>
          )}
        </div>
      </div>

      {plan.cameras.length ? (
        <div className="camera-planner-schedule">
          <h2>Camera schedule</h2>
          <div className="camera-planner-table">
            <table>
              <thead>
                <tr><th>Camera</th><th>Resolution</th><th>Field of view</th>{[...DORI].reverse().map((l) => <th key={l.id}>{l.label}</th>)}</tr>
              </thead>
              <tbody>
                {plan.cameras.map((c) => {
                  const cFov = cameraFov(c);
                  return (
                    <tr key={c.id} className={c.id === selected ? 'active' : undefined} onClick={() => setSelected(c.id)}>
                      <td>{c.name}</td>
                      <td>{RESOLUTIONS.find((r) => r.value === c.resolution)?.label || `${c.resolution} px`}</td>
                      <td>{cFov.toFixed(0)}°{c.fovMode === 'lens' ? ` (${c.focal} mm)` : ''}</td>
                      {[...doriDistances(c.resolution, cFov)].reverse().map((l) => <td key={l.id}>{l.metres.toFixed(1)} m</td>)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="camera-planner-toolbar camera-planner-save">
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
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)} disabled={!plan.image && !plan.cameras.length}>
            Start a new plan
          </button>
        )}
      </div>
      <p className="form-note">
        Your plan stays in this browser on this device; nothing is sent to Teracom. Save the plan file to keep it or move it to
        another device, and open it here to carry on. Distances use the IEC 62676-4 (DORI) pixel densities and ignore walls,
        lighting and mounting height, so check coverage on site.
      </p>
    </div>
  );
}
