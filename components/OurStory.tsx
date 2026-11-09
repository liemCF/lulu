"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

/** Section 5 of the homepage doc: Our Story. */
export default function OurStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const css = getComputedStyle(document.documentElement);

      // Deepen background softly
      gsap.fromTo(
        root.current,
        { backgroundColor: css.getPropertyValue("--color-ink").trim() },
        {
          backgroundColor: css.getPropertyValue("--color-navy").trim(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 35%", scrub: true },
        },
      );

      // Subtle parallax on the story photos
      gsap.fromTo(
        q("[data-story-art]"),
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // Words reveal
      const split = SplitText.create(q("[data-huge]"), { type: "words" });
      gsap.from(split.words, {
        yPercent: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="story"
      className="relative overflow-hidden bg-navy px-5 py-24 text-cream sm:px-10 lg:px-20 lg:py-36"
    >
      {/* Traditional lattice watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-96 w-96 origin-bottom-left bg-gold opacity-[0.04] [mask-image:url(/images/lattice.svg)] [mask-position:center] [mask-size:contain] [mask-repeat:no-repeat]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Artistic Visual Composition */}
          <div className="relative lg:col-span-5">
            <div
              data-story-art
              className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-gold/25 bg-ink shadow-2xl shadow-ink/90 lg:max-w-none"
            >
              <Image
                src="/images/story-mural.webp"
                alt="Lulu Modern cultural mural artwork"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

              {/* Muse Portrait Inset */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-gold/20 bg-ink/85 p-3 backdrop-blur-md">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/40">
                  <Image
                    src="/images/story-lulu.webp"
                    alt="Lulu, the muse"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[0.68rem] tracking-[0.18em] text-gold uppercase">Cultural Muse</p>
                  <p className="font-display text-sm text-cream">The Spirit of Lulu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Our Story
            </div>

            <h2 data-huge className="t-hero mt-5 text-cream">
              Rooted in Culture. <br className="hidden sm:inline" />
              <em className="text-gold-soft font-serif italic">Inspired by Evolution.</em>
            </h2>

            <div data-fade className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-cream/80 lg:text-[1.12rem]">
              <p className="font-display text-xl text-cream sm:text-2xl leading-snug">
                Lulu Modern was born from the Asian American experience.
              </p>
              <p>
                Growing up between cultures taught us that tradition and innovation can exist side by side. Our restaurant
                reflects that belief, bringing together authentic flavors, modern creativity, and a dining experience designed
                to be shared.
              </p>
              <p className="text-gold-soft font-serif italic text-lg">
                This is more than a restaurant. It’s our interpretation of what modern Asian hospitality can become.
              </p>
            </div>

            <div data-fade className="mt-10">
              <TLink href="/about" className="btn text-cream hover:border-gold">
                Read Our Story
              </TLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
