"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingDots from "./TypingDots";

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

  const scrollToEnd = () =>
    scroller.current?.scrollTo({ top: 9e6, behavior: "smooth" });
  useEffect(scrollToEnd, [messages.length, loading]);

  // Typewriter that appends a NEW assistant message and streams into it
  async function typeIn(full: string, startDelayMs = 120) {
    let placeholderIndex = -1;

    // Append an empty assistant message and capture its index *safely*
    setMessages(prev => {
      placeholderIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    // small pause to feel responsive
    await new Promise(r => setTimeout(r, startDelayMs));

    const step = 3; // chars per tick
    for (let i = 0; i <= full.length; i += step) {
      const slice = full.slice(0, i);
      setMessages(prev =>
        prev.map((m, j) =>
          j === placeholderIndex ? { ...m, content: slice } : m
        )
      );
      await new Promise(r => setTimeout(r, 16)); // ~60fps
    }
  }

  async function ask() {
    const q = input.trim();
    if (!q || loading) return;

    setLoading(true);
    // append the user's message first
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });
      const data = await res.json();
      const answer: string =
        (data && typeof data.answer === "string" && data.answer) ||
        "⚠️ Sorry, I couldn’t get an answer.";

      await typeIn(answer);
    } catch (e) {
      await typeIn("⚠️ Error fetching answer. Please try again.");
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  }

  return (
    <div className="chat-shell">
      {/* transcript */}
      <div className="transcript" ref={scroller}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.content} />
        ))}
        {loading && <TypingDots />}
      </div>

      {/* composer */}
      <div className="composer">
        <textarea
          placeholder='Ask about an SOP (e.g., "How do I work a Google LSA Message lead?")'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask();
            }
          }}
        />
        <button className="btn" onClick={ask} disabled={loading || !input.trim()}>
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
