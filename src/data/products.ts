// Product catalog — Amway SG & MY
// To update: edit this file and push to main.
// image: CDN URL (starts with https://) or local filename inside public/products/

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
  | 'Home Living'
  | 'Home Care'

export const CATEGORIES: Category[] = [
  'Health & Nutrition', 'Energy', 'Beauty', 'Personal Care', 'Home Living', 'Home Care',
]

export interface ProductPrice {
  abo: number
  retail: number
}

export interface Product {
  id: string
  name: string
  category: Category
  overview: string
  description: string
  image: string
  tags: string[]
  benefits: string[]
  howToUse: string
  whenToUse?: string
  keyIngredients?: string[]
  sg?: { sku: string; price: ProductPrice; url: string }
  my?: { sku: string; price: ProductPrice; url: string }
}

const AMWAY_SG = 'https://www.amway.sg'
const AMWAY_MY = 'https://www.amway.my'

export const products: Product[] = [
  // ── HEALTH & NUTRITION ──────────────────────────────────────────────────────
  {
    id: 'nutrilite-protein',
    name: 'Nutrilite All Plant Protein Drink - 900g',
    category: 'Health & Nutrition',
    overview: 'A plant-based protein powder that delivers 21g of complete protein per serving from soy, wheat, and pea. Ideal for anyone wanting to increase daily protein intake without meat.',
    description: 'A complete plant-based protein blend from soy, wheat, and pea sources — 21g of protein per serving to support muscle maintenance and overall wellness.',
    image: 'https://media.amway.sg/sys-master/images/h0e/hd1/13891883630622/Product_588Wx588H_122594.png',
    tags: ['Protein', 'Plant-Based', 'Nutrilite', 'Bestseller'],
    benefits: [
      'Provides 21g high-quality protein per serving',
      'Blend of soy, wheat and pea protein sources',
      'Supports muscle maintenance and repair',
      'Fortified with vitamins and minerals',
      'No added sugar, low in fat',
    ],
    howToUse: 'Mix 2 level scoops (approx. 37g) with 200ml of cold water or low-fat milk. Stir or blend until smooth. Consume immediately after preparation.',
    whenToUse: 'Best taken as a meal replacement for breakfast, or within 30 minutes after exercise for muscle recovery.',
    keyIngredients: ['Soy protein isolate', 'Wheat protein isolate', 'Pea protein', 'Vitamins B1, B2, B6, B12', 'Iron, Zinc'],
    sg: {
      sku: '122594',
      price: { abo: 93.0, retail: 116.0 },
      url: `${AMWAY_SG}/nutrilite-all-plant-protein-drink-900g/p/122594SG`,
    },
    my: {
      sku: '122594',
      price: { abo: 226.0, retail: 282.5 },
      url: `${AMWAY_MY}/nutrilite-soy-protein-drink-900g/p/122594MY`,
    },
  },
  {
    id: 'nutrilite-double-x',
    name: 'Nutrilite Double X Multivitamin Tray',
    category: 'Health & Nutrition',
    overview: 'A comprehensive daily multivitamin-multimineral supplement with 12 vitamins, 10 minerals, and 22 plant concentrates in a convenient 31-day tray. Nutrilite\'s gold-standard supplement for full nutritional coverage.',
    description: 'Complete multivitamin, multimineral, and phytonutrient supplement with 12 vitamins, 10 minerals, and 22 plant concentrates — a 31-day supply tray.',
    image: 'nutrilite-double-x.jpg',
    tags: ['Multivitamin', 'Minerals', 'Nutrilite', 'Bestseller'],
    benefits: [
      'Contains 12 vitamins, 10 minerals, and 22 plant concentrates',
      'Provides triple plant-based protection with antioxidants',
      'Supports heart, immune, and eye health',
      'Derived from certified organic farms',
      'Convenient 31-day tray pack',
    ],
    howToUse: 'Take 1 Multivitamin tablet, 1 Multimineral tablet, and 1 Phytonutrient tablet daily with a meal.',
    whenToUse: 'Take with breakfast or your largest meal of the day for optimal absorption.',
    keyIngredients: ['Vitamin A, C, D, E, K', 'B-complex vitamins', 'Calcium, Magnesium, Zinc', 'Acerola cherry concentrate', 'Watercress, spinach, broccoli concentrate'],
    sg: {
      sku: '102884',
      price: { abo: 76.0, retail: 95.0 },
      url: `${AMWAY_SG}/nutrilite-double-x-tray-31-day-supply/p/102884SG`,
    },
    my: {
      sku: '102884',
      price: { abo: 174.0, retail: 217.5 },
      url: `${AMWAY_MY}/nutrilite-double-x-tray-31-day-supply/p/102884MY`,
    },
  },
  {
    id: 'nutrilite-bio-c',
    name: 'Nutrilite Bio C Plus Double Pack',
    category: 'Health & Nutrition',
    overview: 'A sustained-release Vitamin C supplement with natural acerola cherry that delivers all-day immune support and antioxidant protection. Comes as a value double pack (120 tablets × 2).',
    description: 'Sustained-release Vitamin C enriched with acerola cherry concentrate for all-day immune support and powerful antioxidant protection.',
    image: 'https://media.amway.my/sys-master/images/hf9/h2c/8798580080670/NUT_290268_1.jpg',
    tags: ['Vitamin C', 'Immune', 'Nutrilite'],
    benefits: [
      "Enriched with acerola cherry — one of nature's richest sources of natural Vitamin C",
      'Sustained-release formula provides all-day protection',
      'Supports immune system function',
      'Powerful antioxidant protection against free radicals',
      '120 tablets x2 bottles per pack',
    ],
    howToUse: 'Take 1 tablet daily with a meal. Do not exceed the recommended dose.',
    whenToUse: 'Take once daily, preferably in the morning with breakfast for optimal immune support throughout the day.',
    keyIngredients: ['Vitamin C 250mg', 'Acerola cherry concentrate', 'Citrus bioflavonoids', 'Rose hip extract'],
    sg: {
      sku: '290268',
      price: { abo: 55.0, retail: 69.0 },
      url: `${AMWAY_SG}/nutrilite-bio-c-plus-all-day-formula-double-pack/p/290268SG`,
    },
    my: {
      sku: '290268',
      price: { abo: 112.0, retail: 140.0 },
      url: `${AMWAY_MY}/nutrilite-bio-c-plus-all-day-formula-double-pack/p/290268MY`,
    },
  },
  {
    id: 'nutrilite-cal-mag-d',
    name: 'Nutrilite Cal Mag D Plus - 180 Tablets',
    category: 'Health & Nutrition',
    overview: 'A bone-health supplement combining calcium, magnesium, and vitamin D3 in ideal ratios. Great for adults looking to maintain bone density, especially those with low dairy intake.',
    description: 'Calcium, magnesium, and vitamin D3 in ideal ratios to support strong bones, healthy teeth, and superior mineral absorption — 60-day supply.',
    image: 'https://media.amway.sg/sys-master/images/h55/haf/13196177735710/Product_588Wx588H_110606.png',
    tags: ['Calcium', 'Bone Health', 'Nutrilite'],
    benefits: [
      'Provides calcium, magnesium and vitamin D3 in ideal ratios',
      'Supports strong bones and healthy teeth',
      'Vitamin D3 enhances calcium absorption',
      'Derived from premium-quality marine algae',
      '180 tablets — 60 days supply',
    ],
    howToUse: 'Take 3 tablets daily with a meal. Best absorbed when divided into 2-3 doses throughout the day.',
    whenToUse: 'Take with meals as calcium absorption is enhanced in the presence of food. Avoid taking at the same time as iron supplements.',
    keyIngredients: ['Calcium 500mg (from marine algae)', 'Magnesium 250mg', 'Vitamin D3 10mcg', 'Phosphorus'],
    sg: {
      sku: '110606',
      price: { abo: 31.0, retail: 39.0 },
      url: `${AMWAY_SG}/nutrilite-cal-mag-d-plus-180-tablets/p/110606SG`,
    },
    my: {
      sku: '110606',
      price: { abo: 71.0, retail: 88.5 },
      url: `${AMWAY_MY}/nutrilite-cal-mag-d-plus-180-tablets/p/110606MY`,
    },
  },
  {
    id: 'nutrilite-omega',
    name: 'Nutrilite Salmon Omega Complex - 60 Softgels',
    category: 'Health & Nutrition',
    overview: 'An omega-3 fish oil supplement from deep-sea salmon providing EPA and DHA to support heart, brain, and joint health. Enteric-coated softgels prevent any fishy aftertaste.',
    description: 'High-quality EPA and DHA from deep-sea salmon to support cardiovascular health, brain function, and joint mobility — no fishy aftertaste.',
    image: 'https://media.amway.my/sys-master/images/h8e/hf4/13410594127902/Product_588Wx588H_NUT_100066_1_IMG.jpg',
    tags: ['Omega-3', 'Heart Health', 'Nutrilite'],
    benefits: [
      'High-quality EPA and DHA from deep-sea salmon',
      'Supports cardiovascular health and normal blood triglyceride levels',
      'Promotes brain function and cognitive health',
      'Supports joint mobility and flexibility',
      'No fishy aftertaste — enteric-coated softgels',
    ],
    howToUse: 'Take 1 softgel three times daily with meals.',
    whenToUse: 'Take with meals to minimize any potential digestive discomfort and improve absorption of fat-soluble nutrients.',
    keyIngredients: ['EPA (eicosapentaenoic acid)', 'DHA (docosahexaenoic acid)', 'Omega-3 fatty acids from deep-sea salmon', 'Vitamin E (as antioxidant)'],
    sg: {
      sku: '100066',
      price: { abo: 38.0, retail: 47.5 },
      url: `${AMWAY_SG}/nutrilite-salmon-omega-complex-60-sg/p/100066SG`,
    },
    my: {
      sku: '100066',
      price: { abo: 87.0, retail: 109.0 },
      url: `${AMWAY_MY}/nutrilite-salmon-omega-complex-60-sg/p/100066MY`,
    },
  },
  {
    id: 'gutprotein',
    name: 'GUTPROtein',
    category: 'Health & Nutrition',
    overview: 'A 2-in-1 drink that combines protein with prebiotics and probiotics in a single sachet. Perfect for those who want to support both muscle health and gut health simultaneously.',
    description: 'Innovative 2-in-1 formula that combines high-quality protein with prebiotics and probiotics for digestive balance and muscle support in one drink.',
    image: 'gutprotein.jpg',
    tags: ['Gut Health', 'Protein', 'Probiotic', 'New'],
    benefits: [
      'Combines high-quality protein with gut health support',
      'Contains prebiotics to nourish beneficial gut bacteria',
      'Includes probiotics for digestive balance',
      'Supports overall digestive wellness',
      'Innovative 2-in-1 formula — protein and gut health in one drink',
    ],
    howToUse: 'Mix 1 sachet with 200ml of cold water. Stir well until fully dissolved. Consume immediately.',
    whenToUse: 'Can be taken any time of day. Ideal as a morning drink or post-workout supplement to support both muscle recovery and gut health.',
    keyIngredients: ['Whey protein concentrate', 'Prebiotic fiber (FOS)', 'Probiotic cultures (Lactobacillus)', 'Digestive enzymes'],
    my: {
      sku: '201966',
      price: { abo: 455.0, retail: 478.0 },
      url: `${AMWAY_MY}/gutprotein/p/201966MY`,
    },
  },

  // ── ENERGY ──────────────────────────────────────────────────────────────────
  {
    id: 'xs-energy-cranberry',
    name: 'XS Energy Drink — Cranberry-Grape Blast (6 Cans)',
    category: 'Energy',
    overview: 'A zero-sugar energy drink with B vitamins and 80mg natural caffeine for a clean, crash-free energy boost. Only 8 calories per can — great for fitness enthusiasts and busy professionals.',
    description: 'Zero-sugar energy drink powered by B vitamins and 80mg of natural caffeine — clean energy without the crash, only 8 calories per can.',
    image: 'https://media.amway.sg/sys-master/images/h76/h35/8929589100574/XS_290033_1.jpg',
    tags: ['XS', 'Zero Sugar', 'Energy', 'Bestseller'],
    benefits: [
      'Zero sugar — no blood sugar spikes',
      'Powered by B vitamins for clean energy',
      'Contains natural caffeine (80mg per can)',
      'No artificial flavors or colors',
      'Only 8 calories per can',
    ],
    howToUse: 'Drink 1 chilled can (250ml) as needed. Do not exceed 2 cans per day.',
    whenToUse: 'Best consumed before exercise, when studying, or whenever you need a focused energy boost. Avoid consuming before bedtime.',
    keyIngredients: ['B vitamins (B3, B6, B12)', 'Natural caffeine 80mg', 'Taurine', 'Panax ginseng extract'],
    sg: {
      sku: '290033',
      price: { abo: 27.0, retail: 31.5 },
      url: `${AMWAY_SG}/xs-energy-drink-cranberry-grape-blast-1-pack-of-6-cans/p/290033SG`,
    },
    my: {
      sku: '290033',
      price: { abo: 60.0, retail: 70.0 },
      url: `${AMWAY_MY}/xs-energy-drink-cranberry-grape-blast-1-pack-of-6-cans/p/290033MY`,
    },
  },
  {
    id: 'xs-muscle-multiplier',
    name: 'XS Mixed Whey Protein — Chocolate (1kg)',
    category: 'Energy',
    overview: 'A whey protein powder with 24g protein and BCAAs per serving in rich chocolate flavor. Designed for post-workout muscle recovery and for gym-goers wanting to build and maintain lean muscle.',
    description: 'Rich chocolate-flavored whey protein blend with 24g of protein and BCAAs per serving — ideal for post-workout muscle repair and recovery.',
    image: 'https://media.amway.my/sys-master/images/hd9/h41/8798982897694/XS_292650_1.jpg',
    tags: ['XS', 'Whey Protein', 'Muscle', 'Sports'],
    benefits: [
      '24g of protein per serving from whey concentrate and isolate',
      'Contains BCAAs to support muscle recovery',
      'Low in fat, moderate in carbohydrates',
      'Rich chocolate flavour — mixes easily',
      'Ideal for post-workout muscle repair',
    ],
    howToUse: 'Mix 1 scoop (approx. 40g) with 250–300ml of cold water or low-fat milk. Shake or blend until smooth.',
    whenToUse: 'Best consumed within 30 minutes after a workout to maximize muscle protein synthesis. Can also be used as a high-protein snack between meals.',
    keyIngredients: ['Whey protein concentrate', 'Whey protein isolate', 'BCAAs (Leucine, Isoleucine, Valine)', 'Cocoa powder', 'Natural chocolate flavoring'],
    sg: {
      sku: '292650',
      price: { abo: 85.0, retail: 106.5 },
      url: `${AMWAY_SG}/xs-mixed-whey-protein-with-chocolate-flavour-1kg/p/292650SG`,
    },
    my: {
      sku: '292650',
      price: { abo: 191.0, retail: 239.0 },
      url: `${AMWAY_MY}/xs-mixed-whey-protein-with-chocolate-flavour-1kg/p/292650MY`,
    },
  },

  // ── BEAUTY ──────────────────────────────────────────────────────────────────
  {
    id: 'artistry-anti-wrinkle-serum',
    name: 'ARTISTRY INTENSIVE SKINCARE Anti-Wrinkle Firming Serum — 30ml',
    category: 'Beauty',
    overview: 'A clinically proven anti-aging serum that visibly reduces wrinkles and firms skin in 4 weeks. For anyone wanting a high-performance daily serum to target signs of aging.',
    description: 'Clinically proven to reduce wrinkles in 4 weeks — this firming serum intensely hydrates, plumps, and boosts the skin\'s natural collagen production.',
    image: 'https://media.amway.sg/sys-master/images/h5c/hbe/8799366971422/ART_109709_1.jpg',
    tags: ['ARTISTRY', 'Anti-Aging', 'Serum', 'Bestseller'],
    benefits: [
      'Clinically proven to reduce appearance of wrinkles in 4 weeks',
      'Firms and lifts skin for a more youthful appearance',
      'Intensely hydrates and plumps skin',
      "Boosts skin's natural collagen production",
      'Dermatologist-tested, suitable for all skin types',
    ],
    howToUse: 'After cleansing and toning, apply 1-2 pumps to face and neck. Gently pat until absorbed. Follow with moisturizer. Use morning and night.',
    whenToUse: 'Apply twice daily — morning and evening — as part of your complete skincare routine after toner and before moisturizer.',
    keyIngredients: ['PhytoChemex™ complex', 'Retinol-like peptides', 'Hyaluronic acid', 'Botanical stem cell technology', 'Peptide complex'],
    sg: {
      sku: '109709',
      price: { abo: 145.0, retail: 181.5 },
      url: `${AMWAY_SG}/artistry-intensive-skincare-anti-wrinkle-firming-serum-30ml/p/109709SG`,
    },
    my: {
      sku: '109709',
      price: { abo: 322.0, retail: 402.5 },
      url: `${AMWAY_MY}/artistry-intensive-skincare-anti-wrinkle-firming-serum-30ml/p/109709MY`,
    },
  },
  {
    id: 'artistry-supreme-lx',
    name: 'ARTISTRY SUPREME LX Regenerating Cream — 50ml',
    category: 'Beauty',
    overview: 'Amway\'s most premium anti-aging moisturizer that deeply regenerates skin overnight and shows visible lifting and firming results in 2 weeks. Ideal for mature skin seeking luxury-level care.',
    description: "Amway's most luxurious anti-aging formula — significantly reduces deep wrinkles, intensely nourishes, and visibly firms skin with results in 2 weeks.",
    image: 'https://media.amway.sg/sys-master/images/hf9/h01/8799844270110/ART_118184_1.jpg',
    tags: ['ARTISTRY', 'Luxury', 'Anti-Aging', 'New'],
    benefits: [
      "Amway's most luxurious anti-aging formula",
      'Significantly reduces deep wrinkles and fine lines',
      'Intensely nourishes and firms skin overnight',
      'Features exclusive ARTISTRY Cell Science technology',
      'Visible results in 2 weeks of use',
    ],
    howToUse: 'Apply a pearl-sized amount to cleansed face and neck morning and night. Gently smooth upward and outward using fingertips. Allow to absorb fully.',
    whenToUse: 'Use both morning and night for best results. Especially beneficial as a night cream to support skin regeneration during sleep.',
    keyIngredients: ['ARTISTRY Cell Science technology', 'Precious plant-based actives', 'Hyaluronic acid complex', 'Ceramides', 'Niacinamide'],
    sg: {
      sku: '118184',
      price: { abo: 210.0, retail: 262.5 },
      url: `${AMWAY_SG}/artistry-supreme-lx-regenerating-cream-50ml/p/118184SG`,
    },
    my: {
      sku: '118184',
      price: { abo: 467.0, retail: 584.0 },
      url: `${AMWAY_MY}/artistry-supreme-lx-regenerating-cream-50ml/p/118184MY`,
    },
  },
  {
    id: 'artistry-uv-protect',
    name: 'ARTISTRY IDEAL RADIANCE UV Protect SPF50+ PA++++ — 30ml',
    category: 'Beauty',
    overview: 'A lightweight daily SPF50+ sunscreen that also brightens and evens skin tone. Perfect as the last skincare step before makeup — or as a standalone sun protection product.',
    description: 'Broad-spectrum SPF50+ PA++++ daily sunscreen that brightens skin tone and prevents dark spots — lightweight, non-greasy, and primer-ready.',
    image: 'https://media.amway.my/sys-master/images/hc8/h7b/8800286179358/ART_117809_1.jpg',
    tags: ['ARTISTRY', 'SPF50+', 'Sunscreen', 'Brightening'],
    benefits: [
      'Broad-spectrum SPF50+ PA++++ protection against UVA and UVB',
      'Brightens skin tone and evens complexion over time',
      'Lightweight, non-greasy formula absorbs quickly',
      'Helps prevent dark spots and hyperpigmentation',
      'Can be worn under makeup as a primer',
    ],
    howToUse: 'Apply generously to face and neck 20 minutes before sun exposure. Reapply every 2 hours when outdoors or after swimming/sweating.',
    whenToUse: 'Apply every morning as the final step in your skincare routine, before makeup. Essential daily protection, even on cloudy days.',
    keyIngredients: ['UV filters (UVA & UVB)', 'Niacinamide (Vitamin B3)', 'Licorice root extract', 'Vitamin C derivative', 'Hyaluronic acid'],
    sg: {
      sku: '117809',
      price: { abo: 65.0, retail: 81.5 },
      url: `${AMWAY_SG}/artistry-ideal-radiance-uv-protect-spf50-pa-30ml/p/117809SG`,
    },
    my: {
      sku: '117809',
      price: { abo: 145.0, retail: 181.0 },
      url: `${AMWAY_MY}/artistry-ideal-radiance-uv-protect-spf50-pa-30ml/p/117809MY`,
    },
  },
  {
    id: 'artistry-derma-architect',
    name: 'ARTISTRY INTENSIVE SKINCARE Advanced Skin Refinisher — 30ml',
    category: 'Beauty',
    overview: 'A gentle AHA exfoliating treatment that resurfaces skin to reduce pores, fine lines, and uneven tone. Use 2-3× per week at night to reveal smoother, more radiant skin.',
    description: 'Gentle exfoliating treatment with AHAs that refines pores, smooths texture, and brightens dull complexion — clinically tested for all skin types.',
    image: 'artistry-derma-architect.jpg',
    tags: ['ARTISTRY', 'Exfoliating', 'Resurfacing'],
    benefits: [
      'Gently exfoliates to reveal smoother, more radiant skin',
      'Refines pores and improves skin texture',
      'Reduces appearance of fine lines and uneven tone',
      'Brightens dull complexion with regular use',
      'Clinically tested for all skin types including sensitive skin',
    ],
    howToUse: 'Apply a small amount to cleansed, dry skin 2-3 times per week at night. Leave on for 10 minutes, then rinse thoroughly. Start with once per week if you have sensitive skin.',
    whenToUse: 'Best used at night 2-3 times per week. Always apply sunscreen the following morning as skin may be more sensitive to UV after use.',
    keyIngredients: ['Glycolic acid (AHA)', 'Lactic acid', 'Botanical extracts', 'Aloe vera', 'Panthenol (Pro-Vitamin B5)'],
    sg: {
      sku: '117842',
      price: { abo: 75.0, retail: 94.0 },
      url: `${AMWAY_SG}/artistry-intensive-skincare-advanced-skin-refinisher-30ml/p/117842SG`,
    },
    my: {
      sku: '117842',
      price: { abo: 167.0, retail: 209.0 },
      url: `${AMWAY_MY}/artistry-intensive-skincare-advanced-skin-refinisher-30ml/p/117842MY`,
    },
  },

  // ── PERSONAL CARE ────────────────────────────────────────────────────────────
  {
    id: 'glister-toothpaste',
    name: 'GLISTER Multi-Action Fluoride Toothpaste — 200g',
    category: 'Personal Care',
    overview: 'A multi-action daily toothpaste that whitens, fights cavities, and freshens breath in one formula. Gentle enough for everyday use by the whole family.',
    description: 'Multi-action fluoride toothpaste that fights cavities, whitens teeth, freshens breath, and strengthens enamel — gentle enough for daily use.',
    image: 'glister-toothpaste.jpg',
    tags: ['GLISTER', 'Oral Care', 'Whitening', 'Bestseller'],
    benefits: [
      'Fights cavities with fluoride protection',
      'Whitens teeth by removing surface stains',
      'Freshens breath with long-lasting mint flavor',
      'Strengthens tooth enamel with regular use',
      'Gentle formula safe for daily use',
    ],
    howToUse: 'Apply a pea-sized amount to a soft-bristled toothbrush. Brush teeth thoroughly for 2 minutes. Spit out — do not swallow. Brush after meals for best results.',
    whenToUse: 'Use twice daily — morning and night — after meals for comprehensive oral care.',
    keyIngredients: ['Sodium fluoride 1000ppm', 'Hydrated silica (gentle whitening)', 'Sodium monofluorophosphate', 'Peppermint oil', 'Xylitol'],
    sg: {
      sku: '683300',
      price: { abo: 14.5, retail: 18.0 },
      url: `${AMWAY_SG}/glister-multi-action-fluoride-toothpaste-200g/p/683300SG`,
    },
    my: {
      sku: '683300',
      price: { abo: 32.5, retail: 40.5 },
      url: `${AMWAY_MY}/glister-multi-action-fluoride-toothpaste-200g/p/683300MY`,
    },
  },
  {
    id: 'gh-body-wash',
    name: 'G&H REFRESH+ Body Wash Gel — 400ml',
    category: 'Personal Care',
    overview: 'A refreshing citrus-mint body wash that lathers richly and leaves skin clean without drying it out. pH-balanced and gentle enough for daily use on all skin types.',
    description: 'Invigorating citrus-mint body wash that cleanses without stripping moisture — pH-balanced, lathers richly, and leaves skin feeling refreshed.',
    image: 'https://media.amway.sg/sys-master/images/h78/hfa/8799223054366/GH_118110_1.jpg',
    tags: ['G&H', 'Body Wash', 'Refreshing'],
    benefits: [
      "Refreshing formula cleanses skin without stripping natural moisture",
      'Invigorating citrus-mint scent energizes the senses',
      'pH-balanced formula suitable for sensitive skin',
      'Lathers richly for a luxurious shower experience',
      'Leaves skin feeling clean and refreshed',
    ],
    howToUse: 'Apply to wet skin, lather, then rinse thoroughly. Use daily.',
    whenToUse: 'Best used in the morning shower to kickstart your day with a refreshing, energizing cleanse.',
    keyIngredients: ['Citrus extracts', 'Aloe vera', 'Glycerin', 'Vitamin E', 'Mint extract'],
    sg: {
      sku: '118110',
      price: { abo: 22.0, retail: 27.5 },
      url: `${AMWAY_SG}/g-h-refresh-body-wash-gel-400ml/p/118110SG`,
    },
    my: {
      sku: '118110',
      price: { abo: 49.0, retail: 61.5 },
      url: `${AMWAY_MY}/g-h-refresh-body-wash-gel-400ml/p/118110MY`,
    },
  },
  {
    id: 'satinique-shampoo',
    name: 'SATINIQUE Anti-Hairfall Shampoo — 280ml',
    category: 'Personal Care',
    overview: 'A strengthening shampoo formulated to reduce hair fall from breakage. Enriched with biotin and caffeine to strengthen roots and nourish the scalp for visibly fuller hair.',
    description: 'Strengthening shampoo that reduces hair fall caused by breakage, nourishes the scalp, and leaves hair visibly fuller and more manageable.',
    image: 'https://media.amway.my/sys-master/images/h67/hef/8799503810590/SAT_110659_1.jpg',
    tags: ['SATINIQUE', 'Hair Care', 'Anti-Hairfall'],
    benefits: [
      'Reduces hair fall caused by breakage with regular use',
      'Strengthens hair from root to tip',
      'Nourishes scalp for a healthy hair growth environment',
      'Gentle enough for daily use',
      'Leaves hair visibly fuller and more manageable',
    ],
    howToUse: 'Apply to wet hair, massage gently into scalp and work through lengths. Leave for 1-2 minutes. Rinse thoroughly. For best results, follow with SATINIQUE Anti-Hairfall Conditioner.',
    whenToUse: 'Use every wash, ideally 3-4 times per week. Consistent use over 4 weeks shows visible reduction in hair fall.',
    keyIngredients: ['Biotin', 'Pro-Vitamin B5 (Panthenol)', 'Caffeine (stimulates scalp)', 'Zinc pyrithione', 'Botanical keratin protein'],
    sg: {
      sku: '110659',
      price: { abo: 24.0, retail: 30.0 },
      url: `${AMWAY_SG}/satinique-anti-hairfall-shampoo-280ml/p/110659SG`,
    },
    my: {
      sku: '110659',
      price: { abo: 53.5, retail: 67.0 },
      url: `${AMWAY_MY}/satinique-anti-hairfall-shampoo-280ml/p/110659MY`,
    },
  },
  {
    id: 'allano-lotion',
    name: 'ALLANO Hand & Body Lotion — 400ml',
    category: 'Personal Care',
    overview: 'An everyday hand and body moisturizer that absorbs quickly without a greasy feel. Great for keeping skin soft and hydrated throughout the day — suitable for all skin types.',
    description: 'Fast-absorbing, non-greasy moisturizer that deeply softens skin and provides long-lasting hydration — suitable for all skin types.',
    image: 'https://media.amway.sg/sys-master/images/he7/hfc/8799346130974/ALL_285889_1.jpg',
    tags: ['ALLANO', 'Moisturizer', 'Daily Care'],
    benefits: [
      'Deeply moisturizes and softens skin',
      'Fast-absorbing, non-greasy formula',
      'Suitable for all skin types including sensitive skin',
      'Provides long-lasting hydration throughout the day',
      'Light, pleasant fragrance',
    ],
    howToUse: 'Apply generously to clean hands and body as needed. Massage in circular motions until fully absorbed. Use especially after bathing while skin is still slightly damp.',
    whenToUse: 'Apply after every hand wash and shower to lock in moisture. Ideal for dry, rough areas like elbows, knees, and heels.',
    keyIngredients: ['Glycerin', 'Aloe vera extract', 'Vitamin E', 'Shea butter', 'Lactic acid (gentle moisturizer)'],
    sg: {
      sku: '285889',
      price: { abo: 9.0, retail: 11.5 },
      url: `${AMWAY_SG}/allano-hand-body-lotion/p/285889SG`,
    },
    my: {
      sku: '285889',
      price: { abo: 20.5, retail: 25.5 },
      url: `${AMWAY_MY}/allano-hand-body-lotion/p/285889MY`,
    },
  },

  // ── HOME LIVING ──────────────────────────────────────────────────────────────
  {
    id: 'atmosphere-sky',
    name: 'ATMOSPHERE SKY™ Air Treatment System',
    category: 'Home Living',
    overview: 'A premium home air purifier that removes 99.99% of airborne particles including bacteria, viruses, and allergens — covering rooms up to 60m². Features real-time air quality monitoring.',
    description: 'Removes 99.99% of airborne particles down to 0.0024 microns — bacteria, viruses, allergens, and smoke — with real-time air quality monitoring for rooms up to 60m².',
    image: 'https://media.amway.sg/sys-master/images/ha1/h49/8798916837406/ATM_120539_1.jpg',
    tags: ['ATMOSPHERE', 'Air Purifier', 'HEPA', 'Bestseller'],
    benefits: [
      'Removes 99.99% of airborne particles down to 0.0024 microns',
      'Captures bacteria, viruses, allergens, smoke, and dust',
      '360° air intake for whole-room coverage up to 60m²',
      'Real-time air quality monitoring with color-coded display',
      'Whisper-quiet operation — suitable for bedrooms',
    ],
    howToUse: 'Place in the center of the room for optimal coverage. Power on and select desired fan speed. Replace HEPA filter every 12 months, pre-filter every 3 months.',
    whenToUse: 'Run continuously for best air quality results. Use in bedrooms, living rooms, offices, and nurseries. Especially important during haze season or for allergy sufferers.',
    keyIngredients: ['True HEPA filter (captures 0.0024 microns)', 'Activated carbon layer', 'Pre-filter (washable)', 'Particulate sensor'],
    sg: {
      sku: '120539',
      price: { abo: 2150.0, retail: 2688.0 },
      url: `${AMWAY_SG}/atmosphere-sky-ats/p/120539SG`,
    },
    my: {
      sku: '120539',
      price: { abo: 4780.0, retail: 5975.0 },
      url: `${AMWAY_MY}/atmosphere-sky-ats/p/120539MY`,
    },
  },
  {
    id: 'espring-water-purifier',
    name: 'eSpring™ Water Treatment System',
    category: 'Home Living',
    overview: 'An NSF-certified home water purifier combining carbon block filtration and UV sterilization to remove 140+ contaminants while preserving healthy minerals. Trusted in 60+ countries.',
    description: 'NSF-certified water purifier combining carbon block filter and UV technology to remove 140+ contaminants while retaining beneficial minerals.',
    image: 'https://media.amway.my/sys-master/images/h97/h66/8799070945310/ESP_100188_1.jpg',
    tags: ['eSpring', 'Water Purifier', 'UV', 'Bestseller'],
    benefits: [
      'Combines carbon block filter + UV technology to remove 140+ contaminants',
      'Destroys 99.99% of waterborne bacteria and viruses',
      'Retains beneficial minerals while removing harmful substances',
      'NSF-certified, used in 60+ countries',
      'No electricity needed for filtration — only UV lamp uses power',
    ],
    howToUse: 'Install under-counter or on countertop with included faucet. Replace the filter/UV lamp annually (approximately 5,000 liters). Monitor the indicator light for filter replacement reminder.',
    whenToUse: 'Use for all drinking water and cooking water. Also suitable for baby formula preparation and washing fruits and vegetables.',
    keyIngredients: ['Activated carbon block filter', 'UV light sterilization', '0.2-micron filtration', 'Ion exchange resin'],
    sg: {
      sku: '100188',
      price: { abo: 1050.0, retail: 1313.0 },
      url: `${AMWAY_SG}/espring-water-treatment-system/p/100188SG`,
    },
    my: {
      sku: '100188',
      price: { abo: 2330.0, retail: 2913.0 },
      url: `${AMWAY_MY}/espring-water-treatment-system/p/100188MY`,
    },
  },
  {
    id: 'atmosphere-drive',
    name: 'ATMOSPHERE DRIVE™ Car Air Purifier',
    category: 'Home Living',
    overview: 'A compact HEPA air purifier designed to sit in your car cup holder and clean the air while you drive. USB-powered and whisper-quiet — great for daily commuters and families.',
    description: 'Compact HEPA car air purifier that fits in your cup holder — removes bacteria, allergens, and fine particles silently via USB while you drive.',
    image: 'https://media.amway.sg/sys-master/images/h8f/h47/8798945738782/ATM_121637_1.jpg',
    tags: ['ATMOSPHERE', 'Car', 'Air Purifier', 'New'],
    benefits: [
      'Purifies car interior air while you drive',
      'Removes bacteria, allergens, and fine particles',
      'Compact design fits in car cup holder',
      'Connects via USB — works with any car',
      "Quiet operation that won't distract from driving",
    ],
    howToUse: 'Place upright in the cup holder or on the seat. Connect USB cable to car charger. Power on to start purification. Replace filter every 3-6 months.',
    whenToUse: 'Use during all car journeys for clean air inside the vehicle. Especially beneficial during haze season, in heavy traffic, or for passengers with allergies or respiratory conditions.',
    keyIngredients: ['HEPA-grade filter', 'Activated carbon filter', 'USB-powered operation'],
    sg: {
      sku: '121637',
      price: { abo: 380.0, retail: 475.0 },
      url: `${AMWAY_SG}/atmosphere-drive-car-ats/p/121637SG`,
    },
    my: {
      sku: '121637',
      price: { abo: 845.0, retail: 1056.0 },
      url: `${AMWAY_MY}/atmosphere-drive-car-ats/p/121637MY`,
    },
  },

  // ── HOME CARE ────────────────────────────────────────────────────────────────
  {
    id: 'sa8-laundry',
    name: 'SA8™ Premium Concentrated Laundry Detergent — 1kg',
    category: 'Home Care',
    overview: 'A concentrated, biodegradable laundry detergent where just 1 scoop cleans a full load. Enzyme-powered formula works in all water types and is safe for all fabric types including delicates.',
    description: 'Concentrated enzyme-powered laundry detergent — just 1 scoop per full load, safe for all fabrics, effective in hard and soft water, and biodegradable.',
    image: 'https://media.amway.my/sys-master/images/h27/he5/13225000239134/Product_245Wx245H_SA8_109849_1.jpg',
    tags: ['SA8', 'Laundry', 'Concentrated', 'Eco-Friendly'],
    benefits: [
      'Concentrated formula — 1 scoop cleans a full load',
      'Works effectively in hard and soft water',
      'Safe for all fabric types including delicates',
      'Biodegradable — environmentally friendly formula',
      'No harsh chemicals — gentle on skin',
    ],
    howToUse: 'Add 1 scoop (20g) for a normal load, 2 scoops for heavily soiled items. For front-loaders: add to detergent drawer. For top-loaders: dissolve in water before adding clothes. Wash as normal.',
    whenToUse: 'Suitable for all laundry — everyday wear, workout clothes, baby clothing, and delicates. Use for both machine and hand washing.',
    keyIngredients: ['Biodegradable surfactants', 'Enzymes (protease, amylase, lipase)', 'Optical brighteners', 'Water softening agents', 'Fragrance (hypoallergenic)'],
    sg: {
      sku: '109848',
      price: { abo: 16.0, retail: 20.0 },
      url: `${AMWAY_SG}/sa8-premium-concentrated-laundry-detergent-1kg/p/109848SG`,
    },
    my: {
      sku: '109848',
      price: { abo: 36.0, retail: 45.0 },
      url: `${AMWAY_MY}/sa8-premium-concentrated-laundry-detergent-1kg/p/109848MY`,
    },
  },
  {
    id: 'dish-drops',
    name: 'DISH DROPS™ Concentrated Dishwashing Liquid — 1L',
    category: 'Home Care',
    overview: 'An ultra-concentrated dishwashing liquid where a few drops go a long way — cutting through grease effectively while being gentle on hands. Biodegradable and eco-friendly.',
    description: 'Ultra-concentrated, biodegradable dishwashing liquid — a few drops cuts through grease and food residue while staying gentle on hands.',
    image: 'dish-drops.jpg',
    tags: ['DISH DROPS', 'Dishwashing', 'Concentrated', 'Eco-Friendly'],
    benefits: [
      'Ultra-concentrated — a few drops cleans a full sink of dishes',
      'Cuts through grease and tough food residue',
      'Gentle on hands with regular use',
      'Environmentally friendly, biodegradable formula',
      'Long-lasting value — one bottle replaces multiple regular bottles',
    ],
    howToUse: 'Add a few drops (3-5 drops) to a sink of warm water, or apply 1 drop directly to a wet sponge. Wash dishes and rinse well. Dilute 1:10 for a spray bottle solution.',
    whenToUse: 'Use for all dishwashing tasks — plates, glasses, pots, pans, fruits, and vegetables. Can also be used to clean kitchen surfaces and stovetops.',
    keyIngredients: ['Biodegradable surfactants', 'Plant-derived cleaning agents', 'Glycerin (hand-gentleness)', 'Mild fragrance'],
    sg: {
      sku: '110488',
      price: { abo: 12.0, retail: 15.0 },
      url: `${AMWAY_SG}/dish-drops-concentrated-dishwashing-liquid-1l/p/110488SG`,
    },
    my: {
      sku: '110488',
      price: { abo: 27.0, retail: 33.5 },
      url: `${AMWAY_MY}/dish-drops-concentrated-dishwashing-liquid-1l/p/110488MY`,
    },
  },
]
