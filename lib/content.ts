// All copy below is taken from lulu-modern.com unless marked DRAFT.

export const links = {
  reserve: "https://www.opentable.com/r/lulu-modern-chinese",
  duckExperience: "https://www.opentable.com/r/lulu-modern-chinese",
  order: "https://order.toasttab.com/online/lulu-modern-3310",
  directions: "https://maps.app.goo.gl/nzhzDW9sRxwtE45r8?g_st=ic",
  instagram: "https://www.instagram.com/lulu.modern/",
  tiktok: "https://www.tiktok.com/@lulumodern",
  phone: "tel:+12145014430",
  privateInquiry: "https://lulu-modern.com/index.php/private-events-catering/",
};

export const info = {
  name: "Lulu Modern Chinese",
  address: "3310 Dallas Pkwy Suite 121",
  city: "Plano, TX 75093",
  phone: "(214) 501-4430",
  region: "Plano · Dallas-Fort Worth",
};

export const hours = [
  { day: "Sunday", time: "11:00 AM – 10:00 PM" },
  { day: "Monday", time: "4:30 PM – 10:00 PM" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wed – Thu", time: "4:30 PM – 10:00 PM" },
  { day: "Friday", time: "4:30 PM – 11:30 PM", late: true },
  { day: "Saturday", time: "11:00 AM – 12:00 AM", late: true },
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

export const nav = [
  { label: "Menu", href: "/menu" },
  { label: "The Duck", href: "/#duck" },
  { label: "After Dark", href: "/#after-dark" },
  { label: "Our Story", href: "/story" },
  { label: "Private Dining", href: "/private-dining" },
  { label: "Gallery", href: "/gallery" },
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
  { name: "Holiday Events", image: "/images/private-guest.webp" },
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
