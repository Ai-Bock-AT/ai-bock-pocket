import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI-BOCK Pocket",
  description: "Mobile Assistant & Inbox",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pocket",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0f1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <Toaster
          theme="dark"
          toastOptions={{ style: { background: "#111827", border: "1px solid #1e2d40", color: "#e8edf5" } }}
        />
      </body>
    </html>
  );
}
