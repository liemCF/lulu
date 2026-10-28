---
name: premium-site
description: Build high-end, luxury, award-style marketing websites (Awwwards/FWA feel) with Next.js, Tailwind v4, GSAP (ScrollTrigger, SplitText) and Lenis smooth scroll. Use for restaurant, bar, hotel, hospitality, fashion, real-estate or brand homepages and redesigns that need cinematic intros, scroll-driven motion, pinned or horizontal sections, custom cursors, WebGL hero effects, gold-foil type, or a "premium / editorial / modern luxury / nightlife" direction.
---

# Premium site

Recipe distilled from the Lulu Modern Chinese homepage (`I:/lulu`, the reference build;
paths below are relative to it). Copy the templates, then design each section by hand.
The motion layer is shared; the art direction never is.

## Stack

- **Next.js 16 App Router**, React 19, TypeScript. Next 16 has breaking changes: read
  `node_modules/next/dist/docs/` before using an unfamiliar API (`next/image` uses `preload`,
  not `priority`; `images.qualities` must list every `quality` you pass).
- **Tailwind v4**, CSS-first (`@theme` in `globals.css`, no `tailwind.config`). Under
  Turbopack it is wired with a loader rule in `next.config.ts`. If the project already has one,
  leave it as is; otherwise add:
  ```ts
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
  ```
  with `@tailwindcss/turbopack` and `tailwindcss` as dev dependencies.
- **GSAP 3.15** (all plugins are free, SplitText included) + `@gsap/react` for `useGSAP`.
  Register once in `lib/gsap.ts` and always import `gsap` from there.
- **Lenis** via `lenis/react`, with `autoRaf: false` and driven by `gsap.ticker`
  (`components/SmoothScroll.tsx`) so Lenis and scrubbed ScrollTriggers share one frame.

```bash
npm i gsap @gsap/react lenis
```

## Templates

`templates/` mirrors the target project layout. Copy files across, keep the `@/` import alias.

| Template | What it gives you |
|---|---|
| `lib/gsap.ts` | Registers ScrollTrigger, SplitText, useGSAP; re-exports them |
| `lib/reveal.ts` | `setupReveals(root)`: `[data-split]` line rise, `[data-fade="delay"]`, `[data-clip]` unveil. Plus `prefersReducedMotion()`, `hasFinePointer()` |
| `components/SmoothScroll.tsx` | Lenis root synced to GSAP ticker; re-exports `useLenis` |
| `components/Cursor.tsx` | Dot + ring cursor, `data-cursor="Label"` disc, magnetic `.btn` / `[data-magnetic]`. Props: `color`, `magnetSelector`, `sizes` |
| `components/HoverPreview.tsx` | List whose rows float a tilting photo by the pointer. Props: `items`, `width`, `aspect`, `maxTilt` |
| `components/HeroCanvas.tsx` | WebGL layer over the hero `<Image>`: heat haze, pointer ripple, scroll-velocity RGB split, glow, vignette. Props: `src`, `focus`, `haze`, `ripple`, `rgbSplit`, `glow`, `glowAmount` |
| `app/globals.css` | Tokens, grain, `.eyebrow`, `.btn`, `.link-line`, `.neon-text`, `.foil`, cursor, intro start state, reduced motion |
| `app/layout.tsx` | Fonts as CSS variables, `<noscript>` intro fallback, `SmoothScroll` + `Cursor` wiring |

Section skeleton (every section follows it):

```tsx
"use client";
export default function Section() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    setupReveals(root.current!);
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => { /* pins, horizontal tracks */ });
    // section-specific scrubbed motion
  }, { scope: root });
  return <section ref={root}>…</section>;
}
```

Keep all copy, links, hours and image lists in one `lib/content.ts`; components only render it.

## Workflow

1. **Audit the old site.** Visit every page. List sections, CTAs (reserve, order, phone,
   directions, socials), hours, address, legal bits. Note what is broken or dated.
2. **Pull real copy and photos** from the client's site. Never invent facts (dishes, prices,
   awards, names, hours). Download originals, convert to `.webp` into `public/images/`
   with descriptive names (`dish-*.webp`, `night-*.webp`). Skip stock or scraped-looking files
   (`download-*.jpeg`, `images-*.jpeg`) and flag them.
3. **Build a contact sheet** of every usable photo (one grid image or a scratch HTML page) and
   look at it before designing. Pick the hero shot, group by mood, spot gaps (no chef photo, no
   night shots). Image choice drives the sections more than the copy.
4. **Choose the palette from the logo.** Sample its colours; derive one deep base, one light
   text tone, one accent (often metallic), at most one loud "night" accent. Put them in
   `@theme`. Pair a high-contrast display serif with a tight grotesk via `next/font`.
