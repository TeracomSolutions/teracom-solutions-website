// The front of each kind of rack equipment, drawn simply: ports on patch panels and
// switches, rings on cable management, drive bays on recorders and servers, a screen
// on a UPS, outlets on a power rail. Each takes the faceplate's box (x, y, w, h) and
// the item's height in rack units, and draws inside the area right of the label.
const PORT = '#0b0b0b';
const LINE = 'rgba(255,255,255,.35)';
const LED = '#22c55e';

function ports(x, y, w, h, perRow, rows, { group = 6, sfp = 0 } = {}) {
  const out = [];
  const groups = Math.ceil(perRow / group);
  const gap = 5;
  const sfpW = sfp ? sfp * 12 + 8 : 0;
  const pitch = Math.min(11, (w - sfpW - (groups - 1) * gap) / perRow);
  const pw = pitch - 2;
  const ph = Math.min(8, (h - 6) / rows - 3);
  const total = perRow * pitch + (groups - 1) * gap;
  const top = y + (h - rows * (ph + 3) + 3) / 2;
  for (let r = 0; r < rows; r += 1) {
    for (let i = 0; i < perRow; i += 1) {
      const px = x + i * pitch + Math.floor(i / group) * gap;
      out.push(<rect key={`p${r}-${i}`} x={px} y={top + r * (ph + 3)} width={pw} height={ph} rx={1} fill={PORT} stroke={LINE} strokeWidth={0.5} />);
    }
  }
  for (let i = 0; i < sfp; i += 1) {
    out.push(<rect key={`s${i}`} x={x + total + 10 + i * 12} y={top} width={10} height={Math.max(ph, rows * (ph + 3) - 3)} rx={1} fill="#111" stroke="#94a3b8" strokeWidth={0.6} />);
  }
  return out;
}

const leds = (x, y, n = 3) => Array.from({ length: n }, (_, i) => <circle key={`l${i}`} cx={x + i * 7} cy={y} r={2} fill={i === 0 ? LED : '#38bdf8'} />);

