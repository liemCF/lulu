"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { info, links, occasions } from "@/lib/content";
import HoverPreview from "./HoverPreview";

// Lists are taken verbatim from lulu-modern.com/private-events-catering.
const details = [
  {
    title: "Suitable For",
    cn: "宴",
    items: [
      "Birthdays and celebrations",
      "Corporate dinners and client entertaining",
      "Cocktail receptions",
      "Networking events",
      "Private and intimate gatherings",
    ],
  },
  {
    title: "Private Hire",
    cn: "包",
    items: ["Full venue buy-out", "Private dining area", "Semi-private event spaces", "Dedicated bar access available"],
  },
  {
    title: "Food & Beverage",
    cn: "食",
    items: [
      "Customisable set menus",
      "Canapés and cocktail menus",
      "Full bar service",
      "Dietary requirements accommodated on request",
    ],
  },
  {
    title: "Event Features",
    cn: "礼",
    items: ["Full bar area", "Professional service staff", "Flexible seating configurations", "AV support available on request"],
  },
];

const stats = [
  { value: 120, suffix: "", label: "Guests seated" },
  { value: 150, suffix: "+", label: "Standing & cocktail" },
  { value: 1, suffix: "", label: "Venue buy-out", text: "Full" },
];

const strip = [
  { src: "/images/night-room.webp", alt: "A full dining room" },
  { src: "/images/private-guest.webp", alt: "A guest at a private dinner" },
  { src: "/images/night-sparklers.webp", alt: "A celebration with sparklers" },
  { src: "/images/private-room.webp", alt: "The main dining room" },
  { src: "/images/night-table.webp", alt: "A birthday table" },
];

export default function PrivateEvents() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Counters tick up once.
      q("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      });

      // Horizontal photo strip drifts with scroll.
      gsap.fromTo(
        q("[data-strip]"),
        { xPercent: 0 },
        {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: q("[data-strip]")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      q("[data-detail]").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          autoAlpha: 0,
          duration: 1.2,
          delay: (i % 4) * 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="bg-ink">
      {/* Stats */}
      <section className="border-y border-gold/10 px-5 py-16 sm:px-10 lg:pl-24">
        <dl className="grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-[clamp(2.8rem,7vw,7rem)] leading-none text-gold">
                {s.text ?? (
                  <>
                    <span data-count={s.value}>{s.value}</span>
                    {s.suffix}
                  </>
                )}
              </dt>
              <dd className="mt-3 text-[0.65rem] tracking-[0.25em] text-cream/55 uppercase">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Intro */}
      <section className="grid gap-10 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:py-32 lg:pl-24">
        <h2 data-split className="font-display text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1] lg:col-span-7">
          There are endless ways to celebrate special moments with{" "}
          <em className="gold-foil">personalised experiences.</em>
        </h2>
        <p data-fade className="self-end leading-relaxed text-cream/65 lg:col-span-4 lg:col-start-9">
          Lulu’s offers a full bar area and a main dining room with seating for up to 120 guests. The layout also
          supports standing cocktail receptions with ample circulation space, with flexible layouts for private and
          semi-private hire.
        </p>
      </section>

      {/* Photo strip */}
      <section className="overflow-hidden pb-24">
        <div data-strip className="flex w-max gap-4 pl-5 sm:pl-10 lg:gap-6 lg:pl-24">
          {strip.concat(strip.slice(0, 2)).map((p, i) => (
            <div
              key={`${p.src}-${i}`}
              className={`relative shrink-0 overflow-hidden ${i % 2 ? "h-[42vh] w-[30vh]" : "h-[52vh] w-[40vh]"} self-center`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="40vh" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="grid gap-px bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((d) => (
          <article key={d.title} data-detail className="relative overflow-hidden bg-ink p-8 lg:p-10">
            <span className="pointer-events-none absolute -right-4 -bottom-8 font-cn text-[9rem] leading-none font-black text-gold/[0.06]">
              {d.cn}
            </span>
            <h3 className="font-display text-3xl">{d.title}</h3>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-cream/65">
              {d.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-gold" />
                  {it}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Occasions */}
      <section className="grid gap-12 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:py-32 lg:pl-24">
        <div className="lg:col-span-4">
          <p data-fade className="eyebrow mb-5">
            For every occasion
          </p>
          <p data-fade className="max-w-sm leading-relaxed text-cream/60">
            Birthdays, anniversaries, corporate gatherings and holiday events, each with a menu built around your
            table.
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <HoverPreview
            className="flex flex-col"
            items={occasions.map((o, i) => ({
              key: o.name,
              image: o.image,
              alt: o.name,
              className: "group border-b border-cream/10",
              content: (
                <div className="flex items-baseline justify-between py-5 font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-none transition-[padding,color] duration-700 ease-[var(--ease-out-expo)] group-hover:pl-4 group-hover:text-gold">
                  <span>{o.name}</span>
                  <span className="font-sans text-xs text-gold">0{i + 1}</span>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* Enquiry */}
      <section className="relative overflow-hidden px-5 py-28 sm:px-10 lg:py-40 lg:pl-24">
        <div className="absolute inset-0">
          <Image src="/images/private-table.webp" alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink" />
        </div>
        <div className="relative max-w-4xl">
          <p data-fade className="eyebrow mb-6">
            Booking enquiries
          </p>
          <h2 data-split className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.95]">
            Let’s plan your <em className="gold-foil">night.</em>
          </h2>
          <p data-fade className="mt-8 max-w-lg text-cream/70">
            Tell us the date, time, guest count and the kind of evening you have in mind. Our events team will come
            back with options for your space, menu and bar.
          </p>
          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <a href={links.phone} className="btn btn-solid">
              Call {info.phone}
            </a>
            <a href={links.privateInquiry} target="_blank" rel="noreferrer" className="btn text-cream">
              Enquiry form ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
