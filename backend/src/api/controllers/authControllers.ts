import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { UserServices } from "../../services";
import { jwtSecret, frontendUrl, googleClientId } from "../../config";
import { sendMail } from "../../config/mailer";
import { RoleEnum } from "../../enums/UserEnums";
import { GoogleOtpModel } from "../../models/GoogleOtpModel";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const googleOAuthClient = new OAuth2Client(googleClientId);

const OTP_MAX_SENDS = 3; // max OTP emails allowed per 24h window
const OTP_TTL_MS = 10 * 60 * 1000; // OTP valid for 10 minutes
const OTP_MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 resend per minute
const LOCK_MS = 24 * 60 * 60 * 1000; // 1 day restriction after limit hit

async function issueGoogleOtp(email: string, name: string, googleId: string): Promise<
  | { ok: true; remaining: number }
  | { ok: false; status: number; message: string }
> {
  let doc = await GoogleOtpModel.findOne({ email });

  const now = Date.now();

  if (doc?.locked_until && doc.locked_until.getTime() > now) {
    return {
      ok: false,
      status: 429,
      message: "OTP limit reached. You can request a new OTP after 24 hours.",
    };
  }

  if (!doc) {
    doc = new GoogleOtpModel({ email, name, google_id: googleId });
  }

  // Reset the 24h send window once it has fully elapsed
  if (now - doc.window_start.getTime() > LOCK_MS) {
    doc.send_count = 0;
    doc.window_start = new Date(now);
    doc.locked_until = null;
  }

  if (doc.last_sent_at && now - doc.last_sent_at.getTime() < RESEND_COOLDOWN_MS) {
    return {
      ok: false,
      status: 429,
      message: "Please wait a moment before requesting another OTP.",
    };
  }

  if (doc.send_count >= OTP_MAX_SENDS) {
    doc.locked_until = new Date(now + LOCK_MS);
    await doc.save();
    return {
      ok: false,
      status: 429,
      message: "OTP limit reached (3 OTPs in 24 hours). Please try again after 24 hours.",
    };
  }

  const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digits, CSPRNG
  doc.otp_hash = crypto.createHash("sha256").update(otp).digest("hex");
  doc.otp_expires = new Date(now + OTP_TTL_MS);
  doc.verify_attempts = 0;
  doc.send_count += 1;
  doc.last_sent_at = new Date(now);
  doc.name = name;
  doc.google_id = googleId;
  await doc.save();

  try {
    await sendMail({
      to: email,
      subject: "Your Elysian verification code",
      text: `Your Elysian OTP is ${otp}. It expires in 10 minutes. If you didn't request this, ignore this email.`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #111111">
          <h2 style="color: #0e7c85; margin: 0 0 16px">Elysian</h2>
          <p>Hi${name ? ` ${name}` : ""},</p>
          <p>Use this code to verify your Google sign-up:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0e7c85; margin: 24px 0">${otp}</p>
          <p style="color: #666666; font-size: 13px">The code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
        </div>
      `,
    });
  } catch (mailError) {
    console.error("Google signup OTP email failed:", mailError);
    return { ok: false, status: 500, message: "Failed to send OTP email. Please try again later." };
  }

  return { ok: true, remaining: OTP_MAX_SENDS - doc.send_count };
}

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

  // Step 1 of Google sign-up: verify the Google ID token, require a verified
  // Google (Gmail/Workspace) account, then email a one-time OTP. No user is
  // created until the OTP is verified.
  public static async googleInitiate(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { credential } = req.body;

    try {
      let payload;
      try {
        const ticket = await googleOAuthClient.verifyIdToken({
          idToken: credential,
          audience: googleClientId,
        });
        payload = ticket.getPayload();
      } catch {
        return res.status(401).json({ success: false, message: "Google authentication failed. Please try again." });
      }

      if (!payload || !payload.email || !payload.email_verified) {
        return res.status(403).json({
          success: false,
          message: "A verified Google/Gmail account is required to sign up with Google.",
        });
      }

      const email = payload.email.toLowerCase();

      const existing = await new UserServices().findone(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists. Please log in instead.",
        });
      }

      const result = await issueGoogleOtp(email, payload.name || "", payload.sub);
      if (!result.ok) {
        return res.status(result.status).json({ success: false, message: result.message });
      }

      return res.status(200).json({
        success: true,
        message: `A verification code has been sent to ${email}.`,
        data: { email, attemptsRemaining: result.remaining },
      });
    } catch (error) {
      console.error("googleInitiate error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Resend the OTP (counts toward the 3-per-24h limit).
  public static async googleResend(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      const doc = await GoogleOtpModel.findOne({ email: email.toLowerCase() });
      if (!doc) {
        return res.status(404).json({ success: false, message: "No pending Google sign-up found. Start again." });
      }

      const result = await issueGoogleOtp(doc.email, doc.name, doc.google_id);
      if (!result.ok) {
        return res.status(result.status).json({ success: false, message: result.message });
      }

      return res.status(200).json({
        success: true,
        message: `A new verification code has been sent to ${doc.email}.`,
        data: { email: doc.email, attemptsRemaining: result.remaining },
      });
    } catch (error) {
      console.error("googleResend error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Step 2: verify the OTP, then create the account.
  public static async googleVerify(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { email, otp } = req.body;

    try {
      const doc = await GoogleOtpModel.findOne({ email: email.toLowerCase() });
      if (!doc) {
        return res.status(404).json({ success: false, message: "No pending Google sign-up found. Start again." });
      }

      if (doc.locked_until && doc.locked_until.getTime() > Date.now()) {
        return res.status(429).json({
          success: false,
          message: "OTP limit reached. You can request a new OTP after 24 hours.",
        });
      }

      if (!doc.otp_hash || !doc.otp_expires || doc.otp_expires.getTime() < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
      }

      if (doc.verify_attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
        doc.otp_hash = null;
        doc.otp_expires = null;
        await doc.save();
        return res.status(429).json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        });
      }

      const hashed = crypto.createHash("sha256").update(otp).digest("hex");
      if (hashed !== doc.otp_hash) {
        doc.verify_attempts += 1;
        await doc.save();
        return res.status(401).json({ success: false, message: "Incorrect OTP. Please try again." });
      }

      const existing = await new UserServices().findone(doc.email);
      if (existing) {
        await GoogleOtpModel.deleteOne({ _id: doc._id });
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists. Please log in instead.",
        });
      }

      const password_hash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 12);
      const user = await new UserServices().create({
        name: doc.name || "Elysian User",
        email: doc.email,
        password_hash,
        phone: "",
        role: RoleEnum.customer,
        addresses: [],
        auth_provider: "google",
        google_id: doc.google_id,
      });

      await GoogleOtpModel.deleteOne({ _id: doc._id });

      return res.status(201).json({
        success: true,
        message: "Account created successfully! You can now log in.",
        data: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("googleVerify error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // "Continue with Google" login: verifies the Google ID token and, if the
  // email belongs to a verified Google account matching an existing user,
  // issues the same JWT as a normal login.
  public static async googleLogin(req: CustomRequestInterface, res: Response): Promise<Response> {
    const { credential } = req.body;

    try {
      let payload;
      try {
        const ticket = await googleOAuthClient.verifyIdToken({
          idToken: credential,
          audience: googleClientId,
        });
        payload = ticket.getPayload();
      } catch {
        return res.status(401).json({ success: false, message: "Google authentication failed. Please try again." });
      }

      if (!payload || !payload.email || !payload.email_verified) {
        return res.status(403).json({
          success: false,
          message: "A verified Google/Gmail account is required.",
        });
      }

      const user = await new UserServices().findone(payload.email.toLowerCase());
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found for this Google email. Please register first.",
        });
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
      console.error("googleLogin error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}