"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, setupReveals } from "@/lib/reveal";
import { links } from "@/lib/content";
import { menu, type MenuItem, type MenuSection } from "@/lib/menu";
import { useLenis } from "./SmoothScroll";

// Photos only where the picture matches the section.
const sectionArt: Record<string, { src: string; alt: string }> = {
  dumplings: { src: "/images/dish-wagyu-xlb.webp", alt: "Soup dumplings in a bamboo steamer" },
  duck: { src: "/images/duck-plated.webp", alt: "Carved Peking duck with condiments" },
  entrees: { src: "/images/dish-short-rib.webp", alt: "Beef short rib in a smoking box" },
  "signature-cocktails": { src: "/images/night-cocktail.webp", alt: "A bartender finishing a cocktail" },
  "nightlife-shots": { src: "/images/night-cheers.webp", alt: "A table raising shots" },
  champagne: { src: "/images/night-sparklers.webp", alt: "Bottle service with sparklers" },
};

function Item({ item, neon }: { item: MenuItem; neon: boolean }) {
  return (
    <li data-item className="group border-b border-cream/10 py-5">
      <div className="flex items-baseline gap-3">
        <h4 className="font-display text-[1.35rem] leading-tight transition-colors duration-500 group-hover:text-gold">
          {item.name}
        </h4>
        {item.cn && <span className="font-cn text-sm text-gold/70">{item.cn}</span>}
        <span className="mx-1 h-px flex-1 translate-y-[-0.3em] border-b border-dotted border-cream/20" />
        <span className={`text-sm tabular-nums ${neon ? "text-neon" : "text-gold"}`}>{item.price ?? "Options"}</span>
      </div>
      {(item.desc || item.spicy || item.gf || item.gfAvailable) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {item.desc && <p className="max-w-[46ch] text-sm leading-relaxed text-cream/55">{item.desc}</p>}
          {!!item.spicy && (
            <span className="font-cn text-xs text-cinnabar" title={`Spicy (${item.spicy})`}>
              {"辣".repeat(item.spicy)}
            </span>
          )}
          {(item.gf || item.gfAvailable) && (
            <span className="border border-cream/20 px-1.5 py-0.5 text-[0.6rem] tracking-[0.2em] text-cream/60 uppercase">
              {item.gf ? "GF" : "GF available"}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

function Section({ section, index, neon }: { section: MenuSection; index: number; neon: boolean }) {
  const art = sectionArt[section.id];
  return (
    <section id={section.id} data-section className="scroll-mt-40 py-16 first:pt-10 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <span className="text-xs tracking-[0.3em] text-cream/40 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 data-split className="mt-3 font-display text-[clamp(2.4rem,4vw,3.8rem)] leading-none">
              {section.title}
            </h3>
            <p className={`mt-3 font-cn text-2xl font-black ${neon ? "neon-text" : "text-gold"}`}>{section.cn}</p>
            {art && (
              <div data-clip className="relative mt-8 hidden aspect-[4/5] w-full max-w-[320px] overflow-hidden lg:block">
                <Image src={art.src} alt={art.alt} fill sizes="320px" className="object-cover" />
              </div>
            )}
            {section.id === "duck" && (
              <a
                href={links.duckExperience}
                target="_blank"
                rel="noreferrer"
                className="btn btn-solid mt-8"
              >
                Reserve the duck
              </a>
            )}
          </div>
        </div>
        <ul className="lg:col-span-7 lg:col-start-6">
          {section.items.map((it) => (
            <Item key={it.name + (it.price ?? "")} item={it} neon={neon} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function MenuBoard() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(menu[0].id);
  const [activeSection, setActiveSection] = useState(menu[0].sections[0].id);
  const lenis = useLenis();
  const group = menu.find((g) => g.id === tab)!;
  const neon = tab === "after-dark";

  useGSAP(
    () => {
      setupReveals(root.current!);
      const q = gsap.utils.selector(root);
      q("[data-section]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActiveSection(el.id),
        });
      });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        q("[data-board]"),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" },
      );
      q("[data-section]").forEach((el) => {
        gsap.from(el.querySelectorAll("[data-item]"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [tab], revertOnUpdate: true },
  );

  const switchTab = (id: string) => {
    if (id === tab) return;
    // The tab bar is sticky, so measure where the board starts instead.
    const top = root.current!.getBoundingClientRect().top + window.scrollY;
    const go = () => {
      setTab(id);
      setActiveSection(menu.find((g) => g.id === id)!.sections[0].id);
      lenis?.scrollTo(Math.min(window.scrollY, top), { immediate: true, force: true });
    };
    if (prefersReducedMotion()) return go();
    gsap.to(root.current!.querySelector("[data-board]"), { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in", onComplete: go });
  };

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) lenis?.scrollTo(el, { offset: -150, duration: 1.4, force: true });
  };

  return (
    <div ref={root} className={`relative transition-colors duration-700 ${neon ? "bg-[#050509]" : "bg-ink"}`}>
      {neon && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_30%_at_80%_10%,rgba(255,46,126,0.14),transparent_70%)]" />
      )}

      {/* Sticky tabs + section chips */}
      <div data-tabs className="sticky-under-nav sticky z-30 border-y border-gold/10 bg-ink/80 backdrop-blur-xl">
        <div className="flex items-center gap-1 px-5 pt-3 sm:px-10 lg:pl-24" role="tablist" aria-label="Menu">
          {menu.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={g.id === tab}
              onClick={() => switchTab(g.id)}
              className={`group relative flex items-baseline gap-2 px-3 py-3 text-[0.65rem] tracking-[0.22em] whitespace-nowrap uppercase transition-colors first:pl-0 sm:px-4 sm:text-[0.7rem] sm:tracking-[0.28em] ${
                g.id === tab ? (g.id === "after-dark" ? "text-neon" : "text-gold") : "text-cream/50 hover:text-cream"
              }`}
            >
              <span className="hidden font-cn text-sm tracking-normal sm:inline">{g.cn}</span>
              {g.label}
              <span
                className={`absolute inset-x-3 bottom-0 h-px origin-left bg-current transition-transform duration-500 group-first:left-0 sm:inset-x-4 ${
                  g.id === tab ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:px-10 lg:pl-24">
          {group.sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jump(s.id)}
              className={`shrink-0 border px-3 py-1.5 text-[0.65rem] tracking-[0.18em] whitespace-nowrap uppercase transition-colors ${
                s.id === activeSection
                  ? neon
                    ? "border-neon/60 text-neon"
                    : "border-gold/60 text-gold"
                  : "border-cream/10 text-cream/50 hover:border-cream/30 hover:text-cream"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div data-board key={tab} className="relative px-5 pb-24 sm:px-10 lg:pl-24">
        {neon && (
          <div className="pt-16 lg:pt-24">
            <h2 className="neon-text font-display text-[clamp(3.5rem,10vw,9rem)] leading-none whitespace-nowrap italic">After Dark</h2>
            <p className="mt-6 max-w-lg text-cream/65">
              Nightlife shots, champagne and bottle service for the late crowd. Fridays until 11:30 PM, Saturdays
              until midnight.
            </p>
          </div>
        )}
        {group.sections.map((s, i) => (
          <Section key={s.id} section={s} index={i} neon={neon} />
        ))}
        <p className="border-t border-cream/10 pt-8 text-xs leading-relaxed text-cream/40">
          Prices in USD, before tax. Menu and prices may change.{" "}
          <a href={links.order} target="_blank" rel="noreferrer" className="link-line text-gold">
            Order pickup & takeout on Toast ↗
          </a>
        </p>
      </div>
    </div>
  );
}
