"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";
import { frameA, frameB } from "@/lib/shapes";

// Shown / hidden states shared by every piece of text in the intro.
const SHOW = { opacity: 1, y: 0, ease: "power1.inOut", pointerEvents: "auto", overwrite: "auto" } as const;
const HIDE = { opacity: 0, y: "2rem", ease: "power1.inOut", pointerEvents: "none", overwrite: "auto" } as const;

// Timeline positions, as fractions of the 900vh scroll.
const MORPH_AT = 0.15;
const MORPH_FOR = 0.33;
const FADE_AT = 0.68;
const FADE_FOR = 0.1;
const SWAP_AT = 0.25;
const SWAP_FOR = 0.04;
// Where each screen of copy takes over; the stretches meet so there is always text on screen.
const SCREEN_2 = 0.26;
const SCREEN_3 = 0.68;
const at = (p: number) => `${p * 100}% top`;

type Shot = { src: string; w: number; h: number };
const frameImages: Record<"a" | "b", [Shot, Shot]> = {
  a: [
    { src: "/images/duck-chef-flame.webp", w: 600, h: 900 },
    { src: "/images/duck-carving.webp", w: 600, h: 900 },
  ],
  b: [
    { src: "/images/duck-torch.webp", w: 840, h: 560 },
    { src: "/images/duck-plated.webp", w: 840, h: 560 },
  ],
};

