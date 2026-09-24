import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { UserServices } from "../../services";
import { jwtSecret, frontendUrl } from "../../config";
import { sendMail } from "../../config/mailer";
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

  // Generates a reset token, saves its hash + 15min expiry, and emails a
  // one-time link to the account's inbox. The raw token is NEVER part of the
  // HTTP response: forgot-password requires no authentication, so returning it
  // here let anyone reset any account (including the admin) in three requests.
  public static async forgotPassword(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { email } = req.body;

    // Identical reply whether or not the address exists, so this endpoint
    // cannot be used to discover which emails are registered.
    const genericReply = {
      success: true,
      message: "If an account with that email exists, a reset link has been sent to it.",
    };

    try {
      const user = await new UserServices().findone(email);
      if (!user) return res.status(200).json(genericReply);

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await new UserServices().setResetToken(user._id.toString(), hashedToken, expires);

      const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
      try {
        await sendMail({
          to: user.email,
          subject: "Reset your Elysian password",
          text: [
            "Hi,",
            "",
            "Someone requested a password reset for your Elysian account.",
            "Open this link to choose a new password:",
            resetUrl,
            "",
            "The link expires in 15 minutes. If you didn't request this,",
            "you can safely ignore this email - your password stays unchanged.",
          ].join("\n"),
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #111111">
              <h2 style="color: #0e7c85; margin: 0 0 16px">Elysian</h2>
              <p>Hi,</p>
              <p>Someone requested a password reset for your account. Click the button below to choose a new password:</p>
              <p style="margin: 24px 0">
                <a href="${resetUrl}" style="background: #0e7c85; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block">Reset password</a>
              </p>
              <p style="color: #666666; font-size: 13px; line-height: 1.5">
                This link expires in 15 minutes. If you didn't request it, you can ignore this email - your password stays unchanged.
              </p>
              <p style="color: #666666; font-size: 13px; line-height: 1.5">
                If the button doesn't work, paste this link into your browser:<br>${resetUrl}
              </p>
            </div>
          `,
        });
      } catch (mailError) {
        // The customer still gets the generic reply above (never the token).
        // If no email arrives, this line in the backend console explains why -
        // usually SMTP_HOST / SMTP_USER / SMTP_PASS missing from .env.
        console.error("Password reset email failed:", mailError);
      }

      return res.status(200).json(genericReply);
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