// ─────────────────────────────────────────────────────────────────────────────
// Product catalog — Amway SG & MY
// To update: edit this file and push to main. GitHub Pages redeploys automatically.
// image: filename inside public/products/ (e.g. "nutrilite-protein.jpg")
//        OR a full https:// URL. Leave "" to show category icon.
// ─────────────────────────────────────────────────────────────────────────────

export function productImageUrl(image: string): string {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `${import.meta.env.BASE_URL}products/${image}`
}

export type Category =
  | 'Health & Nutrition'
  | 'Energy'
  | 'Beauty'
  | 'Personal Care'
  | 'Children'
  | 'Home Living'
  | 'Home Care'

export interface ProductPrice {
  abo: number
  retail: number
}

export interface Product {
  id: string
  name: string
  category: Category
  description: string
  image: string
  tags: string[]
  sg?: { sku: string; price: ProductPrice; url: string }
  my?: { sku: string; price: ProductPrice; url: string }
}

const AMWAY_SG = 'https://www.amway.sg'
const AMWAY_MY = 'https://www.amway.my'

export const products: Product[] = [
  // ── HEALTH & NUTRITION ──────────────────────────────────────────────────────
  {
    id: 'nutrilite-protein',
    name: 'Nutrilite All Plant Protein Drink',
    category: 'Health & Nutrition',
    description:
      'A high-quality plant-based protein blend from soy, wheat, and pea sources. 900g canister provides 21g of protein per serving to support muscle health and overall wellness.',
    image: 'nutrilite-protein.jpg',
    tags: ['Protein', 'Plant-Based', 'Nutrilite', 'Bestseller'],
    sg: {
      sku: '119843SG',
      price: { abo: 93.0, retail: 117.0 },
      url: `${AMWAY_SG}/nutrilite-all-plant-protein-drink-900g/p/119843SG`,
    },
    my: {
      sku: '119843MY',
      price: { abo: 206.5, retail: 258.0 },
      url: `${AMWAY_MY}/nutrilite-all-plant-protein-drink-900g/p/119843MY`,
    },
  },
  {
    id: 'nutrilite-double-x',
    name: 'Nutrilite Double X',
    category: 'Health & Nutrition',
    description:
      'Complete multivitamin, multimineral, and phytonutrient supplement. Contains 12 vitamins, 10 minerals, and 20+ plant concentrates. Available as a monthly tray pack.',
    image: 'nutrilite-double-x.jpg',
    tags: ['Multivitamin', 'Minerals', 'Nutrilite', 'Bestseller'],
    sg: {
      sku: '117356SG',
      price: { abo: 76.0, retail: 95.0 },
      url: `${AMWAY_SG}/nutrilite-double-x-tray/p/117356SG`,
    },
    my: {
      sku: '117356MY',
      price: { abo: 173.0, retail: 216.0 },
      url: `${AMWAY_MY}/nutrilite-double-x-tray/p/117356MY`,
    },
  },
  {
    id: 'nutrilite-vitamin-b',
    name: 'Nutrilite Vitamin B Dual-Action',
    category: 'Health & Nutrition',
    description:
      'Comprehensive B-complex formula with 8 essential B vitamins. Dual-action technology for immediate and sustained release. 120 tablets per bottle.',
    image: 'nutrilite-vitamin-b.jpg',
    tags: ['Vitamin B', 'Energy', 'Nutrilite'],
    sg: {
      sku: '117667SG',
      price: { abo: 43.0, retail: 54.0 },
      url: `${AMWAY_SG}/nutrilite-vitamin-b-dual-action-120-tablets/p/117667SG`,
    },
    my: {
      sku: '117667MY',
      price: { abo: 96.0, retail: 120.0 },
      url: `${AMWAY_MY}/nutrilite-vitamin-b-dual-action-120-tablets/p/117667MY`,
    },
  },
  {
    id: 'nutrilite-advanced-omega',
    name: 'Nutrilite Advanced Omega',
    category: 'Health & Nutrition',
    description:
      'Premium omega-3 supplement with EPA and DHA sourced from deep-sea fish oil. Supports heart health, brain function, and joint mobility. No fishy aftertaste.',
    image: 'nutrilite-advanced-omega.jpg',
    tags: ['Omega-3', 'Heart Health', 'Nutrilite'],
    sg: {
      sku: '109258SG',
      price: { abo: 58.0, retail: 72.5 },
      url: `${AMWAY_SG}/nutrilite-advanced-omega/p/109258SG`,
    },
    my: {
      sku: '109258MY',
      price: { abo: 128.5, retail: 160.5 },
      url: `${AMWAY_MY}/nutrilite-advanced-omega/p/109258MY`,
    },
  },
  {
    id: 'nutrilite-bio-c',
    name: 'Nutrilite Bio C Plus Double Pack',
    category: 'Health & Nutrition',
    description:
      'Vitamin C supplement enriched with acerola cherry concentrate — one of nature\'s richest sources of natural vitamin C. Supports immune function and antioxidant protection.',
    image: 'nutrilite-bio-c.jpg',
    tags: ['Vitamin C', 'Immune', 'Nutrilite'],
    sg: {
      sku: '100145SG',
      price: { abo: 55.0, retail: 69.0 },
      url: `${AMWAY_SG}/nutrilite-bio-c-plus-double-pack/p/100145SG`,
    },
    my: {
      sku: '100145MY',
      price: { abo: 112.0, retail: 140.0 },
      url: `${AMWAY_MY}/nutrilite-bio-c-plus-double-pack/p/100145MY`,
    },
  },
  {
    id: 'nutrilite-cal-mag-d',
    name: 'Nutrilite Cal Mag D Plus',
    category: 'Health & Nutrition',
    description:
      'Calcium, magnesium, and vitamin D3 supplement for strong bones and teeth. Derived from marine algae for superior absorption. 180 tablets per bottle.',
    image: 'nutrilite-cal-mag-d.png',
    tags: ['Calcium', 'Bone Health', 'Nutrilite'],
    sg: {
      sku: '104137SG',
      price: { abo: 31.0, retail: 39.0 },
      url: `${AMWAY_SG}/nutrilite-cal-mag-d-plus-180-tablets/p/104137SG`,
    },
    my: {
      sku: '104137MY',
      price: { abo: 69.5, retail: 87.0 },
      url: `${AMWAY_MY}/nutrilite-cal-mag-d-plus-180-tablets/p/104137MY`,
    },
  },
  {
    id: 'gutprotein',
    name: 'GUTPROtein',
    category: 'Health & Nutrition',
    description:
      'Innovative gut-health protein that combines high-quality protein with prebiotics and probiotics. Supports digestive wellness while providing nutritional support.',
    image: 'gutprotein.jpg',
    tags: ['Gut Health', 'Protein', 'Probiotic', 'New'],
    my: {
      sku: '201966MY',
      price: { abo: 454.5, retail: 478.0 },
      url: `${AMWAY_MY}/gutprotein/p/201966MY`,
    },
  },

  // ── ENERGY ──────────────────────────────────────────────────────────────────
  {
    id: 'xs-energy-cranberry',
    name: 'XS Energy Drink — Cranberry-Grape Blast',
    category: 'Energy',
    description:
      'Zero sugar energy drink powered by B vitamins and natural caffeine. Delivers a clean energy boost without the crash. Available in 250ml cans, pack of 12.',
    image: 'xs-energy-cranberry.jpg',
    tags: ['XS', 'Zero Sugar', 'Caffeine', 'Bestseller'],
    sg: {
      sku: '141327SG',
      price: { abo: 54.0, retail: 63.0 },
      url: `${AMWAY_SG}/xs-energy-drink-cranberry-grape-blast-12-cans/p/141327SG`,
    },
    my: {
      sku: '141327MY',
      price: { abo: 120.0, retail: 140.0 },
      url: `${AMWAY_MY}/xs-energy-drink-cranberry-grape-blast-12-cans/p/141327MY`,
    },
  },
  {
    id: 'xs-muscle-multiplier',
    name: 'XS Muscle Multiplier Essential Amino Acid',
    category: 'Energy',
    description:
      'Essential amino acid supplement to support muscle growth and recovery. Contains 9 EAAs including BCAA 2:1:1 ratio. Ideal post-workout recovery drink.',
    image: 'xs-muscle-multiplier.jpg',
    tags: ['XS', 'Amino Acid', 'Muscle', 'Sports'],
    sg: {
      sku: '122461SG',
      price: { abo: 60.0, retail: 75.0 },
      url: `${AMWAY_SG}/xs-muscle-multiplier-essential-amino-acid/p/122461SG`,
    },
    my: {
      sku: '122461MY',
      price: { abo: 133.5, retail: 167.0 },
      url: `${AMWAY_MY}/xs-muscle-multiplier-essential-amino-acid/p/122461MY`,
    },
  },

  // ── BEAUTY ──────────────────────────────────────────────────────────────────
  {
    id: 'artistry-sleeping-mask',
    name: 'ARTISTRY SKIN NUTRITION Sleeping Mask',
    category: 'Beauty',
    description:
      'Overnight repair mask infused with Phyto Elixir Complex. Deeply hydrates and restores skin while you sleep. Wake up to plumper, more radiant skin.',
    image: 'artistry-sleeping-mask.jpg',
    tags: ['ARTISTRY', 'Skincare', 'Hydration', 'Bestseller'],
    sg: {
      sku: '122606SG',
      price: { abo: 108.0, retail: 135.0 },
      url: `${AMWAY_SG}/artistry-skin-nutrition-sleeping-mask/p/122606SG`,
    },
    my: {
      sku: '122606MY',
      price: { abo: 240.0, retail: 300.0 },
      url: `${AMWAY_MY}/artistry-skin-nutrition-sleeping-mask/p/122606MY`,
    },
  },
  {
    id: 'artistry-anti-wrinkle-serum',
    name: 'ARTISTRY Anti-Wrinkle Serum',
    category: 'Beauty',
    description:
      'Advanced anti-aging serum with Retinol + Peptide Complex. Visibly reduces fine lines and wrinkles. Boosts skin firmness and elasticity. 30ml.',
    image: 'artistry-anti-wrinkle-serum.jpg',
    tags: ['ARTISTRY', 'Anti-Aging', 'Serum', 'Retinol'],
    sg: {
      sku: '109811SG',
      price: { abo: 170.0, retail: 213.0 },
      url: `${AMWAY_SG}/artistry-anti-wrinkle-serum/p/109811SG`,
    },
    my: {
      sku: '109811MY',
      price: { abo: 378.0, retail: 472.5 },
      url: `${AMWAY_MY}/artistry-anti-wrinkle-serum/p/109811MY`,
    },
  },
  {
    id: 'artistry-supreme-lx',
    name: 'ARTISTRY SUPREME LX Regenerating Cream',
    category: 'Beauty',
    description:
      'Luxury anti-aging cream with exclusive Cellular Longevity Complex. Targets all major signs of aging for a visibly younger-looking complexion. 50ml.',
    image: 'artistry-supreme-lx.jpg',
    tags: ['ARTISTRY', 'Luxury', 'Anti-Aging', 'Premium'],
    sg: {
      sku: '117842SG',
      price: { abo: 470.0, retail: 588.0 },
      url: `${AMWAY_SG}/artistry-supreme-lx-regenerating-cream/p/117842SG`,
    },
    my: {
      sku: '117842MY',
      price: { abo: 1044.0, retail: 1305.0 },
      url: `${AMWAY_MY}/artistry-supreme-lx-regenerating-cream/p/117842MY`,
    },
  },
  {
    id: 'artistry-uv-protect',
    name: 'ARTISTRY Multi-Defense UV Protect SPF50+',
    category: 'Beauty',
    description:
      'Lightweight daily sunscreen with broad-spectrum UVA/UVB protection SPF50+. Infused with antioxidants to defend against environmental damage. Non-greasy finish.',
    image: 'artistry-uv-protect.jpg',
    tags: ['ARTISTRY', 'Sunscreen', 'SPF50+', 'Daily'],
    sg: {
      sku: '120832SG',
      price: { abo: 65.0, retail: 82.0 },
      url: `${AMWAY_SG}/artistry-multi-defense-uv-protect-spf50/p/120832SG`,
    },
    my: {
      sku: '120832MY',
      price: { abo: 145.0, retail: 181.0 },
      url: `${AMWAY_MY}/artistry-multi-defense-uv-protect-spf50/p/120832MY`,
    },
  },
  {
    id: 'artistry-derma-architect',
    name: 'Artistry Derma Architect',
    category: 'Beauty',
    description:
      'Professional-grade skin rejuvenation device using microcurrent and LED light therapy. Clinically tested to reduce wrinkles and improve skin tone.',
    image: 'artistry-derma-architect.jpg',
    tags: ['ARTISTRY', 'Device', 'Microcurrent', 'Premium'],
    sg: {
      sku: '122610SG',
      price: { abo: 800.0, retail: 1000.0 },
      url: `${AMWAY_SG}/artistry-derma-architect/p/122610SG`,
    },
    my: {
      sku: '122610MY',
      price: { abo: 1780.0, retail: 2225.0 },
      url: `${AMWAY_MY}/artistry-derma-architect/p/122610MY`,
    },
  },

  // ── PERSONAL CARE ────────────────────────────────────────────────────────────
  {
    id: 'glister-toothpaste',
    name: 'GLISTER Multi-Action White Tea Toothpaste',
    category: 'Personal Care',
    description:
      'Fluoride toothpaste enriched with white tea extract. Whitens teeth, strengthens enamel, freshens breath, and helps prevent cavities. 200g.',
    image: 'glister-toothpaste.jpg',
    tags: ['GLISTER', 'Oral Care', 'Whitening', 'Bestseller'],
    sg: {
      sku: '117827SG',
      price: { abo: 12.5, retail: 15.5 },
      url: `${AMWAY_SG}/glister-multi-action-white-tea-toothpaste-200g/p/117827SG`,
    },
    my: {
      sku: '117827MY',
      price: { abo: 27.8, retail: 34.7 },
      url: `${AMWAY_MY}/glister-multi-action-white-tea-toothpaste-200g/p/117827MY`,
    },
  },
  {
    id: 'gh-body-wash',
    name: 'g&h Nourish+ Body Wash',
    category: 'Personal Care',
    description:
      'Luxuriously creamy body wash with shea butter and sweet almond oil. Deeply nourishes and leaves skin soft, smooth, and moisturised. 1000ml refill size.',
    image: 'gh-body-wash.jpg',
    tags: ['g&h', 'Body Care', 'Moisturising'],
    sg: {
      sku: '103577SG',
      price: { abo: 50.0, retail: 62.5 },
      url: `${AMWAY_SG}/gh-nourish-body-wash-1000ml/p/103577SG`,
    },
    my: {
      sku: '103577MY',
      price: { abo: 111.0, retail: 138.8 },
      url: `${AMWAY_MY}/gh-nourish-body-wash-1000ml/p/103577MY`,
    },
  },
  {
    id: 'satinique-shampoo',
    name: 'SATINIQUE Moisturizing Shampoo',
    category: 'Personal Care',
    description:
      'Moisturising shampoo with Botanisil Complex and silicone-free formula. Gently cleanses while adding shine and manageability. 280ml.',
    image: 'satinique-shampoo.jpg',
    tags: ['SATINIQUE', 'Hair Care', 'Moisturising'],
    sg: {
      sku: '103296SG',
      price: { abo: 18.0, retail: 23.0 },
      url: `${AMWAY_SG}/satinique-moisturizing-shampoo-280ml/p/103296SG`,
    },
    my: {
      sku: '103296MY',
      price: { abo: 40.5, retail: 52.8 },
      url: `${AMWAY_MY}/satinique-moisturizing-shampoo-280ml/p/103296MY`,
    },
  },
  {
    id: 'allano-lotion',
    name: 'ALLANO Hand & Body Lotion',
    category: 'Personal Care',
    description:
      'Fast-absorbing hand and body lotion with aloe vera and vitamin E. Provides long-lasting hydration without a greasy feel.',
    image: 'allano-lotion.jpg',
    tags: ['ALLANO', 'Body Care', 'Aloe Vera'],
    my: {
      sku: '108124MY',
      price: { abo: 49.9, retail: 62.4 },
      url: `${AMWAY_MY}/allano-hand-body-lotion/p/108124MY`,
    },
  },

  // ── HOME LIVING ──────────────────────────────────────────────────────────────
  {
    id: 'atmosphere-sky',
    name: 'Atmosphere Sky Air Treatment System',
    category: 'Home Living',
    description:
      'Advanced air purification system with 360° airflow and Medical-Grade HEPA-type filtration. Captures 99.99% of airborne particles. Smart sensor auto-adjusts fan speed.',
    image: 'atmosphere-sky.jpg',
    tags: ['Air Purifier', 'HEPA', 'Smart', 'Premium'],
    sg: {
      sku: '103935SG',
      price: { abo: 2241.0, retail: 2802.0 },
      url: `${AMWAY_SG}/atmosphere-sky-air-treatment-system/p/103935SG`,
    },
    my: {
      sku: '103935MY',
      price: { abo: 5570.5, retail: 6963.0 },
      url: `${AMWAY_MY}/atmosphere-sky-air-treatment-system/p/103935MY`,
    },
  },
  {
    id: 'espring-water-purifier',
    name: 'eSpring Water Purifier',
    category: 'Home Living',
    description:
      'Countertop water purifier with UV-C LED technology and activated carbon block filter. Eliminates 99.99% of waterborne bacteria and viruses. 5,000L annual capacity.',
    image: 'espring-water-purifier.png',
    tags: ['Water Purifier', 'UV-C', 'eSpring', 'Bestseller'],
    sg: {
      sku: '100189SG',
      price: { abo: 1680.0, retail: 2100.0 },
      url: `${AMWAY_SG}/espring-water-purifier/p/100189SG`,
    },
    my: {
      sku: '100189MY',
      price: { abo: 4680.0, retail: 5850.0 },
      url: `${AMWAY_MY}/espring-water-purifier/p/100189MY`,
    },
  },
  {
    id: 'atmosphere-drive',
    name: 'Atmosphere Drive In-Car Air Purifier',
    category: 'Home Living',
    description:
      'Compact in-car air purifier with HEPA filtration. Removes dust, allergens, and odors from your vehicle cabin. USB-powered, quiet operation.',
    image: 'atmosphere-drive.jpg',
    tags: ['Air Purifier', 'Car', 'HEPA', 'Compact'],
    sg: {
      sku: '122491SG',
      price: { abo: 530.0, retail: 663.0 },
      url: `${AMWAY_SG}/atmosphere-drive-in-car-air-purifier/p/122491SG`,
    },
    my: {
      sku: '122491MY',
      price: { abo: 1178.0, retail: 1472.5 },
      url: `${AMWAY_MY}/atmosphere-drive-in-car-air-purifier/p/122491MY`,
    },
  },

  // ── HOME CARE ────────────────────────────────────────────────────────────────
  {
    id: 'sa8-laundry',
    name: 'SA8 Laundry Detergent',
    category: 'Home Care',
    description:
      'Concentrated liquid laundry detergent with plant-based surfactants and enzyme technology. Effective in cold water, gentle on fabrics, tough on stains. 1L.',
    image: 'sa8-laundry.jpg',
    tags: ['SA8', 'Laundry', 'Eco', 'Concentrated'],
    sg: {
      sku: '101053SG',
      price: { abo: 24.0, retail: 30.0 },
      url: `${AMWAY_SG}/sa8-laundry-detergent-liquid-1l/p/101053SG`,
    },
    my: {
      sku: '101053MY',
      price: { abo: 55.0, retail: 68.8 },
      url: `${AMWAY_MY}/sa8-laundry-detergent-liquid-1l/p/101053MY`,
    },
  },
  {
    id: 'dish-drops',
    name: 'DISH DROPS Concentrated Dishwashing Liquid',
    category: 'Home Care',
    description:
      'Ultra-concentrated dish soap that cuts through grease effectively. Biodegradable formula is gentle on hands and safe for the environment. 1L.',
    image: 'dish-drops.jpg',
    tags: ['Dish Drops', 'Dishwashing', 'Biodegradable', 'Eco'],
    sg: {
      sku: '117748SG',
      price: { abo: 16.0, retail: 20.0 },
      url: `${AMWAY_SG}/dish-drops-concentrated-dishwashing-liquid-1l/p/117748SG`,
    },
    my: {
      sku: '117748MY',
      price: { abo: 35.0, retail: 43.8 },
      url: `${AMWAY_MY}/dish-drops-concentrated-dishwashing-liquid-1l/p/117748MY`,
    },
  },
]

export const CATEGORIES: Category[] = [
  'Health & Nutrition',
  'Energy',
  'Beauty',
  'Personal Care',
  'Children',
  'Home Living',
  'Home Care',
]
