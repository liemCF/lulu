"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Item = { key: string; image: string; alt: string; content: ReactNode; className?: string };

/**
 * A list where hovering a row floats that row's photo beside the pointer,
 * tilting with the pointer's speed. Touch devices just get the list.
 */
export default function HoverPreview({ items, className }: { items: Item[]; className?: string }) {
  const root = useRef<HTMLUListElement>(null);
  const float = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const box = float.current!;
      const shots = Array.from(box.querySelectorAll<HTMLElement>("[data-shot]"));
      gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      const x = gsap.quickTo(box, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(box, "y", { duration: 0.6, ease: "power3" });
      const rot = gsap.quickTo(box, "rotation", { duration: 0.8, ease: "power3" });

      let lastX = 0;
      const onMove = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        rot(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      const show = (i: number) => {
        shots.forEach((s, j) =>
          gsap.to(s, {
            clipPath: j === i ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            zIndex: j === i ? 2 : 1,
            duration: 0.6,
            ease: "expo.out",
          }),
        );
        gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
      };
      const hide = () => gsap.to(box, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "power2.out" });

      const rows = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-row]"));
      const offs = rows.map((row, i) => {
        const enter = () => show(i);
        row.addEventListener("pointerenter", enter);
        return () => row.removeEventListener("pointerenter", enter);
      });
      root.current!.addEventListener("pointermove", onMove);
      root.current!.addEventListener("pointerleave", hide);
      return () => {
        offs.forEach((o) => o());
        root.current?.removeEventListener("pointermove", onMove);
        root.current?.removeEventListener("pointerleave", hide);
      };
    },
    { scope: root },
  );

  return (
    <>
      <ul ref={root} className={className}>
        {items.map((it) => (
          <li key={it.key} data-row className={it.className}>
            {it.content}
          </li>
        ))}
      </ul>
      <div
        ref={float}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden aspect-[4/5] w-[260px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] [@media(hover:hover)_and_(pointer:fine)]:block"
        aria-hidden
      >
        {items.map((it) => (
          <div key={it.key} data-shot className="absolute inset-0" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
            <Image src={it.image} alt={it.alt} fill sizes="260px" className="object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
