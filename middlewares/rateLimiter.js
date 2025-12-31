// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 requests per window per IP
  message: "Too many OTP requests, please try again later.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts, please try again later.",
});
