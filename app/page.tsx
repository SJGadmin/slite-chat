import ChatUI from "../components/ChatUI";

export default function Page() {
  return (
    <main className="container">
      <header className="header">
        <img
          className="logo"
          src="https://assets.agentfire3.com/uploads/sites/1849/2024/12/Facebook-Social-Banner.png"
          alt="SJG brand banner"
        />
        <div className="title">SJG SOP</div>
      </header>

      <ChatUI />

      <div className="meta">
        Answers are grounded in your docs only. If not found, I’ll ask for specifics. ✨
      </div>
    </main>
  );
}
