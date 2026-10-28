"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Manifesto lights up word by word as it scrolls through the viewport.
      SplitText.create(q("[data-manifesto]"), {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: q("[data-manifesto]")[0], start: "top 80%", end: "bottom 45%", scrub: true },
            },
          );
        },
      });

      gsap.fromTo(
        q("[data-story-img]"),
        { yPercent: -10, scale: 1.15 },
        {
          yPercent: 10,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: q("[data-story-frame]")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      gsap.to(q("[data-big-cn]"), {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="relative overflow-hidden bg-ink px-5 py-28 sm:px-10 lg:py-40 lg:pl-24">
      <span
        data-big-cn
        aria-hidden
        className="pointer-events-none absolute top-20 -right-10 font-cn text-[38vw] leading-none font-black text-gold/[0.035] lg:text-[26vw]"
      >
        品味
      </span>

      <div className="relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div data-story-frame data-clip className="relative aspect-[3/4] overflow-hidden">
            <div data-story-img className="absolute inset-0">
              <Image
                src="/images/story-lulu.webp"
                alt="Lulu, the muse of Lulu Modern"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-4 text-xs tracking-[0.2em] text-cream/40 uppercase">Lulu — our muse, between two worlds</p>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <p data-fade className="eyebrow mb-6">
            Our Story
          </p>
          <h2 data-split className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.98] tracking-[-0.015em]">
            Rooted in Culture. <em className="gold-foil">Inspired by Evolution.</em>
          </h2>
          <p data-manifesto className="mt-10 font-display text-[clamp(1.4rem,2.2vw,2.1rem)] leading-snug">
            Lulu Modern was born from the Asian American experience. Growing up between cultures taught us that
            tradition and innovation can exist side by side. Our restaurant reflects that belief, bringing together
            authentic flavors, modern creativity, and a dining experience designed to be shared.
          </p>
          <p data-fade className="mt-8 max-w-lg text-cream/60">
            This is more than a restaurant. It’s our interpretation of what modern Asian hospitality can become.
          </p>
          <div data-fade className="mt-8">
            <TLink href="/story" className="btn text-cream">
              Read Our Story
            </TLink>
          </div>

          <div className="mt-16 grid grid-cols-[96px_1fr] gap-6 border-t border-gold/15 pt-10 sm:grid-cols-[140px_1fr]">
            <div data-clip className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/story-mural.webp" alt="The Lulu mural with a flaming duck" fill sizes="140px" className="object-cover" />
            </div>
            <div>
              <p data-fade className="eyebrow mb-3">
                Meet the Chef
              </p>
              <h3 data-split className="font-display text-3xl leading-tight">
                Leading the Next Chapter of Lulu Modern
              </h3>
              <p data-fade className="mt-4 text-sm leading-relaxed text-cream/65">
                Under the direction of Executive Chef Natalie Deprez, Lulu Modern is entering a new era of culinary
                creativity — a menu that honors tradition while pushing Asian cuisine forward through innovation,
                premium ingredients, and unforgettable presentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
