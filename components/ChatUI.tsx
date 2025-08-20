"use client";

import { useState, useRef } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask about any SOP. I’ll answer strictly from your Slite docs or ask for specifics." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error fetching answer." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="chat">
      <div className="messages" ref={scrollRef}>
        {messages.map((m, i) => <MessageBubble key={i} role={m.role} text={m.content} />)}
        {loading && <div className="typing">Assistant is thinking…</div>}
      </div>
      <div className="inputRow">
        <textarea
          placeholder="Ask about an SOP (e.g., 'How do I work a Google LSA Message lead?')"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask();
            }
          }}
        />
        <button onClick={ask} disabled={loading}>{loading ? "..." : "Send"}</button>
      </div>
    </div>
  );
}
