import ChatUI from "../components/ChatUI";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="p-4 flex items-center space-x-2 border-b bg-white">
        <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        <div>
          <h1 className="text-lg font-bold">SJG SOP</h1>
          <p className="text-sm text-gray-500">What ails you child?</p>
        </div>
      </header>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Example assistant message */}
        <div className="bg-gray-100 p-3 rounded-lg mb-4 max-w-xl">
          Hey there! Ask about any SOP and I’ll answer strictly from our docs — 
          or I’ll ask a quick clarifying question. Let’s get this deal... sealed. 🏡
        </div>

        {/* Messages will render here */}
      </div>

      {/* Input bar fixed at bottom */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <textarea
            className="flex-1 border rounded-lg p-2 focus:outline-none resize-none"
            placeholder='Ask about an SOP (e.g., "How do I work a Google LSA Message lead?")'
          />
          <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
