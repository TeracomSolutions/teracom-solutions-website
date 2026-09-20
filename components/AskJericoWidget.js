'use client';

import { useState } from 'react';

export default function AskJericoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hi, I'm Jerico. Ask me anything about Teracom's products or Teracom AI.",
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
      { id: placeholderId, type: 'assistant', text: 'Jerico is thinking...' },
    ]);
    setInputValue('');

    try {
      const response = await fetch('/api/jerico/chat', {
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
        className="jerico-toggle-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat with Jerico" : "Open chat with Jerico"}
      >
        {isOpen ? '✕' : 'Ask Jerico'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="jerico-panel">
          <div className="jerico-header">
            <div className="jerico-avatar-badge">J</div>
            <h3>Ask Jerico</h3>
            <button 
              className="jerico-close-button"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          
          <div className="jerico-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`jerico-message ${message.type === 'user' ? 'jerico-message-user' : 'jerico-message-assistant'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          
          <form className="jerico-input-row" onSubmit={handleSend}>
            <input
              type="text"
              className="jerico-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              aria-label="Enter your message"
            />
            <button 
              type="submit" 
              className="jerico-send-button"
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
