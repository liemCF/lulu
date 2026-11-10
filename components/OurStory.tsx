"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
import CipherScramble from "./CipherScramble";
import Magnetic from "./Magnetic";
import { TLink } from "./PageTransition";
import Scene from "./Scene";

/** Section 5 of the homepage doc: Our Story. */
export default function OurStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => setupReveals(root.current!), { scope: root });

  return (
    <Scene
      ref={root}
      id="story"
      desktop={{ src: "/images/film-story-wide.webp", focus: [0.5, 0.4] }}
      mobile={{ src: "/images/film-story-tall.webp", focus: [0.5, 0.45] }}
      alt="Lulu, the muse of the restaurant, in a silk qipao"
      video={{ desktop: "/video/story-wide.mp4", mobile: "/video/story-tall.mp4" }}
      dim={0.1}
      shade="left"
    >
      <div className="shell grid pt-[30svh] pb-14 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-6">
          <p data-fade className="scene-label flex items-center gap-3">
            <CipherScramble text="05" className="text-gold font-serif" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <CipherScramble text="Our Story" />
          </p>
          <h2 data-split className="t-scene mt-6">
            <span className="block">Rooted in Culture.</span>
            <span className="block text-gold-soft italic font-serif">Inspired by Evolution.</span>
          </h2>
          <div data-fade className="mt-7 max-w-[34rem] space-y-4">
            <p className="font-display text-[clamp(1.35rem,1.7vw,2.1rem)] leading-snug">
              Lulu Modern was created from a simple belief: the best dining experiences honor where we come from
              while embracing where we’re going.
            </p>
            <div className="scene-copy space-y-4">
              <p>
                Inspired by the Asian American experience, we celebrate the traditions, cultures, and flavors that
                shaped us while creating something uniquely our own.
              </p>
              <p>
                The result is a restaurant where heritage and innovation exist side by side, creating memorable
                experiences built around exceptional food and hospitality.
              </p>
              <p className="text-gold-soft italic font-serif">This is modern Asian dining, reimagined.</p>
            </div>
          </div>
          <div data-fade className="mt-9">
            <Magnetic strength={0.35}>
              <TLink href="/about" className="btn text-cream hover:border-gold">
                Learn More
              </TLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </Scene>
  );
}
