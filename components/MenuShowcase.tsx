"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion, setupReveals } from "@/lib/reveal";

// "Beautiful food photography featuring multiple dishes across the menu." Photos only, as the doc gives no captions or CTA here.
const plates = [
  { src: "/images/dish-peking-duck.webp", name: "Whole Peking Duck", cls: "col-span-2 row-span-2 lg:col-span-6 lg:row-span-2" },
  { src: "/images/dish-wagyu-xlb.webp", name: "Wagyu XLB", cls: "col-span-1 lg:col-span-3" },
  { src: "/images/dish-sichuan-chicken.webp", name: "Sichuan Crispy Chicken", cls: "col-span-1 lg:col-span-3" },
  { src: "/images/dish-short-rib.webp", name: "Beef Short Rib", cls: "col-span-1 lg:col-span-3" },
  { src: "/images/dish-pickled-fish.webp", name: "Sichuan Pickled Fish", cls: "col-span-1 lg:col-span-3" },
  { src: "/images/dish-pork-xlb.webp", name: "Traditional Pork XLB", cls: "col-span-1 lg:col-span-4" },
  { src: "/images/gallery-spread.webp", name: "Dim sum for the table", cls: "col-span-1 lg:col-span-4" },
  { src: "/images/dish-wok.webp", name: "Wok-tossed beef", cls: "col-span-2 lg:col-span-4" },
];

/** Section 3 of the homepage doc: New Asian Menu. */
export default function MenuShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Tiles open with smooth curtain reveals
      const reveal = gsap.timeline({ scrollTrigger: { trigger: q("[data-plates]")[0], start: "top 80%" } });
      reveal
        .fromTo(
          q("[data-plate]"),
          { clipPath: (i: number) => (i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)"), opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, stagger: 0.08, ease: "expo.inOut" },
        )
        .from(q("[data-plate] img"), { scale: 1.25, duration: 1.6, stagger: 0.08, ease: "expo.out" }, 0.2);

      if (prefersCalmMotion()) return;
      gsap.fromTo(
        q("[data-plate] img"),
        { yPercent: -4 },
        { yPercent: 4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="menu" className="relative bg-paper px-5 py-24 text-ink sm:px-10 lg:px-20 lg:py-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-deep/20 bg-gold-deep/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold-deep uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" />
              New Asian Menu
            </div>
            <h2 data-split className="t-h1 mt-5 text-ink">
              Inspired by Asia. <br className="hidden sm:inline" />
              <em className="text-gold-deep font-serif italic">Designed for Today.</em>
            </h2>
          </div>

          <div data-fade className="space-y-4 text-[1.05rem] leading-relaxed text-ink/80 lg:col-span-6 lg:pl-6">
            <p>
              Lulu Modern celebrates the flavors, traditions, and culinary techniques found across Asia while honoring the
              roots that inspired our journey.
            </p>
            <p>
              From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
              quality ingredients, bold flavors, and elevated hospitality.
            </p>
          </div>
        </div>

        {/* Editorial Culinary Lookbook Grid */}
        <div
          data-plates
          className="mt-14 grid auto-rows-[42vw] grid-cols-2 gap-3 sm:auto-rows-[28vw] lg:mt-20 lg:auto-rows-[16vw] lg:grid-cols-12 lg:gap-4"
        >
          {plates.map((p) => (
            <figure
              key={p.src}
              data-plate
              className={`group relative overflow-hidden rounded-2xl bg-ink/10 shadow-md ${p.cls}`}
            >
              <Image
                src={p.src}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
