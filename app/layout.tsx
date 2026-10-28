import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight, Noto_Serif_SC } from "next/font/google";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import Visit from "@/components/Visit";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["500", "900"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lulu Modern Chinese — Plano, Dallas-Fort Worth",
  description:
    "Modern Asian dining in Plano, TX. Home of the iconic Flaming Peking Duck, chef-driven dim sum and signature cocktails.",
};

export const viewport: Viewport = {
  themeColor: "#07080c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${interTight.variable} ${notoSerifSC.variable} antialiased`}
    >
      <body className="grain">
        <noscript>
          <style>{`.intro-hide{opacity:1!important}[data-loader]{display:none}`}</style>
        </noscript>
        <SmoothScroll>
          <PageTransition>
            <Nav />
            {children}
            <Visit />
          </PageTransition>
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
