"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { links } from "@/lib/content";

const strip = [
  { src: "/images/gallery-spread.webp", label: "Dim sum for the table" },
  { src: "/images/duck-carving.webp", label: "Carved tableside" },
  { src: "/images/night-bar.webp", label: "The back bar" },
  { src: "/images/dish-pickled-fish.webp", label: "Sichuan pickled fish" },
  { src: "/images/night-cheers.webp", label: "Saturday, 11 pm" },
  { src: "/images/dish-short-rib.webp", label: "Short rib, dry ice" },
  { src: "/images/private-table.webp", label: "Private dining" },
];

/**
 * Pinned horizontal strip of photos. Two panels part from the centre to open it,
 * steam drifts past at three speeds, and the heading dissolves as the strip moves.
 */
export default function Panorama() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;
        const split = SplitText.create(q("[data-heading]"), { type: "words,chars" });

        gsap.set(split.chars, { opacity: 0, y: "15%", filter: "blur(10px)" });
        gsap.to(split.chars, {
          opacity: 1,
          y: "0%",
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.04,
          ease: "power1.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
        gsap.to(q("[data-cover]"), { width: "0%", ease: "power1.inOut", duration: 1, scrollTrigger: { trigger: root.current, start: "top 70%" } });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance() * 1.6}`,
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(track, { x: 0 }, { x: () => -distance(), ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-steam='1']"), { left: "-=12%", ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-steam='2']"), { left: "-=24%", ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-steam='3']"), { left: "-=36%", ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-heading]"), { left: "-=10%", ease: "power1.inOut", duration: 1 }, 0)
          .to(split.chars, { opacity: 0, scale: 0.7, filter: "blur(10px)", stagger: 0.04, ease: "power1.inOut", duration: 0.4 }, 0.3);
        ScrollTrigger.refresh();
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-[1] overflow-clip bg-ink">
      <div className="relative flex h-screen w-full items-center max-md:h-auto max-md:flex-col max-md:py-20">
        <div data-cover className="absolute top-0 left-0 z-10 hidden h-full w-1/2 bg-ink md:block" />
        <div data-cover className="absolute top-0 right-0 z-10 hidden h-full w-1/2 bg-ink md:block" />

        <div data-track className="flex h-[78vh] w-max items-center gap-6 pl-[10vw] pr-[10vw] will-change-transform max-md:h-auto max-md:w-full max-md:flex-col max-md:px-5">
          {strip.map((s, i) => (
            <figure key={s.src} className={`relative shrink-0 ${i % 2 ? "h-[62vh] w-[38vh]" : "h-[78vh] w-[56vh]"} max-md:h-[60vh] max-md:w-full`}>
              <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                <Image src={s.src} alt={s.label} fill sizes="(min-width:768px) 40vh, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-xs tracking-[0.18em] text-cream/60 uppercase">{s.label}</figcaption>
            </figure>
          ))}
        </div>

        {/* Steam, three layers at three speeds */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            data-steam={n}
            aria-hidden
            className="pointer-events-none absolute hidden rounded-full bg-[radial-gradient(closest-side,rgba(239,231,214,0.18),transparent)] blur-2xl md:block"
            style={{ left: `${20 + n * 22}%`, top: `${n % 2 ? 10 : 55}%`, width: `${60 - n * 8}vw`, height: `${45 - n * 6}vw` }}
          />
        ))}

        <h2
          data-heading
          className="t-hero pointer-events-none absolute top-24 left-1/2 z-20 w-full -translate-x-1/2 text-center text-cream max-md:static max-md:mb-10 max-md:translate-x-0"
        >
          From the table
        </h2>

        <a
          href={links.instagram}
          target="_blank"
          rel="noreferrer"
          className="t-link absolute right-10 bottom-10 z-20 text-gold max-md:hidden"
        >
          @lulu.modern ↗
        </a>
      </div>
    </section>
  );
}
