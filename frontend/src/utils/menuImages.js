const curatedImages = {
  "paneer tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
  "veg manchurian": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  "butter chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
  "chicken biryani": "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=1200&q=80",
  "veg biryani": "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=1200&q=80",
  "paneer butter masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
  "kadai paneer": "https://images.unsplash.com/photo-1666001094462-7f3f04b6ac5e?auto=format&fit=crop&w=1200&q=80",
  "dal makhani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
  "palak paneer": "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=1200&q=80",
  "chilli paneer": "https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=1200&q=80",
  "paneer lababdar": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
  "paneer fried rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
  "veg fried rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
  noodles: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
  "hakka noodles": "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
  "spring roll": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  "veg spring roll": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  momos: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80",
  "chicken lollipop": "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1200&q=80",
  "tandoori chicken": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=80",
  "chicken curry": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  "fish curry": "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=1200&q=80",
  "masala dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
  dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
  idli: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
  vada: "https://images.unsplash.com/photo-1601050690117-64b6d3fb11d1?auto=format&fit=crop&w=1200&q=80",
  samosa: "https://images.unsplash.com/photo-1601050690117-64b6d3fb11d1?auto=format&fit=crop&w=1200&q=80",
  kachori: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
  pakora: "https://images.unsplash.com/photo-1601050690117-64b6d3fb11d1?auto=format&fit=crop&w=1200&q=80",
  "french fries": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
  "garlic naan": "https://images.unsplash.com/photo-1600628422019-25a9f5aa2369?auto=format&fit=crop&w=1200&q=80",
  naan: "https://images.unsplash.com/photo-1600628422019-25a9f5aa2369?auto=format&fit=crop&w=1200&q=80",
  roti: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  paratha: "https://images.unsplash.com/photo-1626500155537-93690c24099e?auto=format&fit=crop&w=1200&q=80",
  "gulab jamun": "https://images.pexels.com/photos/15014919/pexels-photo-15014919.jpeg?cs=srgb&dl=pexels-nishess-shakya-401526881-15014919.jpg&fm=jpg",
  "ice cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
  brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
  mojito: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  "cold coffee": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
  "lemon soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
  "lime soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
  coffee: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
  tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
  juice: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1200&q=80",
  starter: "https://images.unsplash.com/photo-1541013406133-94ed77ee8ba8?auto=format&fit=crop&w=1200&q=80",
  starters: "https://images.unsplash.com/photo-1541013406133-94ed77ee8ba8?auto=format&fit=crop&w=1200&q=80",
  appetizer: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "main course": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  main: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  beverage: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  dessert: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
  desserts: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
  soup: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
  sandwiches: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
  biryani: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=1200&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
};

const normalize = (value) => String(value || "").trim().toLowerCase();
const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]+$/i;

const imageFileMap = {
  "paneer.jpg": curatedImages["paneer tikka"],
  "manchurian.jpg": curatedImages["veg manchurian"],
  "butterchicken.jpg": curatedImages["butter chicken"],
  "biryani.jpg": curatedImages["veg biryani"],
  "dosa.jpg": curatedImages["masala dosa"],
  "coffee.jpg": curatedImages["cold coffee"],
  "lemon.jpg": curatedImages["lemon soda"],
  "gulabjamun.jpg": curatedImages["gulab jamun"],
};

export const getCategoryName = (item) =>
  (typeof item?.category === "object" ? item.category?.name : item?.category) || "Chef Specials";

export const getMenuImage = (item) => {
  const rawImageUrl = String(item?.imageUrl || "").trim();
  if (rawImageUrl) {
    if (ABSOLUTE_URL_PATTERN.test(rawImageUrl) || rawImageUrl.startsWith("/")) {
      return rawImageUrl;
    }

    const normalizedFileName = normalize(rawImageUrl.split("/").pop());
    if (FILE_EXTENSION_PATTERN.test(normalizedFileName) && imageFileMap[normalizedFileName]) {
      return imageFileMap[normalizedFileName];
    }
  }

  const category = normalize(getCategoryName(item));
  const name = normalize(item?.name);
  const encodedName = encodeURIComponent(`${String(item?.name || "").trim()},food`);

  return (
    curatedImages[name] ||
    curatedImages[category] ||
    `https://source.unsplash.com/1200x900/?${encodedName}` ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80"
  );
};
