import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import path from "path";
import connectDB from "./config/database";
import router from "./api/routes";
import { isSmtpConfigured } from "./config/mailer";

dotenv.config();

const app: Application = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// CORS configuration - dynamic origin whitelist
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
// Any Vercel deployment of this frontend (production, preview and branch URLs all end in *.vercel.app),
// so the deployed site works regardless of the exact *.vercel.app subdomain.
const vercelRegex = /^https:\/\/[\w-]+\.vercel\.app$/;
const staticWhitelist = [
  "https://elysian-ecommerce-frontend.vercel.app",
  process.env.FRONTEND_URL,
  // Optional extra origins (custom domains) as a comma-separated env var
  ...(process.env.CORS_ORIGINS ?? "").split(","),
]
  .filter((url): url is string => !!url)
  .map((url) => url.trim())
  .filter((url) => url.length > 0);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed =
      !origin ||
      localhostRegex.test(origin) ||
      vercelRegex.test(origin) ||
      staticWhitelist.includes(origin);
    // Unknown origins get NO Access-Control-Allow-Origin header (browser blocks cleanly)
    // instead of the cors middleware throwing a 500 that masks the real cause
    callback(null, allowed);
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
  if (!isSmtpConfigured) {
    console.log(
      "⚠️ SMTP not configured — password reset emails will NOT be sent. " +
        "Fill SMTP_HOST / SMTP_USER / SMTP_PASS in backend/.env (see the notes at the top of src/config/mailer.ts)."
    );
  }
});

export default app;