'use client';

// A small face for the assistant. The state only changes CSS classes
// (see the .admin-assistant-avatar rules in globals.css): a pulsing ring
// while listening, blinking eyes while thinking, a moving mouth while
// speaking. Decorative, so hidden from screen readers.
export default function AdminAssistantAvatar({ state = 'idle', size = 40 }) {
  return (
    <span className={`admin-assistant-avatar is-${state}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="ring" />
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <circle cx="20" cy="20" r="18" fill="#c084fc" fillOpacity="0.18" stroke="#c084fc" strokeWidth="1.5" />
        <circle className="eye" cx="14" cy="17" r="2.2" fill="#fff" />
        <circle className="eye" cx="26" cy="17" r="2.2" fill="#fff" />
        <path className="mouth" d="M13 26 Q20 31 27 26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
