"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reveal";

type Props = {
  /** The brand mark; its opaque pixels become the raised gold. */
  logo?: string;
  className?: string;
};

/**
 * The Lulu seal as a real object: a navy lacquer plaque with the logo raised on it in gold.
 * The relief, the metal and the lacquer are all derived from the logo file at runtime,
 * lit by a studio environment so the gold catches light as the plaque turns with the scroll
 * and leans toward the pointer. Nothing mounts without WebGL or with reduced motion.
 */
export default function Seal3D({ logo = "/images/logo-lulu.png", className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || prefersReducedMotion()) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // Wait until the seal is close to the screen before fetching three.js.
      await new Promise<void>((resolve) => {
        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            io.disconnect();
            resolve();
          },
          { rootMargin: "900px 0px" },
        );
        io.observe(el);
        cleanup = () => io.disconnect();
      });
      if (disposed) return;
      const [THREE, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      const img = new Image();
      img.src = logo;
      try {
        await img.decode();
      } catch {
        return;
      }
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(canvas);

      // --- Maps drawn from the logo -------------------------------------------------
      const TW = 1024;
      const TH = Math.round((TW * img.naturalHeight) / img.naturalWidth);
      const PAD = 0.11; // lacquer margin around the mark
      const mk = () => {
        const c = document.createElement("canvas");
        c.width = TW;
        c.height = TH;
        return c;
      };
      const drawLogo = (ctx: CanvasRenderingContext2D) =>
        ctx.drawImage(img, TW * PAD, TH * PAD, TW * (1 - PAD * 2), TH * (1 - PAD * 2));

      // Mask: white where the gold is (the mark plus a thin frame line).
      const mask = mk();
      const mctx = mask.getContext("2d")!;
      drawLogo(mctx);
      mctx.globalCompositeOperation = "source-in";
      mctx.fillStyle = "#fff";
      mctx.fillRect(0, 0, TW, TH);
      mctx.globalCompositeOperation = "source-over";
      mctx.strokeStyle = "#fff";
      mctx.lineWidth = 5;
      mctx.strokeRect(TW * 0.035, TW * 0.035, TW - TW * 0.07, TH - TW * 0.07);

      // Height: the mask, softened so the relief has a rounded shoulder.
      const height = mk();
      const hctx = height.getContext("2d")!;
      hctx.fillStyle = "#000";
      hctx.fillRect(0, 0, TW, TH);
      hctx.filter = "blur(2.2px)";
      hctx.drawImage(mask, 0, 0);
      hctx.filter = "none";
      const hpx = hctx.getImageData(0, 0, TW, TH).data;
      const hAt = (x: number, y: number) =>
        hpx[(Math.min(TH - 1, Math.max(0, y)) * TW + Math.min(TW - 1, Math.max(0, x))) * 4] / 255;

      const normal = mk();
      const nctx = normal.getContext("2d")!;
      const nimg = nctx.createImageData(TW, TH);
      const colour = mk();
      const cctx = colour.getContext("2d")!;
      const cimg = cctx.createImageData(TW, TH);
      const orm = mk();
      const octx = orm.getContext("2d")!;
      const oimg = octx.createImageData(TW, TH);
      const STRENGTH = 5.5;
      const lacquer = [10, 18, 44];
      const gold = [214, 178, 100];
      for (let y = 0; y < TH; y++) {
        for (let x = 0; x < TW; x++) {
          const i = (y * TW + x) * 4;
          const dx = (hAt(x + 1, y) - hAt(x - 1, y)) * STRENGTH;
          const dy = (hAt(x, y + 1) - hAt(x, y - 1)) * STRENGTH;
          const len = Math.hypot(dx, dy, 1);
          nimg.data[i] = (-dx / len) * 127.5 + 127.5;
          nimg.data[i + 1] = (dy / len) * 127.5 + 127.5;
          nimg.data[i + 2] = (1 / len) * 127.5 + 127.5;
          nimg.data[i + 3] = 255;
          const g = hAt(x, y);
          cimg.data[i] = lacquer[0] + (gold[0] - lacquer[0]) * g;
          cimg.data[i + 1] = lacquer[1] + (gold[1] - lacquer[1]) * g;
          cimg.data[i + 2] = lacquer[2] + (gold[2] - lacquer[2]) * g;
          cimg.data[i + 3] = 255;
          // three reads roughness from green and metalness from blue.
          oimg.data[i] = 255;
          oimg.data[i + 1] = 46 + (74 - 46) * g; // lacquer is glassier than the gold
          oimg.data[i + 2] = 255 * g;
          oimg.data[i + 3] = 255;
        }
      }
      nctx.putImageData(nimg, 0, 0);
      cctx.putImageData(cimg, 0, 0);
      octx.putImageData(oimg, 0, 0);

      const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const tex = (c: HTMLCanvasElement, srgb = false) => {
        const t = new THREE.CanvasTexture(c);
        t.anisotropy = aniso;
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };
      const colourTex = tex(colour, true);
      const normalTex = tex(normal);
      const ormTex = tex(orm);

      // --- Scene ------------------------------------------------------------------
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
      camera.position.set(0, 0, 6.6);

      const PW = 3.2;
      const PH = (PW * TH) / TW;
      const face = new THREE.MeshPhysicalMaterial({
        map: colourTex,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(1.6, 1.6),
        roughnessMap: ormTex,
        metalnessMap: ormTex,
        roughness: 1,
        metalness: 1,
        clearcoat: 0.55,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.5,
      });
      const edge = new THREE.MeshStandardMaterial({ color: 0xcfa85c, metalness: 1, roughness: 0.3, envMapIntensity: 1.4 });
      const geo = new THREE.BoxGeometry(PW, PH, 0.16);
      // Box faces: +x, -x, +y, -y, +z (front), -z (back).
      const plaque = new THREE.Mesh(geo, [edge, edge, edge, edge, face, face]);
      const float = new THREE.Group();
      float.add(plaque);
      scene.add(float);

      // A warm light that sweeps across the face so the gold glints.
      const glint = new THREE.PointLight(0xffe2a6, 26, 14, 1.6);
      scene.add(glint);
      scene.add(new THREE.DirectionalLight(0xfff2dc, 1.1).translateX(-3).translateY(4).translateZ(6));

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      let visible = false;
      let progress = 0;
      let px = 0;
      let py = 0;
      let rx = 0;
      let ry = 0;
      let shown = false;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => (progress = self.progress),
      });
      visible = st.isActive;
      progress = st.progress;
      const move = (e: PointerEvent) => {
        px = (e.clientX / window.innerWidth) * 2 - 1;
        py = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", move);

      const start = performance.now();
      const tick = () => {
        if (!visible || document.hidden) return;
        const t = (performance.now() - start) / 1000;
        // It swings from one side to the other as it scrolls past, sways gently, and leans toward the pointer.
        const targetY = (progress - 0.5) * 2.3 + Math.sin(t * 0.6) * 0.16 + px * 0.35;
        const targetX = Math.sin(t * 0.45) * 0.07 + py * 0.22;
        ry += (targetY - ry) * 0.07;
        rx += (targetX - rx) * 0.07;
        plaque.rotation.set(rx, ry, Math.sin(t * 0.5) * 0.025);
        float.position.y = Math.sin(t * 0.9) * 0.07;
        glint.position.set(Math.sin(t * 0.7) * 3.4, 1.2 + Math.cos(t * 0.5) * 1.2, 3.2);
        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          gsap.to(el, { opacity: 1, duration: 1.2, ease: "power2.out" });
        }
      };
      gsap.ticker.add(tick);

      cleanup = () => {
        gsap.ticker.remove(tick);
        st.kill();
        ro.disconnect();
        window.removeEventListener("pointermove", move);
        geo.dispose();
        face.dispose();
        edge.dispose();
        colourTex.dispose();
        normalTex.dispose();
        ormTex.dispose();
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
  }, [logo]);

  return <div ref={wrap} aria-hidden className={className} style={{ opacity: 0 }} />;
}
