"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

// The Instagram feed: food and the room only, no flyers or photos with text on them.
const strip = [
  { src: "/images/duck-torch.webp", label: "Finishing the Flaming Peking Duck with a torch" },
  { src: "/images/night-cocktail.webp", label: "A signature cocktail being poured" },
  { src: "/images/duck-plated.webp", label: "Carved duck with pancakes and condiments" },
  { src: "/images/night-cheers.webp", label: "A table raising a toast" },
  { src: "/images/night-bar.webp", label: "The back bar at night" },
  { src: "/images/story-lulu.webp", label: "Lulu, the muse of the restaurant" },
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
          // Inside each frame the photo drifts against the travel, and the frames sway gently as they pass.
          .fromTo(q("[data-shot]"), { xPercent: 9 }, { xPercent: -9, ease: "none", duration: 1 }, 0)
          .fromTo(
            q("[data-frame]"),
            { rotate: (i: number) => (i % 2 ? -2.5 : 2.5), y: (i: number) => (i % 2 ? 30 : -30) },
            { rotate: (i: number) => (i % 2 ? 2.5 : -2.5), y: (i: number) => (i % 2 ? -30 : 30), ease: "none", duration: 1 },
            0,
          )
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
            <figure
              key={s.src}
              data-frame
              className={`relative shrink-0 ${i % 2 ? "h-[62vh] w-[38vh]" : "h-[78vh] w-[56vh]"} max-md:h-[58svh] max-md:w-[76vw] max-md:snap-center`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cream/10 bg-night">
                <Image
                  data-shot
                  src={s.src}
                  alt={s.label}
                  fill
                  sizes="(min-width:768px) 40vh, 100vw"
                  className="object-cover md:scale-[1.22] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-[0.78rem] font-medium tracking-wide text-cream/90">
                    {s.label}
                  </p>
                </div>
              </div>
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

        <div
          data-heading
          className="absolute top-12 left-0 z-20 w-full text-center text-cream max-md:static max-md:order-first max-md:mb-8 px-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/80 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase backdrop-blur-md mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Instagram Gallery
          </div>
          <h2 className="t-hero text-cream leading-none">
            Atmosphere &amp; <em className="text-gold-soft font-serif italic">Craft</em>
          </h2>
          <div className="mt-3">
            <a
              href="https://www.instagram.com/lulu.modern/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium tracking-[0.16em] text-gold hover:text-cream uppercase transition-colors"
            >
              @lulu.modern · Follow Us ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
