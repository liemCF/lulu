"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";
import { frameA, frameB } from "@/lib/shapes";
import { TLink } from "./PageTransition";

// Shown / hidden states shared by every piece of text in the intro.
const SHOW = { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.inOut", pointerEvents: "auto", overwrite: "auto" } as const;
const HIDE = { opacity: 0, y: "2rem", filter: "blur(4px)", ease: "power1.inOut", pointerEvents: "none", overwrite: "auto" } as const;

// Timeline positions, as fractions of the 900vh scroll.
const MORPH_AT = 0.15;
const MORPH_FOR = 0.33;
const FADE_AT = 0.68;
const FADE_FOR = 0.1;
const at = (p: number) => `${p * 100}% top`;

type Shot = { src: string; w: number; h: number };
const frameImages: Record<"a" | "b", [Shot, Shot]> = {
  a: [
    { src: "/images/duck-chef-flame.webp", w: 600, h: 900 },
    { src: "/images/story-lulu.webp", w: 600, h: 850 },
  ],
  b: [
    { src: "/images/duck-torch.webp", w: 840, h: 560 },
    { src: "/images/night-room.webp", w: 560, h: 560 },
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
        const h3 = split("[data-h3]", "chars");
        const p3 = split("[data-p3]", "words");

        gsap.set([k1, h1, h2, h3, p3, q("[data-b1]"), q("[data-b2]"), q("[data-b3]")], HIDE);
        gsap.set(q("[data-morph]"), { scale: 1.1, filter: "blur(4px)", opacity: 0 });
        gsap.set(q("[data-num]").slice(1), { y: "1rem", opacity: 0, filter: "blur(4px)" });

        // The frames: arrive, morph and swap photos while sliding left, then dissolve.
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: trigger })
          .to(q("[data-morph]"), { scale: 1, filter: "blur(0px)", opacity: 1, ease: "power1.inOut", duration: 0.1 }, 0)
          .to(q("[data-path='a']"), { morphSVG: frameA.to, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-path='b']"), { morphSVG: frameB.to, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-frame='a']"), { width: "21rem", height: "28rem", top: "14%", right: "14%", ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-frame='b']"), { width: "33rem", height: "33rem", left: "0%", bottom: "16%", ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-shot='a-0'], [data-shot='b-0']"), { opacity: 0, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-shot='a-1'], [data-shot='b-1']"), { opacity: 1, duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-morph]"), { xPercent: -100, ease: "power1.inOut", duration: MORPH_FOR }, MORPH_AT)
          .to(q("[data-morph]"), { scale: 1.1, filter: "blur(4px)", opacity: 0, ease: "power1.inOut", duration: FADE_FOR }, FADE_AT)
          .to({}, { duration: 1 - FADE_AT - FADE_FOR });

        // Each screen's words play in and reverse out as its stretch of scroll is entered or left.
        const screen = (start: number, end: string, tl: gsap.core.Timeline) =>
          ScrollTrigger.create({
            trigger: scroller,
            start: at(start),
            end,
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          });
        screen(
          0,
          at(0.22),
          gsap
            .timeline({ paused: true })
            .to(k1, { ...SHOW, duration: 0.7, stagger: 0.03 }, 0)
            .to(h1, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(q("[data-b1]"), { ...SHOW, duration: 0.7 }, 0.2),
        );
        screen(
          0.33,
          at(0.6),
          gsap
            .timeline({ paused: true })
            .to(h2, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(q("[data-b2]"), { ...SHOW, duration: 0.7 }, 0.2),
        );
        screen(
          0.75,
          "bottom top",
          gsap
            .timeline({ paused: true })
            .to(h3, { ...SHOW, duration: 0.7, stagger: 0.04 }, 0)
            .to(p3, { ...SHOW, duration: 0.9, stagger: 0.04 }, 0.2)
            .to(q("[data-b3]"), { ...SHOW, duration: 0.9 }, 0.4),
        );

        // Progress line and the rolling 01 / 02 / 03.
        const nums = q("[data-num]");
        gsap
          .timeline({ scrollTrigger: trigger })
          .to(q("[data-fill]"), { width: "100%", ease: "none", duration: 1 }, 0)
          .to(nums[0], { y: "-1rem", opacity: 0, filter: "blur(4px)", duration: 0.14 }, 0.33)
          .to(nums[1], { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.14 }, 0.33)
          .to(nums[1], { y: "-1rem", opacity: 0, filter: "blur(4px)", duration: 0.14 }, 0.75)
          .to(nums[2], { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.14 }, 0.75);

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
      <div data-scroller className="relative hidden h-[900vh] overflow-clip text-cream lg:block">
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
                <MorphFrame id="a" viewBox={[600, 800]} path={frameA.from} shots={frameImages.a} className="top-0 right-0 z-[1] h-full w-[37rem]" />
                <MorphFrame id="b" viewBox={[560, 560]} path={frameB.from} shots={frameImages.b} className="bottom-24 -left-10 h-[27rem] w-[20rem]" />
              </div>
            </div>

            {/* Screen 1: the duck */}
            <div className="absolute inset-0 px-24 pt-28">
              <div className="w-5/12 space-y-10">
                <p data-k1 className="kicker">The signature experience</p>
                <h2 data-h1 className="t-h2">
                  Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
                  combining tableside theatrics with authentic craftsmanship.
                </h2>
                <div data-b1>
                  <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn text-cream">
                    Reserve the duck
                  </a>
                </div>
              </div>
            </div>

            {/* Screen 2: the people behind it */}
            <div className="absolute inset-0 flex justify-end px-24 pt-28">
              <div className="w-5/12 space-y-10">
                {/* Lightly edited from the site's "Our Story" copy. */}
                <h2 data-h2 className="t-h2">
                  Lulu Modern was born from the Asian American experience: tradition and innovation side by side, in a
                  dining room designed to be shared.
                </h2>
                <div data-b2>
                  <TLink href="/story" className="btn text-cream">
                    Our story
                  </TLink>
                </div>
              </div>
            </div>

            {/* Screen 3: the tagline */}
            <div className="absolute inset-0 flex flex-col justify-center px-24">
              <h2 data-h3 className="t-hero">Where tradition meets innovation</h2>
              <div className="mt-10 flex justify-end">
                <div className="w-4/12 space-y-8">
                  <p data-p3 className="text-lg leading-snug text-cream/85">
                    From signature duck and dim sum favorites to chef-driven creations, every dish reflects our
                    commitment to quality ingredients, bold flavors, and elevated hospitality.
                  </p>
                  <div data-b3>
                    <TLink href="/menu" className="t-link text-gold">
                      Explore the menu
                    </TLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="absolute bottom-16 left-24 flex items-center gap-5">
              <div className="relative h-px w-72 bg-cream/20">
                <div data-fill className="absolute top-0 left-0 h-full w-0 bg-gold" />
              </div>
              <div className="relative h-[1em] w-[2ch] text-xs leading-none text-cream/60">
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
        <p data-anim="chars" className="kicker">The signature experience</p>
        <h2 data-anim className="t-h2 mt-6">
          Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
          combining tableside theatrics with authentic craftsmanship.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[0.75rem_2.5rem_0.75rem_2.5rem]">
            <Image src="/images/duck-chef-flame.webp" alt="The chef flambéing a whole duck" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative mt-12 aspect-[3/4] overflow-hidden rounded-[2rem_0.5rem_2rem_0.5rem]">
            <Image src="/images/story-lulu.webp" alt="Lulu, the muse of the restaurant" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
        <h2 data-anim className="t-h2 mt-16">
          Lulu Modern was born from the Asian American experience: tradition and innovation side by side, in a dining
          room designed to be shared.
        </h2>
        <h2 data-anim="chars" className="t-hero mt-16">Where tradition meets innovation</h2>
        <p data-anim className="mt-8 text-lg leading-snug text-cream/85">
          From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
          quality ingredients, bold flavors, and elevated hospitality.
        </p>
        <TLink href="/menu" className="t-link mt-8 inline-block text-gold">
          Explore the menu
        </TLink>
      </div>
    </section>
  );
}
