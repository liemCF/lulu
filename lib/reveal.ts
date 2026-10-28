"use client";

import { gsap, SplitText } from "@/lib/gsap";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wires the shared scroll reveals inside `root`:
 *  - [data-split]  headings rise line by line from a mask
 *  - [data-fade]   blocks drift up and fade in
 *  - [data-clip]   images unveil bottom-to-top
 * Call from inside a useGSAP callback so everything is reverted on unmount.
 */
export function setupReveals(root: HTMLElement) {
  if (prefersReducedMotion()) return;

  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });

  root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: Number(el.dataset.fade) || 0,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  root.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.6,
        ease: "expo.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );
  });
}
