import Image from "next/image";
import HeroWord from "@/components/v2/HeroWord";
import { TLink } from "@/components/PageTransition";
import { cocktails, links, reviews } from "@/lib/content";

// Dishes and prices from the restaurant's Toast menu (same as the current home page).
const dishes = [
  {
    name: "Whole Peking Duck",
    cn: "北京烤鸭",
    price: "$108",
    note: "Flambéed and carved tableside, with pancakes",
    image: "/images/v2-duck-spread.webp",
    alt: "Peking duck carved on a board with pancakes, sauces and dim sum around it",
    big: true,
  },
  {
    name: "Sichuan Crispy Chicken",
    cn: "辣子鸡",
    price: "$18",
    note: "Numbing chili oil, dried chilies",
    image: "/images/dish-sichuan-chicken.webp",
    alt: "Sichuan crispy chicken with dried chilies",
  },
  {
    name: "Sichuan Pickled Fish",
    cn: "酸菜鱼",
    price: "$27",
    note: "Black fish, tangy-spicy broth",
    image: "/images/dish-pickled-fish.webp",
    alt: "Pickled fish in a clay pot",
  },
  {
    name: "Beef Short Rib",
    cn: "牛小排",
    price: "$48",
    note: "Slow-braised, served under smoke",
    image: "/images/v2-short-rib.webp",
    alt: "Short rib on a grill in a smoking wooden box",
  },
  {
    name: "Wagyu XLB",
    cn: "和牛小笼",
    price: "",
    note: "Wagyu and mushroom soup dumplings",
    image: "/images/dish-wagyu-xlb.webp",
    alt: "Soup dumplings in a bamboo steamer",
  },
];

export default function Home() {
  return (
    <main className="bg-ink text-porcelain">
      <HeroWord />

      {/* ---------- The duck: a royal-blue flood ---------- */}
      <section id="duck" className="relative overflow-hidden bg-royal px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-cn text-2xl text-gold">北京烤鸭</p>
            <h2 className="t-wide mt-4 text-[clamp(3rem,9vw,9.5rem)]">
              The
              <br />
              Duck
            </h2>
            <p className="t-wide-light mt-8 max-w-xl text-lg leading-relaxed text-porcelain/90 sm:text-xl">
              A whole seven-pound duck, set alight and carved at your table, with house pancakes and condiments. The
              whole room turns to watch. Order it ahead when you book.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href={links.duckExperience} target="_blank" rel="noreferrer" className="btn btn-solid">
                Reserve the duck
              </a>
              <span className="t-wide text-4xl text-gold">$108</span>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[857/1300] w-full overflow-hidden">
              <Image
                src="/images/story-mural.webp"
                alt="A chef flames a Peking duck in front of Lulu's opera mural"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden w-[46%] border-[6px] border-royal sm:block">
              <div className="relative aspect-[2/3]">
                <Image src="/images/duck-carving.webp" alt="The duck carved tableside" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The menu: a mixed grid ---------- */}
      <section id="menu" className="px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="t-wide text-[clamp(2.6rem,7vw,7rem)]">On the table</h2>
          <div className="flex gap-6 text-sm">
            <TLink href="/menu" className="link-line text-gold">
              The full menu
            </TLink>
            <a href={links.order} target="_blank" rel="noreferrer" className="link-line text-porcelain/80">
              Order online
            </a>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(0,22rem))]">
          {dishes.map((d) => (
            <li
              key={d.name}
              className={`group relative overflow-hidden bg-night ${
                d.big ? "col-span-2 aspect-[4/5] lg:row-span-2 lg:aspect-auto" : "aspect-[3/4] lg:aspect-auto"
              }`}
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                sizes={d.big ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <p className="font-cn text-xs text-gold sm:text-sm">{d.cn}</p>
                  <h3 className={`t-wide-light mt-1 leading-tight ${d.big ? "text-2xl sm:text-3xl" : "text-sm sm:text-lg"}`}>{d.name}</h3>
                  <p className="mt-1 hidden text-sm text-porcelain/70 sm:block">{d.note}</p>
                </div>
                <span className={`t-wide shrink-0 text-gold ${d.big ? "text-3xl" : "text-base sm:text-xl"}`}>{d.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- After dark ---------- */}
      <section id="after-dark" className="relative min-h-[100svh] overflow-hidden">
        <Image src="/images/v2-party-table.webp" alt="A birthday table at Lulu with sparklers" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30 lg:bg-gradient-to-r lg:from-ink lg:via-ink/75 lg:to-ink/10" />
        <div className="relative grid min-h-[100svh] content-end gap-12 px-5 py-24 sm:px-10 lg:grid-cols-12 lg:px-16">
          <div className="lg:col-span-7">
            <h2 className="t-wide text-[clamp(2.6rem,7vw,7rem)]">
              Late on
              <br />
              weekends
            </h2>
            <p className="t-wide-light mt-6 max-w-lg text-lg text-porcelain/85">
              Friday till 11:30 PM. Saturday till midnight. Sparklers for the birthday table, and the bar keeps pouring.
            </p>
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <p className="t-wide text-sm text-gold">From the bar</p>
            <ul className="mt-4 divide-y divide-porcelain/15 border-y border-porcelain/15">
              {cocktails.map((c) => (
                <li key={c.name} className="flex items-baseline justify-between py-3">
                  <span className="t-wide-light">{c.name}</span>
                  <span className="tabular-nums text-gold">${c.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Private dining, on lacquer (AI-made texture, background only) ---------- */}
      <section id="private" className="relative overflow-hidden px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <Image src="/images/v2-lacquer-ai.webp" alt="" fill sizes="100vw" className="object-cover opacity-90" />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[3/2] overflow-hidden lg:col-span-6">
            <Image src="/images/private-table.webp" alt="A long table set for a private dinner" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="t-wide text-[clamp(2.4rem,5vw,5rem)]">Bring everyone</h2>
            <dl className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-porcelain/60">Seated</dt>
                <dd className="t-wide text-4xl text-gold">120</dd>
              </div>
              <div>
                <dt className="text-sm text-porcelain/60">Standing</dt>
                <dd className="t-wide text-4xl text-gold">150+</dd>
              </div>
            </dl>
            <p className="t-wide-light mt-8 text-lg text-porcelain/85">
              Birthdays, corporate dinners, cocktail receptions, or the whole restaurant for the night. Tailored menus and full bar service.
            </p>
            <TLink href="/private-dining" className="btn btn-solid mt-10">
              Plan your event
            </TLink>
          </div>
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      <section className="bg-royal px-5 py-24 sm:px-10 lg:px-16 lg:py-28">
        <h2 className="sr-only">What guests say</h2>
        <ul className="grid gap-12 lg:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <li key={r.author}>
              <figure>
                <blockquote className="t-wide-light text-xl leading-snug sm:text-2xl">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-sm text-gold">{r.author}, on Google</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
