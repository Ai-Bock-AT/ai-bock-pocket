"use client";

import { useTheme } from "./ThemeProvider";
import BottomNav from "./BottomNav";
import { Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen-safe flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md font-black text-sm"
            style={{ background: "#e94560", color: "#fff" }}
          >
            P
          </div>
          <span className="font-bold tracking-tight text-foreground">
            AI-BOCK <span className="text-primary">Pocket</span>
          </span>
        </div>
        <button
          onClick={toggle}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          style={{ touchAction: "manipulation" }}
          aria-label="Theme wechseln"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Content — scrollable, leaves room for bottom nav */}
      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
