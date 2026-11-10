"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import LoopVideo from "./LoopVideo";
import Scene from "./Scene";

// "Beautiful food photography featuring multiple dishes across the menu." Photos only: the doc gives no captions or CTA here.
const plates: { src: string; name: string; video?: string }[] = [
  { src: "/images/dish-peking-duck.webp", name: "Whole Peking Duck" },
  { src: "/images/dish-wagyu-xlb.webp", name: "Wagyu XLB" },
  { src: "/images/dish-sichuan-chicken.webp", name: "Sichuan Crispy Chicken" },
  { src: "/images/dish-pickled-fish.webp", name: "Sichuan Pickled Fish", video: "/video/fish-tile.mp4" },
  { src: "/images/dish-pork-xlb.webp", name: "Traditional Pork XLB", video: "/video/steam-tile.mp4" },
  { src: "/images/dish-wok.webp", name: "Wok-tossed beef" },
];

/** Section 3 of the homepage doc: New Asian Menu. */
export default function MenuShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // The plates are laid out one by one, each unveiled from the bottom as its photo settles.
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-plates]")[0], start: "top 88%" } });
      tl.fromTo(
        q("[data-plate]"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.09, ease: "expo.inOut" },
      ).fromTo(q("[data-plate] img"), { scale: 1.35 }, { scale: 1, duration: 1.9, stagger: 0.09, ease: "expo.out" }, 0.1);
    },
    { scope: root },
  );

  return (
    <Scene
      ref={root}
      id="menu"
      desktop={{ src: "/images/film-feast-wide.webp", focus: [0.5, 0.5] }}
      mobile={{ src: "/images/film-feast-tall.webp", focus: [0.5, 0.5] }}
      alt="A table laid with dishes from across the Lulu Modern menu"
      video={{ desktop: "/video/feast-wide.mp4", mobile: "/video/feast-tall.mp4" }}
      dim={0.42}
      shade="left"
    >
      <div className="grid gap-y-10 pt-[26svh] pb-14 lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:px-[clamp(1.25rem,5vw,7rem)] lg:pb-24">
        <div className="max-lg:px-5 lg:col-span-6">
          <p data-fade className="scene-label">
            <span>03</span>New Asian Menu
          </p>
          <h2 data-split className="t-scene mt-6">
            Inspired by Asia. Designed for Today.
          </h2>
          <div data-fade className="scene-copy mt-7 max-w-[34rem] space-y-4">
            <p>
              Lulu Modern celebrates the flavors, traditions, and culinary techniques found across Asia while honoring
              the roots that inspired our journey.
            </p>
            <p>
              From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
              quality ingredients, bold flavors, and elevated hospitality.
            </p>
          </div>
        </div>

        {/* A contact sheet of plates: a swipe row on phones, a 3 by 2 grid on wide screens */}
        <div
          data-plates
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 [scrollbar-width:none] lg:col-span-5 lg:col-start-8 lg:grid lg:grid-cols-3 lg:gap-2.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {plates.map((p) => (
            <figure
              key={p.src}
              data-plate
              className="relative aspect-[3/4] w-[38vw] shrink-0 snap-start overflow-hidden bg-night sm:w-[24vw] lg:w-auto"
            >
              <Image src={p.src} alt={p.name} fill sizes="(min-width: 1024px) 14vw, 38vw" className="object-cover" />
              {/* Some plates are alive: the dumplings steam, the fish pot simmers */}
              {p.video && <LoopVideo src={p.video} />}
            </figure>
          ))}
        </div>
      </div>
    </Scene>
  );
}
