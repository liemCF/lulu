"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

type Props = {
  /** Wide loop for tablets and desktops. */
  desktop?: string;
  /** Tall loop for phones. */
  mobile?: string;
  /** Darkening over the film, matching the scene's photo. */
  dim?: number;
  /** object-position for the film, e.g. "50% 40%". */
  position?: string;
  /** Mirror the film left to right on wide screens. */
  flip?: boolean;
};

/**
 * A silent looping film behind a scene. It is fixed to the screen and seen through the scene's own
 * window (a clip-path), so it holds still while the copy scrolls over it, like the WebGL stage does.
 * Loads only when the scene is near the screen, and never for reduced motion or data saver.
 */
export default function SceneVideo({ desktop, mobile, dim = 0, position = "50% 50%", flip = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const box = wrap.current;
    if (!video || !box || prefersReducedMotion()) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const src = window.matchMedia("(max-width: 767px)").matches ? mobile : desktop;
    if (!src) return;

    const onPlaying = () => gsap.to(box, { opacity: 1, duration: 1.2, ease: "power2.out" });
    video.addEventListener("playing", onPlaying, { once: true });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) video.src = src;
          video.play().catch(() => {});
        } else if (video.getAttribute("src")) {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(box);
    return () => {
      video.removeEventListener("playing", onPlaying);
      io.disconnect();
    };
  }, [desktop, mobile]);

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0 -z-[15] opacity-0 [clip-path:inset(0)]">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        className={`fixed inset-x-0 top-0 h-[100lvh] w-full object-cover ${flip ? "md:-scale-x-100" : ""}`}
        style={{ objectPosition: position }}
      />
      {dim > 0 && <div className="fixed inset-x-0 top-0 h-[100lvh] bg-ink" style={{ opacity: dim }} />}
    </div>
  );
}
