"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import Scene, { type Shot } from "./Scene";

type Props = {
  eyebrow: string;
  title: ReactNode;
  /** The page's name in Chinese, set small in gold beside the label. */
  cn: string;
  intro?: ReactNode;
  /** Full-screen photo behind the heading. */
  image: Shot & { alt: string };
  /** Portrait photo for phones. */
  mobileImage?: Shot;
  /** Optional silent loops over the photo. */
  video?: { desktop?: string; mobile?: string; position?: string };
  dim?: number;
  /** Smaller headline for long titles. */
  compact?: boolean;
  children?: ReactNode;
};

/** Opening scene for inner pages: one full-screen photo or film, the page title set over it. */
export default function PageHeader({ eyebrow, title, cn, intro, image, mobileImage, video, dim = 0.22, compact, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // Returned (not added to a timeline) so a re-split on resize or font load resumes at the same progress.
      // Starts a beat late so it plays as the transition doors open.
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
      gsap.fromTo(
        q("[data-ph-fade]"),
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.09, ease: "expo.out", delay: 0.85 },
      );
      // The copy lifts away as the page scrolls on.
      gsap.to(q("[data-ph-copy]"), {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 25%", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <Scene
      ref={root}
      desktop={image}
      mobile={mobileImage}
      alt={image.alt}
      video={video}
      dim={dim}
      shade="left"
      className="!min-h-[92svh]"
    >
      <div data-ph-copy className="shell grid pt-40 pb-14 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-9">
          <p data-ph-fade className="scene-label">
            <span className="font-cn !tracking-[0.12em]">{cn}</span>
            {eyebrow}
          </p>
          <h1
            data-ph-title
            className={`mt-6 font-display leading-[0.96] tracking-[-0.025em] [text-wrap:balance] ${
              compact ? "text-[clamp(2.6rem,5.4vw,7rem)]" : "text-[clamp(3rem,7vw,9rem)]"
            }`}
          >
            {title}
          </h1>
          {intro && (
            <div data-ph-fade className="scene-copy mt-7 max-w-[36rem]">
              {intro}
            </div>
          )}
          {children && (
            <div data-ph-fade className="mt-9">
              {children}
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
