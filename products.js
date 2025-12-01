// K-Beauty Products Database
// Based on real bestsellers from Amazon, Soko Glam, etc.

export const products = [
  {
    id: 1,
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "serum",
    price: 28.99,
    originalPrice: 35.00,
    amazonUrl: "https://www.amazon.com/COSRX-Advanced-Snail-Mucin-Essence/dp/B00PBX3L7K",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600"
    ],
    description: "The #1 bestselling Korean essence with 96% snail mucin. Deeply hydrates, repairs damaged skin, and improves skin elasticity. Perfect for all skin types, especially dry and sensitive skin.",
    keyBenefits: [
      "96% Snail Secretion Filtrate",
      "Deep hydration without heaviness",
      "Repairs damaged skin barrier",
      "Improves skin elasticity",
      "Reduces appearance of fine lines"
    ],
    howToUse: "Apply 2-3 drops after toning. Gently pat into skin until fully absorbed. Use morning and night.",
    ingredients: "Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Hyaluronate, Panthenol, Arginine, Allantoin, Ethyl Hexanediol, Sodium Polyacrylate, Carbomer, Phenoxyethanol",
    inStock: true,
    stock: 50,
    rating: 4.8,
    reviews: 12453,
    tags: ["bestseller", "hydration", "anti-aging", "sensitive-skin"],
    featured: true
  },
  {
    id: 2,
    name: "Beauty of Joseon Dynasty Cream",
    brand: "Beauty of Joseon",
    category: "moisturizer",
    price: 26.99,
    originalPrice: 32.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600"
    ],
    description: "Rich cream featuring traditional Korean medicinal herbs. Deeply nourishes while maintaining a lightweight feel. Perfect for achieving that coveted 'glass skin' glow.",
    keyBenefits: [
      "Traditional Korean herbs (Ginseng, Rice)",
      "Deep nourishment",
      "Brightening effect",
      "Non-greasy finish",
      "Suitable for all seasons"
    ],
    howToUse: "Apply as the last step of your skincare routine. Gently massage into face and neck.",
    ingredients: "Rice Extract, Ginseng Root Extract, Niacinamide, Glycerin, Squalane, Ceramide NP",
    inStock: true,
    stock: 35,
    rating: 4.7,
    reviews: 8621,
    tags: ["bestseller", "brightening", "traditional", "glass-skin"],
    featured: true
  },
  {
    id: 3,
    name: "Anua Heartleaf 77% Soothing Toner",
    brand: "Anua",
    category: "toner",
    price: 22.99,
    originalPrice: 28.00,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600"
    ],
    description: "TikTok viral toner with 77% heartleaf extract. Soothes irritated skin, controls sebum, and minimizes pores. pH 5.5 for optimal skin health.",
    keyBenefits: [
      "77% Heartleaf Extract",
      "Calms irritation instantly",
      "Controls excess oil",
      "Minimizes pores",
      "pH 5.5 balanced"
    ],
    howToUse: "After cleansing, apply with hands or cotton pad. Pat gently until absorbed.",
    ingredients: "Houttuynia Cordata Extract (77%), Glycerin, Betaine, Panthenol, Hyaluronic Acid",
    inStock: true,
    stock: 60,
    rating: 4.9,
    reviews: 15234,
    tags: ["tiktok-viral", "soothing", "sensitive-skin", "bestseller"],
    featured: true
  },
  {
    id: 4,
    name: "COSRX Low pH Good Morning Gel Cleanser",
    brand: "COSRX",
    category: "cleanser",
    price: 16.99,
    originalPrice: 20.00,
    image: "https://images.unsplash.com/photo-1556228841-80f6c3add2f0?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228841-80f6c3add2f0?w=600"
    ],
    description: "Gentle morning cleanser with low pH 5.5. Contains tea tree oil for acne care while maintaining skin's natural barrier.",
    keyBenefits: [
      "pH 5.5 (skin-friendly)",
      "Tea Tree Oil for acne",
      "Gentle daily cleanser",
      "Maintains moisture barrier",
      "No tightness after wash"
    ],
    howToUse: "Wet face, apply small amount, massage gently, rinse with lukewarm water.",
    ingredients: "Tea Tree Leaf Oil, Betaine Salicylate (BHA), Allantoin, Purified Water",
    inStock: true,
    stock: 45,
    rating: 4.6,
    reviews: 9876,
    tags: ["bestseller", "acne-care", "gentle", "daily-use"],
    featured: false
  },
  {
    id: 5,
    name: "Beauty of Joseon Relief Sun SPF 50+ PA++++",
    brand: "Beauty of Joseon",
    category: "sunscreen",
    price: 21.99,
    originalPrice: 25.00,
    image: "https://images.unsplash.com/photo-1556228841-28d9ea1b7f8d?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228841-28d9ea1b7f8d?w=600"
    ],
    description: "Reddit's #1 sunscreen! No white cast, feels like moisturizer, SPF 50+ PA++++ protection. Perfect for daily use.",
    keyBenefits: [
      "SPF 50+ PA++++ protection",
      "Zero white cast",
      "Moisturizing finish",
      "Rice & Grain extracts",
      "Suitable for all skin tones"
    ],
    howToUse: "Apply generously as the last step of skincare, 15 minutes before sun exposure. Reapply every 2 hours.",
    ingredients: "Rice Extract, Grain Fermented Extracts, Chemical Sunscreen Filters",
    inStock: true,
    stock: 70,
    rating: 5.0,
    reviews: 18432,
    tags: ["bestseller", "sun-protection", "no-white-cast", "daily-use"],
    featured: true
  },
  {
    id: 6,
    name: "COSRX Acne Pimple Master Patch (24 patches)",
    brand: "COSRX",
    category: "treatment",
    price: 7.99,
    originalPrice: 10.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"
    ],
    description: "Holy grail pimple patches! Absorbs pus and protects blemishes. Works overnight. 80,000+ 5-star reviews on Amazon.",
    keyBenefits: [
      "Absorbs pus effectively",
      "Protects from picking",
      "Invisible on skin",
      "Works overnight",
      "Different sizes included"
    ],
    howToUse: "Apply on clean, dry skin over blemish. Leave on for 8-12 hours. Replace when patch turns white.",
    ingredients: "Hydrocolloid",
    inStock: true,
    stock: 100,
    rating: 4.9,
    reviews: 83421,
    tags: ["bestseller", "acne", "overnight", "holy-grail"],
    featured: false
  },
  {
    id: 7,
    name: "Laneige Water Sleeping Mask",
    brand: "Laneige",
    category: "mask",
    price: 32.99,
    originalPrice: 40.00,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
    images: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600"
    ],
    description: "Iconic overnight mask that deeply hydrates while you sleep. Wake up to plump, glowing skin.",
    keyBenefits: [
      "Overnight hydration boost",
      "Plumps and softens skin",
      "Strengthens skin barrier",
      "Calming lavender scent",
      "Gel texture absorbs quickly"
    ],
    howToUse: "Apply as final step of night routine. Leave on overnight, rinse in morning.",
    ingredients: "Hydro Ionized Mineral Water, Hunza Apricot Extract, Evening Primrose Root Extract",
    inStock: true,
    stock: 40,
    rating: 4.7,
    reviews: 7543,
    tags: ["premium", "overnight", "hydration", "iconic"],
    featured: false
  },
  {
    id: 8,
    name: "Anua Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
    category: "cleanser",
    price: 25.99,
    originalPrice: 30.00,
    image: "https://images.unsplash.com/photo-1556228841-3f1e1b630a3e?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228841-3f1e1b630a3e?w=600"
    ],
    description: "Gentle cleansing oil that melts away makeup and blackheads. Perfect for double cleansing routine.",
    keyBenefits: [
      "Melts makeup instantly",
      "Removes blackheads",
      "Non-comedogenic",
      "Heartleaf extract soothes",
      "Emulsifies cleanly"
    ],
    howToUse: "Apply on dry face, massage, add water to emulsify, rinse thoroughly.",
    ingredients: "Ethylhexyl Palmitate, Sorbeth-30 Tetraoleate, Heartleaf Extract, Jojoba Oil",
    inStock: true,
    stock: 55,
    rating: 4.8,
    reviews: 6234,
    tags: ["double-cleansing", "makeup-remover", "gentle", "blackheads"],
    featured: false
  },
  {
    id: 9,
    name: "TIRTIR Mask Fit Red Cushion",
    brand: "TIRTIR",
    category: "makeup",
    price: 22.99,
    originalPrice: 28.00,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
    ],
    description: "TikTok's most viral cushion foundation! 24-hour lasting, semi-matte finish, perfect coverage.",
    keyBenefits: [
      "24-hour wear time",
      "Semi-matte finish",
      "Natural coverage",
      "SPF 40 PA++",
      "7 shade options"
    ],
    howToUse: "Pat onto skin with included puff. Build coverage as needed.",
    ingredients: "Titanium Dioxide, Niacinamide, Centella Asiatica Extract",
    inStock: true,
    stock: 30,
    rating: 4.9,
    reviews: 12876,
    tags: ["tiktok-viral", "makeup", "long-lasting", "bestseller"],
    featured: true
  },
  {
    id: 10,
    name: "Some By Mi AHA BHA PHA 30 Days Miracle Toner",
    brand: "Some By Mi",
    category: "toner",
    price: 24.99,
    originalPrice: 30.00,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
    ],
    description: "Triple-action exfoliating toner. Improves texture, minimizes pores, controls breakouts in 30 days.",
    keyBenefits: [
      "AHA + BHA + PHA exfoliation",
      "10,000ppm Tea Tree Extract",
      "Improves skin texture",
      "Controls breakouts",
      "Visible results in 30 days"
    ],
    howToUse: "After cleansing, soak cotton pad and wipe face. Use 2-3 times per week initially.",
    ingredients: "Tea Tree Leaf Water, AHA, BHA, PHA, Niacinamide, Adenosine",
    inStock: true,
    stock: 42,
    rating: 4.7,
    reviews: 8932,
    tags: ["exfoliation", "acne", "texture", "bestseller"],
    featured: false
  },
  // Continue with more products...
  {
    id: 11,
    name: "Glass Skin Routine Set (4 products)",
    brand: "SeoulZen Curated",
    category: "set",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600"
    ],
    description: "Complete 4-step routine to achieve Korean glass skin. Includes: Cleanser, Toner, Essence, Cream. Curated by SeoulZen beauty experts.",
    keyBenefits: [
      "Complete glass skin routine",
      "4 full-size products",
      "Save $30 vs. individual",
      "Expert curated",
      "Perfect for beginners"
    ],
    howToUse: "Use products in order: 1) Cleanser 2) Toner 3) Essence 4) Cream. Morning and night.",
    ingredients: "See individual products",
    inStock: true,
    stock: 20,
    rating: 4.9,
    reviews: 543,
    tags: ["set", "glass-skin", "value", "beginner-friendly"],
    featured: true
  },
  {
    id: 12,
    name: "Spring Skincare Bundle (6 products)",
    brand: "SeoulZen Curated",
    category: "set",
    price: 119.99,
    originalPrice: 180.00,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
    images: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600"
    ],
    description: "Spring-ready skincare set! Includes sunscreen, brightening serum, lightweight moisturizer, and more. Perfect for seasonal transition.",
    keyBenefits: [
      "6 full-size products",
      "Spring weather optimized",
      "Save $60 vs. individual",
      "UV protection included",
      "Brightening focus"
    ],
    howToUse: "Follow included routine guide for best results.",
    ingredients: "See individual products",
    inStock: true,
    stock: 15,
    rating: 4.8,
    reviews: 321,
    tags: ["set", "spring", "value", "sunscreen"],
    featured: false
  }
];

// Categories
export const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "cleanser", name: "Cleansers", count: products.filter(p => p.category === "cleanser").length },
  { id: "toner", name: "Toners", count: products.filter(p => p.category === "toner").length },
  { id: "serum", name: "Serums & Essences", count: products.filter(p => p.category === "serum").length },
  { id: "moisturizer", name: "Moisturizers", count: products.filter(p => p.category === "moisturizer").length },
  { id: "sunscreen", name: "Sunscreen", count: products.filter(p => p.category === "sunscreen").length },
  { id: "mask", name: "Masks", count: products.filter(p => p.category === "mask").length },
  { id: "treatment", name: "Treatments", count: products.filter(p => p.category === "treatment").length },
  { id: "makeup", name: "Makeup", count: products.filter(p => p.category === "makeup").length },
  { id: "set", name: "Sets & Bundles", count: products.filter(p => p.category === "set").length }
];

// Brands
export const brands = [
  "COSRX",
  "Beauty of Joseon",
  "Anua",
  "Laneige",
  "TIRTIR",
  "Some By Mi",
  "SeoulZen Curated"
];
