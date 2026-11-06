"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion } from "@/lib/reveal";
import { info, links } from "@/lib/content";
import HeroCanvas, { HERO_MOBILE_QUERY, type HeroScene } from "./HeroCanvas";
import OpenStatus from "./OpenStatus";
import { TLink } from "./PageTransition";
import { useLenis } from "./SmoothScroll";

export const INTRO_EVENT = "lulu:intro";

const HERO_SRC = "/images/hero-duck-flame.webp";
// Phones get a portrait shot of the same moment instead of a sliver of the landscape one.
const HERO_MOBILE_SRC = "/images/duck-chef-flame.webp";
const HERO_ALT = "Flaming Peking Duck being finished tableside";
const DESKTOP_SCENE: HeroScene = { src: HERO_SRC, focus: [0.62, 0.5], pan: [0.49, 0.85] };
const MOBILE_SCENE: HeroScene = { src: HERO_MOBILE_SRC, focus: [0.5, 0.8], pan: [0.51, 0.85] };
const LOGO_SRC = "/images/logo-lulu.png";
const SEEN_KEY = "lulu:intro-seen";

/** Resolves once the hero photo is decoded, or after `timeout` ms so a slow network never traps the intro. */
function heroReady(timeout = 3500) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.src = window.matchMedia(HERO_MOBILE_QUERY).matches ? HERO_MOBILE_SRC : HERO_SRC;
    img.decode().then(resolve, resolve);
    window.setTimeout(resolve, timeout);
  });
}

