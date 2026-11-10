// All copy below is taken from lulu-modern.com unless marked DRAFT.

export const links = {
  reserve: "https://www.opentable.com/r/lulu-modern-chinese",
  duckExperience: "https://www.opentable.com/r/lulu-modern-chinese",
  order: "https://order.toasttab.com/online/lulu-modern-3310",
  directions: "https://maps.app.goo.gl/nzhzDW9sRxwtE45r8?g_st=ic",
  instagram: "https://www.instagram.com/lulu.modern/",
  tiktok: "https://www.tiktok.com/@lulumodern",
  facebook: "https://www.facebook.com/lulumodernchinese/",
  phone: "tel:+12145014430",
  email: "mailto:info@lulu-modern.com",
  privateInquiry: "https://lulu-modern.com/index.php/private-events-catering/",
};

export const info = {
  name: "Lulu Modern Chinese",
  owner: "Sunny Chang",
  email: "info@lulu-modern.com",
  phone: "(214) 501-4430",
  phoneRaw: "214-501-4430",
  address: "3310 Dallas Pkwy Ste 121",
  city: "Plano, TX 75093",
  instagram: "@lulu.modern",
  region: "Plano · Dallas-Fort Worth",
};

export const hours = [
  { day: "Sunday", time: "11:00 AM - 10:00 PM" },
  { day: "Monday", time: "4:30 PM - 10:00 PM" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wed - Thu", time: "4:30 PM - 10:00 PM" },
  { day: "Friday", time: "4:30 PM - 11:30 PM", late: true },
  { day: "Saturday", time: "11:00 AM - 12:00 AM", late: true },
];

// Same hours as minutes-from-midnight, indexed Sunday = 0. Restaurant time is America/Chicago.
export const schedule: ([number, number] | null)[] = [
  [11 * 60, 22 * 60],
  [16 * 60 + 30, 22 * 60],
  null,
  [16 * 60 + 30, 22 * 60],
  [16 * 60 + 30, 22 * 60],
  [16 * 60 + 30, 23 * 60 + 30],
  [11 * 60, 24 * 60],
];
export const timeZone = "America/Chicago";

// Main navigation, in the order the client asked for. Reservations goes straight to OpenTable.
export type NavItem = { label: string; href: string; external?: boolean };
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Private Dining", href: "/private-dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
  { label: "Reservations", href: links.reserve, external: true },
];

export const duckSteps = [
  {
    no: "01",
    title: "Crispy Skin",
    // DRAFT copy: original site only lists the three titles.
    body: "Lacquered, roasted and set alight until the skin turns glass-crisp.",
    image: "/images/duck-torch.webp",
  },
  {
    no: "02",
    title: "Hand-Carved Service",
    body: "Carved tableside into thin, glistening slices, served with house pancakes and condiments.",
    image: "/images/duck-carving.webp",
  },
  {
    no: "03",
    title: "Unforgettable Presentation",
    body: "A whole seven-pound duck, flambéed at your table. The whole room turns to watch.",
    image: "/images/duck-neon.webp",
  },
];

export const dishes = [
  {
    name: "Traditional Pork XLB",
    cn: "小笼包",
    desc: "Authentic pork soup dumpling made in house. Served with vinegar and ginger.",
    image: "/images/dish-pork-xlb.webp",
  },
  {
    name: "Wagyu XLB",
    cn: "和牛小笼",
    desc: "Wagyu beef and mushroom soup dumplings in rich pork stock. Served with vinegar and ginger.",
    image: "/images/dish-wagyu-xlb.webp",
  },
  {
    name: "Whole Peking Duck",
    cn: "北京烤鸭",
    desc: "Tableside carved Peking duck with pancakes and condiments; option of two or three course add on.",
    image: "/images/dish-peking-duck.webp",
  },
  {
    name: "Sichuan Crispy Chicken",
    cn: "辣子鸡",
    desc: "Golden-battered chicken tossed in a fragrant, numbing chili oil with dried chilies for a bold & balanced heat.",
    image: "/images/dish-sichuan-chicken.webp",
  },
  {
    name: "Sichuan Pickled Fish",
    cn: "酸菜鱼",
    desc: "Black fish in a tangy, spicy pickled-mustard broth.",
    image: "/images/dish-pickled-fish.webp",
  },
  {
    name: "Beef Short Rib",
    cn: "牛小排",
    desc: "Slow-braised short rib, finished with a dry-ice presentation.",
    image: "/images/dish-short-rib.webp",
  },
];

export const cocktails = [
  { name: "Kiss of the Dragon", price: "13" },
  { name: "Pretty N Lychee", price: "16" },
  { name: "Kung Fu Panda", price: "19" },
  { name: "The Great Old Fashioned", price: "20" },
  { name: "Once Upon a Flame", price: "22" },
];

// Media mentions for "What People Are Saying" and the Press page. Each link was checked live.
// Add press logos, awards and notable visits here as the restaurant sends them.
export type PressItem = { outlet: string; headline?: string; url?: string; logo?: string };
export const press: PressItem[] = [
  {
    outlet: "CultureMap Dallas",
    headline: "Lulu Modern Chinese restaurant to bring NY vibe to West Plano Village",
    url: "https://dallas.culturemap.com/news/restaurants-bars/lulu-modern-chinese-plano/",
  },
  {
    outlet: "CraveDFW",
    headline: "Lulu Modern Chinese Brings a Big-City Edge to Plano",
    url: "https://cravedfw.com/2026/04/13/lulu-modern-chinese-more-than-the-duck/",
  },
  {
    outlet: "EscapeHatchDallas",
    headline: "Lulu Modern Chinese Brings New York Nerve and Flaming Peking Duck to Plano",
    url: "https://escapehatchdallas.com/2026/04/lulu-modern-chinese-brings-new-york-nerve-and-flaming-peking-duck-to-plano/",
  },
];

export const reviews = [
  {
    author: "Janet Le",
    text: "We had a wonderful experience for my sister’s birthday here! Food was great (and we are picky Asians)! Service was impeccable.",
  },
  {
    author: "Jayden",
    text: "Amazing service from Madison & Ade! 10/10 food, service, and atmosphere.",
  },
  {
    author: "Linda Lam",
    text: "My girlfriends and I came in w/o any expectations, but were surely impressed with the presentation and flavors of each dish!",
  },
  {
    author: "Matt Wilson",
    text: "Incredible food and service! Every dish was top notch.",
  },
];

export const occasions = [
  { name: "Birthdays", image: "/images/night-sparklers.webp" },
  { name: "Anniversaries", image: "/images/night-table.webp" },
  { name: "Corporate Gatherings", image: "/images/private-room.webp" },
  { name: "Holiday Events", image: "/images/private-table.webp" },
];

export const gallery = [
  { src: "/images/night-sparklers.webp", alt: "Guests celebrating with sparklers" },
  { src: "/images/gallery-duck-platter.webp", alt: "Peking duck platter" },
  { src: "/images/night-bar.webp", alt: "The back bar at Lulu" },
  { src: "/images/dish-wok.webp", alt: "Wok-tossed beef" },
  { src: "/images/night-cheers.webp", alt: "A table raising a toast" },
  { src: "/images/gallery-spread.webp", alt: "A table spread of dim sum and duck" },
  { src: "/images/night-cocktail.webp", alt: "Bartender pouring a cocktail" },
  { src: "/images/duck-plated.webp", alt: "Carved duck with condiments" },
];
