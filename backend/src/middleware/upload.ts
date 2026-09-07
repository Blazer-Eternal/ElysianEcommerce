import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(__dirname, "../../uploads/products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store in memory first — sharp compresses before writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Compresses and writes each uploaded file to disk, replacing req.files
// with objects carrying the final filename so the controller works unchanged.
export const compressImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return next();

    const processed = await Promise.all(
      files.map(async (file) => {
        const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filepath = path.join(uploadDir, filename);

        await sharp(file.buffer)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);

        return { ...file, filename };
      })
    );

    req.files = processed as Express.Multer.File[];
    next();
  } catch (error) {
    next(error);
  }
};