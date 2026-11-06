import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk, Noto_Serif_SC } from "next/font/google";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import Visit from "@/components/Visit";
import "./globals.css";

// Bodoni Moda (high-contrast fashion serif) for display, Hanken Grotesk for reading.
// Variable names kept so the other pages pick up the new faces without edits.
const cormorant = Bodoni_Moda({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Hanken_Grotesk({
  variable: "--font-work-sans",
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
  themeColor: "#0a1640",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${workSans.variable} ${notoSerifSC.variable} antialiased`}
    >
      <body>
        <noscript>
          <style>{`.intro-hide,.after-light{opacity:1!important}.hero-light{clip-path:none!important}[data-loader]{display:none}`}</style>
        </noscript>
        <SmoothScroll>
          <PageTransition>
            <Nav />
            {children}
            <Visit />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
