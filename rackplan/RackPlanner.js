'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Download, FileSpreadsheet, FileUp, Plus, Save, Trash2 } from 'lucide-react';
import { BRAND } from '../siteplan/brand.js';
import {
  ITEM_GROUPS,
  ITEM_TYPES,
  MAX_ITEMS,
  MAX_ITEM_RU,
  RACK_DEPTHS,
  RACK_SIZES,
  RACK_STORAGE_KEY,
  addItem,
  emptyRack,
  fits,
  itemType,
  moveItem,
  parseRack,
  rackRows,
  resizeItem,
  resizeRack,
  sampleRack,
  topU,
  unitsText,
  usage,
} from './model.js';
import { rackXlsx } from './workbook.js';
import RackArt from './RackArt.js';
import './rackplan.css';

// Data rack layout (Robert, 2026-11-03): pick a rack from 6RU to 48RU, stack patch
// panels, switches, cable management, recorders, UPS and the rest in it, and label
// each one. Drag an item to move it. Kept in this browser; saved as a branded picture,
// an Excel rack schedule or a rack file. Everything it needs is in this folder and
// siteplan/brand.js + siteplan/xlsx.js, so Teracom AI can use it as is.
const U = 28; // px per rack unit
const RAIL = 40;
const INNER = 460;
const SIDE = 16;
const TOP = 44;
const WIDTH = SIDE * 2 + RAIL * 2 + INNER;
const LABEL_W = 190;
const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

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

async function loadImage(src) {
  const image = new window.Image();
  image.src = src;
  await image.decode();
  return image;
}

async function logoPng(src) {
  try {
    const image = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = Math.round((480 * image.naturalHeight) / image.naturalWidth);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    return blob ? { data: new Uint8Array(await blob.arrayBuffer()), type: 'png', width: canvas.width, height: canvas.height, image } : null;
  } catch {
    return null;
  }
}