// Art-directed hero photo: landscape on desktop, portrait on phones.
const { props: { srcSet: mobileSrcSet } } = getImageProps({ src: HERO_MOBILE_SRC, alt: "", fill: true, quality: 85, sizes: "70vh" });
const { props: heroImg } = getImageProps({
  src: HERO_SRC,
  alt: HERO_ALT,
  fill: true,
  quality: 85,
  // Cover-cropped: on tall screens the landscape photo needs more than the viewport width.
  sizes: "(max-aspect-ratio: 3/2) 150vh, 100vw",
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const introDone = useRef(false);

  // Hold scrolling while the intro plays.
  useEffect(() => {
    if (!lenis) return;
    if (!introDone.current) lenis.stop();
    const release = () => lenis.start();
    window.addEventListener(INTRO_EVENT, release);
    return () => window.removeEventListener(INTRO_EVENT, release);
  }, [lenis]);

  useGSAP(
    () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const q = gsap.utils.selector(root);
      const html = document.documentElement;
      const finish = () => {
        introDone.current = true;
        // Remember only once the intro has actually played (effects can run twice in dev).
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        html.classList.add("intro-done");
        window.dispatchEvent(new Event(INTRO_EVENT));
      };

      if (prefersReducedMotion()) {
        gsap.set(q("[data-loader]"), { display: "none" });
        finish();
        return;
      }

      const section = root.current!;
      // Phones: slower, softer doors and no parallax on the photo.
      const calm = prefersCalmMotion();
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      // Act 1: the mark surfaces from the dark, a band of light passes over it,
      // and a hairline tracks the hero photo loading. Act 2: lacquer doors part.
      let ready = false;
      const headline = SplitText.create(q("[data-wordmark]"), { type: "words" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(
        q("[data-loader-logo]"),
        { autoAlpha: 0, scale: 0.94, filter: "blur(14px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.8 },
        0.15,
      )
        .fromTo(q("[data-loader-glow]"), { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.out" }, 0.1)
        .fromTo(q("[data-loader-sub]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.7)
        .fromTo(q("[data-loader-bar]"), { scaleX: 0 }, { scaleX: 0.7, duration: 1.6, ease: "power2.out" }, 0.5)
        .fromTo(
          q("[data-loader-shine]"),
          { backgroundPosition: "160% 0" },
          { backgroundPosition: "-60% 0", duration: 1.5, ease: "power2.inOut" },
          0.8,
        )
        .addLabel("hold", 2.0)
        .addPause("hold", () => {
          if (ready) tl.play();
        })
        .to(q("[data-loader-bar]"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "hold")
        .to(
          q("[data-loader-logo], [data-loader-sub], [data-loader-track]"),
          { autoAlpha: 0, y: -10, duration: 0.6, ease: "power2.in", stagger: 0.05 },
          "hold+=0.4",
        )
        .to(q("[data-loader-glow]"), { opacity: 0, duration: 0.6, ease: "power2.in" }, "hold+=0.4")
        .addLabel("doors", "hold+=0.85")
        // The seam catches the light just before the doors part.
        .fromTo(
          q("[data-seam]"),
          { opacity: 0, scaleY: 0 },
          { opacity: 0.9, scaleY: 1, duration: 0.7, ease: "expo.inOut" },
          "doors-=0.55",
        )
        .to(q("[data-seam]"), { opacity: 0, duration: 0.9, ease: "power2.out" }, "doors+=0.5")
        .to(q("[data-door='l']"), { xPercent: -100, duration: calm ? 2 : 1.5, ease: calm ? "power2.inOut" : "expo.inOut" }, "doors")
        .to(q("[data-door='r']"), { xPercent: 100, duration: calm ? 2 : 1.5, ease: calm ? "power2.inOut" : "expo.inOut" }, "doors")
        .add(finish, "doors+=0.6")
        .set(q("[data-loader]"), { display: "none" }, "doors+=1.5")
        .fromTo(q("[data-hero-veil]"), { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" }, "doors+=0.3")
        // The headline rises word by word once the doors are open, then the subheadline and buttons.
        .set(q("[data-wordmark]"), { opacity: 1 }, "doors+=0.8")
        .fromTo(
          headline.words,
          { opacity: 0, y: calm ? "0.4rem" : "1.5rem" },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power2.out" },
          "doors+=0.8",
        )
        .fromTo(
          q("[data-hero-fade]"),
          { autoAlpha: 0, y: calm ? 0 : 12 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 },
          "doors+=1.3",
        );

      // Returning in the same session: skip straight to the doors.
      if (seen) tl.seek(tl.labels.doors - 0.15);

      heroReady().then(() => {
        ready = true;
        if (tl.paused()) tl.play();
      });

      // Scroll-out: image drifts a little and dims, copy lifts away faster.
      gsap.to(q("[data-hero-parallax]"), {
        yPercent: calm ? 0 : 8,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-hero-copy]"), {
        yPercent: -20,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(q("[data-hero-dim]"), {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[560px] md:min-h-[680px] overflow-hidden bg-ink">
      {/* Media. On phones the photo takes the top of the screen so the duck sits clear of the copy. */}
      <div className="absolute inset-0 max-md:bottom-[42%]">
        <div data-hero-parallax className="absolute inset-0 will-change-transform">
          <picture>
            <source media={HERO_MOBILE_QUERY} srcSet={mobileSrcSet} sizes="70vh" />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
            <img {...heroImg} loading="eager" fetchPriority="high" className="object-cover object-[62%_50%] max-md:object-[50%_80%]" />
          </picture>
          {/* Heat haze and embers rising off the pan */}
          <HeroCanvas desktop={DESKTOP_SCENE} mobile={MOBILE_SCENE} className="absolute inset-0 h-full w-full" />
        </div>
        <div data-hero-veil className="intro-hide absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/70 max-md:via-transparent max-md:via-30% max-md:to-ink/40" />
          {/* Desktop: darken the left, where the copy sits, and leave the duck in the light */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/20 via-45% to-transparent max-md:hidden" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_20%,color-mix(in_srgb,var(--color-navy-hi)_35%,transparent),transparent_70%)]" />
        </div>
        <div data-hero-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* Intro: the brand mark, then two lacquer doors that part onto the hero */}
      <div data-loader className="fixed inset-0 z-[70]" aria-hidden>
        <div
          data-door="l"
          className="absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-ink"
        >
          <span data-seam className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent opacity-0" />
        </div>
        <div
          data-door="r"
          className="absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-ink"
        >
          <span data-seam className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent opacity-0" />
        </div>

        <div
          data-loader-glow
          className="absolute inset-0 bg-[radial-gradient(38%_32%_at_50%_48%,color-mix(in_srgb,var(--color-gold)_10%,transparent),transparent_70%)] opacity-0"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div data-loader-logo className="relative w-[min(210px,50vw)] opacity-0">
            <Image src={LOGO_SRC} alt="" width={606} height={410} loading="eager" className="h-auto w-full" />
            {/* Light sweep, masked to the logo's own shape */}
            <div
              data-loader-shine
              className="absolute inset-0"
              style={{
                WebkitMaskImage: `url(${LOGO_SRC})`,
                maskImage: `url(${LOGO_SRC})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                backgroundImage:
                  "linear-gradient(105deg, transparent 38%, rgba(255,244,214,0.95) 50%, transparent 62%)",
                backgroundSize: "260% 100%",
                backgroundPosition: "160% 0",
              }}
            />
          </div>
          <div data-loader-track className="mt-12 h-px w-[120px] bg-gold/15">
            <div data-loader-bar className="h-px origin-left scale-x-0 bg-gold" />
          </div>
          <p
            data-loader-sub
            className="mt-5 text-[0.78rem] tracking-[0.18em] text-cream/60 uppercase opacity-0"
          >
            {info.region}
          </p>
        </div>
      </div>

      {/* What Lulu is, why it's different and how to book: bottom-left on desktop, under the photo on phones */}
      <div
        data-hero-copy
        className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 max-md:text-center sm:px-10 md:pb-16 lg:px-16 lg:pb-20"
      >
        <div className="max-w-[46rem] max-md:mx-auto">
          <div data-hero-fade className="intro-hide mb-5 flex text-cream/80 max-md:mb-3 max-md:justify-center">
            <OpenStatus />
          </div>
          <h1
            data-wordmark
            className="intro-hide font-display text-[clamp(2.5rem,5.6vw,6.25rem)] leading-[1.02] tracking-[-0.02em] text-cream max-md:text-[clamp(1.9rem,8.4vw,2.9rem)]"
          >
            Modern Asian Dining. <em className="text-gold-soft">Unforgettable Experiences.</em>
          </h1>
          <p data-hero-fade className="intro-hide mt-5 max-w-[36rem] text-[1.05rem] leading-relaxed text-cream/85 max-md:mx-auto max-md:mt-3 max-md:text-[0.95rem] max-md:leading-normal lg:text-[1.15rem]">
            Home of the iconic Flaming Peking Duck and chef-driven Asian cuisine inspired by tradition, innovation, and
            the Asian American experience.
          </p>
          <div data-hero-fade className="intro-hide mt-8 flex flex-wrap gap-3 max-md:mt-5 max-md:grid max-md:grid-cols-2">
            <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid max-md:justify-center max-md:!px-2">
              Reserve a Table
            </a>
            <TLink href="/menu" className="btn text-cream max-md:justify-center max-md:!px-2">
              View Menu
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
