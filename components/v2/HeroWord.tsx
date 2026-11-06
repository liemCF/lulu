"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { links } from "@/lib/content";
import OpenStatus from "@/components/OpenStatus";

/**
 * v2 hero. Desktop: the name LULU, set in expanded black, is a window onto the flaming duck.
 * The one motion moment: as you scroll, the word grows until you fall through the letters into
 * the full photo. It only moves when the visitor scrolls (no autoplay, no loop).
 * Phones, touch screens and reduced motion get a still, full-bleed photo with the name over it.
 */
export default function HeroWord() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const word = root.current!.querySelector("[data-word]") as SVGGElement;
        const box = word.getBBox();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
          })
          .to(q("[data-copy]"), { autoAlpha: 0, y: -30, duration: 0.15 }, 0)
          .to(word, { scale: 9, svgOrigin: `${cx} ${cy}`, duration: 0.7, ease: "power2.in" }, 0)
          .to(q("[data-full]"), { opacity: 1, duration: 0.3 }, 0.42)
          .fromTo(q("[data-caption]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.75);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Lulu Modern Chinese" className="relative bg-ink md:h-[260vh]">
      {/* ---------- Desktop ---------- */}
      <div className="sticky top-0 hidden h-svh overflow-hidden md:block">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <mask id="lulu-word" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900">
              <rect width="1440" height="900" fill="black" />
              <g data-word>
                <text
                  x="720"
                  y="520"
                  textAnchor="middle"
                  textLength="1340"
                  lengthAdjust="spacingAndGlyphs"
                  fill="white"
                  style={{ fontFamily: "var(--font-archivo)", fontStretch: "125%", fontWeight: 900, fontSize: 470 }}
                >
                  LULU
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/images/hero-duck-flame.webp"
            x="0"
            y="0"
            width="1440"
            height="900"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#lulu-word)"
          />
        </svg>

        <div data-full className="absolute inset-0 opacity-0">
          <Image src="/images/hero-duck-flame.webp" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        </div>

        <div data-copy className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-10 px-10 pb-10 lg:px-16">
          <div className="max-w-xl">
            <h1 className="t-wide-light text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.1] text-porcelain">
              Modern Chinese in Plano. The Peking duck is flamed at your table.
            </h1>
            <div className="mt-7 flex items-center gap-6">
              <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid">
                Reserve a table
              </a>
              <a href={links.order} target="_blank" rel="noreferrer" className="link-line text-sm text-porcelain/80">
                Order online
              </a>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right text-sm text-porcelain/70">
            <OpenStatus />
            <span>3310 Dallas Pkwy, Plano</span>
          </div>
        </div>

        <div data-caption className="invisible absolute inset-x-0 bottom-0 px-10 pb-12 lg:px-16">
          <p className="t-wide max-w-5xl text-[clamp(2.6rem,6vw,6.5rem)] text-porcelain">Lit at the table.</p>
          <p className="t-wide-light mt-4 text-lg text-porcelain/80">Whole Peking duck, $108. Order it ahead when you book.</p>
        </div>
      </div>

      {/* ---------- Phone: still photo, no motion ---------- */}
      <div className="relative h-[100svh] min-h-[640px] overflow-hidden md:hidden">
        <div className="absolute inset-x-0 top-[168px] bottom-0">
          <Image
            src="/images/duck-chef-flame.webp"
            alt="Lulu's chef lifts a flaming Peking duck at the table"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent via-25% to-ink" />
        </div>
        <p aria-hidden className="t-wide absolute inset-x-4 top-[86px] text-center text-[25vw] text-gold">
          Lulu
        </p>
        <div className="absolute inset-x-5 bottom-24">
          <h1 className="t-wide-light text-[1.55rem] leading-[1.15] text-porcelain">
            Modern Chinese in Plano. The Peking duck is flamed at your table.
          </h1>
          <div className="mt-4">
            <OpenStatus />
          </div>
        </div>
      </div>
    </section>
  );
}
