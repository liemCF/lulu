"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
};

/**
 * Magnetic spring wrapper: when pointer enters the proximity radius, the element
 * is pulled towards the pointer with smooth elastic physics.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
  radius = 80,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "elastic.out(1.1, 0.35)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "elastic.out(1.1, 0.35)" });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return (
    <div ref={root} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}

