import rateLimit from "express-rate-limit";

// Strict limiter for login/signup, prevents brute-force and spam registration
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 attempts per window per IP
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for the public contact form, it needs no authentication, so it
// would otherwise be an easy spam vector into the admin inbox.
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 messages per window per IP
  message: {
    success: false,
    message: "Too many messages sent. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});