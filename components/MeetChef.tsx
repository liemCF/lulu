"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

type Props = {
  id?: string;
  /** The homepage links on to the About page; the About page itself doesn't need the button. */
  showCta?: boolean;
};

/** Section 4 of the homepage doc: Meet the Chef. Headline, copy and CTA only, as written. */
export default function MeetChef({ id = "chef", showCta = true }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => setupReveals(root.current!), { scope: root });

  return (
    <section ref={root} id={id} className="relative bg-ink px-5 py-28 text-cream sm:px-10 lg:px-24 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p data-anim="chars" className="kicker">
            Meet the Chef
          </p>
          <h2 data-split className="t-hero mt-6">
            Leading the Next Chapter of Lulu Modern
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
          <div data-fade className="space-y-6 text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
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
