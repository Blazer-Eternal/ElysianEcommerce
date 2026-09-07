import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => console.log("MongoDB connection established"));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

export default connectDB;