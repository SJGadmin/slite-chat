import React from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatUIProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatUI({ messages, setMessages }: ChatUIProps) {
  return (
    <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-xl ${
            msg.role === "user"
              ? "bg-blue-100 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
