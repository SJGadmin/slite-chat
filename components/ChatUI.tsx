"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey there! Ask about any SOP and I’ll answer strictly from our docs — or I’ll ask a quick clarifying question. Let’s get this deal… sealed. 🏡"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e6, behavior: "smooth" });
  }, [messages.length, loading]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;

    // show user message
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });

      const data = await res.json();
      const answer =
        typeof data?.answer === "string"
          ? data.answer
          : "⚠️ Sorry, I couldn’t get an answer.";

      setMessages(prev => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Error fetching answer. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-shell">
      {/* scrollable transcript */}
      <div className="transcript" ref={scroller}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`bubble ${m.role === "user" ? "user" : "assistant"}`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      {/* bottom composer */}
      <div className="composer">
        <textarea
          placeholder='Ask about an SOP (e.g., "How do I work a Google LSA Message lead?")'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn" onClick={send} disabled={loading || !input.trim()}>
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
