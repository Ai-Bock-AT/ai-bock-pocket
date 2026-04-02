"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/chat");
        router.refresh();
      } else {
        setError("Falsches Passwort.");
      }
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen-safe items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm bock-animate-scale">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl font-black text-2xl"
            style={{ background: "#e94560", color: "#fff" }}
          >
            P
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI-BOCK Pocket</h1>
          <p className="mt-1 text-sm text-muted-foreground">Passwort eingeben</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !password}
            style={{ background: "#e94560", touchAction: "manipulation" }}
          >
            {loading ? "..." : "Einloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
