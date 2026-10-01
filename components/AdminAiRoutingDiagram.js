'use client';

/* What the website connects to, drawn the way a network diagram is drawn
   and the same way as the TeracomAI Global Platform's AI Provider
   Connections: the website as a router in the middle, each connection as a
   shape that says what kind of thing it is, and orthogonal connectors into a
   trunk on each side rather than spokes radiating from a hub.

     - a cloud is a hosted API somebody else runs
     - a rack is something on our own hardware, reached over our own network
     - a dashed cloud is the internet itself, a source of pages rather than a
       model, so it hangs off the top on a dashed link

   The controls are not here. They are on the row in the table below. */

import { STATE_COLOURS, internetSentence, shorten } from '@/lib/aiConnectionRows';

const W = 900;
const H = 560;
const CX = 450;
const CY = 300;

const ROUTER = { w: 182, h: 104 };
const NODE = { w: 176, h: 66 };
const LEFT_X = 36;
const RIGHT_X = W - 36 - NODE.w;
const LEFT_TRUNK = 292;
const RIGHT_TRUNK = W - 292;
const NET = { x: CX - 70, y: 28, w: 140, h: 78 };
const ACCENT = '#ff1717';

/* A cloud, drawn once and scaled. Normalised to a 100 x 60 box. */
const CLOUD = 'M 24,54 A 16,16 0 0,1 24,23 A 21,21 0 0,1 60,16 A 19,19 0 0,1 88,31 '
  + 'A 13,13 0 0,1 84,54 Z';

function Cloud({ x, y, w, h, stroke, fill, dashed }) {
  return (
    <path
      d={CLOUD}
      transform={`translate(${x} ${y}) scale(${w / 100} ${h / 60})`}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.6 / (w / 100)}
      strokeDasharray={dashed ? `${6 / (w / 100)} ${4 / (w / 100)}` : undefined}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/* A rack: the shape for something running on our own hardware. */
function Rack({ x, y, w, h, stroke, fill }) {
  const unit = h / 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
      {[1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={x} y1={y + unit * i} x2={x + w} y2={y + unit * i} stroke={stroke} strokeWidth="1" strokeOpacity="0.7" />
          <circle cx={x + w - 10} cy={y + unit * i - unit / 2} r="2.2" fill={stroke} />
          <rect x={x + 8} y={y + unit * i - unit / 2 - 2.5} width={w * 0.45} height="5" rx="1.5" fill={stroke} fillOpacity="0.3" />
        </g>
      ))}
    </g>
  );
}

/* The router in the middle: a box with the four arrows every network diagram
   puts on one, so it reads as routing rather than as another server. */
function Router({ x, y, w, h }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const arm = 22;
  const head = 6;
  const arrow = (dx, dy) => {
    const tipX = cx + dx * arm;
    const tipY = cy + dy * arm;
    return (
      <g key={`${dx},${dy}`}>
        <line x1={cx - dx * 4} y1={cy - dy * 4} x2={tipX} y2={tipY} stroke="var(--text)" strokeWidth="2" />
        <polygon
          points={`${tipX + dx * head},${tipY + dy * head} `
            + `${tipX - dy * head * 0.7 - dx * head * 0.2},${tipY - dx * head * 0.7 - dy * head * 0.2} `
            + `${tipX + dy * head * 0.7 - dx * head * 0.2},${tipY + dx * head * 0.7 - dy * head * 0.2}`}
          fill="var(--text)"
        />
      </g>
    );
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="rgba(255,23,23,.14)" stroke={ACCENT} strokeWidth="1.8" />
      <ellipse cx={cx} cy={y + 12} rx={w / 2 - 2} ry="9" fill="rgba(255,23,23,.20)" stroke={ACCENT} strokeWidth="1.2" />
      <g transform={`translate(0 ${-6})`}>
        {arrow(1, 0)}{arrow(-1, 0)}{arrow(0, 1)}{arrow(0, -1)}
      </g>
    </g>
  );
}

/* An elbow: across to the trunk, along it, then into the router. */
function Elbow({ fromX, fromY, trunkX, toX, toY, colour, bold }) {
  const d = `M ${fromX} ${fromY} H ${trunkX} V ${toY} H ${toX}`;
  return <path d={d} fill="none" stroke={colour} strokeWidth={bold ? 2.4 : 1.3} strokeOpacity={bold ? 0.95 : 0.5} strokeLinejoin="round" />;
}

