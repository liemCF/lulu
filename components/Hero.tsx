"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { info } from "@/lib/content";
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
      const wordmark = SplitText.create(q("[data-wordmark]"), { type: "chars" });
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
        // The wordmark rises letter by letter once the doors are open.
        .set(q("[data-wordmark]"), { opacity: 1 }, "doors+=0.8")
        .fromTo(
          wordmark.chars,
          { opacity: 0, y: "2rem" },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "power2.out" },
          "doors+=0.8",
        )
        .fromTo(q("[data-hero-fade]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, "doors+=1.4");

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
      gsap.to(q("[data-wordmark]"), {
        yPercent: -40,
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
            className="mt-5 text-[0.6rem] tracking-[0.5em] text-cream/45 uppercase opacity-0"
          >
            {info.region}
          </p>
        </div>
      </div>

      {/* Wordmark, centred at the foot of the frame */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-16 max-md:pb-10">
        <div data-hero-fade className="intro-hide mb-4 flex items-center gap-6 text-cream/80">
          <OpenStatus />
        </div>
        <h1
          data-wordmark
          aria-label="Lulu Modern Chinese"
          className="intro-hide text-center font-display text-[10.5vw] leading-[0.9] font-light text-cream uppercase max-md:text-[17vw]"
        >
          Lulu Modern
        </h1>
      </div>
    </section>
  );
}
