import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import path from "path";
import connectDB from "./config/database";
import router from "./api/routes";

dotenv.config();

const app: Application = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// CORS configuration - dynamic origin whitelist
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const staticWhitelist = [
  "https://elysian-ecommerce-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter((url): url is string => !!url);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || localhostRegex.test(origin) || staticWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("ElysianEcommerce API is running...");
});

app.use("/api/v1", router);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;