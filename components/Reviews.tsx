"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { reviews } from "@/lib/content";

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      setupReveals(root.current!);
      const q = gsap.utils.selector(root);
      const slides = q("[data-slide]");
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      let i = 0;
      const next = () => {
        const prev = slides[i];
        i = (i + 1) % slides.length;
        setActive(i);
        gsap.to(prev, { autoAlpha: 0, y: -20, duration: 0.8, ease: "power2.in" });
        gsap.fromTo(slides[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.6, ease: "expo.out" });
      };
      const timer = gsap.timeline({ repeat: -1 }).to({}, { duration: 6 }).call(next);
      // Only rotate while the section is on screen.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => timer.paused(!self.isActive),
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-night px-5 py-28 sm:px-10 lg:py-36 lg:pl-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p data-fade className="eyebrow mb-4">
            Featured Recognition
          </p>
          <h2 data-split className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-none">
            What People Are Saying
          </h2>
        </div>
        <div data-fade className="flex items-center gap-4">
          <span className="gold-foil font-display text-3xl italic">Excellent</span>
          <span className="text-sm text-cream/60">Based on 529 Google reviews</span>
        </div>
      </div>

      <div className="relative mt-16 grid min-h-[16rem] sm:min-h-[14rem]">
        {reviews.map((r) => (
          <figure key={r.author} data-slide className="col-start-1 row-start-1 max-w-5xl">
            <blockquote className="font-display text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.15]">
              <span className="text-gold">“</span>
              {r.text}
              <span className="text-gold">”</span>
            </blockquote>
            <figcaption className="mt-8 text-xs tracking-[0.3em] text-cream/50 uppercase">
              {r.author} · Google
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex gap-2" aria-hidden>
        {reviews.map((r, i) => (
          <span
            key={r.author}
            className={`h-px transition-all duration-700 ${i === active ? "w-14 bg-gold" : "w-6 bg-cream/20"}`}
          />
        ))}
      </div>
    </section>
  );
}
