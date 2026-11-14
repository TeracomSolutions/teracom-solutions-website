'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Maximize2, X } from 'lucide-react';

import AdminAssistantChat from '@/components/AdminAssistantChat';
import {
  CHAT_EVENT, clampPlace, currentChatId, isDrag, readOpen, readPlace, setCurrentChatId, writeOpen, writePlace,
} from '@/lib/assistantShared';

// The floating Tera on every console page (Robert, 14 November 2026, "the same as we've got in Global"): click it
// and the Assistant chat pops up beside it; drag it (mouse, finger, or arrow keys when focused) wherever you want
// and it stays there in this browser. It carries on the same conversation as the Assistant page
// (lib/assistantShared.js), and everything said and done in it is kept in the backend, as on that page. On the
// Assistant page itself it hides, so there is never two copies of the chat.
const SIZE = 64;
const START = { right: 24, bottom: 24 };

function fromSaved(message) {
  return {
    role: message.role,
    content: message.content,
    actions: message.actions || [],
    artifacts: message.artifacts || [],
    model: message.model || undefined,
    steps: message.steps || [],
    savedFiles: (message.attachments || []).map((a) => a.name),
    keptFiles: (message.attachments || []).filter((a) => a.id),
  };
}

export default function AdminAssistantBubble() {
  const pathname = usePathname() || '';
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(START);
  const [chat, setChat] = useState({ key: 'new-0', id: null, messages: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const drag = useRef(null);
  const button = useRef(null);
  const chatRef = useRef(null);
  chatRef.current = chat.id;
  const hidden = pathname.startsWith('/admin/assistant') || pathname.startsWith('/admin/login');

  const view = () => ({ w: window.innerWidth, h: window.innerHeight });

  const loadChat = useCallback(async (id) => {
    if (!id) {
      setChat({ key: `new-${Date.now()}`, id: null, messages: [] });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/assistant/chats/${id}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 404) {
        setCurrentChatId(null);
        setChat({ key: `new-${Date.now()}`, id: null, messages: [] });
        return;
      }
      if (!res.ok) throw new Error(data.error || data.detail || 'The chat could not be loaded.');
      setChat({ key: id, id, messages: (data.messages || []).map(fromSaved) });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPlace(clampPlace(readPlace() || START, view(), SIZE));
    setOpen(readOpen());
    setReady(true);
    const onResize = () => setPlace((p) => clampPlace(p, view(), SIZE));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Opening (or a chat changed on another tab of this page) loads the shared chat.
  useEffect(() => {
    if (!open || hidden) return undefined;
    loadChat(currentChatId());
    const onOther = (event) => {
      if ((event.detail || null) !== chatRef.current) loadChat(event.detail || null);
    };
    window.addEventListener(CHAT_EVENT, onOther);
    return () => window.removeEventListener(CHAT_EVENT, onOther);
  }, [open, hidden, loadChat]);

  if (!ready || hidden) return null;

  const toggle = () => {
    setOpen((was) => {
      writeOpen(!was);
      return !was;
    });
  };

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, start: place, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (!d.moved && !isDrag(dx, dy)) return;
    d.moved = true;
    setPlace(clampPlace({ right: d.start.right - dx, bottom: d.start.bottom - dy }, view(), SIZE));
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) writePlace(place);
    else toggle();
  };
  const onKeyDown = (event) => {
    const step = event.shiftKey ? 40 : 12;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[event.key];
    if (!m) return;
    event.preventDefault();
    const next = clampPlace({ right: place.right + m[0], bottom: place.bottom + m[1] }, view(), SIZE);
    setPlace(next);
    writePlace(next);
  };

  // The panel opens on whichever side of the button has more room.
  const vw = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
  const onRight = place.right < vw / 2;
  const below = place.bottom > vh / 2;
  const panelStyle = {
    [onRight ? 'right' : 'left']: onRight ? place.right : Math.max(8, vw - place.right - SIZE),
    [below ? 'top' : 'bottom']: below ? Math.max(8, vh - place.bottom) + 8 : place.bottom + SIZE + 10,
  };

  return (
    <>
      {open ? (
        <div className="assistant-float-panel" style={panelStyle} role="dialog" aria-label="Assistant">
          <div className="assistant-float-head">
            <img src="/assets/tera-avatar.webp" alt="" width={28} height={28} />
            <strong>Assistant</strong>
            <span className="assistant-float-tools">
              <Link href={chat.id ? `/admin/assistant?chat=${chat.id}` : '/admin/assistant'} className="assistant-float-icon" title="Open the Assistant page" aria-label="Open the Assistant page">
                <Maximize2 size={15} aria-hidden="true" />
              </Link>
              <button type="button" className="assistant-float-icon" onClick={toggle} title="Close" aria-label="Close the Assistant">
                <X size={16} aria-hidden="true" />
              </button>
            </span>
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          {loading ? (
            <p className="admin-muted assistant-float-loading">Loading the chat…</p>
          ) : (
            <AdminAssistantChat
              key={chat.key}
              chatId={chat.id}
              initialMessages={chat.messages}
              compact
              onSaved={(id) => {
                chatRef.current = id;
                setCurrentChatId(id);
              }}
              onNewChat={() => {
                chatRef.current = null;
                setCurrentChatId(null);
              }}
            />
          )}
        </div>
      ) : null}
      <button
        ref={button}
        type="button"
        className={`assistant-float-button${open ? ' is-open' : ''}`}
        style={{ right: place.right, bottom: place.bottom, width: SIZE, height: SIZE }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; }}
        onKeyDown={onKeyDown}
        onClick={(event) => { if (event.detail === 0) toggle(); }}
        aria-expanded={open}
        aria-label={open ? 'Close the Assistant' : 'Open the Assistant (drag to move, or use the arrow keys)'}
        title="Assistant: click to chat, drag to move"
      >
        <picture>
          <source srcSet="/assets/tera/anim/tera-ready-anim.webp" media="(prefers-reduced-motion: no-preference)" />
          <img src="/assets/tera/tera-ready.webp" alt="" draggable={false} />
        </picture>
      </button>
    </>
  );
}
