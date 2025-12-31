// routes/promoCodeRoutes.js
import express from "express";
import { validatePromoCode, getAllPromoCodes, createPromoCode } from "../controllers/promoCodeController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route - validate promo code
router.post("/validate", validatePromoCode);

// Admin routes - manage promo codes
router.get("/", protect, adminOnly, getAllPromoCodes);
router.post("/", protect, adminOnly, createPromoCode);

export default router;
