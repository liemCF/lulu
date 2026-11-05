"use client";

import { useEffect, useRef } from "react";
import { prefersCalmMotion, prefersReducedMotion } from "@/lib/reveal";

type Props = { className?: string };

type Ember = { x: number; y: number; r: number; vy: number; sway: number; phase: number; life: number; age: number };

/**
 * A few soft gold embers drift slowly up off the duck's flame. Replaces the old reeded-glass
 * shader, which bent and colour-fringed the photo and was hard on the eyes. Embers are small,
 * slow and sparse, nothing flickers, and the photo itself never moves or warps.
 */
export default function HeroEmbers({ className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = prefersCalmMotion();
    const count = calm ? 10 : 22;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Born low in the frame around the pan, rise for 6 to 11 seconds, fade in and out.
    const spawn = (e: Partial<Ember> = {}, fresh = false): Ember => {
      const life = 6 + Math.random() * 5;
      return {
        x: w * (0.36 + Math.random() * 0.34),
        y: h * (0.78 + Math.random() * 0.2),
        r: 0.8 + Math.random() * 1.6,
        vy: (calm ? 14 : 18) + Math.random() * 16,
        sway: 6 + Math.random() * 12,
        phase: Math.random() * Math.PI * 2,
        life,
        age: fresh ? Math.random() * life : 0,
        ...e,
      };
    };
    const embers = Array.from({ length: count }, () => spawn({}, true));

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.age += dt;
        if (e.age >= e.life) {
          embers[i] = spawn();
          continue;
        }
        const t = e.age / e.life;
        const y = e.y - e.vy * e.age;
        const x = e.x + Math.sin(e.phase + e.age * 0.6) * e.sway;
        // Smooth fade in over the first fifth, out over the last half: no flicker.
        const a = Math.min(t / 0.2, 1) * Math.min((1 - t) / 0.5, 1) * 0.75;
        const glow = e.r * 5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
        g.addColorStop(0, `rgba(255, 214, 140, ${a})`);
        g.addColorStop(0.25, `rgba(242, 168, 72, ${a * 0.55})`);
        g.addColorStop(1, "rgba(242, 140, 50, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, glow, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
