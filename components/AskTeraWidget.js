'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AskTeraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hi, I'm Tera. Ask me anything about Teracom's products or Teracom AI.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
    };

    // A stable id for the placeholder, generated once up front, so the
    // later replace can target this exact message -- not whichever
    // message happens to be last in the array by the time the response
    // arrives. Matching by array position breaks as soon as a second
    // message is sent before the first reply resolves (a real
    // possibility once this is wired to a real, non-instant backend).
    const placeholderId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      newUserMessage,
      { id: placeholderId, type: 'assistant', text: 'Tera is thinking...' },
    ]);
    setInputValue('');

    try {
      const response = await fetch('/api/tera/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === placeholderId ? { ...m, text: data.reply } : m))
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? { ...m, text: 'Sorry, I encountered an error. Please try again.' }
            : m
        )
      );
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="tera-toggle-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat with Tera" : "Open chat with Tera"}
      >
        {isOpen ? '✕' : <Image src="/assets/tera-avatar.webp" alt="" width={60} height={60} className="tera-toggle-avatar" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="tera-panel">
          <div className="tera-header">
            <Image src="/assets/tera-avatar.webp" alt="" width={36} height={36} className="tera-avatar-badge" />
            <h3>Ask Tera</h3>
            <button 
              className="tera-close-button"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          
          <div className="tera-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`tera-message ${message.type === 'user' ? 'tera-message-user' : 'tera-message-assistant'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          
          <form className="tera-input-row" onSubmit={handleSend}>
            <input
              type="text"
              className="tera-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              aria-label="Enter your message"
            />
            <button 
              type="submit" 
              className="tera-send-button"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
