"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

const CIPHER_GLYPHS = "壹贰叁肆烤鸭焰席龙凤醇雅韵礼厨镬气香酥盛味膳璞玉珍";

type Props = {
  text: string;
  as?: "span" | "h2" | "h3" | "p" | "div";
  className?: string;
  glyphs?: string;
  duration?: number;
  trigger?: "scroll" | "hover" | "mount";
};

/**
 * Asian Calligraphy Cipher: Characters rapidly flip through ancient Chinese calligraphy
 * characters before locking into the target text with a golden flash.
 */
export default function CipherScramble({
  text,
  as: Component = "span",
  className = "",
  glyphs = CIPHER_GLYPHS,
  duration = 0.45,
  trigger = "scroll",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const animating = useRef(false);

  const runCipher = () => {
    const el = root.current;
    if (!el || animating.current || prefersReducedMotion()) return;
    animating.current = true;

    const chars = text.split("");
    const totalSteps = Math.max(12, Math.round(duration * 40));
    let step = 0;

    const interval = window.setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const resolvedCount = Math.floor(progress * chars.length);

      const display = chars
        .map((char, i) => {
          if (char === " " || char === "\n") return char;
          if (i < resolvedCount) return char;
          // Random glyph from the calligraphy set
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      el.textContent = display;

      if (step >= totalSteps) {
        clearInterval(interval);
        el.textContent = text;
        animating.current = false;

        // Subtle gold glint pulse upon resolve
        gsap.fromTo(
          el,
          { filter: "brightness(1.5) drop-shadow(0 0 8px rgba(226,199,132,0.8))" },
          { filter: "brightness(1) drop-shadow(0 0 0px rgba(226,199,132,0))", duration: 0.5, ease: "power2.out" },
        );
      }
    }, (duration * 1000) / totalSteps);
  };

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    if (trigger === "mount") {
      runCipher();
      return;
    }

    if (trigger === "scroll") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            runCipher();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
  }, [text, trigger]);

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- one ref shared by five possible tags
      ref={root as any}
      className={`inline-block font-variant-numeric:lining-nums transition-colors duration-300 ${className}`}
      onPointerEnter={trigger === "hover" ? runCipher : undefined}
    >
      {text}
    </Component>
  );
}

