// Reading Tera's answer as it is written: server-sent events from
// /api/tera/stream, each one "data: {json}" followed by a blank line.
// Events: { type: 'text', text } as words arrive, then { type: 'done',
// conversation_id, message_id, reply, sources, answered }, or
// { type: 'error', error }.
const LINE = String.fromCharCode(10);
const GAP = LINE + LINE;

// The complete events in `buffer`, and the unfinished rest to keep.
export function takeEvents(buffer) {
  const parts = String(buffer || '').split(GAP);
  const rest = parts.pop();
  const events = [];
  for (const part of parts) {
    const data = part
      .split(LINE)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('');
    if (!data) continue;
    try {
      events.push(JSON.parse(data));
    } catch {
      // A broken event is skipped; the ones after it still count.
    }
  }
  return { events, rest };
}