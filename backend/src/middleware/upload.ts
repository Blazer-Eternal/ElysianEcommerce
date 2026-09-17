import multer from "multer";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";

// Everything stays in memory — never touches disk, works fine on serverless.
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

// Compresses each uploaded file in memory, then uploads the buffer directly
// to Cloudinary — no local filesystem involved at any point.
export const compressImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return next();

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const compressedBuffer = await sharp(file.buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const uploadResult = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "elysian-products", resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(compressedBuffer);
      });

      uploadedUrls.push(uploadResult);
    }

    // Attach the final Cloudinary URLs so the controller can use them directly
    (req as any).uploadedImageUrls = uploadedUrls;
    next();
  } catch (error) {
    next(error);
  }
};