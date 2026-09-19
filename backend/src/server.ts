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

// CORS configuration - allow Vercel frontend
const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://elysian-ecommerce-frontend.vercel.app",
    process.env.FRONTEND_URL,
  ].filter((url): url is string => !!url),
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