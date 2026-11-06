"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

export { useLenis };

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  // Reduced motion: keep native wheel scrolling instead of the eased glide.
  const [smoothWheel] = useState(() => !prefersReducedMotion());

  // Drive Lenis from GSAP's ticker so scrubbed animations and smooth scroll share one frame loop.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.085, anchors: true, autoRaf: false, smoothWheel }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
