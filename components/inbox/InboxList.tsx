"use client";

import { useState, useEffect, useCallback } from "react";
import InboxCard from "./InboxCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InboxItem } from "@/lib/types";
import { PROJECTS } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InboxList() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState("alle");
  const [filterStatus, setFilterStatus] = useState("offen");

  function setFilter(setter: (v: string) => void) {
    return (v: string | null) => { if (v !== null) setter(v); };
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inbox");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((item) => {
    if (filterProject !== "alle" && item.project !== filterProject) return false;
    if (filterStatus !== "alle" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Filter bar */}
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilter(setFilterStatus)}>
          <SelectTrigger className="bg-card border-border flex-1">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Status</SelectItem>
            <SelectItem value="offen">Offen</SelectItem>
            <SelectItem value="in-arbeit">In Arbeit</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilter(setFilterProject)}>
          <SelectTrigger className="bg-card border-border flex-1">
            <SelectValue placeholder="Projekt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Projekte</SelectItem>
            {PROJECTS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          style={{ touchAction: "manipulation" }}
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </button>
      </div>

      {/* Items */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bock-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Keine Items gefunden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <InboxCard key={item.id} item={item} onUpdate={load} />
          ))}
        </div>
      )}

      {!loading && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {filtered.length} von {items.length} Items
        </p>
      )}
    </div>
  );
}