5. **Write and mark DRAFT copy.** Anything new you write (taglines, section intros, captions,
   photo-to-dish matches) is listed in the README under "needs client confirmation".
6. **Build section by section**, then the intro, then the premium layer (WebGL, cursor, hover).
7. **Verify in the browser** at **1440 × 900** and **375 × 812**: intro plays once and releases
   scroll, no layout shift on hydrate, pins release cleanly, nothing overflows horizontally,
   console is clean, reduced-motion and touch paths both look finished.
8. **`next build`** must pass (types + prerender) before handing over. Write the README:
   stack, file map, section list, effects list, open questions for the client.

## Design rules

**CSS layering.** Component classes (`.btn`, `.eyebrow`) go in `@layer components` so Tailwind
utilities (`hidden`, `px-*`, `text-*`) override them. Only rules that must beat utilities
(e.g. `.btn:hover` text colour) stay unlayered, with a comment saying why.

**Intro without flashes.** The server-rendered HTML must already be in the intro's start state.
Put start-state CSS on `html:not(.intro-done) .intro-hide` (or similar); the timeline adds
`intro-done` to `<html>` when it hands over. In GSAP use `fromTo` with explicit end values for
those elements (`{ yPercent: 110, opacity: 1 } → { yPercent: 0, opacity: 1 }`): `from()` would
read the CSS-hidden state as the end. Keep the CSS start state opacity-only; transforms belong
to the `fromTo`. Add a `<noscript>` style that undoes the start state.
Stop Lenis while the intro plays (`useLenis()` + `lenis.stop()`, release on a window event) and
set `history.scrollRestoration = "manual"`.

**Intro style: brand mark + doors, not gimmicks.** Clients read numeric counters and photo
montages as cheap. The reference intro (`components/Hero.tsx`) is a fixed full-screen loader:
- Two solid "lacquer" doors (`data-door="l|r"`, each `w-[calc(50%+1px)]` so no subpixel seam),
  a soft radial glow, the real logo centred, a ~120px accent hairline progress bar, and one
  tiny tracked line (region / tagline).
- A light sweep masked to the logo's own shape: an overlay with `mask-image: url(logo)`,
  `mask-size: 100% 100%`, and a linear-gradient whose `background-position` is tweened across.
- Timeline: logo in from `blur(14px)` / `scale: 0.94` → sweep → `addPause("hold")` that resumes
  only when the hero image has decoded (`img.decode()` raced with a 3.5 s timeout, so a slow
  network never traps the user) → logo lifts out → seam hairlines on the door edges light up →
  doors part (`xPercent ∓100`, `expo.inOut`, 1.5 s) while the hero media scales 1.22 → 1 →
  headline lines rise. `finish()` (adds `intro-done`, releases scroll) runs mid-door-open;
  the loader gets `display: none` once the doors are gone.
- Repeat visits in the same session: `tl.seek(tl.labels.doors - 0.15)`. Write the
  sessionStorage flag inside `finish()`, not on mount: StrictMode runs effects twice in dev,
  and a flag written on mount makes even the first visit skip the intro.
- Reduced motion: hide the loader and call `finish()` immediately.

**Never put CSS transforms on elements GSAP animates.** Tailwind `-translate-*`, `scale-*`,
`rotate-*` on a GSAP target get overwritten or compound unpredictably. Centre with `xPercent:
-50` in `gsap.set`, or wrap: outer element for layout, inner element for motion. Same for
`transition` on properties GSAP tweens.

**Reduced motion.** `setupReveals` and every section bail early on `prefersReducedMotion()`;
content must be fully visible in that path (no element left at opacity 0). CSS disables grain,
foil sweep and transitions. The intro calls `finish()` immediately.

**Fine pointer only.** Cursor, magnets, HoverPreview and pointer ripples run only when
`(hover: hover) and (pointer: fine)` matches. Hide their DOM on touch with CSS too, and give
touch users a finished alternative (list without preview, swipe track with `scroll-snap`).

**Responsive motion.** Pins and horizontal scroll go inside `gsap.matchMedia()` at
`min-width: 1024px`; on mobile the same content stacks or becomes a native swipe row. Use
`100svh`, `clamp()` type, and `invalidateOnRefresh` with function-based values.

**Hydration-safe time UI.** Anything depending on the clock or timezone (open now, countdowns)
uses `useSyncExternalStore` with a server snapshot of `""` and renders nothing until mounted:

```tsx
const subscribe = (cb: () => void) => { const id = setInterval(cb, 30_000); return () => clearInterval(id); };
const value = useSyncExternalStore(subscribe, computeStatus, () => "");
if (!value) return null;
```

Return a primitive (string) from the snapshot, never a new object each call.

