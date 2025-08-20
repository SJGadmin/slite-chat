import React from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatUIProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatUI: React.FC<ChatUIProps> = ({ messages, setMessages }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className="mb-2">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Type here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
              setMessages((prev) => [
                ...prev,
                { role: "user", content: e.currentTarget.value },
              ]);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatUI;
