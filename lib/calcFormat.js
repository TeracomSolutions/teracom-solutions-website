// Number and time wording shared by the calculator field definitions.
export const fmt = (n, dp = 2) =>
  Number.isFinite(n) ? n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : '0';

// Metres along the ground; Infinity means the view reaches the horizon.
export const metresText = (metres, dp = 1) => (Number.isFinite(metres) ? `${fmt(metres, dp)} m` : 'the horizon');

export function durationText(seconds) {
  const total = Math.round(seconds);
  if (total < 60) return `${total} s`;
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days} d ${hours} h`;
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}