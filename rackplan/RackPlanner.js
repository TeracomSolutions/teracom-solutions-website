'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Download, FileSpreadsheet, FileUp, Plus, Save, Trash2 } from 'lucide-react';
import { BRAND } from '../siteplan/brand.js';
import {
  ITEM_GROUPS,
  ITEM_TYPES,
  MAX_ITEMS,
  MAX_ITEM_RU,
  MAX_RACKS,
  RACK_DEPTHS,
  RACK_SIZES,
  RACK_STORAGE_KEY,
  ROOM_STORAGE_KEY,
  addItem,
  addRack,
  emptyRoom,
  fits,
  itemType,
  moveItem,
  moveToRack,
  parseRack,
  parseRoom,
  rackRows,
  resizeItem,
  resizeRack,
  roomFromRack,
  roomUsage,
  sampleRoom,
  topU,
  unitsText,
  usage,
  withRack,
} from './model.js';
import { roomXlsx } from './workbook.js';
import RackArt from './RackArt.js';
import './rackplan.css';

// Data rack layout (Robert, 2026-11-03): a comms room of one or more racks, each 6RU
// to 48RU, with patch panels, switches, cable management, recorders, UPS and the rest
// stacked in it, each labelled. Drag an item to move it; move it to another rack from
// its settings. Kept in this browser; saved as a branded picture of the room, an Excel
// workbook (a schedule per rack) or a rack file. Everything it needs is in this folder
// and siteplan/brand.js + siteplan/xlsx.js, so Teracom AI can use it as is.
const U = 28; // px per rack unit
const RAIL = 40;
const INNER = 460;
const SIDE = 16;
const TOP = 44;
const WIDTH = SIDE * 2 + RAIL * 2 + INNER;
const GAP = 24; // between racks in the room view
const LABEL_W = 190;
const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const rackHeight = (rack) => TOP + rack.size * U + 36;

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

