import { Request } from "express";

export interface CustomRequestInterface extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}