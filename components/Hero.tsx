"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { info, links } from "@/lib/content";
import HeroCanvas from "./HeroCanvas";
import OpenStatus from "./OpenStatus";
import { useLenis } from "./SmoothScroll";

export const INTRO_EVENT = "lulu:intro";

const HERO_SRC = "/images/hero-duck-flame.webp";
const LOGO_SRC = "/images/logo-lulu.png";
const SEEN_KEY = "lulu:intro-seen";

/** Resolves once the hero photo is decoded, or after `timeout` ms so a slow network never traps the intro. */
function heroReady(timeout = 3500) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.src = HERO_SRC;
    img.decode().then(resolve, resolve);
    window.setTimeout(resolve, timeout);
  });
}

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
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      // Act 1: the mark surfaces from the dark, a band of light passes over it,
      // and a hairline tracks the hero photo loading. Act 2: lacquer doors part.
      let ready = false;
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
        .to(q("[data-door='l']"), { xPercent: -100, duration: 1.5, ease: "expo.inOut" }, "doors")
        .to(q("[data-door='r']"), { xPercent: 100, duration: 1.5, ease: "expo.inOut" }, "doors")
        .fromTo(q("[data-hero-media]"), { scale: 1.22 }, { scale: 1, duration: 2.6, ease: "expo.out" }, "doors+=0.25")
        .add(finish, "doors+=0.6")
        .set(q("[data-loader]"), { display: "none" }, "doors+=1.5")
        .fromTo(q("[data-hero-veil]"), { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" }, "doors+=0.3")
        .fromTo(
          q("[data-hero-line]"),
          { yPercent: 110, opacity: 1 },
          { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.1 },
          "doors+=0.7",
        )
        .fromTo(
          q("[data-hero-fade]"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 },
          "doors+=1.0",
        )
        .fromTo(
          q("[data-hero-info]"),
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 },
          "doors+=1.1",
        );

      // Returning in the same session: skip straight to the doors.
      if (seen) tl.seek(tl.labels.doors - 0.15);

      heroReady().then(() => {
        ready = true;
        if (tl.paused()) tl.play();
      });

      // Scroll-out: image drifts and dims, copy lifts away faster.
      gsap.to(q("[data-hero-parallax]"), {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-hero-copy]"), {
        yPercent: -30,
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
    <section ref={root} id="top" className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink">
      {/* Media */}
      <div className="absolute inset-0">
        <div data-hero-parallax className="absolute inset-0 will-change-transform">
          <div data-hero-media className="absolute inset-0">
            <Image
              src={HERO_SRC}
              alt="Flaming Peking Duck being carved tableside"
              fill
              preload
              quality={85}
              sizes="100vw"
              className="object-cover object-[62%_50%]"
            />
            <HeroCanvas src={HERO_SRC} focus={[0.62, 0.5]} className="absolute inset-0 h-full w-full" />
          </div>
        </div>
        <div data-hero-veil className="intro-hide absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/70" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_20%,rgba(255,46,126,0.2),transparent_70%)]" />
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
          className="absolute inset-0 bg-[radial-gradient(38%_32%_at_50%_48%,rgba(201,169,97,0.10),transparent_70%)] opacity-0"
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
            className="mt-5 text-[0.6rem] tracking-[0.5em] text-cream/45 uppercase opacity-0"
          >
            {info.region}
          </p>
        </div>
      </div>

      {/* Vertical seal */}
      <div
        data-hero-fade
        className="intro-hide absolute top-1/2 left-5 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 md:flex"
      >
        <span className="font-cn text-2xl font-black text-gold [writing-mode:vertical-rl]">品味</span>
        <span className="h-16 w-px bg-gold/40" />
        <span className="text-[0.62rem] tracking-[0.4em] text-cream/60 uppercase [writing-mode:vertical-rl]">
          {info.region}
        </span>
      </div>

      {/* Copy */}
      <div
        data-hero-copy
        className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-5 pb-40 sm:px-10 md:pl-24 lg:pb-44"
      >
        <div data-hero-fade className="intro-hide mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="eyebrow">{info.region}</p>
          <OpenStatus />
        </div>
        <h1 className="font-display text-[clamp(3rem,min(9.2vw,15svh),10rem)] leading-[0.92] tracking-[-0.02em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="intro-hide block">
              Modern Asian Dining.
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="intro-hide block">
              <em className="gold-foil pr-[0.1em]">Unforgettable</em>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="intro-hide block">
              Experiences.
            </span>
          </span>
        </h1>
        <div className="pointer-events-auto mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p data-hero-fade className="intro-hide max-w-md text-base leading-relaxed text-cream/75">
            Home of the iconic Flaming Peking Duck and chef-driven Asian cuisine inspired by tradition, innovation,
            and the Asian American experience.
          </p>
          <div data-hero-fade className="intro-hide flex flex-wrap gap-3">
            <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid">
              Reserve a Table
            </a>
            <a href="/menu" className="btn text-cream">
              View Menu
            </a>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-gold/20 bg-ink/40 backdrop-blur-md sm:block">
        <div className="grid grid-cols-3 divide-x divide-gold/15 px-5 sm:px-10 md:pl-24">
          <a
            data-hero-info
            href={links.directions}
            target="_blank"
            rel="noreferrer"
            className="intro-hide group py-5 pr-6"
          >
            <span className="eyebrow block text-[0.62rem]">Visit</span>
            <span className="mt-1 block text-sm text-cream/80 transition-colors group-hover:text-gold">
              {info.address}, {info.city}
            </span>
          </a>
          <a data-hero-info href={links.phone} className="intro-hide group px-6 py-5">
            <span className="eyebrow block text-[0.62rem]">Reserve</span>
            <span className="mt-1 block text-sm text-cream/80 transition-colors group-hover:text-gold">
              {info.phone}
            </span>
          </a>
          <a
            data-hero-info
            href={links.order}
            target="_blank"
            rel="noreferrer"
            className="intro-hide group py-5 pl-6"
          >
            <span className="eyebrow block text-[0.62rem]">Order Online</span>
            <span className="mt-1 block text-sm text-cream/80 transition-colors group-hover:text-gold">
              Pickup & take out via Toast ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
