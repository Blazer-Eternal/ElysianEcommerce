import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { CustomRequestInterface } from "../intefaces";

export class Guard {
  public static grantAccess(req: CustomRequestInterface, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please provide a token with your request headers",
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded as CustomRequestInterface["user"];
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  public static grantRole(...roles: string[]) {
    return (req: CustomRequestInterface, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      const userRole = (req.user.role || "").toLowerCase().trim();
      const allowedRoles = roles.map((r) => r.toLowerCase().trim());
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ success: false, message: "You are not authorized to perform this task" });
      }
    };
  }
}