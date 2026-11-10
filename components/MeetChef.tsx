"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
import CipherScramble from "./CipherScramble";
import Magnetic from "./Magnetic";
import { TLink } from "./PageTransition";
import Scene from "./Scene";

type Props = {
  id?: string;
  /** The homepage links on to the About page; the About page itself doesn't need the button. */
  showCta?: boolean;
  /** The homepage numbers its scenes; other pages pass their own mark. */
  number?: string;
};

/** Section 4 of the homepage doc: Meet the Chef. */
export default function MeetChef({ id = "chef", showCta = true, number = "04" }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => setupReveals(root.current!), { scope: root });

  return (
    // The kitchen at work. Swap in Chef Natalie's portrait once the client sends one.
    <Scene
      ref={root}
      id={id}
      desktop={{ src: "/images/duck-torch.webp", focus: [0.5, 0.5] }}
      mobile={{ src: "/images/duck-carving.webp", focus: [0.5, 0.4] }}
      alt="The Peking duck finished with a torch and hand-carved in the Lulu Modern kitchen"
      video={{ desktop: "/video/torch-wide.mp4", mobile: "/video/carve-tall.mp4" }}
      flip
      dim={0.1}
      shade="right"
    >
      <div className="shell grid pt-[30svh] pb-14 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-6 lg:col-start-7">
          <p data-fade className="scene-label flex items-center gap-3">
            <CipherScramble text={number} className="text-gold font-serif" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <CipherScramble text="Meet the Chef" />
          </p>
          <h2 data-split className="t-scene mt-6">
            Leading the Next Chapter of Lulu Modern
          </h2>

          <div data-fade className="mt-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-[0.78rem] font-medium tracking-[0.2em] text-gold uppercase">
              Executive Chef Natalie Deprez
            </span>
          </div>

          <div data-fade className="scene-copy mt-6 max-w-[34rem] space-y-4">
            <p>
              Under the direction of Executive Chef Natalie Deprez, Lulu Modern is entering an exciting new era.
            </p>
            <p>
              Our evolving menu reflects a commitment to exploring the rich culinary traditions of Asia while
              introducing fresh ideas, seasonal ingredients, and elevated dining experiences.
            </p>
            <p>
              Chef Natalie’s vision builds upon what guests already love while introducing new reasons to return.
            </p>
          </div>
          {showCta && (
            <div data-fade className="mt-9">
              <Magnetic strength={0.35}>
                <TLink href="/about#chef" className="btn text-cream hover:border-gold">
                  Meet Our Chef
                </TLink>
              </Magnetic>
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
