// Every photo here comes from lulu-modern.com (resized to webp in public/images).

export type Photo = {
  src: string;
  alt: string;
  w: number;
  h: number;
  tag: "food" | "nights" | "room";
};

export const photos: Photo[] = [
  { src: "/images/hero-duck-flame.webp", alt: "Flaming Peking Duck carved tableside", w: 2200, h: 1467, tag: "food" },
  { src: "/images/night-sparklers.webp", alt: "Guests celebrating with sparklers", w: 1863, h: 1863, tag: "nights" },
  { src: "/images/dish-pork-xlb.webp", alt: "Pork soup dumplings in a bamboo steamer", w: 800, h: 1199, tag: "food" },
  { src: "/images/night-bar.webp", alt: "The back bar at Lulu", w: 2200, h: 1470, tag: "room" },
  { src: "/images/duck-chef-flame.webp", alt: "The chef flambéing a whole duck", w: 1467, h: 2200, tag: "food" },
  { src: "/images/night-cheers.webp", alt: "A table raising a toast", w: 2000, h: 1333, tag: "nights" },
  { src: "/images/story-lulu.webp", alt: "Lulu, the muse of Lulu Modern", w: 1554, h: 2200, tag: "room" },
  { src: "/images/dish-sichuan-chicken.webp", alt: "Sichuan crispy chicken with dried chilies", w: 1200, h: 1799, tag: "food" },
  { src: "/images/night-cocktail.webp", alt: "A bartender pouring a cocktail", w: 1468, h: 2200, tag: "nights" },
  { src: "/images/duck-carving.webp", alt: "Peking duck carved by hand", w: 1467, h: 2200, tag: "food" },
  { src: "/images/private-table.webp", alt: "A long table set for a celebration", w: 2200, h: 1468, tag: "room" },
  { src: "/images/dish-short-rib.webp", alt: "Beef short rib in a smoking box", w: 1200, h: 800, tag: "food" },
  { src: "/images/night-room.webp", alt: "A full dining room on a busy night", w: 2000, h: 2000, tag: "nights" },
  { src: "/images/dish-pickled-fish.webp", alt: "Sichuan pickled fish in a clay pot", w: 1467, h: 2200, tag: "food" },
  { src: "/images/story-mural.webp", alt: "The Lulu opera mural", w: 857, h: 1523, tag: "room" },
  { src: "/images/duck-neon.webp", alt: "Duck flambéed under neon light", w: 2000, h: 1333, tag: "food" },
  { src: "/images/night-energy.webp", alt: "Sparklers at the table", w: 1080, h: 1350, tag: "nights" },
  { src: "/images/dish-peking-duck.webp", alt: "Peking duck with pancakes and condiments", w: 1467, h: 2200, tag: "food" },
  { src: "/images/private-guest.webp", alt: "A guest enjoying dinner", w: 1468, h: 2200, tag: "room" },
  { src: "/images/dish-wok.webp", alt: "Wok-tossed beef", w: 1467, h: 2200, tag: "food" },
  { src: "/images/night-table.webp", alt: "A celebration with sparklers", w: 1200, h: 800, tag: "nights" },
  { src: "/images/gallery-spread.webp", alt: "A table spread of dim sum and duck", w: 1200, h: 1799, tag: "food" },
  { src: "/images/private-room.webp", alt: "The main dining room", w: 1440, h: 1920, tag: "room" },
  { src: "/images/duck-torch.webp", alt: "Torching the duck skin", w: 2000, h: 1333, tag: "food" },
  { src: "/images/dish-wagyu-xlb.webp", alt: "Soup dumplings", w: 720, h: 1078, tag: "food" },
  { src: "/images/gallery-duck-platter.webp", alt: "Peking duck platter", w: 1600, h: 1067, tag: "food" },
  { src: "/images/duck-plated.webp", alt: "Carved duck with condiments", w: 1590, h: 1062, tag: "food" },
];
