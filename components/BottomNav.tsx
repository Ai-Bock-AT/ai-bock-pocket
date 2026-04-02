"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plus, Inbox, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/inbox/new", icon: Plus, label: "Capture" },
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/projekte", icon: FolderOpen, label: "Projekte" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/inbox/new"
              ? pathname === "/inbox/new"
              : pathname.startsWith(href) && href !== "/inbox/new";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors touch-action-manipulation",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ touchAction: "manipulation" }}
            >
              <Icon
                size={20}
                className={cn(isActive && "drop-shadow-[0_0_6px_rgba(233,69,96,0.6)]")}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
