import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

// Swap faces per brand; keep the variable names, globals.css maps them to --font-display / --font-sans.
const display = Bodoni_Moda({
  variable: "--font-display-face",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter_Tight({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brand — Tagline",
  description: "One sentence lifted from the client's existing site.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="grain">
        {/* Without JS the intro never runs, so undo its start state. */}
        <noscript>
          <style>{`.intro-hide{opacity:1!important}[data-loader]{display:none}`}</style>
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
