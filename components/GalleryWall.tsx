"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { links } from "@/lib/content";
import { photos, type Photo } from "@/lib/photos";
import { useLenis } from "./SmoothScroll";

const filters = [
  { id: "all", label: "All" },
  { id: "food", label: "The Food" },
  { id: "nights", label: "The Nights" },
  { id: "room", label: "The Room" },
] as const;
type Filter = (typeof filters)[number]["id"];

export default function GalleryWall() {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const list = filter === "all" ? photos : photos.filter((p) => p.tag === filter);

  // Three masonry columns, each drifting at its own speed.
  const columns: Photo[][] = [[], [], []];
  list.forEach((p, i) => columns[i % 3].push(p));

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) return;
      q("[data-tile]").forEach((tile) => {
        gsap.fromTo(
          tile,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: tile, start: "top 92%", once: true },
          },
        );
        gsap.fromTo(
          tile.querySelector("img"),
          { scale: 1.25 },
          { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: tile, start: "top 92%", once: true } },
        );
      });
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        q("[data-col]").forEach((col, i) => {
          gsap.fromTo(
            col,
            { yPercent: [0, 6, 2][i] },
            {
              yPercent: [0, -6, -2][i],
              ease: "none",
              scrollTrigger: { trigger: q("[data-wall]")[0], start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  // Lightbox.
  const show = useCallback(
    (i: number | null) => {
      setOpen(i);
      if (i === null) lenis?.start();
      else lenis?.stop();
    },
    [lenis],
  );

  useGSAP(
    () => {
      if (open === null || !box.current) return;
      gsap.fromTo(box.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        box.current.querySelector("[data-lb-img]"),
        { clipPath: "inset(8% 8% 8% 8%)", scale: 1.06 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1, ease: "expo.out" },
      );
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") show(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length, show]);

  const current = open === null ? null : list[open];

  return (
    <div ref={root} className="bg-ink px-5 pb-28 sm:px-10 lg:pl-24">
      <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gold/10 py-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter photos">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === filter}
              onClick={() => setFilter(f.id)}
              className={`border px-4 py-2 text-[0.65rem] tracking-[0.22em] uppercase transition-colors ${
                f.id === filter ? "border-gold/60 text-gold" : "border-cream/10 text-cream/55 hover:text-cream"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs tracking-[0.2em] text-cream/40 tabular-nums">{list.length} photographs</span>
      </div>

      <div data-wall key={filter} className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {columns.map((col, c) => (
          <div key={c} data-col className={`flex flex-col gap-4 lg:gap-6 ${c === 2 ? "col-span-2 grid grid-cols-2 md:col-span-1 md:flex" : ""}`}>
            {col.map((p) => {
              const idx = list.indexOf(p);
              return (
                <button
                  key={p.src}
                  type="button"
                  data-tile
                  data-cursor="View"
                  onClick={() => show(idx)}
                  className="group relative block w-full overflow-hidden text-left"
                  style={{ aspectRatio: `${p.w} / ${p.h}` }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width:768px) 30vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-4 text-xs text-cream/80 transition-transform duration-500 group-hover:translate-y-0">
                    {p.alt}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-gold/10 pt-10 sm:flex-row sm:items-center">
        <p className="max-w-md text-cream/60">
          Explore new dishes, behind-the-scenes moments, chef features, and signature tableside presentations.
        </p>
        <a href={links.instagram} target="_blank" rel="noreferrer" className="btn text-cream">
          Follow @lulu.modern ↗
        </a>
      </div>

      {current && (
        <div
          ref={box}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[78] flex flex-col bg-ink/95 backdrop-blur-xl"
          onClick={() => show(null)}
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-10">
            <span className="text-xs tracking-[0.25em] text-cream/50 tabular-nums">
              {String(open! + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => show(null)} className="text-xs tracking-[0.25em] text-cream/70 uppercase hover:text-gold">
              Close ✕
            </button>
          </div>
          <div className="relative flex-1 px-5 sm:px-16" onClick={(e) => e.stopPropagation()}>
            <div data-lb-img key={current.src} className="relative h-full w-full">
              <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={85} className="object-contain" />
            </div>
          </div>
          <div
            className="flex items-center justify-between gap-6 px-5 py-6 sm:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen((open! - 1 + list.length) % list.length)}
              className="text-xs tracking-[0.25em] text-cream/70 uppercase hover:text-gold"
            >
              ← Prev
            </button>
            <p className="truncate text-center font-display text-lg text-cream/85 italic">{current.alt}</p>
            <button
              type="button"
              onClick={() => setOpen((open! + 1) % list.length)}
              className="text-xs tracking-[0.25em] text-cream/70 uppercase hover:text-gold"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
