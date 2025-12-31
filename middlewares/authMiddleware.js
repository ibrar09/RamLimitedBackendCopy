// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { User, Session } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// -------------------- Protect Middleware -------------------- //
// Verifies access token and attaches user to request
export const protect = async (req, res, next) => {
  try {
    // Helpful debug logs (comment out in production)
    // console.log("AUTH HEADER:", req.headers.authorization);
    // console.log("COOKIES:", req.cookies);

    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === "string") {
      const parts = authHeader.split(" ");
      token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : authHeader;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Token is invalid or malformed" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // If your user uses 'status' (string) or 'verified' (boolean), this covers both:
    if (user.status && typeof user.status === "string" && user.status !== "active") {
      return res.status(403).json({ message: "Account not active" });
    }
    if (typeof user.verified === "boolean" && user.verified === false) {
      // allow certain flows by skipping? For now block if not verified
      return res.status(403).json({ message: "Account not verified" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider || "local",
    };

    return next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

// -------------------- Refresh Token Middleware -------------------- //
// Verifies refresh token and session (used when refreshing)
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    // Verify JWT refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      console.error("Refresh token verify failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Check if session exists and is valid
    const session = await Session.findOne({
      where: { user_id: decoded.id, refresh_token: refreshToken, valid: true },
    });
    if (!session) return res.status(401).json({ message: "Invalid or expired session" });

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider || "local",
    };

    next();
  } catch (error) {
    console.error("Refresh token middleware error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// -------------------- Admin Middleware -------------------- //
// Protects admin-only routes
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};
