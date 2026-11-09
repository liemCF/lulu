"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

const perks = [
  { label: "Private Dining Suite", cap: "Up to 30 Guests", desc: "Intimate and secluded" },
  { label: "Full Venue Buyout", cap: "Up to 150 Guests", desc: "Exclusive experience" },
  { label: "Bespoke Chef Menus", cap: "Custom Pairings", desc: "Tableside service" },
];

/** Section 7 of the homepage doc: Private Dining & Celebrations. */
export default function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.fromTo(
        q("[data-event-main]"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );

      gsap.fromTo(
        q("[data-event-accent]"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.2,
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
      id="private"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_left,var(--color-navy)_0%,var(--color-ink)_70%)] px-5 py-24 text-cream sm:px-10 lg:px-20 lg:py-36"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Text & Event Specs */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Private Dining &amp; Celebrations
            </div>

            <h2 data-split className="t-hero mt-5 text-cream">
              Celebrations Deserve <br className="hidden sm:inline" />
              <em className="text-gold-soft font-serif italic">Something Extraordinary</em>
            </h2>

            <p data-fade className="mt-6 text-[1.05rem] leading-relaxed text-cream/80 lg:text-[1.12rem]">
              From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
              dining experiences for every occasion.
            </p>

            {/* Event Specs / Perks */}
            <div data-fade className="mt-8 grid gap-3 sm:grid-cols-3">
              {perks.map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-cream/10 bg-night/50 p-3.5 backdrop-blur-sm transition-colors hover:border-gold/30"
                >
                  <p className="font-display text-base text-cream">{p.label}</p>
                  <p className="mt-1 text-[0.78rem] font-medium text-gold">{p.cap}</p>
                  <p className="text-[0.72rem] text-cream/60">{p.desc}</p>
                </div>
              ))}
            </div>

            <div data-fade className="mt-10">
              <TLink href="/private-dining" className="btn btn-solid">
                Plan Your Event
              </TLink>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="relative lg:col-span-6">
            {/* Main Room Shot */}
            <div
              data-event-main
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gold/20 bg-ink shadow-2xl"
            >
              <Image
                src="/images/private-room.webp"
                alt="Lulu Modern Private Dining Room"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-md bg-ink/80 px-3 py-1 text-[0.75rem] tracking-wider text-cream backdrop-blur-md">
                The Private Dining Suite
              </div>
            </div>

            {/* Inset Accent Shot */}
            <div
              data-event-accent
              className="hidden sm:block absolute -bottom-8 -left-8 aspect-square w-48 overflow-hidden rounded-xl border-2 border-gold/30 bg-ink shadow-2xl lg:-bottom-10 lg:-left-10 lg:w-56"
            >
              <Image
                src="/images/night-cheers.webp"
                alt="Guests toasting with cocktails"
                fill
                sizes="220px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 text-[0.7rem] font-medium tracking-widest text-gold uppercase">
                Toasts &amp; Moments
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
