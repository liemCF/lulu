"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { TLink } from "./PageTransition";

/** Section 5 of the homepage doc: Our Story. Headline, copy and CTA only, as written. */
export default function OurStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q("[data-huge]"), { type: "words" });
      gsap.from(split.words, {
        yPercent: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="relative bg-navy px-5 py-28 text-cream sm:px-10 lg:px-24 lg:py-40">
      <p data-anim="chars" className="kicker text-center">
        Our Story
      </p>
      <h2 data-huge className="t-hero mt-8 text-center lg:text-[6.5vw]">
        Rooted in Culture.
        <br />
        <em className="text-gold-soft">Inspired by Evolution.</em>
      </h2>

      <div className="mx-auto mt-16 max-w-2xl space-y-6 text-center lg:mt-24">
        <p data-anim className="t-h3 text-cream">
          Lulu Modern was born from the Asian American experience.
        </p>
        <div data-fade className="space-y-6 text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
          <p>
            Growing up between cultures taught us that tradition and innovation can exist side by side. Our restaurant
            reflects that belief, bringing together authentic flavors, modern creativity, and a dining experience
            designed to be shared.
          </p>
          <p>This is more than a restaurant.</p>
          <p>It’s our interpretation of what modern Asian hospitality can become.</p>
        </div>
        <div data-fade className="pt-4">
          <TLink href="/about" className="btn text-cream">
            Read Our Story
          </TLink>
        </div>
      </div>
    </section>
  );
}
