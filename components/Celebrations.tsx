"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

/** Section 7 of the homepage doc: Private Dining & Celebrations. Headline, copy and CTA only, as written. */
export default function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => setupReveals(root.current!), { scope: root });

  return (
    <section ref={root} id="private" className="relative bg-ink px-5 py-28 text-cream sm:px-10 lg:px-24 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p data-anim="chars" className="kicker">
            Private Dining &amp; Celebrations
          </p>
          <h2 data-split className="t-hero mt-6">
            Celebrations Deserve Something Extraordinary
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
          <p data-fade className="text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
            From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
            dining experiences for every occasion.
          </p>
          <div data-fade className="mt-10">
            <TLink href="/private-dining" className="btn btn-solid">
              Plan Your Event
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
