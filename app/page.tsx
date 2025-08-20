import ChatUI from "@/components/ChatUI";

export default function Page() {
  return (
    <main className="container">
      <div className="header">
        <div className="brand">SOP Chat</div>
      </div>
      <ChatUI />
      <div className="meta" style={{ marginTop: 12 }}>
        Answers are grounded in Slite docs only. If not found, I’ll ask for specifics.
      </div>
    </main>
  );
}
