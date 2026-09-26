/* store.js — shared catalogue + cart for Liquid Emotions
   Include this on every page BEFORE the page's own script.
   Cart lives in localStorage so it survives navigation between
   index.html, cart.html and checkout.html. */

const LE_CART_KEY = "le_cart_v1";

/* Each fragrance can optionally include an "image" field with a
   URL to a real bottle photo, e.g. "images/9pm-nightout.jpg" or a
   hosted URL. When set, every page (catalogue, cart, wishlist,
   checkout, and the product modal) automatically shows that photo
   instead of the illustrated vial / color swatch. Leave it out
   (or "") to keep the illustrated vial as-is.

   Two more optional fields:
   - "inspiredBy": a short "smells like" reference shown under the
     name, e.g. "YSL Y EDT". Only add this where you can personally
     verify it — comparative fragrance claims should be accurate.
   - "fragranticaUrl": a link to the fragrance's real Fragrantica
     page, shown as a small external link in the product modal.

   - "isNew": set to true to show a "New" badge on the card and
     include it when the New filter is active. You control this
     manually — flip it off whenever a fragrance isn't recent
     anymore. */
const FRAGRANCES = [
  {
    id: "9am-dive",
    name: "9AM Dive",
    house: "Afnan",
    inspiredBy: "Bleu de Chanel + YSL Y EDP",
    notes: { top: "Lemon, Mint, Black Currant, Pink Pepper", heart: "Apple, Incense, Cedar", base: "Ginger, Sandalwood, Patchouli, Jasmine" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.78611.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9am-Dive-78611.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "9pm",
    name: "9PM",
    house: "Afnan",
    inspiredBy: "JPG Ultra Male",
    notes: { top: "Apple, Cinnamon, Bergamot", heart: "Orange Blossom, Lily of the Valley", base: "Vanilla, Tonka Bean, Amber" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.65414.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9pm-65414.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "9pm-nightout",
    name: "9PM Nightout",
    house: "Afnan",
    notes: { top: "Dragon fruit, Lavender", heart: "Toffee, Suede", base: "Tonka bean, Akigalawood" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.123313.2x.avif",
    gender: "Unisex",
    season: ["Winter","Spring","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Night-Out-123313.html",
    prices: { "5ml": 225, "10ml": 390, "20ml": 740, "30ml": 1070 }
  },
{
    id: "9-pm-rebel",
    name: "9PM Rebel",
    inspiredBy: "Creed Aventus Absolu + MFK BR540",
    house: "Afnan",
    notes: { top: "Pineapple, Granny Smith Apple", heart: "Oakmoss, Cedarwood", base: "Drywood, Ambergris" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99238.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Rebel-99238.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "lynked-freedom",
    name: "Lynked Freedom",
    inspiredBy: "Azzaro Most Wanted Parfum + YSL Myself",
    house: "Afnan",
    notes: { top: "Bergamot, Grapefruit", heart: "Lavender, Cardamom", base: "Caramel, Oriental notes" },
    color: "#B2BEB5",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.119003.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Lynked-Freedom-119003.html",
    prices: { "5ml": 235, "10ml": 400, "20ml": 760, "30ml": 1100 }
  },
  {
    id: "rare-reef",
    name: "Rare Reef",
    inspiredBy: "LV Pacific Chill",
    house: "Afnan",
    notes: { top: "Orange, Mint", heart: "Apricot, Basil", base: "Fig" },
    color: "#5560C9",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106835.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Rare-Reef-106835.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "rare-carbon",
    name: "Rare Carbon",
    inspiredBy: "Tom Ford Ombre Leather",
    house: "Afnan",
    notes: { top: "Leather, Violet Leaf, Nutmeg", heart: "Violet, Agarwood, Rose", base: "Vetiver, Sandalwood, Amber" },
    color: "#5C4657",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.66627.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Rare-Carbon-66627.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "supremacy-not-only-intense",
    name: "Supremacy Not Only Intense",
    inspiredBy: "Creed Aventus",
    house: "Afnan",
    notes: { top: "Black Currant, Bergamot, Apple", heart: "Oakmoss, Patchouli", base: "Ambergris, Musk" },
    color: "#6B5D42",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.68271.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Not-Only-Intense-68271.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "supremacy-collectors-edition",
    name: "Supremacy Collector's Edition",
    inspiredBy: "Creed Aventus Absolu",
    house: "Afnan",
    notes: { top: "Pineapple, Bergamot, White Flower", heart: "Orange Blossom, Birch", base: "Oakmoss, Ambergris, Musk" },
    color: "#D2A23E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98689.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Collector-s-Edition-Pour-Homme-98689.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 810, "30ml": 1190 }
  },
  {
    id: "turathi-blue",
    name: "Turathi Blue",
    inspiredBy: "Bvlgari Tygar",
    house: "Afnan",
    notes: { top: "Citruses", heart: "Woodsy Notes, Amber", base: "Musk, Spices, Patchouli" },
    color: "#D2A23E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.70839.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Turathi-Blue-70839.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "bin-shaikh",
    name: "Bin Shaikh",
    house: "Ahmed Al Maghribi",
    notes: { top: "French Lavender, Saffron, Rose, Citruses, Oakmoss", heart: "Incense Bakhoor, Crystalline Sugar, Jasmine, Orchid, Violet", base: "Agarwood, Amber Resins, Patchouli, White Musk, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.66619.2x.avif",
    gender: "Unisex",
    season: ["Winter"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Bin-Shaikh-66619.html",
    prices: { "5ml": 340, "10ml": 620, "20ml": 1190, "30ml": 1750 }
  },
  {
    id: "kaaf",
    name: "Kaaf",
    inspiredBy: "PDM Percival",
    house: "Ahmed Al Maghribi",
    notes: { top: "Lavender, Watermelon", heart: "Lily of the Valley", base: "White Musk, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.102460.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Kaaf-102460.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "marj",
    name: "Marj",
    house: "Ahmed Al Maghribi",
    notes: { top: "Oud, Honey, Bergamot, Mandarin/Tangerine, Pink Pepper, Nutmeg, Elemi", heart: "Cashmere Wood, Saffron, Rose, Jasmine, Orange Blossom, Patchouli, Vetiver, Cinnamon, Aromatic Accords", base: "Agarwood, Leather, Amber, Ambergris, Musk, Sandalwood, Raspberry, Pear, Violet, Oakmoss, Ambrette Seeds, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.104339.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Marj-104339.html",
    prices: { "5ml": 360, "10ml": 660, "20ml": 1300, "30ml": 1880 }
  },
  {
    id: "evoke-gold",
    name: "Evoke Gold",
    inspiredBy: "Prada L'Homme",
    house: "Ajmal",
    notes: { top: "Neroli,Pepper", heart: "Orris Root, Amber,Geranium", base: "Cedar,Patchouli" },
    color: "#3E8FB0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.51252.2x.avif",
    gender: "Men",
    season: ["Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ajmal/Evoke-Gold-For-Him-51252.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },

  {
    id: "aqua-dubai",
    name: "Aqua Dubai",
    inspiredBy: "LV Imagination",
    house: "Al Haramain",
    notes: { top: "Bergamot, Green Notes, Mandarin Orange", heart: "Melon, Amber, Black Currant", base: "Petitgrain, Musk" },
    color: "#3E8FB0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96482.2x.avif",
    gender: "Unisex",
    season: ["Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/Amber-Oud-Aqua-Dubai-96482.html",
    prices: { "5ml": 310, "10ml": 560, "20ml": 1080, "30ml": 1580 }
  },
  {
    id: "l-aventure-knight",
    name: "L'Aventure Knight",
    inspiredBy: "Creed Green Irish Tweed",
    house: "Al Haramain",
    notes: { top: "Lemon Verbena, Bergamot, Tea", heart: "Violet Leaf, Iris", base: "Powdery Notes, Ambergris, Musk" },
    color: "#4A8067",
    image: "https://shop.alharamainperfumes.com/media/catalog/product/cache/490c4e3bbae272be3ce2b30a9945698e/1/9/1905p-image.jpg",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/L-Aventure-Knight-51824.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  {
    isNew: true,
    id: "bois-blanc",
    name: "Bois Blanc",
    inspiredBy: "Bois Impérial by Essential Parfums",
    house: "Arabiyat Prestige",
    notes: { top: "Grapefruit, Elemi, Pink Pepper", heart: "Lily of the valley, Amber, Violet", base: "Patchouli, Ambergris" },
    color: "#7C9473",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.137297.2x.avif?t=1783675275",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Bois-Blanc-137297.html",
    prices: { "5ml": 225, "10ml": 390, "20ml": 720, "30ml": 1050 }
  },
  {
    isNew: true,
    id: "revolt-uncaged",
    name: "Revolt Uncaged",
    inspiredBy: "Nishane Tero",
    house: "Arabiyat Prestige",
    notes: { top: "Caramel, Black Pepper, Sichuan Pepper, Salt", heart: "Patchouli, Cinnamon", base: "Amber, Vetiver" },
    color: "#A85C2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.134072.2x.avif",
    gender: "Unisex",
    season: ["Winter", "Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Revolt-Uncaged-134072.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    isNew: true,
    id: "revolt-uprising",
    name: "Revolt Uprising",
    inspiredBy: "Nishane Ani X",
    house: "Arabiyat Prestige",
    notes: { top: "Pink Pepper, Bergamot, Ginger", heart: "Black Currant, Green Apple", base: "Vanilla, Caramel" },
    color: "#C15C7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.134073.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Revolt-Uprising-134073.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "stronger-with-you-intensely",
    name: "Stronger With You Intensely",
    house: "Emporio Armani",
    notes: { top: "Pink Pepper, Juniper", heart: "Toffee, Cinnamon", base: "Vanilla, Amber" },
    color: "#9C6B3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.52802.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-Intensely-52802.html",
    prices: { "3ml": 265, "5ml": 400, "10ml": 740, "20ml": 1440, "30ml": 2120 }
  },
  {
    id: "eros-flame",
    name: "Eros Flame",
    house: "Versace",
    notes: { top: "Mandarin Orange, Madagascar Pepper, Lemon, Chinotto", heart: "Geranium, Rose", base: "Vanilla, Tonka Bean, Sandalwood, Texas Cedar" },
    color: "#C1542E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.52180.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Versace/Eros-Flame-52180.html",
    prices: { "3ml": 200, "5ml": 260, "10ml": 460, "20ml": 880, "30ml": 1280 }
  },
  {
    id: "polo-67-edp",
    name: "Polo 67 EDP",
    house: "Ralph Lauren",
    notes: { top: "Green Mandarin, Cardamom, Bergamot", heart: "Pineapple, Lavender", base: "Benzoin, Cedarwood" },
    color: "#6B8250",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.108720.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ralph-Lauren/Polo-67-Eau-de-Parfum-108720.html",
    prices: { "3ml": 180, "5ml": 250, "10ml": 440, "20ml": 840, "30ml": 1220 }
  },
  {
    id: "bleu-noir",
    name: "Bleu Noir Parfum",
    house: "Narciso Rodriguez",
    notes: { top: "Cardamom, Cypress, Bergamot", heart: "Iris, Musk", base: "Tonka Bean, Sandalwood" },
    color: "#2C3E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.71783.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Him-Bleu-Noir-Parfum-71783.html",
    prices: { "3ml": 265, "5ml": 400, "10ml": 740, "20ml": 1440, "30ml": 2120 }
  },
  {
    id: "aoud-lemon-mint",
    name: "Aoud Lemon Mint",
    house: "Mancera",
    notes: { top: "Lemon, Almond, Black Pepper", heart: "Agarwood, Patchouli, Mint", base: "Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.39181.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Mancera/Aoud-Lemon-Mint-39181.html",
    prices: { "3ml": 265, "5ml": 390, "10ml": 720, "20ml": 1300, "30ml": 2060 }
  },
  {
    id: "intense-red-tobacco",
    name: "Intense Red Tobacco",
    house: "Mancera",
    notes: { top: "Agarwood (Oud), Cinnamon, Incense, Saffron, Pear, Nutmeg", heart: "Tobacco, Leather, Patchouli, Vetiver, Jasmine", base: "Vanilla, Musk, Sandalwood, Guaiac Wood, Ambergris" },
    color: "#6B2A24",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.84246.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Mancera/Red-Tobacco-Intense-84246.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "arabians-tonka",
    name: "Arabians Tonka",
    house: "Montale",
    notes: { top: "Saffron, Bergamot", heart: "Agarwood (Oud), Bulgarian Rose", base: "Tonka Bean, Sugar Cane, Amber, White Musk, Oakmoss" },
    color: "#8A5A32",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.57384.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Montale/Arabians-Tonka-57384.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "al-noor",
    name: "Al Noor",
    inspiredBy: "BDK Gris Charnel",
    house: "Arabiyat Prestige",
    notes: { top: "Cardamom, Nutmeg, Saffron", heart: "Fig, Iris", base: "Leather, Tonka Bean" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115515.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Al-Noor-115515.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  {
    id: "marwa",
    name: "Marwa",
    inspiredBy: "LV Imagination",
    house: "Arabiyat Prestige",
    notes: { top: "Calabrian Bergamot, Lemon", heart: "Nigerian Ginger, Ceylon Cinnamon", base: "Chinese Black Tea" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107084.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Marwa-107084.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "mahd-al-dahab",
    name: "Mahd Al Dahab",
    inspiredBy: "Borntostandout Drunk Lovers",
    house: "Arabiyat Prestige",
    notes: { top: "Bergamot, Spices, Lemon", heart: "Amber, Patchouli, Oud", base: "Vanilla, Sandalwood, White Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107083.2x.avif",
    gender: "Unisex",
    season: ["Winter","Spring","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Mahd-Al-Dhahab-107083.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "hamdan-the-sheikh",
    name: "Hamdan The Sheikh",
    inspiredBy: "Dior Sauvage EDP",
    house: "Arabiyat Prestige",
    notes: { top: "Bergamot, Mandarin, Elemi", heart: "Sandalwood, Amber", base: "Olibanum, Tonka Bean, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.103400.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Hamdan-The-Sheikh-103400.html",
    prices: { "5ml": 250, "10ml": 440, "20ml": 830, "30ml": 1200 }
  },
  
  {
    id: "dunescape",
    name: "Dunescape",
    inspiredBy: "YSL Y EDP",
    house: "Armaf",
    notes: { top: "Blood Orange, Bergamot, Mandarin", heart: "Apple, Ozonic Notes, Geranium", base: "Musk, Sandalwood, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.130942.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Dunescape-130942.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  
  {
    id: "precieux-I",
    name: "Precieux I",
    inspiredBy: "Creed Aventus Absolu",
    house: "Armaf",
    notes: { top: "Pineapple, Bergamot, Lemon", heart: "Oakmoss, White Wood", base: "Ambroxan, White Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.93272.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Precieux-I-93272.html",
    prices: { "5ml": 470, "10ml": 860, "20ml": 1680, "30ml": 2500 }
  },
  {
    isNew: true,
    id: "infinity",
    name: "Infinity",
    inspiredBy: "YSL L'Homme Ultime",
    house: "Armaf",
    notes: { top: "Bergamot, Ginger", heart: "Rose, Apple", base: "Cedar, Vetiver" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98715.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Black-98715.html",
    prices: { "5ml": 230, "10ml": 410, "20ml": 780, "30ml": 1150 }
  },
  {
    id: "platine-blanc",
    name: "Platine Blanc",
    inspiredBy: "Xerjoff Torino 21",
    house: "Aromatix",
    notes: { top: "Mint, Lemon", heart: "Rosemary, Blackcurrant", base: "Musk, Ambergris" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106068.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Aromatix-X-French-Avenue/Platine-Blanc-106068.html",
    prices: { "5ml": 250, "10ml": 450, "20ml": 850, "30ml": 1280 }
  },
  
  
  {
    id: "vulcan-feu",
    name: "Vulcan Feu",
    inspiredBy: "SHL God of Fire",
    house: "French Avenue",
    notes: { top: "Mango, Lemon, Ginger", heart: "Pink Pepper, Jasmine", base: "Tonka Bean, Cedarwood" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.105520.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Vulcan-Feu-105520.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  
  
  {
    id: "le-male-elixir",
    name: "Le Male Elixir",
    house: "Jean Paul Gaultier",
    notes: { top: "Lavender, Mint", heart: "Vanilla, Benzoin", base: "Honey, Tonka Bean, Tobacco" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.81642.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-81642.html",
    prices: { "3ml": 265, "5ml": 390, "10ml": 720, "20ml": 1400, "30ml": 2060 }
  },
  
  {
    id: "asad-elixir",
    name: "Asad Elixir",
    inspiredBy: "Boss Bottled Absolu",
    house: "Lattafa",
    notes: { top: "Pink Pepper, Saffron", heart: "Tobacco, Vanilla", base: "Light Amber, Frankincense" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117616.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Asad-Elixir-117616.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "jean-lowe-immortel",
    name: "Jean Lowe Immortel",
    inspiredBy: "LV L'Immensite",
    house: "Maison Al Hambra",
    notes: { top: "Ginger, Grapefruit, Bergamot", heart: "Rosemary, Water Notes", base: "Ambroxan, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.83666.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Maison-Alhambra/Jean-Lowe-Immortal-83666.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 730 }
  },
  {
    isNew: true,
    id: "toscano-leather",
    name: "Toscano Leather",
    inspiredBy: "Tom Ford Tuscan Leather",
    house: "Maison Al Hambra",
    notes: { top: "Animal Notes, Saffron", heart: "Leather, Raspberry", base: "Leather, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.79942.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Maison-Alhambra/Toscano-Leather-79942.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 500, "30ml": 710 }
  },
  {
    id: "luna-rossa-carbon",
    name: "Luna Rossa Carbon EDT",
    house: "Prada",
    notes: { top: "Bergamot, Pepper", heart: "Lavender, Metallic Notes", base: "Ambroxan, Patchouli" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.43402.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Prada/Luna-Rossa-Carbon-Eau-de-Toilette-43402.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "hawas",
    name: "Hawas for him",
    inspiredBy: "Paco Rabanne Invictus",
    house: "Rasasi",
    notes: { top: "Apple, Bergamot, Lemon", heart: "Watery Notes, Plum", base: "Ambergris, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.46890.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-for-Him-46890.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "hawas-elixir",
    name: "Hawas Elixir",
    inspiredBy: "JPG Le Male Elixir",
    house: "Rasasi",
    notes: { top: "Mint, Bergamot", heart: "Dark Chocolate, Lavender", base: "Vanilla, Tonka Bean, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.110808.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Elixir-110808.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "lion",
    name: "Lion",
    inspiredBy: "JPG Le Male",
    house: "Rayhaan",
    notes: { top: "Lavender, Pear, Mint", heart: "Cinnamon, Clary Sage", base: "Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.105031.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Lion-105031.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 710 }
  },
  {
    id: "obsidian",
    name: "Obsidian",
    inspiredBy: "Dior Homme Parfum",
    house: "Rayhaan",
    notes: { top: "Iris, Citrus", heart: "Leather", base: "Sandalwood, Ambrette" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.121721.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Obsidian-121721.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 710 }
  },
  
  {
    id: "spicebomb-extreme",
    name: "Spicebomb Extreme",
    house: "Viktor & Rolf",
    notes: { top: "Grapefruit, Pimento, Black Pepper", heart: "Cinnamon, Saffron, Cumin", base: "Tobacco, Bourbon Whiskey, Black Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.30499.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Viktor-Rolf/Spicebomb-Extreme-30499.html",
    prices: { "3ml": 275, "5ml": 410, "10ml": 760, "20ml": 1480, "30ml": 2180 }
  },
  {
    isNew: true,
    id: "acqua-di-gio",
    name: "Acqua Di Gio Parfum",
    house: "Giorgio Armani",
    notes: { top: "Marine Notes, Bergamot", heart: "Rosemary, Clary Sage", base: "Olibanum, Patchouli" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.81508.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-Parfum-81508.html",
    prices: { "3ml": 285, "5ml": 440, "10ml": 810, "20ml": 1580, "30ml": 2330 }
  }  ,
  {
    isNew: true,
    id: "kaaf-noir",
    name: "Kaaf Noir",
    house: "Ahmed Al Maghribi",
    notes: { top: "Blood Orange, Sicilian Lemon, Juniper Berries, Cardamom", heart: "Lavender, Clary Sage, Geranium, Iso E Super, Hedione", base: "Ambroxan, Cedarwood, Patchouli, Vetiver, White Musk" },
    color: "#1C1C2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.130637.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Kaaf-Noir-130637.html",
    prices: { "5ml": 205, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    isNew: true,
    id: "kohl-opulence",
    name: "Kohl Opulence",
    inspiredBy: "Ex Nihilo Blue Talisman",
    house: "Arabiyat Prestige",
    notes: { top: "Pear, Bergamot, Ginger", heart: "Orange Blossom, Jasmine, Woody Notes", base: "Musk, Vanilla, Amber" },
    color: "#C9A66B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115528.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Kohl-Opulence-115528.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    isNew: true,
    id: "ramad-oriental",
    name: "Ramad Oriental",
    inspiredBy: "Amouage Outlands",
    house: "Arabiyat Prestige",
    notes: { top: "Cardamom, Elemi, Pepper, Lemon, Bergamot", heart: "Patchouli, Saffron, Cumin, Geranium, Jasmine", base: "Olibanum, Opoponax, Vanilla, Benzoin, Amber" },
    color: "#6E5A3C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115548.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Ramad-Oriental-115548.html",
    prices: { "5ml": 180, "10ml": 300, "20ml": 560, "30ml": 800 }
  },
  {
    id: "al-dirgham-limited-edition",
    name: "Al Dirgham Limited Edition",
    inspiredBy: "Chanel Allure Homme Sport Eau Extreme",
    house: "Ard Al Zafran",
    notes: { top: "Tangerine, Lemongrass, Geranium", heart: "Tuberose, Lily of the Valley, Jasmine, Rose, Cinnamon, Cloves", base: "Musk, Floral Notes, Tonka Bean, Vanilla" },
    color: "#8FA6A3",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.87214.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ard-Al-Zaafaran/Al-Dirgham-87214.html",
    prices: { "5ml": 130, "10ml": 200, "20ml": 360, "30ml": 500 }
  },
  {
    id: "club-de-nuit-intense-man-pp",
    name: "Club de Nuit Intense Man PP",
    inspiredBy: "Creed Aventus",
    house: "Armaf",
    notes: { top: "Lemon, Pineapple, Bergamot, Black Currant, Apple", heart: "Birch, Jasmine, Rose", base: "Ambergris, Musk, Patchouli, Vanilla" },
    color: "#2E2E2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.72842.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-Man-Parfum-72842.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    isNew: true,
    id: "club-de-nuit-intense-overdose",
    name: "Club de Nuit Intense Overdose",
    house: "Armaf",
    inspiredBy: "Creed Aventus Absolu",
    notes: { top: "Bergamot, Tangerine, Pineapple, Blue Crystal Accord", heart: "Oakmoss, Vanilla Flower, Plum", base: "Patchouli, White Powder, Amber, Tonka Bean" },
    color: "#1F2A44",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.136770.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-De-Nuit-Intense-Overdose-136770.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 820, "30ml": 1190 }
  },
  {
    isNew: true,
    id: "odyssey-mandarin-sky-elixir",
    name: "Odyssey Mandarin Sky Elixir",
    inspiredBy: "YSL Scandal Le Parfum",
    house: "Armaf",
    notes: { top: "Mandarin, Orange, Lavender, Cardamom, Black Pepper", heart: "Caramel, Tonka Bean, Patchouli, Incense", base: "Vanilla, Vetiver" },
    color: "#B5651D",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106709.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Odyssey-Mandarin-Sky-Elixir-106709.html",
    prices: { "5ml": 170, "10ml": 270, "20ml": 500, "30ml": 710 }
  },
  {
    isNew: true,
    id: "spartacus",
    name: "Spartacus",
    house: "Armaf",
    inspiredBy: "JPG Le Male Elixir",
    notes: { top: "Orange Blossom, Cinnamon, Cardamom, Plum, Bergamot", heart: "Bourbon Vanilla, Candied Almond, Lavender, Davana, Elemi", base: "Praline, Musk, Tonka Bean, Amber, Labdanum, Patchouli, Guaiac Wood, Benzoin" },
    color: "#7A5C3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.129502.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Spartacus-129502.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 820 }
  },
  {
    isNew: true,
    id: "sunkissed",
    name: "Sunkissed",
    house: "Aromatix",
    notes: { top: "Bitter Orange, Pomelo, Bergamot", heart: "Tea, Aperol, Cream Soda, Cardamom", base: "Cedarwood, Vetiver, Ambertonic, Vanilla, Cashmeran" },
    color: "#E08E45",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117530.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Aromatix-X-French-Avenue/Sun-Kissed-117530.html",
    prices: { "5ml": 250, "10ml": 450, "20ml": 850, "30ml": 1280 }
  },
  {
    isNew: true,
    id: "atlantis",
    name: "Atlantis",
    house: "French Avenue",
    notes: { top: "Orange, Mandarin, Lemon", heart: "Watermelon, Coconut", base: "Ambergris, Cacao, Amberwood" },
    color: "#2E6E7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.113595.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Atlantis-Extrait-113595.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1140 }
  },
  {
    id: "liquid-brun",
    name: "Liquid Brun",
    house: "French Avenue",
    inspiredBy: "Parfums de Marly Althaïr",
    notes: { top: "Cinnamon, Orange Blossom, Cardamom, Bergamot", heart: "Bourbon Vanilla, Elemi", base: "Praline, Ambroxan, Musk, Guaiac Wood" },
    color: "#5A3A2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.94713.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-94713.html",
    prices: { "5ml": 205, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    id: "liquid-brun-limited-edition",
    name: "Liquid Brun Limited Edition",
    house: "French Avenue",
    inspiredBy: "Parfums de Marly Althaïr",
    notes: { top: "Cardamom, Lavender, Citrus", heart: "Orange Blossom, Guaiac Wood, Rose", base: "Vanilla, Tonka, Amber, Oak Moss" },
    color: "#4A3020",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.123526.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-Limited-Edition-123526.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    id: "spectre-ghost",
    name: "Spectre Ghost",
    house: "French Avenue",
    notes: { top: "Ginger, Cardamom, Bergamot", heart: "Pink Pepper, Blackcurrant, Rose", base: "Vanilla, Cedarwood, Patchouli" },
    color: "#3A3F4A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.94697.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Spectre-Ghost-94697.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 810, "30ml": 1190 }
  },
  {
    isNew: true,
    id: "zenith-blue",
    name: "Zenith Blue",
    inspiredBy: "Dior Sauvage",
    house: "French Avenue",
    notes: { top: "Bergamot, Elemi", heart: "Pepper, Lavender, Geranium", base: "Ambroxan, Vetiver, Patchouli" },
    color: "#2A4B7C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106865.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Zenith-Blue-106865.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "black-diamond-incense",
    name: "Black Diamond Incense",
    house: "IBRAQ",
    notes: { top: "Black Currant, Aquatic Notes, Birch", heart: "Incense, Vanilla, Sandalwood", base: "Leather, Oud, Smoke, Amber" },
    color: "#22252B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100548.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/Black-Diamond-Incense-100548.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "french-tobacco",
    name: "French Tobacco",
    inspiredBy: "Louis Vuitton Imagination",
    house: "IBRAQ",
    notes: { top: "Mandarin, Blood Orange, Green Apple", heart: "Ginger, Neroli, Cinnamon, Tobacco", base: "Lemongrass, Frankincense, Guaiac Wood, Iris" },
    color: "#8A7048",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100552.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/French-Tobacco-100552.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "ibraq-sandalwood",
    name: "Sandalwood",
    house: "IBRAQ",
    inspiredBy: "Van Cleef & Arpels Moonlight Patchouli",
    notes: { top: "Damask Rose, Raspberry", heart: "Powder, Cedarwood", base: "Amber, Sandalwood" },
    color: "#7A5C44",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100577.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/Sandalwood-100577.html",
    prices: { "5ml": 230, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    isNew: true,
    id: "island-dreams",
    name: "Island Dreams",
    house: "Khadlaj",
    notes: { top: "Bergamot, Ginger", heart: "Grapefruit", base: "Musk, Ambroxan" },
    color: "#3FA0A8",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.113593.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Khadlaj-Perfumes/Island-Dreams-113593.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    isNew: true,
    id: "shiyaaka-sky",
    name: "Shiyaaka Sky",
    house: "Khadlaj",
    notes: { top: "Bergamot, Verbena, Mandarin", heart: "Green Accord, Neroli, Orange Blossom, Geranium", base: "Musk, Ambroxan, Vetiver, Sandalwood" },
    color: "#8FB8C9",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.137096.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Khadlaj-Perfumes/Shiyaaka-Sky-137096.html",
    prices: { "5ml": 205, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    isNew: true,
    id: "fahad",
    name: "Fahad",
    house: "Lattafa",
    notes: { top: "Mandarin, Pineapple, Black Pepper", heart: "Orange Blossom, Lavender, Artemisia", base: "Incense, Patchouli, Cedarwood, Ambroxan" },
    color: "#25282C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.136650.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Fahad-136650.html",
    prices: { "5ml": 240, "10ml": 420, "20ml": 800, "30ml": 1150 }
  },
  {
    isNew: true,
    id: "teriaq-intense",
    name: "Teriaq Intense",
    house: "Lattafa",
    notes: { top: "Saffron, Bergamot", heart: "Plum Liquor, Cinnamon", base: "Amber, Tonka Bean, Benzoin" },
    color: "#5C2A2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99586.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Teriaq-Intense-99586.html",
    prices: { "5ml": 215, "10ml": 370, "20ml": 700, "30ml": 1010 }
  },
  {
    id: "mawj-appletini",
    name: "Mawj Appletini",
    house: "Paris Corner",
    notes: { top: "Cardamom, Bergamot", heart: "Apple, Brandy, Vanilla, Rum, Pineapple, Moss", base: "Cedar, Ambroxan" },
    color: "#7BA05B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98582.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Mawj-Appletini-98582.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "mawj-moscow-mule",
    name: "Mawj Moscow Mule",
    house: "Paris Corner",
    notes: { top: "Ginger, Lemon, Bergamot", heart: "Mint, Cypress", base: "Moss" },
    color: "#A9C23F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98580.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Mawj-Moscow-Mule-98580.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "rifaaqat",
    name: "Rifaaqat",
    house: "Paris Corner",
    notes: { top: "Black Pepper, Elemi, Pink Pepper", heart: "Olibanum, Saffron", base: "Vanilla, Cedarwood" },
    color: "#9C6B3F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99060.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Rifaaqat-99060.html",
    prices: { "5ml": 165, "10ml": 270, "20ml": 500, "30ml": 710 }
  },
  {
    id: "fattan",
    name: "Fattan",
    house: "Rasasi",
    notes: { top: "Grapefruit, Bergamot, Pink Pepper", heart: "Vetiver, Cedar, Patchouli, Lily-of-the-Valley", base: "Oakmoss, Benzoin, Amber" },
    color: "#556B5E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.53484.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Fattan-53484.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "hawas-fire",
    name: "Hawas Fire",
    house: "Rasasi",
    inspiredBy: "Gissah Imperial Valley",
    notes: { top: "Clary Sage", heart: "Egyptian Jasmine, Marine Notes", base: "Ambergris, Amber, Mineral Notes" },
    color: "#B23A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.101665.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Fire-101665.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "hawas-ice",
    name: "Hawas Ice",
    house: "Rasasi",
    notes: { top: "Apple, Italian Lemon, Sicilian Bergamot, Star Anise", heart: "Plum, Orange Blossom, Cardamom", base: "Musk, Amber, Driftwood, Moss" },
    color: "#5DA3C7",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.89050.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Ice-89050.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "hawas-kobra",
    name: "Hawas Kobra",
    house: "Rasasi",
    inspiredBy: "Louis Vuitton Imagination",
    notes: { top: "Ginger, Bergamot, Tangerine", heart: "Cinnamon, Neroli, Green Tea", base: "Musk, Woodsy Notes, Amber" },
    color: "#3E4A3A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.112706.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Kobra-112706.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "hawas-malibu",
    name: "Hawas Malibu",
    house: "Rasasi",
    notes: { top: "Pineapple, Orange, Grapefruit", heart: "Orris, Amber, Lavender", base: "Tonka Bean, Musk, Patchouli, Cashmeran" },
    color: "#E0A85B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.112707.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Malibu-112707.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    isNew: true,
    id: "aquatica",
    name: "Aquatica",
    inspiredBy: "Creed Virgin Island Water",
    house: "Rayhaan",
    notes: { top: "Lime, Coconut Milk, Bergamot, Mandarin", heart: "Sugar Cane, Jasmine, Hibiscus, Gardenia", base: "Musk, Rum, Tonka Bean, Patchouli" },
    color: "#2FA6A0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.120605.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Aquatica-120605.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 750 }
  },
  {
    isNew: true,
    id: "nocturno-elixir",
    name: "Nocturno Elixir",
    inspiredBy: "Bleu de Chanel L'Exclusif",
    house: "Rayhaan",
    notes: { top: "Lemon Zest, Bergamot, Mint, Artemisia", heart: "Lavender, Geranium, Pineapple", base: "Sandalwood" },
    color: "#1D3A5F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.132522.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Nocturno-Elixir-132522.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "fareed",
    name: "Fareed",
    house: "Riffs",
    notes: { top: "Cardamom, Pepper", heart: "Lavender, Bergamot, Geranium", base: "Tonka, Cedarwood, Vetiver" },
    color: "#6E7F52",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.127888.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Riiffs-Perfumes/Fareed-127888.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 710 }
  },
  {
    isNew: true,
    id: "freeze",
    name: "Freeze",
    house: "Riffs",
    notes: { top: "Spearmint, Lemon Zest, Calabrian Bergamot, Grapefruit, Snow", heart: "Ice, Ginger, Tea, Sage", base: "Ambermax, Peony, Cedar" },
    color: "#A9D6E5",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.118093.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Riiffs-Perfumes/Freeze-118093.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 820 }
  },
  {
    id: "reef-33",
    name: "33",
    inspiredBy: "Gissah Imperial Valley",
    house: "Reef",
    notes: { top: "Indian Saffron", heart: "Rosemary", base: "Agarwood (Oud)" },
    color: "#7C1F1F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.89358.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Reef-Perfumes/Reef-33-89358.html",
    prices: { "5ml": 210, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    isNew: true,
    id: "incense-01",
    name: "Incense 01",
    house: "Swiss Arabian",
    notes: { top: "Frankincense, Rum, Juniper, Bergamot", heart: "Fig, Hazelnut, Roasted Nuts, Almond, Lily of the Valley", base: "Frankincense, Vanilla, Sandalwood, Dark Chocolate, Cedarwood, Moss" },
    color: "#4A342A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.102415.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Swiss-Arabian/Incense-01-102415.html",
    prices: { "5ml": 480, "10ml": 900, "20ml": 1760, "30ml": 2600 }
  },
  {
    isNew: true,
    id: "soul-of-bali",
    name: "Soul of Bali",
    house: "Swiss Arabian",
    notes: { top: "Rhubarb, Bergamot, Ginger, Mango, Pink Pepper, Pineapple", heart: "Aquatic Notes, Saffron, Cardamom, Rosewood, Olibanum, Nutmeg", base: "Sandalwood, Ambergris, Musk, Cypriol" },
    color: "#2E8B7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107070.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Swiss-Arabian/Soul-of-Bali-107070.html",
    prices: { "5ml": 310, "10ml": 560, "20ml": 1080, "30ml": 1580 }
  },
  {
    id: "inekas-luna",
    name: "Inekas Luna",
    house: "Zimaya",
    notes: { top: "Bergamot, Orange", heart: "Iris, Chestnut, Orange Blossom", base: "Leather, Amber" },
    color: "#5B4A6E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96984.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Zimaya/INEKAS-LUNA-96984.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    isNew: true,
    id: "mazaaj-rhythm",
    name: "Mazaaj Rhythm",
    inspiredBy: "Louis Vuitton Symphonie",
    house: "Zimaya",
    notes: { top: "Grapefruit, Bergamot", heart: "Ginger, Green Apple", base: "Musk, Amber" },
    color: "#8CB369",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117355.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Zimaya/Mazaaj-Rhythm-117355.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    id: "bleu-de-chanel-edt",
    name: "Bleu De Chanel EDT",
    house: "Chanel",
    notes: { top: "Grapefruit, Lemon, Mint, Pink Pepper", heart: "Ginger, Nutmeg, Jasmine", base: "Incense, Vetiver, Cedar, Sandalwood, White Musk, Amber" },
    color: "#1B2A4A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.9099.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-9099.html",
    prices: { "3ml": 390, "5ml": 610, "10ml": 1170, "20ml": 2280, "30ml": 3410 }
  },
  {
    id: "the-one-parfum",
    name: "The One Parfum",
    house: "D&G",
    notes: { top: "Basil, Coriander, Grapefruit", heart: "Ginger, Tobacco Blossom, Cardamom", base: "Amber, Tobacco, Musk, Cedar" },
    color: "#4A3B2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.31909.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Dolce-Gabbana/The-One-for-Men-Eau-de-Parfum-31909.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "gentleman-reserve-privee",
    name: "Gentleman Reserve Privee",
    house: "Givenchy",
    notes: { top: "Whisky Absolute, Bergamot", heart: "Iris, Chestnut, Benzoin", base: "Cedarwood, Vetiver" },
    color: "#6B4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.71272.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Givenchy/Gentleman-Eau-de-Parfum-Reserve-Privee-71272.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "habit-rouge-edp",
    name: "Habit Rouge EDP",
    house: "Guerlain",
    notes: { top: "Bergamot, Lemon, Basil", heart: "Rose, Jasmine, Sandalwood, Patchouli", base: "Amber, Vanilla, Leather, Labdanum" },
    color: "#7C1B23",
    image: "images/habit-rouge-edp.jpg",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Habit-Rouge-Eau-de-Parfum-25313.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "lhomme-ideal-edp",
    name: "L'Homme Ideal EDP",
    house: "Guerlain",
    notes: { top: "Bitter Almond, Lemon", heart: "Sambac Jasmine", base: "Tonka Bean, Vetiver" },
    color: "#6E5A3C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.37735.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/L-Homme-Ideal-Eau-de-Parfum-37735.html",
    prices: { "3ml": 290, "5ml": 440, "10ml": 820, "20ml": 1600, "30ml": 2440 }
  },
  {
    id: "vetiver-parfum",
    name: "Vetiver Parfum",
    house: "Guerlain",
    notes: { top: "Bergamot, Lemon, Neroli", heart: "Vetiver, Nutmeg, Tobacco", base: "Leather, Tonka Bean" },
    color: "#3E4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.90801.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Vetiver-Parfum-90801.html",
    prices: { "3ml": 330, "5ml": 510, "10ml": 960, "20ml": 1880, "30ml": 2780 }
  },
  {
    id: "santal-royal",
    name: "Santal Royal",
    house: "Guerlain",
    notes: { top: "Rose", heart: "Sandalwood, Oud, Jasmine", base: "Leather" },
    color: "#4A3A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96470.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Santal-Royal-96470.html",
    prices: { "3ml": 325, "5ml": 500, "10ml": 940, "20ml": 1840, "30ml": 2720 }
  },
  {
    id: "hugo-man-edt",
    name: "Hugo Man EDT",
    house: "Hugo",
    notes: { top: "Green Apple, Green Leaves", heart: "Geranium Leaf, Clary Sage", base: "Cedar, Oakmoss, Tobacco" },
    color: "#3E5A3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.570.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Hugo-Boss/Hugo-570.html",
    prices: { "3ml": 135, "5ml": 180, "10ml": 295, "20ml": 530, "30ml": 770 }
  },
  {
    id: "uomo-born-in-roma-intense",
    name: "Uomo Born In Roma Intense",
    house: "Valentino",
    notes: { top: "Vanilla", heart: "Lavender", base: "Vetiver" },
    color: "#2E2A3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.78740.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-Born-In-Roma-Intense-78740.html",
    prices: { "3ml": 275, "5ml": 410, "10ml": 760, "20ml": 1480, "30ml": 2180 }
  },
  {
    id: "libre-edp",
    name: "Libre EDP",
    house: "YSL",
    notes: { top: "Mandarin Zest, Black Currant, Lavender", heart: "Lavender, Orange Blossom, Jasmine Sambac", base: "Musk, Cedarwood, Vanilla, Ambergris" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.56077.2x.avif",
    gender: "Women",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Libre-56077.html",
    prices: { "3ml": 375, "5ml": 575, "10ml": 1090, "20ml": 2140, "30ml": 3170 }
  },
  {
    id: "aventus",
    name: "Aventus",
    house: "Creed",
    notes: { top: "Lemon, Pink Pepper, Apple, Italian bergamot,Blackcurrant", heart: "Pineapple, Patchouli, Moroccan Jasmine, Birch, Juniper Berries", base: "Oakmoss, Vanilla, Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.9828.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Creed/Aventus-9828.html",
    prices: { "3ml": 810, "5ml": 1310, "10ml": 2560, "20ml": 5080, "30ml": 7580 }
  },
  {
    id: "tam-dao",
    name: "Tam Dao",
    house: "Dyptique",
    notes: { top: "Italian Cypress,Myrtyle,Rose", heart: "Sandalwood,Cedar", base: "Brazillian Rosewood,Spices,Amber,White Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.3956.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Diptyque/Tam-Dao-Eau-de-Toilette-3956.html",
    prices: { "3ml": 780, "5ml": 1260, "10ml": 2460, "20ml": 4880, "30ml": 7280 }
  },
  {
    id: "ani",
    name: "Ani",
    house: "Nishane",
    notes: { top: "Ginger,Bergamot,Pink Pepper,Green Notes", heart: "Cardamom,Blackcurrant,Turkish Rose", base: "Vanilla,Benzoin,Sandalwood,Cedar,Patchouli, Ambergris,Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.54785.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Nishane/Ani-54785.html",
    prices: { "3ml": 510, "5ml": 810, "10ml": 1560, "20ml": 3080, "30ml": 4580 }
  },
  {
    id: "vibrato",
    name: "Vibrato",
    house: "Sospiro",
    notes: { top: "Grapefruit,Bergamot,Jasmine,Magnolia", heart: "Ginger,Herbal Notes,Powdery Notes", base: "Musk, Cedar, Amber,Patchouli,Orris Root" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.75930.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Sospiro-Perfumes/Vibrato-75930.html",
    prices: { "3ml": 600, "5ml": 980, "10ml": 1800, "20ml": 3480, "30ml": 5180 }
  },
  {
    id: "laverne-fearless",
    name: "Fearless",
    house: "Laverne",
    notes: { top: "Mandarin, Bergamot", heart: "Jasmine, Sandalwood", base: "Amber, Musk" },
    color: "#B8895E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.114181.jpg",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Laverne/Fearless-114181.html",
    prices: { "5ml": 175, "10ml": 285, "20ml": 530, "30ml": 755 }
  },
  {
    id: "rayhaan-cedrus-blanc",
    name: "Cedrus Blanc",
    house: "Rayhaan",
    notes: { top: "Aldehydes, Bergamot", heart: "Orange Blossom, Orange", base: "White Musk, Vanilla, Cedarwood" },
    color: "#D8CFC2",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.138575.jpg",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Cedrus-Blanc-138575.html",
    prices: { "5ml": 180, "10ml": 300, "20ml": 560, "30ml": 800 }
  },
  {
    id: "amouage-purpose-50",
    name: "Purpose 50",
    house: "Amouage",
    notes: { top: "Frankincense, Bergamot, Pink Pepper, Pimento Berry", heart: "Rose, Sand Vetiver, Sandalwood, Papyrus", base: "Saffron, Suede, Mystikal, Akigalawood, Vanilla" },
    color: "#6B4A2E",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    prices: { "3ml": 1450, "5ml": 2350, "10ml": 4560, "20ml": 9080, "30ml": 13580 }
  }



];

function leFragranceById(id){
  return FRAGRANCES.find(f => f.id === id);
}

/* ============================================================
   Brand category — groups each house into a broader family so
   the catalogue can be browsed by Middle Eastern / Designer /
   Niche in addition to individual brand tabs. Add new houses
   here as they're added to FRAGRANCES; a house left unmapped
   just won't appear under any category (still shows under "All").
   ============================================================ */
const HOUSE_CATEGORY = {
  "Afnan": "Middle Eastern",
  "Ahmed Al Maghribi": "Middle Eastern",
  "Al Haramain": "Middle Eastern",
  "Arabiyat Prestige": "Middle Eastern",
  "Armaf": "Middle Eastern",
  "Aromatix": "Middle Eastern",
  "Khadlaj": "Middle Eastern",
  "French Avenue": "Middle Eastern",
  "Lattafa": "Middle Eastern",
  "Maison Al Hambra": "Middle Eastern",
  "Nusuk": "Middle Eastern",
  "Rasasi": "Middle Eastern",
  "Rayhaan": "Middle Eastern",
  "Laverne": "Middle Eastern",
  "Scentedelic": "Indian House",
  "Zimaya": "Middle Eastern",
  "Ajmal": "Middle Eastern",
  "Ard Al Zafran": "Middle Eastern",
  "IBRAQ": "Middle Eastern",
  "Paris Corner": "Middle Eastern",
  "Reef": "Middle Eastern",
  "Riffs": "Middle Eastern",
  "Swiss Arabian": "Middle Eastern",

  "Giorgio Armani": "Designer",
  "Emporio Armani": "Designer",
  "Versace": "Designer",
  "Ralph Lauren": "Designer",
  "Narciso Rodriguez": "Designer",
  "Azzaro": "Designer",
  "Issey Miyake": "Designer",
  "Jean Paul Gaultier": "Designer",
  "Mancera": "Designer",
  "Prada": "Designer",
  "Viktor & Rolf": "Designer",
  "YSL": "Designer",
  "Chanel": "Designer",
  "D&G": "Designer",
  "Givenchy": "Designer",
  "Guerlain": "Designer",
  "Hugo": "Designer",
  "Montale": "Designer",
  "Valentino": "Designer",


  "Creed": "Niche",
  "Dyptique": "Niche",
  "Nishane": "Niche",
  "Sospiro": "Niche",
  "Amouage": "Niche",
};

function leHouseCategory(house){
  return HOUSE_CATEGORY[house];
}

/* ============================================================
   Config
   ============================================================ */
const LE_WISHLIST_KEY = "le_wishlist_v1";
const LE_RECENT_KEY   = "le_recent_v1";
const LE_CART_VERSION_KEY = "le_cart_version";
const LE_MAX_QTY       = 10;   // soft per-line stock cap
const LE_RECENT_LIMIT  = 8;

/* ============================================================
   Currency formatting (₹, no decimals)
   ============================================================ */
const leCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
function leFormatPrice(amount){
  return leCurrencyFormatter.format(amount);
}

function leGetCart(){
  try{
    const raw = localStorage.getItem(LE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function leSetCart(cart){
  try{
    localStorage.setItem(LE_CART_KEY, JSON.stringify(cart));
  }catch(e){ /* storage unavailable — cart just won't persist */ }
  leUpdateCartBadges();
}

function leAddToCart(id, size, qty){
  qty = qty || 1;
  const cart = leGetCart();
  const existing = cart.find(i => i.id === id && i.size === size);
  if(existing){
    existing.qty = Math.min(existing.qty + qty, LE_MAX_QTY);
  }else{
    cart.push({ id, size, qty: Math.min(qty, LE_MAX_QTY) });
  }
  leSetCart(cart);
  leShowToast(`✓ Added ${leFragranceById(id)?.name || "item"} (${size}) to cart`);
}

function leUpdateQty(id, size, qty){
  const cart = leGetCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if(!item) return;
  if(qty <= 0){
    leSetCart(cart.filter(i => i !== item));
    return;
  }
  item.qty = Math.min(qty, LE_MAX_QTY);
  leSetCart(cart);
}

function leUpdateSize(id, oldSize, newSize){
  const cart = leGetCart();
  const item = cart.find(i => i.id === id && i.size === oldSize);
  if(!item) return;
  const dup = cart.find(i => i.id === id && i.size === newSize && i !== item);
  if(dup){
    dup.qty += item.qty;
    leSetCart(cart.filter(i => i !== item));
  }else{
    item.size = newSize;
    leSetCart(cart);
  }
}

function leRemoveFromCart(id, size){
  const cart = leGetCart().filter(i => !(i.id === id && i.size === size));
  leSetCart(cart);
}

function leClearCart(){
  leSetCart([]);
}

function leCartCount(){
  return leGetCart().reduce((n, i) => n + i.qty, 0);
}

function leCartLines(){
  return leGetCart()
    .map(i => {
      const f = leFragranceById(i.id);
      if(!f) return null;
      return { ...i, fragrance: f, unitPrice: f.prices[i.size], lineTotal: f.prices[i.size] * i.qty };
    })
    .filter(Boolean);
}

/* ============================================================
   Shared quantity control
   ============================================================ */
function leCartQtyFor(id, size){
  const item = leGetCart().find(i => i.id === id && i.size === size);
  return item ? item.qty : 0;
}

const LE_QTY_THEMES = {
  dark: {
    addBg: "#C98C7A", addBorder: "#C98C7A", addColor: "#2E221D",
    stepBorder: "#9C5644", stepColor: "#46362F", countColor: "#46362F",
    removeColor: "#6F5A4E", removeHover: "#B23B2E"
  },
  light: {
    addBg: "#46362F", addBorder: "#46362F", addColor: "#fff",
    stepBorder: "#A48D84", stepColor: "#46362F", countColor: "#46362F",
    removeColor: "#6F5A4E", removeHover: "#c00"
  }
};

function leRenderQtyControl(id, size, theme){
  const t = LE_QTY_THEMES[theme] || LE_QTY_THEMES.dark;
  const qty = leCartQtyFor(id, size);
  if(qty === 0){
    return `<button class="le-qty-add" data-id="${id}" data-size="${size}" style="background:${t.addBg};border:1px solid ${t.addBorder};color:${t.addColor};padding:6px 14px;font-size:0.72rem;font-weight:600;border-radius:4px;cursor:pointer;white-space:nowrap;">Add to cart</button>`;
  }
  return `
    <div class="le-qty-stepper" style="display:flex;align-items:center;gap:8px;">
      <button class="le-qty-btn le-qty-minus" data-id="${id}" data-size="${size}" style="width:22px;height:22px;border:1px solid ${t.stepBorder};background:transparent;color:${t.stepColor};border-radius:4px;cursor:pointer;line-height:1;">−</button>
      <span class="le-qty-count" style="min-width:14px;text-align:center;color:${t.countColor};font-size:0.85rem;">${qty}</span>
      <button class="le-qty-btn le-qty-plus" data-id="${id}" data-size="${size}" style="width:22px;height:22px;border:1px solid ${t.stepBorder};background:transparent;color:${t.stepColor};border-radius:4px;cursor:pointer;line-height:1;">+</button>
      <button class="le-qty-remove" data-id="${id}" data-size="${size}" aria-label="Remove from cart" style="border:none;background:none;color:${t.removeColor};cursor:pointer;font-size:0.9rem;padding:0 0 0 2px;">🗑</button>
    </div>`;
}

function leWireQtyControl(container, id, size, theme, onChange){
  function rerender(){
    container.innerHTML = leRenderQtyControl(id, size, theme);
    wire();
  }
  function wire(){
    const addBtn = container.querySelector(".le-qty-add");
    if(addBtn) addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      leAddToCart(id, size, 1);
      rerender();
      if(onChange) onChange();
    });
    const minus = container.querySelector(".le-qty-minus");
    if(minus) minus.addEventListener("click", (e) => {
      e.stopPropagation();
      leUpdateQty(id, size, leCartQtyFor(id, size) - 1);
      rerender();
      if(onChange) onChange();
    });
    const plus = container.querySelector(".le-qty-plus");
    if(plus) plus.addEventListener("click", (e) => {
      e.stopPropagation();
      leUpdateQty(id, size, leCartQtyFor(id, size) + 1);
      rerender();
      if(onChange) onChange();
    });
    const remove = container.querySelector(".le-qty-remove");
    if(remove) remove.addEventListener("click", (e) => {
      e.stopPropagation();
      leRemoveFromCart(id, size);
      rerender();
      if(onChange) onChange();
    });
  }
  rerender();
}

function leUpdateCartBadges(){
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = leCartCount();
  });
}

/* ============================================================
   Cart validation
   ============================================================ */
function leGetInvalidCartItems(){
  return leGetCart().filter(i => !leFragranceById(i.id));
}

function leValidateCart(){
  const invalid = leGetInvalidCartItems();
  if(invalid.length){
    const cart = leGetCart().filter(i => leFragranceById(i.id));
    leSetCart(cart);
  }
  return invalid;
}

/* ============================================================
   Cart versioning / migration
   ============================================================ */
function leMigrateCart(){
  const seenVersion = localStorage.getItem(LE_CART_VERSION_KEY);
  const currentVersion = LE_CART_KEY;
  if(seenVersion === currentVersion) return;
  localStorage.setItem(LE_CART_VERSION_KEY, currentVersion);
}

/* ============================================================
   Wishlist
   ============================================================ */
function leGetWishlist(){
  try{
    const raw = localStorage.getItem(LE_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function leSetWishlist(list){
  try{
    localStorage.setItem(LE_WISHLIST_KEY, JSON.stringify(list));
  }catch(e){ /* storage unavailable */ }
  leUpdateWishlistBadges();
}

function leIsWishlisted(id){
  return leGetWishlist().includes(id);
}

function leToggleWishlist(id){
  const list = leGetWishlist();
  const idx = list.indexOf(id);
  if(idx === -1){
    list.push(id);
    leSetWishlist(list);
    leShowToast(`Added ${leFragranceById(id)?.name || "item"} to wishlist`);
    return true;
  }else{
    list.splice(idx, 1);
    leSetWishlist(list);
    leShowToast(`Removed ${leFragranceById(id)?.name || "item"} from wishlist`);
    return false;
  }
}

function leWishlistCount(){
  return leGetWishlist().length;
}

function leWishlistItems(){
  return leGetWishlist().map(leFragranceById).filter(Boolean);
}

function leUpdateWishlistBadges(){
  document.querySelectorAll("[data-wishlist-count]").forEach(el => {
    el.textContent = leWishlistCount();
  });
}

/* ============================================================
   Recently viewed
   ============================================================ */
function leTrackRecentlyViewed(id){
  if(!leFragranceById(id)) return;
  let list = leGetRecentlyViewed(Infinity).map(f => f.id);
  list = list.filter(x => x !== id);
  list.unshift(id);
  list = list.slice(0, LE_RECENT_LIMIT);
  try{
    localStorage.setItem(LE_RECENT_KEY, JSON.stringify(list));
  }catch(e){ /* storage unavailable */ }
}

function leGetRecentlyViewed(limit){
  limit = limit === undefined ? LE_RECENT_LIMIT : limit;
  try{
    const raw = localStorage.getItem(LE_RECENT_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return ids.map(leFragranceById).filter(Boolean).slice(0, limit);
  }catch(e){
    return [];
  }
}

/* ============================================================
   Related products
   ============================================================ */
function leGetRelatedProducts(id, limit){
  limit = limit || 4;
  const base = leFragranceById(id);
  if(!base) return [];

  const sameHouse = FRAGRANCES.filter(f =>
    f.id !== id && f.house === base.house
  );
  const sameSeason = FRAGRANCES.filter(f =>
    f.id !== id &&
    f.house !== base.house &&
    f.season.some(s => base.season.includes(s))
  );

  const combined = [...sameHouse, ...sameSeason];
  const seen = new Set();
  const result = [];
  for(const f of combined){
    if(!seen.has(f.id)){
      seen.add(f.id);
      result.push(f);
    }
    if(result.length >= limit) break;
  }
  return result;
}

/* ============================================================
   Toast notifications
   ============================================================ */
function leEnsureToastContainer(){
  let el = document.getElementById("le-toast-container");
  if(!el){
    el = document.createElement("div");
    el.id = "le-toast-container";
    el.setAttribute("aria-live", "polite");
    Object.assign(el.style, {
      position: "fixed", bottom: "20px", right: "20px", zIndex: "9999",
      display: "flex", flexDirection: "column", gap: "8px", pointerEvents: "none"
    });
    document.body.appendChild(el);
  }
  return el;
}

function leShowToast(message, durationMs){
  durationMs = durationMs || 2600;
  if(typeof document === "undefined") return;
  const container = leEnsureToastContainer();
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    background: "#46362F", color: "#FAF6F2", padding: "10px 16px",
    borderRadius: "6px", fontSize: "14px", fontWeight: "500",
    boxShadow: "0 4px 14px rgba(70,54,47,0.28)", border: "1px solid #9C5644",
    opacity: "0", transform: "translateY(8px)", transition: "opacity 0.2s ease, transform 0.2s ease",
    pointerEvents: "auto", maxWidth: "280px"
  });
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 200);
  }, durationMs);
}

/* ============================================================
   Mini-cart / cart drawer
   ============================================================ */
function leEnsureCartDrawer(){
  let drawer = document.getElementById("le-cart-drawer");
  if(drawer) return drawer;

  const overlay = document.createElement("div");
  overlay.id = "le-cart-drawer-overlay";
  Object.assign(overlay.style, {
    position: "fixed", inset: "0", background: "rgba(70,54,47,0.45)",
    display: "none", zIndex: "9997"
  });
  overlay.addEventListener("click", leCloseCartDrawer);
  document.body.appendChild(overlay);

  drawer = document.createElement("div");
  drawer.id = "le-cart-drawer";
  Object.assign(drawer.style, {
    position: "fixed", top: "0", right: "0", height: "100%",
    width: "min(380px, 92vw)", background: "#fff", color: "#46362F",
    boxShadow: "-6px 0 24px rgba(70,54,47,0.2)", zIndex: "9998",
    transform: "translateX(100%)", transition: "transform 0.25s ease",
    display: "flex", flexDirection: "column", fontFamily: "inherit"
  });
  drawer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid #E6CFCB;">
      <strong>Your Cart</strong>
      <button id="le-cart-drawer-close" style="border:none;background:none;font-size:20px;cursor:pointer;">&times;</button>
    </div>
    <div id="le-cart-drawer-lines" style="flex:1;overflow-y:auto;padding:12px 16px;"></div>
    <div id="le-cart-drawer-footer" style="padding:16px;border-top:1px solid #E6CFCB;"></div>
  `;
  document.body.appendChild(drawer);
  drawer.querySelector("#le-cart-drawer-close").addEventListener("click", leCloseCartDrawer);
  return drawer;
}

function leRenderCartDrawer(){
  const drawer = leEnsureCartDrawer();
  const linesEl = drawer.querySelector("#le-cart-drawer-lines");
  const footerEl = drawer.querySelector("#le-cart-drawer-footer");
  const lines = leCartLines();
  const invalid = leGetInvalidCartItems();

  if(!lines.length){
    linesEl.innerHTML = `<p style="color:#6F5A4E;text-align:center;margin-top:40px;">Your cart is empty.</p>`;
    footerEl.innerHTML = "";
    return;
  }

  linesEl.innerHTML = lines.map(line => `
    <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #F1E4E0;">
      ${line.fragrance.image
        ? `<img src="${line.fragrance.image}" alt="${line.fragrance.name}" style="width:56px;height:80px;object-fit:contain;border-radius:6px;flex-shrink:0;">`
        : `<div style="width:56px;height:56px;border-radius:6px;background:${line.fragrance.color};flex-shrink:0;"></div>`}
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;">${line.fragrance.name}</div>
        <div style="font-size:12px;color:#6F5A4E;">${line.size} · ${leFormatPrice(line.unitPrice)}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
          <button data-le-qty-dec data-id="${line.id}" data-size="${line.size}" style="width:28px;height:28px;border:1px solid #A48D84;background:transparent;color:#46362F;border-radius:4px;cursor:pointer;line-height:1;">−</button>
          <span style="min-width:16px;text-align:center;">${line.qty}</span>
          <button data-le-qty-inc data-id="${line.id}" data-size="${line.size}" style="width:28px;height:28px;border:1px solid #A48D84;background:transparent;color:#46362F;border-radius:4px;cursor:pointer;line-height:1;">+</button>
          <button data-le-remove data-id="${line.id}" data-size="${line.size}" style="margin-left:auto;border:none;background:none;color:#c00;cursor:pointer;font-size:12px;padding:6px 0;">Remove</button>
        </div>
      </div>
      <div style="font-size:13px;font-weight:600;white-space:nowrap;">${leFormatPrice(line.lineTotal)}</div>
    </div>
  `).join("") + (invalid.length ? `<p style="color:#c00;font-size:12px;margin-top:10px;">${invalid.length} item(s) in your cart are no longer available and were removed.</p>` : "");

  const total = lines.reduce((n, l) => n + l.lineTotal, 0);
  footerEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-weight:600;margin-bottom:12px;">
      <span>Subtotal</span><span>${leFormatPrice(total)}</span>
    </div>
    <a href="checkout.html" style="display:block;text-align:center;background:#46362F;color:#fff;padding:12px;border-radius:6px;text-decoration:none;">Checkout</a>
  `;

  linesEl.querySelectorAll("[data-le-qty-inc]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      const item = leGetCart().find(i => i.id === id && i.size === size);
      leUpdateQty(id, size, (item?.qty || 0) + 1);
      leRenderCartDrawer();
    })
  );
  linesEl.querySelectorAll("[data-le-qty-dec]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      const item = leGetCart().find(i => i.id === id && i.size === size);
      leUpdateQty(id, size, (item?.qty || 0) - 1);
      leRenderCartDrawer();
    })
  );
  linesEl.querySelectorAll("[data-le-remove]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      leRemoveFromCart(id, size);
      leRenderCartDrawer();
    })
  );
}

function leOpenCartDrawer(){
  leValidateCart();
  leRenderCartDrawer();
  const drawer = leEnsureCartDrawer();
  const overlay = document.getElementById("le-cart-drawer-overlay");
  overlay.style.display = "block";
  requestAnimationFrame(() => { drawer.style.transform = "translateX(0)"; });
}

function leCloseCartDrawer(){
  const drawer = document.getElementById("le-cart-drawer");
  const overlay = document.getElementById("le-cart-drawer-overlay");
  if(drawer) drawer.style.transform = "translateX(100%)";
  if(overlay) overlay.style.display = "none";
}

function leToggleCartDrawer(){
  const drawer = document.getElementById("le-cart-drawer");
  const isOpen = drawer && drawer.style.transform === "translateX(0px)";
  isOpen ? leCloseCartDrawer() : leOpenCartDrawer();
}

/* ============================================================
   Product detail modal — Fixed alignment discrepancies
   ============================================================ */
function leEnsureProductModal(){
  let modal = document.getElementById("le-product-modal");
  if(modal) return modal;

  const overlay = document.createElement("div");
  overlay.id = "le-product-modal-overlay";
  Object.assign(overlay.style, {
    position: "fixed", inset: "0", background: "rgba(70,54,47,0.55)",
    display: "none", zIndex: "9995", alignItems: "center", justifyContent: "center", padding: "20px"
  });
  overlay.addEventListener("click", e => { if(e.target === overlay) leCloseProductModal(); });

  modal = document.createElement("div");
  modal.id = "le-product-modal";
  Object.assign(modal.style, {
    background: "#fff", color: "#46362F", borderRadius: "10px", maxWidth: "640px", width: "100%",
    maxHeight: "88vh", overflowY: "auto", padding: "24px", position: "relative"
  });
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return modal;
}

function leNoteRow(label, notes){
  return `
    <div style="margin-bottom:10px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6F5A4E;margin-bottom:3px;">${label}</div>
      <div style="font-size:14px;">${notes}</div>
    </div>
  `;
}

function leOpenProductModal(id){
  const f = leFragranceById(id);
  if(!f) return;
  leTrackRecentlyViewed(id);

  const modal = leEnsureProductModal();
  const overlay = document.getElementById("le-product-modal-overlay");
  const sizeKeys = Object.keys(f.prices);
  const related = leGetRelatedProducts(id, 4);
  const wishlisted = leIsWishlisted(id);

  modal.innerHTML = `
    <button id="le-modal-close" style="position:absolute;top:14px;right:14px;border:none;background:none;font-size:22px;cursor:pointer;">&times;</button>
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      ${f.image
        ? `<img src="${f.image}" alt="${f.name}" style="width:160px;height:195px;object-fit:contain;border-radius:10px;border:1px solid rgba(70,54,47,0.15);flex-shrink:0;">`
        : `<div style="width:160px;height:160px;border-radius:10px;background:${f.color};border:1px solid rgba(70,54,47,0.15);flex-shrink:0;"></div>`}
      <div style="flex:1;min-width:200px;">
        <div style="font-size:12px;color:#6F5A4E;">${f.house}</div>
        <h2 style="margin:2px 0 4px;">${f.name}</h2>
        
        <!-- Fixed alignment gap discrepancy layout line -->
        <div style="font-size:12px;color:#9C5644;margin-bottom:6px;visibility:${f.inspiredBy ? 'visible' : 'hidden'};height:18px;line-height:18px;">
          ${f.inspiredBy ? `≈ ${f.inspiredBy}` : '&nbsp;'}
        </div>

        <div style="font-size:12px;color:#6F5A4E;margin-bottom:10px;">${f.gender} · ${f.season.join(", ")}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="le-modal-wishlist" style="border:1px solid #A48D84;background:${wishlisted ? "#E6CFCB" : "#fff"};padding:8px 12px;border-radius:6px;cursor:pointer;">
            ${wishlisted ? "♥ In wishlist" : "♡ Add to wishlist"}
          </button>
          ${f.fragranticaUrl ? `<a href="${f.fragranticaUrl}" target="_blank" rel="noopener" style="border:1px solid #A48D84;padding:8px 12px;border-radius:6px;font-size:13px;text-decoration:none;color:#46362F;">Fragrantica ↗</a>` : ""}
        </div>
      </div>
    </div>

    <div style="margin-top:20px;padding:16px;background:#FAF6F2;border-radius:8px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:12px;">Note Pyramid</div>
      ${leNoteRow("Top", f.notes.top)}
      ${leNoteRow("Heart", f.notes.heart)}
      ${leNoteRow("Base", f.notes.base)}
    </div>

    <div style="margin-top:20px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:8px;">Sizes &amp; prices</div>
      <div style="border:1px solid #E6CFCB;border-radius:8px;overflow:hidden;">
        ${sizeKeys.map((sz, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:12px 16px;${i > 0 ? "border-top:1px solid #E6CFCB;" : ""}font-size:14px;color:#46362F;">
            <span style="display:flex;gap:10px;align-items:center;">
              <span>${sz}</span>
              <span style="font-weight:600;">${leFormatPrice(f.prices[sz])}</span>
            </span>
            <span class="le-modal-qty-slot" data-size="${sz}"></span>
          </div>
        `).join("")}
      </div>
    </div>

    ${related.length ? `
      <div style="margin-top:24px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px;">You may also like</div>
        <div style="display:flex;gap:10px;overflow-x:auto;">
          ${related.map(r => `
            <div data-le-related="${r.id}" style="cursor:pointer;flex-shrink:0;width:110px;text-align:center;">
              ${r.image
                ? `<img src="${r.image}" alt="${r.name}" style="width:110px;height:135px;object-fit:contain;border-radius:8px;">`
                : `<div style="width:110px;height:110px;border-radius:8px;background:${r.color};"></div>`}
              <div style="font-size:11px;margin-top:6px;">${r.name}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;

  modal.querySelectorAll(".le-modal-qty-slot").forEach(slot => {
    leWireQtyControl(slot, f.id, slot.dataset.size, "light");
  });

  modal.querySelector("#le-modal-close").addEventListener("click", leCloseProductModal);
  modal.querySelector("#le-modal-wishlist").addEventListener("click", () => {
    leToggleWishlist(f.id);
    leOpenProductModal(f.id);
  });
  modal.querySelectorAll("[data-le-related]").forEach(el =>
    el.addEventListener("click", () => leOpenProductModal(el.dataset.leRelated))
  );

  overlay.style.display = "flex";
}

function leCloseProductModal(){
  const overlay = document.getElementById("le-product-modal-overlay");
  if(overlay) overlay.style.display = "none";
}

/* ============================================================
   Checkout guard
   ============================================================ */
function leCheckoutGuard(redirectUrl){
  redirectUrl = redirectUrl || "cart.html";
  leValidateCart();
  if(leCartCount() === 0){
    leShowToast("Your cart is empty — add something first.");
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

/* ============================================================
   Cross-tab sync
   ============================================================ */
window.addEventListener("storage", (e) => {
  if(e.key === LE_CART_KEY){
    leUpdateCartBadges();
    if(document.getElementById("le-cart-drawer")) leRenderCartDrawer();
  }
  if(e.key === LE_WISHLIST_KEY){
    leUpdateWishlistBadges();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  leMigrateCart();
  leValidateCart();
  leUpdateCartBadges();
  leUpdateWishlistBadges();
});