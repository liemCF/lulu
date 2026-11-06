import Image from "next/image";
import { cocktails, links, reviews } from "@/lib/content";
import { TLink } from "../PageTransition";

/** The duck: porcelain ground, cobalt ink, the one gold number on the page. */
export function DuckSection() {
  return (
    <section id="duck" className="bg-porcelain px-5 py-24 text-cobalt sm:px-10 lg:px-16 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[2/3] overflow-hidden lg:col-span-5">
          <Image
            src="/images/duck-carving.webp"
            alt="The duck being carved into thin slices at the table"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="photo-zoom object-cover"
          />
        </div>

        <div className="flex flex-col lg:col-span-7">
          <p lang="zh" className="font-cn text-lg tracking-[0.2em]">北京烤鸭</p>
          <h2 className="mt-3 font-display text-[clamp(3.2rem,7.5vw,8rem)] leading-[0.9] tracking-[-0.02em]">
            The Peking duck
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-[34ch] text-lg leading-relaxed text-cobalt/85">
              A whole seven-pound duck, flambéed and carved at your table, served with pancakes and condiments.
              It&apos;s made to order, so ask for it when you book.
            </p>
            <p className="font-display text-[clamp(3rem,5vw,4.5rem)] leading-none text-gold-deep">$108</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={links.reserve} target="_blank" rel="noreferrer" className="pbtn pbtn-cobalt">
              Reserve a table
            </a>
            <TLink href="/menu" className="pbtn pbtn-line">
              See the full menu
            </TLink>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-14 sm:gap-4">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/duck-torch.webp"
                alt="The duck skin being torched until it crisps"
                fill
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="photo-zoom object-cover"
              />
            </div>
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/duck-plated.webp"
                alt="Sliced duck with pancakes, scallion and cucumber"
                fill
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="photo-zoom object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** After dark: the celebrations and the bar, on the night ground. */
export function NightSection() {
  return (
    <section id="after-dark" className="bg-ink px-5 py-24 text-porcelain sm:px-10 lg:px-16 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:order-2">
          <h2 className="font-display text-[clamp(2.8rem,5.5vw,6rem)] leading-[0.95] tracking-[-0.01em]">
            Birthdays, big tables and late nights
          </h2>
          <p className="mt-8 max-w-[38ch] text-lg leading-relaxed text-porcelain/80">
            Book a long table, a semi-private space or the whole room: up to 120 seated or 150 standing. Fridays
            run to 11:30 PM and Saturdays to midnight.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <TLink href="/private-dining" className="pbtn pbtn-gold">
              Plan your event
            </TLink>
            <a href={links.reserve} target="_blank" rel="noreferrer" className="pbtn pbtn-line">
              Reserve a table
            </a>
          </div>

          <h3 className="mt-16 font-display text-2xl italic">From the bar</h3>
          <ul className="mt-5 divide-y divide-porcelain/15 border-y border-porcelain/15">
            {cocktails.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-6 py-3">
                <span>{c.name}</span>
                <span className="font-display text-lg text-gold">${c.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-6 gap-3 sm:gap-4 lg:col-span-7 lg:order-1">
          <div className="relative col-span-6 aspect-square overflow-hidden">
            <Image
              src="/images/night-sparklers.webp"
              alt="Friends holding sparklers over the table"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="photo-zoom object-cover"
            />
          </div>
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden">
            <Image
              src="/images/night-cocktail.webp"
              alt="A bartender pouring a cocktail"
              fill
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="photo-zoom object-cover"
            />
          </div>
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden">
            <Image
              src="/images/night-cheers.webp"
              alt="A table raising their glasses"
              fill
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="photo-zoom object-cover object-[60%_50%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Guests in their own words, still: no carousel. */
export function GuestsSection() {
  return (
    <section className="bg-porcelain px-5 py-24 text-cobalt sm:px-10 lg:px-16 lg:py-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-none">What guests say</h2>
        <p className="text-cobalt/75">From 529 Google reviews</p>
      </div>
      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
        {reviews.slice(0, 3).map((r) => (
          <figure key={r.author} className="border-t border-cobalt/25 pt-8">
            <blockquote className="font-display text-[clamp(1.4rem,1.9vw,1.9rem)] leading-[1.25]">
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-cobalt/70">{r.author}, on Google</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
