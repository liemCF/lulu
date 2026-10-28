"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";

export type Option = { name: string; cn?: string; detail: string; meta?: string; image: string; alt: string };

type Props = {
  id: string;
  kicker: string;
  heading: ReactNode;
  options: Option[];
  imageSide: "left" | "right";
  tone: "light" | "dark";
  tag: string;
  cta: ReactNode;
};

/**
 * Split section: a list of names on one side, a tall photo on the other.
 * On arrival the photo opens downward while the text opens upward; hovering a name
 * rolls it to an italic gold twin and swaps the photo and details.
 */
export default function OptionsSplit({ id, kicker, heading, options, imageSide, tone, tag, cta }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [bar, setBar] = useState({ top: 0, height: 0, visible: false });

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%" } })
        .fromTo(q("[data-reveal-image]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-reveal-content]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-zoom]"), { scale: 1.1 }, { scale: 1, duration: 1.2, ease: "power2.inOut" }, 0);
      gsap.set(q("[data-parallax]"), { top: "-=10rem" });
      gsap.to(q("[data-parallax]"), { top: "+=20rem", ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    },
    { scope: root },
  );

  const light = tone === "light";
  const imageLeft = imageSide === "left";

  return (
    <section
      ref={root}
      id={id}
      className={`relative overflow-clip ${light ? "bg-paper text-ink" : "text-cream"}`}
    >
      <div className="relative flex min-h-screen items-stretch max-lg:flex-col">
        {/* Photo half */}
        <div
          data-reveal-image
          className={`relative h-[70svh] w-full lg:absolute lg:top-0 lg:h-full lg:w-[55vw] ${imageLeft ? "lg:left-0" : "lg:right-0"}`}
        >
          <div data-zoom className="relative h-full w-full overflow-hidden">
            {options.map((o, i) => (
              <div
                key={o.image + i}
                data-parallax
                className="absolute top-1/2 left-0 h-[calc(100%+20rem)] w-full -translate-y-1/2 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <Image src={o.image} alt={o.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <p
            className={`t-h1 absolute bottom-16 z-[3] text-cream uppercase max-xl:hidden ${imageLeft ? "left-16" : "right-16"}`}
          >
            {tag}
          </p>
        </div>

        {!light && (
          <div
            className={`pointer-events-none absolute top-0 hidden h-full w-[45vw] bg-[radial-gradient(at_right_bottom,var(--color-navy-hi),var(--color-night))] lg:block ${imageLeft ? "right-0" : "left-0"}`}
          />
        )}

        {/* Text half */}
        <div
          data-reveal-content
          className={`relative z-[1] flex w-full px-5 py-16 sm:px-10 lg:min-h-screen lg:px-16 lg:py-20 ${imageLeft ? "lg:justify-end" : ""}`}
        >
          <div className="flex w-full flex-col justify-between gap-12 lg:w-5/12 lg:pr-10">
            <div>
              <p data-anim="chars" className={`kicker ${light ? "!text-[var(--color-gold-deep)]" : ""}`}>
                {kicker}
              </p>
              <h2 data-anim className="t-h2 mt-6">
                {heading}
              </h2>
            </div>

            <div
              className="relative"
              onMouseLeave={() => setBar((b) => ({ ...b, visible: false }))}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -left-4 w-0.5 transition-all duration-300 ${light ? "bg-[var(--color-gold-deep)]" : "bg-gold"}`}
                style={{ top: 0, height: bar.height, transform: `translateY(${bar.top}px)`, opacity: bar.visible ? 1 : 0 }}
              />
              <ul>
                {options.map((o, i) => (
                  <li key={o.name}>
                    <button
                      type="button"
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        const h = el.offsetHeight * 0.7;
                        setBar({ top: el.offsetTop + (el.offsetHeight - h) / 2, height: h, visible: true });
                        setActive(i);
                      }}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group relative block w-full overflow-hidden py-1.5 text-left"
                    >
                      <span
                        className={`t-h2 flex items-baseline gap-4 transition-transform duration-500 ${i === active ? "-translate-y-[140%]" : "group-hover:-translate-y-[140%]"}`}
                      >
                        {o.name}
                      </span>
                      <span
                        aria-hidden
                        className={`t-h2 absolute inset-x-0 flex items-baseline gap-4 italic transition-all duration-500 ${light ? "text-[var(--color-gold-deep)]" : "text-gold"} ${i === active ? "top-1.5" : "top-full group-hover:top-1.5"}`}
                      >
                        {o.name}
                        {o.cn && <span className="font-cn text-base not-italic opacity-80">{o.cn}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`relative min-h-40 border-t pt-8 ${light ? "border-[var(--color-gold-deep)]/40" : "border-gold/30"}`}>
              {options.map((o, i) => (
                <div
                  key={o.name}
                  className="absolute top-8 left-0 transition-opacity duration-300"
                  style={{ opacity: i === active ? 1 : 0, transitionDelay: i === active ? "300ms" : "0ms" }}
                  aria-hidden={i !== active}
                >
                  {o.meta && <p className={`t-h2 ${light ? "text-[var(--color-gold-deep)]" : "text-gold"}`}>{o.meta}</p>}
                  <p className="mt-3 max-w-md leading-snug opacity-80">{o.detail}</p>
                </div>
              ))}
            </div>

            <div>{cta}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
