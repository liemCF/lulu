"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { dishes } from "@/lib/content";

const FULL_MENU = "/menu";

export default function MenuShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const q = gsap.utils.selector(root);
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Inner image parallax tied to the horizontal motion.
        q("[data-card-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: scroll,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        gsap.to(q("[data-menu-progress]"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="menu" className="relative bg-night">
      <div className="grid gap-10 px-5 pt-28 pb-16 sm:px-10 lg:grid-cols-12 lg:pt-40 lg:pl-24">
        <div className="lg:col-span-7">
          <p data-fade className="eyebrow mb-6">
            New Asian Menu
          </p>
          <h2 data-split className="font-display text-[clamp(2.8rem,6.4vw,6.6rem)] leading-[0.95] tracking-[-0.02em]">
            Inspired by Asia. <em className="gold-foil">Designed for Today.</em>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-5 text-cream/70 lg:col-span-4 lg:col-start-9">
          <p data-fade>
            Lulu Modern celebrates the flavors, traditions, and culinary techniques found across Asia while honoring
            the roots that inspired our journey.
          </p>
          <p data-fade="0.1">
            From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
            quality ingredients, bold flavors, and elevated hospitality.
          </p>
        </div>
      </div>

      <div data-pin className="relative overflow-hidden lg:flex lg:h-[100svh] lg:items-center">
        <div
          data-track
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-16 [scrollbar-width:none] sm:px-10 lg:snap-none lg:gap-8 lg:overflow-visible lg:pb-0 lg:pl-24 lg:will-change-transform"
        >
          {dishes.map((d, i) => (
            <article
              key={d.name}
              className="group relative w-[78vw] shrink-0 snap-start sm:w-[48vw] lg:w-[min(30vw,460px)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                <div data-card-img className="absolute inset-[-10%]">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(min-width:1024px) 32vw, 80vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute top-5 right-5 font-cn text-xl font-black text-gold/90 [writing-mode:vertical-rl]">
                  {d.cn}
                </span>
                <span className="absolute bottom-5 left-5 text-xs tracking-[0.3em] text-cream/70">
                  {String(i + 1).padStart(2, "0")} / {String(dishes.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.9rem] leading-tight">{d.name}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">{d.desc}</p>
            </article>
          ))}

          <a
            href={FULL_MENU}
            data-cursor="Menu"
            className="group relative flex w-[78vw] shrink-0 snap-start flex-col justify-between border border-gold/25 p-8 sm:w-[48vw] lg:mr-24 lg:w-[min(26vw,400px)] lg:self-stretch"
          >
            <span className="font-cn text-[9rem] leading-none font-black text-gold/10 transition-colors duration-700 group-hover:text-cinnabar/40">
              菜
            </span>
            <span>
              <span className="eyebrow block">Full Menu</span>
              <span className="mt-3 block font-display text-4xl leading-tight">
                Explore the <em className="gold-foil">Menu</em> →
              </span>
              <span className="mt-3 block text-sm text-cream/60">
                Dim sum, duck, sushi, wok classics, cocktails & dessert.
              </span>
            </span>
          </a>
        </div>

        <div className="absolute inset-x-24 bottom-10 hidden h-px bg-gold/15 lg:block">
          <div data-menu-progress className="h-px origin-left scale-x-0 bg-gold" />
        </div>
      </div>
    </section>
  );
}
