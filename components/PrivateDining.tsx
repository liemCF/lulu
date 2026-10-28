"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links, occasions } from "@/lib/content";
import HoverPreview from "./HoverPreview";

const stats = [
  { value: "120", label: "Guests seated" },
  { value: "150+", label: "Standing & cocktail" },
  { value: "Full", label: "Venue buy-out" },
];

export default function PrivateDining() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Full-bleed photo opens out from a framed window as you arrive.
      gsap.fromTo(
        q("[data-pd-frame]"),
        { clipPath: "inset(12% 14% 12% 14%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-pd-img]"),
        { scale: 1.25 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      q("[data-occasion]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 75%", end: "top 45%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="private" className="relative bg-ink">
      <div className="relative h-[90svh] min-h-[560px]">
        <div data-pd-frame className="absolute inset-0 overflow-hidden">
          <div data-pd-img className="absolute inset-0">
            <Image
              src="/images/private-table.webp"
              alt="A long table set with duck, dim sum and cocktails"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 sm:px-10 lg:pl-24">
          <p data-fade className="eyebrow mb-5">
            Private Dining & Celebrations
          </p>
          <h2
            data-split
            className="max-w-5xl font-display text-[clamp(2.8rem,6.6vw,7rem)] leading-[0.95] tracking-[-0.02em]"
          >
            Celebrations Deserve Something <em className="gold-foil">Extraordinary</em>
          </h2>
        </div>
      </div>

      <div className="grid gap-16 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:pl-24">
        <div className="lg:col-span-5">
          <p data-fade className="text-lg leading-relaxed text-cream/75">
            From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
            dining experiences for every occasion — with tailored menus, flexible layouts, and attentive service.
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-gold/15 pt-8">
            {stats.map((s, i) => (
              <div key={s.label} data-fade={i * 0.08}>
                <dt className="font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-none text-gold">{s.value}</dt>
                <dd className="mt-2 text-[0.65rem] tracking-[0.2em] text-cream/55 uppercase">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div data-fade className="mt-12 flex flex-wrap gap-3">
            <a href="/private-dining" className="btn btn-solid">
              Plan Your Event
            </a>
            <a href={links.phone} className="btn text-cream">
              Call the Team
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <HoverPreview
            className="flex flex-col"
            items={occasions.map((o, i) => ({
              key: o.name,
              image: o.image,
              alt: o.name,
              className: "group border-b border-cream/10",
              content: (
                <div
                  data-occasion
                  className="flex items-baseline justify-between py-5 font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-none transition-[padding,color] duration-700 ease-[var(--ease-out-expo)] group-hover:pl-4 group-hover:text-gold"
                >
                  <span>{o.name}</span>
                  <span className="font-sans text-xs text-gold">0{i + 1}</span>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
