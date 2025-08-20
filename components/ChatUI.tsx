"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingDots from "./TypingDots";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey there! Ask about any SOP and I’ll answer strictly from our docs — or I’ll ask a quick clarifying question. Let’s get this deal… sealed. 🏡" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => scroller.current?.scrollTo({ top: 9e6, behavior: "smooth" });
  useEffect(scrollToEnd, [messages.length, loading]);

  // fake-stream the assistant text so it "types"
  const typeIn = async (full: string) => {
    const chunk = 3; // chars per frame
    let out = "";
    for
