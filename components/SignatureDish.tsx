"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";

const ritualSteps = [
  {
    no: "01",
    label: "Crispy Skin",
    cn: "金黄酥脆",
    desc: "Lacquered, roasted and set alight tableside until the skin turns glass-crisp.",
    image: "/images/duck-torch.webp",
  },
  {
    no: "02",
    label: "Hand-Carved Service",
    cn: "片皮精工",
    desc: "Carved live before your eyes into thin, glistening slices with master knife technique.",
    image: "/images/duck-carving.webp",
  },
  {
    no: "03",
    label: "Tableside Presentation",
    cn: "宴飨之礼",
    desc: "Served warm with steamed lotus-leaf pancakes, julienned scallions, and house hoisin sauce.",
    image: "/images/duck-plated.webp",
  },
];

/** Section 2 of the homepage doc: The Signature Experience. */
export default function SignatureDish() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.to(q("[data-lattice]"), { rotate: 4, duration: 8, ease: "power1.inOut", yoyo: true, repeat: -1 });

      // The 3 poetic beats rise smoothly with scroll
      gsap.fromTo(
        q("[data-beat]"),
        { opacity: 0.1, yPercent: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: 0.25,
          scrollTrigger: { trigger: q("[data-beats]")[0], start: "top 85%", end: "top 50%", scrub: 0.6 },
        },
      );

      // Ritual cards reveal with elegant stagger
      gsap.fromTo(
        q("[data-ritual-card]"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: "expo.out",
          scrollTrigger: { trigger: q("[data-ritual-grid]")[0], start: "top 82%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="duck"
      className="relative overflow-clip bg-[radial-gradient(ellipse_at_top_right,var(--color-navy-hi)_0%,var(--color-navy-lo)_50%,var(--color-ink)_100%)] px-5 py-24 text-cream sm:px-10 lg:px-20 lg:py-36"
    >
      {/* Decorative traditional lattice watermark */}
      <div
        data-lattice
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-16 h-[120%] w-[80vw] max-w-[900px] origin-top-right bg-gold opacity-[0.05] [mask-image:url(/images/lattice.svg)] [mask-position:center] [mask-size:contain] [mask-repeat:no-repeat]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Top Header & Copy */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-gold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              The Signature Experience
            </div>
            <h2 data-split className="t-hero mt-5 text-cream">
              The Dish Everyone <br className="hidden sm:inline" />
              <em className="text-gold-soft font-serif italic">Talks About</em>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <div data-fade className="space-y-4 text-[1.05rem] leading-relaxed text-cream/80 lg:text-[1.12rem]">
              <p>At Lulu Modern, every visit begins with an experience.</p>
              <p>
                Our signature Flaming Peking Duck has become one of the most talked-about dishes in Dallas-Fort Worth,
                combining tableside theatrics with authentic craftsmanship.
              </p>
              <p data-beats className="font-display text-[clamp(1.25rem,2vw,1.65rem)] leading-snug text-gold-soft italic">
                <span data-beat className="inline-block">Crispy skin.</span>{" "}
                <span data-beat className="inline-block">Hand-carved service.</span>{" "}
                <span data-beat className="inline-block">Unforgettable presentation.</span>
              </p>
            </div>
            <div data-fade className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={links.duckExperience}
                target="_blank"
                rel="noreferrer"
                className="btn btn-solid shadow-lg shadow-gold/10"
              >
                Reserve on OpenTable
              </a>
              <span className="text-[0.8rem] tracking-widest text-cream/50 uppercase">Limited Daily Quantities</span>
            </div>
          </div>
        </div>

        {/* 3-Step Tableside Ritual Visual Cards */}
        <div
          data-ritual-grid
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6"
        >
          {ritualSteps.map((step) => (
            <div
              key={step.no}
              data-ritual-card
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-night/70 p-4 transition-all duration-500 hover:border-gold/40 hover:bg-night hover:shadow-2xl hover:shadow-gold/5"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink">
                <Image
                  src={step.image}
                  alt={step.label}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
                
                {/* Chinese Calligraphy Accent Badge */}
                <div className="absolute top-3 right-3 rounded-md bg-ink/75 px-2 py-1 font-serif text-[0.8rem] tracking-widest text-gold backdrop-blur-md">
                  {step.cn}
                </div>

                {/* Step Numeral */}
                <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-normal text-gold">{step.no}</span>
                  <span className="text-[0.7rem] tracking-[0.2em] text-cream/70 uppercase">Step</span>
                </div>
              </div>

              {/* Text Description */}
              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-cream transition-colors group-hover:text-gold-soft">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/75">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
