"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion } from "@/lib/reveal";

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Heat off the roasting pan: the air above the coals shimmers upward around the duck,
// the pan glows and breathes, and a few embers drift up and burn out. Everything is
// placed in image space (y up) so it stays on the pan however the photo is cropped.
const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uFocus;
uniform float uTime;
uniform float uStrength;
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

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

// object-fit: cover, both ways.
vec2 coverScale() {
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  return rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
}
vec2 coverFocus(vec2 scale) { return clamp(uFocus, scale * 0.5, 1.0 - scale * 0.5); }
vec2 toImage(vec2 uv, vec2 scale, vec2 focus) { return (uv - 0.5) * scale + focus; }
vec2 toScreen(vec2 img, vec2 scale, vec2 focus) { return (img - focus) / scale + 0.5; }

void main() {
  vec2 scale = coverScale();
  vec2 focus = coverFocus(scale);
  vec2 img = toImage(vUv, scale, focus);
  float t = uTime;

  // Where the heat is: a column rising off the pan (pan centre ~ x 0.49, y 0.16),
  // strongest just above the coals and gone by the duck's shoulders.
  float across = 1.0 - smoothstep(0.1, 0.3, abs(img.x - 0.49));
  float up = smoothstep(0.08, 0.2, img.y) * (1.0 - smoothstep(0.3, 0.85, img.y));
  float heat = across * up * uStrength;

  // Rising shimmer: two layers of noise scrolling upward at different speeds.
  float n1 = snoise(vec2(img.x * 16.0, img.y * 10.0 - t * 1.5));
  float n2 = snoise(vec2(img.x * 26.0 + 7.0, img.y * 15.0 - t * 2.3));
  vec2 offset = vec2(n1 * 0.0032, (n2 * 0.5 + 0.5) * 0.0042) * heat;
  vec3 col = texture2D(uTex, img + offset).rgb;

  // The coals glow and breathe, slowly.
  float breathe = 0.82 + 0.18 * sin(t * 1.7) * sin(t * 2.9 + 1.3);
  float pan = exp(-pow(length((img - vec2(0.49, 0.15)) * vec2(1.6, 3.2)), 2.0) * 9.0);
  col += vec3(1.0, 0.42, 0.12) * pan * 0.16 * breathe * uStrength;
  // A warm cast on the duck's skin above it.
  col *= 1.0 + vec3(0.06, 0.025, 0.0) * across * up * breathe;

  // Embers: born on the coals, drifting up and fading out. Only pixels near the pan pay for them.
  vec3 embers = vec3(0.0);
  bool nearPan = img.x > 0.24 && img.x < 0.76 && img.y > 0.1 && img.y < 0.66;
  for (int i = 0; i < 22; i++) {
    if (!nearPan) break;
    float fi = float(i);
    float life = 3.2 + hash(fi + 1.0) * 2.6;
    float age = fract(t / life + hash(fi + 7.0));
    vec2 origin = vec2(0.36 + hash(fi + 3.0) * 0.27, 0.15 + hash(fi + 5.0) * 0.03);
    vec2 pos = origin + vec2(sin(age * 5.0 + fi * 2.1) * 0.018 + age * 0.02 * (hash(fi + 9.0) - 0.5), age * 0.42);
    vec2 d = (vUv - toScreen(pos, scale, focus)) * uRes;
    float r = (1.3 + hash(fi + 11.0) * 1.8) * (uRes.y / 900.0);
    float glow = exp(-dot(d, d) / (r * r * 2.0));
    float fade = smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.45, 1.0, age));
    float twinkle = 0.7 + 0.3 * sin(t * 9.0 + fi * 4.0);
    embers += mix(vec3(1.0, 0.75, 0.35), vec3(1.0, 0.32, 0.08), age) * glow * fade * twinkle;
  }
  col += embers * 1.15 * uStrength;

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
  /** Focus below 768px, matching the photo's object-position there. */
  mobileFocus?: [number, number];
  className?: string;
};

/**
 * WebGL layer drawn over the hero <Image>. If WebGL or the texture fails, or the
 * visitor prefers reduced motion, the canvas stays transparent and the photo shows.
 */
export default function HeroCanvas({ src, focus = [0.62, 0.5], mobileFocus, className }: Props) {
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
    const uTime = u("uTime");
    const [fx, fy] = mobileFocus && window.matchMedia("(max-width: 767px)").matches ? mobileFocus : focus;
    gl.uniform2f(u("uFocus"), fx, 1 - fy);
    // Phones get a gentler shimmer, drawn at half rate.
    const calm = prefersCalmMotion();
    gl.uniform1f(u("uStrength"), calm ? 0.65 : 1);

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
      // The photo is soft, so the shader can run a little under full resolution.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    const html = document.documentElement;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      // Nothing to draw behind the intro doors, off screen or in a background tab.
      if (!visible || !ready || document.hidden || !html.classList.contains("intro-done")) return;
      if (calm && frame++ % 2) return;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      img.onload = null;
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [src, focus[0], focus[1], mobileFocus?.[0], mobileFocus?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} style={{ opacity: 0 }} aria-hidden />;
}
