"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { info, links } from "@/lib/content";
import OpenStatus from "../OpenStatus";

/**
 * The one motion moment (desktop, fine pointer, motion allowed): the room starts dark and the
 * duck's flame lights it, a soft circle of light opening from the flame once, then the words settle.
 * Phones, touch and reduced motion get the still photo straight away. Nothing loops.
 */
const FLAME = "48% 87%";

export default function HeroFlame() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const lit = () => html.classList.add("lit");
      const mq = window.matchMedia(
        "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      );
      if (!mq.matches || html.classList.contains("lit")) return lit();

      const q = gsap.utils.selector(root);
      const img = new window.Image();
      img.src = "/images/hero-duck-flame.webp";
      let started = false;
      const play = () => {
        if (started) return;
        started = true;
        gsap
          .timeline({ onComplete: lit })
          .fromTo(
            q("[data-light]"),
            { clipPath: `circle(0% at ${FLAME})`, filter: "brightness(1.35)" },
            { clipPath: `circle(150% at ${FLAME})`, filter: "brightness(1)", duration: 2.4, ease: "power2.inOut" },
            0.15,
          )
          .fromTo(
            q("[data-after-light]"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 },
            1.5,
          );
      };
      img.decode().then(play, play);
      window.setTimeout(play, 2500);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink text-porcelain"
    >
      <div data-light className="hero-light absolute inset-0">
        <Image
          src="/images/hero-duck-flame.webp"
          alt="A whole Peking duck held over the flame at the table while a guest films it"
          fill
          preload
          quality={85}
          sizes="100vw"
          className="object-cover object-[50%_55%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-transparent to-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent via-40% to-transparent max-md:hidden" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between px-5 pt-28 pb-24 sm:px-10 sm:pb-10 lg:px-16">
        <div data-after-light className="after-light max-w-[22rem] sm:max-w-[26rem]">
          <p className="font-display text-[clamp(1.45rem,2.1vw,2.1rem)] leading-[1.15]">
            Modern Chinese in Plano. The Peking duck is set alight and carved at your table.
          </p>
          <div className="mt-5">
            <OpenStatus />
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display leading-[0.72] italic">
            <span className="block text-[clamp(8rem,27vw,26rem)] tracking-[-0.03em]">Lulu</span>
            <span className="sr-only"> Modern Chinese, Plano, Texas</span>
          </h1>
          <div data-after-light className="after-light flex flex-col gap-4 md:mb-6 md:items-end">
            <div className="flex gap-3 max-sm:hidden">
              <a href={links.reserve} target="_blank" rel="noreferrer" className="pbtn pbtn-gold">
                Reserve a table
              </a>
              <a href={links.order} target="_blank" rel="noreferrer" className="pbtn pbtn-line">
                Order online
              </a>
            </div>
            <a href={links.directions} target="_blank" rel="noreferrer" className="link-line w-fit text-sm text-porcelain/80">
              {info.address}, {info.city}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
