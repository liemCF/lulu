"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

/**
 * Gold dot + trailing ring. Links grow the ring; elements with data-cursor="Label"
 * turn it into a filled disc with that label. Buttons (.btn, [data-magnetic]) pull toward the pointer.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");

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
      gsap.to(ring.current, {
        width: filled ? 96 : next === "link" ? 64 : 38,
        height: filled ? 96 : next === "link" ? 64 : 38,
        backgroundColor: filled ? "color-mix(in srgb, var(--color-gold) 95%, transparent)" : "color-mix(in srgb, var(--color-gold) 0%, transparent)",
        borderColor: filled ? "color-mix(in srgb, var(--color-gold) 0%, transparent)" : "color-mix(in srgb, var(--color-gold) 55%, transparent)",
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

    // Magnetic buttons, delegated so buttons on later pages pull too.
    type Magnet = { x: gsap.QuickToFunc; y: gsap.QuickToFunc };
    const magnets = new WeakMap<HTMLElement, Magnet>();
    let active: HTMLElement | null = null;
    const magnetFor = (el: HTMLElement) => {
      let m = magnets.get(el);
      if (!m) {
        m = {
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" }),
        };
        magnets.set(el, m);
      }
      return m;
    };
    const pull = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>(".btn, [data-magnetic]");
      if (active && active !== el) {
        const m = magnetFor(active);
        m.x(0);
        m.y(0);
      }
      active = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const m = magnetFor(el);
      m.x((e.clientX - (r.left + r.width / 2)) * 0.3);
      m.y((e.clientY - (r.top + r.height / 2)) * 0.4);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointermove", pull);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointermove", pull);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
    };
  });

  return (
    <>
      <div
        ref={ring}
        className="cursor flex h-[38px] w-[38px] items-center justify-center rounded-full border border-gold/55"
        aria-hidden
      >
        <span
          ref={label}
          className="text-[0.6rem] font-medium tracking-[0.25em] text-ink uppercase opacity-0"
        />
      </div>
      <div ref={dot} className="cursor h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
    </>
  );
}