**WebGL safety.** The canvas starts at `opacity: 0` over a normal `<Image>`; fade it in only once
the texture loads. If WebGL, compile or load fails, the photo underneath is the fallback. Guard
async loads with a `disposed` flag set in cleanup (StrictMode runs effects twice in dev), cap DPR
at 1.5, stop drawing when off screen (IntersectionObserver), drive frames from `gsap.ticker`.

**Cleanup.** Put GSAP work in `useGSAP` (auto-reverts tweens, ScrollTriggers, SplitText,
matchMedia). Listeners added inside it still need a returned cleanup. Plain `useEffect` only for
non-GSAP resources (WebGL, observers), and kill any ScrollTrigger you create there yourself.

**Images.** `next/image` everywhere with real `sizes`; `preload` on the hero only. Parallax
images sit in an oversized inner wrapper (`inset-[-10%]`) so movement never shows an edge.

**Premium feel checklist.** Long expo eases (`expo.out`, `expo.inOut`, 1.2–1.6 s), staggered
line reveals, generous whitespace, uppercase tracked eyebrows, one metallic or neon accent,
film grain, real photography, nothing bouncing except magnetic buttons.

## Motion catalogue

Where each pattern lives in the reference build (`I:/lulu`). Read the file before reusing it.

| Pattern | How | Reference |
|---|---|---|
| Line-by-line heading rise | SplitText `lines` + `mask`, `autoSplit`, return tween from `onSplit` | `lib/reveal.ts` |
| Fade-up blocks, image unveil | `[data-fade]`, `[data-clip]` clip-path inset tween | `lib/reveal.ts` |
| Smooth scroll | Lenis on `gsap.ticker`, `ScrollTrigger.update` on scroll | `components/SmoothScroll.tsx` |
| Brand-mark + doors intro | Logo from blur, logo-masked light sweep, hairline progress, decode-gated `addPause`, seam lights, doors part, media 1.22 → 1, headline rises (see Design rules) | `components/Hero.tsx` |
| Hero scroll-out | Scrubbed parallax on media, copy lifts and fades, dim layer darkens | `components/Hero.tsx` |
| WebGL heat haze hero | Fullscreen triangle shader, cover-fit with focal point, ticker-driven uniforms | `components/HeroCanvas.tsx` |
| Velocity marquee | Infinite `xPercent: -50` loop; scroll velocity boosts `timeScale` and `skewX` via `quickTo`, settles with `delayedCall` | `components/Marquee.tsx` |
| Pinned step story | Pin + scrub timeline, stacked frames revealed by clip-path, progress rail `scaleY` | `components/Signature.tsx` |
| Horizontal scroll gallery | Pin, `x: () => -distance()`, `invalidateOnRefresh`; inner image parallax via `containerAnimation` | `components/MenuShowcase.tsx` |
| Neon sign switch-on | Hard opacity flicker timeline, `once: true` | `components/AfterDark.tsx` |
| Drifting glows, speed collage | Looping glow tweens; `data-speed` per-element scrubbed parallax | `components/AfterDark.tsx` |
| Word-by-word manifesto | SplitText `words`, opacity 0.14 → 1 scrubbed | `components/Story.tsx` |
| Auto-rotating quotes | Rotate only while the section is on screen (ScrollTrigger toggle) | `components/Reviews.tsx` |
| Frame-to-full-bleed image | Scrubbed clip-path inset from a window to edge-to-edge | `components/PrivateDining.tsx` |
| Hover photo preview | Floating clip-path stack, `quickTo` follow, tilt from pointer speed | `components/HoverPreview.tsx` |
| Counter-scrolling rows | Two image rows scrubbed in opposite directions | `components/Gallery.tsx` |
| Footer surfacing | Footer inner scrubbed up from below; giant split word CTA | `components/Visit.tsx` |
| Smart nav + menu overlay | Hide on scroll down, show on up, solid after hero; overlay items rise | `components/Nav.tsx` |
| Live open status | `useSyncExternalStore`, timezone via `Intl.DateTimeFormat` | `components/OpenStatus.tsx` |
| Custom cursor + magnets | `quickTo` follow, mode by `closest()`, elastic magnet | `components/Cursor.tsx` |
| Gold foil / grain | `background-clip: text` gradient sweep; SVG turbulence grain overlay | `app/globals.css` |

## Gotchas seen in practice

- `ScrollTrigger.refresh()` after fonts or late images change layout above pinned sections;
  `autoSplit: true` re-splits on font load and resize, so return the tween from `onSplit`.
- Give pinned sections a fixed height on desktop (`lg:h-[100svh]`) and none on mobile.
- Add `pb-[0.06em]` (or `.split-line-mask` padding) to masked lines so descenders don't clip.
- `overflow-x: clip` on `body` (not `hidden`) so `position: sticky` and pins keep working.
- `will-change-transform` only on elements that move continuously (tracks, parallax layers).
- A dev server started by another session may already hold port 3000; start your own preview.
