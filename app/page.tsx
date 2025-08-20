// app/page.tsx
import ChatUI from "../components/ChatUI";

export default function Page() {
  return (
    <main className="container">
      <ChatUI />
      <div className="meta">
        Answers are grounded in your docs only. If not found, I’ll ask for specifics. ✨
      </div>
    </main>
  );
}
