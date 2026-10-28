"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

const words = ["Flaming Peking Duck", "Dim Sum", "Signature Cocktails", "Late Nights", "Wagyu XLB", "Private Celebrations"];

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector("[data-track]")!;
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });

      // Scroll velocity pushes the band faster and tilts it a touch, then it settles back.
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
      const settle = gsap.delayedCall(0.15, () => {
        skewTo(0);
        gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
      }).pause();
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          skewTo(gsap.utils.clamp(-7, 7, v / -300));
          gsap.to(loop, { timeScale: gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 300), duration: 0.3, overwrite: true });
          settle.restart(true);
        },
      });
    },
    { scope: root },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-8 font-display text-[clamp(2.2rem,5.5vw,5.5rem)] whitespace-nowrap italic">{w}</span>
          <span className="font-cn text-[clamp(1.2rem,2.4vw,2.2rem)] font-black text-cinnabar">味</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className="relative overflow-hidden border-y border-gold/15 bg-ink py-6 text-gold" aria-hidden>
      <div data-track className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
}
