"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { info, links } from "@/lib/content";
import Scene from "./Scene";

// "Large, clean feed": the duck, chef moments, the room, cocktails, guests celebrating. No graphics or flyers.
const feed = [
  { src: "/images/duck-plated.webp", alt: "Carved Peking duck with pancakes and condiments" },
  { src: "/images/duck-chef-flame.webp", alt: "The chef setting the Peking duck alight" },
  { src: "/images/film-party-wide.webp", alt: "A table celebrating with sparkler candles" },
  { src: "/images/night-cocktail.webp", alt: "A signature cocktail being poured" },
  { src: "/images/duck-torch.webp", alt: "The Peking duck finished with a torch" },
  { src: "/images/night-bar.webp", alt: "The back bar at night" },
];

/** Section 8 of the homepage doc: Instagram Gallery. A large, clean feed. */
export default function Panorama() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-feed]")[0], start: "top 86%" } });
      tl.fromTo(
        q("[data-tile]"),
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.08, ease: "expo.inOut" },
      ).fromTo(q("[data-tile-img]"), { scale: 1.3 }, { scale: 1, duration: 1.8, stagger: 0.08, ease: "expo.out" }, 0.1);
    },
    { scope: root },
  );

  return (
    <Scene
      ref={root}
      desktop={{ src: "/images/film-plated-wide.webp", focus: [0.5, 0.5] }}
      mobile={{ src: "/images/film-pour-tall.webp", focus: [0.5, 0.5] }}
      alt="A table raising a toast at Lulu Modern"
      video={{ desktop: "/video/plated-wide.mp4", mobile: "/video/pour-tall.mp4" }}
      dim={0.8}
      shade="full"
    >
      <div className="shell pt-28 pb-14 lg:pt-36 lg:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p data-fade className="scene-label">
              <span>08</span>Instagram Gallery
            </p>
            <h2 data-split className="t-scene mt-6">
              Follow the Experience
            </h2>
            <p data-fade className="scene-copy mt-6 max-w-[36rem]">
              Explore new dishes, behind-the-scenes moments, chef features, special events, and signature tableside
              presentations.
            </p>
          </div>
          <a href={links.instagram} target="_blank" rel="noreferrer" data-fade className="t-link py-2 text-cream">
            {info.instagram} · Follow Us ↗
          </a>
        </div>

        <div data-feed className="mt-10 grid grid-cols-2 gap-2 lg:mt-14 lg:grid-cols-3 lg:gap-3">
          {feed.map((s) => (
            <a
              key={s.src}
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              data-tile
              data-cursor="Follow"
              aria-label={`${s.alt}. Open Lulu Modern on Instagram`}
              className="group relative block aspect-square overflow-hidden bg-night lg:aspect-[3/2]"
            >
              <div data-tile-img className="absolute inset-0">
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </Scene>
  );
}
