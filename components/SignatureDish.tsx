"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";
import CipherScramble from "./CipherScramble";
import Magnetic from "./Magnetic";
import Scene from "./Scene";
import Duck3D from "./three/Duck3D";

const beats = ["Crispy skin.", "Hand-carved service.", "Unforgettable presentation."];

/** Section 2 of the homepage doc: The Signature Experience. */
export default function SignatureDish() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // The three beats are ruled off one after another, each line drawing in before its words rise.
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-beats]")[0], start: "top 86%" } });
      tl.fromTo(
        q("[data-beat-rule]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, stagger: 0.14, ease: "expo.inOut" },
      ).fromTo(
        q("[data-beat-line]"),
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, stagger: 0.14, ease: "expo.out" },
        0.35,
      );
    },
    { scope: root },
  );

  return (
    <Scene
      ref={root}
      id="duck"
      desktop={{ src: "/images/duck-torch.webp", focus: [0.3, 0.5] }}
      mobile={{ src: "/images/story-mural.webp", focus: [0.5, 0.7] }}
      alt="The Flaming Peking Duck set alight tableside at Lulu Modern"
      dim={0.7}
      shade="left"
    >
      {/* The dish itself, in interactive 3D: drag to rotate, tap/click to flambé flame */}
      <div
        data-cursor="Flambé 🔥"
        className="relative inset-x-0 top-[9svh] h-[54svh] lg:absolute lg:inset-y-0 lg:top-0 lg:right-0 lg:left-auto lg:h-full lg:w-[56%]"
      >
        <Duck3D className="pointer-events-auto h-full w-full cursor-grab active:cursor-grabbing" />
        <div className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center lg:bottom-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ink/80 px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.2em] text-gold uppercase backdrop-blur-md shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
            <span>Drag to Rotate · Tap to Flambé</span>
          </span>
        </div>
      </div>

      <div className="shell relative grid pt-[60svh] pb-14 lg:grid-cols-12 lg:pt-[20svh] lg:pb-20">
        <div className="lg:col-span-6">
          <p data-fade className="scene-label flex items-center gap-3">
            <CipherScramble text="02" className="text-gold font-serif" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <CipherScramble text="The Signature Experience" />
          </p>
          <h2 data-split className="t-scene mt-6">
            The Dish That Put Us on the Map
          </h2>
          <div data-fade className="scene-copy mt-7 max-w-[34rem] space-y-4">
            <p>Our Flaming Peking Duck is more than a dish. It’s an experience.</p>
            <p>
              Prepared using time-honored techniques and presented with dramatic tableside flair, it has become one
              of the most talked-about dining experiences in Dallas-Fort Worth.
            </p>
          </div>

          <ul data-beats className="mt-8 max-w-[34rem]">
            {beats.map((line, i) => (
              <li key={line} className="relative flex items-baseline gap-6 py-4 lg:py-5">
                <span data-beat-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-cream/25" />
                <CipherScramble
                  text={`0${i + 1}`}
                  trigger="hover"
                  className="text-[0.75rem] font-medium tracking-[0.2em] text-gold tabular-nums"
                />
                <span className="overflow-hidden pb-[0.12em]">
                  <span
                    data-beat-line
                    className="block font-display text-[clamp(1.45rem,1.9vw,2.5rem)] leading-none tracking-[-0.01em] italic"
                  >
                    {line}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p data-fade className="scene-copy mt-6 max-w-[34rem]">
            Whether celebrating a special occasion or gathering for an evening out, the Flaming Peking Duck is the
            centerpiece of the Lulu experience.
          </p>

          <div data-fade className="mt-8">
            <Magnetic strength={0.4}>
              <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
                Experience the Duck
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </Scene>
  );
}
