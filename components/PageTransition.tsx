"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { INTRO_EVENT } from "./Hero";
import { useLenis } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

/** next/link that closes the doors before routing. */
export function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(typeof href === "string" ? href : (href.pathname ?? "/") + (href.hash ?? ""));
      }}
    />
  );
}

/**
 * Route changes close the same lacquer doors as the home intro, swap the page behind them,
 * then open again. Internal <a href="/..."> clicks anywhere are picked up automatically.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef(false);

  const scrollToHash = useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, force: true });
      else target.scrollIntoView();
    },
    [lenis],
  );

  const navigate = useCallback((href: string) => {
    if (busy.current) return;
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname) {
      if (url.hash) scrollToHash(url.hash);
      else lenis?.scrollTo(0, { duration: 1.4, force: true });
      return;
    }
    if (prefersReducedMotion()) {
      router.push(url.pathname + url.hash);
      return;
    }
    busy.current = true;
    pending.current = true;
    const q = gsap.utils.selector(root);
    gsap
      .timeline({ onComplete: () => router.push(url.pathname + url.hash, { scroll: false }) })
      .set(root.current, { display: "block" })
      .fromTo(q("[data-tdoor='l']"), { xPercent: -100 }, { xPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
      .fromTo(q("[data-tdoor='r']"), { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: "expo.inOut" }, 0)
      .fromTo(q("[data-tmark]"), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 0.5);
  }, [lenis, router, scrollToHash]);

  // New page is in: reset scroll, then open the doors (unless the page has its own intro).
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const q = gsap.utils.selector(root);
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const hasOwnIntro = !!document.querySelector("[data-loader]");
      if (hasOwnIntro) {
        // The home intro opens identical doors; just hand over.
        gsap.set(root.current, { display: "none" });
        busy.current = false;
        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(root.current, { display: "none" });
            busy.current = false;
            if (window.location.hash) scrollToHash(window.location.hash);
          },
        })
        .to(q("[data-tmark]"), { autoAlpha: 0, y: -8, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(q("[data-tdoor='l']"), { xPercent: -100, duration: 1.2, ease: "expo.inOut" }, 0.35)
        .to(q("[data-tdoor='r']"), { xPercent: 100, duration: 1.2, ease: "expo.inOut" }, 0.35);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pick up plain internal links site-wide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href")!;
      if (!href.startsWith("/") && !href.startsWith("#")) return;
      e.preventDefault();
      navigate(href.startsWith("#") ? window.location.pathname + href : href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // Arriving on the home page with a hash (e.g. /#duck): scroll there once the intro releases.
  useEffect(() => {
    const onIntro = () => {
      if (window.location.hash) window.setTimeout(() => scrollToHash(window.location.hash), 350);
    };
    window.addEventListener(INTRO_EVENT, onIntro);
    return () => window.removeEventListener(INTRO_EVENT, onIntro);
  });

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={root} className="fixed inset-0 z-[75] hidden" aria-hidden>
        <div data-tdoor="l" className="absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-ink" />
        <div data-tdoor="r" className="absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-ink" />
        <div data-tmark className="absolute inset-0 flex items-center justify-center opacity-0">
          <Image src="/images/logo-lulu.png" alt="" width={606} height={410} className="h-auto w-[min(150px,40vw)]" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
