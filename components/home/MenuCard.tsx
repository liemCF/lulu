"use client";

import Image from "next/image";
import { useState } from "react";
import { links } from "@/lib/content";
import { TLink } from "../PageTransition";

// Dishes and prices from the restaurant's Toast menu (same list the old home page used).
const dishes = [
  {
    name: "Sichuan Crispy Chicken",
    cn: "辣子鸡",
    price: "$18",
    desc: "Golden-battered chicken tossed in a fragrant, numbing chili oil with dried chilies.",
    image: "/images/dish-sichuan-chicken.webp",
    alt: "Sichuan crispy chicken with dried chilies",
  },
  {
    name: "Sichuan Pickled Fish",
    cn: "酸菜鱼",
    price: "$27",
    desc: "Black fish fillets simmered in a bold, tangy-spicy broth with pickled cabbage.",
    image: "/images/dish-pickled-fish.webp",
    alt: "Pickled fish in a clay pot",
  },
  {
    name: "Beef Short Rib",
    cn: "牛肋排",
    price: "$48",
    desc: "Slow-braised short rib, brought out in a smoking dry-ice box.",
    image: "/images/dish-short-rib.webp",
    alt: "Short rib in a smoking wooden box",
  },
  {
    name: "Wagyu XLB",
    cn: "和牛小笼",
    price: "Made in house",
    desc: "Wagyu beef and mushroom dumplings in rich pork stock, with vinegar and ginger.",
    image: "/images/dish-wagyu-xlb.webp",
    alt: "Dumplings in a bamboo steamer",
  },
];

/** The menu read like the printed card: dotted leaders, prices on the right, the dish photo answers the pointer. */
export default function MenuCard() {
  const [active, setActive] = useState(0);

  return (
    <section id="menu" className="bg-cobalt px-5 py-24 text-porcelain sm:px-10 lg:px-16 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-display text-[clamp(2.8rem,5.5vw,6rem)] leading-[0.95]">From the kitchen</h2>
          <p className="mt-6 max-w-[40ch] text-lg text-porcelain/80">
            Sichuan heat, and a few dishes that arrive with a show.
          </p>

          <ul className="mt-12">
            {dishes.map((d, i) => (
              <li key={d.name} className="border-t border-porcelain/20 last:border-b">
                <div
                  className="group grid grid-cols-[4.5rem_1fr] gap-4 py-6 sm:grid-cols-1"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                >
                  <div className="relative aspect-square overflow-hidden sm:hidden">
                    <Image src={d.image} alt="" fill sizes="72px" className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.2rem)] leading-tight italic">{d.name}</h3>
                      <span lang="zh" className="font-cn text-sm text-porcelain/65 max-sm:hidden">
                        {d.cn}
                      </span>
                      {d.price.startsWith("$") && (
                        <>
                          <span className="mb-1.5 flex-1 border-b border-dotted border-porcelain/35" aria-hidden />
                          <span className="font-display text-xl whitespace-nowrap">{d.price}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-2 max-w-[52ch] text-porcelain/75">
                      {d.desc}
                      {!d.price.startsWith("$") && <span className="font-display italic text-porcelain"> {d.price}.</span>}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <TLink href="/menu" className="pbtn pbtn-porcelain">
              See the full menu
            </TLink>
            <a href={links.order} target="_blank" rel="noreferrer" className="pbtn pbtn-line">
              Order online
            </a>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28 aspect-[3/4] overflow-hidden">
            {dishes.map((d, i) => (
              <Image
                key={d.name}
                src={d.image}
                alt={i === active ? d.alt : ""}
                fill
                sizes="40vw"
                className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
