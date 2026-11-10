"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion } from "@/lib/reveal";
import { useLenis } from "./SmoothScroll";

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Two photos, old (A) and new (B). As the next scene scrolls in, a flame front climbs the screen:
// the old photo shimmers in the heat, chars, and burns away along a glowing ember line to show the new one.
const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uImgA;
uniform vec2 uImgB;
uniform vec2 uFocusA;
uniform vec2 uFocusB;
uniform vec2 uPointer;
uniform float uMix;
uniform float uTime;
uniform float uDimA;
uniform float uDimB;
uniform float uZoomA;
uniform float uZoomB;
uniform float uFlipA;
uniform float uFlipB;
varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p *= 2.03; a *= 0.5; }
  return s * 0.5 + 0.5;
}

// object-fit: cover around a focal point, with a little zoom to spare for drift.
vec2 cover(vec2 uv, vec2 img, vec2 focus, float zoom) {
  float rs = uRes.x / uRes.y;
  float ri = img.x / img.y;
  vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  scale /= zoom;
  vec2 f = clamp(focus, scale * 0.5, 1.0 - scale * 0.5);
  return (uv - 0.5) * scale + f;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 drift = uPointer * 0.005;

  // The flame front: mostly bottom to top, with a ragged, slowly moving edge.
  float n = fbm(vec2(uv.x * aspect * 2.3, uv.y * 2.3 - uTime * 0.05));
  float fine = snoise(vec2(uv.x * aspect * 13.0, uv.y * 13.0 - uTime * 0.45)) * 0.5 + 0.5;
  float field = uv.y * 0.62 + n * 0.3 + fine * 0.08;
  float front = uMix * 1.36 - 0.18;
  float d = field - front;            // > 0 where the old photo is still standing
  float keep = smoothstep(0.0, 0.012, d);
  float live = step(0.001, uMix) * step(uMix, 0.999);

  // Heat shimmer in the old photo just above the front.
  float heat = keep * (1.0 - smoothstep(0.0, 0.22, d)) * live;
  vec2 wob = vec2(
    snoise(vec2(uv.x * aspect * 18.0, uv.y * 12.0 - uTime * 1.6)),
    snoise(vec2(uv.x * aspect * 11.0 + 4.0, uv.y * 16.0 - uTime * 2.1))
  ) * 0.006 * heat;

  vec2 ua = uv + wob;
  vec2 ub = uv;
  ua.x = mix(ua.x, 1.0 - ua.x, uFlipA);
  ub.x = mix(ub.x, 1.0 - ub.x, uFlipB);
  vec3 a = texture2D(uA, cover(ua, uImgA, uFocusA, uZoomA) + drift).rgb * (1.0 - uDimA);
  vec3 b = texture2D(uB, cover(ub, uImgB, uFocusB, uZoomB) + drift).rgb * (1.0 - uDimB);
  // The old photo chars before it goes.
  a *= 1.0 - 0.75 * (1.0 - smoothstep(0.0, 0.09, d)) * live;
  vec3 col = mix(b, a, keep);

  // Ember line and the glow it throws up the old photo.
  float rim = exp(-abs(d) * 90.0);
  float glow = exp(-max(d, 0.0) * 16.0) * keep;
  col += (vec3(1.0, 0.86, 0.55) * rim * 0.9 + vec3(1.0, 0.36, 0.06) * glow * 0.42) * live;

  vec2 q = uv - 0.5;
  col *= 1.0 - dot(q, q) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

/** Next's image optimiser: a screen-sized photo for the GPU, not the full original. */
const optimised = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

type Props = {
  /** Section names for the side index, in page order; one per <Scene>. */
  labels: string[];
};

/**
 * The fixed canvas behind the homepage scenes, plus the side index.
 * It finds every [data-scene] on the page, draws the photo of whichever one is on screen, and as the
 * next one scrolls in burns the old photo away. Without WebGL, or with reduced motion, it draws nothing
 * and each scene keeps its own photo.
 */
export default function Stage({ labels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const canvas = canvasRef.current;
    const rail = railRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    if (els.length < 2) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const loc = {
      res: u("uRes"),
      imgA: u("uImgA"),
      imgB: u("uImgB"),
      focusA: u("uFocusA"),
      focusB: u("uFocusB"),
      pointer: u("uPointer"),
      mix: u("uMix"),
      time: u("uTime"),
      dimA: u("uDimA"),
      dimB: u("uDimB"),
      zoomA: u("uZoomA"),
      zoomB: u("uZoomB"),
      flipA: u("uFlipA"),
      flipB: u("uFlipB"),
    };
    gl.uniform1i(u("uA"), 0);
    gl.uniform1i(u("uB"), 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const calm = prefersCalmMotion();
    const scenes = els.map((el) => {
      const focus = ((phone ? el.dataset.focusM : el.dataset.focus) ?? "0.5,0.5").split(",").map(Number);
      return {
        el,
        src: (phone ? el.dataset.srcM : el.dataset.src) ?? "",
        focus: [focus[0], 1 - focus[1]] as [number, number],
        dim: Number(el.dataset.dim ?? 0.3),
        // Mirrored scenes are only mirrored on wide screens, like their photo and film.
        flip: el.dataset.flip && !phone ? 1 : 0,
        tex: null as WebGLTexture | null,
        w: 1,
        h: 1,
      };
    });

    let disposed = false;
    let on = false;
    const html = document.documentElement;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const s = scenes[i];
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return resolve();
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          s.tex = tex;
          s.w = img.naturalWidth;
          s.h = img.naturalHeight;
          bound = [-1, -1];
          resolve();
        };
        img.onerror = () => resolve();
        img.src = optimised(s.src, phone ? 1080 : 1920);
      });
    // The first two scenes, then the rest one at a time so the page stays responsive.
    (async () => {
      await Promise.all([load(0), load(1)]);
      if (disposed || !scenes[0].tex) return;
      on = true;
      html.classList.add("stage-on");
      gsap.to(canvas, { opacity: 1, duration: 0.5 });
      for (let i = 2; i < scenes.length; i++) {
        if (disposed) return;
        await load(i);
      }
    })();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, calm ? 1.25 : 1.5);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(loc.res, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // If the GPU drops the context, step aside and let each scene show its own photo again.
    const onLost = () => {
      on = false;
      html.classList.remove("stage-on");
      canvas.style.opacity = "0";
    };
    canvas.addEventListener("webglcontextlost", onLost);

    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = 1 - (e.clientY / window.innerHeight) * 2;
    };
    if (!calm) window.addEventListener("pointermove", onMove);

    const railItems = rail ? [...rail.querySelectorAll<HTMLElement>("[data-rail-item]")] : [];
    let bound: [number, number] = [-1, -1];
    let activeShown = -1;
    let railShown = false;
    const start = performance.now();
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const tick = () => {
      if (!on || document.hidden) return;
      const vh = window.innerHeight;
      const rects = scenes.map((s) => s.el.getBoundingClientRect());
      const first = rects[0];
      const last = rects[rects.length - 1];

      // Side index: only while the scenes are what you're looking at.
      const showRail = first.top < vh * 0.5 && last.bottom > vh * 0.5;
      if (rail && showRail !== railShown) {
        railShown = showRail;
        rail.dataset.show = String(showRail);
      }
      if (first.top > vh || last.bottom < 0) return;

      // Which pair of scenes, and how far the burn between them has got.
      let a = 0;
      let mix = 0;
      for (let i = 0; i < scenes.length - 1; i++) {
        const m = clamp01((vh * 0.95 - rects[i + 1].top) / (vh * 0.8));
        if (m >= 1) {
          a = i + 1;
          mix = 0;
          continue;
        }
        a = i;
        mix = m;
        break;
      }
      let b = Math.min(a + 1, scenes.length - 1);
      if (!scenes[a].tex) return;
      if (!scenes[b].tex) {
        b = a;
        mix = 0;
      }

      const active = mix > 0.5 ? b : a;
      if (active !== activeShown) {
        activeShown = active;
        railItems.forEach((item, i) => (item.dataset.active = String(i === active)));
      }

      if (bound[0] !== a || bound[1] !== b) {
        bound = [a, b];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, scenes[a].tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, scenes[b].tex);
        gl.uniform2f(loc.imgA, scenes[a].w, scenes[a].h);
        gl.uniform2f(loc.imgB, scenes[b].w, scenes[b].h);
        gl.uniform2f(loc.focusA, scenes[a].focus[0], scenes[a].focus[1]);
        gl.uniform2f(loc.focusB, scenes[b].focus[0], scenes[b].focus[1]);
        gl.uniform1f(loc.dimA, scenes[a].dim);
        gl.uniform1f(loc.dimB, scenes[b].dim);
        gl.uniform1f(loc.flipA, scenes[a].flip);
        gl.uniform1f(loc.flipB, scenes[b].flip);
      }

      // Each photo eases back slowly for as long as its scene is passing: a held camera move.
      const travel = (r: DOMRect) => clamp01((vh - r.top) / (r.height + vh));
      gl.uniform1f(loc.zoomA, 1.13 - 0.09 * travel(rects[a]));
      gl.uniform1f(loc.zoomB, 1.13 - 0.09 * travel(rects[b]));
      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      gl.uniform2f(loc.pointer, px, py);
      gl.uniform1f(loc.mix, mix);
      gl.uniform1f(loc.time, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      html.classList.remove("stage-on");
      scenes.forEach((s) => s.tex && gl.deleteTexture(s.tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  const jump = (i: number) => {
    const target = document.querySelectorAll<HTMLElement>("[data-scene]")[i];
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] w-full opacity-0"
      />
      {/* Side index: one tick per scene, the current one drawn longer in gold */}
      <nav
        ref={railRef}
        aria-label="Sections"
        data-show="false"
        className="pointer-events-none fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 opacity-0 transition-opacity duration-700 data-[show=false]:invisible data-[show=true]:pointer-events-auto data-[show=true]:opacity-100 lg:block 2xl:right-8"
      >
        <ul className="flex flex-col items-end gap-1">
          {labels.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                data-rail-item
                data-active="false"
                onClick={() => jump(i)}
                aria-label={label}
                className="group flex h-6 items-center justify-end gap-3"
              >
                <span className="text-[0.66rem] font-medium tracking-[0.2em] whitespace-nowrap text-cream uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {label}
                </span>
                <span className="h-px w-4 bg-cream/45 transition-[width,background-color] duration-500 group-hover:w-7 group-data-[active=true]:w-9 group-data-[active=true]:bg-gold" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
