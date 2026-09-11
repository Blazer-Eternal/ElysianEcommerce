import dotenv from "dotenv";
dotenv.config();

export const jwtSecret: string = process.env.JWT_SECRET as string;
export const port = process.env.PORT || 5000;
export const environment = process.env.NODE_ENV || "development";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// eSewa v2 sandbox (test) credentials — publicly documented test values.
// Swap these for real merchant credentials via env vars when going live.
export const esewaConfig = {
  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
  gatewayUrl: process.env.ESEWA_GATEWAY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  statusCheckUrl: process.env.ESEWA_STATUS_CHECK_URL || "https://rc.esewa.com.np/api/epay/transaction/status/",
  successUrl: `${frontendUrl}/payment/success`,
  failureUrl: `${frontendUrl}/payment/failure`,
};

export { default as Database } from "./database";