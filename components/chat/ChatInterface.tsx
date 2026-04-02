"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useChatHistory } from "@/hooks/useChatHistory";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ContextBadge from "./ContextBadge";
import { Trash2 } from "lucide-react";

export default function ChatInterface() {
  const { messages, addMessage, updateLastMessage, clearHistory } = useChatHistory();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<string | undefined>(undefined);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setInput("");
    const userMsg = { role: "user" as const, content: text, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setStreaming("");

    try {
      const allMessages = [...messages, userMsg];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!res.ok) throw new Error("Chat API Fehler");
      if (!res.body) throw new Error("Kein Stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreaming(accumulated);
      }

      addMessage({
        role: "assistant",
        content: accumulated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      toast.error("Fehler beim Senden");
      console.error(err);
    } finally {
      setStreaming(undefined);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Context info + clear button */}
      <div className="flex items-center justify-between border-b border-border">
        <ContextBadge />
        {messages.length > 0 && (
          <button
            onClick={() => { if (confirm("Chat-Verlauf löschen?")) clearHistory(); }}
            className="mr-3 rounded-md p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            style={{ touchAction: "manipulation" }}
            title="Verlauf löschen"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} streaming={streaming} />
      </div>

      {/* Input */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        disabled={streaming !== undefined}
      />
    </div>
  );
}
