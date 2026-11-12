"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersCalmMotion, prefersReducedMotion } from "@/lib/reveal";

type Props = {
  /** Meshopt-compressed GLB of the roast duck. */
  src?: string;
  className?: string;
};

const FLAME_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// A sheet of flame: noise scrolling upward, pinched toward the top, coloured from a blue base
// through white-gold to orange and out to nothing. Drawn additively on a few crossed planes.
const FLAME_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uSeed;
uniform float uPower;
uniform float uBoost;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.1; a *= 0.5; }
  return s;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 1.5 + uSeed * 10.0;
  // Tongues lean and wander as they rise.
  float sway = (fbm(vec2(uv.y * 2.2 + uSeed, t * 0.5)) - 0.5) * 0.3 * uv.y;
  float x = (uv.x - 0.5 + sway) * (1.0 + uv.y * 1.6);
  float body = 1.0 - smoothstep(0.0, 0.5, abs(x));
  float n = fbm(vec2(uv.x * 4.5 + uSeed * 3.0, uv.y * 3.2 - t));
  // A flambé burst (uBoost) lets the tongues climb much higher and fill out.
  float flame = body * (1.0 - uv.y) * 1.25 + n * 1.05 - uv.y * (1.0 - uBoost * 0.5) - 0.54 + uBoost * 0.3;
  flame = min(smoothstep(0.0, 0.8, flame) * uPower * (0.6 + uBoost * 0.1), 1.0);
  // Fade the sheet's own edges so no rectangle shows.
  flame *= smoothstep(0.0, 0.06, uv.y) * smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);

  vec3 outer = vec3(1.0, 0.27, 0.03);
  vec3 mid = vec3(1.0, 0.62, 0.14);
  vec3 core = vec3(1.0, 0.93, 0.72);
  vec3 col = mix(outer, mid, smoothstep(0.15, 0.55, flame));
  col = mix(col, core, smoothstep(0.5, 0.62, flame));
  // The cool blue at the root of a spirit flame.
  col = mix(col, vec3(0.25, 0.45, 1.0), (1.0 - smoothstep(0.0, 0.16, uv.y)) * 0.55);
  gl_FragColor = vec4(col * flame, flame);
}`;

const EMBER_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
varying float vLife;
void main() {
  float life = fract(uTime * (0.1 + aSeed * 0.12) + aSeed * 7.0);
  vLife = life;
  vec3 p = position;
  p.y += life * (2.6 + aSeed * 1.8);
  p.x += sin(life * 6.0 + aSeed * 40.0) * 0.22 * life;
  p.z += cos(life * 5.0 + aSeed * 23.0) * 0.22 * life;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.5 + aSeed) * (1.0 - life * 0.6) / -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const EMBER_FRAG = /* glsl */ `