export default function AdminAiRoutingDiagram({ rows }) {
  const all = rows || [];
  const models = all.filter((r) => r.provider !== 'internet');
  const internet = all.find((r) => r.provider === 'internet') || null;
  const internetOn = Boolean(internet && internet.enabled);
  const firstChoice = models.find((r) => r.enabled)?.provider;

  // Down the left, then down the right, the way a rack diagram is read.
  const half = Math.ceil(models.length / 2);
  const columns = [models.slice(0, half), models.slice(half)];
  const placed = [];
  columns.forEach((column, side) => {
    const span = H - 150;
    const step = column.length > 1 ? span / (column.length - 1) : 0;
    const top = column.length > 1 ? 96 : CY - NODE.h / 2;
    column.forEach((row, i) => {
      placed.push({
        row,
        side,
        x: side === 0 ? LEFT_X : RIGHT_X,
        y: column.length > 1 ? top + step * i - NODE.h / 2 : top,
      });
    });
  });

  return (
    <div className="admin-ai-routing">
      <div className="admin-ai-map">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="What the website connects to">
          <defs>
            <pattern id="admin-ai-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" strokeWidth="0.5" strokeOpacity="0.35" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#admin-ai-grid)" />

          {placed.map(({ row, side, x, y }) => {
            const bold = row.provider === firstChoice;
            return (
              <Elbow
                key={`link-${row.provider}`}
                fromX={side === 0 ? x + NODE.w : x}
                fromY={y + NODE.h / 2}
                trunkX={side === 0 ? LEFT_TRUNK : RIGHT_TRUNK}
                toX={side === 0 ? CX - ROUTER.w / 2 : CX + ROUTER.w / 2}
                toY={CY}
                colour={bold ? 'var(--text)' : STATE_COLOURS[row.state]}
                bold={bold}
              />
            );
          })}

          {internet && (
            <path d={`M ${CX} ${NET.y + NET.h - 6} V ${CY - ROUTER.h / 2}`} fill="none" stroke="#c084fc"
                  strokeWidth={internetOn ? 2.2 : 1.2} strokeOpacity={internetOn ? 1 : 0.4} strokeDasharray="7 5" />
          )}

          {internet && (
            <g>
              <Cloud x={NET.x} y={NET.y} w={NET.w} h={NET.h}
                     fill={internetOn ? 'rgba(192,132,252,.12)' : 'rgba(107,114,128,.12)'}
                     stroke={internetOn ? '#c084fc' : STATE_COLOURS.off} dashed />
              <text x={CX} y={NET.y + 42} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">Internet</text>
              <text x={CX} y={NET.y + 58} textAnchor="middle" fontSize="10" fill="var(--muted)">
                {internetOn ? internet.model || 'web search' : 'switched off'}
              </text>
            </g>
          )}

          <Router x={CX - ROUTER.w / 2} y={CY - ROUTER.h / 2} w={ROUTER.w} h={ROUTER.h} />
          <text x={CX} y={CY + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">Teracom</text>
          <text x={CX} y={CY + 35} textAnchor="middle" fontSize="10" fill="var(--muted)">Website</text>
          <text x={CX} y={CY + ROUTER.h / 2 + 16} textAnchor="middle" fontSize="9.5" fill="var(--muted)">Assistant · Scout research</text>

          {placed.map(({ row, x, y }) => {
            const colour = STATE_COLOURS[row.state];
            return (
              <g key={`node-${row.provider}`}>
                <title>{`${row.label} -- ${row.stateText}`}</title>
                {row.kind === 'self_hosted' ? (
                  <Rack x={x} y={y} w={NODE.w} h={NODE.h} fill="rgba(245,245,245,.05)" stroke={colour} />
                ) : (
                  <Cloud x={x} y={y} w={NODE.w} h={NODE.h} fill="rgba(245,245,245,.05)" stroke={colour} />
                )}
                <text x={x + NODE.w / 2} y={y + NODE.h / 2 + 1} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">
                  {`${row.position}. `}
                  {shorten(row.label, 20)}
                </text>
                <text x={x + NODE.w / 2} y={y + NODE.h + 14} textAnchor="middle" fontSize="9.5" fill="var(--muted)">
                  {shorten(row.model, 26)}
                </text>
                <circle cx={x + 13} cy={y + NODE.h / 2} r="4.5" fill={colour} />
              </g>
            );
          })}

          {models.length === 0 && (
            <text x={CX} y={CY + 90} textAnchor="middle" fontSize="12" fill="var(--muted)">No providers connected yet.</text>
          )}
        </svg>
      </div>

      <div className="admin-ai-legend">
        <span><span className="admin-ai-dot" style={{ background: STATE_COLOURS.healthy }} />Responding</span>
        <span><span className="admin-ai-dot" style={{ background: STATE_COLOURS.failing }} />Failing</span>
        <span><span className="admin-ai-dot" style={{ background: STATE_COLOURS.off }} />Disabled</span>
        <span><span className="admin-ai-dot" style={{ background: STATE_COLOURS.unknown }} />Not checked yet</span>
        <span>Cloud: a hosted API. Rack: our own hardware. Dashed: the internet, a source of pages rather than a
model.</span>
      </div>

      <p className="admin-muted" style={{ margin: 0 }}>
        Tried in the order set in the table below. {internetSentence(all)}
      </p>
    </div>
  );
}