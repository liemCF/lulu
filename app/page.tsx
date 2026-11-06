import Hero from "@/components/Hero";
import IntroScroller from "@/components/IntroScroller";
import MeetChef from "@/components/MeetChef";
import OptionsSplit, { type Option } from "@/components/OptionsSplit";
import Panorama from "@/components/Panorama";
import Reviews from "@/components/Reviews";
import TwoWorlds from "@/components/TwoWorlds";
import { TLink } from "@/components/PageTransition";

// Homepage order follows the client's "Recommended Homepage Structure" doc:
// experience → signature dish → menu → chef → story → social proof → private dining → Instagram → reservation.

// Dishes and prices from the restaurant's Toast menu.
const dishes: Option[] = [
  {
    name: "Whole Peking Duck",
    cn: "北京烤鸭",
    meta: "$108",
    detail: "A 7 lb duck, flambéed and carved tableside, with pancakes and condiments. Order it ahead.",
    image: "/images/dish-peking-duck.webp",
    alt: "Carved Peking duck with pancakes and condiments",
  },
  {
    name: "Wagyu XLB",
    cn: "和牛小笼",
    meta: "Made in house",
    detail: "Wagyu beef and mushroom soup dumplings in rich pork stock, served with vinegar and ginger.",
    image: "/images/dish-wagyu-xlb.webp",
    alt: "Soup dumplings in a bamboo steamer",
  },
  {
    name: "Sichuan Crispy Chicken",
    cn: "辣子鸡",
    meta: "$18",
    detail: "Golden-battered chicken tossed in a fragrant, numbing chili oil with dried chilies.",
    image: "/images/dish-sichuan-chicken.webp",
    alt: "Sichuan crispy chicken with dried chilies",
  },
  {
    name: "Sichuan Pickled Fish",
    cn: "酸菜鱼",
    meta: "$27",
    detail: "Black fish fillets simmered in a bold, tangy-spicy broth with pickled cabbage.",
    image: "/images/dish-pickled-fish.webp",
    alt: "Pickled fish in a clay pot",
  },
  {
    name: "Beef Short Rib",
    cn: "牛肋排",
    meta: "$48",
    detail: "Slow-braised short rib, served with a theatrical dry-ice display.",
    image: "/images/dish-short-rib.webp",
    alt: "Short rib in a smoking box",
  },
];

// From the private events page.
const occasions: Option[] = [
  {
    name: "Birthdays",
    meta: "Up to 120 seated",
    detail: "Tailored menus, flexible layouts and attentive service, from one long table to the whole room.",
    image: "/images/night-cheers.webp",
    alt: "Guests raising a toast",
  },
  {
    name: "Corporate dinners",
    meta: "Client entertaining",
    detail: "Customisable set menus, full bar service and AV support on request.",
    image: "/images/private-room.webp",
    alt: "The main dining room",
  },
  {
    name: "Cocktail receptions",
    meta: "150+ standing",
    detail: "Canapés and cocktail menus, with dedicated bar access available.",
    image: "/images/night-table.webp",
    alt: "A celebration at the bar",
  },
  {
    name: "Full buy-out",
    meta: "The whole venue",
    detail: "Private dining area, semi-private spaces, or the entire restaurant for your night.",
    image: "/images/private-table.webp",
    alt: "A long table set for a private dinner",
  },
];

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <Hero />
      {/* 2. The Signature Experience */}
      <IntroScroller />
      {/* 3. New Asian Menu */}
      <OptionsSplit
        id="menu"
        tone="light"
        imageSide="right"
        kicker="New Asian Menu"
        heading="Inspired by Asia. Designed for Today."
        intro={
          <>
            <p>
              Lulu Modern celebrates the flavors, traditions, and culinary techniques found across Asia while honoring
              the roots that inspired our journey.
            </p>
            <p>
              From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to
              quality ingredients, bold flavors, and elevated hospitality.
            </p>
          </>
        }
        options={dishes}
        tag="The menu"
        cta={
          <TLink href="/menu" className="btn text-ink">
            View Menu
          </TLink>
        }
      />
      {/* 4. Meet the Chef */}
      <MeetChef />
      {/* 5. Our Story */}
      <TwoWorlds />
      {/* 6. Featured Recognition */}
      <Reviews />
      {/* 7. Private Dining & Celebrations */}
      <OptionsSplit
        id="private"
        tone="dark"
        imageSide="left"
        kicker="Private Dining & Celebrations"
        heading="Celebrations Deserve Something Extraordinary"
        intro={
          <p>
            From birthdays and anniversaries to corporate gatherings and holiday events, Lulu Modern creates memorable
            dining experiences for every occasion.
          </p>
        }
        options={occasions}
        tag="Private dining"
        cta={
          <TLink href="/private-dining" className="btn btn-solid">
            Plan Your Event
          </TLink>
        }
      />
      {/* 8. Instagram Gallery */}
      <Panorama />
      {/* 9. Final CTA lives in the site footer (Visit): "Experience Lulu Modern" */}
    </main>
  );
}
