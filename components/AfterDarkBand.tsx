"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

/** Full-bleed night photo: the whole section wipes open from the right, then a framed photo follows. */
export default function AfterDarkBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: q("[data-trigger]")[0], scrub: true } })
        .to(q("[data-bg]"), { top: "+=20rem", ease: "power1.inOut" })
        .to(q("[data-card-img]"), { top: "+=10rem", ease: "power1.inOut" }, "<");
      gsap
        .timeline({ scrollTrigger: { trigger: q("[data-trigger]")[0], start: "top 70%" } })
        .fromTo(q("[data-trigger]"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-bg]"), { scale: 1.1 }, { scale: 1, duration: 1.7, ease: "power2.inOut" }, 0);
      gsap.fromTo(
        q("[data-card]"),
        { clipPath: "inset(0% 100% 0% 0%)", scale: 1.1 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, delay: 1.3, ease: "power2.inOut", scrollTrigger: { trigger: q("[data-card]")[0] } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="after-dark" className="relative z-[1]">
      <div data-trigger className="relative flex min-h-screen w-full items-stretch overflow-clip text-cream">
        <div data-bg className="absolute top-1/3 h-[calc(100%+20rem)] w-full -translate-y-1/2">
          <Image src="/images/night-sparklers.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_40%]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-ink/60" />

        <div className="relative z-[1] flex w-full items-stretch gap-10 px-5 sm:px-10 max-lg:flex-col lg:px-24">
          <div className="pt-28 lg:w-1/3">
            <div data-card className="relative aspect-[1.43/1] w-full overflow-hidden rounded-[1.25rem]">
              <div data-card-img className="absolute -top-24 left-1/2 h-[150%] w-[150%] -translate-x-1/2">
                <Image src="/images/night-cocktail.webp" alt="A bartender pouring a cocktail" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-end justify-between gap-16 pb-20 lg:py-28">
            {/* DRAFT copy */}
            <p data-anim className="max-w-md text-lg leading-snug text-cream/90 lg:w-1/2">
              Fridays until 11:30 pm, Saturdays until midnight. Top-shelf cocktails, champagne by the bottle, and a
              room full of birthdays that never wants to go home.
            </p>
            <div className="flex flex-col items-end gap-8">
              <h2 data-anim="chars" className="t-hero text-right">
                After dark
              </h2>
              <TLink href="/menu" className="t-link text-gold">
                The late-night menu
              </TLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