precision highp float;
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * smoothstep(0.0, 0.1, vLife) * (1.0 - smoothstep(0.5, 1.0, vLife));
  gl_FragColor = vec4(mix(vec3(1.0, 0.8, 0.4), vec3(1.0, 0.3, 0.05), vLife) * a, a);
}`;

/**
 * The roast duck as a real 3D object, hanging in the scene: it turns as the page scrolls, leans toward
 * the pointer, and is lit by the flames licking up from beneath it. The mesh was reconstructed from
 * Lulu's own photo of the dish. Without WebGL, or with reduced motion, nothing mounts.
 */
export default function Duck3D({ src = "/models/duck.glb", className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || prefersReducedMotion()) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // Fetch three.js and the model only when the duck is about to come on screen.
      await new Promise<void>((resolve) => {
        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            io.disconnect();
            resolve();
          },
          { rootMargin: "1200px 0px" },
        );
        io.observe(el);
        cleanup = () => io.disconnect();
      });
      if (disposed) return;

      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/libs/meshopt_decoder.module.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      const calm = prefersCalmMotion();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, calm ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.85;
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.55;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      camera.position.set(0, 0.2, 9.4);

      // Light: a flickering fire from below, a cool rim from behind (the room's blue), a soft key.
      const fire = new THREE.PointLight(0xffb070, 12, 12, 1.7);
      fire.position.set(0.3, -2.1, 1.6);
      scene.add(fire);
      const rim = new THREE.DirectionalLight(0x6f8fff, 2.6);
      rim.position.set(-3.5, 2.5, -4);
      scene.add(rim);
      const key = new THREE.DirectionalLight(0xffffff, 1.0);
      key.position.set(3, 4, 6);
      scene.add(key);

      const turn = new THREE.Group(); // scroll and idle rotation
      const lean = new THREE.Group(); // pointer tilt
      lean.add(turn);
      scene.add(lean);

      let model: import("three").Object3D | null = null;
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      try {
        const gltf = await loader.loadAsync(src);
        if (disposed) return;
        model = gltf.scene;
        // Centre it and size it to a fixed height, whatever units the file came in.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        const s = 4.3 / size.y;
        model.scale.setScalar(s);
        model.position.set(-centre.x * s, -centre.y * s, -centre.z * s);
        const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        model.traverse((o) => {
          const mesh = o as import("three").Mesh;
          if (!mesh.isMesh) return;
          const mat = mesh.material as import("three").MeshStandardMaterial;
          if (mat.map) mat.map.anisotropy = aniso;
          // Lacquered skin: glossy, never metallic.
          mat.metalness = 0;
          // The baked texture runs hot red: pull it toward roasted mahogany.
          mat.color.setRGB(0.74, 0.7, 0.66);
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.5);
          mat.envMapIntensity = 0.9;
        });
        turn.add(model);
      } catch {
        renderer.dispose();
        canvas.remove();
        return;
      }

      // Flames: crossed sheets rooted under the duck.
      const flameGeo = new THREE.PlaneGeometry(3.0, 4.6);
      flameGeo.translate(0, 2.3, 0);
      const flameMats: import("three").ShaderMaterial[] = [];
      const flames = new THREE.Group();
      [0, 1, 2, 3].forEach((i) => {
        const mat = new THREE.ShaderMaterial({
          vertexShader: FLAME_VERT,
          fragmentShader: FLAME_FRAG,
          uniforms: { uTime: { value: 0 }, uSeed: { value: i * 0.37 + 0.1 }, uPower: { value: 0 }, uBoost: { value: 0 } },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        flameMats.push(mat);
        const sheet = new THREE.Mesh(flameGeo, mat);
        sheet.rotation.y = (i / 4) * Math.PI;
        sheet.scale.setScalar(0.8 + (i % 2) * 0.25);
        flames.add(sheet);
      });
      flames.position.y = -2.95;
      scene.add(flames);

      // Embers drifting up through the frame.
      const COUNT = calm ? 40 : 90;
      const emberGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(COUNT * 3);
      const seed = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.9;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = -2.6 + Math.random() * 0.4;
        pos[i * 3 + 2] = Math.sin(a) * r;
        seed[i] = Math.random();
      }
      emberGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      emberGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      const emberMat = new THREE.ShaderMaterial({
        vertexShader: EMBER_VERT,
        fragmentShader: EMBER_FRAG,
        uniforms: { uTime: { value: 0 }, uSize: { value: 60 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const embers = new THREE.Points(emberGeo, emberMat);
      embers.frustumCulled = false;
      scene.add(embers);

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep the whole duck and its flames in frame on narrow canvases.
        camera.position.z = camera.aspect < 0.8 ? 9.4 + (0.8 - camera.aspect) * 9 : 9.4;
        camera.updateProjectionMatrix();
        emberMat.uniforms.uSize.value = 60 * renderer.getPixelRatio() * (height / 800);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      let visible = false;
      let progress = 0;
      let px = 0;
      let py = 0;
      let lx = 0;
      let ly = 0;
      let shown = false;
      const ignite = { power: 0, boost: 0 };
      
      // Drag rotation state
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragRotX = 0;
      let dragRotY = 0;
      let targetRotX = 0;
      let targetRotY = 0;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => (progress = self.progress),
      });
      visible = st.isActive;
      progress = st.progress;
      
      // The duck is set alight as it arrives.
      const light = ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        once: true,
        onEnter: () => gsap.to(ignite, { power: 1, duration: 2.4, ease: "power2.out" }),
      });

      // Horizontal drags turn the duck; vertical swipes still scroll the page on touch screens.
      el.style.touchAction = "pan-y";
      let moved = 0;

      const move = (e: PointerEvent) => {
        // The hover lean is for fine pointers; dragging works for mouse and finger alike.
        if (!calm) {
          px = (e.clientX / window.innerWidth) * 2 - 1;
          py = (e.clientY / window.innerHeight) * 2 - 1;
        }
        if (isDragging) {
          const deltaX = e.clientX - dragStartX;
          const deltaY = e.clientY - dragStartY;
          moved = Math.max(moved, Math.hypot(deltaX, deltaY));
          targetRotY = dragRotY + deltaX * 0.008;
          targetRotX = Math.max(-0.6, Math.min(0.6, dragRotX + deltaY * 0.006));
        }
      };

      const handlePointerDown = (e: PointerEvent) => {
        isDragging = true;
        moved = 0;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragRotX = targetRotX;
        dragRotY = targetRotY;
      };

      // Flambé: the flames surge up around the duck, then settle. Only the burst is restarted,
      // so tapping while the duck is first being lit cannot leave it unlit.
      const flambe = gsap
        .timeline({ paused: true })
        .to(ignite, { boost: 1, duration: 0.3, ease: "expo.out" })
        .to(ignite, { boost: 0, duration: 2.6, ease: "power2.inOut" }, ">0.5");
      const triggerFlambe = () => {
        gsap.to(ignite, { power: 1, duration: 0.4, overwrite: "auto" });
        flambe.restart();
      };

      const handlePointerUp = () => {
        // A press that barely moved is a tap; a real drag only turns the duck.
        if (isDragging && moved < 8) triggerFlambe();
        isDragging = false;
      };
      const handleKey = (e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        triggerFlambe();
      };

      el.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      el.addEventListener("keydown", handleKey);
      window.addEventListener("pointermove", move);

      const start = performance.now();
      let flameClock = 0;
      const tick = () => {
        if (!visible || document.hidden) return;
        const t = (performance.now() - start) / 1000;
        
        // Combine scroll progress rotation with user drag rotation
        dragRotY += (targetRotY - dragRotY) * 0.08;
        dragRotX += (targetRotX - dragRotX) * 0.08;

        turn.rotation.y = progress * Math.PI * 2.5 + t * 0.12 - 0.5 + dragRotY;
        lx += (py * 0.12 + dragRotX - lx) * 0.06;
        ly += (px * 0.28 - ly) * 0.06;
        lean.rotation.set(lx, ly, Math.sin(t * 0.6) * 0.02);
        lean.position.y = Math.sin(t * 0.8) * 0.05 + 0.25;

        const effectivePower = ignite.power * (1 + ignite.boost * 0.3);
        const flick = 0.78 + 0.22 * Math.sin(t * 11.0) * Math.sin(t * 7.3 + 1.0) + 0.1 * Math.sin(t * 23.0);
        fire.intensity = (13 + ignite.boost * 40) * flick * ignite.power;
        // During a burst the sheets grow taller and wider so the fire wraps the whole duck.
        flames.scale.set(1 + ignite.boost * 0.35, 1 + ignite.boost * 0.55, 1 + ignite.boost * 0.35);
        // Flame time is accumulated, so speeding it up for a burst never makes the flames jump.
        flameClock += (1 / 60) * (1 + ignite.boost * 1.4);
        flameMats.forEach((m) => {
          m.uniforms.uTime.value = flameClock;
          m.uniforms.uPower.value = effectivePower;
          m.uniforms.uBoost.value = ignite.boost;
        });
        emberMat.uniforms.uTime.value = flameClock;
        emberMat.uniforms.uSize.value = (60 + ignite.boost * 70) * renderer.getPixelRatio() * (el.clientHeight / 800);
        embers.visible = effectivePower > 0.05;
        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          gsap.to(el, { opacity: 1, duration: 1.4, ease: "power2.out" });
        }
      };
      gsap.ticker.add(tick);

      cleanup = () => {
        gsap.ticker.remove(tick);
        st.kill();
        light.kill();
        ro.disconnect();
        el.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
        el.removeEventListener("keydown", handleKey);
        window.removeEventListener("pointermove", move);
        flambe.kill();
        flameGeo.dispose();
        flameMats.forEach((m) => m.dispose());
        emberGeo.dispose();
        emberMat.dispose();
        model?.traverse((o) => {
          const mesh = o as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          const mat = mesh.material as import("three").MeshStandardMaterial;
          mat.map?.dispose();
          mat.normalMap?.dispose();
          mat.roughnessMap?.dispose();
          mat.metalnessMap?.dispose();
          mat.dispose();
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        canvas.remove();
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [src]);

  return (
    <div
      ref={wrap}
      role="button"
      tabIndex={0}
      aria-label="The Flaming Peking Duck in 3D. Drag to turn it, press to flambé"
      className={className}
      style={{ opacity: 0 }}
    />
  );
}
