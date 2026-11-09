"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { occasions } from "@/lib/content";
import { TLink } from "./PageTransition";

/** Section 7 of the homepage doc: Private Dining & Celebrations. */
export default function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-occasion]"), {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: q("[data-occasions]")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="private" className="relative overflow-clip bg-night px-5 py-24 text-cream sm:px-10 lg:px-24 lg:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-anim="chars" className="kicker">
            Private Dining &amp; Celebrations
          </p>
          <h2 data-split className="t-h1 mt-6">
            Celebrations Deserve Something Extraordinary
          </h2>
          <p data-fade className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-cream/85 lg:text-[1.1rem]">
            From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
            dining experiences for every occasion.
          </p>
          <div data-fade className="mt-10">
            <TLink href="/private-dining" className="btn btn-solid">
              Plan Your Event
            </TLink>
          </div>
        </div>

        <ul data-occasions className="grid grid-cols-2 gap-3 lg:col-span-7 lg:col-start-6 lg:gap-4">
          {occasions.map((o, i) => (
            <li
              key={o.name}
              data-occasion
              className={`group relative overflow-hidden rounded-[0.75rem] ${i % 2 ? "aspect-[4/5] translate-y-10" : "aspect-[4/5]"}`}
            >
              <Image
                src={o.image}
                alt={o.name}
                fill
                sizes="(min-width:1024px) 28vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-12 pb-4 font-display text-[clamp(1.1rem,1.6vw,1.6rem)]">
                {o.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
