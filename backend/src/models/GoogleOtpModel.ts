import { Schema, model, Document } from "mongoose";

export interface GoogleOtpInterface extends Document {
  email: string;
  name: string;
  google_id: string;
  otp_hash: string | null;
  otp_expires: Date | null;
  verify_attempts: number;
  send_count: number;
  window_start: Date;
  last_sent_at: Date | null;
  locked_until: Date | null;
}

const GoogleOtpSchema = new Schema<GoogleOtpInterface>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  google_id: { type: String, required: true },
  otp_hash: { type: String, default: null },
  otp_expires: { type: Date, default: null },
  verify_attempts: { type: Number, default: 0 },
  send_count: { type: Number, default: 0 },
  window_start: { type: Date, default: Date.now },
  last_sent_at: { type: Date, default: null },
  locked_until: { type: Date, default: null },
});

// Auto-clean stale pending signups after 24h
GoogleOtpSchema.index({ window_start: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

export const GoogleOtpModel = model<GoogleOtpInterface>("GoogleOtp", GoogleOtpSchema);
