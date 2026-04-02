"use client";

import { useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({ value, onChange, onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSend();
    }
  }

  function autoResize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className="flex items-end gap-2 border-t border-border bg-card p-3">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => { onChange(e.target.value); autoResize(); }}
        onKeyDown={handleKeyDown}
        placeholder="Nachricht..."
        rows={1}
        disabled={disabled}
        className={cn(
          "flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          "transition-all duration-150",
          disabled && "opacity-50"
        )}
        style={{ fontSize: "16px", minHeight: "42px", maxHeight: "160px" }}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
          value.trim() && !disabled
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
        style={{ touchAction: "manipulation" }}
      >
        <Send size={16} />
      </button>
    </div>
  );
}
