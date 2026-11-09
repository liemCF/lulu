"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { info, links, nav, type NavItem } from "@/lib/content";
import { INTRO_EVENT } from "./Hero";
import { TLink } from "./PageTransition";
import { useLenis } from "./SmoothScroll";

// Desktop splits the page links around the logo; Reservations is the gold button on the right.
const pageLinks = nav.filter((item) => !item.external);
const leftLinks = pageLinks.slice(0, 4);
const rightLinks = pageLinks.slice(4);
const reservations = nav.find((item) => item.external) ?? { label: "Reservations", href: links.reserve };

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const barLink = (item: NavItem) => (
    <TLink
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      className="link-line py-1 text-[0.8rem] font-medium tracking-[0.14em] whitespace-nowrap text-cream/85 uppercase transition-colors hover:text-cream aria-[current=page]:text-gold"
    >
      {item.label}
    </TLink>
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useGSAP(
    () => {
      gsap.set(bar.current, { yPercent: -100, autoAlpha: 0 });
      const show = () => gsap.to(bar.current, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out" });
      window.addEventListener(INTRO_EVENT, show);

      // Transparent over the hero, a solid hairlined bar once the page moves.
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => bar.current?.setAttribute("data-scrolled", String(self.isActive)),
      });

      // Hide while scrolling down, reveal on the way up. Only tween when that actually flips.
      let hidden = false;
      ScrollTrigger.create({
        start: "top -80",
        end: "max",
        onUpdate: (self) => {
          if (openRef.current) return;
          const hide = self.direction === 1 && self.scroll() > 600;
          if (hide === hidden) return;
          hidden = hide;
          document.documentElement.classList.toggle("nav-hidden", hide);
          gsap.to(bar.current, { yPercent: hide ? -100 : 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
        },
      });

      return () => window.removeEventListener(INTRO_EVENT, show);
    },
    { scope: bar },
  );

  // One timeline, played forward to open and reversed to close, so quick toggles can't strand it.
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(overlay);
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(overlay.current, { visibility: "visible" })
        .fromTo(
          overlay.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" },
        )
        .fromTo(q("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: "expo.out" }, "-=0.35");
    },
    { scope: overlay },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    // Keep the page behind out of reach while the menu is up.
    const behind = document.querySelectorAll("main, footer");
    if (open) {
      lenis?.stop();
      behind.forEach((el) => el.setAttribute("inert", ""));
      tl.timeScale(1).play();
      overlay.current?.querySelector<HTMLElement>("[data-menu-item]")?.focus({ preventScroll: true });
    } else if (tl.progress() > 0) {
      lenis?.start();
      behind.forEach((el) => el.removeAttribute("inert"));
      tl.timeScale(1.4).reverse();
    }
  }, [open, lenis]);

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
      {/* Full-width bar: links (or the menu toggle on small screens), logo, reserve. */}
      <header
        ref={bar}
        data-open={open}
        className="intro-hide group/nav fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-500 data-[scrolled=true]:border-gold/15 data-[scrolled=true]:bg-ink/85 data-[scrolled=true]:backdrop-blur-xl data-[open=true]:!border-transparent data-[open=true]:!bg-transparent data-[open=true]:!backdrop-blur-none"
      >
        {/* Keeps the bar legible over the hero photo before it turns solid */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink/70 to-transparent transition-opacity duration-500 group-data-[open=true]/nav:opacity-0 group-data-[scrolled=true]/nav:opacity-0" />
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center px-5 transition-[height] duration-500 group-data-[scrolled=true]/nav:h-16 sm:px-8 lg:px-12">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group -ml-1 flex h-11 items-center gap-3 px-1 text-[0.8rem] font-medium tracking-[0.14em] text-cream uppercase transition-colors hover:text-gold xl:hidden"
            >
              <span className="relative flex h-3 w-6 flex-col justify-between">
                <span className={`h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
                <span className={`h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[5.5px] -rotate-45" : "group-hover:w-2/3"}`} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
            <nav aria-label="Main" className="hidden items-center gap-7 xl:flex 2xl:gap-10">
              {leftLinks.map(barLink)}
            </nav>
          </div>

          <TLink href="/" onClick={close} aria-label="Lulu Modern Chinese — home" className="justify-self-center">
            <Image
              src="/images/logo-lulu.png"
              alt="Lulu Modern Chinese"
              width={606}
              height={410}
              loading="eager"
              className="h-11 w-auto transition-[height] duration-500 group-data-[scrolled=true]/nav:h-9"
            />
          </TLink>

          <div className="flex items-center justify-end gap-7 2xl:gap-10">
            <nav aria-label="More" className="hidden items-center gap-7 xl:flex 2xl:gap-10">
              {rightLinks.map(barLink)}
            </nav>
            <a href={reservations.href} target="_blank" rel="noreferrer" className="btn btn-solid hidden !px-6 !py-3 sm:inline-flex">
              {reservations.label}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        ref={overlay}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-lenis-prevent
        className="invisible fixed inset-0 z-40 flex flex-col justify-between gap-10 overflow-y-auto overscroll-contain bg-night px-5 pt-28 pb-10 sm:px-10 lg:grid lg:grid-cols-2 lg:items-end lg:gap-16 lg:px-24 lg:pt-32 lg:pb-16"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const cls =
              "flex items-baseline gap-4 py-0.5 font-display text-[clamp(2rem,min(9vw,6.2svh),4.75rem)] leading-[1.08] transition-colors hover:text-gold aria-[current=page]:text-gold";
            return (
              <li key={item.href} className="overflow-hidden">
                {item.external ? (
                  <a data-menu-item href={item.href} target="_blank" rel="noreferrer" onClick={close} className={cls}>
                    {item.label} <span className="text-[0.5em] text-gold">↗</span>
                  </a>
                ) : (
                  <TLink
                    data-menu-item
                    href={item.href}
                    onClick={close}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cls}
                  >
                    {item.label}
                  </TLink>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile menu bottom action & concierge details */}
        <div className="border-t border-cream/15 pt-6 flex flex-col gap-3">
          <a
            href={reservations.href}
            target="_blank"
            rel="noreferrer"
            className="btn btn-solid w-full justify-center text-center !py-3.5 shadow-lg shadow-gold/10"
          >
            Reserve a Table on OpenTable ↗
          </a>
          <div className="text-center text-[0.78rem] text-cream/65">
            <p>3310 Dallas Pkwy Suite 121, Plano, TX</p>
            <p className="mt-0.5 text-gold">{info.phone}</p>
          </div>
        </div>
      </div>
    </>
  );
}
