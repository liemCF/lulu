"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { duckSteps, links } from "@/lib/content";

export default function Signature() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;

      gsap.to(root.current!.querySelectorAll("[data-flicker]"), {
        opacity: "random(0.2, 0.75)",
        duration: "random(0.06, 0.22)",
        ease: "none",
        repeat: -1,
        repeatRefresh: true,
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const q = gsap.utils.selector(root);
        const frames = q("[data-frame]");
        const steps = q("[data-step]");
        const total = frames.length;

        gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(steps.slice(1), { opacity: 0.28 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${total * 90}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tl.fromTo(q("[data-progress]"), { scaleY: 1 / total }, { scaleY: 1, ease: "none", duration: total - 1 }, 0);
        frames.forEach((frame, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, at)
            .fromTo(frame.querySelector("img"), { scale: 1.25 }, { scale: 1, ease: "power2.out", duration: 1 }, at)
            .to(frames[i - 1].querySelector("img"), { scale: 0.92, ease: "power2.inOut", duration: 1 }, at)
            .to(steps[i - 1], { opacity: 0.28, duration: 0.4 }, at + 0.3)
            .to(steps[i], { opacity: 1, duration: 0.4 }, at + 0.3);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="duck" className="relative bg-ink">
      <div data-pin className="relative px-5 py-24 sm:px-10 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
        <div className="grid w-full gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-14">
            <p className="eyebrow mb-6" data-fade>
              The Signature Experience
            </p>
            <h2 data-split className="font-display text-[clamp(2.6rem,5.2vw,5.4rem)] leading-[0.98] tracking-[-0.015em]">
              The Dish Everyone <em className="gold-foil">Talks About</em>
            </h2>
            <p data-fade className="mt-6 max-w-md leading-relaxed text-cream/70">
              Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
              combining tableside theatrics with authentic craftsmanship.
            </p>

            <div className="relative mt-10 hidden lg:block">
              <span data-progress className="absolute top-0 left-0 h-full w-px origin-top bg-gold" aria-hidden />
              <ol className="flex flex-col gap-6 border-l border-gold/15 pl-6">
              {duckSteps.map((s) => (
                <li key={s.no} data-step className="max-w-sm">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-gold tabular-nums">{s.no}</span>
                    <h3 className="font-display text-2xl">{s.title}</h3>
                  </div>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-cream/60">{s.body}</p>
                </li>
              ))}
              </ol>
            </div>

            <div data-fade className="mt-10 flex flex-wrap items-center gap-6">
              <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
                Explore the Duck Experience
              </a>
              <span className="text-xs tracking-[0.2em] text-cream/50 uppercase">Whole duck · $108 · order ahead</span>
            </div>
          </div>

          {/* Desktop: stacked frames revealed while pinned */}
          <div className="relative hidden lg:col-span-7 lg:block">
            <div className="relative ml-auto aspect-[4/5] h-[80svh] max-w-full overflow-hidden">
              {duckSteps.map((s, i) => (
                <div key={s.no} data-frame className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                  <Image src={s.image} alt={s.title} fill sizes="45vw" quality={85} className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute bottom-6 left-6 font-display text-[7rem] leading-none text-cream/90 italic">
                    {s.no}
                  </span>
                </div>
              ))}
              {/* Firelight: a warm glow that never quite settles. */}
              <div
                data-flicker
                className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(70%_55%_at_45%_85%,rgba(255,120,40,0.35),transparent_70%)] opacity-40 mix-blend-screen"
              />
              <span className="pointer-events-none absolute top-6 right-6 z-10 font-cn text-3xl font-black text-gold [writing-mode:vertical-rl]">
                北京烤鸭
              </span>
            </div>
          </div>

          {/* Mobile & tablet: plain stacked cards */}
          <div className="flex flex-col gap-12 lg:hidden">
            {duckSteps.map((s) => (
              <article key={s.no}>
                <div data-clip className="relative aspect-[4/5] overflow-hidden">
                  <Image src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span className="text-xs text-gold">{s.no}</span>
                  <h3 className="font-display text-3xl">{s.title}</h3>
                </div>
                <p className="mt-2 pl-8 text-cream/60">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
