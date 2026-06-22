// The "shell" that wraps every page. It loads the styles and sets the tab title.
// You rarely need to edit this file.
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI MVP Starter",
  description: "A tiny AI app built from five clearly-labelled boxes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
