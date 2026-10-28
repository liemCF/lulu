// Generated from the live menu on lulu-modern.com (Toast menu embed), October 2026.
// Obvious typos fixed (Heineken, Penicillin, Tito's). Prices in USD; null = see options.

export type MenuItem = {
  name: string;
  cn?: string;
  desc?: string;
  price: string | null;
  gf?: boolean;
  gfAvailable?: boolean;
  spicy?: number;
};
export type MenuSection = { id: string; title: string; cn: string; items: MenuItem[] };
export type MenuGroup = { id: string; label: string; cn: string; sections: MenuSection[] };

export const menu: MenuGroup[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    cn: "厨房",
    sections: [
      {
        id: "hot-appetizers",
        title: "Hot Appetizers",
        cn: "热菜",
        items: [
          {
            name: "Duck Battered Truffle Fries",
            cn: "鸭肉裹松露薯条",
            desc: "Crispy duck-battered fries topped with black truffle powder. Served with ketchup and garlic aioli.",
            price: "$7"
          },
          {
            name: "Lulu's Wagyu Roll",
            cn: "和牛芝士汉堡春卷",
            desc: "Crispy spring rolls filled with mozzarella and ground Wagyu beef. Served with a light, zesty mayo sauce.",
            price: "$21"
          },
          {
            name: "Scallion Pancake",
            cn: "葱油饼",
            desc: "Crispy, flaky layers of pan seared until golden brown pancakes with fresh scallions.",
            price: "$7"
          },
          {
            name: "Chilli Pork Wontons",
            cn: "红油抄手",
            desc: "Hand folded pork wontons tossed in Lulu's signature chili oil and vinegar for savory and gentle spice.",
            price: "$11"
          },
          {
            name: "Gua Bao Flight",
            cn: "刈包",
            desc: "Three Taiwanese-style bao: Duck with cucumber, leeks, and duck sauce Short rib with red onion, red vinegar, rice vinegar, bird's eye chili, ground roasted rice, cilantro, and peanuts Pork belly, cucumber, mint",
            price: "$24"
          },
          {
            name: "Crispy Dashi Tofu",
            cn: "炸豆腐",
            desc: "Crispy tofu, warm Dashi, chili oil, pickled radish and scallion.",
            price: "$12"
          }
        ]
      },
      {
        id: "cold-appetizers",
        title: "Cold Appetizers",
        cn: "凉菜",
        items: [
          {
            name: "Chilled Cucumber",
            cn: "凉拌黄瓜",
            desc: "Persian Cucumber, Served cold on small plate with sesame seeds, drizzled numbing oil.",
            price: "$9",
            spicy: 2
          },
          {
            name: "Garlic Edamame",
            cn: "蒜蓉毛豆",
            desc: "Chilled edamame marinated in the chef’s special chili sauce with minced garlic.",
            price: "$7",
            spicy: 2
          },
          {
            name: "Crab Salad",
            cn: "泰式柚子蟹肉沙拉",
            desc: "Fresh Pomelo, lump crab, mint, cilantro, and red onion tossed in a bright citrus dressing with kaffir lime, lemongrass, yuzu, and Thai chili, finished with mango sauce and glass noodles.",
            price: "$23"
          },
          {
            name: "Tuna Tartare",
            cn: "金枪鱼塔塔",
            desc: "Ahi tuna, avocado, cucumber, and green onion tossed in a savory miso-sesame dressing with a touch of wasabi and siracha, nori rice paper crisp finished with a delicate, crisp shiso tuile",
            price: "$20"
          },
          {
            name: "Zaru Cold Udon",
            cn: "日式冷乌冬",
            desc: "Chilled Udon noodles served with a savory dashi-soy dipping sauce, topped with nori, tenkasu, scallions, and fresh ginger",
            price: "$15"
          },
          {
            name: "Hamachi Carpaccio",
            cn: "油甘鱼薄切",
            desc: "Delicately sliced hamachi with bright pomelo, yuzu-lime ponzu, mango, jalapeno, and red onion, finished with sesame, cilantro, and lemon zest",
            price: "$19"
          },
          {
            name: "Saigon Spring Roll",
            cn: "越南春卷",
            desc: "Rice paper rolls filled with shrimp, vermicelli noodles, crisp carrot and cucumber, and fresh mint, finished with sesame oil",
            price: "$12"
          },
          {
            name: "Hand Roll Trio",
            cn: "手卷三件套",
            desc: "Three hand rolls with crisp cucumber, avocado, green onion, sushi rice, and nori, featuring salmon, tuna Tartar, and hamachi",
            price: "$24"
          }
        ]
      },
      {
        id: "dumplings",
        title: "Dumplings",
        cn: "饺子",
        items: [
          {
            name: "Wagyu Fried Dumpling",
            cn: "煎饺",
            desc: "Six pieces of Wagyu beef pan fried dumplings. Serve upside down w. house vinegar sauce",
            price: "$20"
          },
          {
            name: "Shrimp Shumai",
            cn: "虾烧賣",
            desc: "5 Pieces of our traditional Chinese steamed Shumai dumplings, open-topped thin dough filled with savory shrimp, aromatics of ginger and scallions.",
            price: "$12"
          },
          {
            name: "Chicken Dumplings",
            cn: "鸡肉饺子",
            desc: "Choice of 8 pc or 12 pc chicken and sweet corn dumplings made in house. Served W sweet vinegar and chili oil.",
            price: null
          },
          {
            name: "Lulu Veggie Dim Sum Dumplings",
            cn: "蔬菜饺子",
            desc: "Steamed spinach wrapped dumplings filled with eggs, vermicelli noodles.",
            price: "$9"
          }
        ]
      },
      {
        id: "soup",
        title: "Soup",
        cn: "汤",
        items: [
          {
            name: "Hot and Sour Soup",
            cn: "酸辣汤",
            desc: "A comforting blend of shredded chicken, tofu, enoki mushrooms, wood ear mushrooms, and eggs simmered in a tangy, peppery broth top scallion & chili oil.",
            price: "$7"
          },
          {
            name: "Tom Yum",
            price: "$16"
          }
        ]
      },
      {
        id: "duck",
        title: "Duck",
        cn: "烤鸭",
        items: [
          {
            name: "Whole Peking Duck",
            cn: "北京烤鸭(整只)",
            desc: "Peking Duck 7lbs Experience the spectacle of duck skin crisped to perfection, flambéed, and carved tableside, served with pancakes, hoisin, cucumber, fresh scallions, sugar, and pineapples. 2 Course Ducks, Peking Duck, & pick (1 of 3 below) for extra $10 3 Course Duck, Peking Duck, & pick (2 of 3 below) for extra $20 - Crispy duck carcass wok-fried with aromatic garlic, red and green bell peppers, red onions, salt and pepper. - Crispy duck carcass work-fried with Sichuan dry peppers and seasoning. - Duck carcass simmered in tofu and mushroom broth.",
            price: "$108"
          },
          {
            name: "Half Duck",
            cn: "半只烤鸭",
            price: "$58"
          },
          {
            name: "Tofu and Mushrooms Duck Bone Soup",
            cn: "鸭汤",
            price: "$10"
          },
          {
            name: "Sichuan Duck Carcass",
            cn: "香辣鸭架",
            price: "$10"
          },
          {
            name: "Salt and Pepper Crispy Duck Bone",
            cn: "椒盐鸭架",
            price: "$10"
          },
          {
            name: "Pancakes",
            cn: "一笼鸭皮",
            price: "$4"
          },
          {
            name: "Bao Buns",
            cn: "鸭包",
            desc: "Baozi (包子), a staple in Chinese cuisine, consisting of soft, fluffy, white, yeast-leavened buns that are steamed rather than baked",
            price: "$5"
          },
          {
            name: "Holiday Peking Duck Feast",
            desc: "Pre-order takeout holiday feast for PICK UP only. Includes a whole Peking Duck, cucumbers, green onion, hoison sauce, Taiwanese sausage fried rice, bao buns, crepes, green beans, duck and mushroom tofu soup, and a 6 oz bottle of Smala chili oil sauce.",
            price: "$188"
          }
        ]
      },
      {
        id: "entrees",
        title: "Entrées",
        cn: "主菜",
        items: [
          {
            name: "Beef Short Rib",
            cn: "原汁牛肋排",
            desc: "Slow-braised beef short rib, served with a theatrical dry-ice display and drizzled with our signature rib sauce.",
            price: "$48"
          },
          {
            name: "Sichuan Pickled Fish",
            cn: "酸菜煮黑鱼片",
            desc: "Black fish fillets gently simmered in a bold, tangy-spicy broth with pickled cabbage, Enoki mushrooms, and springy rice noodles.",
            price: "$27",
            gf: true,
            spicy: 1
          },
          {
            name: "Cumin Lamb on Sizzling Plate",
            cn: "铁板孜然羊肉",
            desc: "Thinly sliced lamb, wok-fried to perfection, tossed with cumin, longhorn pepper, and onions, and served tableside flambé on a sizzling plate for a dramatic presentation",
            price: "$29",
            gfAvailable: true,
            spicy: 3
          },
          {
            name: "New Zealand Lamb Chops",
            cn: "新西兰小羊排",
            desc: "Tender lamb chops, expertly grilled and seasoned in a honey chili lime rub, topped with black garlic sauce.",
            price: "$41",
            gf: true
          },
          {
            name: "General Tso Shrimp",
            cn: "左宗虾",
            desc: "Shrimp, Chili Peppers",
            price: "$21"
          },
          {
            name: "Sichuan Crispy Chicken",
            cn: "辣子鸡",
            desc: "Golden-battered chicken tossed in a fragrant, numbing chili oil with dried chilies for a bold, balanced heat.",
            price: "$18",
            spicy: 3
          },
          {
            name: "String Bean",
            cn: "四季豆",
            desc: "Wok-fried string beans with minced beef and aromatic spices.",
            price: "$13",
            gfAvailable: true,
            spicy: 1
          },
          {
            name: "General Tso Chicken",
            cn: "左宗鸡",
            desc: "Chicken, Chili Peppers",
            price: "$18"
          },
          {
            name: "Yuzu Orange Wagyu Beef",
            desc: "Japanese Wagyu with Lulu signature Yuzu and Orange sauce, sesame and green onions",
            price: "$27"
          },
          {
            name: "Filipino Coconut Curry",
            cn: "椰汁辣炒肉片",
            desc: "Crispy pork belly simmered in coconut milk with garlic, ginger, lemongrass, curry, and bird's eye chilies, finished with cabbage, green onion, crunchy chili garlic oil, lime, and cilantro. Served with a bamboo leaf garnish.",
            price: "$18"
          },
          {
            name: "Lion's Mane Nigiri",
            cn: "猴头菇握寿司",
            desc: "Seared Lion's Mane mushroom with teriyaki, soy, garlic, ginger, and chili oil over sushi rice, finished with wasabi and green onion",
            price: "$22"
          },
          {
            name: "Wagyu Nigiri",
            cn: "和牛握寿司",
            desc: "A5 Wagyu over sushi rice, topped with a cured quail egg, garlic crisp, green onion, sesame oil, sesame seeds, and a savory soy-rice wine glaze.",
            price: "$25"
          },
          {
            name: "Thai Hot Pot",
            cn: "泰式火锅",
            desc: "Wagyu and pork ribs simmered in a spicy Thai chili broth with cilantro, green onion, lime, and roasted rice.",
            price: "$34"
          },
          {
            name: "Lulu's Sashimi Assortment",
            desc: "5 pieces of hamachi, 5 pieces of salmon, tuna Tartar on a rice nori crisp, fried Tiger prawn heads, wasabi kazami, and pickled ginger. Served with dry ice and edible gold flakes.",
            price: "$32"
          },
          {
            name: "Tamarind Tiger Prawns",
            cn: "亚参虾",
            desc: "Wok tossed tamarind glazed tiger prawns, served with ginger, garlic, and chilies.",
            price: "$24"
          }
        ]
      },
      {
        id: "vegetables",
        title: "Vegetables",
        cn: "素菜",
        items: [
          {
            name: "Chinese Broccoli",
            cn: "蒜炒唐芥兰",
            desc: "Crisp-tender Chinese broccoli wok-stir-fried with fresh garlic and a light seasoning, preserving its natural sweetness and vibrant bite. GF",
            price: "$12",
            gf: true
          },
          {
            name: "Bok Choy",
            price: "$12"
          }
        ]
      },
      {
        id: "sides",
        title: "Sides",
        cn: "配菜",
        items: [
          {
            name: "Premium Rice",
            cn: "白饭",
            desc: "slightly sweet and floral flavor, with a delicate, nutty, and aromatic taste",
            price: "$2"
          },
          {
            name: "Egg Fried Rice",
            cn: "蛋炒饭",
            desc: "Egg with scallion and rice",
            price: "$9",
            gf: true
          },
          {
            name: "Taiwanese Sausage Fried Rice",
            cn: "主厨炒饭",
            desc: "Chef fried rice with Taiwanese sausage, smoked pork belly l, egg, Thai chili pepper and scallion.",
            price: "$17",
            spicy: 3
          }
        ]
      },
      {
        id: "dessert",
        title: "Dessert",
        cn: "甜品",
        items: [
          {
            name: "Japanese Milk Pudding",
            cn: "鸡蛋布丁",
            price: "$10"
          },
          {
            name: "Mango Bodin",
            price: "$15"
          },
          {
            name: "Lulu's Asian Entremet",
            desc: "Rose milk soaked brown butter cake with cardamom mousse, blackberry-shiso filling, a delicate chocolate shell, edible gold flakes, and blackberry shiso tuile.",
            price: "$20"
          }
        ]
      },
      {
        id: "brunch",
        title: "Brunch",
        cn: "早午餐",
        items: [
          {
            name: "Brunch Bao Combo",
            desc: "3 Bao buns stuffed with crispy pork belly with a sweet glaze, lightly scrambled eggs, chili crisps, chili vinegar sauce, cilantro green onions and finished with smoked Maldon salt. Served with a Yuzu Orange mimosa.",
            price: "$25"
          }
        ]
      }
    ]
  },
  {
    id: "bar",
    label: "Bar",
    cn: "酒吧",
    sections: [
      {
        id: "signature-cocktails",
        title: "Signature Cocktails",
        cn: "特调",
        items: [
          {
            name: "Kiss of the Dragon",
            price: "$13"
          },
          {
            name: "Espressotini",
            price: "$13"
          },
          {
            name: "Korean Porn Star",
            price: "$13"
          },
          {
            name: "Kung Fu Panda",
            price: "$19"
          },
          {
            name: "Once Upon a Flame",
            price: "$22"
          },
          {
            name: "Penicillin",
            price: "$13"
          },
          {
            name: "Pretty N Lychee",
            price: "$16"
          },
          {
            name: "Prickly Pear-loma",
            price: "$13"
          },
          {
            name: "The Great Old Fashioned",
            price: "$20"
          },
          {
            name: "Toki Highball",
            desc: "Toki whiskey with plum bitters club soda and",
            price: "$15"
          },
          {
            name: "Tokyo Drift",
            price: "$14"
          },
          {
            name: "Ube? You May!",
            price: "$13"
          },
          {
            name: "Wayfinder Martini",
            price: "$13"
          },
          {
            name: "White Lotus",
            price: "$13"
          },
          {
            name: "Yuzu Margarita",
            price: "$13"
          },
          {
            name: "Low Key Midori",
            price: "$10"
          },
          {
            name: "Matcha Matcha",
            price: "$12"
          }
        ]
      },
      {
        id: "zero-proof-soft",
        title: "Zero Proof & Soft",
        cn: "无酒精",
        items: [
          {
            name: "Acqua Panna 1L",
            price: "$6"
          },
          {
            name: "Coke (Made in Mexico)",
            price: "$5"
          },
          {
            name: "Honey Lemonade",
            price: "$6"
          },
          {
            name: "Eye of the Tiger (Zero Proof)",
            price: "$12"
          },
          {
            name: "White Lotus (Zero Proof)",
            price: "$11"
          },
          {
            name: "Pear-aloma (Zero Proof)",
            price: "$11"
          },
          {
            name: "Ube? You May! (Zero Proof)",
            price: "$11"
          },
          {
            name: "Kiss of The Dragon (Zero Proof)",
            price: "$11"
          },
          {
            name: "Jasmine Hot Tea",
            price: "$6"
          },
          {
            name: "Oolong Hot Tea",
            price: "$6"
          },
          {
            name: "San Pellegrino",
            price: "$7"
          },
          {
            name: "Topo Chico",
            price: "$5"
          }
        ]
      },
      {
        id: "bottle-beer",
        title: "Bottle Beer",
        cn: "啤酒",
        items: [
          {
            name: "Asahi",
            price: "$7"
          },
          {
            name: "Corona",
            price: "$6"
          },
          {
            name: "Dos Equis",
            price: "$6"
          },
          {
            name: "Heineken",
            price: "$7"
          },
          {
            name: "Modelo",
            price: "$6"
          },
          {
            name: "Stella Artois",
            price: "$7"
          },
          {
            name: "Tsing Tao",
            price: "$8"
          },
          {
            name: "Coors Light",
            price: "$6"
          },
          {
            name: "Tecate",
            price: "$5"
          },
          {
            name: "Ultra",
            price: "$6"
          }
        ]
      }
    ]
  },
  {
    id: "after-dark",
    label: "After Dark",
    cn: "夜",
    sections: [
      {
        id: "nightlife-shots",
        title: "Nightlife Shots",
        cn: "夜场",
        items: [
          {
            name: "Well Tequila",
            price: "$5"
          },
          {
            name: "Well Gin",
            price: "$5"
          },
          {
            name: "Well Whiskey",
            price: "$5"
          },
          {
            name: "Well Vodka",
            price: "$5"
          },
          {
            name: "Tres Agave Blanco Shot",
            price: "$7"
          },
          {
            name: "Tito's Shot",
            price: "$7"
          },
          {
            name: "Green Tea Shot",
            price: "$7"
          },
          {
            name: "White Tea Shot",
            price: "$7"
          },
          {
            name: "Lemondrop Shot",
            price: "$7"
          },
          {
            name: "Mexican Candy",
            price: "$7"
          }
        ]
      },
      {
        id: "champagne",
        title: "Champagne",
        cn: "香槟",
        items: [
          {
            name: "Moet Brut Imperial",
            price: "$175"
          },
          {
            name: "Veuve Brut",
            price: "$250"
          },
          {
            name: "Moet Rose Imperial",
            price: "$250"
          },
          {
            name: "Dom Perignon",
            price: "$700"
          },
          {
            name: "Dom Perignon Rose",
            price: "$1,150"
          },
          {
            name: "Ace of Spades",
            price: "$850"
          }
        ]
      },
      {
        id: "champagne-magnums",
        title: "Champagne Magnums",
        cn: "香槟大瓶",
        items: [
          {
            name: "Dom Perignon Brut 1.5L",
            price: "$1,200"
          },
          {
            name: "Dom Perignon Rose 1.5L",
            price: "$2,250"
          }
        ]
      },
      {
        id: "vodka",
        title: "Vodka",
        cn: "伏特加",
        items: [
          {
            name: "Tito's",
            price: "$250"
          },
          {
            name: "Grey Goose",
            price: "$325"
          }
        ]
      },
      {
        id: "tequila",
        title: "Tequila",
        cn: "龙舌兰",
        items: [
          {
            name: "Tres Agave Blanco",
            price: "$200"
          },
          {
            name: "Don Julio Blanco",
            price: "$325"
          },
          {
            name: "Casamigos Blanco",
            price: "$350"
          },
          {
            name: "Clase Azul Plata",
            price: "$475"
          },
          {
            name: "Tres Agave Repo",
            price: "$225"
          },
          {
            name: "Don Julio Repo",
            price: "$375"
          },
          {
            name: "Casamigos Repo",
            price: "$375"
          },
          {
            name: "Clase Azul Repo",
            price: "$550"
          },
          {
            name: "Don Julio Cristalino",
            price: "$425"
          },
          {
            name: "Don Julio 1942",
            price: "$500"
          },
          {
            name: "Lalo",
            price: "$500"
          }
        ]
      },
      {
        id: "tequila-large-format",
        title: "Tequila Large Format",
        cn: "龙舌兰大瓶",
        items: [
          {
            name: "Casamigos Blanco 1.75L",
            price: "$600"
          },
          {
            name: "Casamigos Repo 1.75L",
            price: "$700"
          },
          {
            name: "Don Julio 1942 1.75L",
            price: "$1,400"
          },
          {
            name: "Clase Azul Repo 1.75L",
            price: "$1,500"
          }
        ]
      },
      {
        id: "cognac",
        title: "Cognac",
        cn: "干邑",
        items: [
          {
            name: "Hennessy VSOP",
            price: "$425"
          }
        ]
      },
      {
        id: "bourbon-whiskey",
        title: "Bourbon & Whiskey",
        cn: "威士忌",
        items: [
          {
            name: "Crown Royal",
            price: "$250"
          },
          {
            name: "Jack Daniel's",
            price: "$250"
          },
          {
            name: "Jameson",
            price: "$300"
          }
        ]
      },
      {
        id: "scotch",
        title: "Scotch",
        cn: "苏格兰威士忌",
        items: [
          {
            name: "Johnnie Walker Black",
            price: "$325"
          },
          {
            name: "Macallan 12 Year",
            price: "$500"
          },
          {
            name: "Johnnie Walker Blue",
            price: "$850"
          }
        ]
      }
    ]
  }
];
