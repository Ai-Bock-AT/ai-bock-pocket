"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  messages: ChatMessage[];
  streaming?: string;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-card border border-border text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span className={cn("mt-1 block text-xs opacity-50", isUser ? "text-right" : "text-left")}>
          {new Date(message.timestamp).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

export default function MessageList({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  if (messages.length === 0 && !streaming) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-xl"
          style={{ background: "#e94560", color: "#fff" }}
        >
          P
        </div>
        <p className="text-sm font-medium text-foreground">AI-BOCK Pocket</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Frag mich zu deinen Projekten, lass Texte schreiben oder lege Aufgaben in die Inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      {streaming !== undefined && streaming !== "" && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-2.5 text-sm leading-relaxed text-foreground">
            <p className="whitespace-pre-wrap break-words">{streaming}</p>
            <span className="inline-block h-3 w-1 animate-pulse bg-primary ml-0.5 rounded-sm" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
