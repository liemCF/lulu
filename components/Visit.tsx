"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";

/** Final CTA from the homepage doc: "Experience Lulu Modern", closing every page. */
export default function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const big = q("[data-big-word]")[0];
      const { chars } = SplitText.create(big, { type: "chars" });
      gsap.from(chars, {
        yPercent: 100,
        ease: "expo.out",
        duration: 1.4,
        stagger: 0.04,
        scrollTrigger: { trigger: big, start: "top 90%", once: true },
      });

      // Gold leaf: every few seconds a glint of light runs across "Lulu Modern", only while it is on screen.
      const css = getComputedStyle(document.documentElement);
      const gold = css.getPropertyValue("--color-gold").trim();
      const glint = "#f6ebc8";
      const goldChars = chars.filter((c) => c.closest("em"));
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 2.6,
          delay: 1.6,
          scrollTrigger: { trigger: big, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
        })
        .to(goldChars, {
          keyframes: [
            { color: glint, textShadow: "0 0 18px rgba(226,199,132,0.65)", duration: 0.28, ease: "power2.out" },
            { color: gold, textShadow: "0 0 0px rgba(226,199,132,0)", duration: 0.7, ease: "power2.inOut" },
          ],
          stagger: 0.055,
        });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="visit" className="relative overflow-hidden bg-night px-5 py-28 sm:px-10 lg:px-24 lg:py-40">
      <h2 className="overflow-hidden">
        <span
          data-big-word
          className="block font-display text-[clamp(3.25rem,10.5vw,11rem)] leading-[0.95] tracking-[-0.03em]"
        >
          Experience <em className="text-gold">Lulu Modern</em>
        </span>
      </h2>
      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p data-fade className="max-w-md text-[1.15rem] leading-relaxed text-cream/85">
          Dallas-Fort Worth’s destination for modern Asian dining.
        </p>
        <div data-fade className="flex flex-wrap gap-3">
          <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid">
            Reserve a Table
          </a>
          <a href={links.order} target="_blank" rel="noreferrer" className="btn text-cream">
            Order Online
          </a>
        </div>
      </div>
    </footer>
  );
}
