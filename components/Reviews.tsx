"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { press, reviews } from "@/lib/content";

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      setupReveals(root.current!);
      const q = gsap.utils.selector(root);
      const slides = q("[data-slide]");
      const bars = q("[data-bar]");
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });
      if (prefersReducedMotion()) {
        gsap.set(bars[0], { scaleX: 1 });
        return;
      }

      // Each quote arrives word by word out of a soft blur; the gold bar under it fills while it is read.
      const words = slides.map((s) => SplitText.create(s.querySelector("blockquote"), { type: "words" }).words);
      const showWords = (n: number, delay = 0) =>
        gsap.fromTo(
          words[n],
          { opacity: 0, yPercent: 40, filter: "blur(10px)" },
          { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1, stagger: 0.03, ease: "expo.out", delay },
        );

      let i = 0;
      let visible = false;
      let bar: gsap.core.Tween;
      const fill = () => {
        gsap.set(bars, { scaleX: 0 });
        bar = gsap.to(bars[i], { scaleX: 1, duration: 7, ease: "none", onComplete: next, paused: !visible });
      };
      function next() {
        const prev = slides[i];
        i = (i + 1) % slides.length;
        setActive(i);
        gsap.to(prev, { autoAlpha: 0, y: -24, filter: "blur(6px)", duration: 0.7, ease: "power2.in" });
        gsap.set(slides[i], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        showWords(i, 0.55);
        fill();
      }
      gsap.set(words[0], { opacity: 0 });
      fill();

      // Only rotate while the section is on screen; the first quote writes itself in on arrival.
      let started = false;
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (visible && !started) {
              started = true;
              showWords(0);
            }
            bar.paused(!visible);
          },
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-night px-5 py-28 sm:px-10 lg:py-36 lg:pl-24">
      <div>
        <p data-fade className="eyebrow mb-4">
          Featured Recognition
        </p>
        <h2 data-split className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-none">
          What People Are Saying
        </h2>
      </div>

      {/* Media mentions: the press row the doc asks for, above the guest reviews */}
      {press.length > 0 && (
        <div data-fade className="mt-14 border-y border-gold/15 py-8">
          <p className="eyebrow mb-6">Media mentions</p>
          <ul className="grid gap-8 sm:grid-cols-3">
            {press.map((p) => (
              <li key={p.outlet}>
                <a href={p.url} target="_blank" rel="noreferrer" className="group block">
                  <span className="font-display text-[1.6rem] leading-none text-cream transition-colors group-hover:text-gold">
                    {p.outlet}
                  </span>
                  {p.headline && (
                    <span className="mt-3 block text-[0.95rem] leading-snug text-cream/65">
                      “{p.headline}” <span className="text-gold">↗</span>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p data-fade className="eyebrow mt-14">Guest testimonials</p>
      <div className="relative mt-8 grid min-h-[16rem] sm:min-h-[14rem]">
        {reviews.map((r) => (
          <figure key={r.author} data-slide className="col-start-1 row-start-1 max-w-5xl">
            <blockquote className="font-display text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.15]">
              <span className="text-gold">“</span>
              {r.text}
              <span className="text-gold">”</span>
            </blockquote>
            <figcaption className="mt-8 text-[0.8rem] font-medium tracking-[0.14em] text-cream/65 uppercase">
              {r.author} · Google
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex gap-2" aria-hidden>
        {reviews.map((r, i) => (
          <span
            key={r.author}
            className={`relative h-px overflow-hidden bg-cream/20 transition-[width] duration-700 ${i === active ? "w-16" : "w-6"}`}
          >
            <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-gold" />
          </span>
        ))}
      </div>
    </section>
  );
}
