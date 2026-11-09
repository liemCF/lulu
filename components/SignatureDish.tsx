"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";

/** Section 2 of the homepage doc: The Signature Experience. Headline, copy and CTA only, as written. */
export default function SignatureDish() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      gsap.to(gsap.utils.selector(root)("[data-lattice]"), { rotate: 4, duration: 6, ease: "power1.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="duck"
      className="relative overflow-clip bg-[radial-gradient(at_bottom_right,var(--color-navy-hi)_0%,var(--color-navy-lo)_45%,var(--color-ink)_100%)] px-5 py-28 text-cream sm:px-10 lg:px-24 lg:py-40"
    >
      <div
        data-lattice
        aria-hidden
        className="pointer-events-none absolute top-0 right-[-8%] h-full w-screen origin-top-right scale-125 bg-gold opacity-[0.08] [mask-image:url(/images/lattice.svg)] [mask-position:center] [mask-size:cover]"
      />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p data-anim="chars" className="kicker">
            The Signature Experience
          </p>
          <h2 data-split className="t-hero mt-6">
            The Dish Everyone Talks About
          </h2>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
          <div data-fade className="space-y-6 text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
            <p>At Lulu Modern, every visit begins with an experience.</p>
            <p>
              Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
              combining tableside theatrics with authentic craftsmanship.
            </p>
            <p className="font-display text-[clamp(1.4rem,2vw,1.9rem)] leading-snug text-gold-soft italic">
              Crispy skin. Hand-carved service. Unforgettable presentation.
            </p>
          </div>
          <div data-fade className="mt-10">
            <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
              Explore the Duck Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
