"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { info, links } from "@/lib/content";
import Seal3D from "./three/Seal3D";

/** Final CTA from the homepage doc: "Experience Lulu Modern", closing every page. */
export default function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const big = q("[data-big-word]")[0];
      const { chars } = SplitText.create(big, { type: "chars" });
      gsap.from(chars, {
        yPercent: 100,
        ease: "expo.out",
        duration: 1.4,
        stagger: 0.03,
        scrollTrigger: { trigger: big, start: "top 90%", once: true },
      });

      // Gold leaf: every few seconds a glint of light runs across "Lulu Modern"
      const css = getComputedStyle(document.documentElement);
      const gold = css.getPropertyValue("--color-gold").trim();
      const glint = "#f6ebc8";
      const goldChars = chars.filter((c) => c.closest("em"));
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 2.8,
          delay: 1.5,
          scrollTrigger: { trigger: big, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
        })
        .to(goldChars, {
          keyframes: [
            { color: glint, textShadow: "0 0 18px rgba(226,199,132,0.65)", duration: 0.28, ease: "power2.out" },
            { color: gold, textShadow: "0 0 0px rgba(226,199,132,0)", duration: 0.7, ease: "power2.inOut" },
          ],
          stagger: 0.05,
        });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="visit" className="shell relative overflow-hidden bg-night py-20 lg:py-32">
      <div>
        {/* The Lulu seal as a 3D object: gold raised on navy lacquer, turning as the page arrives */}
        <Seal3D className="pointer-events-none mx-auto -mt-6 aspect-[3/2] w-[min(64vw,19rem)] lg:-mt-10 lg:w-[clamp(17rem,21vw,27rem)]" />
        <h2 className="overflow-hidden text-center">
          <span
            data-big-word
            className="block font-display text-[clamp(2.7rem,7.4vw,12rem)] leading-[0.95] lg:whitespace-nowrap tracking-[-0.03em] text-cream"
          >
            Experience <em className="text-gold">Lulu Modern</em>
          </span>
        </h2>

        {/* CTA Buttons & Value Prop */}
        <div className="mt-8 flex flex-col items-center gap-9 border-b border-cream/10 pb-16 text-center lg:mt-10">
          <div data-fade className="max-w-[44rem] space-y-2">
            <p className="font-display text-[clamp(1.3rem,1.7vw,2.1rem)] leading-tight text-cream/90">
              Dallas-Fort Worth’s destination for modern Asian dining.
            </p>
          </div>

          <div data-fade className="flex flex-wrap justify-center gap-4">
            <a
              href={links.reserve}
              target="_blank"
              rel="noreferrer"
              className="btn btn-solid text-center min-w-[160px]"
            >
              Reserve a Table
            </a>
            <a
              href={links.order}
              target="_blank"
              rel="noreferrer"
              className="btn text-cream text-center min-w-[160px] hover:border-gold"
            >
              Order Online
            </a>
          </div>
        </div>

        {/* Location, Contact & Hours Details */}
        <div data-fade className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-[0.9rem] text-cream/70">
          <div>
            <p className="font-medium text-cream uppercase tracking-wider text-[0.75rem] text-gold mb-2">Location</p>
            <p className="text-cream">{info.address}</p>
            <p>{info.city}</p>
            <a href={links.directions} target="_blank" rel="noreferrer" className="inline-block py-2 text-gold hover:underline text-[0.8rem]">
              Get Directions ↗
            </a>
          </div>

          <div>
            <p className="font-medium text-cream uppercase tracking-wider text-[0.75rem] text-gold mb-2">Reservations &amp; Contact</p>
            <p>
              <a href={links.phone} className="inline-block py-1 text-cream transition-colors hover:text-gold">
                {info.phone}
              </a>
            </p>
            <p className="mt-1">
              <a href={links.email} className="inline-block py-1.5 text-gold-soft hover:text-gold transition-colors">
                {info.email}
              </a>
            </p>
            <p className="mt-1 text-[0.82rem]">Parties of 6+ or Private Events:</p>
            <a href={links.privateInquiry} target="_blank" rel="noreferrer" className="inline-block py-2 text-gold hover:underline text-[0.8rem]">
              Private Event Inquiry ↗
            </a>
          </div>

          <div>
            <p className="font-medium text-cream uppercase tracking-wider text-[0.75rem] text-gold mb-2">Dining Hours</p>
            <p><span className="text-cream">Wed - Thu:</span> 4:30 PM - 10:00 PM</p>
            <p><span className="text-cream">Fri:</span> 4:30 PM - 11:30 PM</p>
            <p><span className="text-cream">Sat:</span> 11:00 AM - 12:00 AM</p>
            <p><span className="text-cream">Sun:</span> 11:00 AM - 10:00 PM</p>
            <p><span className="text-cream">Mon:</span> 4:30 PM - 10:00 PM · <span className="text-cream/50">Tue: Closed</span></p>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="font-medium text-cream uppercase tracking-wider text-[0.75rem] text-gold mb-2">Social</p>
              <div className="flex flex-wrap gap-x-5">
                <a href={links.instagram} target="_blank" rel="noreferrer" className="py-2 hover:text-gold transition-colors">
                  Instagram ↗
                </a>
                <a href={links.facebook} target="_blank" rel="noreferrer" className="py-2 hover:text-gold transition-colors">
                  Facebook ↗
                </a>
                <a href={links.tiktok} target="_blank" rel="noreferrer" className="py-2 hover:text-gold transition-colors">
                  TikTok ↗
                </a>
              </div>
            </div>
            <p className="text-[0.75rem] text-cream/40 mt-6 sm:mt-0">
              © {new Date().getFullYear()} Lulu Modern Chinese. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
