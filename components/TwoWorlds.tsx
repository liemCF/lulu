"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { roundedPath } from "@/lib/shapes";
import { TLink } from "./PageTransition";

// Organic masks for the three photos, drawn as inline SVG data URIs.
const mask = (points: [number, number][], w: number, h: number, r: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${roundedPath(points, r)}' fill='black'/></svg>`,
  )}")`;

const photos = [
  {
    src: "/images/story-mural.webp",
    alt: "Lulu in Chinese opera makeup, painted on the wall",
    cls: "top-[6%] left-[3%] w-[13rem] aspect-[3/4] z-[2]",
    mask: mask([[30, 0], [300, 20], [300, 330], [190, 400], [0, 380], [10, 120]], 300, 400, 40),
    strength: 0.09,
  },
  {
    src: "/images/private-guest.webp",
    alt: "A guest at dinner",
    cls: "top-[50%] right-[4%] w-[18rem] aspect-[4/5]",
    mask: mask([[0, 40], [260, 0], [320, 250], [300, 400], [40, 380]], 320, 400, 46),
    strength: 0.06,
  },
  {
    src: "/images/dish-pork-xlb.webp",
    alt: "Soup dumplings in a bamboo steamer",
    cls: "bottom-[9%] right-[32%] w-[12rem] aspect-square z-[2]",
    mask: mask([[20, 30], [300, 0], [280, 260], [120, 300], [0, 230]], 300, 300, 40),
    strength: 0.035,
  },
];

export default function TwoWorlds() {
  const root = useRef<HTMLElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q("[data-huge]"), { type: "chars,words" });
      gsap.from(split.chars, {
        x: "100vw",
        stagger: 0.035,
        duration: 1.7,
        ease: "power2.inOut",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(q("[data-mask]"), {
        maskSize: "0%",
        webkitMaskSize: "0%",
        stagger: 0.3,
        duration: 1.5,
        delay: 1.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.set(q("[data-kicker-wrap]"), { y: "-10rem" });
      gsap.to(q("[data-kicker-wrap]"), { y: "+=15rem", ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    },
    { scope: root },
  );

  // Photos drift toward the pointer, each by a different amount.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const movers = frames.current
      .map((el, i) => el && { x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }), s: photos[i].strength })
      .filter(Boolean) as { x: gsap.QuickToFunc; y: gsap.QuickToFunc; s: number }[];
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      movers.forEach((m) => {
        m.x(dx * m.s);
        m.y(dy * m.s);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={root} id="story" className="relative z-[1] min-h-screen overflow-clip bg-navy text-cream">
      <div className="relative flex min-h-screen flex-col justify-center py-32 lg:py-40">
        <div data-kicker-wrap className="relative z-[3] px-5 text-center sm:px-10 lg:px-24">
          <p data-anim="chars" className="kicker">
            Our Story
          </p>
        </div>

        {photos.map((p, i) => (
          <div
            key={p.src}
            ref={(el) => {
              frames.current[i] = el;
            }}
            className={`absolute hidden will-change-transform lg:block ${p.cls}`}
          >
            <div
              data-mask
              className="relative h-full w-full"
              style={{
                maskImage: p.mask,
                WebkitMaskImage: p.mask,
                maskSize: "100%",
                WebkitMaskSize: "100%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="24rem" className="object-cover" />
            </div>
          </div>
        ))}

        <div className="pointer-events-none relative z-[4] mt-10 flex justify-center px-5">
          <h2 data-huge className="t-hero text-center text-cream/95 max-lg:text-[12vw] lg:text-[7vw]">
            Rooted in Culture.
            <br />
            <em className="text-gold-soft">Inspired by Evolution.</em>
          </h2>
        </div>

        <div className="relative z-[3] mt-16 px-5 sm:px-10 lg:mt-24 lg:px-24">
          <div className="max-w-xl space-y-8 lg:ml-[8%]">
            <p data-anim className="t-h3 text-cream">
              Lulu Modern was born from the Asian American experience.
            </p>
            <div data-fade className="space-y-5 text-[1.05rem] leading-relaxed text-cream/85">
              <p>
                Growing up between cultures taught us that tradition and innovation can exist side by side. Our
                restaurant reflects that belief, bringing together authentic flavors, modern creativity, and a dining
                experience designed to be shared.
              </p>
              <p>
                This is more than a restaurant. It’s our interpretation of what modern Asian hospitality can become.
              </p>
            </div>
            <TLink href="/about" className="btn text-cream">
              Read Our Story
            </TLink>
          </div>
        </div>

        {/* Phones: a staggered collage */}
        <div className="mt-14 grid grid-cols-2 gap-4 px-5 lg:hidden">
          {photos.map((p, i) => (
            <div
              key={p.src}
              className={`relative ${i === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"} ${i === 2 ? "-ml-6" : ""}`}
              style={{ maskImage: p.mask, WebkitMaskImage: p.mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
