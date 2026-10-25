'use client';

import { useCallback, useEffect, useState } from 'react';
import { Brain, MessageSquare, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import AdminAssistantChat from '@/components/AdminAssistantChat';
import { formatDateTime } from '@/lib/adminFormat';

// The Assistant page laid out like the Global platform's chat (Robert, 2026-10-25): every saved chat down
// the left, newest first and searchable, the open chat on the right, and the Assistant's memory (the notes
// it keeps from earlier chats and reads in every new one) one click away.
async function call(url, method = 'GET', body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || 'The backend did not answer.');
  return data;
}

// A saved message, in the shape the chat shows. Files are not kept, only their names.
function fromSaved(message) {
  return {
    role: message.role,
    content: message.content,
    actions: message.actions || [],
    artifacts: message.artifacts || [],
    model: message.model || undefined,
    savedFiles: (message.attachments || []).map((a) => a.name),
  };
}

function MemoryPanel({ onClose }) {
  const [notes, setNotes] = useState(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    call('/api/admin/assistant/memory').then((data) => setNotes(data.notes || [])).catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  async function add(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    setError('');
    try {
      await call('/api/admin/assistant/memory', 'POST', { text: draft });
      setDraft('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(note) {
    if (!window.confirm(`Forget this note?\n\n${note.text}`)) return;
    setError('');
    try {
      await call(`/api/admin/assistant/memory/${note.id}`, 'DELETE');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-assistant-memory">
      <div className="admin-assistant-memory-head">
        <strong>Memory</strong>
        <button type="button" className="admin-assistant-side-link" onClick={onClose}>Back to chats</button>
      </div>
      <p className="admin-muted">Notes the Assistant keeps from earlier chats and reads in every new one. It adds them itself when you tell it something worth keeping; add your own here. Never put passwords or keys here.</p>
      <form onSubmit={add} className="admin-assistant-memory-add">
        <textarea rows={2} value={draft} maxLength={500} onChange={(e) => setDraft(e.target.value)} placeholder="For example: Robert prefers short answers with the exact steps." />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={!draft.trim()}>Add note</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      {notes === null && !error && <p className="admin-muted">Loading…</p>}
      {notes && notes.length === 0 && <p className="admin-muted">Nothing saved yet.</p>}
      <ul className="admin-assistant-memory-list">
        {(notes || []).map((note) => (
          <li key={note.id}>
            <span>{note.text}</span>
            <span className="admin-muted admin-assistant-memory-meta">{note.source === 'staff' ? 'Added by staff' : 'Saved by the Assistant'} · {formatDateTime(note.created_at)}</span>
            <button type="button" className="admin-assistant-icon-btn" onClick={() => remove(note)} aria-label="Forget this note" title="Forget this note">
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminAssistantWorkspace() {
  const [chats, setChats] = useState(null);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  // The open chat's saved messages, and a key that changes only when another chat is opened or a new one started.
  const [opened, setOpened] = useState({ key: 'new-0', messages: [] });
  const [listError, setListError] = useState('');
  const [showMemory, setShowMemory] = useState(false);

  const loadChats = useCallback((q) => {
    call(`/api/admin/assistant/chats${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then((data) => {
        setChats(data.chats || []);
        setListError('');
      })
      .catch((err) => setListError(err.message));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadChats(query.trim()), query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [query, loadChats]);

  async function openChat(chat) {
    if (chat.id === activeId) return;
    setListError('');
    try {
      const data = await call(`/api/admin/assistant/chats/${chat.id}`);
      setActiveId(chat.id);
      setOpened({ key: chat.id, messages: (data.messages || []).map(fromSaved) });
      setShowMemory(false);
    } catch (err) {
      setListError(err.message);
    }
  }

  function newChat() {
    setActiveId(null);
    setOpened({ key: `new-${Date.now()}`, messages: [] });
    setShowMemory(false);
  }

  // A chat's first reply gives it an id and a title: it joins the top of the list without reloading the chat.
  function saved(id, title) {
    setActiveId(id);
    setChats((current) => {
      const rest = (current || []).filter((c) => c.id !== id);
      const existing = (current || []).find((c) => c.id === id);
      return [{ ...(existing || {}), id, title: title || existing?.title || 'New chat', updated_at: new Date().toISOString() }, ...rest];
    });
  }

  async function rename(chat) {
    const title = window.prompt('Rename this chat', chat.title);
    if (!title || !title.trim() || title === chat.title) return;
    try {
      const data = await call(`/api/admin/assistant/chats/${chat.id}`, 'PATCH', { title });
      setChats((current) => (current || []).map((c) => (c.id === chat.id ? { ...c, title: data.title } : c)));
    } catch (err) {
      setListError(err.message);
    }
  }

  async function hide(chat) {
    if (!window.confirm(`Remove "${chat.title}" from your chats?`)) return;
    try {
      await call(`/api/admin/assistant/chats/${chat.id}`, 'DELETE');
      setChats((current) => (current || []).filter((c) => c.id !== chat.id));
      if (chat.id === activeId) newChat();
    } catch (err) {
      setListError(err.message);
    }
  }

  return (
    <div className="admin-assistant-workspace">
      <aside className="admin-assistant-side" aria-label="Chats">
        <button type="button" className="admin-assistant-side-btn" onClick={newChat}>
          <Plus size={16} aria-hidden="true" /> New chat
        </button>
        <button type="button" className={showMemory ? 'admin-assistant-side-btn active' : 'admin-assistant-side-btn'} onClick={() => setShowMemory((v) => !v)}>
          <Brain size={16} aria-hidden="true" /> Memory
        </button>
        {showMemory ? (
          <MemoryPanel onClose={() => setShowMemory(false)} />
        ) : (
          <>
            <label className="admin-assistant-search">
              <Search size={14} aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" maxLength={100} aria-label="Search chats" />
            </label>
            {listError && <p className="form-error" role="alert">{listError}</p>}
            {chats === null && !listError && <p className="admin-muted">Loading…</p>}
            {chats && chats.length === 0 && <p className="admin-muted">{query ? 'No chats match.' : 'No chats yet.'}</p>}
            <ul className="admin-assistant-chats">
              {(chats || []).map((chat) => (
                <li key={chat.id} className={chat.id === activeId ? 'active' : undefined}>
                  <button type="button" className="admin-assistant-chat-open" onClick={() => openChat(chat)} title={chat.title}>
                    <MessageSquare size={14} aria-hidden="true" />
                    <span className="admin-assistant-chat-title">{chat.title}</span>
                    <span className="admin-assistant-chat-time">{formatDateTime(chat.updated_at)}</span>
                  </button>
                  <span className="admin-assistant-chat-tools">
                    <button type="button" className="admin-assistant-icon-btn" onClick={() => rename(chat)} aria-label={`Rename ${chat.title}`} title="Rename">
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button type="button" className="admin-assistant-icon-btn" onClick={() => hide(chat)} aria-label={`Remove ${chat.title}`} title="Remove from the list">
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
      <div className="admin-assistant-main">
        <AdminAssistantChat key={opened.key} chatId={activeId} initialMessages={opened.messages} onSaved={saved} onNewChat={newChat} />
      </div>
    </div>
  );
}
