import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import Visit from "@/components/Visit";
import "./globals.css";

// v2: Archivo with its width axis. Expanded black for display (the logo's blocky LULU), normal width for text.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Lulu Modern Chinese — Plano, Dallas-Fort Worth",
  description:
    "Modern Asian dining in Plano, TX. Home of the iconic Flaming Peking Duck, chef-driven dim sum and signature cocktails.",
};

export const viewport: Viewport = {
  themeColor: "#0b1638",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} antialiased`}
    >
      <body>
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
      </body>
    </html>
  );
}
