"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { info, links, nav } from "@/lib/content";
import { INTRO_EVENT } from "./Hero";
import { TLink } from "./PageTransition";
import { useLenis } from "./SmoothScroll";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const isActive = (href: string) => (href.includes("#") ? false : pathname === href);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useGSAP(
    () => {
      gsap.set(bar.current, { yPercent: -100, autoAlpha: 0 });
      const show = () => gsap.to(bar.current, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out" });
      window.addEventListener(INTRO_EVENT, show);

      // Solid backdrop after the hero; hide while scrolling down, reveal on the way up.
      ScrollTrigger.create({
        start: "top -80",
        end: "max",
        onUpdate: (self) => {
          bar.current?.classList.toggle("is-scrolled", self.scroll() > 80);
          if (openRef.current) return;
          const hide = self.direction === 1 && self.scroll() > 600;
          document.documentElement.classList.toggle("nav-hidden", hide);
          gsap.to(bar.current, {
            yPercent: hide ? -100 : 0,
            duration: 0.6,
            ease: "expo.out",
            overwrite: "auto",
          });
        },
      });

      return () => window.removeEventListener(INTRO_EVENT, show);
    },
    { scope: bar },
  );

  useGSAP(
    () => {
      if (!overlay.current) return;
      const q = gsap.utils.selector(overlay);
      if (open) {
        lenis?.stop();
        gsap
          .timeline()
          .set(overlay.current, { visibility: "visible" })
          .fromTo(
            overlay.current,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
          )
          .from(q("[data-menu-item]"), { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.35")
          .from(q("[data-menu-meta]"), { autoAlpha: 0, y: 20, duration: 0.8, ease: "expo.out" }, "<0.2");
      } else {
        lenis?.start();
        gsap.to(overlay.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => gsap.set(overlay.current, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open], scope: overlay },
  );

  // Pages without their own intro (everything but home) are ready straight away.
  useEffect(() => {
    document.documentElement.classList.remove("nav-hidden");
    if (document.querySelector("[data-loader]")) return;
    document.documentElement.classList.add("intro-done");
    window.dispatchEvent(new Event(INTRO_EVENT));
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Routing and hash scrolling are handled by PageTransition; the menu only needs to close.
  const close = () => {
    setOpen(false);
    lenis?.start();
  };

  return (
    <>
      <header
        ref={bar}
        className="group fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 [&.is-scrolled]:border-gold/10 [&.is-scrolled]:bg-ink/70 [&.is-scrolled]:backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-5 py-3 sm:px-10">
          <TLink href="/" onClick={close} aria-label="Lulu Modern Chinese — home">
            <Image src="/images/logo-lulu.png" alt="Lulu Modern Chinese" width={606} height={410} loading="eager" className="h-11 w-auto" />
          </TLink>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <TLink
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="link-line text-[0.7rem] tracking-[0.26em] text-cream/80 uppercase transition-colors hover:text-gold aria-[current=page]:text-gold"
              >
                {item.label}
              </TLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={links.reserve}
              target="_blank"
              rel="noreferrer"
              className="btn btn-solid hidden !px-5 !py-3 sm:inline-flex"
            >
              Reserve
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span
                className={`absolute h-px w-6 bg-cream transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`absolute h-px w-6 bg-cream transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        ref={overlay}
        id="site-menu"
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-night px-5 pt-28 pb-10 sm:px-10 lg:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <span className="pointer-events-none absolute -right-6 bottom-24 font-cn text-[40vw] leading-none font-black text-gold/[0.04]">
          味
        </span>
        <ul className="flex flex-col gap-1">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <TLink
                data-menu-item
                href={item.href}
                onClick={close}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.4rem,11vw,4.5rem)] leading-[1.05] aria-[current=page]:text-gold"
              >
                <span className="font-sans text-xs text-gold">0{i + 1}</span>
                {item.label}
              </TLink>
            </li>
          ))}
        </ul>
        <div data-menu-meta className="flex flex-col gap-5">
          <div className="flex gap-3">
            <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid flex-1 justify-center">
              Reserve
            </a>
            <a href={links.order} target="_blank" rel="noreferrer" className="btn flex-1 justify-center text-cream">
              Order
            </a>
          </div>
          <p className="text-sm text-cream/60">
            {info.address}, {info.city} · <a href={links.phone}>{info.phone}</a>
          </p>
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="intro-hide fixed inset-x-3 bottom-3 z-30 flex gap-2 transition-opacity duration-700 sm:hidden">
        <a
          href={links.reserve}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-gold py-3.5 text-center text-[0.7rem] tracking-[0.24em] text-ink uppercase shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        >
          Reserve a Table
        </a>
        <a
          href={links.order}
          target="_blank"
          rel="noreferrer"
          className="border border-gold/40 bg-ink/80 px-5 py-3.5 text-center text-[0.7rem] tracking-[0.24em] text-cream uppercase backdrop-blur"
        >
          Order
        </a>
      </div>
    </>
  );
}