const fileName = (rack, ext) => `${(rack.name || 'rack-layout').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'rack-layout'}.${ext}`;
const clip = (label, max) => (label.length > max ? `${label.slice(0, max - 1)}…` : label);
const newId = () => `r${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

function readStored() {
  try {
    return parseRack(window.localStorage.getItem(RACK_STORAGE_KEY) || '');
  } catch {
    return null;
  }
}

export default function RackPlanner({ brand = BRAND }) {
  const [rack, setRack] = useState(null);
  const [selected, setSelected] = useState(null);
  const [addType, setAddType] = useState('patch24');
  const [message, setMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const drag = useRef(null);
  const svgRef = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    // The browser's saved rack, else the sample; only known after the page loads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRack(readStored() || sampleRack());
  }, []);

  const save = (next) => {
    try {
      window.localStorage.setItem(RACK_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing: the rack still works, it just is not kept.
    }
  };
  const commit = (next) => {
    setRack(next);
    save(next);
  };

  if (!rack) return <div className="container rack-planner"><p>Loading the rack...</p></div>;

  const height = TOP + rack.size * U + 36;
  const railX = SIDE;
  const innerX = SIDE + RAIL;
  const yOf = (u) => TOP + (rack.size - u) * U; // top edge of unit u
  const item = rack.items.find((it) => it.id === selected) || null;
  const { used, free } = usage(rack);

  const unitAt = (event) => {
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const p = point.matrixTransform(svg.getScreenCTM().inverse());
    return rack.size - Math.floor((p.y - TOP) / U);
  };

  const startDrag = (event, it) => {
    event.preventDefault();
    setSelected(it.id);
    drag.current = { id: it.id, offset: unitAt(event) - it.u, moved: false, rack };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const it = rack.items.find((x) => x.id === d.id);
    const u = unitAt(event) - d.offset;
    if (it && u !== it.u && fits(rack, u, it.ru, it.id)) {
      d.moved = true;
      setRack(moveItem(rack, it.id, u));
    }
  };
  const endDrag = () => {
    if (drag.current?.moved) save(rack);
    drag.current = null;
  };

  const add = () => {
    const id = newId();
    const next = addItem(rack, addType, id);
    if (!next) {
      setMessage(rack.items.length >= MAX_ITEMS ? 'The rack is full.' : `There is no ${itemType(addType).ru}RU space left. Remove something, make the rack bigger, or change a height.`);
      return;
    }
    commit(next);
    setSelected(id);
    setMessage('');
  };
  const update = (id, patch) => commit({ ...rack, items: rack.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
  const step = (dir) => {
    for (let u = item.u + dir; u >= 1 && u + item.ru - 1 <= rack.size; u += dir) {
      if (fits(rack, u, item.ru, item.id)) {
        commit(moveItem(rack, item.id, u));
        return;
      }
    }
    setMessage(dir > 0 ? 'There is no space above it.' : 'There is no space below it.');
  };
  const changeHeight = (ru) => {
    const next = resizeItem(rack, item.id, ru);
    if (next) commit(next);
    else setMessage(`It does not fit at ${ru}RU where it is. Move it to a bigger space first.`);
  };
  const changeSize = (size) => {
    const next = resizeRack(rack, size);
    if (next) {
      commit(next);
      setMessage('');
    } else setMessage(`Some equipment sits above U${size}. Move it down or remove it first.`);
  };
  const positions = item ? Array.from({ length: rack.size - item.ru + 1 }, (_, i) => rack.size - item.ru + 1 - i).filter((u) => fits(rack, u, item.ru, item.id)) : [];

  // The picture: the drawn rack (no selection) under a black band with the logo.
  const drawPicture = async () => {
    const clone = svgRef.current.cloneNode(true);
    clone.querySelectorAll('.rack-highlight').forEach((n) => n.remove());
    clone.setAttribute('width', WIDTH);
    clone.setAttribute('height', height);
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
    try {
      const picture = await loadImage(url);
      const scale = 2;
      const band = 90;
      const foot = 40;
      const canvas = document.createElement('canvas');
      canvas.width = (WIDTH + 40) * scale;
      canvas.height = (height + band + foot) * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, WIDTH + 40, height + band + foot);
      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(0, 0, WIDTH + 40, band);
      ctx.fillStyle = '#e3161b';
      ctx.fillRect(0, band - 6, WIDTH + 40, 6);
      const logo = await logoPng(brand.logo);
      if (logo) ctx.drawImage(logo.image, 16, 14, Math.round((56 * logo.width) / logo.height), 56);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(rack.name || 'Rack layout', WIDTH + 24, 38);
      ctx.font = '13px sans-serif';
      ctx.fillText(`${rack.site ? `${rack.site} · ` : ''}${rack.size}RU, ${rack.depth} mm deep · ${used}RU used, ${free}RU free`, WIDTH + 24, 62);
      ctx.drawImage(picture, 20, band, WIDTH, height);
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Free Data Rack Layout · ${brand.websiteLabel}/tools · ${brand.tagline}`, (WIDTH + 40) / 2, height + band + 24);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const savePicture = async () => {
    try {
      const canvas = await drawPicture();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      download(blob, fileName(rack, 'png'));
      setMessage('Picture saved.');
    } catch {
      setMessage('The picture could not be made. Try again.');
    }
  };
  const saveExcel = async () => {
    setMessage('Making the Excel workbook...');
    try {
      const canvas = await drawPicture();
      const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const picture = png ? { data: new Uint8Array(await png.arrayBuffer()), type: 'png', width: canvas.width, height: canvas.height } : null;
      const logo = await logoPng(brand.logo);
      const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      download(new Blob([rackXlsx(rack, { brand, date, logo, picture })], { type: XLSX_TYPE }), fileName(rack, 'xlsx'));
      setMessage('Excel workbook saved: the rack schedule, every unit top to bottom, and the rack picture.');
    } catch {
      setMessage('The Excel workbook could not be made. Try again, or save the rack file instead.');
    }
  };
  const saveRackFile = () => download(new Blob([JSON.stringify(rack)], { type: 'application/json' }), fileName(rack, 'teracom-rack.json'));
  const openRackFile = async (file) => {
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('That file is too large to be a rack layout.');
      const opened = parseRack(await file.text());
      if (!opened) throw new Error('That file is not a Teracom rack layout.');
      commit(opened);
      setSelected(null);
      setMessage(`Opened "${opened.name || 'rack layout'}" with ${opened.items.length} item${opened.items.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setMessage(error.message || 'That file could not be opened.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="container rack-planner">
      <div className="rack-planner-toolbar">
        <div className="field">
          <label htmlFor="rack-size">Rack size</label>
          <select id="rack-size" value={rack.size} onChange={(e) => changeSize(e.target.value)}>
            {RACK_SIZES.map((s) => <option key={s} value={s}>{s}RU</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="rack-depth">Depth</label>
          <select id="rack-depth" value={rack.depth} onChange={(e) => commit({ ...rack, depth: Number(e.target.value) })}>
            {RACK_DEPTHS.map((d) => <option key={d} value={d}>{d} mm</option>)}
          </select>
        </div>
        <div className="field rack-planner-add">
          <label htmlFor="rack-add">Add equipment</label>
          <div>
            <select id="rack-add" value={addType} onChange={(e) => setAddType(e.target.value)}>
              {ITEM_GROUPS.map((g) => (
                <optgroup key={g} label={g}>
                  {ITEM_TYPES.filter((t) => t.group === g).map((t) => <option key={t.type} value={t.type}>{t.label} ({t.ru}RU)</option>)}
                </optgroup>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={add}>
              <Plus size={18} strokeWidth={2} aria-hidden="true" /> Add
            </button>
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => { commit(sampleRack()); setSelected(null); setMessage('Sample rack loaded.'); }}>Sample rack</button>
      </div>
      <p className="rack-planner-message" role="status">
        {message || `${used}RU used, ${free}RU free. Add equipment, then drag it up or down, or click it to label it.`}
      </p>

      <div className="rack-planner-main">
        <div className="rack-planner-canvas">
          <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${WIDTH} ${height}`} fontFamily="Arial, Helvetica, sans-serif" role="img" aria-label={`${rack.size}RU rack front view`} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag} onClick={() => setSelected(null)}>
            <rect x={0} y={0} width={WIDTH} height={height} fill="#f3f4f6" />
            <text x={WIDTH / 2} y={26} textAnchor="middle" fontSize={15} fontWeight="700" fill="#111827">
              {rack.name || 'Rack layout'} · {rack.size}RU
            </text>
            {/* Frame and rails */}
            <rect x={railX - 6} y={TOP - 8} width={WIDTH - 2 * SIDE + 12} height={rack.size * U + 16} rx={6} fill="#111827" />
            <rect x={innerX} y={TOP} width={INNER} height={rack.size * U} fill="#1f2937" />
            {Array.from({ length: rack.size }, (_, i) => {
              const u = rack.size - i;
              const y = yOf(u);
              return (
                <g key={u}>
                  <rect x={railX} y={y} width={RAIL} height={U} fill="#374151" stroke="#4b5563" strokeWidth={0.5} />
                  <rect x={innerX + INNER} y={y} width={RAIL} height={U} fill="#374151" stroke="#4b5563" strokeWidth={0.5} />
                  <text x={railX + RAIL / 2} y={y + U / 2 + 4} textAnchor="middle" fontSize={11} fill="#e5e7eb">{u}</text>
                  <text x={innerX + INNER + RAIL / 2} y={y + U / 2 + 4} textAnchor="middle" fontSize={11} fill="#e5e7eb">{u}</text>
                  <line x1={innerX} y1={y} x2={innerX + INNER} y2={y} stroke="#273244" strokeWidth={1} strokeDasharray="4 4" />
                </g>
              );
            })}
            {/* Equipment */}
            {rack.items.map((it) => {
              const t = itemType(it.type);
              const y = yOf(topU(it));
              const h = it.ru * U;
              const active = it.id === selected;
              return (
                <g key={it.id} className="rack-item" onPointerDown={(e) => startDrag(e, it)} onClick={(e) => { e.stopPropagation(); setSelected(it.id); }}>
                  <rect x={innerX - 10} y={y + 1} width={INNER + 20} height={h - 2} rx={3} fill={t.colour} stroke="#0b0b0b" strokeWidth={1} />
                  <circle cx={innerX - 4} cy={y + h / 2} r={2.5} fill="#9ca3af" />
                  <circle cx={innerX + INNER + 4} cy={y + h / 2} r={2.5} fill="#9ca3af" />
                  <text x={innerX + 10} y={y + h / 2 + 4} fontSize={it.ru > 1 ? 13 : 11} fontWeight="700" fill="#ffffff">
                    {clip(it.label, it.ru > 1 ? 21 : 24)}
                  </text>
                  <RackArt art={t.art} x={innerX + LABEL_W} y={y + 1} w={INNER - LABEL_W - 10} h={h - 2} ru={it.ru} />
                  {active ? <rect className="rack-highlight" x={innerX - 12} y={y - 1} width={INNER + 24} height={h + 2} rx={4} fill="none" stroke="#e3161b" strokeWidth={3} /> : null}
                </g>
              );
            })}
            <text x={WIDTH / 2} y={height - 10} textAnchor="middle" fontSize={11} fill="#6b7280">
              {rack.depth} mm deep · {used}RU used, {free}RU free · {brand.websiteLabel}
            </text>
          </svg>
        </div>

        <div className="rack-planner-side">
          {item ? (
            <div className="calculator rack-planner-editor">
              <div className="rack-planner-row">
                <button type="button" className="btn btn-secondary" onClick={() => step(1)}><ArrowUp size={16} strokeWidth={2} aria-hidden="true" /> Up</button>
                <button type="button" className="btn btn-secondary" onClick={() => step(-1)}><ArrowDown size={16} strokeWidth={2} aria-hidden="true" /> Down</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  const id = newId();
                  const u = (() => { for (let x = rack.size - item.ru + 1; x >= 1; x -= 1) if (fits(rack, x, item.ru)) return x; return 0; })();
                  if (!u) { setMessage('There is no space for a copy.'); return; }
                  commit({ ...rack, items: [...rack.items, { ...item, id, u }] });
                  setSelected(id);
                }}><Copy size={16} strokeWidth={2} aria-hidden="true" /> Copy</button>
                <button type="button" className="btn btn-secondary" onClick={() => { commit({ ...rack, items: rack.items.filter((it) => it.id !== item.id) }); setSelected(null); }}><Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remove</button>
              </div>
              <div className="field">
                <label htmlFor="item-label">Label</label>
                <input id="item-label" type="text" maxLength={80} value={item.label} onChange={(e) => update(item.id, { label: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="item-type">Equipment</label>
                <select id="item-type" value={item.type} onChange={(e) => update(item.id, { type: e.target.value })}>
                  {ITEM_TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="item-ru">Height</label>
                <select id="item-ru" value={item.ru} onChange={(e) => changeHeight(Number(e.target.value))}>
                  {Array.from({ length: MAX_ITEM_RU }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}RU</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="item-u">Position</label>
                <select id="item-u" value={item.u} onChange={(e) => commit(moveItem(rack, item.id, Number(e.target.value)) || rack)}>
                  {positions.map((u) => <option key={u} value={u}>{unitsText({ top: u + item.ru - 1, bottom: u, ru: item.ru })}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="item-note">Notes</label>
                <input id="item-note" type="text" maxLength={200} value={item.note} placeholder="e.g. model, IP address, what it patches to" onChange={(e) => update(item.id, { note: e.target.value })} />
              </div>
            </div>
          ) : (
            <p className="form-note">Click a piece of equipment to label it, change its height or move it. Drag it up or down the rack to move it.</p>
          )}
          <div className="rack-planner-table">
            <table>
              <thead>
                <tr><th>Position</th><th>RU</th><th>Label</th></tr>
              </thead>
              <tbody>
                {rackRows(rack).map((row) => (
                  <tr key={row.item ? row.item.id : `free-${row.top}`} className={`${row.item ? '' : 'free'} ${row.item?.id === selected ? 'active' : ''}`} onClick={() => row.item && setSelected(row.item.id)}>
                    <td>{unitsText(row)}</td>
                    <td>{row.ru}</td>
                    <td>{row.item ? row.item.label || itemType(row.item.type).label : 'Free'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rack-planner-toolbar">
        <div className="field rack-planner-name">
          <label htmlFor="rack-name">Rack name</label>
          <input id="rack-name" type="text" maxLength={200} value={rack.name} placeholder="e.g. Comms room rack 1" onChange={(e) => commit({ ...rack, name: e.target.value })} />
        </div>
        <div className="field rack-planner-name">
          <label htmlFor="rack-site">Site</label>
          <input id="rack-site" type="text" maxLength={200} value={rack.site} placeholder="e.g. Head office, level 2" onChange={(e) => commit({ ...rack, site: e.target.value })} />
        </div>
      </div>
      <div className="rack-planner-toolbar">
        <button type="button" className="btn btn-primary" onClick={savePicture}><Download size={18} strokeWidth={2} aria-hidden="true" /> Save as a picture</button>
        <button type="button" className="btn btn-primary" onClick={saveExcel}><FileSpreadsheet size={18} strokeWidth={2} aria-hidden="true" /> Save as Excel</button>
        <button type="button" className="btn btn-secondary" onClick={saveRackFile}><Save size={18} strokeWidth={2} aria-hidden="true" /> Save rack file</button>
        <button type="button" className="btn btn-secondary" onClick={() => fileInput.current?.click()}><FileUp size={18} strokeWidth={2} aria-hidden="true" /> Open a rack file</button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(e) => openRackFile(e.target.files?.[0])} />
        {confirmClear ? (
          <>
            <button type="button" className="btn btn-primary" onClick={() => { commit(emptyRack(rack.size)); setSelected(null); setConfirmClear(false); setMessage('Empty rack.'); }}>Yes, empty the rack</button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(false)}>Keep it</button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)}>Start a new rack</button>
        )}
      </div>
      <p className="form-note">
        Your rack stays in this browser on this device; nothing is sent to {brand.name}. Save the rack file to keep it or move it to another
        device. Heights are the usual ones for each kind of equipment; check the datasheets, and allow for depth, airflow and cable bend room.
      </p>
    </div>
  );
}
