"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InboxItem } from "@/lib/types";
import { Check, Trash2, Clock } from "lucide-react";

const priorityColors: Record<string, string> = {
  kritisch: "bg-red-500/20 text-red-400 border-red-500/30",
  hoch: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  niedrig: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  offen: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "in-arbeit": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  erledigt: "bg-green-500/20 text-green-400 border-green-500/30",
};

interface Props {
  item: InboxItem;
  onUpdate: () => void;
}

export default function InboxCard({ item, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    try {
      await fetch(`/api/inbox/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Status: ${status}`);
      onUpdate();
    } catch {
      toast.error("Fehler beim Aktualisieren");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${item.title}" löschen?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/inbox/${item.id}`, { method: "DELETE" });
      toast.success("Gelöscht");
      onUpdate();
    } catch {
      toast.error("Fehler beim Löschen");
    } finally {
      setLoading(false);
    }
  }

  const date = new Date(item.created).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 bock-animate-in", loading && "opacity-60")}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground leading-snug">{item.title}</h3>
        <div className="flex shrink-0 gap-1">
          {item.status !== "erledigt" && (
            <button
              onClick={() => updateStatus("erledigt")}
              disabled={loading}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-green-500/20 hover:text-green-400 transition-colors"
              style={{ touchAction: "manipulation" }}
              title="Als erledigt markieren"
            >
              <Check size={14} />
            </button>
          )}
          {item.status === "offen" && (
            <button
              onClick={() => updateStatus("in-arbeit")}
              disabled={loading}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
              style={{ touchAction: "manipulation" }}
              title="In Arbeit"
            >
              <Clock size={14} />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
            style={{ touchAction: "manipulation" }}
            title="Löschen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {item.body && (
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{item.body}</p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={cn("text-xs", priorityColors[item.priority] || priorityColors.normal)}>
          {item.priority}
        </Badge>
        <Badge variant="outline" className={cn("text-xs", statusColors[item.status] || statusColors.offen)}>
          {item.status}
        </Badge>
        {item.project !== "allgemein" && (
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {item.project}
          </Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{date}</span>
      </div>
    </div>
  );
}