export default function RackArt({ art, x, y, w, h, ru }) {
  const mid = y + h / 2;
  switch (art) {
    case 'ports24':
      return <g>{ports(x, y, w, h, 24, 1)}</g>;
    case 'ports48':
      return <g>{ports(x, y, w, h, 24, ru >= 2 ? 2 : 1)}</g>;
    case 'switch24':
      return <g>{leds(x, mid, 2)}{ports(x + 18, y, w - 18, h, 12, 2, { sfp: 4 })}</g>;
    case 'switch48':
      return <g>{leds(x, mid, 2)}{ports(x + 18, y, w - 18, h, 24, 2, { sfp: 4 })}</g>;
    case 'fibre':
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <rect x={x + i * 20} y={mid - 5} width={16} height={10} rx={2} fill="#0b0b0b" stroke="#60a5fa" strokeWidth={0.8} />
              <circle cx={x + i * 20 + 5} cy={mid} r={2} fill="#60a5fa" />
              <circle cx={x + i * 20 + 11} cy={mid} r={2} fill="#60a5fa" />
            </g>
          ))}
        </g>
      );
    case 'dring':
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M ${x + 8 + i * (w / 5)} ${y + h - 4} v ${-(h - 10)} a 6 6 0 0 1 6 -6 h ${w / 5 - 34} a 6 6 0 0 1 6 6 v ${h - 10}`} fill="none" stroke="#9ca3af" strokeWidth={2.2} />
          ))}
        </g>
      );
    case 'brush':
      return (
        <g>
          <rect x={x} y={mid - 5} width={w - 4} height={10} rx={3} fill="#0b0b0b" />
          {Array.from({ length: Math.floor((w - 8) / 4) }, (_, i) => <line key={i} x1={x + 3 + i * 4} y1={mid - 4} x2={x + 3 + i * 4} y2={mid + 4} stroke="#4b5563" strokeWidth={1} />)}
        </g>
      );
    case 'drives': {
      const rows = Math.max(1, ru);
      const cols = 4;
      const bw = (w - 12) / cols;
      const bh = h / rows;
      const out = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          out.push(
            <g key={`${r}-${c}`}>
              <rect x={x + c * bw} y={y + r * bh + 3} width={bw - 4} height={bh - 6} rx={2} fill="#18181b" stroke={LINE} strokeWidth={0.6} />
              <circle cx={x + c * bw + bw - 10} cy={y + r * bh + bh / 2} r={1.8} fill={LED} />
            </g>,
          );
        }
      }
      return <g>{out}</g>;
    }
    case 'ups':
      return (
        <g>
          <rect x={x} y={mid - Math.min(10, h / 2 - 4)} width={70} height={Math.min(20, h - 8)} rx={2} fill="#0e7490" stroke="#67e8f9" strokeWidth={0.8} />
          {leds(x + 82, mid, 3)}
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={x + 110 + i * 9} y1={y + 6} x2={x + 110 + i * 9} y2={y + h - 6} stroke={LINE} strokeWidth={2} />)}
        </g>
      );
    case 'outlets':
      return (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect x={x + i * 31} y={mid - 8} width={24} height={16} rx={3} fill="#f8fafc" />
              <line x1={x + i * 31 + 8} y1={mid - 4} x2={x + i * 31 + 6} y2={mid + 1} stroke="#111" strokeWidth={1.4} />
              <line x1={x + i * 31 + 16} y1={mid - 4} x2={x + i * 31 + 18} y2={mid + 1} stroke="#111" strokeWidth={1.4} />
              <line x1={x + i * 31 + 12} y1={mid + 2} x2={x + i * 31 + 12} y2={mid + 6} stroke="#111" strokeWidth={1.4} />
            </g>
          ))}
        </g>
      );
    case 'shelf':
      return (
        <g>
          <line x1={x - 4} y1={y + h - 4} x2={x + w - 4} y2={y + h - 4} stroke="#d1d5db" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={x + 10 + i * ((w - 20) / 10)} cy={mid - 2} r={2} fill="#1f2937" />)}
        </g>
      );
    case 'shelfbox':
      return (
        <g>
          <line x1={x - 4} y1={y + h - 4} x2={x + w - 4} y2={y + h - 4} stroke="#d1d5db" strokeWidth={3} />
          <rect x={x + 10} y={y + 8} width={90} height={h - 14} rx={4} fill="#f1f5f9" />
          <rect x={x + 112} y={y + 14} width={70} height={h - 20} rx={4} fill="#e2e8f0" />
          {leds(x + 20, y + 16, 3)}
        </g>
      );
    case 'fan':
      return (
        <g>
          {Array.from({ length: 4 }, (_, i) => {
            const cx = x + 22 + i * (w / 4);
            const r = Math.min(h / 2 - 3, 12);
            return (
              <g key={i}>
                <circle cx={cx} cy={mid} r={r} fill="#0b0b0b" stroke="#6b7280" strokeWidth={1} />
                <line x1={cx - r} y1={mid} x2={cx + r} y2={mid} stroke="#6b7280" />
                <line x1={cx} y1={mid - r} x2={cx} y2={mid + r} stroke="#6b7280" />
              </g>
            );
          })}
        </g>
      );
    case 'amp':
      return (
        <g>
          <circle cx={x + 20} cy={mid} r={Math.min(10, h / 2 - 3)} fill="#27272a" stroke="#a1a1aa" />
          <circle cx={x + 50} cy={mid} r={Math.min(10, h / 2 - 3)} fill="#27272a" stroke="#a1a1aa" />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={x + 80 + i * 8} y={mid - 4} width={6} height={8} fill={i < 6 ? LED : i < 8 ? '#f59e0b' : '#ef4444'} />)}
          {leds(x + 180, mid, 2)}
        </g>
      );
    case 'blank':
      return (
        <g>
          {Array.from({ length: Math.max(1, ru * 2 - 1) }, (_, i) => <rect key={i} x={x + 20} y={y + 5 + i * ((h - 10) / Math.max(1, ru * 2 - 1))} width={w - 60} height={2} rx={1} fill={LINE} />)}
        </g>
      );
    default:
      return (
        <g>
          {leds(x, mid, 4)}
          <rect x={x + 40} y={mid - 5} width={60} height={10} rx={2} fill="#0b0b0b" stroke={LINE} strokeWidth={0.6} />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x + 120 + i * 14} y={mid - 4} width={9} height={8} rx={1} fill={PORT} stroke={LINE} strokeWidth={0.5} />)}
        </g>
      );
  }
}
