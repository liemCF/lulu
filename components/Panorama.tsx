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
  { src: "/images/night-energy.webp", label: "Late nights" },
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

        gsap.set(split.chars, { opacity: 0, y: "15%" });
        gsap.to(split.chars, {
          opacity: 1,
          y: "0%",
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
          .to(q("[data-steam='1']"), { xPercent: -25, ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-steam='2']"), { xPercent: -55, ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-steam='3']"), { xPercent: -90, ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-heading]"), { x: () => -window.innerWidth * 0.1, ease: "power1.inOut", duration: 1 }, 0)
          .to(split.chars, { opacity: 0, y: "-10%", stagger: 0.04, ease: "power1.inOut", duration: 0.4 }, 0.3);
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

        <div data-track className="flex h-[78vh] w-max items-center gap-6 pl-[10vw] pr-[10vw] will-change-transform max-md:h-auto max-md:w-full max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-5 max-md:[scrollbar-width:none]">
          {strip.map((s, i) => (
            <figure key={s.src} className={`relative shrink-0 ${i % 2 ? "h-[62vh] w-[38vh]" : "h-[78vh] w-[56vh]"} max-md:h-[62svh] max-md:w-[78vw] max-md:snap-center`}>
              <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                <Image src={s.src} alt={s.label} fill sizes="(min-width:768px) 40vh, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-[0.8rem] font-medium tracking-[0.14em] text-cream/70 uppercase">{s.label}</figcaption>
            </figure>
          ))}
        </div>

        {/* Steam, three layers at three speeds */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            data-steam={n}
            aria-hidden
            className="pointer-events-none absolute hidden rounded-full bg-[radial-gradient(closest-side,rgba(239,231,214,0.14),transparent)] md:block"
            style={{ left: `${20 + n * 22}%`, top: `${n % 2 ? 10 : 55}%`, width: `${60 - n * 8}vw`, height: `${45 - n * 6}vw` }}
          />
        ))}

        <h2
          data-heading
          className="t-hero pointer-events-none absolute top-24 left-0 z-20 w-full text-center text-cream max-md:static max-md:order-first max-md:mb-10"
        >
          From the table
        </h2>

        <a
          href={links.instagram}
          target="_blank"
          rel="noreferrer"
          className="t-link absolute right-10 bottom-10 z-20 text-gold max-md:static max-md:mt-10"
        >
          @lulu.modern ↗
        </a>
      </div>
    </section>
  );
}
