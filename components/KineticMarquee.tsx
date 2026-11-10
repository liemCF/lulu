"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { useLenis } from "./SmoothScroll";

type Props = {
  items: string[];
  speed?: number; // base pixels per second
  className?: string;
  separator?: string;
  outline?: boolean;
};

/**
 * Velocity-Driven Kinetic Marquee:
 * Infinitely loops words across the screen. When the user scrolls fast,
 * the marquee accelerates and skews dynamically with the scroll velocity,
 * returning smoothly to normal speed.
 */
export default function KineticMarquee({
  items,
  speed = 45,
  className = "",
  separator = "✦",
  outline = false,
}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const skewX = useRef(0);
  const velocityMultiplier = useRef(1);

  // Hook into Lenis scroll velocity
  useLenis((lenis) => {
    if (prefersReducedMotion()) return;
    const vel = lenis.velocity || 0;
    // Map scroll velocity to skew (-18deg to 18deg) and speed acceleration
    const targetSkew = Math.max(-18, Math.min(18, vel * 0.45));
    const targetMultiplier = 1 + Math.min(4, Math.abs(vel) * 0.15);

    skewX.current += (targetSkew - skewX.current) * 0.1;
    velocityMultiplier.current += (targetMultiplier - velocityMultiplier.current) * 0.1;

    if (track.current) {
      gsap.set(track.current, {
        skewX: skewX.current,
        transformOrigin: "center center",
      });
    }
  });

  // Duplicate items 4 times to ensure seamless infinite loop
  const list = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden py-4 select-none pointer-events-none ${className}`}
      aria-hidden
    >
      <div
        ref={track}
        className="flex w-max items-center will-change-transform animate-marquee"
        style={{ animationDuration: `${1200 / speed}s` }}
      >
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6">
            <span
              className={`font-display text-[clamp(1.5rem,3.5vw,3rem)] tracking-[0.12em] uppercase transition-colors ${
                outline
                  ? "text-transparent [-webkit-text-stroke:1px_rgba(242,237,225,0.4)]"
                  : "text-cream/80"
              }`}
            >
              {item}
            </span>
            <span className="text-gold text-xs opacity-75">{separator}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

