import mongoose from "mongoose";
import dotenv from "dotenv";
import { CategoryModel } from "../models/CategoryModel";

dotenv.config();

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  children?: { name: string; slug: string; description: string }[];
}

const categoryData: CategorySeed[] = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Electronic gadgets and devices",
    children: [
      { name: "Mobile Phones", slug: "mobile-phones", description: "Smartphones and accessories" },
      { name: "Laptops", slug: "laptops", description: "Laptops and notebooks" },
      { name: "Earbuds & Headphones", slug: "earbuds-headphones", description: "Wired and wireless audio" },
      { name: "Smart Watches", slug: "smart-watches", description: "Wearable smart devices" },
      { name: "Cameras", slug: "cameras", description: "Digital and DSLR cameras" },
      { name: "Gaming Consoles", slug: "gaming-consoles", description: "Consoles and gaming accessories" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and accessories",
    children: [
      { name: "Men's Clothing", slug: "mens-clothing", description: "Shirts, pants, jackets for men" },
      { name: "Women's Clothing", slug: "womens-clothing", description: "Dresses, tops, bottoms for women" },
      { name: "Footwear", slug: "footwear", description: "Shoes, sandals, sneakers" },
      { name: "Bags & Wallets", slug: "bags-wallets", description: "Handbags, backpacks, wallets" },
      { name: "Jewelry", slug: "jewelry", description: "Rings, necklaces, earrings" },
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home essentials and kitchenware",
    children: [
      { name: "Furniture", slug: "furniture", description: "Sofas, tables, chairs" },
      { name: "Kitchen Appliances", slug: "kitchen-appliances", description: "Blenders, ovens, cookware" },
      { name: "Home Decor", slug: "home-decor", description: "Wall art, lighting, decorative items" },
      { name: "Bedding & Linen", slug: "bedding-linen", description: "Sheets, pillows, blankets" },
    ],
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Cosmetics and self-care products",
    children: [
      { name: "Skincare", slug: "skincare", description: "Moisturizers, serums, cleansers" },
      { name: "Makeup", slug: "makeup", description: "Foundation, lipstick, eyeliner" },
      { name: "Hair Care", slug: "hair-care", description: "Shampoo, conditioner, styling tools" },
      { name: "Fragrances", slug: "fragrances", description: "Perfumes and body sprays" },
    ],
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sporting goods and outdoor gear",
    children: [
      { name: "Fitness Equipment", slug: "fitness-equipment", description: "Dumbbells, yoga mats, resistance bands" },
      { name: "Outdoor Camping", slug: "outdoor-camping", description: "Tents, sleeping bags, camping gear" },
      { name: "Cycling", slug: "cycling", description: "Bicycles and cycling accessories" },
    ],
  },
  {
    name: "Books",
    slug: "books",
    description: "Books across all genres",
    children: [
      { name: "Fiction", slug: "fiction", description: "Novels and fictional stories" },
      { name: "Non-Fiction", slug: "non-fiction", description: "Biographies, self-help, essays" },
      { name: "Academic", slug: "academic", description: "Textbooks and reference material" },
    ],
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Toys, games, and entertainment for kids",
    children: [
      { name: "Action Figures", slug: "action-figures", description: "Collectible figures and playsets" },
      { name: "Board Games", slug: "board-games", description: "Family and strategy board games" },
      { name: "Educational Toys", slug: "educational-toys", description: "Learning-focused toys for children" },
    ],
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "Vehicle parts and accessories",
    children: [
      { name: "Car Accessories", slug: "car-accessories", description: "Seat covers, chargers, organizers" },
      { name: "Motorbike Accessories", slug: "motorbike-accessories", description: "Helmets, gloves, covers" },
    ],
  },
  {
    name: "Grocery",
    slug: "grocery",
    description: "Everyday food and grocery essentials",
    children: [
      { name: "Snacks", slug: "snacks", description: "Chips, biscuits, namkeen" },
      { name: "Beverages", slug: "beverages", description: "Juices, tea, coffee" },
      { name: "Staples", slug: "staples", description: "Rice, lentils, oil, spices" },
    ],
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Health supplements and wellness products",
    children: [
      { name: "Supplements", slug: "supplements", description: "Vitamins and protein supplements" },
      { name: "Personal Health Devices", slug: "personal-health-devices", description: "BP monitors, thermometers" },
    ],
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const existingCount = await CategoryModel.countDocuments();
    if (existingCount > 0) {
      console.log(`Categories already exist (${existingCount} found). Skipping seed.`);
      process.exit(0);
    }

    for (const parent of categoryData) {
      const createdParent = await CategoryModel.create({
        name: parent.name,
        slug: parent.slug,
        description: parent.description,
        parent_id: null,
      });

      console.log(`Created parent: ${createdParent.name}`);

      if (parent.children && parent.children.length > 0) {
        for (const child of parent.children) {
          await CategoryModel.create({
            name: child.name,
            slug: child.slug,
            description: child.description,
            parent_id: createdParent._id,
          });
        }
        console.log(`  → Created ${parent.children.length} subcategories under ${createdParent.name}`);
      }
    }

    console.log("Category seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();