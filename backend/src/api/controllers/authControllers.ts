import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { UserServices } from "../../services";
import { jwtSecret } from "../../config";
import { RoleEnum } from "../../enums/UserEnums";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export class AuthController {
  public static async signup(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { name, email, password, phone } = req.body;

    try {
      const userExists = await new UserServices().findone(email);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: `User with email ${email} already exists!`,
        });
      }

      const password_hash = await bcrypt.hash(password, 12);

      const user = await new UserServices().create({
        name,
        email,
        password_hash,
        phone,
        role: RoleEnum.customer,
        addresses: [],
      });

      return res.status(201).json({
        success: true,
        message: "Signup successful! You can proceed to login",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("signup error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async login(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await new UserServices().findone(email);
      if (!user) {
        return res.status(404).json({ success: false, message: "User does not exist!" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials!" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: (user.role || "").toLowerCase().trim(),
        },
        jwtSecret,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: (user.role || "").toLowerCase().trim(),
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async logout(req: CustomRequestInterface, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ success: true, message: "Logout successful!" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async changePassword(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const user = await new UserServices().findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const userWithPassword = await new UserServices().findone(user.email);

      const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword!.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }

      const password_hash = await bcrypt.hash(newPassword, 12);
      await new UserServices().update(userId, { password_hash });

      return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("changePassword error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Generates a reset token, saves its hash + 15min expiry on the user.
  // NOTE: no email service configured yet — token is returned directly in the
  // response for now so the flow is testable. Replace with actual email sending
  // once an email provider (e.g. Nodemailer/SendGrid) is wired up, and remove
  // resetToken from the response at that point for real security.
  public static async forgotPassword(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      const user = await new UserServices().findone(email);

      // Always return the same generic response whether or not the user exists —
      // prevents leaking which emails are registered.
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "If an account with that email exists, a reset link has been generated.",
        });
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await new UserServices().setResetToken(user._id.toString(), hashedToken, expires);

      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been generated.",
        // TEMP: exposing raw token directly since no email service exists yet.
        // Remove this field once real email delivery is implemented.
        resetToken: rawToken,
      });
    } catch (error) {
      console.error("forgotPassword error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  public static async resetPassword(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { token, newPassword } = req.body;

    try {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const user = await new UserServices().findByResetToken(hashedToken);

      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }

      const password_hash = await bcrypt.hash(newPassword, 12);
      await new UserServices().update(user._id.toString(), { password_hash });
      await new UserServices().clearResetToken(user._id.toString());

      return res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
    } catch (error) {
      console.error("resetPassword error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}