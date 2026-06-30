// The "shell" that wraps every page. It loads the styles, top nav, and toaster.
// You rarely need to edit this file.
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Impact10x AI Starter",
  description: "A streamed AI chat starter built from five clearly-labelled boxes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-lg font-bold tracking-tight">Impact10x AI</h1>
              <p className="text-xs text-zinc-500">3-Day AI Simulator</p>
            </div>
            <p className="hidden text-sm text-zinc-500 sm:block">
              Interface · Logic · Intelligence · Memory · Connections
            </p>
          </nav>
        </header>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
