"use client";

import Image from "next/image";
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
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-6">
      {/* Header Section */}
      <header className="w-full max-w-3xl flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold">SJG SOP</h1>
        <p className="text-gray-700 mt-2">What ails you child?</p>
        <p className="text-gray-600 text-center mt-1">
          Hey there! Ask about any SOP and I&apos;ll answer strictly from our docs —
          or I&apos;ll ask a quick clarifying question. Let&apos;s get this deal...
          sealed. 🧑‍⚖️
        </p>
      </header>

      {/* Chat Window */}
      <section className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className="h-64 overflow-y-auto border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-400 italic">No messages yet...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold text-blue-600">You:</span>{" "}
                {msg}
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
