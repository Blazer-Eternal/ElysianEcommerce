import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel";
import { RoleEnum } from "../enums/UserEnums";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const existingAdmin = await UserModel.findOne({ role: RoleEnum.admin });
    if (existingAdmin) {
      console.log("An admin already exists. Skipping seed.");
      process.exit(0);
    }

    const password_hash = await bcrypt.hash("ChangeMe@123", 12);

    const admin = await UserModel.create({
      name: "Super Admin",
      email: "admin@elysianecommerce.com",
      password_hash,
      phone: "9800000000",
      role: RoleEnum.admin,
      addresses: [],
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();