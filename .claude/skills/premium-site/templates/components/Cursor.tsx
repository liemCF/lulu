"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/reveal";

type Props = {
  /** Any CSS color. Defaults to the `--color-accent` token. */
  color?: string;
  /** Elements that pull toward the pointer. */
  magnetSelector?: string;
  /** Ring diameter in px: idle, over a link/button, with a data-cursor label. */
  sizes?: { idle: number; link: number; label: number };
};

/**
 * Dot + trailing ring. Links grow the ring; elements with data-cursor="Label"
 * turn it into a filled disc with that label. Magnets (.btn, [data-magnetic]) pull toward the pointer.
 * Fine pointers only; mount once in the root layout. Magnets are collected on mount,
 * so render it after the page content.
 */
export default function Cursor({
  color,
  magnetSelector = ".btn, [data-magnetic]",
  sizes = { idle: 38, link: 64, label: 96 },
}: Props) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");

    const accent =
      color || getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#ffffff";
    const [r, g, b] = gsap.utils.splitColor(accent);
    const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;
    gsap.set(dot.current, { backgroundColor: rgba(1) });
    gsap.set(ring.current, { borderColor: rgba(0.55), width: sizes.idle, height: sizes.idle });

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    let mode = "";
    const setMode = (next: string, text = "") => {
      if (next === mode && text === label.current?.textContent) return;
      mode = next;
      if (label.current) label.current.textContent = text;
      const filled = next === "label";
      const size = filled ? sizes.label : next === "link" ? sizes.link : sizes.idle;
      gsap.to(ring.current, {
        width: size,
        height: size,
        backgroundColor: rgba(filled ? 0.95 : 0),
        borderColor: rgba(filled ? 0 : 0.55),
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(label.current, { autoAlpha: filled ? 1 : 0, scale: filled ? 1 : 0.6, duration: 0.3 });
      gsap.to(dot.current, { scale: next ? 0 : 1, duration: 0.3 });
    };

    const over = (e: PointerEvent) => {
      const el = e.target as Element;
      const labelled = el.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("label", labelled.dataset.cursor);
      if (el.closest("a, button")) return setMode("link");
      setMode("");
    };
    const leaveWindow = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };

    // Magnetic buttons.
    const magnets = Array.from(document.querySelectorAll<HTMLElement>(magnetSelector));
    const cleanups = magnets.map((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.3);
        my((e.clientY - (r.top + r.height / 2)) * 0.4);
      };
      const onLeave = () => {
        mx(0);
        my(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      cleanups.forEach((c) => c());
    };
  });

  return (
    <>
      <div ref={ring} className="cursor flex items-center justify-center rounded-full border" aria-hidden>
        <span ref={label} className="text-[0.6rem] font-medium tracking-[0.25em] text-ink uppercase opacity-0" />
      </div>
      <div ref={dot} className="cursor h-1.5 w-1.5 rounded-full" aria-hidden />
    </>
  );
}
