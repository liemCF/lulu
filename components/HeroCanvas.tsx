"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Fluted (reeded) glass over the photo: every vertical reed bends its own slice of the
// image with a little colour fringing. The glass clears under the pointer, settles
// after the intro and frosts up again as the hero scrolls away. A faint heat haze
// still rises off the flame.
const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform vec2 uFocus;
uniform float uTime;
uniform float uHover;
uniform float uScroll;
uniform float uShift;
uniform float uGlass;
uniform float uReeds;
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

vec2 cover(vec2 uv) {
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  vec2 focus = clamp(uFocus, scale * 0.5, 1.0 - scale * 0.5);
  return (uv - 0.5) * scale + focus;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;

  // Heat shimmer: strongest low in the frame where the flame sits.
  float heat = smoothstep(0.85, 0.05, uv.y);
  vec2 q = uv * vec2(3.0 * aspect, 5.0);
  float n1 = snoise(q - vec2(0.0, uTime * 0.9));
  float n2 = snoise(q * 1.7 + vec2(4.0, -uTime * 1.3));
  vec2 offset = vec2(n1, n2) * vec2(0.0015, 0.003) * (0.35 + heat * 1.3);

  // The pointer acts like a clear pane in the glass.
  vec2 p = (uv - uMouse) * vec2(aspect, 1.0);
  float lens = smoothstep(0.28, 0.04, length(p)) * uHover;
  float glass = clamp(mix(uGlass, 1.0, uScroll * 0.85) * (1.0 - lens * 0.92), 0.0, 1.0);

  // Each reed refracts a slice of the image sideways.
  float f = fract(uv.x * uReeds);
  float k = f - 0.5;
  float bend = k * glass * 2.2 / uReeds;

  // Slow push-in as the hero scrolls away.
  vec2 st = (uv - 0.5) * (1.0 - uScroll * 0.08) + 0.5 + offset;
  float shift = uShift * 0.012;
  vec3 col;
  col.r = texture2D(uTex, cover(st + vec2(bend * 1.12 + shift, 0.0))).r;
  col.g = texture2D(uTex, cover(st + vec2(bend, 0.0))).g;
  col.b = texture2D(uTex, cover(st + vec2(bend * 0.88 - shift, 0.0))).b;

  // Rounded reed shading and a thin highlight on each ridge.
  col *= 1.0 - glass * 0.22 * pow(abs(k) * 2.0, 2.0);
  col += smoothstep(0.88, 1.0, f) * glass * 0.09;

  // Ember glow breathing with the noise.
  float flicker = 0.5 + 0.5 * sin(uTime * 6.0 + n1 * 3.0);
  col += vec3(1.0, 0.42, 0.12) * heat * 0.06 * flicker;

  // Vignette.
  float v = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(aspect * 0.9, 1.0)));
  col *= mix(0.55, 1.0, v);

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

type Props = {
  src: string;
  focus?: [number, number];
  className?: string;
};

/**
 * WebGL layer drawn over the hero <Image>. If WebGL or the texture fails,
 * the canvas stays transparent and the plain image underneath shows.
 */
export default function HeroCanvas({ src, focus = [0.62, 0.5], className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
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
    const uRes = u("uRes");
    const uImg = u("uImg");
    const uMouse = u("uMouse");
    const uFocus = u("uFocus");
    const uTime = u("uTime");
    const uHover = u("uHover");
    const uScroll = u("uScroll");
    const uShift = u("uShift");
    const uGlass = u("uGlass");
    const uReeds = u("uReeds");
    gl.uniform2f(uFocus, focus[0], 1 - focus[1]);

    const texture = gl.createTexture();
    let ready = false;
    let disposed = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform2f(uImg, img.naturalWidth, img.naturalHeight);
      ready = true;
      gsap.to(canvas, { opacity: 1, duration: 0.6 });
    };
    img.src = src;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      // Reeds roughly 56 CSS px wide, whatever the screen.
      gl.uniform1f(uReeds, Math.max(6, Math.round(width / 56)));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Smoothed pointer + hover strength.
    const state = { mx: 0.5, my: 0.5, hover: 0, shift: 0, scroll: 0, glass: 1 };

    // Frosted while the doors open, then the glass settles to a light flute.
    const settle = () => gsap.to(state, { glass: 0.45, duration: 2.8, ease: "power2.inOut" });
    if (document.documentElement.classList.contains("intro-done")) settle();
    else window.addEventListener("lulu:intro", settle, { once: true });
    const target = { mx: 0.5, my: 0.5, hover: 0 };
    const host = canvas.parentElement!.closest("section") ?? canvas;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.mx = (e.clientX - r.left) / r.width;
      target.my = 1 - (e.clientY - r.top) / r.height;
      target.hover = 1;
    };
    const onLeave = () => (target.hover = 0);
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const st = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        state.scroll = self.progress;
        state.shift = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
      },
    });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    const start = performance.now();
    const tick = () => {
      if (!visible || !ready) return;
      state.mx += (target.mx - state.mx) * 0.08;
      state.my += (target.my - state.my) * 0.08;
      state.hover += (target.hover - state.hover) * 0.05;
      state.shift *= 0.9;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, state.mx, state.my);
      gl.uniform1f(uHover, state.hover);
      gl.uniform1f(uScroll, state.scroll);
      gl.uniform1f(uShift, state.shift);
      gl.uniform1f(uGlass, state.glass);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      img.onload = null;
      window.removeEventListener("lulu:intro", settle);
      gsap.killTweensOf(state);
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      st.kill();
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [src, focus[0], focus[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} style={{ opacity: 0 }} aria-hidden />;
}
