"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECTS } from "@/lib/types";

export default function NewInboxForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    project: "allgemein",
    priority: "normal" as "niedrig" | "normal" | "hoch" | "kritisch",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      toast.success("In Inbox gespeichert");
      router.push("/inbox");
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Titel *</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Was ist das?"
          required
          className="bg-card border-border"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Details</label>
        <Textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Mehr Infos, Links, Kontext..."
          rows={4}
          className="bg-card border-border resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Projekt</label>
          <Select value={form.project} onValueChange={(v) => { if (v) setForm((f) => ({ ...f, project: v })); }}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECTS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Priorität</label>
          <Select value={form.priority} onValueChange={(v) => { if (v) setForm((f) => ({ ...f, priority: v as typeof form.priority })); }}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="niedrig">Niedrig</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="hoch">Hoch</SelectItem>
              <SelectItem value="kritisch">Kritisch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !form.title.trim()}
        className="w-full"
        style={{ background: "#e94560", touchAction: "manipulation" }}
      >
        {loading ? "Wird gespeichert..." : "In Inbox speichern"}
      </Button>
    </form>
  );
}
