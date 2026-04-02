"use client";

import { useState, useEffect } from "react";
import { FileText, FolderOpen } from "lucide-react";

export default function ContextBadge() {
  const [info, setInfo] = useState<{ contextCount: number; projectCount: number } | null>(null);

  useEffect(() => {
    fetch("/api/context")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  if (!info) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <FileText size={12} />
        {info.contextCount} Kontext
      </span>
      <span className="flex items-center gap-1">
        <FolderOpen size={12} />
        {info.projectCount} Projekte
      </span>
    </div>
  );
}
