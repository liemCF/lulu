"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

type Props = {
  id?: string;
  /** The homepage links on to the About page; the About page itself doesn't need the button. */
  showCta?: boolean;
};

/**
 * Meet the Chef. There is no portrait of Chef Deprez yet, so the photo is one of the kitchen's
 * dishes rather than a person; swap in her portrait here once the restaurant supplies one.
 */
export default function MeetChef({ id = "chef", showCta = true }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-chef-photo]"),
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className="relative overflow-clip bg-ink px-5 py-24 text-cream sm:px-10 lg:px-24 lg:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[1rem_5rem_1rem_5rem] lg:col-span-5">
          <div data-chef-photo className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src="/images/gallery-duck-platter.webp"
              alt="A chef-driven duck platter shared at the table"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p data-anim="chars" className="kicker">
            Meet the Chef
          </p>
          <h2 data-split className="t-h1 mt-6">
            Leading the Next Chapter of Lulu Modern
          </h2>
          <div data-fade className="mt-8 max-w-xl space-y-5 text-[1.05rem] leading-relaxed text-cream/85">
            <p>
              Under the direction of Executive Chef Natalie Deprez, Lulu Modern is entering a new era of culinary
              creativity.
            </p>
            <p>
              Discover a menu that honors tradition while pushing Asian cuisine forward through innovation, premium
              ingredients, and unforgettable presentation.
            </p>
          </div>
          {showCta && (
            <div data-fade className="mt-10">
              <TLink href="/about#chef" className="btn text-cream">
                Meet Our Chef
              </TLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
