// routes/couponRoutes.js
/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: API endpoints for managing coupons
 *
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount_type
 *               - discount_value
 *               - start_date
 *               - end_date
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *               discount_value:
 *                 type: number
 *               min_order_amount:
 *                 type: number
 *               max_discount_amount:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               usage_limit:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Coupon created
 *
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of coupons
 *
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon details
 *
 *   put:
 *     summary: Update coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Coupon updated
 *
 *   delete:
 *     summary: Delete coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon deleted
 */

import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