const fileName = (room, ext) => `${(room.name || room.racks[0]?.name || 'rack-layout').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'rack-layout'}.${ext}`;
const clip = (label, max) => (label.length > max ? `${label.slice(0, max - 1)}…` : label);
const newId = (prefix = 'r') => `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

// The browser's saved room; a rack saved by the first, single-rack version carries over.
function readStored() {
  try {
    const room = parseRoom(window.localStorage.getItem(ROOM_STORAGE_KEY) || '');
    if (room) return room;
    const rack = parseRack(window.localStorage.getItem(RACK_STORAGE_KEY) || '');
    return rack ? roomFromRack(rack) : null;
  } catch {
    return null;
  }
}

// One rack, drawn from (dx, dy): rails with unit numbers, then the equipment.
function RackDrawing({ rack, dx = 0, dy = 0, selected = null, footer = '', onItemDown, onItemClick }) {
  const innerX = dx + SIDE + RAIL;
  const yOf = (u) => dy + TOP + (rack.size - u) * U;
  const { used, free } = usage(rack);
  return (
    <g>
      <text x={dx + WIDTH / 2} y={dy + 26} textAnchor="middle" fontSize={15} fontWeight="700" fill="#111827">
        {clip(rack.name || 'Rack', 40)} · {rack.size}RU
      </text>
      <rect x={dx + SIDE - 6} y={dy + TOP - 8} width={WIDTH - 2 * SIDE + 12} height={rack.size * U + 16} rx={6} fill="#111827" />
      <rect x={innerX} y={dy + TOP} width={INNER} height={rack.size * U} fill="#1f2937" />
      {Array.from({ length: rack.size }, (_, i) => {
        const u = rack.size - i;
        const y = yOf(u);
        return (
          <g key={u}>
            <rect x={dx + SIDE} y={y} width={RAIL} height={U} fill="#374151" stroke="#4b5563" strokeWidth={0.5} />
            <rect x={innerX + INNER} y={y} width={RAIL} height={U} fill="#374151" stroke="#4b5563" strokeWidth={0.5} />
            <text x={dx + SIDE + RAIL / 2} y={y + U / 2 + 4} textAnchor="middle" fontSize={11} fill="#e5e7eb">{u}</text>
            <text x={innerX + INNER + RAIL / 2} y={y + U / 2 + 4} textAnchor="middle" fontSize={11} fill="#e5e7eb">{u}</text>
            <line x1={innerX} y1={y} x2={innerX + INNER} y2={y} stroke="#273244" strokeWidth={1} strokeDasharray="4 4" />
          </g>
        );
      })}
      {rack.items.map((it) => {
        const t = itemType(it.type);
        const y = yOf(topU(it));
        const h = it.ru * U;
        return (
          <g key={it.id} className={onItemDown ? 'rack-item' : undefined} onPointerDown={onItemDown ? (e) => onItemDown(e, it) : undefined} onClick={onItemClick ? (e) => { e.stopPropagation(); onItemClick(it); } : undefined}>
            <rect x={innerX - 10} y={y + 1} width={INNER + 20} height={h - 2} rx={3} fill={t.colour} stroke="#0b0b0b" strokeWidth={1} />
            <circle cx={innerX - 4} cy={y + h / 2} r={2.5} fill="#9ca3af" />
            <circle cx={innerX + INNER + 4} cy={y + h / 2} r={2.5} fill="#9ca3af" />
            <text x={innerX + 10} y={y + h / 2 + 4} fontSize={it.ru > 1 ? 13 : 11} fontWeight="700" fill="#ffffff">
              {clip(it.label, it.ru > 1 ? 21 : 24)}
            </text>
            <RackArt art={t.art} x={innerX + LABEL_W} y={y + 1} w={INNER - LABEL_W - 10} h={h - 2} ru={it.ru} />
            {it.id === selected ? <rect className="rack-highlight" x={innerX - 12} y={y - 1} width={INNER + 24} height={h + 2} rx={4} fill="none" stroke="#e3161b" strokeWidth={3} /> : null}
          </g>
        );
      })}
      <text x={dx + WIDTH / 2} y={dy + rackHeight(rack) - 10} textAnchor="middle" fontSize={11} fill="#6b7280">
        {rack.depth} mm deep · {used}RU used, {free}RU free{footer ? ` · ${footer}` : ''}
      </text>
    </g>
  );
}

// Every rack side by side, standing on the same floor.
function RoomDrawing({ room, svgRef, onPick, current, label }) {
  const tallest = Math.max(...room.racks.map(rackHeight));
  const width = room.racks.length * WIDTH + (room.racks.length - 1) * GAP;
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${tallest}`} width={width} height={tallest} fontFamily="Arial, Helvetica, sans-serif" role="img" aria-label={label} style={onPick ? { minWidth: room.racks.length * 300 } : undefined}>
      <rect x={0} y={0} width={width} height={tallest} fill="#f3f4f6" />
      {room.racks.map((rack, i) => {
        const dx = i * (WIDTH + GAP);
        return (
          <g key={rack.id} className={onPick ? 'rack-room-rack' : undefined} onClick={onPick ? () => onPick(rack.id) : undefined}>
            <RackDrawing rack={rack} dx={dx} dy={tallest - rackHeight(rack)} />
            {onPick && rack.id === current ? <rect className="rack-highlight" x={dx + 2} y={tallest - rackHeight(rack) + 4} width={WIDTH - 4} height={rackHeight(rack) - 8} rx={8} fill="none" stroke="#e3161b" strokeWidth={4} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function RackPlanner({ brand = BRAND }) {
  const [room, setRoom] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [view, setView] = useState('rack');
  const [selected, setSelected] = useState(null);
  const [addType, setAddType] = useState('patch24');
  const [message, setMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRemoveRack, setConfirmRemoveRack] = useState(false);
  const drag = useRef(null);
  const svgRef = useRef(null);
  const exportRef = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    // The browser's saved room, else the sample; only known after the page loads.
    const start = readStored() || sampleRoom();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoom(start);
    setCurrentId(start.racks[0].id);
  }, []);

  const save = (next) => {
    try {
      window.localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing: the room still works, it just is not kept.
    }
  };
  const commit = (next) => {
    setRoom(next);
    save(next);
  };

  if (!room) return <div className="container rack-planner"><p>Loading the rack...</p></div>;

  const rack = room.racks.find((r) => r.id === currentId) || room.racks[0];
  const commitRack = (next) => commit(withRack(room, next));
  const height = rackHeight(rack);
  const item = rack.items.find((it) => it.id === selected) || null;
  const { used, free } = usage(rack);
  const totals = roomUsage(room);
  const pickRack = (id) => {
    setCurrentId(id);
    setSelected(null);
    setConfirmRemoveRack(false);
    setMessage('');
  };

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
    drag.current = { id: it.id, offset: unitAt(event) - it.u, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const it = rack.items.find((x) => x.id === d.id);
    const u = unitAt(event) - d.offset;
    if (it && u !== it.u && fits(rack, u, it.ru, it.id)) {
      d.moved = true;
      setRoom(withRack(room, moveItem(rack, it.id, u)));
    }
  };
  const endDrag = () => {
    if (drag.current?.moved) save(room);
    drag.current = null;
  };

  const add = () => {
    const id = newId();
    const next = addItem(rack, addType, id);
    if (!next) {
      setMessage(rack.items.length >= MAX_ITEMS ? 'The rack is full.' : `There is no ${itemType(addType).ru}RU space left in ${rack.name || 'this rack'}. Remove something, make the rack bigger, or add another rack.`);
      return;
    }
    commitRack(next);
    setSelected(id);
    setView('rack');
    setMessage('');
  };
  const update = (id, patch) => commitRack({ ...rack, items: rack.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
  const step = (dir) => {
    for (let u = item.u + dir; u >= 1 && u + item.ru - 1 <= rack.size; u += dir) {
      if (fits(rack, u, item.ru, item.id)) {
        commitRack(moveItem(rack, item.id, u));
        return;
      }
    }
    setMessage(dir > 0 ? 'There is no space above it.' : 'There is no space below it.');
  };
  const changeHeight = (ru) => {
    const next = resizeItem(rack, item.id, ru);
    if (next) commitRack(next);
    else setMessage(`It does not fit at ${ru}RU where it is. Move it to a bigger space first.`);
  };
  const changeSize = (size) => {
    const next = resizeRack(rack, size);
    if (next) {
      commitRack(next);
      setMessage('');
    } else setMessage(`Some equipment sits above U${size}. Move it down or remove it first.`);
  };
  const toRack = (toId) => {
    const target = room.racks.find((r) => r.id === toId);
    const next = moveToRack(room, rack.id, item.id, toId, newId());
    if (!next) {
      setMessage(`There is no ${item.ru}RU space in ${target?.name || 'that rack'}.`);
      return;
    }
    commit(next);
    setCurrentId(toId);
    setSelected(next.racks.find((r) => r.id === toId).items.at(-1).id);
    setMessage(`Moved to ${target.name}.`);
  };
  const newRack = (copy) => {
    const id = newId('k');
    let next = addRack(room, id, rack.size);
    if (!next) {
      setMessage(`A room can hold up to ${MAX_RACKS} racks.`);
      return;
    }
    if (copy) next = withRack(next, { ...rack, id, name: `${rack.name || 'Rack'} copy`, items: rack.items.map((it) => ({ ...it, id: newId() })) });
    commit(next);
    pickRack(id);
    setView('rack');
    setMessage(copy ? `Copied ${rack.name || 'the rack'}.` : 'Rack added. Pick its size and add equipment.');
  };
  const removeRack = () => {
    const racks = room.racks.filter((r) => r.id !== rack.id);
    commit({ ...room, racks });
    pickRack(racks[0].id);
    setMessage(`Removed ${rack.name || 'the rack'}.`);
  };
  const positions = item ? Array.from({ length: rack.size - item.ru + 1 }, (_, i) => rack.size - item.ru + 1 - i).filter((u) => fits(rack, u, item.ru, item.id)) : [];

  // The picture: every rack side by side under a black band with the logo.
  const drawPicture = async () => {
    const svg = exportRef.current;
    const w = Number(svg.getAttribute('width'));
    const h = Number(svg.getAttribute('height'));
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
    try {
      const picture = await loadImage(url);
      const scale = room.racks.length > 4 ? 1 : 2;
      const band = 90;
      const foot = 40;
      const pageW = Math.max(w + 40, 560);
      const canvas = document.createElement('canvas');
      canvas.width = pageW * scale;
      canvas.height = (h + band + foot) * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageW, h + band + foot);
      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(0, 0, pageW, band);
      ctx.fillStyle = '#e3161b';
      ctx.fillRect(0, band - 6, pageW, 6);
      const logo = await logoPng(brand.logo);
      if (logo) ctx.drawImage(logo.image, 16, 14, Math.round((56 * logo.width) / logo.height), 56);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(room.name || (room.racks.length === 1 ? rack.name : '') || 'Rack layout', pageW - 16, 38);
      ctx.font = '13px sans-serif';
      ctx.fillText(`${room.site ? `${room.site} · ` : ''}${totals.racks} rack${totals.racks === 1 ? '' : 's'} · ${totals.used}RU used, ${totals.free}RU free`, pageW - 16, 62);
      ctx.drawImage(picture, (pageW - w) / 2, band, w, h);
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Free Data Rack Layout · ${brand.websiteLabel}/tools · ${brand.tagline}`, pageW / 2, h + band + 24);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const savePicture = async () => {
    try {
      const canvas = await drawPicture();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      download(blob, fileName(room, 'png'));
      setMessage(room.racks.length > 1 ? 'Picture saved, with every rack side by side.' : 'Picture saved.');
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
      download(new Blob([roomXlsx(room, { brand, date, logo, picture })], { type: XLSX_TYPE }), fileName(room, 'xlsx'));
      setMessage(room.racks.length > 1
        ? 'Excel workbook saved: a summary of the racks, a schedule for each rack with every unit top to bottom, and the room picture.'
        : 'Excel workbook saved: the rack schedule, every unit top to bottom, and the rack picture.');
    } catch {
      setMessage('The Excel workbook could not be made. Try again, or save the rack file instead.');
    }
  };
  const saveRackFile = () => download(new Blob([JSON.stringify(room)], { type: 'application/json' }), fileName(room, 'teracom-racks.json'));
  const openRackFile = async (file) => {
    if (!file) return;
    try {
      if (file.size > 4 * 1024 * 1024) throw new Error('That file is too large to be a rack layout.');
      const opened = parseRoom(await file.text());
      if (!opened) throw new Error('That file is not a Teracom rack layout.');
      commit(opened);
      pickRack(opened.racks[0].id);
      setMessage(`Opened "${opened.name || opened.racks[0].name || 'rack layout'}" with ${opened.racks.length} rack${opened.racks.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setMessage(error.message || 'That file could not be opened.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="container rack-planner">
      <div className="rack-planner-tabs" role="tablist" aria-label="Racks in the room">
        {room.racks.map((r) => (
          <button key={r.id} type="button" role="tab" aria-selected={view === 'rack' && r.id === rack.id} className={`btn ${view === 'rack' && r.id === rack.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { pickRack(r.id); setView('rack'); }}>
            {clip(r.name || 'Rack', 28)} <span className="rack-planner-tab-size">{r.size}RU</span>
          </button>
        ))}
        <button type="button" role="tab" aria-selected={view === 'room'} className={`btn ${view === 'room' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setView('room'); setSelected(null); setMessage(''); }}>
          All racks
        </button>
        <button type="button" className="btn btn-secondary" disabled={room.racks.length >= MAX_RACKS} onClick={() => newRack(false)}>
          <Plus size={16} strokeWidth={2} aria-hidden="true" /> Add a rack
        </button>
      </div>

      {view === 'rack' ? (
        <div className="rack-planner-toolbar">
          <div className="field rack-planner-name">
            <label htmlFor="rack-name">Rack name</label>
            <input id="rack-name" type="text" maxLength={200} value={rack.name} placeholder="e.g. Rack 1: network" onChange={(e) => commitRack({ ...rack, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="rack-size">Rack size</label>
            <select id="rack-size" value={rack.size} onChange={(e) => changeSize(e.target.value)}>
              {RACK_SIZES.map((s) => <option key={s} value={s}>{s}RU</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rack-depth">Depth</label>
            <select id="rack-depth" value={rack.depth} onChange={(e) => commitRack({ ...rack, depth: Number(e.target.value) })}>
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
          <button type="button" className="btn btn-secondary" disabled={room.racks.length >= MAX_RACKS} onClick={() => newRack(true)}>
            <Copy size={16} strokeWidth={2} aria-hidden="true" /> Copy rack
          </button>
          {room.racks.length > 1 ? (
            confirmRemoveRack ? (
              <>
                <button type="button" className="btn btn-primary" onClick={removeRack}>Yes, remove this rack</button>
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmRemoveRack(false)}>Keep it</button>
              </>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={() => (rack.items.length ? setConfirmRemoveRack(true) : removeRack())}>
                <Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remove rack
              </button>
            )
          ) : null}
        </div>
      ) : null}
      <p className="rack-planner-message" role="status">
        {message || (view === 'room'
          ? `${totals.racks} rack${totals.racks === 1 ? '' : 's'}, ${totals.used}RU used and ${totals.free}RU free in all. Click a rack to work on it.`
          : `${used}RU used, ${free}RU free in this rack. Add equipment, then drag it up or down, or click it to label it.`)}
      </p>

      {view === 'room' ? (
        <div className="rack-planner-canvas rack-planner-room">
          <RoomDrawing room={room} current={rack.id} label={`${room.racks.length} racks side by side`} onPick={(id) => { pickRack(id); setView('rack'); }} />
        </div>
      ) : (
        <div className="rack-planner-main">
          <div className="rack-planner-canvas">
            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${WIDTH} ${height}`} fontFamily="Arial, Helvetica, sans-serif" role="img" aria-label={`${rack.size}RU rack front view`} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag} onClick={() => setSelected(null)}>
              <rect x={0} y={0} width={WIDTH} height={height} fill="#f3f4f6" />
              <RackDrawing rack={rack} selected={selected} footer={brand.websiteLabel} onItemDown={startDrag} onItemClick={(it) => setSelected(it.id)} />
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
                    commitRack({ ...rack, items: [...rack.items, { ...item, id, u }] });
                    setSelected(id);
                  }}><Copy size={16} strokeWidth={2} aria-hidden="true" /> Copy</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { commitRack({ ...rack, items: rack.items.filter((it) => it.id !== item.id) }); setSelected(null); }}><Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remove</button>
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
                  <select id="item-u" value={item.u} onChange={(e) => commitRack(moveItem(rack, item.id, Number(e.target.value)) || rack)}>
                    {positions.map((u) => <option key={u} value={u}>{unitsText({ top: u + item.ru - 1, bottom: u, ru: item.ru })}</option>)}
                  </select>
                </div>
                {room.racks.length > 1 ? (
                  <div className="field">
                    <label htmlFor="item-rack">Rack</label>
                    <select id="item-rack" value={rack.id} onChange={(e) => toRack(e.target.value)}>
                      {room.racks.map((r) => <option key={r.id} value={r.id}>{r.name || 'Rack'}</option>)}
                    </select>
                  </div>
                ) : null}
                <div className="field">
                  <label htmlFor="item-note">Notes</label>
                  <input id="item-note" type="text" maxLength={200} value={item.note} placeholder="e.g. model, IP address, what it patches to" onChange={(e) => update(item.id, { note: e.target.value })} />
                </div>
              </div>
            ) : (
              <p className="form-note">Click a piece of equipment to label it, change its height, move it or send it to another rack. Drag it up or down the rack to move it.</p>
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
      )}

      {/* The picture and Excel export draw from this copy of the room, without the selection. */}
      <div className="rack-planner-export" aria-hidden="true">
        <RoomDrawing room={room} svgRef={exportRef} label="" />
      </div>

      <div className="rack-planner-toolbar">
        <div className="field rack-planner-name">
          <label htmlFor="room-name">Room name</label>
          <input id="room-name" type="text" maxLength={200} value={room.name} placeholder="e.g. Level 2 comms room" onChange={(e) => commit({ ...room, name: e.target.value })} />
        </div>
        <div className="field rack-planner-name">
          <label htmlFor="rack-site">Site</label>
          <input id="rack-site" type="text" maxLength={200} value={room.site} placeholder="e.g. Head office" onChange={(e) => commit({ ...room, site: e.target.value })} />
        </div>
      </div>
      <div className="rack-planner-toolbar">
        <button type="button" className="btn btn-primary" onClick={savePicture}><Download size={18} strokeWidth={2} aria-hidden="true" /> Save as a picture</button>
        <button type="button" className="btn btn-primary" onClick={saveExcel}><FileSpreadsheet size={18} strokeWidth={2} aria-hidden="true" /> Save as Excel</button>
        <button type="button" className="btn btn-secondary" onClick={saveRackFile}><Save size={18} strokeWidth={2} aria-hidden="true" /> Save rack file</button>
        <button type="button" className="btn btn-secondary" onClick={() => fileInput.current?.click()}><FileUp size={18} strokeWidth={2} aria-hidden="true" /> Open a rack file</button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(e) => openRackFile(e.target.files?.[0])} />
        <button type="button" className="btn btn-secondary" onClick={() => { const s = sampleRoom(); commit(s); pickRack(s.racks[0].id); setView('rack'); setMessage('Sample comms room loaded.'); }}>Sample room</button>
        {confirmClear ? (
          <>
            <button type="button" className="btn btn-primary" onClick={() => { const e = emptyRoom(rack.size); commit(e); pickRack(e.racks[0].id); setView('rack'); setConfirmClear(false); setMessage('Empty room with one rack.'); }}>Yes, start again</button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(false)}>Keep it</button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)}>Start again</button>
        )}
      </div>
      <p className="form-note">
        Your racks stay in this browser on this device; nothing is sent to {brand.name}. Save the rack file to keep them or move them to another
        device. Heights are the usual ones for each kind of equipment; check the datasheets, and allow for depth, airflow and cable bend room.
      </p>
    </div>
  );
}
