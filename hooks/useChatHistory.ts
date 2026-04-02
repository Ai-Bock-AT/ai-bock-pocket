"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatMessage } from "@/lib/types";

const STORAGE_KEY = "pocket-chat-history";
const MAX_MESSAGES = 50;

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch {
      // localStorage not available
    }
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, message].slice(-MAX_MESSAGES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // quota exceeded — trim and retry
        const trimmed = next.slice(-20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      }
      return next;
    });
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], content };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, addMessage, updateLastMessage, clearHistory };
}
