"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

// "Beautiful food photography featuring multiple dishes across the menu."
const plates = [
  {
    src: "/images/dish-peking-duck.webp",
    name: "Whole Peking Duck",
    cn: "北京烤鸭",
    category: "Signature Experience",
    desc: "Lacquered, roasted and flambéed tableside with homemade pancakes.",
    cls: "col-span-2 row-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    src: "/images/dish-wagyu-xlb.webp",
    name: "Wagyu XLB",
    cn: "和牛小笼",
    category: "Handmade Dim Sum",
    desc: "A5 Wagyu beef & mushroom in rich ginger-infused broth.",
    cls: "col-span-1 lg:col-span-3",
  },
  {
    src: "/images/dish-sichuan-chicken.webp",
    name: "Sichuan Crispy Chicken",
    cn: "辣子鸡",
    category: "Wok Specialties",
    desc: "Golden crispy chicken tossed with fragrant chilies & numbing Sichuan peppercorn.",
    cls: "col-span-1 lg:col-span-3",
  },
  {
    src: "/images/dish-short-rib.webp",
    name: "Beef Short Rib",
    cn: "秘制牛排",
    category: "Chef Entrées",
    desc: "Slow-braised tender short rib served with tableside dry-ice mist.",
    cls: "col-span-1 lg:col-span-3",
  },
  {
    src: "/images/dish-pickled-fish.webp",
    name: "Sichuan Pickled Fish",
    cn: "老坛酸菜鱼",
    category: "Regional Classics",
    desc: "Black fish poached in tangy, aromatic pickled-mustard broth.",
    cls: "col-span-1 lg:col-span-3",
  },
  {
    src: "/images/dish-pork-xlb.webp",
    name: "Traditional Pork XLB",
    cn: "江南小笼包",
    category: "Dim Sum",
    desc: "Artisanal soup dumplings with black vinegar & julienned ginger.",
    cls: "col-span-1 lg:col-span-4",
  },
  {
    src: "/images/gallery-spread.webp",
    name: "Dim Sum Table Feast",
    cn: "点心全席",
    category: "Shared Dining",
    desc: "The complete Lulu Modern dim sum and cocktail spread.",
    cls: "col-span-1 lg:col-span-4",
  },
  {
    src: "/images/dish-wok.webp",
    name: "Wok-Tossed Wagyu Beef",
    cn: "镬气和牛",
    category: "Flame Wok",
    desc: "High-heat wok-seared beef with scallions and garlic chives.",
    cls: "col-span-2 lg:col-span-4",
  },
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
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity duration-500" />

              {/* Chinese Calligraphy Accent Badge */}
              <div className="absolute top-3 right-3 rounded bg-ink/70 px-2 py-0.5 font-serif text-[0.75rem] tracking-wider text-gold-soft backdrop-blur-md">
                {p.cn}
              </div>

              {/* Dish Metadata Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="text-[0.68rem] font-medium tracking-[0.16em] text-gold uppercase">
                  {p.category}
                </span>
                <h3 className="font-display text-lg sm:text-xl text-cream leading-snug">
                  {p.name}
                </h3>
                <p className="mt-1 hidden text-[0.82rem] leading-normal text-cream/75 sm:line-clamp-2">
                  {p.desc}
                </p>
              </div>
            </figure>
          ))}
        </div>

        {/* Menu Navigation CTA */}
        <div data-fade className="mt-12 text-center lg:mt-16">
          <TLink href="/menu" className="btn btn-solid shadow-md">
            Explore Full Menu &amp; Cocktails
          </TLink>
        </div>
      </div>
    </section>
  );
}
