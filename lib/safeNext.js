// Where to send someone after signing in or up: a same-site path from ?next=,
// or /account. Rejects absolute and protocol-relative URLs (open redirects),
// and anything holding a backslash or a control character (tab, carriage
// return, line feed): browsers strip those from an address, so / + tab + / +
// evil.example would become the off-site //evil.example.
export function safeNextPath(value, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  const backslash = String.fromCharCode(92);
  const unsafe = [...value].some((c) => c === backslash || c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127);
  return unsafe ? fallback : value;
}
