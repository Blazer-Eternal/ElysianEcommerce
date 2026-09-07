import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/ProductModel";
import { CategoryModel } from "../models/CategoryModel";
import { ProductStatusEnum } from "../enums/ProductEnums";

dotenv.config();

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost_price: number;
  stock: number;
  category_slug: string;
  images: string[];
  status: ProductStatusEnum;
}

// picsum.photos returns real, working, royalty-free stock images.
// Using a fixed seed per product so the same product always gets the same image.
const img = (seed: string, n = 1) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i + 1}/600/600`);

const productData: ProductSeed[] = [
  // Electronics
  { name: "iPhone 15 Pro", slug: "iphone-15-pro", description: "Apple's flagship smartphone with A17 Pro chip and titanium design", sku: "IPH15PRO-256-BLK", price: 999, cost_price: 750, stock: 50, category_slug: "mobile-phones", images: img("iphone15pro", 2), status: ProductStatusEnum.active },
  { name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", description: "Premium Android flagship with S Pen and 200MP camera", sku: "SGS24U-512-GRY", price: 1199, cost_price: 900, stock: 40, category_slug: "mobile-phones", images: img("s24ultra"), status: ProductStatusEnum.active },
  { name: "Dell XPS 13", slug: "dell-xps-13", description: "Compact ultrabook with InfinityEdge display and Intel Core i7", sku: "DELLXPS13-I7-16GB", price: 1199, cost_price: 950, stock: 25, category_slug: "laptops", images: img("dellxps13"), status: ProductStatusEnum.active },
  { name: "MacBook Air M3", slug: "macbook-air-m3", description: "Ultra-thin laptop powered by Apple M3 chip", sku: "MBA-M3-256-SLV", price: 1099, cost_price: 850, stock: 30, category_slug: "laptops", images: img("macbookairm3"), status: ProductStatusEnum.draft },
  { name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", description: "Industry-leading noise cancelling wireless headphones", sku: "SONY-XM5-BLK", price: 399, cost_price: 280, stock: 60, category_slug: "earbuds-headphones", images: img("sonyxm5"), status: ProductStatusEnum.active },
  { name: "Wireless Bluetooth Speaker", slug: "wireless-bluetooth-speaker", description: "Portable speaker with 20-hour battery life", sku: "SPKR-BT-PORT", price: 59, cost_price: 30, stock: 55, category_slug: "earbuds-headphones", images: img("btspeaker"), status: ProductStatusEnum.active },
  { name: "Apple Watch Series 9", slug: "apple-watch-series-9", description: "Advanced health and fitness tracking smartwatch", sku: "AWS9-45-MID", price: 429, cost_price: 320, stock: 35, category_slug: "smart-watches", images: img("applewatchs9"), status: ProductStatusEnum.active },
  { name: "Canon EOS R50", slug: "canon-eos-r50", description: "Mirrorless camera perfect for content creators", sku: "CANON-R50-KIT", price: 799, cost_price: 600, stock: 15, category_slug: "cameras", images: img("canonr50"), status: ProductStatusEnum.draft },
  { name: "PlayStation 5", slug: "playstation-5", description: "Next-gen gaming console with ultra-fast SSD", sku: "PS5-STD-1TB", price: 499, cost_price: 400, stock: 20, category_slug: "gaming-consoles", images: img("ps5"), status: ProductStatusEnum.active },
  { name: "Xbox Series X", slug: "xbox-series-x", description: "Powerful 4K gaming console from Microsoft", sku: "XBSX-1TB", price: 499, cost_price: 390, stock: 18, category_slug: "gaming-consoles", images: img("xboxseriesx"), status: ProductStatusEnum.active },

  // Fashion
  { name: "Men's Slim Fit Denim Jacket", slug: "mens-slim-fit-denim-jacket", description: "Classic denim jacket with a modern slim fit", sku: "MENS-DNM-JKT-M", price: 59, cost_price: 30, stock: 100, category_slug: "mens-clothing", images: img("denimjacket"), status: ProductStatusEnum.active },
  { name: "Women's Floral Summer Dress", slug: "womens-floral-summer-dress", description: "Lightweight floral dress perfect for summer", sku: "WOM-DRS-FLR-S", price: 45, cost_price: 20, stock: 80, category_slug: "womens-clothing", images: img("summerdress"), status: ProductStatusEnum.active },
  { name: "Running Sneakers", slug: "running-sneakers", description: "Lightweight breathable running shoes", sku: "SNKR-RUN-42", price: 79, cost_price: 40, stock: 70, category_slug: "footwear", images: img("runningsneakers"), status: ProductStatusEnum.active },
  { name: "Leather Crossbody Bag", slug: "leather-crossbody-bag", description: "Genuine leather crossbody bag with adjustable strap", sku: "BAG-LTHR-CRSBDY", price: 89, cost_price: 45, stock: 40, category_slug: "bags-wallets", images: img("crossbodybag"), status: ProductStatusEnum.draft },
  { name: "Sterling Silver Necklace", slug: "sterling-silver-necklace", description: "Elegant sterling silver necklace with pendant", sku: "JWL-NCK-SLV", price: 65, cost_price: 30, stock: 45, category_slug: "jewelry", images: img("silvernecklace"), status: ProductStatusEnum.active },

  // Home & Kitchen
  { name: "3-Seater Fabric Sofa", slug: "3-seater-fabric-sofa", description: "Comfortable modern sofa with soft fabric upholstery", sku: "SOFA-3ST-GRY", price: 549, cost_price: 380, stock: 10, category_slug: "furniture", images: img("fabricsofa"), status: ProductStatusEnum.active },
  { name: "Stand Mixer", slug: "stand-mixer", description: "Powerful stand mixer for baking and cooking", sku: "KIT-MIXER-STD", price: 249, cost_price: 150, stock: 22, category_slug: "kitchen-appliances", images: img("standmixer"), status: ProductStatusEnum.active },
  { name: "Wall Art Canvas Set", slug: "wall-art-canvas-set", description: "Set of 3 abstract canvas prints for living room decor", sku: "DECOR-CANVAS-3PC", price: 79, cost_price: 35, stock: 30, category_slug: "home-decor", images: img("wallartcanvas"), status: ProductStatusEnum.active },
  { name: "Egyptian Cotton Bedsheet Set", slug: "egyptian-cotton-bedsheet-set", description: "Premium 400 thread count cotton bedsheet set, queen size", sku: "BED-SHEET-EGY-Q", price: 89, cost_price: 45, stock: 35, category_slug: "bedding-linen", images: img("bedsheetset"), status: ProductStatusEnum.active },

  // Beauty & Personal Care
  { name: "Vitamin C Serum", slug: "vitamin-c-serum", description: "Brightening facial serum with 20% Vitamin C", sku: "SKN-VITC-30ML", price: 24, cost_price: 10, stock: 150, category_slug: "skincare", images: img("vitcserum"), status: ProductStatusEnum.active },
  { name: "Matte Liquid Lipstick Set", slug: "matte-liquid-lipstick-set", description: "Set of 6 long-lasting matte liquid lipsticks", sku: "MKUP-LIP-SET6", price: 32, cost_price: 15, stock: 90, category_slug: "makeup", images: img("lipstickset"), status: ProductStatusEnum.active },
  { name: "Argan Oil Hair Serum", slug: "argan-oil-hair-serum", description: "Nourishing argan oil serum for frizz-free shiny hair", sku: "HAIR-ARGAN-100ML", price: 19, cost_price: 8, stock: 120, category_slug: "hair-care", images: img("arganoilserum"), status: ProductStatusEnum.active },
  { name: "Eau de Parfum - Amber Rose", slug: "eau-de-parfum-amber-rose", description: "Long-lasting floral amber fragrance, 50ml", sku: "FRAG-EDP-AMBROSE", price: 55, cost_price: 25, stock: 40, category_slug: "fragrances", images: img("amberroseparfum"), status: ProductStatusEnum.active },

  // Sports & Outdoors
  { name: "Adjustable Dumbbell Set", slug: "adjustable-dumbbell-set", description: "Space-saving adjustable dumbbells, 5-25kg per hand", sku: "FIT-DMBL-ADJ", price: 199, cost_price: 130, stock: 18, category_slug: "fitness-equipment", images: img("dumbbellset"), status: ProductStatusEnum.active },
  { name: "4-Person Camping Tent", slug: "4-person-camping-tent", description: "Waterproof tent with easy setup, fits 4 people", sku: "CAMP-TENT-4P", price: 129, cost_price: 75, stock: 25, category_slug: "outdoor-camping", images: img("campingtent"), status: ProductStatusEnum.draft },
  { name: "Mountain Bike 21-Speed", slug: "mountain-bike-21-speed", description: "All-terrain mountain bike with 21-speed gear system", sku: "BIKE-MTB-21SP", price: 349, cost_price: 220, stock: 12, category_slug: "cycling", images: img("mountainbike"), status: ProductStatusEnum.active },

  // Books
  { name: "The Midnight Library", slug: "the-midnight-library", description: "Bestselling novel by Matt Haig", sku: "BOOK-FIC-MDLIB", price: 15, cost_price: 7, stock: 200, category_slug: "fiction", images: img("midnightlibrary"), status: ProductStatusEnum.active },
  { name: "Atomic Habits", slug: "atomic-habits", description: "Self-help book on building good habits by James Clear", sku: "BOOK-NF-ATOMIC", price: 18, cost_price: 8, stock: 180, category_slug: "non-fiction", images: img("atomichabits"), status: ProductStatusEnum.active },
  { name: "Introduction to Algorithms", slug: "introduction-to-algorithms", description: "Comprehensive computer science textbook (CLRS)", sku: "BOOK-ACAD-ALGO", price: 65, cost_price: 35, stock: 40, category_slug: "academic", images: img("algorithmsbook"), status: ProductStatusEnum.active },

  // Toys & Games
  { name: "Superhero Action Figure Set", slug: "superhero-action-figure-set", description: "Set of 4 poseable superhero action figures", sku: "TOY-ACT-HERO4", price: 29, cost_price: 12, stock: 65, category_slug: "action-figures", images: img("actionfigures"), status: ProductStatusEnum.active },
  { name: "Strategy Board Game - Settlers", slug: "strategy-board-game-settlers", description: "Classic resource-trading strategy board game for 3-4 players", sku: "TOY-BRD-SETTLERS", price: 39, cost_price: 18, stock: 45, category_slug: "board-games", images: img("boardgame"), status: ProductStatusEnum.active },
  { name: "Wooden Educational Puzzle Set", slug: "wooden-educational-puzzle-set", description: "Montessori-style wooden puzzles for early learning", sku: "TOY-EDU-WOODPZ", price: 22, cost_price: 9, stock: 55, category_slug: "educational-toys", images: img("educationaltoy"), status: ProductStatusEnum.active },

  // Automotive
  { name: "Car Phone Mount & Charger", slug: "car-phone-mount-charger", description: "Wireless charging car mount for dashboard or windshield", sku: "AUTO-MOUNT-WCHG", price: 25, cost_price: 10, stock: 90, category_slug: "car-accessories", images: img("carphonemount"), status: ProductStatusEnum.active },
  { name: "Full-Face Motorbike Helmet", slug: "full-face-motorbike-helmet", description: "DOT-certified full-face helmet with anti-fog visor", sku: "AUTO-HELMET-FF", price: 89, cost_price: 45, stock: 30, category_slug: "motorbike-accessories", images: img("motorbikehelmet"), status: ProductStatusEnum.active },

  // Grocery
  { name: "Assorted Namkeen Snack Pack", slug: "assorted-namkeen-snack-pack", description: "Pack of 5 assorted savory Indian snacks", sku: "GROC-SNACK-NMK5", price: 12, cost_price: 6, stock: 200, category_slug: "snacks", images: img("namkeensnack"), status: ProductStatusEnum.active },
  { name: "Organic Green Tea Box", slug: "organic-green-tea-box", description: "Box of 100 organic green tea bags", sku: "GROC-BEV-GRNTEA", price: 9, cost_price: 4, stock: 250, category_slug: "beverages", images: img("greentea"), status: ProductStatusEnum.active },
  { name: "Basmati Rice 5kg", slug: "basmati-rice-5kg", description: "Premium long-grain basmati rice, 5kg pack", sku: "GROC-STPL-RICE5", price: 14, cost_price: 8, stock: 300, category_slug: "staples", images: img("basmatirice"), status: ProductStatusEnum.active },

  // Health & Wellness
  { name: "Whey Protein Powder 2kg", slug: "whey-protein-powder-2kg", description: "Chocolate flavor whey protein, 2kg tub", sku: "HLTH-SUPP-WHEY2", price: 49, cost_price: 28, stock: 60, category_slug: "supplements", images: img("wheyprotein"), status: ProductStatusEnum.active },
  { name: "Digital Blood Pressure Monitor", slug: "digital-blood-pressure-monitor", description: "Automatic upper-arm BP monitor with memory function", sku: "HLTH-DEV-BPMON", price: 39, cost_price: 20, stock: 40, category_slug: "personal-health-devices", images: img("bpmonitor"), status: ProductStatusEnum.active },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const existingCount = await ProductModel.countDocuments();
    if (existingCount > 0) {
      console.log(`Products already exist (${existingCount} found). Skipping seed.`);
      process.exit(0);
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of productData) {
      const category = await CategoryModel.findOne({ slug: item.category_slug });

      if (!category) {
        console.log(`⚠️ Skipped "${item.name}" — category slug '${item.category_slug}' not found. Run seed:categories first.`);
        skippedCount++;
        continue;
      }

      await ProductModel.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        sku: item.sku,
        price: item.price,
        cost_price: item.cost_price,
        stock: item.stock,
        category_id: category._id,
        images: item.images,
        status: item.status,
      });

      console.log(`Created product: ${item.name}`);
      createdCount++;
    }

    console.log(`\nProduct seeding complete. Created: ${createdCount}, Skipped: ${skippedCount}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();