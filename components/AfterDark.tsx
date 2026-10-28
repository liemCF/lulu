"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { cocktails, hours } from "@/lib/content";

const collage = [
  { src: "/images/night-sparklers.webp", alt: "Sparklers lighting up a celebration", cls: "left-0 top-0 w-[58%] aspect-square", speed: -12 },
  { src: "/images/night-cocktail.webp", alt: "Bartender finishing a cocktail", cls: "right-0 top-[14%] w-[38%] aspect-[2/3]", speed: 18 },
  { src: "/images/night-cheers.webp", alt: "A table raising a toast", cls: "left-[12%] bottom-0 w-[54%] aspect-[3/2]", speed: 8 },
];

export default function AfterDark() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Neon sign switching on: a few hard flickers, then it holds.
      gsap
        .timeline({ scrollTrigger: { trigger: q("[data-neon]")[0], start: "top 75%", once: true } })
        .set(q("[data-neon]"), { opacity: 0.08 })
        .to(q("[data-neon]"), { opacity: 1, duration: 0.05 }, 0.2)
        .to(q("[data-neon]"), { opacity: 0.15, duration: 0.05 }, 0.32)
        .to(q("[data-neon]"), { opacity: 1, duration: 0.05 }, 0.42)
        .to(q("[data-neon]"), { opacity: 0.3, duration: 0.04 }, 0.6)
        .to(q("[data-neon]"), { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.7);

      // Slow drifting glows in the background.
      q("[data-glow]").forEach((g, i) => {
        gsap.to(g, {
          xPercent: i % 2 ? -25 : 25,
          yPercent: i % 2 ? 20 : -15,
          scale: 1.2,
          duration: 7 + i * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      q("[data-speed]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -Number(el.dataset.speed) },
          {
            yPercent: Number(el.dataset.speed),
            ease: "none",
            scrollTrigger: { trigger: q("[data-collage]")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.from(q("[data-cocktail]"), {
        x: -30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-cocktails]")[0], start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const late = hours.filter((h) => h.late);

  return (
    <section ref={root} id="after-dark" className="relative overflow-hidden bg-[#050509] py-28 lg:py-40">
      <div
        data-glow
        className="pointer-events-none absolute -top-40 -left-40 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(255,46,126,0.22),transparent_65%)] blur-2xl"
      />
      <div
        data-glow
        className="pointer-events-none absolute right-[-20vw] bottom-[-20vw] h-[70vw] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(43,70,160,0.35),transparent_65%)] blur-2xl"
      />
      <div
        data-glow
        className="pointer-events-none absolute top-1/3 left-1/2 h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(200,50,43,0.18),transparent_65%)] blur-2xl"
      />

      <div className="relative px-5 sm:px-10 lg:pl-24">
        <div className="flex flex-col gap-8">
          <div>
            <p data-fade className="eyebrow mb-4 !text-neon">
              Fridays & Saturdays · Late
            </p>
            <h2
              data-neon
              className="neon-text font-display text-[clamp(3.5rem,14vw,14rem)] leading-[0.95] tracking-[-0.03em] whitespace-nowrap italic"
            >
              After Dark
            </h2>
          </div>
          <p
            data-split
            className="max-w-sm font-display text-[clamp(1.6rem,2.4vw,2.3rem)] leading-tight text-cream/90 lg:self-end"
          >
            Good music. Great company. Unforgettable energy.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Collage */}
          <div data-collage className="relative aspect-[4/5] lg:col-span-7 lg:aspect-[6/5]">
            {collage.map((c) => (
              <div key={c.src} data-speed={c.speed} className={`absolute ${c.cls}`}>
                <div data-clip className="relative h-full w-full overflow-hidden">
                  <Image src={c.src} alt={c.alt} fill sizes="(min-width:1024px) 35vw, 60vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>

          {/* Bar copy + cocktails */}
          <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
            <p data-fade className="leading-relaxed text-cream/70">
              When the dining room winds down, the bar turns up. Top-shelf signature cocktails, a room full of
              celebrations, and a crowd that stays late.
            </p>
            <ul className="mt-6 flex flex-col gap-1 text-sm">
              {late.map((h) => (
                <li data-fade key={h.day} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_#ff2e7e]" />
                  <span className="text-cream">{h.day}</span>
                  <span className="text-cream/50">until {h.time.split("– ")[1]}</span>
                </li>
              ))}
            </ul>

            <div data-cocktails className="mt-12">
              <p className="eyebrow mb-4">Signature Cocktails</p>
              <ul className="divide-y divide-cream/10 border-y border-cream/10">
                {cocktails.map((c) => (
                  <li
                    data-cocktail
                    key={c.name}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-neon"
                  >
                    <span className="font-display text-xl transition-transform duration-500 group-hover:translate-x-2 lg:text-2xl">
                      {c.name}
                    </span>
                    <span className="text-sm text-gold tabular-nums">{c.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <blockquote data-fade className="mt-10 border-l border-neon/60 pl-5 text-sm text-cream/60 italic">
              “The bar area is definitely a little lively on the weekends.”
              <footer className="mt-2 text-xs tracking-[0.2em] text-cream/40 not-italic uppercase">
                Matt Wilson · Google review
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
