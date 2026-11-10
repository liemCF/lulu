"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

type Props = { src: string; className?: string };

/**
 * A small silent loop laid over a still photo (a dish that steams, a pot that simmers).
 * It fetches and plays only while on screen, and never for reduced motion or data saver.
 */
export default function LoopVideo({ src, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const onPlaying = () => gsap.to(video, { opacity: 1, duration: 0.9, ease: "power2.out" });
    video.addEventListener("playing", onPlaying, { once: true });
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.getAttribute("src")) video.src = src;
        video.play().catch(() => {});
      } else if (video.getAttribute("src")) {
        video.pause();
      }
    });
    io.observe(video);
    return () => {
      video.removeEventListener("playing", onPlaying);
      io.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={`absolute inset-0 h-full w-full object-cover opacity-0 ${className}`}
    />
  );
}
