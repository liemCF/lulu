"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { press, reviews } from "@/lib/content";

/** Section 6 of the homepage doc: What People Are Saying. */
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

      // Each quote arrives word by word out of a soft blur
      const words = slides.map((s) => SplitText.create(s.querySelector("blockquote"), { type: "words" }).words);
      const showWords = (n: number, delay = 0) =>
        gsap.fromTo(
          words[n],
          { opacity: 0, yPercent: 30, filter: "blur(8px)" },
          { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "expo.out", delay },
        );

      let i = 0;
      let visible = false;
      let bar: gsap.core.Tween;
      const fill = () => {
        gsap.set(bars, { scaleX: 0 });
        bar = gsap.to(bars[i], { scaleX: 1, duration: 6.5, ease: "none", onComplete: next, paused: !visible });
      };
      function next() {
        const prev = slides[i];
        i = (i + 1) % slides.length;
        setActive(i);
        gsap.to(prev, { autoAlpha: 0, y: -20, filter: "blur(6px)", duration: 0.6, ease: "power2.in" });
        gsap.set(slides[i], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        showWords(i, 0.4);
        fill();
      }
      gsap.set(words[0], { opacity: 0 });
      fill();

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
            bar?.paused(!visible);
          },
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-night px-5 py-24 sm:px-10 lg:px-20 lg:py-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Featured Recognition
          </div>
          <h2 data-split className="t-hero mt-5 text-cream">
            What People <br className="hidden sm:inline" />
            <em className="text-gold-soft font-serif italic">Are Saying</em>
          </h2>
        </div>

        {/* Media mentions */}
        {press.length > 0 && (
          <div data-fade className="mt-14 rounded-2xl border border-cream/10 bg-ink/40 p-6 sm:p-8">
            <p className="eyebrow mb-6 text-gold">Press &amp; Media Coverage</p>
            <ul className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {press.map((p) => (
                <li key={p.outlet} className="group border-t border-cream/10 pt-4 sm:border-t-0 sm:pt-0">
                  <a href={p.url} target="_blank" rel="noreferrer" className="block">
                    <span className="font-display text-xl text-cream transition-colors group-hover:text-gold flex items-center gap-1.5">
                      {p.outlet}
                      <span className="text-xs text-gold opacity-75">↗</span>
                    </span>
                    {p.headline && (
                      <span className="mt-2 block text-[0.88rem] leading-snug text-cream/70 group-hover:text-cream/90 transition-colors">
                        “{p.headline}”
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Guest testimonials quote slider */}
        <div className="mt-16 sm:mt-20">
          <p data-fade className="eyebrow mb-6 text-gold">Guest Dining Experiences</p>
          <div className="relative grid min-h-[16rem] sm:min-h-[13rem]">
            {reviews.map((r) => (
              <figure key={r.author} data-slide className="col-start-1 row-start-1 max-w-4xl">
                <div className="mb-4 text-gold flex gap-1">
                  {"★★★★★".split("").map((star, idx) => (
                    <span key={idx} className="text-sm">{star}</span>
                  ))}
                </div>
                <blockquote className="font-display text-[clamp(1.5rem,3.2vw,2.8rem)] leading-[1.2] text-cream">
                  <span className="text-gold">“</span>
                  {r.text}
                  <span className="text-gold">”</span>
                </blockquote>
                <figcaption className="mt-6 text-[0.8rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                  {r.author} · <span className="text-gold">Verified Diner</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="mt-8 flex gap-2" aria-hidden>
            {reviews.map((r, i) => (
              <span
                key={r.author}
                className={`relative h-1 rounded-full overflow-hidden bg-cream/15 transition-[width] duration-700 ${i === active ? "w-14" : "w-5"}`}
              >
                <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-gold" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
