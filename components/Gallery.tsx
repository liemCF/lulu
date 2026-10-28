"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { gallery, links } from "@/lib/content";
import { TLink } from "./PageTransition";

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      q("[data-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -25 : 0 },
          {
            xPercent: i % 2 ? 0 : -25,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const rows = [gallery.slice(0, 4).concat(gallery.slice(0, 2)), gallery.slice(4).concat(gallery.slice(4, 6))];

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-28 lg:py-36">
      <div className="flex flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:pl-24">
        <div>
          <p data-fade className="eyebrow mb-4">
            Instagram Gallery
          </p>
          <h2 data-split className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-none">
            Follow the <em className="gold-foil">Experience</em>
          </h2>
          <p data-fade className="mt-5 max-w-md text-cream/60">
            Explore new dishes, behind-the-scenes moments, chef features, and signature tableside presentations.
          </p>
        </div>
        <div data-fade className="flex flex-wrap gap-3 self-start sm:self-auto">
          <TLink href="/gallery" className="btn btn-solid">
            View the Gallery
          </TLink>
          <a href={links.instagram} target="_blank" rel="noreferrer" className="btn text-cream">
            @lulu.modern ↗
          </a>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 lg:gap-6">
        {rows.map((row, r) => (
          <div key={r} data-row className="flex w-max gap-4 will-change-transform lg:gap-6">
            {row.map((g, i) => (
              <a
                key={`${g.src}-${i}`}
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor="View"
                className="group relative h-[34vw] w-[46vw] shrink-0 overflow-hidden sm:h-[24vw] sm:w-[32vw] lg:h-[19vw] lg:w-[26vw]"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width:1024px) 26vw, 46vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
