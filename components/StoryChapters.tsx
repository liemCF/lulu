"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";
import { TLink } from "./PageTransition";

// Copy from lulu-modern.com/about-lulu, lightly re-punctuated.
const forms = [
  {
    src: "/images/story-mural.webp",
    alt: "Lulu in traditional Chinese opera attire, from the restaurant mural",
    label: "Tradition",
    cn: "戏",
    text: "In traditional Chinese opera attire, honoring our heritage, symbolism, discipline, and the beauty of ancient Chinese culture.",
  },
  {
    src: "/images/story-lulu.webp",
    alt: "Lulu as a bold, stylish modern woman",
    label: "Modern",
    cn: "今",
    text: "As a bold, sexy, stylish modern woman, representing Asian American confidence, creativity, and the freedom to define our own identity.",
  },
];

const tribute = [
  "A place where heritage meets innovation.",
  "Where old world flavors meet new world creativity.",
  "Where our culture is not just preserved, but reimagined.",
];

export default function StoryChapters() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      q("[data-scrub]").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
              },
            );
          },
        });
      });

      // The two Lulus slide toward each other.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        q("[data-form]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { yPercent: i ? 14 : -6 },
            {
              yPercent: i ? -6 : 14,
              ease: "none",
              scrollTrigger: { trigger: q("[data-forms]")[0], start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      gsap.fromTo(
        q("[data-duality]"),
        { scale: 0.86, opacity: 0.2 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-duality]")[0], start: "top 90%", end: "center 55%", scrub: true },
        },
      );

      q("[data-tribute]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? 8 : -8, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 60%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative bg-ink">
      {/* Chapter 1 */}
      <section className="grid gap-12 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:py-36 lg:pl-24">
        <div className="lg:col-span-3">
          <p className="eyebrow">01 — Two cultures</p>
        </div>
        <div className="lg:col-span-8">
          <p data-scrub className="font-display text-[clamp(1.6rem,2.8vw,2.7rem)] leading-snug">
            Lulu Modern Chinese was created from the perspective of proud Asian American kids growing up in NYC,
            shaped by two cultures at once. At home, we honored our roots: Chinese flavors, family traditions,
            language and stories. Outside, we absorbed the energy of what it meant to chase the American Dream:
            creativity, individuality, and reinvention.
          </p>
          <p data-fade className="mt-10 max-w-xl leading-relaxed text-cream/60">
            The Asian American identity is its own world, not the same as growing up in Asia, and not quite the same
            as traditional American culture.
          </p>
        </div>
      </section>

      {/* Duality */}
      <section className="overflow-hidden px-5 py-20 text-center sm:px-10 lg:py-28">
        <p
          data-duality
          className="mx-auto max-w-6xl font-display text-[clamp(2.8rem,8vw,8.5rem)] leading-[0.95] tracking-[-0.02em]"
        >
          It’s a blend. A balance. <em className="gold-foil">A story of duality.</em>
        </p>
      </section>

      {/* Chapter 2: the muse */}
      <section className="px-5 py-24 sm:px-10 lg:py-36 lg:pl-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <p className="eyebrow">02 — Our muse</p>
          </div>
          <div className="lg:col-span-8">
            <h2 data-split className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.98]">
              That duality is captured in our muse, <em className="gold-foil">Lulu.</em>
            </h2>
            <p data-fade className="mt-6 max-w-xl text-cream/60">
              In our murals, Lulu appears in two forms.
            </p>
          </div>
        </div>

        <div data-forms className="mt-20 grid gap-16 md:grid-cols-2 md:gap-10 lg:mt-28 lg:pr-14">
          {forms.map((f, i) => (
            <figure key={f.label} data-form className={i ? "md:mt-40" : ""}>
              <div data-clip className="relative aspect-[3/4] overflow-hidden">
                <Image src={f.src} alt={f.alt} fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
                <span className="absolute top-5 right-5 font-cn text-4xl font-black text-gold [writing-mode:vertical-rl]">
                  {f.cn}
                </span>
              </div>
              <figcaption className="mt-6">
                <span className="eyebrow">{f.label}</span>
                <p className="mt-3 max-w-md font-display text-2xl leading-snug text-cream/90">{f.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-24 grid gap-2 lg:mt-32 lg:pl-[25%]">
          {["Lulu is both — just like us.", "Rooted in tradition, but unafraid to evolve.", "Grounded in culture, yet expressive and modern."].map(
            (line, i) => (
              <p
                key={line}
                data-fade={i * 0.08}
                className={`font-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-tight ${i === 0 ? "text-gold italic" : ""}`}
              >
                {line}
              </p>
            ),
          )}
        </div>
      </section>

      {/* Chapter 3: the food */}
      <section className="bg-night px-5 py-24 sm:px-10 lg:py-36 lg:pl-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <p className="eyebrow">03 — The table</p>
          </div>
          <div className="lg:col-span-8">
            <h2 data-split className="font-display text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1]">
              Our cuisine follows the same philosophy.
            </h2>
            <p data-scrub className="mt-10 font-display text-[clamp(1.4rem,2.2vw,2.1rem)] leading-snug">
              We honor authentic Chinese flavors — dim sum, Peking duck, wok dishes — while bringing an elevated
              Asian American voice to every plate. Premium ingredients, dramatic presentation, bold flavors, modern
              cocktails, curated music: all reflect the Asian American experience of blending past and present into
              something uniquely ours.
            </p>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {[
            { src: "/images/duck-carving.webp", alt: "Peking duck carved by hand" },
            { src: "/images/dish-pork-xlb.webp", alt: "Pork soup dumplings" },
            { src: "/images/night-cocktail.webp", alt: "A signature cocktail being poured" },
          ].map((p, i) => (
            <div
              key={p.src}
              data-clip
              className={`relative aspect-[3/4] overflow-hidden ${i === 2 ? "col-span-2 md:col-span-1" : ""} ${i === 1 ? "md:translate-y-16" : ""}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 30vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Tribute + signature */}
      <section className="overflow-hidden px-5 py-28 sm:px-10 lg:py-40 lg:pl-24">
        <p data-fade className="eyebrow mb-10">
          Lulu Modern Chinese is a tribute to that identity
        </p>
        {tribute.map((line) => (
          <p
            key={line}
            data-tribute
            className="border-b border-cream/10 py-5 font-display text-[clamp(1.8rem,4.2vw,4.2rem)] leading-tight"
          >
            {line}
          </p>
        ))}
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <p data-fade className="font-display text-[clamp(1.5rem,2.4vw,2.3rem)] leading-snug lg:col-span-7">
            Lulu is the story of who we are: Taiwanese & Chinese by origin, American by upbringing, and proudly Asian
            American in identity.
          </p>
          <div data-fade className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="font-display text-4xl text-gold italic">Sunny Chang</p>
            <p className="mt-2 text-xs tracking-[0.3em] text-cream/50 uppercase">Founder</p>
          </div>
        </div>
      </section>

      {/* Chef */}
      <section className="grid gap-12 border-t border-gold/10 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:py-32 lg:pl-24">
        <div className="lg:col-span-5">
          <div data-clip className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/duck-chef-flame.webp"
              alt="Flambéing a whole duck in the kitchen"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <p data-fade className="eyebrow mb-5">
            Meet the Chef
          </p>
          <h2 data-split className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[1]">
            Leading the Next Chapter of <em className="gold-foil">Lulu Modern</em>
          </h2>
          <p data-fade className="mt-8 max-w-lg leading-relaxed text-cream/65">
            Under the direction of Executive Chef Natalie Deprez, Lulu Modern is entering a new era of culinary
            creativity. Discover a menu that honors tradition while pushing Asian cuisine forward through innovation,
            premium ingredients, and unforgettable presentation.
          </p>
          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <TLink href="/menu" className="btn btn-solid">
              Explore the Menu
            </TLink>
            <a href={links.reserve} target="_blank" rel="noreferrer" className="btn text-cream">
              Reserve a Table
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
