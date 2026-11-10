import Image from "next/image";
import type { ReactNode, Ref } from "react";
import SceneVideo from "./SceneVideo";

export type Shot = {
  src: string;
  /** Where the subject sits in the photo (0-1 from the top-left), kept in frame however it is cropped. */
  focus: [number, number];
};

type Props = {
  ref?: Ref<HTMLElement>;
  id?: string;
  /** Wide photo for tablets and desktops. */
  desktop: Shot;
  /** Portrait photo for phones; falls back to the desktop one. */
  mobile?: Shot;
  alt: string;
  /** Optional silent loops played over the photo: a wide one, a tall one for phones, or both. */
  video?: { desktop?: string; mobile?: string; position?: string };
  /** Mirror the picture left to right on wide screens, to leave the copy a clear side. */
  flip?: boolean;
  /** How far the photo is darkened so the copy reads (0 = untouched, 1 = black). */
  dim?: number;
  /** Which side the copy sits on, so the shade is strongest behind it. */
  shade?: "left" | "right" | "full";
  className?: string;
  children: ReactNode;
};

/**
 * One full-screen scene of the homepage film: a photo edge to edge with the copy set over it.
 * The photo here is the fallback. When the WebGL <Stage> is running it reads the same photo from
 * the data attributes, draws it on the fixed canvas behind the page and burns one scene into the next.
 */
export default function Scene({
  ref,
  id,
  desktop,
  mobile,
  alt,
  video,
  flip = false,
  dim = 0.1,
  shade = "left",
  className = "",
  children,
}: Props) {
  const phone = mobile ?? desktop;
  const pos = (s: Shot) => ({ objectPosition: `${s.focus[0] * 100}% ${s.focus[1] * 100}%` });
  const side =
    shade === "left"
      ? "lg:bg-gradient-to-r lg:from-ink/75 lg:via-ink/25 lg:via-40% lg:to-transparent lg:to-65%"
      : shade === "right"
        ? "lg:bg-gradient-to-l lg:from-ink/75 lg:via-ink/25 lg:via-40% lg:to-transparent lg:to-65%"
        : "";

  return (
    <section
      ref={ref}
      id={id}
      data-scene
      data-src={desktop.src}
      data-focus={desktop.focus.join(",")}
      data-src-m={phone.src}
      data-focus-m={phone.focus.join(",")}
      data-dim={dim}
      data-flip={flip ? "1" : undefined}
      className={`relative z-[1] flex min-h-[100svh] flex-col justify-end overflow-clip text-cream ${className}`}
    >
      <div data-scene-fallback className="absolute inset-0 -z-20 bg-ink">
        <Image
          src={desktop.src}
          alt={alt}
          fill
          sizes="100vw"
          className={`object-cover ${mobile ? "max-md:hidden" : ""} ${flip ? "md:-scale-x-100" : ""}`}
          style={pos(desktop)}
        />
        {mobile && (
          <Image src={mobile.src} alt={alt} fill sizes="100vw" className="object-cover md:hidden" style={pos(mobile)} />
        )}
        <div className="absolute inset-0 bg-ink" style={{ opacity: dim }} />
      </div>
      {video && <SceneVideo {...video} dim={dim} flip={flip} />}
      {/* Shade behind the copy: always from the bottom, and from the copy's side on wide screens */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 via-45% to-transparent to-90% lg:from-ink/95 lg:via-ink/35 lg:via-40% lg:to-85%" />
      {/* A soft dark band at the top, so one scene closes into the next without a hard line */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34svh] bg-gradient-to-b from-ink/95 to-transparent" />
      {side && <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${side}`} />}
      {children}
    </section>
  );
}
