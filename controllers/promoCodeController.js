// controllers/promoCodeController.js
import { PromoCode } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Validate a promo code
 * @route POST /api/v1/promo-codes/validate
 */
export const validatePromoCode = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Promo code is required",
            });
        }

        // Find the promo code
        const promoCode = await PromoCode.findOne({
            where: {
                code: code.toUpperCase(),
                is_active: true,
                valid_from: { [Op.lte]: new Date() },
                valid_until: { [Op.gte]: new Date() },
            },
        });

        if (!promoCode) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired promo code",
            });
        }

        // Check usage limit
        if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
            return res.status(400).json({
                success: false,
                message: "This promo code has reached its usage limit",
            });
        }

        // Check minimum purchase
        if (subtotal < promoCode.min_purchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase of ${promoCode.min_purchase} SAR required`,
            });
        }

        // Calculate discount
        let discount = 0;
        if (promoCode.discount_type === "percentage") {
            discount = (subtotal * promoCode.discount_value) / 100;
            // Apply max discount if set
            if (promoCode.max_discount && discount > promoCode.max_discount) {
                discount = parseFloat(promoCode.max_discount);
            }
        } else {
            // Fixed discount
            discount = parseFloat(promoCode.discount_value);
        }

        res.status(200).json({
            success: true,
            data: {
                code: promoCode.code,
                discount_type: promoCode.discount_type,
                discount_value: promoCode.discount_value,
                discount_amount: discount.toFixed(2),
                description: promoCode.description,
            },
        });
    } catch (error) {
        console.error("Validate promo code error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to validate promo code",
            error: error.message,
        });
    }
};

/**
 * Get all active promo codes (admin only)
 * @route GET /api/v1/promo-codes
 */
export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.findAll({
            order: [["created_at", "DESC"]],
        });

        res.status(200).json({
            success: true,
            data: promoCodes,
        });
    } catch (error) {
        console.error("Get promo codes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch promo codes",
            error: error.message,
        });
    }
};

/**
 * Create a new promo code (admin only)
 * @route POST /api/v1/promo-codes
 */
export const createPromoCode = async (req, res) => {
    try {
        const {
            code,
            discount_type,
            discount_value,
            min_purchase,
            max_discount,
            usage_limit,
            valid_from,
            valid_until,
            description,
        } = req.body;

        const promoCode = await PromoCode.create({
            code: code.toUpperCase(),
            discount_type,
            discount_value,
            min_purchase: min_purchase || 0,
            max_discount,
            usage_limit,
            valid_from,
            valid_until,
            description,
        });

        res.status(201).json({
            success: true,
            data: promoCode,
            message: "Promo code created successfully",
        });
    } catch (error) {
        console.error("Create promo code error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create promo code",
            error: error.message,
        });
    }
};
