"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export { useLenis };

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

type Props = {
  children: ReactNode;
  /** 0–1. Lower = heavier, more "luxury" glide. 0.08–0.1 is a good range. */
  lerp?: number;
};

/**
 * Wrap the app in this (inside <body>). Lenis is driven from GSAP's ticker so
 * scrubbed ScrollTriggers and smooth scroll share one frame loop.
 * Needs `@import "lenis/dist/lenis.css";` in globals.css.
 */
export default function SmoothScroll({ children, lerp = 0.085 }: Props) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp, anchors: true, autoRaf: false }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
