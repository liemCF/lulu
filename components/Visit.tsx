"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { hours, info, links } from "@/lib/content";

export default function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      SplitText.create(q("[data-big-word]"), {
        type: "chars",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 100,
            ease: "expo.out",
            duration: 1.4,
            stagger: 0.05,
            scrollTrigger: { trigger: q("[data-big-word]")[0], start: "top 90%", once: true },
          });
        },
      });

      // The footer surfaces from underneath the page as it arrives.
      gsap.fromTo(
        q("[data-footer-inner]"),
        { yPercent: -28, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
      gsap.to(q("[data-footer-front]"), {
        y: "10rem",
        ease: "none",
        scrollTrigger: { trigger: q("[data-footer-scroller]")[0], start: "top bottom", end: "bottom bottom", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="visit" className="relative overflow-hidden bg-night">
      <div data-footer-inner className="pt-28 pb-28 sm:pb-10 lg:pt-36">
        <div className="px-5 sm:px-10 lg:pl-24">
          <p data-fade className="eyebrow mb-4">
            Reserve your table
          </p>
          <a
            href={links.reserve}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden"
            data-cursor="Book"
            aria-label="Reserve a table on OpenTable"
          >
            <span
              data-big-word
              className="block font-display text-[clamp(4.5rem,19vw,20rem)] leading-[0.85] tracking-[-0.04em] italic transition-colors duration-700 group-hover:text-gold"
            >
              Reserve
            </span>
          </a>
        </div>

        <div className="mt-20 grid gap-12 border-t border-gold/15 px-5 pt-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-12 lg:pl-24">
          <div data-fade className="lg:col-span-3">
            <p className="eyebrow mb-4">Visit</p>
            <p className="text-cream/80">
              {info.address}
              <br />
              {info.city}
            </p>
            <a href={links.directions} target="_blank" rel="noreferrer" className="link-line mt-3 inline-block text-sm text-gold">
              Get directions ↗
            </a>
          </div>

          <div data-fade="0.05" className="lg:col-span-4">
            <p className="eyebrow mb-4">Opening Hours</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              {hours.map((h) => (
                <div key={h.day} className="contents">
                  <dt className="text-cream/50">{h.day}</dt>
                  <dd className={`flex items-center gap-2 ${h.time === "Closed" ? "text-cream/35" : "text-cream/85"}`}>
                    {h.time}
                    {h.late && <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#ff2e7e]" title="Late night" />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-fade="0.1" className="lg:col-span-2">
            <p className="eyebrow mb-4">Contact</p>
            <a href={links.phone} className="link-line text-cream/80">
              {info.phone}
            </a>
            <div className="mt-4 flex flex-col gap-1 text-sm">
              <a href={links.order} target="_blank" rel="noreferrer" className="link-line w-fit text-cream/70">
                Order online (Toast) ↗
              </a>
              <a href="/private-dining" className="link-line w-fit text-cream/70">
                Private events
              </a>
            </div>
          </div>

          <div data-fade="0.15" className="lg:col-span-3">
            <p className="eyebrow mb-4">Follow</p>
            <div className="flex flex-col gap-1 text-sm">
              <a href={links.instagram} target="_blank" rel="noreferrer" className="link-line w-fit text-cream/70">
                Instagram ↗
              </a>
              <a href={links.tiktok} target="_blank" rel="noreferrer" className="link-line w-fit text-cream/70">
                TikTok ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 px-5 text-xs text-cream/40 sm:flex-row sm:items-center sm:px-10 lg:pl-24">
          <Image src="/images/logo-lulu.png" alt="Lulu Modern Chinese" width={606} height={410} className="h-12 w-auto opacity-80" />
          <p>© {new Date().getFullYear()} {info.name}. Where Tradition Meets Innovation.</p>
          <div className="flex gap-6">
            <a href="https://lulu-modern.com/index.php/privacy-policy/" className="link-line">
              Privacy Policy
            </a>
            <a href="https://lulu-modern.com/index.php/terms-condition/" className="link-line">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* The room itself closes the page, sliding as you reach the end, with the name over it. */}
      <div data-footer-scroller className="relative h-[70svh] overflow-clip select-none">
        <div data-footer-front className="absolute inset-x-0 -top-40 h-[calc(100%+10rem)]">
          <Image src="/images/night-room.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/30 to-ink/40" />
        <p
          aria-hidden
          className="absolute inset-x-0 bottom-6 text-center font-display text-[13vw] leading-none font-light text-cream uppercase"
        >
          Lulu Modern
        </p>
      </div>
    </footer>
  );
}
