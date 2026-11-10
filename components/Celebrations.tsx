"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
import CipherScramble from "./CipherScramble";
import Magnetic from "./Magnetic";
import { TLink } from "./PageTransition";
import Scene from "./Scene";

/** Section 7 of the homepage doc: Private Dining & Celebrations. */
export default function Celebrations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => setupReveals(root.current!), { scope: root });

  return (
    <Scene
      ref={root}
      id="private"
      desktop={{ src: "/images/film-party-wide.webp", focus: [0.6, 0.45] }}
      mobile={{ src: "/images/film-party-wide.webp", focus: [0.62, 0.45] }}
      alt="A full dining room celebrating at Lulu Modern"
      video={{ desktop: "/video/party-wide.mp4", mobile: "/video/party-wide.mp4", position: "62% 45%" }}
      dim={0.15}
      shade="left"
    >
      <div className="shell grid pt-[30svh] pb-14 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-7">
          <p data-fade className="scene-label flex items-center gap-3">
            <CipherScramble text="07" className="text-gold font-serif" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <CipherScramble text="Private Dining & Celebrations" />
          </p>
          <h2 data-split className="t-scene mt-6">
            Gather Around <br className="hidden sm:inline" />
            <em className="text-gold-soft font-serif italic">Something Extraordinary</em>
          </h2>
          <p data-fade className="scene-copy mt-7 max-w-[34rem]">
            From intimate celebrations and family gatherings to corporate dinners and holiday events, Lulu Modern
            creates experiences designed to bring people together.
          </p>
          <p data-fade className="scene-copy mt-4 max-w-[34rem]">
            Exceptional food, thoughtful service, and unforgettable moments are at the center of every table.
          </p>

          <div data-fade className="mt-8 flex flex-wrap gap-2.5">
            {["Seated Dinners · up to 120 Guests", "Standing & Cocktail · 150+", "Full Venue Buy-Out"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold/30 bg-ink/75 px-3.5 py-1 text-[0.72rem] tracking-wider text-cream/90 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div data-fade className="mt-9">
            <Magnetic strength={0.4}>
              <TLink href="/private-dining" className="btn btn-solid shadow-lg shadow-gold/10">
                Private Dining &amp; Events
              </TLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </Scene>
  );
}
