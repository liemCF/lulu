"use client";

import { gsap, SplitText } from "@/lib/gsap";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wires the shared scroll reveals inside `root`:
 *  - [data-split]  headings rise line by line from a mask
 *  - [data-fade]   blocks drift up and fade in
 *  - [data-clip]   images unveil bottom-to-top
 *  - [data-anim]   "words" (default) or "chars": pieces rise 110% and fade in once,
 *                   power3.out 0.9s, like an AnimatedText component
 *  - [data-letters] big headings whose letters fill in left to right as you scroll,
 *                   the tail still fading in while the start is solid
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

  root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
    const chars = el.dataset.anim === "chars";
    SplitText.create(el, {
      type: chars ? "chars,words" : "words",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(chars ? self.chars : self.words, {
          opacity: 0,
          yPercent: 110,
          duration: 0.9,
          ease: "power3.out",
          stagger: chars ? 0.025 : 0.06,
          delay: Number(el.dataset.delay) || 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });

  root.querySelectorAll<HTMLElement>("[data-letters]").forEach((el) => {
    SplitText.create(el, {
      type: "chars",
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.chars,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 40%", scrub: true },
          },
        );
      },
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
