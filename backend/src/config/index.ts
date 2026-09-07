import dotenv from "dotenv";
dotenv.config();

export const jwtSecret: string = process.env.JWT_SECRET as string;
export const port = process.env.PORT || 5000;
export const environment = process.env.NODE_ENV || "development";

export { default as Database } from "./database";