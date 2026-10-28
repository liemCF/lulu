import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_SC, Work_Sans } from "next/font/google";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import Visit from "@/components/Visit";
import "./globals.css";

// Light editorial serif + Work Sans, the pairing Belgrade Arbor-style layouts are built on.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
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
  themeColor: "#0d0706",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${workSans.variable} ${notoSerifSC.variable} antialiased`}
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
