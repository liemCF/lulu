"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

type Props = {
  id?: string;
  /** The homepage links on to the About page; the About page itself doesn't need the button. */
  showCta?: boolean;
};

/** Section 4 of the homepage doc: Meet the Chef. Executive Chef Natalie Deprez. */
export default function MeetChef({ id = "chef", showCta = true }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.fromTo(
        q("[data-chef-photo]"),
        { scale: 1.08, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={id}
      className="relative overflow-hidden bg-ink px-5 py-24 text-cream sm:px-10 lg:px-20 lg:py-36"
    >
      {/* Subtle ambient glow in background */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 -translate-x-1/3 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-navy-hi)_40%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Chef Image Frame */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div
              data-chef-photo
              className="group relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-gold/20 bg-night shadow-2xl shadow-ink/80 lg:max-w-none"
            >
              {/* A dish from the kitchen, not a person: swap in Chef Natalie's portrait once the client sends one. */}
              <Image
                src="/images/gallery-duck-platter.webp"
                alt="A Peking duck platter from the Lulu Modern kitchen"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Meet the Chef
            </div>

            <h2 data-split className="t-hero mt-5 text-cream">
              Leading the Next Chapter <br className="hidden sm:inline" />
              <em className="text-gold-soft font-serif italic">of Lulu Modern</em>
            </h2>

            <div data-fade className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-cream/80 lg:text-[1.12rem]">
              <p>
                Under the direction of <strong className="font-medium text-cream">Executive Chef Natalie Deprez</strong>, Lulu Modern is entering a new era of culinary
                creativity.
              </p>
              <p>
                Discover a menu that honors tradition while pushing Asian cuisine forward through innovation, premium
                ingredients, and unforgettable presentation.
              </p>
            </div>

            {showCta && (
              <div data-fade className="mt-10">
                <TLink href="/about#chef" className="btn text-cream hover:border-gold">
                  Meet Our Chef
                </TLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
