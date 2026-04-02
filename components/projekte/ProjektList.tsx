"use client";

import { useState, useEffect } from "react";
import ProjektCard from "./ProjektCard";
import type { Project } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjektList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/projekte");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {!loading && `${projects.length} Projekte`}
        </p>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground transition-colors"
          style={{ touchAction: "manipulation" }}
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bock-shimmer" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Keine Projekte verfügbar</p>
          <p className="mt-1 text-xs">Sync ausführen: pocket-sync.sh</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <div key={p.id} className={`bock-stagger-${Math.min(i + 1, 4)}`}>
              <ProjektCard project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
