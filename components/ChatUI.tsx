import React, { useState } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hey there! Ask about any SOP and I’ll answer strictly from our docs — or I’ll ask a quick clarifying question. Let’s get this deal... sealed. 🧾' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `You said: ${newMessage.text}` }]);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Chat Window */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', margin: '20px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                maxWidth: '60%',
                padding: '10px 15px',
                borderRadius: '15px',
                background: msg.sender === 'user' ? '#007AFF' : '#e5e5ea',
                color: msg.sender === 'user' ? '#fff' : '#000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', padding: '10px 20px', borderTop: '1px solid #ddd', background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type here..."
          style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '20px', background: '#007AFF', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
