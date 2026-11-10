"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveal";
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
          <p data-fade className="scene-label">
            <span>07</span>Private Dining &amp; Celebrations
          </p>
          <h2 data-split className="t-scene mt-6">
            Celebrations Deserve Something Extraordinary
          </h2>
          <p data-fade className="scene-copy mt-7 max-w-[34rem]">
            From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
            dining experiences for every occasion.
          </p>
          <div data-fade className="mt-9">
            <TLink href="/private-dining" className="btn btn-solid">
              Plan Your Event
            </TLink>
          </div>
        </div>
      </div>
    </Scene>
  );
}
