import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel";
import { RoleEnum } from "../enums/UserEnums";

dotenv.config();

interface UserSeed {
  name: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Demo / test customers. The store previously mixed admin test data with real
 * accounts, so orders, reviews, cart and wishlist were wiped, these users are
 * the clean replacement base for the storefront.
 */
const userData: UserSeed[] = [
  { name: "Sita Gurung", email: "sita.gurung@example.com", password: "Pass@1234", phone: "9841122334" },
  { name: "Bikash Thapa", email: "bikash.thapa@example.com", password: "Pass@1234", phone: "9802233445" },
  { name: "Anita Rai", email: "anita.rai@example.com", password: "Pass@1234", phone: "9813344556" },
  { name: "Prakash Shrestha", email: "prakash.shrestha@example.com", password: "Pass@1234", phone: "9824455667" },
  { name: "Sunita Magar", email: "sunita.magar@example.com", password: "Pass@1234", phone: "9835566778" },
  { name: "Kiran Lama", email: "kiran.lama@example.com", password: "Pass@1234", phone: "9846677889" },
  { name: "Pooja Karki", email: "pooja.karki@example.com", password: "Pass@1234", phone: "9857788990" },
  { name: "Dipesh Adhikari", email: "dipesh.adhikari@example.com", password: "Pass@1234", phone: "9868899001" },
  { name: "Manisha Poudel", email: "manisha.poudel@example.com", password: "Pass@1234", phone: "9879900112" },
  { name: "Rajesh Khadka", email: "rajesh.khadka@example.com", password: "Pass@1234", phone: "9880011223" },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    // Hash once and reuse, bcrypt is deliberately slow, one hash per unique
    // password is enough for the whole batch.
    const passwordHashCache = new Map<string, string>();
    const hashFor = async (password: string): Promise<string> => {
      const cached = passwordHashCache.get(password);
      if (cached) return cached;
      const hash = await bcrypt.hash(password, 12);
      passwordHashCache.set(password, hash);
      return hash;
    };

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const seed of userData) {
      const existing = await UserModel.findOne({ email: seed.email.toLowerCase() }).select(
        "name phone role password_hash"
      );

      if (!existing) {
        await UserModel.create({
          name: seed.name,
          email: seed.email,
          password_hash: await hashFor(seed.password),
          phone: seed.phone,
          role: RoleEnum.customer,
          auth_provider: "local",
          addresses: [],
        });
        created += 1;
        console.log(`Created: ${seed.email}`);
        continue;
      }

      // Never touch password_hash/role of an existing account, only refresh
      // the profile fields this seeder owns. Existing credentials keep working.
      const changes: Record<string, unknown> = {};
      if (existing.name !== seed.name) changes.name = seed.name;
      if ((existing.phone ?? "") !== seed.phone) changes.phone = seed.phone;

      if (Object.keys(changes).length === 0) {
        skipped += 1;
        continue;
      }

      await UserModel.updateOne({ _id: existing._id }, { $set: changes });
      updated += 1;
      console.log(`Updated: ${seed.email} (${Object.keys(changes).join(", ")})`);
    }

    console.log(
      `User seeding complete. Created: ${created}, Updated: ${updated}, Already up to date: ${skipped}.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
