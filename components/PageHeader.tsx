"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  cn: string;
  intro?: ReactNode;
  image?: { src: string; alt: string };
  /** Smaller headline for long titles. */
  compact?: boolean;
  children?: ReactNode;
};

/** Opening block for inner pages: split headline, ghosted characters, framed photo. */
export default function PageHeader({ eyebrow, title, cn, intro, image, compact, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // Starts a beat late so it plays as the transition doors open.
      const tl = gsap.timeline({ delay: 0.55, defaults: { ease: "expo.out" } });
      // Returned (not added to tl) so a re-split on resize or font load resumes at the same progress.
      SplitText.create(q("[data-ph-title]"), {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.lines,
            { yPercent: 115 },
            { yPercent: 0, duration: 1.4, stagger: 0.09, ease: "expo.out", delay: 0.55 },
          );
        },
      });
      tl.fromTo(q("[data-ph-fade]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 }, 0.3)
        .fromTo(
          q("[data-ph-image]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          0.1,
        )
        .fromTo(q("[data-ph-image] img"), { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.1)
        .fromTo(q("[data-ph-cn]"), { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2 }, 0);

      gsap.to(q("[data-ph-cn]"), {
        yPercent: -25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-ph-image] img"), {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <header ref={root} className="relative overflow-hidden px-5 pt-36 pb-20 sm:px-10 lg:pt-44 lg:pl-24">
      <span
        data-ph-cn
        aria-hidden
        className="pointer-events-none absolute -top-6 right-0 font-cn text-[44vw] leading-none font-black text-gold/[0.045] lg:text-[30vw]"
      >
        {cn}
      </span>
      <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className={image ? "lg:col-span-7" : "lg:col-span-10"}>
          <p data-ph-fade className="eyebrow mb-6">
            {eyebrow}
          </p>
          <h1
            data-ph-title
            className={`font-display leading-[0.94] tracking-[-0.02em] ${
              compact ? "text-[clamp(2.6rem,4.8vw,5.4rem)]" : "text-[clamp(3rem,7.4vw,8rem)]"
            }`}
          >
            {title}
          </h1>
          {intro && (
            <div data-ph-fade className="mt-8 max-w-xl text-lg leading-relaxed text-cream/70">
              {intro}
            </div>
          )}
          {children && (
            <div data-ph-fade className="mt-10">
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="lg:col-span-5">
            <div data-ph-image className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[64svh]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
