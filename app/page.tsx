"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-6">
      {/* Header (tagline only) */}
      <header className="w-full max-w-2xl flex flex-col items-center text-center mb-8">
        <p className="text-lg text-gray-700 italic">What ails you, child?</p>
        <p className="text-gray-600 mt-1">
          Hey there! Ask about any SOP and I&apos;ll answer strictly from our docs — 
          or I&apos;ll ask a quick clarifying question. Let&apos;s get this deal... sealed. 🧑‍⚖️
        </p>
      </header>

      {/* Chat Window */}
      <section className="w-full max-w-2xl bg-gray-50 shadow-md rounded-lg p-6">
        <div className="h-72 overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 bg-white">
          {messages.length === 0 ? (
            <p className="text-gray-400 italic">No messages yet...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold text-blue-600">You:</span> {msg}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder='Ask about an SOP (e.g., "How do I...")'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
