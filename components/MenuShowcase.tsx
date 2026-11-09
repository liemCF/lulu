"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion, setupReveals } from "@/lib/reveal";

// "Beautiful food photography featuring multiple dishes across the menu."
const plates = [
  { src: "/images/dish-peking-duck.webp", name: "Whole Peking Duck", cls: "col-span-2 row-span-2 lg:col-span-5 lg:row-span-2" },
  { src: "/images/dish-wagyu-xlb.webp", name: "Wagyu XLB", cls: "lg:col-span-4" },
  { src: "/images/dish-sichuan-chicken.webp", name: "Sichuan Crispy Chicken", cls: "lg:col-span-3" },
  { src: "/images/dish-short-rib.webp", name: "Beef Short Rib", cls: "lg:col-span-3" },
  { src: "/images/dish-pickled-fish.webp", name: "Sichuan Pickled Fish", cls: "lg:col-span-4" },
  { src: "/images/dish-pork-xlb.webp", name: "Traditional Pork XLB", cls: "max-lg:hidden lg:col-span-4" },
  { src: "/images/gallery-spread.webp", name: "Dim sum for the table", cls: "max-lg:hidden lg:col-span-4" },
  { src: "/images/dish-wok.webp", name: "Wok-tossed beef", cls: "max-lg:hidden lg:col-span-4" },
];

/** Section 3 of the homepage doc: New Asian Menu. */
export default function MenuShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // Tiles open like curtains, alternating from above and below, while each photo settles from a close crop.
      const reveal = gsap.timeline({ scrollTrigger: { trigger: q("[data-plates]")[0], start: "top 80%" } });
      reveal
        .fromTo(
          q("[data-plate]"),
          { clipPath: (i: number) => (i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)") },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.09, ease: "expo.inOut" },
        )
        .from(q("[data-plate] img"), { scale: 1.35, duration: 1.8, stagger: 0.09, ease: "expo.out" }, 0.25);
      if (prefersCalmMotion()) return;
      gsap.fromTo(
        q("[data-plate] img"),
        { yPercent: -5 },
        { yPercent: 5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="menu" className="relative bg-paper px-5 py-24 text-ink sm:px-10 lg:px-24 lg:py-36">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p data-anim="chars" className="kicker !text-[var(--color-gold-deep)]">
            New Asian Menu
          </p>
          <h2 data-split className="t-h1 mt-6">
            Inspired by Asia. Designed for Today.
          </h2>
        </div>
        <div data-fade className="space-y-5 text-[1.05rem] leading-relaxed text-ink/80 lg:col-span-5 lg:col-start-8">
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

      <div data-plates className="mt-16 grid auto-rows-[44vw] grid-cols-2 gap-3 sm:auto-rows-[30vw] lg:mt-24 lg:auto-rows-[17vw] lg:grid-cols-12 lg:gap-4">
        {plates.map((p) => (
          <figure key={p.src} data-plate className={`group relative overflow-hidden rounded-[0.75rem] ${p.cls}`}>
            <Image
              src={p.src}
              alt={p.name}
              fill
              sizes="(min-width:1024px) 40vw, 50vw"
              className="scale-[1.1] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.16]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
