"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";

/** Section 2 of the homepage doc: "The Dish Everyone Talks About", all on one screen with its button. */
export default function SignatureDish() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion() || prefersCalmMotion()) return;
      const q = gsap.utils.selector(root);
      const scrub = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(q("[data-sd-main] img"), { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: scrub });
      gsap.fromTo(q("[data-sd-inset]"), { y: "4rem" }, { y: "-4rem", ease: "none", scrollTrigger: scrub });
      gsap.to(q("[data-lattice]"), { rotate: 4, duration: 6, ease: "power1.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="duck"
      className="relative overflow-clip bg-[radial-gradient(at_bottom_right,var(--color-navy-hi)_0%,var(--color-navy-lo)_45%,var(--color-ink)_100%)] px-5 py-24 text-cream sm:px-10 lg:px-24 lg:py-36"
    >
      <div
        data-lattice
        aria-hidden
        className="pointer-events-none absolute top-0 right-[-8%] h-full w-screen origin-top-right scale-125 bg-gold opacity-[0.1] [mask-image:url(/images/lattice.svg)] [mask-position:center] [mask-size:cover]"
      />

      <div className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-anim="chars" className="kicker">
            The Signature Experience
          </p>
          <h2 data-split className="t-h1 mt-6">
            The Dish Everyone Talks About
          </h2>
          <div data-fade className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-cream/85 lg:text-[1.1rem]">
            <p className="t-h3 text-cream">At Lulu Modern, every visit begins with an experience.</p>
            <p>
              Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
              combining tableside theatrics with authentic craftsmanship.
            </p>
          </div>
          <p data-fade className="mt-10 border-l border-gold/50 pl-5 font-display text-[clamp(1.4rem,2vw,1.9rem)] leading-snug text-gold-soft italic">
            Crispy skin.
            <br />
            Hand-carved service.
            <br />
            Unforgettable presentation.
          </p>
          <div data-fade className="mt-10">
            <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
              Explore the Duck Experience
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6 lg:pl-10">
          <div data-clip data-sd-main className="relative aspect-[4/3] overflow-hidden rounded-[1rem_6rem_1rem_6rem]">
            <Image
              src="/images/duck-neon.webp"
              alt="The Flaming Peking Duck set alight at the table"
              fill
              sizes="(min-width:1024px) 52vw, 100vw"
              className="scale-[1.12] object-cover"
            />
          </div>
          <div
            data-sd-inset
            className="relative -mt-24 ml-auto w-[46%] max-w-[17rem] overflow-hidden rounded-[3rem_1rem_3rem_1rem] border-4 border-ink shadow-[0_30px_80px_rgba(0,0,0,0.5)] lg:absolute lg:-bottom-16 lg:-left-6 lg:mt-0 lg:ml-0"
          >
            <div className="relative aspect-[3/4]">
              <Image src="/images/duck-carving.webp" alt="Peking duck carved by hand" fill sizes="18rem" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