function MorphFrame({ id, viewBox, path, shots, className }: {
  id: string;
  viewBox: [number, number];
  path: string;
  shots: [Shot, Shot];
  className: string;
}) {
  const [vw, vh] = viewBox;
  return (
    <div data-frame={id} className={`absolute ${className}`}>
      <svg viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible">
        <defs>
          <clipPath id={`clip-${id}`} clipPathUnits="userSpaceOnUse">
            <path data-path={id} d={path} />
          </clipPath>
        </defs>
        {shots.map((s, i) => (
          <image
            key={s.src}
            data-shot={`${id}-${i}`}
            href={s.src}
            x={(vw - s.w) / 2}
            y={(vh - s.h) / 2}
            width={s.w}
            height={s.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${id})`}
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function IntroScroller() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const scroller = q("[data-scroller]")[0];
        const trigger = { trigger: scroller, start: "top top", end: "bottom bottom", scrub: true };

        const split = (sel: string, type: "words" | "chars") => {
          const s = SplitText.create(q(sel), { type: type === "chars" ? "chars,words" : "words" });
          return type === "chars" ? s.chars : s.words;
        };
        const k1 = split("[data-k1]", "chars");
        const h1 = split("[data-h1]", "words");
        const h2 = split("[data-h2]", "words");
        const h3 = split("[data-h3]", "words");

        gsap.set([k1, h1, h2, h3, q("[data-b1]"), q("[data-b2]"), q("[data-b3]")], HIDE);
        // The frames are already in place as the section arrives, rather than fading in on scroll.
        gsap.fromTo(
          q("[data-morph]"),
          { scale: 1.06, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: scroller, start: "top 70%", toggleActions: "play none none reverse" },
          },
        );
        gsap.set(q("[data-num]").slice(1), { y: "1rem", opacity: 0 });

        // The frames: arrive, morph and swap photos while sliding left, then dissolve.
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: trigger })
          .to(q("[data-path='a']"), { morphSVG: frameA.to, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-path='b']"), { morphSVG: frameB.to, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-frame='a']"), { width: "21rem", height: "28rem", top: "14%", right: "14%", ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-frame='b']"), { width: "33rem", height: "33rem", left: "0%", bottom: "16%", ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          // Swap photos quickly mid-morph so the frames never rest as a double exposure.
          .to(q("[data-shot='a-0'], [data-shot='b-0']"), { opacity: 0, duration: SWAP_FOR }, SWAP_AT)
          .to(q("[data-shot='a-1'], [data-shot='b-1']"), { opacity: 1, duration: SWAP_FOR }, SWAP_AT)
          .to(q("[data-morph]"), { xPercent: -100, ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-morph]"), { scale: 1.1, opacity: 0, ease: "power1.inOut", duration: FADE_FOR }, FADE_AT)
          .to({}, { duration: 1 - FADE_AT - FADE_FOR });

        // Each screen's words play in and reverse out as its stretch of scroll is entered or left.
        const screen = (start: number, end: string, tl: gsap.core.Timeline) =>
          ScrollTrigger.create({
            trigger: scroller,
            // The first screen is ready before the section reaches the top.
            start: start === 0 ? "top 70%" : at(start),
            end,
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          });
        screen(
          0,
          at(SCREEN_2),
          gsap
            .timeline({ paused: true })
            .to(k1, { ...SHOW, duration: 0.7, stagger: 0.03 }, 0)
            .to(h1, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(q("[data-b1]"), { ...SHOW, duration: 0.7 }, 0.2),
        );
        screen(
          SCREEN_2,
          at(SCREEN_3),
          gsap
            .timeline({ paused: true })
            .to(h2, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(q("[data-b2]"), { ...SHOW, duration: 0.7 }, 0.2),
        );
        screen(
          SCREEN_3,
          "bottom top",
          gsap
            .timeline({ paused: true })
            .to(h3, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(q("[data-b3]"), { ...SHOW, duration: 0.9 }, 0.4),
        );

        // Progress line and the rolling 01 / 02 / 03.
        const nums = q("[data-num]");
        gsap
          .timeline({ scrollTrigger: trigger })
          .to(q("[data-fill]"), { width: "100%", ease: "none", duration: 1 }, 0)
          .to(nums[0], { y: "-1rem", opacity: 0, duration: 0.015 }, SCREEN_2)
          .to(nums[1], { y: 0, opacity: 1, duration: 0.015 }, SCREEN_2 + 0.01)
          .to(nums[1], { y: "-1rem", opacity: 0, duration: 0.015 }, SCREEN_3)
          .to(nums[2], { y: 0, opacity: 1, duration: 0.015 }, SCREEN_3 + 0.01);

        gsap.to(q("[data-lattice]"), { rotate: 4, duration: 5, ease: "power1.inOut", yoyo: true, repeat: -1 });
        gsap.to(q("[data-parallax]"), {
          y: "10rem",
          ease: "power1.inOut",
          scrollTrigger: { trigger: scroller, start: `bottom-=${window.innerHeight} top`, end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="duck" className="relative">
      {/* Desktop: 900vh of scroll played inside one sticky screen */}
      <div data-scroller className="relative hidden h-[700vh] overflow-clip text-cream lg:block">
        <div className="sticky top-0 flex h-screen w-full items-center overflow-clip bg-[radial-gradient(at_bottom_right,var(--color-navy-hi)_0%,var(--color-navy-lo)_45%,var(--color-ink)_100%)]">
          <div
            data-lattice
            aria-hidden
            className="pointer-events-none absolute top-0 right-[-8%] h-screen w-screen origin-top-right scale-125 bg-gold opacity-[0.12] [mask-image:url(/images/lattice.svg)] [mask-position:center] [mask-size:cover]"
          />
          <div data-parallax className="absolute inset-0">
            {/* Morphing frames on the right half */}
            <div className="absolute inset-0 flex justify-end px-24">
              <div data-morph className="relative h-full w-1/2">
                <MorphFrame id="a" viewBox={[600, 800]} path={frameA.from} shots={frameImages.a} className="top-0 right-0 z-[1] h-full w-[min(37rem,40vw)]" />
                <MorphFrame id="b" viewBox={[560, 560]} path={frameB.from} shots={frameImages.b} className="bottom-24 -left-10 h-[min(27rem,30vw)] w-[min(20rem,22vw)]" />
              </div>
            </div>

            {/* Screen 1: the headline */}
            <div className="absolute inset-0 px-24 pt-28">
              <div className="w-5/12 space-y-10">
                <p data-k1 className="kicker">The Signature Experience</p>
                <h2 data-h1 className="t-h1">The Dish Everyone Talks About</h2>
                <p data-b1 className="t-h3 max-w-md text-cream/85">At Lulu Modern, every visit begins with an experience.</p>
              </div>
            </div>

            {/* Screen 2: why it's talked about */}
            <div className="absolute inset-0 flex justify-end px-24 pt-28">
              <div className="w-5/12 space-y-10">
                <h2 data-h2 className="t-h2">
                  Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
                  combining tableside theatrics with authentic craftsmanship.
                </h2>
                <div data-b2 aria-hidden className="h-px w-24 bg-gold/60" />
              </div>
            </div>

            {/* Screen 3: the promise, and where to book it */}
            <div className="absolute inset-0 flex flex-col justify-center px-24">
              <h2 data-h3 className="t-h1 max-w-[20ch]">
                Crispy skin. Hand-carved service. Unforgettable presentation.
              </h2>
              <div data-b3 className="mt-12">
                <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
                  Explore the Duck Experience
                </a>
              </div>
            </div>

            {/* Progress */}
            <div className="absolute bottom-16 left-24 flex items-center gap-5">
              <div className="relative h-px w-72 bg-cream/20">
                <div data-fill className="absolute top-0 left-0 h-full w-0 bg-gold" />
              </div>
              <div className="relative h-[1em] w-[2ch] text-sm leading-none text-cream/70">
                {["01", "02", "03"].map((n) => (
                  <span key={n} data-num className="absolute inset-0">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: the same three screens, stacked */}
      <div className="bg-[radial-gradient(at_bottom_right,var(--color-navy-hi)_0%,var(--color-navy-lo)_45%,var(--color-ink)_100%)] px-5 py-24 text-cream sm:px-10 lg:hidden">
        <p data-anim="chars" className="kicker">The Signature Experience</p>
        <h2 data-anim className="t-h1 mt-6">The Dish Everyone Talks About</h2>
        <p data-anim className="mt-6 text-[1.05rem] leading-relaxed text-cream/85">
          At Lulu Modern, every visit begins with an experience. Our signature Flaming Peking Duck has become one of the
          most talked-about dishes in Dallas-Fort Worth, combining tableside theatrics with authentic craftsmanship.
        </p>
        <div data-clip className="relative mt-12 aspect-[4/5] overflow-hidden rounded-[1rem_4rem_1rem_4rem]">
          <Image src="/images/duck-carving.webp" alt="Peking duck carved tableside" fill sizes="90vw" className="object-cover" />
        </div>
        <h3 data-anim className="t-h2 mt-12">Crispy skin. Hand-carved service. Unforgettable presentation.</h3>
        <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid mt-8">
          Explore the Duck Experience
        </a>
      </div>
    </section>
  );
}
