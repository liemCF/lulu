"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { press, reviews } from "@/lib/content";
import Scene from "./Scene";

type Props = {
  /** On the homepage this is one of the full-screen scenes; on the Press page it is a plain section. */
  scene?: boolean;
  /** The Press page already carries this heading in its header. */
  heading?: boolean;
};

/** Section 6 of the homepage doc: A Dallas-Fort Worth Favorite (featured press and guest reviews). */
export default function Reviews({ scene = false, heading = true }: Props) {
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
        // No rotation: lay every quote out one under another so all of them can be read.
        gsap.set(slides, { autoAlpha: 1, gridRowStart: "auto" });
        gsap.set(q("[data-bars]"), { display: "none" });
        return;
      }

      // Each quote arrives word by word out of a soft blur; the gold bar under it fills while it is read.
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
          trigger: q("[data-quotes]")[0],
          start: "top 80%",
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

      gsap.from(q("[data-press-row]"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-press]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  const body = (
      <div className={`shell grid gap-x-10 gap-y-12 lg:grid-cols-12 lg:gap-y-16 ${scene ? "pt-32 pb-14 lg:pt-40 lg:pb-24" : ""}`}>
        {heading && (
          <div className="lg:col-span-7">
            <p data-fade className="scene-label">
              <span>06</span>Featured Recognition
            </p>
            <h2 data-split className="t-scene mt-6">
              A Dallas-Fort Worth Favorite
            </h2>
            <div data-fade className="scene-copy mt-7 max-w-[36rem] space-y-4">
              <p>
                Known for its signature Flaming Peking Duck, elevated hospitality, and modern approach to Asian
                cuisine, Lulu Modern continues to become one of the region’s most talked-about dining destinations.
              </p>
              <p>
                As we grow, our mission remains the same: create experiences worth celebrating, sharing, and
                returning for.
              </p>
            </div>
          </div>
        )}

        {/* Media mentions: a plain ruled list, read before the guest quotes */}
        {press.length > 0 && (
          <aside
            data-press
            className={
              heading
                ? "lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:pt-2"
                : "order-2 lg:order-2 lg:col-span-5 lg:col-start-8 lg:pt-2"
            }
          >
            <p className="eyebrow">Media mentions</p>
            <ul className="mt-6 border-t border-cream/15">
              {press.map((p) => (
                <li key={p.outlet} data-press-row className="border-b border-cream/15">
                  <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-6 py-7 lg:py-9">
                    <span>
                      <span className="block font-display text-[clamp(1.6rem,2.2vw,2.75rem)] leading-none transition-colors duration-500 group-hover:text-gold">
                        {p.outlet}
                      </span>
                      {p.headline && (
                        <span className="mt-3 block max-w-[28rem] text-[0.98rem] leading-snug text-cream/65 lg:text-[clamp(0.98rem,1.05vw,1.2rem)]">
                          “{p.headline}”
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 text-xl text-gold transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div
          data-quotes
          className={
            heading
              ? "lg:col-span-7"
              : "order-1 lg:order-1 lg:col-span-7 lg:col-start-1"
          }
        >
          <p data-fade className="eyebrow">
            Guest testimonials
          </p>
          <div className="relative mt-7 grid min-h-[15rem] sm:min-h-[13rem] lg:min-h-[clamp(12rem,16vw,20rem)]">
            {reviews.map((r) => (
              <figure key={r.author} data-slide className="col-start-1 row-start-1">
                <blockquote className="font-display text-[clamp(1.5rem,2.5vw,3.4rem)] leading-[1.16] tracking-[-0.01em]">
                  <span className="text-gold">“</span>
                  {r.text}
                  <span className="text-gold">”</span>
                </blockquote>
                <figcaption className="mt-7 text-[0.8rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                  {r.author} · <span className="text-gold">Google</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div data-bars className="mt-8 flex gap-2" aria-hidden>
            {reviews.map((r, i) => (
              <span
                key={r.author}
                className={`relative h-px overflow-hidden bg-cream/20 transition-[width] duration-700 ${i === active ? "w-16" : "w-6"}`}
              >
                <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-gold" />
              </span>
            ))}
          </div>
        </div>
      </div>
  );

  return scene ? (
    <Scene
      ref={root}
      desktop={{ src: "/images/film-bar-wide.webp", focus: [0.4, 0.5] }}
      alt="The back bar at Lulu Modern at night"
      video={{ desktop: "/video/bar-wide.mp4", mobile: "/video/bar-wide.mp4", position: "40% 50%" }}
      dim={0.72}
      shade="full"
      className="!justify-center"
    >
      {body}
    </Scene>
  ) : (
    <section ref={root} className="relative overflow-clip bg-night py-20 text-cream lg:py-36">
      {body}
    </section>
  );
}
