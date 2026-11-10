"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import CipherScramble from "./CipherScramble";
import LoopVideo from "./LoopVideo";
import Magnetic from "./Magnetic";
import { TLink } from "./PageTransition";
import Scene from "./Scene";

const plates: { src: string; name: string; cn: string; video?: string }[] = [
  { src: "/images/dish-peking-duck.webp", name: "Whole Peking Duck", cn: "北京烤鸭" },
  { src: "/images/dish-wagyu-xlb.webp", name: "Wagyu XLB", cn: "和牛小笼" },
  { src: "/images/dish-sichuan-chicken.webp", name: "Sichuan Crispy Chicken", cn: "辣子鸡" },
  { src: "/images/dish-pickled-fish.webp", name: "Sichuan Pickled Fish", cn: "酸菜鱼", video: "/video/fish-tile.mp4" },
  { src: "/images/dish-pork-xlb.webp", name: "Traditional Pork XLB", cn: "小笼包", video: "/video/steam-tile.mp4" },
  { src: "/images/dish-wok.webp", name: "Wok-Tossed Beef", cn: "镬气和牛" },
];

/** Section 3 of the homepage doc: New Asian Menu. */
export default function MenuShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current!);
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // The plates are laid out one by one, each unveiled from the bottom as its photo settles.
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-plates]")[0], start: "top 88%" } });
      tl.fromTo(
        q("[data-plate]"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.09, ease: "expo.inOut" },
      ).fromTo(q("[data-plate] img"), { scale: 1.35 }, { scale: 1, duration: 1.9, stagger: 0.09, ease: "expo.out" }, 0.1);

      // Interactive 3D Perspective Tilt on menu plate cards
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        q("[data-tilt-card]").forEach((card) => {
          const el = card as HTMLElement;
          const glare = el.querySelector("[data-glare]") as HTMLElement;

          const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotX = (y - 0.5) * -16;
            const rotY = (x - 0.5) * 16;

            gsap.to(el, {
              transform: `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.05, 1.05, 1.05)`,
              duration: 0.35,
              ease: "power2.out",
            });

            if (glare) {
              gsap.to(glare, {
                opacity: 0.7,
                background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
                duration: 0.2,
              });
            }
          };

          const handleLeave = () => {
            gsap.to(el, {
              transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
            });
            if (glare) gsap.to(glare, { opacity: 0, duration: 0.4 });
          };

          el.addEventListener("mousemove", handleMove);
          el.addEventListener("mouseleave", handleLeave);
        });
      }
    },
    { scope: root },
  );

  return (
    <Scene
      ref={root}
      id="menu"
      desktop={{ src: "/images/film-feast-wide.webp", focus: [0.5, 0.5] }}
      mobile={{ src: "/images/film-feast-tall.webp", focus: [0.5, 0.5] }}
      alt="A table laid with dishes from across the Lulu Modern menu"
      video={{ desktop: "/video/feast-wide.mp4", mobile: "/video/feast-tall.mp4" }}
      dim={0.42}
      shade="left"
    >
      <div className="grid gap-y-10 pt-[26svh] pb-14 lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:px-[clamp(1.25rem,5vw,7rem)] lg:pb-24">
        <div className="max-lg:px-5 lg:col-span-6">
          <p data-fade className="scene-label flex items-center gap-3">
            <CipherScramble text="03" className="text-gold font-serif" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            <CipherScramble text="New Asian Menu" />
          </p>
          <h2 data-split className="t-scene mt-6">
            Inspired by Asia. Designed for Today.
          </h2>
          <div data-fade className="scene-copy mt-7 max-w-[34rem] space-y-4">
            <p>
              Lulu Modern celebrates the flavors, traditions, and culinary techniques found across Asia while honoring
              the roots that inspired our journey.
            </p>
            <p>
              From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
              quality ingredients, bold flavors, and elevated hospitality.
            </p>
          </div>

          <div data-fade className="mt-8">
            <Magnetic strength={0.35}>
              <TLink href="/menu" className="btn btn-solid shadow-lg shadow-gold/10">
                View Full Menu
              </TLink>
            </Magnetic>
          </div>
        </div>

        {/* 3D Holographic Perspective Tilt Cards */}
        <div
          data-plates
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:col-span-5 lg:col-start-8 lg:grid lg:grid-cols-3 lg:gap-3.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {plates.map((p) => (
            <figure
              key={p.src}
              data-plate
              data-tilt-card
              data-cursor="Taste ✦"
              className="group relative aspect-[3/4] w-[38vw] shrink-0 snap-start overflow-hidden rounded-xl border border-cream/15 bg-night shadow-xl sm:w-[24vw] lg:w-auto transition-shadow duration-300 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image src={p.src} alt={p.name} fill sizes="(min-width: 1024px) 14vw, 38vw" className="object-cover" />
              {/* Some plates are alive: the dumplings steam, the fish pot simmers */}
              {p.video && <LoopVideo src={p.video} />}

              {/* Specular Glare Reflection Overlay */}
              <div
                data-glare
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity"
              />

              {/* Calligraphy Badge Floating on Top */}
              <div className="absolute top-2.5 right-2.5 z-10 rounded bg-ink/80 px-2 py-0.5 font-serif text-[0.7rem] tracking-widest text-gold backdrop-blur-md border border-gold/20">
                {p.cn}
              </div>

              {/* Caption Overlay on Hover */}
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-display text-sm text-cream leading-tight">{p.name}</p>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </Scene>
  );
}
