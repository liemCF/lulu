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
      const css = getComputedStyle(document.documentElement);

      // The room deepens from the chef's ink into story navy as the section scrolls in.
      gsap.fromTo(
        root.current,
        { backgroundColor: css.getPropertyValue("--color-ink").trim() },
        {
          backgroundColor: css.getPropertyValue("--color-navy").trim(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 35%", scrub: true },
        },
      );

      const split = SplitText.create(q("[data-huge]"), { type: "words" });
      gsap.from(split.words, {
        yPercent: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      // The story is read line by line: each line lights up as it reaches the middle of the screen.
      SplitText.create(q("[data-read] p"), {
        type: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.lines,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.5,
              scrollTrigger: { trigger: q("[data-read]")[0], start: "top 78%", end: "bottom 52%", scrub: true },
            },
          );
        },
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

      <div data-read className="mx-auto mt-16 max-w-2xl space-y-6 text-center lg:mt-24">
        <p className="t-h3 text-cream">Lulu Modern was born from the Asian American experience.</p>
        <p className="text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
          Growing up between cultures taught us that tradition and innovation can exist side by side. Our restaurant
          reflects that belief, bringing together authentic flavors, modern creativity, and a dining experience designed
          to be shared.
        </p>
        <p className="text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">This is more than a restaurant.</p>
        <p className="text-[1.1rem] leading-relaxed text-cream/85 lg:text-[1.2rem]">
          It’s our interpretation of what modern Asian hospitality can become.
        </p>
      </div>
      <div data-fade className="mt-10 text-center">
        <TLink href="/about" className="btn text-cream">
          Read Our Story
        </TLink>
      </div>
    </section>
  );
}
