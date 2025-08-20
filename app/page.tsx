"use client";

import { useState } from "react";
import ChatUI from "../components/ChatUI";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#E7E6E2] p-6">
      {/* Tagline */}
      <div className="max-w-2xl w-full text-center mb-6">
        <p className="text-lg text-gray-700 italic">What ails you, child?</p>
        <p className="text-gray-600 mt-1">
          Hey there! Ask about any SOP and I’ll answer strictly from our docs — 
          or I’ll ask a quick clarifying question. Let’s get this deal... sealed. 🏡
        </p>
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <ChatUI messages={messages} setMessages={setMessages} />
      </div>
    </main>
  );
}
