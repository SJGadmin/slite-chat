"use client";

export default function MessageBubble({
  role,
  text
}: { role: "user" | "assistant"; text: string }) {
  return (
    <div className={`bubble ${role === "user" ? "user" : "assistant"}`}>
      {text}
    </div>
  );
}
