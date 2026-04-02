import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <h1 className="font-bold text-foreground">Chat</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
